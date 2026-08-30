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

  const pins = await prisma.websiteArticleSectionPin.findMany({
    where: {
      websiteArticleSection: {
        deletedAt: null,
        isVisible: true,
        websiteContent: { key: "home", deletedAt: null },
      },
      article: {
        status: "PUBLISHED",
        publishedAt: { not: null },
        deletedAt: null,
      },
    },
    orderBy: [
      { websiteArticleSection: { position: "asc" } },
      { position: "asc" },
    ],
    select: {
      websiteArticleSection: { select: { sectionKey: true } },
      article: { select: publicArticleCardSelect },
    },
  })

  return pins.reduce<LandingArticlesBySection>((grouped, pin) => {
    const item = mapPublicArticleCard(pin.article)
    if (item.sectionKey !== pin.websiteArticleSection.sectionKey) return grouped

    const sectionArticles = grouped[item.sectionKey] ?? []
    sectionArticles.push(item)
    grouped[item.sectionKey] = sectionArticles
    return grouped
  }, {})
}
