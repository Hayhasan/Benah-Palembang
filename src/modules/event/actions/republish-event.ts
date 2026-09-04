"use server"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { eventIdSchema } from "../schemas/event.schema"
import type { EventActionResult } from "../types/owned-event"
import { revalidateEventRoutes } from "./revalidate-event-routes"

export async function republishEventAction(
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
        select: { id: true, title: true, status: true, publishedAt: true },
      })

      if (!event) return "not-found" as const
      if (event.status !== "ARCHIVED") return "invalid-status" as const

      await transaction.event.update({
        where: { id: event.id },
        data: {
          status: "PUBLISHED",
          publishedAt: event.publishedAt ?? new Date(),
        },
      })

      await recordActivityLog(
        {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action: "RESTORE",
          module: "EVENT",
          description: `Mempublikasikan ulang event arsip '${event.title}'`,
          beforeState: { id: event.id, status: event.status },
          afterState: { id: event.id, status: "PUBLISHED" },
        },
        transaction,
      )

      return "republished" as const
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
        message: "Hanya Event berstatus Arsip yang dapat dipublikasikan ulang.",
      }
    }

    revalidateEventRoutes(id)
    return {
      success: true,
      message: "Event berhasil dipublikasikan ulang tanpa review.",
      id,
      status: "PUBLISHED",
    }
  } catch (error) {
    console.error("Failed to republish Event:", error)
    return {
      success: false,
      message: "Event gagal dipublikasikan ulang. Silakan coba lagi.",
    }
  }
}
