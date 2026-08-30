import "server-only"

import type {
  Prisma,
  WebsiteFooterConnectPlatform,
} from "@prisma/client"

import type {
  FooterConnectPlatform,
  HeaderFooterContentData,
} from "../types/header-footer-content"

const footerConnectPlatformMap: Record<
  WebsiteFooterConnectPlatform,
  FooterConnectPlatform
> = {
  INSTAGRAM: "instagram",
  WHATSAPP: "whatsapp",
  YOUTUBE: "youtube",
  TIKTOK: "tiktok",
  LINKEDIN: "linkedin",
  X: "x",
  FACEBOOK: "facebook",
  MAIL: "mail",
  WEBSITE: "website",
}

export const footerConnectPlatformToDatabase: Record<
  FooterConnectPlatform,
  WebsiteFooterConnectPlatform
> = {
  instagram: "INSTAGRAM",
  whatsapp: "WHATSAPP",
  youtube: "YOUTUBE",
  tiktok: "TIKTOK",
  linkedin: "LINKEDIN",
  x: "X",
  facebook: "FACEBOOK",
  mail: "MAIL",
  website: "WEBSITE",
}

export function footerConnectPlatformFromDatabase(
  platform: WebsiteFooterConnectPlatform,
) {
  return footerConnectPlatformMap[platform]
}

export const headerFooterContentSelect = {
  key: true,
  logoImageUrl: true,
  logoImageAlt: true,
  logoLinkUrl: true,
  footerBackgroundText: true,
  footerDescription: true,
  copyrightText: true,
  footerExploreLinks: {
    where: { deletedAt: null, isVisible: true },
    orderBy: { position: "asc" },
    select: {
      label: true,
      linkUrl: true,
      position: true,
      isVisible: true,
    },
  },
  footerConnectLinks: {
    where: { deletedAt: null, isVisible: true },
    orderBy: { position: "asc" },
    select: {
      platform: true,
      linkUrl: true,
      position: true,
      isVisible: true,
    },
  },
} satisfies Prisma.WebsiteHeaderFooterContentSelect

type HeaderFooterContentRecord =
  Prisma.WebsiteHeaderFooterContentGetPayload<{
    select: typeof headerFooterContentSelect
  }>

export function mapHeaderFooterContent(
  content: HeaderFooterContentRecord,
): HeaderFooterContentData {
  return {
    key: "header-footer",
    logo: {
      imageUrl: content.logoImageUrl,
      imageAlt: content.logoImageAlt,
      linkUrl: content.logoLinkUrl,
    },
    footer: {
      backgroundText: content.footerBackgroundText,
      description: content.footerDescription,
      copyrightText: content.copyrightText,
      exploreLinks: content.footerExploreLinks,
      connectLinks: content.footerConnectLinks.map((link) => ({
        ...link,
        platform: footerConnectPlatformFromDatabase(link.platform),
      })),
    },
  }
}
