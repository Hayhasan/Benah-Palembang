import type {
  PrismaClient,
  WebsiteCollaborationAspectRatio,
  WebsiteCollaborationPlatform,
} from "@prisma/client"

import { DEFAULT_AGENDA_PAGE } from "../../src/modules/website-content/constants/default-agenda-page"
import { DEFAULT_COLLABORATION_PAGE } from "../../src/modules/website-content/constants/default-collaboration-page"
import { DEFAULT_HEADER_FOOTER_CONTENT } from "../../src/modules/website-content/constants/default-header-footer-content"
import { DEFAULT_LANDING_PAGE } from "../../src/modules/website-content/constants/default-landing-page"
import type {
  CollaborationAspectRatio,
  CollaborationPlatform,
} from "../../src/modules/website-content/types/collaboration-page"

const collaborationPlatformToDatabase: Record<
  CollaborationPlatform,
  WebsiteCollaborationPlatform
> = {
  youtube: "YOUTUBE",
  instagram: "INSTAGRAM",
  tiktok: "TIKTOK",
  facebook: "FACEBOOK",
  x: "X",
}

const collaborationAspectRatioToDatabase: Record<
  CollaborationAspectRatio,
  WebsiteCollaborationAspectRatio
> = {
  "9:16": "PORTRAIT_9_16",
  "4:5": "PORTRAIT_4_5",
  "16:9": "LANDSCAPE_16_9",
  "1:1": "SQUARE_1_1",
}

async function seedLandingPage(prisma: PrismaClient) {
  const existing = await prisma.websiteContent.findUnique({
    where: { key: DEFAULT_LANDING_PAGE.key },
    select: { deletedAt: true },
  })

  if (existing?.deletedAt === null) {
    console.log("[website-content:home] skipped: canonical content already exists")
    return
  }

  if (existing) {
    throw new Error(
      "[website-content:home] canonical key is still occupied by a soft-deleted record",
    )
  }

  console.log("[website-content:home] creating default content")

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

  console.log("[website-content:home] created")
}

async function seedCollaborationPage(prisma: PrismaClient) {
  const existing = await prisma.websiteCollaborationContent.findUnique({
    where: { key: DEFAULT_COLLABORATION_PAGE.key },
    select: { deletedAt: true },
  })

  if (existing?.deletedAt === null) {
    console.log(
      "[website-content:collaboration] skipped: canonical content already exists",
    )
    return
  }

  if (existing) {
    throw new Error(
      "[website-content:collaboration] canonical key is still occupied by a soft-deleted record",
    )
  }

  console.log("[website-content:collaboration] creating default content")

  await prisma.$transaction(async (transaction) => {
    await transaction.websiteCollaborationContent.create({
      data: {
        key: DEFAULT_COLLABORATION_PAGE.key,
        heroImageUrl: DEFAULT_COLLABORATION_PAGE.hero.imageUrl,
        heroImageAlt: DEFAULT_COLLABORATION_PAGE.hero.imageAlt,
        heroEyebrow: DEFAULT_COLLABORATION_PAGE.hero.eyebrow,
        heroTitle: DEFAULT_COLLABORATION_PAGE.hero.title,
        heroDescription: DEFAULT_COLLABORATION_PAGE.hero.description,
        contactEmail: DEFAULT_COLLABORATION_PAGE.contact.email,
        contactPhone: DEFAULT_COLLABORATION_PAGE.contact.phone,
        emailUrl: DEFAULT_COLLABORATION_PAGE.contact.emailUrl,
        whatsappUrl: DEFAULT_COLLABORATION_PAGE.contact.whatsappUrl,
        formTitle: DEFAULT_COLLABORATION_PAGE.form.title,
        formDescription: DEFAULT_COLLABORATION_PAGE.form.description,
        partnerLogos: {
          create: DEFAULT_COLLABORATION_PAGE.partnerLogos,
        },
        partnerContents: {
          create: DEFAULT_COLLABORATION_PAGE.partnerContents.map((item) => ({
            ...item,
            platform: collaborationPlatformToDatabase[item.platform],
            aspectRatio:
              collaborationAspectRatioToDatabase[item.aspectRatio],
          })),
        },
      },
    })
  })

  console.log("[website-content:collaboration] created")
}

async function seedHeaderFooterContent(prisma: PrismaClient) {
  const existing = await prisma.websiteHeaderFooterContent.findUnique({
    where: { key: DEFAULT_HEADER_FOOTER_CONTENT.key },
    select: { deletedAt: true },
  })

  if (existing?.deletedAt === null) {
    console.log(
      "[website-content:header-footer] skipped: canonical content already exists",
    )
    return
  }

  if (existing) {
    throw new Error(
      "[website-content:header-footer] canonical key is still occupied by a soft-deleted record",
    )
  }

  console.log("[website-content:header-footer] creating default content")

  await prisma.$transaction(async (transaction) => {
    await transaction.websiteHeaderFooterContent.create({
      data: {
        key: DEFAULT_HEADER_FOOTER_CONTENT.key,
        logoImageUrl: DEFAULT_HEADER_FOOTER_CONTENT.logo.imageUrl,
        logoImageAlt: DEFAULT_HEADER_FOOTER_CONTENT.logo.imageAlt,
        logoLinkUrl: DEFAULT_HEADER_FOOTER_CONTENT.logo.linkUrl,
        footerDescription:
          DEFAULT_HEADER_FOOTER_CONTENT.footer.description,
        exploreDescription:
          DEFAULT_HEADER_FOOTER_CONTENT.footer.exploreDescription,
        contactEmail: DEFAULT_HEADER_FOOTER_CONTENT.footer.contactEmail,
        contactPhone: DEFAULT_HEADER_FOOTER_CONTENT.footer.contactPhone,
        contactAddress: DEFAULT_HEADER_FOOTER_CONTENT.footer.contactAddress,
        copyrightText: DEFAULT_HEADER_FOOTER_CONTENT.footer.copyrightText,
        closingText: DEFAULT_HEADER_FOOTER_CONTENT.footer.closingText,
        footerExploreLinks: {
          create: DEFAULT_HEADER_FOOTER_CONTENT.footer.exploreLinks,
        },
        footerConnectLinks: {
          create: DEFAULT_HEADER_FOOTER_CONTENT.footer.connectLinks,
        },
      },
    })
  })

  console.log("[website-content:header-footer] created")
}

async function seedAgendaPage(prisma: PrismaClient) {
  const existing = await prisma.websiteAgendaContent.findUnique({
    where: { key: DEFAULT_AGENDA_PAGE.key },
    select: { deletedAt: true },
  })

  if (existing?.deletedAt === null) {
    console.log(
      "[website-content:agenda] skipped: canonical content already exists",
    )
    return
  }

  if (existing) {
    throw new Error(
      "[website-content:agenda] canonical key is still occupied by a soft-deleted record",
    )
  }

  console.log("[website-content:agenda] creating default content")

  await prisma.$transaction(async (transaction) => {
    await transaction.websiteAgendaContent.create({
      data: {
        key: DEFAULT_AGENDA_PAGE.key,
        heroImageUrl: DEFAULT_AGENDA_PAGE.hero.imageUrl,
        heroImageAlt: DEFAULT_AGENDA_PAGE.hero.imageAlt,
        heroEyebrow: DEFAULT_AGENDA_PAGE.hero.eyebrow,
        heroTitle: DEFAULT_AGENDA_PAGE.hero.title,
        heroDescription: DEFAULT_AGENDA_PAGE.hero.description,
      },
    })
  })

  console.log("[website-content:agenda] created")
}

export async function seedWebsiteContent(prisma: PrismaClient) {
  await seedLandingPage(prisma)
  await seedCollaborationPage(prisma)
  await seedHeaderFooterContent(prisma)
  await seedAgendaPage(prisma)
}
