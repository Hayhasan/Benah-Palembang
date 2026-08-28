import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import type { LandingArticlesBySection } from "../types/public-article"
import {
  mapPublicArticleCard,
  publicArticleCardSelect,
} from "./article.mapper"

export async function getLandingArticles(): Promise<LandingArticlesBySection> {
  await connection()

  const articles = await prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null },
      deletedAt: null,
      websiteArticleSection: {
        deletedAt: null,
        isVisible: true,
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

  return articles.reduce<LandingArticlesBySection>((grouped, article) => {
    const item = mapPublicArticleCard(article)
    const sectionArticles = grouped[item.sectionKey] ?? []
    sectionArticles.push(item)
    grouped[item.sectionKey] = sectionArticles
    return grouped
  }, {})
}
