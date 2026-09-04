import "server-only"

import type { ContentStatus, Prisma } from "@prisma/client"

import type {
  OwnedEventEditorData,
  OwnedEventListItem,
} from "../types/owned-event"

const EVENT_TIME_ZONE = "Asia/Jakarta"

const listDateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  month: "short",
  timeZone: EVENT_TIME_ZONE,
  year: "numeric",
})

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  timeZone: EVENT_TIME_ZONE,
  year: "numeric",
})

const inputDateFormatter = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  timeZone: EVENT_TIME_ZONE,
  year: "numeric",
})

const inputTimeFormatter = new Intl.DateTimeFormat("en-GB", {
  hour: "2-digit",
  hourCycle: "h23",
  minute: "2-digit",
  timeZone: EVENT_TIME_ZONE,
})

export const ownedEventListSelect = {
  id: true,
  title: true,
  description: true,
  bannerUrl: true,
  startsAt: true,
  views: true,
  status: true,
  moderationNote: true,
  _count: {
    select: {
      likes: true,
    },
  },
} satisfies Prisma.EventSelect

export const ownedEventEditorSelect = {
  id: true,
  title: true,
  description: true,
  content: true,
  bannerUrl: true,
  category: true,
  startsAt: true,
  endsAt: true,
  location: true,
  organizer: true,
  registrationUrl: true,
  whatsappUrl: true,
  views: true,
  status: true,
  moderationNote: true,
  tags: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: { label: true },
  },
  _count: {
    select: {
      likes: true,
    },
  },
} satisfies Prisma.EventSelect

type OwnedEventListRecord = Prisma.EventGetPayload<{
  select: typeof ownedEventListSelect
}>

type OwnedEventEditorRecord = Prisma.EventGetPayload<{
  select: typeof ownedEventEditorSelect
}>

export function ownedEventStatusLabel(status: ContentStatus) {
  switch (status) {
    case "DRAFT":
      return "Draf"
    case "PENDING_REVIEW":
      return "Request"
    case "PUBLISHED":
      return "Post"
    case "REJECTED":
      return "Rejected"
    case "TAKEN_DOWN":
      return "Takedown"
    case "ARCHIVED":
      return "Arsip"
  }
}

function inputDate(date: Date) {
  const parts = inputDateFormatter.formatToParts(date)
  const day = parts.find((part) => part.type === "day")?.value
  const month = parts.find((part) => part.type === "month")?.value
  const year = parts.find((part) => part.type === "year")?.value
  return `${year}-${month}-${day}`
}

export function mapOwnedEventListItem(
  event: OwnedEventListRecord,
): OwnedEventListItem {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    bannerUrl: event.bannerUrl,
    startsAt: event.startsAt.toISOString(),
    startsAtLabel: `${listDateFormatter.format(event.startsAt)} WIB`,
    status: event.status,
    statusLabel: ownedEventStatusLabel(event.status),
    moderationNote: event.moderationNote,
    views: event.views,
    likes: event._count.likes,
  }
}

export function mapOwnedEventEditor(
  event: OwnedEventEditorRecord,
): OwnedEventEditorData {
  return {
    id: event.id,
    title: event.title,
    description: event.description,
    content: event.content,
    bannerUrl: event.bannerUrl,
    category: event.category,
    startsAt: event.startsAt.toISOString(),
    startsOn: inputDate(event.startsAt),
    startsTime: inputTimeFormatter.format(event.startsAt),
    dateLabel: dateFormatter.format(event.startsAt),
    timeLabel: `${inputTimeFormatter.format(event.startsAt)} WIB`,
    location: event.location,
    organizer: event.organizer,
    registrationUrl: event.registrationUrl ?? "",
    whatsappUrl: event.whatsappUrl,
    status: event.status,
    statusLabel: ownedEventStatusLabel(event.status),
    moderationNote: event.moderationNote,
    tags: event.tags.map((tag) => tag.label),
    views: event.views,
    likesCount: event._count.likes,
  }
}
