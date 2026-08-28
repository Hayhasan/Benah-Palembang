import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import { DEFAULT_LANDING_PAGE } from "../constants/default-landing-page"
import type { LandingPageData } from "../types/landing-page"
import {
  landingPageSelect,
  mapWebsiteContentToLandingPage,
} from "./website-content.mapper"

export async function getLandingPage(): Promise<LandingPageData> {
  // Website content must reflect the current database row on every request.
  await connection()

  const content = await prisma.websiteContent.findFirst({
    where: {
      key: DEFAULT_LANDING_PAGE.key,
      deletedAt: null,
    },
    select: landingPageSelect,
  })

  if (!content) {
    return DEFAULT_LANDING_PAGE
  }

  return mapWebsiteContentToLandingPage(content)
}
