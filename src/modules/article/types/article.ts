import type { ContentStatus } from "@prisma/client"

export interface OwnedArticleListItem {
  id: number
  title: string
  excerpt: string
  coverImageUrl: string
  category: string
  categorySlug: string
  updatedAt: string
  updatedAtLabel: string
  status: ContentStatus
  statusLabel: string
  moderationNote: string | null
  views: number
  likes: number
  comments: number
}

export interface OwnedArticleList {
  items: OwnedArticleListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  query: string
}

export interface ArticleCategoryOption {
  id: number
  sectionKey: string
  slug: string
  label: string
}

export interface OwnedArticleEditorData {
  id: number
  title: string
  excerpt: string
  content: string
  coverImageUrl: string
  websiteArticleSectionId: number
  categoryLabel: string
  categorySlug: string
  status: ContentStatus
  statusLabel: string
  moderationNote: string | null
  tags: string[]
  readingTime: number
  author: {
    name: string
    avatarUrl: string
    bio: string
    roleLabel: string
  }
  publishedAt: string | null
  publishedAtLabel: string
  views: number
  commentsCount: number
  likesCount: number
}

export type ArticleSaveIntent = "SAVE" | "POST"

export type ArticleActionResult =
  | {
      success: true
      message: string
      id: number
      status: ContentStatus
    }
  | {
      success: false
      message: string
      field?: string
    }
