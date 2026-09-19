import type { CollaborationPlatform } from "@/modules/website-content/types/collaboration-page"

export interface SearchArticleItem {
  id: number
  slug: string
  title: string
  excerpt: string
  coverImageUrl: string
  category: string
  categorySlug: string
  publishedAtLabel: string
  readingTime: number
  views: number
}

export interface SearchEventItem {
  id: number
  slug: string
  title: string
  description: string
  bannerUrl: string
  category: string
  dateLabel: string
  timeLabel: string
  location: string
  views: number
}

export interface SearchCollaborationItem {
  id: number
  title: string
  platform: CollaborationPlatform
  contentUrl: string
  thumbnailUrl: string | null
  aspectRatio: string
}

export interface SearchResults {
  query: string
  articles: SearchArticleItem[]
  events: SearchEventItem[]
  collaborations: SearchCollaborationItem[]
  totalCount: number
}
