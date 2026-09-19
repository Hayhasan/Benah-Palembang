import type { MetadataRoute } from "next"

import { prisma } from "@/lib/db/prisma"
import { absoluteUrl } from "@/lib/seo/config"
import { DEFAULT_ARTICLE_CATEGORY_PAGES } from "@/modules/website-content/constants/default-article-category-pages"

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date()

  // 1. Static Core Pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: absoluteUrl("/"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: absoluteUrl("/agenda"),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    },
    {
      url: absoluteUrl("/kolaborasi"),
      lastModified: now,
      changeFrequency: "monthly",
      priority: 0.6,
    },
  ]

  // 2. Article Categories
  let categoryPages: MetadataRoute.Sitemap = []
  try {
    const sections = await prisma.websiteArticleSection.findMany({
      where: {
        deletedAt: null,
        isVisible: true,
        websiteContent: { key: "home", deletedAt: null },
      },
      select: {
        articleCategorySlug: true,
        updatedAt: true,
      },
    })

    if (sections.length > 0) {
      categoryPages = sections.map((section) => ({
        url: absoluteUrl(`/${section.articleCategorySlug}`),
        lastModified: section.updatedAt || now,
        changeFrequency: "daily",
        priority: 0.8,
      }))
    } else {
      categoryPages = DEFAULT_ARTICLE_CATEGORY_PAGES.map((category) => ({
        url: absoluteUrl(`/${category.slug}`),
        lastModified: now,
        changeFrequency: "daily",
        priority: 0.8,
      }))
    }
  } catch {
    categoryPages = DEFAULT_ARTICLE_CATEGORY_PAGES.map((category) => ({
      url: absoluteUrl(`/${category.slug}`),
      lastModified: now,
      changeFrequency: "daily",
      priority: 0.8,
    }))
  }

  // 3. Published Articles
  let articlePages: MetadataRoute.Sitemap = []
  try {
    const articles = await prisma.article.findMany({
      where: {
        status: "PUBLISHED",
        publishedAt: { not: null },
        deletedAt: null,
      },
      select: {
        slug: true,
        updatedAt: true,
        publishedAt: true,
      },
      orderBy: { publishedAt: "desc" },
    })

    articlePages = articles.map((article) => ({
      url: absoluteUrl(`/artikel/${article.slug}`),
      lastModified: article.updatedAt || article.publishedAt || now,
      changeFrequency: "weekly",
      priority: 0.9,
    }))
  } catch {
    articlePages = []
  }

  // 4. Published Events / Agenda
  let eventPages: MetadataRoute.Sitemap = []
  try {
    const events = await prisma.event.findMany({
      where: {
        status: "PUBLISHED",
        deletedAt: null,
      },
      select: {
        id: true,
        updatedAt: true,
      },
      orderBy: { startsAt: "desc" },
    })

    eventPages = events.map((event) => ({
      url: absoluteUrl(`/agenda/${event.id}`),
      lastModified: event.updatedAt || now,
      changeFrequency: "weekly",
      priority: 0.7,
    }))
  } catch {
    eventPages = []
  }

  // 5. Active Authors with published articles
  let authorPages: MetadataRoute.Sitemap = []
  try {
    const authors = await prisma.user.findMany({
      where: {
        isBanned: false,
        deletedAt: null,
        authoredArticles: {
          some: {
            status: "PUBLISHED",
            deletedAt: null,
          },
        },
      },
      select: {
        username: true,
        updatedAt: true,
      },
    })

    authorPages = authors.map((author) => ({
      url: absoluteUrl(`/penulis/${author.username}`),
      lastModified: author.updatedAt || now,
      changeFrequency: "monthly",
      priority: 0.5,
    }))
  } catch {
    authorPages = []
  }

  return [
    ...staticPages,
    ...categoryPages,
    ...articlePages,
    ...eventPages,
  ]
}
