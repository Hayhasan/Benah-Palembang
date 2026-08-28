import "server-only"

import type { Prisma } from "@prisma/client"

import type { HeaderFooterContentData } from "../types/header-footer-content"

export const headerFooterContentSelect = {
  key: true,
  logoImageUrl: true,
  logoImageAlt: true,
  logoLinkUrl: true,
  footerDescription: true,
  exploreDescription: true,
  contactEmail: true,
  contactPhone: true,
  contactAddress: true,
  copyrightText: true,
  closingText: true,
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
      label: true,
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
      description: content.footerDescription,
      exploreDescription: content.exploreDescription,
      contactEmail: content.contactEmail,
      contactPhone: content.contactPhone,
      contactAddress: content.contactAddress,
      copyrightText: content.copyrightText,
      closingText: content.closingText,
      exploreLinks: content.footerExploreLinks,
      connectLinks: content.footerConnectLinks,
    },
  }
}
