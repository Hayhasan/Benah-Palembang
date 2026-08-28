import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import {
  mapOwnedArticleEditor,
  ownedArticleEditorSelect,
} from "@/modules/article/data/owned-article.mapper"
import type { OwnedArticleEditorData } from "@/modules/article/types/article"
import { requireRole } from "@/modules/auth/data/session-dal"

export async function getManagedArticle(
  id: number,
): Promise<OwnedArticleEditorData | null> {
  await connection()
  await requireRole(["ADMIN", "SUPERADMIN"])

  const article = await prisma.article.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: ownedArticleEditorSelect,
  })

  if (!article) return null

  return mapOwnedArticleEditor(article)
}
