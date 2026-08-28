"use server"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { eventIdSchema } from "../schemas/event.schema"
import type { EventActionResult } from "../types/owned-event"
import { revalidateEventRoutes } from "./revalidate-event-routes"

export async function postEventAction(
  input: unknown,
): Promise<EventActionResult> {
  const actor = await requireCurrentUser()
  const parsed = eventIdSchema.safeParse(input)

  if (!parsed.success) {
    return { success: false, message: "ID Event tidak valid." }
  }

  const { id } = parsed.data

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const event = await transaction.event.findFirst({
        where: { id, ownerId: actor.id, deletedAt: null },
        select: { status: true },
      })

      if (!event) return "not-found" as const
      if (event.status !== "DRAFT") return "invalid-status" as const

      await transaction.event.update({
        where: { id },
        data: {
          status: "PENDING_REVIEW",
          submittedAt: new Date(),
        },
      })

      return "posted" as const
    })

    if (result === "not-found") {
      return {
        success: false,
        message: "Event tidak ditemukan atau bukan milik account ini.",
      }
    }

    if (result === "invalid-status") {
      return {
        success: false,
        message: "Hanya Event berstatus Draf yang dapat diposting.",
      }
    }

    revalidateEventRoutes(id)
    return {
      success: true,
      message: "Event berhasil diajukan untuk review.",
      id,
      status: "PENDING_REVIEW",
    }
  } catch (error) {
    console.error("Failed to post Event:", error)
    return {
      success: false,
      message: "Event gagal diposting. Silakan coba lagi.",
    }
  }
}
