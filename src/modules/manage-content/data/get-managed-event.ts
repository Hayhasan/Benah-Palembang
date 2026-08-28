import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"
import {
  mapOwnedEventEditor,
  ownedEventEditorSelect,
} from "@/modules/event/data/owned-event.mapper"
import type { OwnedEventEditorData } from "@/modules/event/types/owned-event"

export async function getManagedEvent(
  id: number,
): Promise<OwnedEventEditorData | null> {
  await connection()
  await requireRole(["ADMIN", "SUPERADMIN"])

  const event = await prisma.event.findFirst({
    where: {
      id,
      deletedAt: null,
    },
    select: ownedEventEditorSelect,
  })

  if (!event) return null

  return mapOwnedEventEditor(event)
}
