import { PublicEventList } from "@/modules/event/components/public-event-list"
import { getPublicEvents } from "@/modules/event/data/get-public-events"
import { getAgendaPage } from "@/modules/website-content/data/get-agenda-page"

export default async function Page() {
  const [content, events] = await Promise.all([
    getAgendaPage(),
    getPublicEvents(),
  ])

  return <PublicEventList content={content} events={events} />
}
