import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import type { PublicEventListItem } from "../types/public-event"
import {
  mapPublicEventListItem,
  publicEventListSelect,
} from "./event.mapper"

export async function getPublicEvents(): Promise<PublicEventListItem[]> {
  await connection()

  const events = await prisma.event.findMany({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
    },
    orderBy: { startsAt: "asc" },
    select: publicEventListSelect,
  })

  return events.map(mapPublicEventListItem)
}
