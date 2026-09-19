import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import type { LandingArticlesBySection } from "../types/public-article"
import { sortArticlesByFairPriority } from "../utils/article-ranking"
import {
  mapPublicArticleCard,
  publicArticleCardSelect,
} from "./article.mapper"

export async function getLandingArticles(): Promise<LandingArticlesBySection> {
  await connection()

  const sections = await prisma.websiteArticleSection.findMany({
    where: {
      deletedAt: null,
      isVisible: true,
      websiteContent: { key: "home", deletedAt: null },
    },
    orderBy: { position: "asc" },
    select: {
      id: true,
      sectionKey: true,
      maxItems: true,
      pins: {
        where: {
          article: {
            status: "PUBLISHED",
            publishedAt: { not: null },
            deletedAt: null,
          },
        },
        orderBy: { position: "asc" },
        select: {
          article: { select: publicArticleCardSelect },
        },
      },
    },
  })

  const grouped: LandingArticlesBySection = {}

  for (const section of sections) {
    const pinnedArticles = section.pins.map((pin) =>
      mapPublicArticleCard(pin.article),
    )
    const pinnedIds = new Set(pinnedArticles.map((a) => a.id))
    const capacity = Math.max(6, section.maxItems || 6)
    const needed = capacity - pinnedArticles.length

    if (needed > 0) {
      const candidateArticles = await prisma.article.findMany({
        where: {
          websiteArticleSectionId: section.id,
          status: "PUBLISHED",
          publishedAt: { not: null },
          deletedAt: null,
          ...(pinnedIds.size > 0
            ? { id: { notIn: Array.from(pinnedIds) } }
            : {}),
        },
        select: publicArticleCardSelect,
      })

      const prioritized = sortArticlesByFairPriority(candidateArticles).slice(
        0,
        needed,
      )
      pinnedArticles.push(...prioritized.map(mapPublicArticleCard))
    }

    grouped[section.sectionKey] = pinnedArticles
  }

  return grouped
}
