import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { DEFAULT_ARTICLE_CATEGORY_PAGES } from "../constants/default-article-category-pages"
import { DEFAULT_LANDING_PAGE } from "../constants/default-landing-page"
import type { ArticleCategoryPagesEditorData } from "../types/article-category-page-editor"

export async function readArticleCategoryPageEditor(): Promise<ArticleCategoryPagesEditorData> {
  const content = await prisma.websiteContent.findFirst({
    where: { key: DEFAULT_LANDING_PAGE.key, deletedAt: null },
    select: {
      articleSections: {
        where: { deletedAt: null },
        orderBy: { position: "asc" },
        select: {
          id: true,
          sectionKey: true,
          categoryHeroImageUrl: true,
          categoryHeroImageAlt: true,
          categoryHeroTitle: true,
          categoryHeroDescription: true,
        },
      },
    },
  })

  const sectionsByKey = new Map(
    content?.articleSections.map((section) => [section.sectionKey, section]) ?? [],
  )

  return {
    key: "home",
    categories: DEFAULT_ARTICLE_CATEGORY_PAGES.map((defaultCategory, index) => {
      const section = sectionsByKey.get(defaultCategory.sectionKey)

      return section
        ? {
            id: section.id,
            clientKey: `article-category-${section.id}`,
            sectionKey: section.sectionKey,
            hero: {
              imageUrl: section.categoryHeroImageUrl,
              imageAlt: section.categoryHeroImageAlt,
              title: section.categoryHeroTitle,
              description: section.categoryHeroDescription,
            },
          }
        : {
            id: null,
            clientKey: `default-article-category-${index + 1}`,
            sectionKey: defaultCategory.sectionKey,
            hero: defaultCategory.hero,
          }
    }),
  }
}

export async function getArticleCategoryPageEditor(): Promise<ArticleCategoryPagesEditorData> {
  await requireRole(["ADMIN", "SUPERADMIN"])
  await connection()
  return readArticleCategoryPageEditor()
}
