"use server"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { eventIdSchema } from "../schemas/event.schema"
import type { EventActionResult } from "../types/owned-event"
import { revalidateEventRoutes } from "./revalidate-event-routes"

function deletionTimestamp(date: Date) {
  return date
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14)
}

function deletedSlug(slug: string, id: number, date: Date) {
  const suffix = `-deleted-${deletionTimestamp(date)}-${id}`
  const base = slug.slice(0, 180 - suffix.length).replace(/-+$/g, "")
  return `${base || "event"}${suffix}`
}

export async function archiveEventAction(
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
        select: { id: true, slug: true, originalSlug: true, status: true },
      })

      if (!event) return "not-found" as const
      if (event.status !== "PUBLISHED") return "invalid-status" as const

      const now = new Date()
      await transaction.eventTag.updateMany({
        where: { eventId: event.id, deletedAt: null },
        data: { deletedAt: now },
      })
      await transaction.event.update({
        where: { id: event.id },
        data: {
          originalSlug: event.originalSlug ?? event.slug,
          slug: deletedSlug(event.originalSlug ?? event.slug, event.id, now),
          deletedAt: now,
        },
      })

      await recordActivityLog(
        {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action: "DELETE",
          module: "EVENT",
          description: `Mengarsipkan event '${event.slug}'`,
          beforeState: { id: event.id, status: event.status, active: true },
          afterState: { active: false, deletedAt: now.toISOString() },
        },
        transaction,
      )

      return "archived" as const
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
        message: "Hanya Event yang sudah Post yang dapat diarsipkan.",
      }
    }

    revalidateEventRoutes(id)
    return {
      success: true,
      message: "Event berhasil diarsipkan.",
      id,
      status: "PUBLISHED",
    }
  } catch (error) {
    console.error("Failed to archive Event:", error)
    return {
      success: false,
      message: "Event gagal diarsipkan. Silakan coba lagi.",
    }
  }
}
