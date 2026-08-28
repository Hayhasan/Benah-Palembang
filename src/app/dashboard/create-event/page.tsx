import { OwnedEventList } from "@/modules/event/components/owned-event-list"
import { getOwnedEvents } from "@/modules/event/data/get-owned-events"

interface PageProps {
  searchParams: Promise<{
    page?: string | string[]
    q?: string | string[]
  }>
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const data = await getOwnedEvents({
    page: firstValue(params.page),
    q: firstValue(params.q),
  })

  return <OwnedEventList data={data} />
}
