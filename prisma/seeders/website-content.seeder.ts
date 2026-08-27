import type { PrismaClient } from "@prisma/client"

import { DEFAULT_LANDING_PAGE } from "../../src/modules/website-content/constants/default-landing-page"

export async function seedWebsiteContent(prisma: PrismaClient) {
  const existing = await prisma.websiteContent.findUnique({
    where: { key: DEFAULT_LANDING_PAGE.key },
    select: { deletedAt: true },
  })

  if (existing?.deletedAt === null) {
    console.log("[website-content] skipped: canonical content already exists")
    return
  }

  if (existing) {
    throw new Error(
      "[website-content] canonical key is still occupied by a soft-deleted record",
    )
  }

  console.log("[website-content] creating default content")

  await prisma.$transaction(async (transaction) => {
    await transaction.websiteContent.create({
      data: {
        key: DEFAULT_LANDING_PAGE.key,
        aboutEyebrow: DEFAULT_LANDING_PAGE.about.eyebrow,
        aboutEstablishedText: DEFAULT_LANDING_PAGE.about.establishedText,
        aboutTitle: DEFAULT_LANDING_PAGE.about.title,
        aboutDescription: DEFAULT_LANDING_PAGE.about.description,
        aboutClosingText: DEFAULT_LANDING_PAGE.about.closingText,
        exploreEyebrow: DEFAULT_LANDING_PAGE.explore.eyebrow,
        exploreTitle: DEFAULT_LANDING_PAGE.explore.title,
        teamEyebrow: DEFAULT_LANDING_PAGE.team.eyebrow,
        teamTitle: DEFAULT_LANDING_PAGE.team.title,
        teamDescription: DEFAULT_LANDING_PAGE.team.description,
        ctaEyebrow: DEFAULT_LANDING_PAGE.cta.eyebrow,
        ctaTitle: DEFAULT_LANDING_PAGE.cta.title,
        ctaDescription: DEFAULT_LANDING_PAGE.cta.description,
        ctaButtonLabel: DEFAULT_LANDING_PAGE.cta.buttonLabel,
        ctaButtonUrl: DEFAULT_LANDING_PAGE.cta.buttonUrl,
        heroSlides: {
          create: DEFAULT_LANDING_PAGE.heroSlides,
        },
        exploreItems: {
          create: DEFAULT_LANDING_PAGE.explore.items,
        },
        articleSections: {
          create: DEFAULT_LANDING_PAGE.articleSections,
        },
        teamMembers: {
          create: DEFAULT_LANDING_PAGE.team.members,
        },
      },
    })
  })

  console.log("[website-content] created")
}
