"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { mapProfile, profileSelect } from "../data/profile.mapper"
import { updateProfileSchema } from "../schemas/profile.schema"
import type { ProfileActionResult } from "../types/profile"

export async function updateProfileAction(
  input: unknown,
): Promise<ProfileActionResult> {
  const actor = await requireCurrentUser()
  const parsed = updateProfileSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message:
        parsed.error.issues[0]?.message ?? "Data profil tidak valid.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  try {
    const profile = await prisma.$transaction(async (transaction) => {
      const current = await transaction.user.findFirst({
        where: {
          id: actor.id,
          isBanned: false,
          deletedAt: null,
        },
        select: profileSelect,
      })

      if (!current) return null

      const result = await transaction.user.updateMany({
        where: {
          id: actor.id,
          isBanned: false,
          deletedAt: null,
        },
        data: parsed.data,
      })

      if (result.count === 0) return null

      const updated = await transaction.user.findFirst({
        where: {
          id: actor.id,
          isBanned: false,
          deletedAt: null,
        },
        select: profileSelect,
      })

      if (updated) {
        await recordActivityLog(
          {
            userId: actor.id,
            userName: updated.name,
            userRole: updated.role,
            action: "UPDATE",
            module: "PROFILE",
            description: `Mengubah data personal profil akun '${updated.name}'`,
            beforeState: {
              name: current.name,
              bio: current.bio,
              whatsappNumber: current.whatsappNumber,
            },
            afterState: {
              name: updated.name,
              bio: updated.bio,
              whatsappNumber: updated.whatsappNumber,
            },
          },
          transaction,
        )
      }

      return updated
    })

    if (!profile) {
      return {
        success: false,
        message: "Profil tidak tersedia atau session sudah tidak valid.",
      }
    }

    revalidatePath("/dashboard/profile")

    return {
      success: true,
      message: "Profil berhasil diperbarui.",
      data: mapProfile(profile),
    }
  } catch (error) {
    console.error("Failed to update profile:", error)
    return {
      success: false,
      message: "Profil gagal diperbarui. Silakan coba lagi.",
    }
  }
}
