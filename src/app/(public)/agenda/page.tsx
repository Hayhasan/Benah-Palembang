import { AgendaPage } from "@/modules/website-content/components/agenda-page"
import { getAgendaPage } from "@/modules/website-content/data/get-agenda-page"

export default async function Page() {
  const data = await getAgendaPage()

  return <AgendaPage data={data} />
}
