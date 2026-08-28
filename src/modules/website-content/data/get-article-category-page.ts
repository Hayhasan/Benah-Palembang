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
          categoryHeroImageUrl: true,
          categoryHeroImageAlt: true,
          categoryHeroTitle: true,
          categoryHeroDescription: true,
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
    hero: {
      imageUrl: section.categoryHeroImageUrl,
      imageAlt: section.categoryHeroImageAlt,
      title: section.categoryHeroTitle,
      description: section.categoryHeroDescription,
    },
  }
}
