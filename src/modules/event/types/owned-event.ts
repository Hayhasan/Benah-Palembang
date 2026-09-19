import type { ContentStatus } from "@prisma/client"

export interface OwnedEventListItem {
  id: number
  title: string
  description: string
  bannerUrl: string
  startsAt: string
  startsAtLabel: string
  status: ContentStatus
  statusLabel: string
  moderationNote: string | null
  views: number
}

export interface OwnedEventList {
  items: OwnedEventListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  query: string
}

export interface OwnedEventEditorData {
  id: number
  title: string
  description: string
  content: string
  bannerUrl: string
  additionalBannerUrls: string[]
  category: string
  startsAt: string
  startsOn: string
  startsTime: string
  dateLabel: string
  timeLabel: string
  location: string
  organizer: string
  photographer: string | null
  registrationUrl: string
  whatsappUrl: string
  status: ContentStatus
  statusLabel: string
  moderationNote: string | null
  tags: string[]
  views: number
  publishedAt?: string | null
  publishedAtLabel?: string | null
}

export type EventSaveIntent = "SAVE" | "POST"

export type EventActionResult =
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
