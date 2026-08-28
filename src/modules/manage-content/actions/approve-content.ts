"use server"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { moderationPayloadSchema } from "../schemas/manage-content.schema"
import type { ManageContentActionResult } from "../types/managed-content"
import { revalidateManagedContentRoutes } from "./revalidate-managed-content"

export async function approveContentAction(
  input: unknown,
): Promise<ManageContentActionResult> {
  await requireRole(["ADMIN", "SUPERADMIN"])

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

      if (article.status !== "PENDING_REVIEW") {
        return {
          success: false,
          message: `Artikel tidak dapat disetujui karena berstatus ${article.status}.`,
        }
      }

      const updated = await prisma.article.update({
        where: { id: article.id },
        data: {
          status: "PUBLISHED",
          publishedAt: article.publishedAt ?? new Date(),
          moderationNote: note ?? null,
        },
      })

      revalidateManagedContentRoutes("ARTICLE", updated.slug)

      return {
        success: true,
        message: `Artikel "${updated.title}" berhasil disetujui & diposting!`,
      }
    } else {
      const event = await prisma.event.findFirst({
        where: { id, deletedAt: null },
      })

      if (!event) {
        return { success: false, message: "Event tidak ditemukan." }
      }

      if (event.status !== "PENDING_REVIEW") {
        return {
          success: false,
          message: `Event tidak dapat disetujui karena berstatus ${event.status}.`,
        }
      }

      const updated = await prisma.event.update({
        where: { id: event.id },
        data: {
          status: "PUBLISHED",
          publishedAt: event.publishedAt ?? new Date(),
          moderationNote: note ?? null,
        },
      })

      revalidateManagedContentRoutes("EVENT", updated.id)

      return {
        success: true,
        message: `Event "${updated.title}" berhasil disetujui & diposting!`,
      }
    }
  } catch (error) {
    console.error("Failed to approve content:", error)
    return {
      success: false,
      message: "Terjadi kesalahan saat menyetujui konten.",
    }
  }
}
