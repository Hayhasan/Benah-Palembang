"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
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
      const result = await transaction.user.updateMany({
        where: {
          id: actor.id,
          isBanned: false,
          deletedAt: null,
        },
        data: parsed.data,
      })

      if (result.count === 0) return null

      return transaction.user.findFirst({
        where: {
          id: actor.id,
          isBanned: false,
          deletedAt: null,
        },
        select: profileSelect,
      })
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
