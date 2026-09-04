"use server"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { isDeletableEventStatus } from "../constants/event-status"
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

export async function softDeleteEventAction(
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
        select: {
          id: true,
          title: true,
          slug: true,
          originalSlug: true,
          status: true,
        },
      })

      if (!event) return { kind: "not-found" as const }
      if (!isDeletableEventStatus(event.status)) {
        return { kind: "invalid-status" as const }
      }

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
          description: `Menghapus event '${event.title}'`,
          beforeState: {
            id: event.id,
            status: event.status,
            deletedAt: null,
          },
          afterState: {
            id: event.id,
            status: event.status,
            deletedAt: now.toISOString(),
          },
        },
        transaction,
      )

      return { kind: "deleted" as const, status: event.status }
    })

    if (result.kind === "not-found") {
      return {
        success: false,
        message: "Event tidak ditemukan atau bukan milik account ini.",
      }
    }

    if (result.kind === "invalid-status") {
      return {
        success: false,
        message:
          "Hanya Event berstatus Draf, Rejected, atau Arsip yang dapat dihapus.",
      }
    }

    revalidateEventRoutes(id)
    return {
      success: true,
      message: "Event berhasil dihapus.",
      id,
      status: result.status,
    }
  } catch (error) {
    console.error("Failed to delete Event:", error)
    return {
      success: false,
      message: "Event gagal dihapus. Silakan coba lagi.",
    }
  }
}
