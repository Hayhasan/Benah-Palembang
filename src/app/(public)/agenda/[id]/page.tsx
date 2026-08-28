import { notFound } from "next/navigation"

import { PublicEventDetail } from "@/modules/event/components/public-event-detail"
import { getPublicEvent } from "@/modules/event/data/get-public-event"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  if (!/^[1-9]\d*$/.test(id)) notFound()

  const data = await getPublicEvent(Number(id))
  if (!data) notFound()

  return <PublicEventDetail data={data} />
}
