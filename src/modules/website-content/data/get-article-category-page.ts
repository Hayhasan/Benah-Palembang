import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import {
  DEFAULT_ARTICLE_CATEGORY_PAGES,
  getDefaultArticleCategoryPage,
} from "../constants/default-article-category-pages"
import { DEFAULT_LANDING_PAGE } from "../constants/default-landing-page"
import type { ArticleCategoryPageData } from "../types/article-category-page"

export async function getArticleCategoryPage(
  categorySlug: string,
): Promise<ArticleCategoryPageData | null> {
  await connection()

  const content = await prisma.websiteContent.findFirst({
    where: { key: DEFAULT_LANDING_PAGE.key, deletedAt: null },
    select: {
      articleSections: {
        where: { articleCategorySlug: categorySlug, deletedAt: null },
        take: 1,
        select: {
          sectionKey: true,
          articleCategorySlug: true,
          heroSlides: {
            where: { deletedAt: null, isVisible: true },
            orderBy: { position: "asc" },
            select: {
              id: true,
              imageUrl: true,
              imageAlt: true,
              label: true,
              title: true,
              description: true,
              photographerName: true,
              position: true,
              isVisible: true,
            },
          },
        },
      },
    },
  })

  if (!content) {
    return (
      DEFAULT_ARTICLE_CATEGORY_PAGES.find(
        (category) => category.slug === categorySlug,
      ) ?? null
    )
  }

  const section = content.articleSections[0]
  if (!section) return null

  const category = getDefaultArticleCategoryPage(section.sectionKey)
  if (!category) return null

  return {
    sectionKey: section.sectionKey,
    slug: section.articleCategorySlug,
    category: category.category,
    heroSlides:
      section.heroSlides.length > 0
        ? section.heroSlides
        : category.heroSlides,
  }
}
