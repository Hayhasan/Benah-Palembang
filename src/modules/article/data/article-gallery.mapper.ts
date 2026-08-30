import "server-only"

import type { Prisma } from "@prisma/client"

import type {
  ArticleGalleryData,
  ArticleGalleryItem,
} from "../types/article-gallery"
import { ownedArticleStatusLabel } from "./owned-article.mapper"

export const ARTICLE_GALLERY_LIMIT = 6

export const articleGalleryWhere = {
  deletedAt: null,
} satisfies Prisma.ArticleWhereInput

export const articleGallerySelect = {
  id: true,
  title: true,
  coverImageUrl: true,
  status: true,
  updatedAt: true,
  views: true,
  _count: {
    select: {
      likes: true,
    },
  },
} satisfies Prisma.ArticleSelect

type ArticleGalleryRecord = Prisma.ArticleGetPayload<{
  select: typeof articleGallerySelect
}>

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  timeZone: "Asia/Jakarta",
  year: "numeric",
})

export function mapArticleGalleryItem(
  article: ArticleGalleryRecord,
): ArticleGalleryItem {
  return {
    id: article.id,
    title: article.title,
    coverImageUrl: article.coverImageUrl,
    status: article.status,
    statusLabel: ownedArticleStatusLabel(article.status),
    updatedAtLabel: dateFormatter.format(article.updatedAt),
    views: article.views,
    likes: article._count.likes,
  }
}

export function mapArticleGallery(
  articles: ArticleGalleryRecord[],
  totalItems: number,
): ArticleGalleryData {
  return {
    items: articles.map(mapArticleGalleryItem),
    totalItems,
  }
}
