import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { recordArticleView } from "@/lib/views/view-tracker"
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

  const incremented = await recordArticleView(article.id, currentUser?.id)
  const articleDetail = mapPublicArticleDetail(article, currentUser?.id)
  if (incremented) {
    articleDetail.views += 1
  }

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
    article: articleDetail,
    relatedArticles: relatedArticles.map(mapPublicArticleCard),
  }
}
