import "server-only"

import type { Prisma } from "@prisma/client"
import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { DEFAULT_LANDING_PAGE } from "../constants/default-landing-page"
import type { LandingPageEditorData } from "../types/landing-page-editor"

export const landingPageEditorSelect = {
  key: true,
  aboutEyebrow: true,
  aboutEstablishedText: true,
  aboutTitle: true,
  aboutDescription: true,
  aboutClosingText: true,
  exploreEyebrow: true,
  exploreTitle: true,
  teamEyebrow: true,
  teamTitle: true,
  teamDescription: true,
  ctaEyebrow: true,
  ctaTitle: true,
  ctaDescription: true,
  ctaButtonLabel: true,
  ctaButtonUrl: true,
  heroSlides: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      imageUrl: true,
      imageAlt: true,
      eyebrow: true,
      title: true,
      description: true,
      buttonLabel: true,
      buttonUrl: true,
      position: true,
      isVisible: true,
    },
  },
  exploreItems: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      label: true,
      linkUrl: true,
      storyCount: true,
      position: true,
      isVisible: true,
    },
  },
  articleSections: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      sectionKey: true,
      articleCategorySlug: true,
      eyebrow: true,
      title: true,
      description: true,
      backgroundImageUrl: true,
      linkLabel: true,
      theme: true,
      layout: true,
      maxItems: true,
      position: true,
      isVisible: true,
    },
  },
  teamMembers: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      name: true,
      role: true,
      imageUrl: true,
      bio: true,
      position: true,
      isVisible: true,
    },
  },
} satisfies Prisma.WebsiteContentSelect

type WebsiteContentEditorRecord = Prisma.WebsiteContentGetPayload<{
  select: typeof landingPageEditorSelect
}>

export function mapWebsiteContentToEditor(
  content: WebsiteContentEditorRecord,
): LandingPageEditorData {
  const articleSectionsByKey = new Map(
    content.articleSections.map((section) => [section.sectionKey, section]),
  )

  return {
    key: "home",
    heroSlides: content.heroSlides.map((slide) => ({
      ...slide,
      clientKey: `hero-${slide.id}`,
    })),
    about: {
      eyebrow: content.aboutEyebrow,
      establishedText: content.aboutEstablishedText,
      title: content.aboutTitle,
      description: content.aboutDescription,
      closingText: content.aboutClosingText,
    },
    explore: {
      eyebrow: content.exploreEyebrow,
      title: content.exploreTitle,
      items: content.exploreItems.map((item) => ({
        ...item,
        clientKey: `explore-${item.id}`,
      })),
    },
    articleSections: DEFAULT_LANDING_PAGE.articleSections.map(
      (defaultSection, index) => {
        const section = articleSectionsByKey.get(defaultSection.sectionKey)
        return section
          ? {
              ...section,
              clientKey: `article-section-${section.id}`,
            }
          : {
              ...defaultSection,
              id: null,
              clientKey: `default-article-section-${index + 1}`,
            }
      },
    ),
    team: {
      eyebrow: content.teamEyebrow,
      title: content.teamTitle,
      description: content.teamDescription,
      members: content.teamMembers.map((member) => ({
        ...member,
        clientKey: `team-${member.id}`,
      })),
    },
    cta: {
      eyebrow: content.ctaEyebrow,
      title: content.ctaTitle,
      description: content.ctaDescription,
      buttonLabel: content.ctaButtonLabel,
      buttonUrl: content.ctaButtonUrl,
    },
  }
}

export function mapDefaultLandingPageToEditor(): LandingPageEditorData {
  return {
    ...DEFAULT_LANDING_PAGE,
    key: "home",
    heroSlides: DEFAULT_LANDING_PAGE.heroSlides.map((slide, index) => ({
      ...slide,
      id: null,
      clientKey: `default-hero-${index + 1}`,
    })),
    explore: {
      ...DEFAULT_LANDING_PAGE.explore,
      items: DEFAULT_LANDING_PAGE.explore.items.map((item, index) => ({
        ...item,
        id: null,
        clientKey: `default-explore-${index + 1}`,
      })),
    },
    articleSections: DEFAULT_LANDING_PAGE.articleSections.map(
      (section, index) => ({
        ...section,
        id: null,
        clientKey: `default-article-section-${index + 1}`,
      }),
    ),
    team: {
      ...DEFAULT_LANDING_PAGE.team,
      members: DEFAULT_LANDING_PAGE.team.members.map((member, index) => ({
        ...member,
        id: null,
        clientKey: `default-team-${index + 1}`,
      })),
    },
  }
}

export async function readLandingPageEditor(): Promise<LandingPageEditorData> {
  const content = await prisma.websiteContent.findFirst({
    where: { key: DEFAULT_LANDING_PAGE.key, deletedAt: null },
    select: landingPageEditorSelect,
  })

  return content
    ? mapWebsiteContentToEditor(content)
    : mapDefaultLandingPageToEditor()
}

export async function getLandingPageEditor(): Promise<LandingPageEditorData> {
  await requireRole(["ADMIN", "SUPERADMIN"])
  await connection()
  return readLandingPageEditor()
}
