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

  const relatedEvents = await prisma.event.findMany({
    where: {
      id: { not: event.id },
      category: event.category,
      status: "PUBLISHED",
      deletedAt: null,
    },
    orderBy: { startsAt: "asc" },
    take: 3,
    select: publicEventListSelect,
  })

  return {
    event: eventDetail,
    relatedEvents: relatedEvents.map(mapPublicEventListItem),
  }
}
