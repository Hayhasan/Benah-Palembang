import type { Article, Event, User } from "@prisma/client"

import { getManagedContentStatistics } from "../constants/mock-content-statistics"
import type {
  ManagedContentListItem,
  ManagedContentStatus,
} from "../types/managed-content"

const dateTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  hour: "2-digit",
  minute: "2-digit",
  hour12: false,
})

export function formatManagedDate(date: Date): string {
  return dateTimeFormatter.format(date)
}

export function mapContentStatusLabel(
  status: ManagedContentStatus,
): "Request" | "Posted" | "Rejected" | "Takedown" {
  switch (status) {
    case "PENDING_REVIEW":
      return "Request"
    case "PUBLISHED":
      return "Posted"
    case "REJECTED":
      return "Rejected"
    case "TAKEN_DOWN":
      return "Takedown"
  }
}

export interface ArticleModerationRecord extends Article {
  author: Pick<User, "id" | "name" | "avatarUrl">
  _count?: {
    comments: number
  }
}

export interface EventModerationRecord extends Event {
  owner: Pick<User, "id" | "name" | "avatarUrl">
}

export function mapArticleToManagedContent(
  article: ArticleModerationRecord,
): ManagedContentListItem {
  const status = article.status as ManagedContentStatus
  const displayDate = article.submittedAt ?? article.updatedAt
  const baseStats = getManagedContentStatistics("ARTICLE", article.id)

  return {
    id: article.id,
    type: "ARTICLE",
    typeLabel: "Article",
    title: article.title,
    description: article.excerpt,
    bannerUrl: article.coverImageUrl,
    owner: {
      id: article.author.id,
      name: article.author.name,
      avatarUrl: article.author.avatarUrl,
    },
    status,
    statusLabel: mapContentStatusLabel(status),
    submittedAt: article.submittedAt?.toISOString() ?? null,
    publishedAt: article.publishedAt?.toISOString() ?? null,
    createdAt: article.createdAt.toISOString(),
    updatedAt: article.updatedAt.toISOString(),
    dateLabel: formatManagedDate(displayDate),
    stats: {
      ...baseStats,
      comments: article._count?.comments ?? 0,
    },
  }
}

export function mapEventToManagedContent(
  event: EventModerationRecord,
): ManagedContentListItem {
  const status = event.status as ManagedContentStatus
  const displayDate = event.submittedAt ?? event.updatedAt

  return {
    id: event.id,
    type: "EVENT",
    typeLabel: "Event",
    title: event.title,
    description: event.description,
    bannerUrl: event.bannerUrl,
    owner: {
      id: event.owner.id,
      name: event.owner.name,
      avatarUrl: event.owner.avatarUrl,
    },
    status,
    statusLabel: mapContentStatusLabel(status),
    submittedAt: event.submittedAt?.toISOString() ?? null,
    publishedAt: event.publishedAt?.toISOString() ?? null,
    createdAt: event.createdAt.toISOString(),
    updatedAt: event.updatedAt.toISOString(),
    dateLabel: formatManagedDate(displayDate),
    stats: getManagedContentStatistics("EVENT", event.id),
  }
}
