import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { recordEventView } from "@/lib/views/view-tracker"
import { getCurrentUser } from "@/modules/auth/data/session-dal"

import type { PublicEventDetailData } from "../types/public-event"
import {
  mapPublicEventDetail,
  mapPublicEventListItem,
  publicEventDetailSelect,
  publicEventListSelect,
} from "./event.mapper"

const RELATED_EVENT_LIMIT = 2

function pickRandomEvents<T>(events: T[], limit: number): T[] {
  const shuffled = [...events]

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const randomIndex = Math.floor(Math.random() * (index + 1))
    ;[shuffled[index], shuffled[randomIndex]] = [
      shuffled[randomIndex],
      shuffled[index],
    ]
  }

  return shuffled.slice(0, limit)
}

export async function getPublicEvent(
  id: number,
): Promise<PublicEventDetailData | null> {
  await connection()
  const currentUser = await getCurrentUser()

  const event = await prisma.event.findFirst({
    where: {
      id,
      status: "PUBLISHED",
      deletedAt: null,
    },
    select: publicEventDetailSelect,
  })

  if (!event) return null

  const incremented = await recordEventView(event.id, currentUser?.id)
  const eventDetail = mapPublicEventDetail(event, currentUser?.id)
  if (incremented) {
    eventDetail.views += 1
  }

  const relatedEventCandidates = await prisma.event.findMany({
    where: {
      id: { not: event.id },
      status: "PUBLISHED",
      deletedAt: null,
    },
    orderBy: { id: "asc" },
    select: publicEventListSelect,
  })

  const relatedEvents = pickRandomEvents(
    relatedEventCandidates,
    RELATED_EVENT_LIMIT,
  )

  return {
    event: eventDetail,
    relatedEvents: relatedEvents.map(mapPublicEventListItem),
  }
}
