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
  headerBgColor: true,
  headerTextColor: true,
  headerButtonColor: true,
  footerLogoImageUrl: true,
  footerLogoImageAlt: true,
  footerTitle: true,
  footerDescription: true,
  footerCreatorText: true,
  copyrightText: true,
  footerBgColor: true,
  footerTextColor: true,
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
      imageAlt: "",
    },
    headerColors: {
      bgColor: content.headerBgColor,
      textColor: content.headerTextColor,
      buttonColor: content.headerButtonColor,
    },
    footer: {
      logo: {
        imageUrl: content.footerLogoImageUrl || "",
        imageAlt: content.footerLogoImageAlt || "",
      },
      title: content.footerTitle || "",
      description: content.footerDescription,
      creatorText: content.footerCreatorText,
      copyrightText: content.copyrightText,
      bgColor: content.footerBgColor,
      textColor: content.footerTextColor,
      connectLinks: content.footerConnectLinks.map((link) => ({
        ...link,
        platform: footerConnectPlatformFromDatabase(link.platform),
      })),
    },
  }
}
