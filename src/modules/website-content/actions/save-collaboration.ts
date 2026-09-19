"use server"

import { revalidatePath } from "next/cache"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/modules/auth/data/session-dal"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import {
  collaborationContentEditorSchema,
  type CollaborationContentEditorData,
} from "../schemas/collaboration.schema"

export async function saveCollaboration(
  data: CollaborationContentEditorData,
): Promise<{ success: boolean; message: string; field?: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || user.role === "USER") {
      return { success: false, message: "Akses ditolak" }
    }

    const parsed = collaborationContentEditorSchema.safeParse(data)
    if (!parsed.success) {
      const error = parsed.error.issues[0]
      return {
        success: false,
        message: error.message,
        field: error.path.join("."),
      }
    }

    const { id, title, platform, contentUrl, isVisible } = parsed.data

    const schemaToDbPlatform = {
      youtube: "YOUTUBE",
      instagram: "INSTAGRAM",
      tiktok: "TIKTOK",
      facebook: "FACEBOOK",
      x: "X",
    } as const

    const dbPlatform = schemaToDbPlatform[platform]

    // We need the WebsiteCollaborationContent ID to link it to
    const defaultPage = await prisma.websiteCollaborationContent.findUnique({
      where: { key: "DEFAULT_COLLABORATION_PAGE" },
    })

    if (!defaultPage) {
      return { success: false, message: "Halaman Kolaborasi Utama tidak ditemukan di sistem." }
    }

    if (id) {
      // Update existing
      const existing = await prisma.websiteCollaborationPartnerContent.findUnique({
        where: { id, deletedAt: null },
      })

      if (!existing) {
        return { success: false, message: "Konten tidak ditemukan" }
      }

      const updated = await prisma.websiteCollaborationPartnerContent.update({
        where: { id },
        data: {
          title,
          platform: dbPlatform,
          contentUrl,
          isVisible,
        },
      })

      await recordActivityLog({
        module: "WEBSITE",
        action: "UPDATE",
        description: `Mengubah partner content platform ${dbPlatform}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        beforeState: existing as unknown as Record<string, unknown>,
        afterState: updated as unknown as Record<string, unknown>,
      })
    } else {
      // Create new
      // Determine position by getting max position
      const lastItem = await prisma.websiteCollaborationPartnerContent.findFirst({
        where: { collaborationContentId: defaultPage.id, deletedAt: null },
        orderBy: { position: "desc" },
      })
      const nextPosition = (lastItem?.position || 0) + 1

      const created = await prisma.websiteCollaborationPartnerContent.create({
        data: {
          collaborationContentId: defaultPage.id,
          title,
          platform: dbPlatform,
          contentUrl,
          position: nextPosition,
          isVisible,
        },
      })

      await recordActivityLog({
        module: "WEBSITE",
        action: "CREATE",
        description: `Menambahkan partner content platform ${dbPlatform}`,
        userId: user.id,
        userName: user.name,
        userRole: user.role,
        afterState: created as unknown as Record<string, unknown>,
      })
    }

  } catch (error) {
    console.error("[SAVE_COLLABORATION]", error)
    return { success: false, message: "Terjadi kesalahan internal" }
  }

  revalidatePath("/dashboard/collaboration")
  revalidatePath("/kolaborasi")
  redirect("/dashboard/collaboration")
}
