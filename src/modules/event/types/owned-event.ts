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
  views: number
  likes: number
  participants: number
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
  category: string
  startsAt: string
  startsOn: string
  startsTime: string
  dateLabel: string
  timeLabel: string
  location: string
  organizer: string
  registrationUrl: string
  status: ContentStatus
  statusLabel: string
  tags: string[]
  views: number
  likesCount: number
  participantsCount: number
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
