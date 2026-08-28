import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import type { OwnedArticleEditorData } from "../types/article"
import {
  mapOwnedArticleEditor,
  ownedArticleEditorSelect,
} from "./owned-article.mapper"

export async function getOwnedArticle(
  id: number,
): Promise<OwnedArticleEditorData | null> {
  const actor = await requireCurrentUser()
  await connection()

  const article = await prisma.article.findFirst({
    where: {
      id,
      authorId: actor.id,
      deletedAt: null,
    },
    select: ownedArticleEditorSelect,
  })

  return article ? mapOwnedArticleEditor(article) : null
}
