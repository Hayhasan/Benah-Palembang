import "server-only"

import type { Prisma } from "@prisma/client"
import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { articleListQuerySchema } from "../schemas/article.schema"
import type { OwnedArticleList } from "../types/article"
import {
  mapOwnedArticleListItem,
  ownedArticleListSelect,
} from "./owned-article.mapper"

const ARTICLE_PAGE_SIZE = 25

export async function getOwnedArticles(input: {
  q?: string
  page?: number | string
}): Promise<OwnedArticleList> {
  const actor = await requireCurrentUser()
  await connection()

  const query = articleListQuerySchema.parse(input)
  const where: Prisma.ArticleWhereInput = {
    authorId: actor.id,
    deletedAt: null,
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: "insensitive" } },
            { excerpt: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  return prisma.$transaction(async (transaction) => {
    const totalItems = await transaction.article.count({ where })
    const totalPages = Math.ceil(totalItems / ARTICLE_PAGE_SIZE)
    const page = totalPages === 0 ? 1 : Math.min(query.page, totalPages)
    const articles = await transaction.article.findMany({
      where,
      select: ownedArticleListSelect,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * ARTICLE_PAGE_SIZE,
      take: ARTICLE_PAGE_SIZE,
    })

    return {
      items: articles.map(mapOwnedArticleListItem),
      page,
      pageSize: ARTICLE_PAGE_SIZE,
      totalItems,
      totalPages,
      query: query.q,
    }
  })
}
