import type { ContentStatus } from "@prisma/client"

export interface ArticleGalleryItem {
  id: number
  title: string
  coverImageUrl: string
  status: ContentStatus
  statusLabel: string
  updatedAtLabel: string
  views: number
  likes: number
}

export interface ArticleGalleryData {
  items: ArticleGalleryItem[]
  totalItems: number
}
