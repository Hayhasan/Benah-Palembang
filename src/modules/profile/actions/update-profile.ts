"use server"

import { Prisma } from "@prisma/client"
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
    const result = await prisma.$transaction(async (transaction) => {
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
              username: current.username,
              bio: current.bio,
              whatsappNumber: current.whatsappNumber,
            },
            afterState: {
              name: updated.name,
              username: updated.username,
              bio: updated.bio,
              whatsappNumber: updated.whatsappNumber,
            },
          },
          transaction,
        )
      }

      return updated
        ? { profile: updated, previousUsername: current.username }
        : null
    })

    if (!result) {
      return {
        success: false,
        message: "Profil tidak tersedia atau session sudah tidak valid.",
      }
    }

    revalidatePath("/dashboard/profile")
    revalidatePath(`/penulis/${result.previousUsername}`)
    revalidatePath(`/penulis/${result.profile.username}`)

    return {
      success: true,
      message: "Profil berhasil diperbarui.",
      data: mapProfile(result.profile),
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Username sudah digunakan oleh pengguna lain.",
        fieldErrors: { username: ["Username sudah digunakan."] },
      }
    }

    console.error("Failed to update profile:", error)
    return {
      success: false,
      message: "Profil gagal diperbarui. Silakan coba lagi.",
    }
  }
}
