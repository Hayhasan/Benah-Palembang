import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import type { PublicArticleCardData } from "../types/public-article"
import {
  mapPublicArticleCard,
  publicArticleCardSelect,
} from "./article.mapper"

export async function getPublicArticlesByCategory(
  categorySlug: string,
): Promise<PublicArticleCardData[]> {
  await connection()

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null },
      deletedAt: null,
      websiteArticleSection: {
        articleCategorySlug: categorySlug,
        deletedAt: null,
        websiteContent: { key: "home", deletedAt: null },
      },
    },
    orderBy: [
      { isFeatured: "desc" },
      { publishedAt: "desc" },
      { id: "desc" },
    ],
    select: publicArticleCardSelect,
  })

  return articles.map(mapPublicArticleCard)
}
