import "server-only"

import type {
  Prisma,
  WebsiteCollaborationAspectRatio,
  WebsiteCollaborationPlatform,
} from "@prisma/client"

import type {
  CollaborationAspectRatio,
  CollaborationPageData,
  CollaborationPlatform,
} from "../types/collaboration-page"

export const collaborationPageSelect = {
  key: true,
  heroImageUrl: true,
  heroImageAlt: true,
  heroEyebrow: true,
  heroTitle: true,
  heroDescription: true,
  contactEmail: true,
  contactPhone: true,
  emailUrl: true,
  whatsappUrl: true,
  formTitle: true,
  formDescription: true,
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
      title: true,
      thumbnailUrl: true,
      contentUrl: true,
      aspectRatio: true,
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

const aspectRatioMap: Record<
  WebsiteCollaborationAspectRatio,
  CollaborationAspectRatio
> = {
  PORTRAIT_9_16: "9:16",
  PORTRAIT_4_5: "4:5",
  LANDSCAPE_16_9: "16:9",
  SQUARE_1_1: "1:1",
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

export const collaborationAspectRatioToDatabase: Record<
  CollaborationAspectRatio,
  WebsiteCollaborationAspectRatio
> = {
  "9:16": "PORTRAIT_9_16",
  "4:5": "PORTRAIT_4_5",
  "16:9": "LANDSCAPE_16_9",
  "1:1": "SQUARE_1_1",
}

export function collaborationPlatformFromDatabase(
  platform: WebsiteCollaborationPlatform,
) {
  return platformMap[platform]
}

export function collaborationAspectRatioFromDatabase(
  aspectRatio: WebsiteCollaborationAspectRatio,
) {
  return aspectRatioMap[aspectRatio]
}

export function mapCollaborationContentToPage(
  content: CollaborationContentRecord,
): CollaborationPageData {
  return {
    key: "collaboration",
    hero: {
      imageUrl: content.heroImageUrl,
      imageAlt: content.heroImageAlt,
      eyebrow: content.heroEyebrow,
      title: content.heroTitle,
      description: content.heroDescription,
    },
    contact: {
      email: content.contactEmail,
      phone: content.contactPhone,
      emailUrl: content.emailUrl,
      whatsappUrl: content.whatsappUrl,
    },
    form: {
      title: content.formTitle,
      description: content.formDescription,
    },
    partnerLogos: content.partnerLogos,
    partnerContents: content.partnerContents.map((item) => ({
      ...item,
      platform: collaborationPlatformFromDatabase(item.platform),
      aspectRatio: collaborationAspectRatioFromDatabase(item.aspectRatio),
    })),
  }
}
