import { getLandingArticles } from "@/modules/article/data/get-landing-articles"
import { getPublicEventCount } from "@/modules/event/data/get-public-event-count"
import { LandingPage } from "@/modules/website-content/components/landing-page"
import { getLandingPage } from "@/modules/website-content/data/get-landing-page"

export default async function Page() {
  const [landingPage, articlesBySection, agendaCount] = await Promise.all([
    getLandingPage(),
    getLandingArticles(),
    getPublicEventCount(),
  ])

  return (
    <LandingPage
      data={landingPage}
      articlesBySection={articlesBySection}
      agendaCount={agendaCount}
    />
  )
}
