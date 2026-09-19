import type { Metadata } from "next"

import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/config"
import { getLandingArticles } from "@/modules/article/data/get-landing-articles"
import { getLatestArticles } from "@/modules/article/data/get-latest-articles"
import { getPublicEvents } from "@/modules/event/data/get-public-events"
import { LandingPage } from "@/modules/website-content/components/landing-page"
import { getLandingPage } from "@/modules/website-content/data/get-landing-page"

export const metadata: Metadata = {
  title: DEFAULT_TITLE,
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  alternates: {
    canonical: "/",
  },
  openGraph: {
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    url: SITE_URL,
    siteName: SITE_NAME,
    type: "website",
    locale: "id_ID",
  },
}

export default async function Page() {
  const [landingPage, articlesBySection, latestArticles, events] = await Promise.all([
    getLandingPage(),
    getLandingArticles(),
    getLatestArticles(6),
    getPublicEvents(),
  ])

  return (
    <LandingPage
      data={landingPage}
      articlesBySection={articlesBySection}
      latestArticles={latestArticles}
      events={events}
    />
  )
}
