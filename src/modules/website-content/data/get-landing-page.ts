import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import { DEFAULT_LANDING_PAGE } from "../constants/default-landing-page"
import type { LandingPageView } from "../types/landing-page"
import { resolveExploreCounts } from "./resolve-explore-counts"
import {
  landingPageSelect,
  mapWebsiteContentToLandingPage,
} from "./website-content.mapper"

export async function getLandingPage(): Promise<LandingPageView> {
  // Website content must reflect the current database row on every request.
  await connection()

  const content = await prisma.websiteContent.findFirst({
    where: {
      key: DEFAULT_LANDING_PAGE.key,
      deletedAt: null,
    },
    select: landingPageSelect,
  })

  const data = content
    ? mapWebsiteContentToLandingPage(content)
    : DEFAULT_LANDING_PAGE

  return {
    ...data,
    explore: {
      ...data.explore,
      items: await resolveExploreCounts(data.explore.items),
    },
  }
}
