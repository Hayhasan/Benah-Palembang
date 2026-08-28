import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import type { ArticleCategoryOption } from "../types/article"

export async function getArticleCategoryOptions(): Promise<
  ArticleCategoryOption[]
> {
  await connection()

  const sections = await prisma.websiteArticleSection.findMany({
    where: {
      deletedAt: null,
      isVisible: true,
      websiteContent: {
        key: "home",
        deletedAt: null,
      },
    },
    orderBy: { position: "asc" },
    select: {
      id: true,
      sectionKey: true,
      articleCategorySlug: true,
      categoryHeroTitle: true,
    },
  })

  return sections.map((section) => ({
    id: section.id,
    sectionKey: section.sectionKey,
    slug: section.articleCategorySlug,
    label: section.categoryHeroTitle,
  }))
}
