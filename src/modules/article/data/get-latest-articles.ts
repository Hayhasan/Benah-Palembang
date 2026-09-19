import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import type { PublicArticleCardData } from "../types/public-article"
import {
  mapPublicArticleCard,
  publicArticleCardSelect,
} from "./article.mapper"

export async function getLatestArticles(limit = 6): Promise<PublicArticleCardData[]> {
  await connection()

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null },
      deletedAt: null,
    },
    orderBy: { publishedAt: "desc" },
    take: limit,
    select: publicArticleCardSelect,
  })

  return articles.map(mapPublicArticleCard)
}
