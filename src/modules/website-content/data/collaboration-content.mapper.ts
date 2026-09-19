import "server-only"

import type {
  Prisma,
  WebsiteCollaborationPlatform,
} from "@prisma/client"

import type {
  CollaborationPageData,
  CollaborationPlatform,
} from "../types/collaboration-page"

export const collaborationPageSelect = {
  key: true,
  heroSlides: {
    where: { deletedAt: null, isVisible: true },
    orderBy: { position: "asc" },
    select: {
      imageUrl: true,
      imageAlt: true,
      title: true,
      description: true,
      position: true,
      isVisible: true,
    },
  },
  contactEmail: true,
  contactPhone: true,
  emailUrl: true,
  whatsappUrl: true,
  partnerLogos: {
    where: { deletedAt: null, isVisible: true },
    orderBy: { position: "asc" },
    select: {
      name: true,
      imageUrl: true,
      position: true,
      isVisible: true,
    },
  },
  partnerContents: {
    where: { deletedAt: null, isVisible: true },
    orderBy: { position: "asc" },
    select: {
      platform: true,
      contentUrl: true,
      position: true,
      isVisible: true,
    },
  },
} satisfies Prisma.WebsiteCollaborationContentSelect

type CollaborationContentRecord =
  Prisma.WebsiteCollaborationContentGetPayload<{
    select: typeof collaborationPageSelect
  }>

const platformMap: Record<
  WebsiteCollaborationPlatform,
  CollaborationPlatform
> = {
  YOUTUBE: "youtube",
  INSTAGRAM: "instagram",
  TIKTOK: "tiktok",
  FACEBOOK: "facebook",
  X: "x",
}

export const collaborationPlatformToDatabase: Record<
  CollaborationPlatform,
  WebsiteCollaborationPlatform
> = {
  youtube: "YOUTUBE",
  instagram: "INSTAGRAM",
  tiktok: "TIKTOK",
  facebook: "FACEBOOK",
  x: "X",
}

export function collaborationPlatformFromDatabase(
  platform: WebsiteCollaborationPlatform,
) {
  return platformMap[platform]
}

export function mapCollaborationContentToPage(
  content: CollaborationContentRecord,
): CollaborationPageData {
  return {
    key: "collaboration",
    heroSlides: content.heroSlides,
    contact: {
      email: content.contactEmail,
      phone: content.contactPhone,
      emailUrl: content.emailUrl,
      whatsappUrl: content.whatsappUrl,
    },
    partnerLogos: content.partnerLogos,
    partnerContents: content.partnerContents.map((item) => ({
      ...item,
      platform: collaborationPlatformFromDatabase(item.platform),
    })),
  }
}
