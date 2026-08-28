import type { Prisma } from "@prisma/client"

import type {
  PublicEventDetail,
  PublicEventListItem,
} from "../types/public-event"

const EVENT_TIME_ZONE = "Asia/Jakarta"

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: EVENT_TIME_ZONE,
})

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  day: "2-digit",
  month: "2-digit",
  year: "numeric",
  timeZone: EVENT_TIME_ZONE,
})

const timeFormatter = new Intl.DateTimeFormat("id-ID", {
  hour: "2-digit",
  hour12: false,
  minute: "2-digit",
  timeZone: EVENT_TIME_ZONE,
})

export const publicEventListSelect = {
  id: true,
  slug: true,
  title: true,
  description: true,
  bannerUrl: true,
  category: true,
  startsAt: true,
  endsAt: true,
  location: true,
  organizer: true,
  views: true,
} satisfies Prisma.EventSelect

export const publicEventDetailSelect = {
  ...publicEventListSelect,
  content: true,
  registrationUrl: true,
  tags: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: { label: true },
  },
  likes: {
    select: {
      userId: true,
    },
  },
  participants: {
    select: {
      identifier: true,
    },
  },
  _count: {
    select: {
      likes: true,
      participants: { where: { deletedAt: null } },
    },
  },
} satisfies Prisma.EventSelect

type PublicEventListRecord = Prisma.EventGetPayload<{
  select: typeof publicEventListSelect
}>

type PublicEventDetailRecord = Prisma.EventGetPayload<{
  select: typeof publicEventDetailSelect
}>

function formatDateLabel(startsAt: Date, endsAt: Date | null) {
  if (!endsAt || dateKeyFormatter.format(startsAt) === dateKeyFormatter.format(endsAt)) {
    return dateFormatter.format(startsAt)
  }

  return `${dateFormatter.format(startsAt)} - ${dateFormatter.format(endsAt)}`
}

function formatTimeLabel(startsAt: Date, endsAt: Date | null) {
  const startTime = timeFormatter.format(startsAt).replaceAll(".", ":")

  if (!endsAt) return `${startTime} WIB`

  const endTime = timeFormatter.format(endsAt).replaceAll(".", ":")
  return `${startTime} - ${endTime} WIB`
}

export function mapPublicEventListItem(
  event: PublicEventListRecord,
): PublicEventListItem {
  return {
    id: event.id,
    slug: event.slug,
    title: event.title,
    description: event.description,
    bannerUrl: event.bannerUrl,
    category: event.category,
    startsAt: event.startsAt.toISOString(),
    endsAt: event.endsAt?.toISOString() ?? null,
    dateLabel: formatDateLabel(event.startsAt, event.endsAt),
    timeLabel: formatTimeLabel(event.startsAt, event.endsAt),
    location: event.location,
    organizer: event.organizer,
    views: event.views,
  }
}

export function mapPublicEventDetail(
  event: PublicEventDetailRecord,
  currentUserId?: string | null,
  currentIdentifier?: string | null,
): PublicEventDetail {
  const hasLiked = Boolean(
    currentUserId && event.likes.some((like) => like.userId === currentUserId),
  )
  const hasRegistered = Boolean(
    currentIdentifier &&
      event.participants.some((p) => p.identifier === currentIdentifier),
  )

  return {
    ...mapPublicEventListItem(event),
    content: event.content,
    registrationUrl: event.registrationUrl,
    tags: event.tags.map((tag) => tag.label),
    likesCount: event._count.likes,
    participantsCount: event._count.participants,
    hasLiked,
    hasRegistered,
  }
}
