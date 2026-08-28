import "server-only"

import type { ContentStatus, Prisma } from "@prisma/client"

import type {
  OwnedArticleEditorData,
  OwnedArticleListItem,
} from "../types/article"

const ARTICLE_TIME_ZONE = "Asia/Jakarta"
const DEFAULT_AUTHOR_AVATAR =
  "https://images.pexels.com/photos/14795560/pexels-photo-14795560.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"

const listDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "short",
  timeZone: ARTICLE_TIME_ZONE,
  year: "numeric",
})

const publishedAtFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  timeZone: ARTICLE_TIME_ZONE,
  year: "numeric",
})

export const ownedArticleListSelect = {
  id: true,
  title: true,
  excerpt: true,
  coverImageUrl: true,
  status: true,
  views: true,
  updatedAt: true,
  websiteArticleSection: {
    select: {
      categoryHeroTitle: true,
      articleCategorySlug: true,
    },
  },
  _count: {
    select: {
      likes: true,
      comments: {
        where: { deletedAt: null },
      },
    },
  },
} satisfies Prisma.ArticleSelect

export const ownedArticleEditorSelect = {
  id: true,
  title: true,
  excerpt: true,
  content: true,
  coverImageUrl: true,
  websiteArticleSectionId: true,
  readingTime: true,
  views: true,
  status: true,
  publishedAt: true,
  updatedAt: true,
  websiteArticleSection: {
    select: {
      categoryHeroTitle: true,
      articleCategorySlug: true,
    },
  },
  author: {
    select: {
      name: true,
      avatarUrl: true,
      bio: true,
    },
  },
  tags: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: { label: true },
  },
  _count: {
    select: {
      likes: true,
      comments: {
        where: { deletedAt: null },
      },
    },
  },
} satisfies Prisma.ArticleSelect

type OwnedArticleListRecord = Prisma.ArticleGetPayload<{
  select: typeof ownedArticleListSelect
}>

type OwnedArticleEditorRecord = Prisma.ArticleGetPayload<{
  select: typeof ownedArticleEditorSelect
}>

export function ownedArticleStatusLabel(status: ContentStatus) {
  if (status === "DRAFT") return "Draf"
  if (status === "PENDING_REVIEW") return "Request"
  if (status === "PUBLISHED") return "Post"
  if (status === "REJECTED") return "Rejected"
  return "Takedown"
}

export function mapOwnedArticleListItem(
  article: OwnedArticleListRecord,
): OwnedArticleListItem {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    coverImageUrl: article.coverImageUrl,
    category: article.websiteArticleSection.categoryHeroTitle,
    categorySlug: article.websiteArticleSection.articleCategorySlug,
    updatedAt: article.updatedAt.toISOString(),
    updatedAtLabel: `${listDateFormatter.format(article.updatedAt)} WIB`,
    status: article.status,
    statusLabel: ownedArticleStatusLabel(article.status),
    views: article.views,
    likes: article._count.likes,
    comments: article._count.comments,
  }
}

export function mapOwnedArticleEditor(
  article: OwnedArticleEditorRecord,
): OwnedArticleEditorData {
  return {
    id: article.id,
    title: article.title,
    excerpt: article.excerpt,
    content: article.content,
    coverImageUrl: article.coverImageUrl,
    websiteArticleSectionId: article.websiteArticleSectionId,
    categoryLabel: article.websiteArticleSection.categoryHeroTitle,
    categorySlug: article.websiteArticleSection.articleCategorySlug,
    status: article.status,
    statusLabel: ownedArticleStatusLabel(article.status),
    tags: article.tags.map((tag) => tag.label),
    readingTime: article.readingTime,
    author: {
      name: article.author.name,
      avatarUrl: article.author.avatarUrl || DEFAULT_AUTHOR_AVATAR,
      bio:
        article.author.bio ||
        "Penulis dan kontributor yang berbagi cerita tentang Palembang.",
      roleLabel: "Penulis & Kontributor",
    },
    publishedAt: article.publishedAt ? article.publishedAt.toISOString() : null,
    publishedAtLabel: article.publishedAt
      ? publishedAtFormatter.format(article.publishedAt)
      : "Draf belum dipublikasikan",
    views: article.views,
    commentsCount: article._count.comments,
    likesCount: article._count.likes,
  }
}
