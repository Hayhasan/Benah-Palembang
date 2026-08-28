"use server"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireRole } from "@/modules/auth/data/session-dal"

import { moderationPayloadSchema } from "../schemas/manage-content.schema"
import type { ManageContentActionResult } from "../types/managed-content"
import { revalidateManagedContentRoutes } from "./revalidate-managed-content"

export async function takedownContentAction(
  input: unknown,
): Promise<ManageContentActionResult> {
  const actor = await requireRole(["ADMIN", "SUPERADMIN"])

  const parsed = moderationPayloadSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Payload tidak valid.",
    }
  }

  const { type, id, note } = parsed.data

  try {
    if (type === "ARTICLE") {
      const result = await prisma.$transaction(async (tx) => {
        const article = await tx.article.findFirst({
          where: { id, deletedAt: null },
        })

        if (!article) return { kind: "not-found" as const }
        if (article.status !== "PUBLISHED") {
          return { kind: "invalid-status" as const, status: article.status }
        }

        const updated = await tx.article.update({
          where: { id: article.id },
          data: {
            status: "TAKEN_DOWN",
            moderationNote: note ?? null,
          },
        })

        await recordActivityLog(
          {
            userId: actor.id,
            userName: actor.name,
            userRole: actor.role,
            action: "TAKEDOWN",
            module: "CONTENT",
            description: `Menurunkan artikel '${updated.title}'`,
            beforeState: { status: "Posted", note: article.moderationNote },
            afterState: { status: "Takedown", note: note ?? null },
          },
          tx,
        )

        return { kind: "ok" as const, article: updated }
      })

      if (result.kind === "not-found") {
        return { success: false, message: "Artikel tidak ditemukan." }
      }

      if (result.kind === "invalid-status") {
        return {
          success: false,
          message: `Artikel tidak dapat di-takedown karena berstatus ${result.status}.`,
        }
      }

      revalidateManagedContentRoutes("ARTICLE", result.article.slug)

      return {
        success: true,
        message: `Artikel "${result.article.title}" berhasil di-takedown!`,
      }
    } else {
      const result = await prisma.$transaction(async (tx) => {
        const event = await tx.event.findFirst({
          where: { id, deletedAt: null },
        })

        if (!event) return { kind: "not-found" as const }
        if (event.status !== "PUBLISHED") {
          return { kind: "invalid-status" as const, status: event.status }
        }

        const updated = await tx.event.update({
          where: { id: event.id },
          data: {
            status: "TAKEN_DOWN",
            moderationNote: note ?? null,
          },
        })

        await recordActivityLog(
          {
            userId: actor.id,
            userName: actor.name,
            userRole: actor.role,
            action: "TAKEDOWN",
            module: "CONTENT",
            description: `Menurunkan event '${updated.title}'`,
            beforeState: { status: "Posted", note: event.moderationNote },
            afterState: { status: "Takedown", note: note ?? null },
          },
          tx,
        )

        return { kind: "ok" as const, event: updated }
      })

      if (result.kind === "not-found") {
        return { success: false, message: "Event tidak ditemukan." }
      }

      if (result.kind === "invalid-status") {
        return {
          success: false,
          message: `Event tidak dapat di-takedown karena berstatus ${result.status}.`,
        }
      }

      revalidateManagedContentRoutes("EVENT", result.event.id)

      return {
        success: true,
        message: `Event "${result.event.title}" berhasil di-takedown!`,
      }
    }
  } catch (error) {
    console.error("Failed to takedown content:", error)
    return {
      success: false,
      message: "Terjadi kesalahan saat men-takedown konten.",
    }
  }
}
