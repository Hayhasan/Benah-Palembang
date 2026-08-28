import { notFound } from "next/navigation"

import { requireCurrentUser } from "@/modules/auth/data/session-dal"
import { EventEditor } from "@/modules/event/components/event-editor"
import { getOwnedEvent } from "@/modules/event/data/get-owned-event"

interface PageProps {
  searchParams: Promise<{ id?: string | string[] }>
}

export default async function Page({ searchParams }: PageProps) {
  await requireCurrentUser()

  const params = await searchParams
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id

  if (!rawId || !/^[1-9]\d*$/.test(rawId)) notFound()

  const event = await getOwnedEvent(Number(rawId))
  if (!event) notFound()

  return <EventEditor initialEvent={event} />
}
