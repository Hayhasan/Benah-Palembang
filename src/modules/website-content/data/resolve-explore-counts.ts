import "server-only"

import { prisma } from "@/lib/db/prisma"
import { getPublicEventCount } from "@/modules/event/data/get-public-event-count"

import { DEFAULT_LANDING_PAGE } from "../constants/default-landing-page"
import type {
  LandingExploreItemData,
  LandingExploreItemView,
} from "../types/landing-page"

/**
 * Menyelesaikan angka setiap shortcut Jelajahi dalam jumlah query tetap:
 * satu lookup section, satu groupBy artikel, dan satu count Event. Jumlah item
 * tidak menambah query, sehingga section ini tidak pernah menjadi N+1.
 */
export async function resolveExploreCounts(
  items: LandingExploreItemData[],
): Promise<LandingExploreItemView[]> {
  const sectionKeys = [
    ...new Set(
      items.flatMap((item) =>
        item.countSource === "article-category" && item.countArticleSectionKey
          ? [item.countArticleSectionKey]
          : [],
      ),
    ),
  ]
  const needsEventCount = items.some((item) => item.countSource === "event")

  const [sections, eventCount] = await Promise.all([
    sectionKeys.length > 0
      ? prisma.websiteArticleSection.findMany({
          where: {
            sectionKey: { in: sectionKeys },
            deletedAt: null,
            websiteContent: { key: DEFAULT_LANDING_PAGE.key, deletedAt: null },
          },
          select: { id: true, sectionKey: true },
        })
      : [],
    needsEventCount ? getPublicEventCount() : null,
  ])

  const articleCountBySectionKey = new Map(
    sections.map((section) => [section.sectionKey, 0]),
  )

  if (sections.length > 0) {
    const sectionKeyById = new Map(
      sections.map((section) => [section.id, section.sectionKey]),
    )
    const grouped = await prisma.article.groupBy({
      by: ["websiteArticleSectionId"],
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
        deletedAt: null,
        websiteArticleSectionId: { in: [...sectionKeyById.keys()] },
      },
      _count: { _all: true },
    })

    for (const row of grouped) {
      const sectionKey = sectionKeyById.get(row.websiteArticleSectionId)
      if (sectionKey) {
        articleCountBySectionKey.set(sectionKey, row._count._all)
      }
    }
  }

  return items.map((item) => ({
    ...item,
    count: resolveCount(item, articleCountBySectionKey, eventCount),
  }))
}

function resolveCount(
  item: LandingExploreItemData,
  articleCountBySectionKey: Map<string, number>,
  eventCount: number | null,
): number | null {
  switch (item.countSource) {
    case "manual":
      return item.storyCount
    case "article-category":
      return item.countArticleSectionKey
        ? articleCountBySectionKey.get(item.countArticleSectionKey) ?? null
        : null
    case "event":
      return eventCount
    case "none":
      return null
  }
}
