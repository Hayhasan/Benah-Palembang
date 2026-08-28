import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { getCurrentUser } from "@/modules/auth/data/session-dal"

import type { PublicArticlePageData } from "../types/public-article"
import {
  mapPublicArticleCard,
  mapPublicArticleDetail,
  publicArticleCardSelect,
  publicArticleDetailSelect,
} from "./article.mapper"

export async function getPublicArticle(
  slug: string,
): Promise<PublicArticlePageData | null> {
  await connection()
  const currentUser = await getCurrentUser()

  const article = await prisma.article.findFirst({
    where: {
      slug,
      status: "PUBLISHED",
      publishedAt: { not: null },
      deletedAt: null,
      websiteArticleSection: {
        deletedAt: null,
        websiteContent: { key: "home", deletedAt: null },
      },
    },
    select: publicArticleDetailSelect,
  })

  if (!article) return null

  const relatedArticles = await prisma.article.findMany({
    where: {
      id: { not: article.id },
      websiteArticleSectionId: article.websiteArticleSectionId,
      status: "PUBLISHED",
      publishedAt: { not: null },
      deletedAt: null,
    },
    orderBy: [
      { isFeatured: "desc" },
      { publishedAt: "desc" },
      { id: "desc" },
    ],
    take: 3,
    select: publicArticleCardSelect,
  })

  return {
    article: mapPublicArticleDetail(article, currentUser?.id),
    relatedArticles: relatedArticles.map(mapPublicArticleCard),
  }
}
