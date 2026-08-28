import "server-only"

import type { Prisma } from "@prisma/client"
import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { DEFAULT_COLLABORATION_PAGE } from "../constants/default-collaboration-page"
import type { CollaborationPageEditorData } from "../types/collaboration-page-editor"
import {
  collaborationAspectRatioFromDatabase,
  collaborationPlatformFromDatabase,
} from "./collaboration-content.mapper"

export const collaborationPageEditorSelect = {
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
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      name: true,
      imageUrl: true,
      position: true,
      isVisible: true,
    },
  },
  partnerContents: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
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

type CollaborationContentEditorRecord =
  Prisma.WebsiteCollaborationContentGetPayload<{
    select: typeof collaborationPageEditorSelect
  }>

export function mapCollaborationContentToEditor(
  content: CollaborationContentEditorRecord,
): CollaborationPageEditorData {
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
    partnerLogos: content.partnerLogos.map((logo) => ({
      ...logo,
      clientKey: `collaboration-logo-${logo.id}`,
    })),
    partnerContents: content.partnerContents.map((item) => ({
      ...item,
      platform: collaborationPlatformFromDatabase(item.platform),
      aspectRatio: collaborationAspectRatioFromDatabase(item.aspectRatio),
      clientKey: `collaboration-content-${item.id}`,
    })),
  }
}

export function mapDefaultCollaborationPageToEditor(): CollaborationPageEditorData {
  return {
    ...DEFAULT_COLLABORATION_PAGE,
    partnerLogos: DEFAULT_COLLABORATION_PAGE.partnerLogos.map(
      (logo, index) => ({
        ...logo,
        id: null,
        clientKey: `default-collaboration-logo-${index + 1}`,
      }),
    ),
    partnerContents: DEFAULT_COLLABORATION_PAGE.partnerContents.map(
      (item, index) => ({
        ...item,
        id: null,
        clientKey: `default-collaboration-content-${index + 1}`,
      }),
    ),
  }
}

export async function readCollaborationPageEditor(): Promise<CollaborationPageEditorData> {
  const content = await prisma.websiteCollaborationContent.findFirst({
    where: {
      key: DEFAULT_COLLABORATION_PAGE.key,
      deletedAt: null,
    },
    select: collaborationPageEditorSelect,
  })

  return content
    ? mapCollaborationContentToEditor(content)
    : mapDefaultCollaborationPageToEditor()
}

export async function getCollaborationPageEditor(): Promise<CollaborationPageEditorData> {
  await requireRole(["ADMIN", "SUPERADMIN"])
  await connection()
  return readCollaborationPageEditor()
}
