import "server-only"
import { prisma } from "@/lib/db/prisma"
import type { CollaborationContentListItem } from "../types/collaboration"

export async function getCollaborationList(): Promise<CollaborationContentListItem[]> {
  const contents = await prisma.websiteCollaborationPartnerContent.findMany({
    where: { deletedAt: null },
    orderBy: [{ position: "asc" }, { createdAt: "desc" }],
  })

  return contents.map((content) => ({
    id: content.id,
    title: content.title,
    platform: content.platform,
    contentUrl: content.contentUrl,
    isVisible: content.isVisible,
    createdAt: content.createdAt.toISOString(),
    updatedAt: content.updatedAt.toISOString(),
  }))
}
