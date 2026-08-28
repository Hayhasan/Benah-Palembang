import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import type { OwnedEventEditorData } from "../types/owned-event"
import {
  mapOwnedEventEditor,
  ownedEventEditorSelect,
} from "./owned-event.mapper"

export async function getOwnedEvent(
  id: number,
): Promise<OwnedEventEditorData | null> {
  const actor = await requireCurrentUser()
  await connection()

  const event = await prisma.event.findFirst({
    where: {
      id,
      ownerId: actor.id,
      deletedAt: null,
    },
    select: ownedEventEditorSelect,
  })

  return event ? mapOwnedEventEditor(event) : null
}
