import { getLandingArticles } from "@/modules/article/data/get-landing-articles"
import { LandingPage } from "@/modules/website-content/components/landing-page"
import { getLandingPage } from "@/modules/website-content/data/get-landing-page"

export default async function Page() {
  const [landingPage, articlesBySection] = await Promise.all([
    getLandingPage(),
    getLandingArticles(),
  ])

  return <LandingPage data={landingPage} articlesBySection={articlesBySection} />
}
