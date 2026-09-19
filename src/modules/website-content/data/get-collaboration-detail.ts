import "server-only"
import { prisma } from "@/lib/db/prisma"
import { notFound } from "next/navigation"
import type { CollaborationContentEditorData } from "../schemas/collaboration.schema"

export async function getCollaborationDetail(
  id: number,
): Promise<CollaborationContentEditorData> {
  const content = await prisma.websiteCollaborationPartnerContent.findUnique({
    where: { id, deletedAt: null },
  })

  if (!content) {
    notFound()
  }

  // Map database platform to schema platform
  const dbToSchemaPlatform = {
    YOUTUBE: "youtube",
    INSTAGRAM: "instagram",
    TIKTOK: "tiktok",
    FACEBOOK: "facebook",
    X: "x",
  } as const

  return {
    id: content.id,
    title: content.title ?? "",
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    platform: (dbToSchemaPlatform as any)[content.platform] ?? "youtube",
    contentUrl: content.contentUrl,
    isVisible: content.isVisible,
  }
}
