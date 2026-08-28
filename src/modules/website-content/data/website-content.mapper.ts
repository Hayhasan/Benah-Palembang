import "server-only"

import type { Prisma } from "@prisma/client"

import type { LandingPageData } from "../types/landing-page"

export const landingPageSelect = {
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
    where: { deletedAt: null, isVisible: true },
    orderBy: { position: "asc" },
    select: {
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
    where: { deletedAt: null, isVisible: true },
    orderBy: { position: "asc" },
    select: {
      label: true,
      linkUrl: true,
      storyCount: true,
      position: true,
      isVisible: true,
    },
  },
  articleSections: {
    where: { deletedAt: null, isVisible: true },
    orderBy: { position: "asc" },
    select: {
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
    where: { deletedAt: null, isVisible: true },
    orderBy: { position: "asc" },
    select: {
      name: true,
      role: true,
      imageUrl: true,
      bio: true,
      position: true,
      isVisible: true,
    },
  },
} satisfies Prisma.WebsiteContentSelect

type WebsiteContentRecord = Prisma.WebsiteContentGetPayload<{
  select: typeof landingPageSelect
}>

export function mapWebsiteContentToLandingPage(
  content: WebsiteContentRecord,
): LandingPageData {
  return {
    key: content.key,
    heroSlides: content.heroSlides,
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
      items: content.exploreItems,
    },
    articleSections: content.articleSections,
    team: {
      eyebrow: content.teamEyebrow,
      title: content.teamTitle,
      description: content.teamDescription,
      members: content.teamMembers,
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
