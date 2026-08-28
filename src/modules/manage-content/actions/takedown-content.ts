"use server"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { moderationPayloadSchema } from "../schemas/manage-content.schema"
import type { ManageContentActionResult } from "../types/managed-content"
import { revalidateManagedContentRoutes } from "./revalidate-managed-content"

export async function takedownContentAction(
  input: unknown,
): Promise<ManageContentActionResult> {
  await requireCurrentUser()

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
      const article = await prisma.article.findFirst({
        where: { id, deletedAt: null },
      })

      if (!article) {
        return { success: false, message: "Artikel tidak ditemukan." }
      }

      if (article.status !== "PUBLISHED") {
        return {
          success: false,
          message: `Artikel tidak dapat di-takedown karena berstatus ${article.status}.`,
        }
      }

      const updated = await prisma.article.update({
        where: { id: article.id },
        data: {
          status: "TAKEN_DOWN",
          moderationNote: note ?? null,
        },
      })

      revalidateManagedContentRoutes("ARTICLE", updated.slug)

      return {
        success: true,
        message: `Artikel "${updated.title}" berhasil di-takedown!`,
      }
    } else {
      const event = await prisma.event.findFirst({
        where: { id, deletedAt: null },
      })

      if (!event) {
        return { success: false, message: "Event tidak ditemukan." }
      }

      if (event.status !== "PUBLISHED") {
        return {
          success: false,
          message: `Event tidak dapat di-takedown karena berstatus ${event.status}.`,
        }
      }

      const updated = await prisma.event.update({
        where: { id: event.id },
        data: {
          status: "TAKEN_DOWN",
          moderationNote: note ?? null,
        },
      })

      revalidateManagedContentRoutes("EVENT", updated.id)

      return {
        success: true,
        message: `Event "${updated.title}" berhasil di-takedown!`,
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
