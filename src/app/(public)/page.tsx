import { LandingPage } from "@/modules/website-content/components/landing-page"
import { getLandingPage } from "@/modules/website-content/data/get-landing-page"

export default async function Page() {
  const landingPage = await getLandingPage()

  return <LandingPage data={landingPage} />
}
