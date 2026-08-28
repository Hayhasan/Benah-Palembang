import "server-only"

import type { Prisma } from "@prisma/client"
import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { eventListQuerySchema } from "../schemas/event.schema"
import type { OwnedEventList } from "../types/owned-event"
import {
  mapOwnedEventListItem,
  ownedEventListSelect,
} from "./owned-event.mapper"

const EVENT_PAGE_SIZE = 25

export async function getOwnedEvents(input: {
  q?: string
  page?: number | string
}): Promise<OwnedEventList> {
  const actor = await requireCurrentUser()
  await connection()

  const query = eventListQuerySchema.parse(input)
  const where: Prisma.EventWhereInput = {
    ownerId: actor.id,
    deletedAt: null,
    ...(query.q
      ? {
          OR: [
            { title: { contains: query.q, mode: "insensitive" } },
            { description: { contains: query.q, mode: "insensitive" } },
          ],
        }
      : {}),
  }

  return prisma.$transaction(async (transaction) => {
    const totalItems = await transaction.event.count({ where })
    const totalPages = Math.ceil(totalItems / EVENT_PAGE_SIZE)
    const page = totalPages === 0 ? 1 : Math.min(query.page, totalPages)
    const events = await transaction.event.findMany({
      where,
      select: ownedEventListSelect,
      orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * EVENT_PAGE_SIZE,
      take: EVENT_PAGE_SIZE,
    })

    return {
      items: events.map(mapOwnedEventListItem),
      page,
      pageSize: EVENT_PAGE_SIZE,
      totalItems,
      totalPages,
      query: query.q,
    }
  })
}
