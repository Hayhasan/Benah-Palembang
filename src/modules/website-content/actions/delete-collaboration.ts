"use server"

import { revalidatePath } from "next/cache"
import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/modules/auth/data/session-dal"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"

export async function deleteCollaboration(
  id: number,
): Promise<{ success: boolean; message: string }> {
  try {
    const user = await getCurrentUser()
    if (!user || user.role === "USER") {
      return { success: false, message: "Akses ditolak" }
    }

    const existing = await prisma.websiteCollaborationPartnerContent.findUnique({
      where: { id, deletedAt: null },
    })

    if (!existing) {
      return { success: false, message: "Konten partner tidak ditemukan" }
    }

    await prisma.websiteCollaborationPartnerContent.update({
      where: { id },
      data: {
        deletedAt: new Date(),
      },
    })

    await recordActivityLog({
      module: "WEBSITE",
      action: "DELETE",
      description: `Menghapus partner content platform ${existing.platform}`,
      userId: user.id,
      userName: user.name,
      userRole: user.role,
      beforeState: existing as unknown as Record<string, unknown>,
    })

    revalidatePath("/dashboard/collaboration")
    revalidatePath("/kolaborasi")

    return { success: true, message: "Konten partner berhasil dihapus" }
  } catch (error) {
    console.error("[DELETE_COLLABORATION]", error)
    return { success: false, message: "Terjadi kesalahan internal" }
  }
}
