import { notFound } from "next/navigation"

import { requireCurrentUser } from "@/modules/auth/data/session-dal"
import { OwnedEventPreview } from "@/modules/event/components/owned-event-preview"
import { getOwnedEvent } from "@/modules/event/data/get-owned-event"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  await requireCurrentUser()

  const { id } = await params
  if (!/^[1-9]\d*$/.test(id)) notFound()

  const event = await getOwnedEvent(Number(id))
  if (!event) notFound()

  return <OwnedEventPreview event={event} />
}
