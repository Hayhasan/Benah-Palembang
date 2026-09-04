import "server-only"

import type { Prisma, WebsiteExploreCountSource } from "@prisma/client"

import type {
  ExploreCountSource,
  LandingExploreItemData,
  LandingPageData,
} from "../types/landing-page"

const exploreCountSourceMap: Record<
  WebsiteExploreCountSource,
  ExploreCountSource
> = {
  MANUAL: "manual",
  ARTICLE_CATEGORY: "article-category",
  EVENT: "event",
  NONE: "none",
}

export const exploreCountSourceToDatabase: Record<
  ExploreCountSource,
  WebsiteExploreCountSource
> = {
  manual: "MANUAL",
  "article-category": "ARTICLE_CATEGORY",
  event: "EVENT",
  none: "NONE",
}

export function exploreCountSourceFromDatabase(
  countSource: WebsiteExploreCountSource,
) {
  return exploreCountSourceMap[countSource]
}

/**
 * Menerjemahkan satu explore item DTO menjadi row Prisma. Referensi kategori
 * dikirim sebagai sectionKey, sehingga FK-nya baru dapat diisi setelah article
 * section pada aggregate yang sama tersedia.
 */
export function exploreItemPersistenceData(
  item: LandingExploreItemData,
  position: number,
  sectionIdByKey: Map<string, number>,
) {
  const countArticleSectionId =
    item.countSource === "article-category" && item.countArticleSectionKey
      ? (sectionIdByKey.get(item.countArticleSectionKey) ?? null)
      : null

  if (item.countSource === "article-category" && countArticleSectionId === null) {
    throw new Error(
      `Kategori artikel untuk item jelajahi "${item.label}" tidak ditemukan.`,
    )
  }

  return {
    label: item.label,
    linkUrl: item.linkUrl,
    countSource: exploreCountSourceToDatabase[item.countSource],
    countArticleSectionId,
    countLabel: item.countSource === "none" ? null : item.countLabel,
    storyCount: item.countSource === "manual" ? item.storyCount : null,
    position,
    isVisible: item.isVisible,
  }
}

export const exploreItemSelect = {
  label: true,
  linkUrl: true,
  countSource: true,
  countLabel: true,
  storyCount: true,
  position: true,
  isVisible: true,
  countArticleSection: { select: { sectionKey: true, deletedAt: true } },
} satisfies Prisma.WebsiteExploreItemSelect

type ExploreItemRecord = Prisma.WebsiteExploreItemGetPayload<{
  select: typeof exploreItemSelect
}>

export function mapExploreItem(item: ExploreItemRecord) {
  const { countArticleSection, ...rest } = item

  return {
    ...rest,
    countSource: exploreCountSourceFromDatabase(item.countSource),
    countArticleSectionKey:
      countArticleSection && countArticleSection.deletedAt === null
        ? countArticleSection.sectionKey
        : null,
  }
}

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
  ctaBackgroundImageUrl: true,
  ctaContactLabel: true,
  ctaContactEmail: true,
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
    select: exploreItemSelect,
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
      items: content.exploreItems.map(mapExploreItem),
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
      backgroundImageUrl: content.ctaBackgroundImageUrl,
      contactLabel: content.ctaContactLabel,
      contactEmail: content.ctaContactEmail,
    },
  }
}
