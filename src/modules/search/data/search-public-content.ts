import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { getCollaborationPage } from "@/modules/website-content/data/get-collaboration-page"

import type {
  SearchArticleItem,
  SearchCollaborationItem,
  SearchEventItem,
  SearchResults,
} from "../types/search"

const TIME_ZONE = "Asia/Jakarta"

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: TIME_ZONE,
})

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  timeZone: TIME_ZONE,
})

export async function searchPublicContent(
  rawQuery: string,
  limitPerCategory = 12,
): Promise<SearchResults> {
  await connection()

  const query = rawQuery.trim()
  if (!query) {
    return {
      query: "",
      articles: [],
      events: [],
      collaborations: [],
      totalCount: 0,
    }
  }

  // 1. Search Articles
  const articlesPromise = prisma.article.findMany({
    where: {
      status: "PUBLISHED",
      publishedAt: { not: null },
      deletedAt: null,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { excerpt: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        {
          websiteArticleSection: {
            title: { contains: query, mode: "insensitive" },
          },
        },
        {
          websiteArticleSection: {
            categoryHeroTitle: { contains: query, mode: "insensitive" },
          },
        },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      excerpt: true,
      coverImageUrl: true,
      readingTime: true,
      views: true,
      publishedAt: true,
      websiteArticleSection: {
        select: {
          title: true,
          articleCategorySlug: true,
          categoryHeroTitle: true,
        },
      },
    },
    orderBy: { publishedAt: "desc" },
    take: limitPerCategory,
  })

  // 2. Search Events
  const eventsPromise = prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
      OR: [
        { title: { contains: query, mode: "insensitive" } },
        { description: { contains: query, mode: "insensitive" } },
        { content: { contains: query, mode: "insensitive" } },
        { location: { contains: query, mode: "insensitive" } },
        { category: { contains: query, mode: "insensitive" } },
        { organizer: { contains: query, mode: "insensitive" } },
      ],
    },
    select: {
      id: true,
      slug: true,
      title: true,
      description: true,
      bannerUrl: true,
      category: true,
      startsAt: true,
      endsAt: true,
      location: true,
      views: true,
    },
    orderBy: { startsAt: "desc" },
    take: limitPerCategory,
  })

  // 3. Search Collaboration
  const collaborationPromise = getCollaborationPage()

  const [rawArticles, rawEvents, collaborationData] = await Promise.all([
    articlesPromise,
    eventsPromise,
    collaborationPromise,
  ])

  // Map Articles
  const articles: SearchArticleItem[] = rawArticles.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    excerpt: item.excerpt,
    coverImageUrl: item.coverImageUrl,
    category:
      item.websiteArticleSection?.categoryHeroTitle ||
      item.websiteArticleSection?.title ||
      "Artikel",
    categorySlug:
      item.websiteArticleSection?.articleCategorySlug || "cerita-warga",
    publishedAtLabel: item.publishedAt
      ? dateFormatter.format(item.publishedAt)
      : "",
    readingTime: item.readingTime,
    views: item.views,
  }))

  // Map Events
  const events: SearchEventItem[] = rawEvents.map((item) => ({
    id: item.id,
    slug: item.slug,
    title: item.title,
    description: item.description,
    bannerUrl: item.bannerUrl,
    category: item.category,
    dateLabel: dateFormatter.format(item.startsAt),
    timeLabel: `${timeFormatter.format(item.startsAt)} WIB`,
    location: item.location,
    views: item.views,
  }))

  // Filter and Map Collaborations
  const lowerQuery = query.toLowerCase()
  const collaborations: SearchCollaborationItem[] = collaborationData.partnerContents
    .filter((item) => {
      const title = item.preview?.title || ""
      const platform = item.platform || ""
      const url = item.contentUrl || ""
      return (
        title.toLowerCase().includes(lowerQuery) ||
        platform.toLowerCase().includes(lowerQuery) ||
        url.toLowerCase().includes(lowerQuery)
      )
    })
    .slice(0, limitPerCategory)
    .map((item, index) => ({
      id: index + 1,
      title: item.preview?.title || `Konten Kolaborasi ${item.platform}`,
      platform: item.platform,
      contentUrl: item.contentUrl,
      thumbnailUrl: item.preview?.thumbnailUrl || null,
      aspectRatio: item.preview?.aspectRatio || "VIDEO",
    }))

  const totalCount = articles.length + events.length + collaborations.length

  return {
    query,
    articles,
    events,
    collaborations,
    totalCount,
  }
}
