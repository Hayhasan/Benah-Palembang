"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { toggleEventLikeSchema } from "../schemas/event-like.schema"

export interface ToggleEventLikeResult {
  success: boolean
  message: string
  hasLiked?: boolean
  likesCount?: number
}

export async function toggleEventLikeAction(
  input: unknown,
): Promise<ToggleEventLikeResult> {
  const actor = await requireCurrentUser()
  const parsed = toggleEventLikeSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "ID Event tidak valid.",
    }
  }

  const { eventId } = parsed.data

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        status: "PUBLISHED",
        publishedAt: { not: null },
        deletedAt: null,
      },
      select: { id: true },
    })

    if (!event) {
      return {
        success: false,
        message: "Event tidak ditemukan atau belum dipublikasikan.",
      }
    }

    const existingLike = await prisma.eventLike.findUnique({
      where: {
        eventId_userId: {
          eventId: event.id,
          userId: actor.id,
        },
      },
    })

    let hasLiked = false
    if (existingLike) {
      await prisma.eventLike.delete({
        where: { id: existingLike.id },
      })
      hasLiked = false
    } else {
      await prisma.eventLike.create({
        data: {
          eventId: event.id,
          userId: actor.id,
        },
      })
      hasLiked = true
    }

    const likesCount = await prisma.eventLike.count({
      where: { eventId: event.id },
    })

    revalidatePath(`/agenda/${event.id}`)
    revalidatePath("/dashboard/content/event")
    revalidatePath("/dashboard/create-event")

    return {
      success: true,
      message: hasLiked ? "Berhasil menyukai acara." : "Batal menyukai acara.",
      hasLiked,
      likesCount,
    }
  } catch (error) {
    console.error("Failed to toggle event like:", error)
    return {
      success: false,
      message: "Terjadi kesalahan saat memproses suka acara.",
    }
  }
}
