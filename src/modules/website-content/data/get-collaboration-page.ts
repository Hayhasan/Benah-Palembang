import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import { DEFAULT_COLLABORATION_PAGE } from "../constants/default-collaboration-page"
import type { CollaborationPageData } from "../types/collaboration-page"
import {
  collaborationPageSelect,
  mapCollaborationContentToPage,
} from "./collaboration-content.mapper"
import { resolveCollaborationContentPreview } from "./resolve-collaboration-content-preview"

export async function getCollaborationPage(): Promise<CollaborationPageData> {
  await connection()

  const content = await prisma.websiteCollaborationContent.findFirst({
    where: {
      key: DEFAULT_COLLABORATION_PAGE.key,
      deletedAt: null,
    },
    select: collaborationPageSelect,
  })

  const page = content
    ? mapCollaborationContentToPage(content)
    : DEFAULT_COLLABORATION_PAGE

  const previews = await Promise.all(
    page.partnerContents.map((item) =>
      resolveCollaborationContentPreview(item),
    ),
  )

  return {
    ...page,
    partnerContents: page.partnerContents.map((item, index) => ({
      ...item,
      preview: previews[index],
    })),
  }
}
