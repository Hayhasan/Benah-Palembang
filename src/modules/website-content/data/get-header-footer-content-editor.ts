import "server-only"

import type { Prisma } from "@prisma/client"
import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { DEFAULT_HEADER_FOOTER_CONTENT } from "../constants/default-header-footer-content"
import type { HeaderFooterContentEditorData } from "../types/header-footer-content-editor"

export const headerFooterContentEditorSelect = {
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
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      label: true,
      linkUrl: true,
      position: true,
      isVisible: true,
    },
  },
  footerConnectLinks: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      label: true,
      linkUrl: true,
      position: true,
      isVisible: true,
    },
  },
} satisfies Prisma.WebsiteHeaderFooterContentSelect

type HeaderFooterContentEditorRecord =
  Prisma.WebsiteHeaderFooterContentGetPayload<{
    select: typeof headerFooterContentEditorSelect
  }>

export function mapHeaderFooterContentToEditor(
  content: HeaderFooterContentEditorRecord,
): HeaderFooterContentEditorData {
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
      exploreLinks: content.footerExploreLinks.map((link) => ({
        ...link,
        clientKey: `footer-explore-${link.id}`,
      })),
      connectLinks: content.footerConnectLinks.map((link) => ({
        ...link,
        clientKey: `footer-connect-${link.id}`,
      })),
    },
  }
}

export function mapDefaultHeaderFooterContentToEditor(): HeaderFooterContentEditorData {
  return {
    ...DEFAULT_HEADER_FOOTER_CONTENT,
    footer: {
      ...DEFAULT_HEADER_FOOTER_CONTENT.footer,
      exploreLinks: DEFAULT_HEADER_FOOTER_CONTENT.footer.exploreLinks.map(
        (link, index) => ({
          ...link,
          id: null,
          clientKey: `default-footer-explore-${index + 1}`,
        }),
      ),
      connectLinks: DEFAULT_HEADER_FOOTER_CONTENT.footer.connectLinks.map(
        (link, index) => ({
          ...link,
          id: null,
          clientKey: `default-footer-connect-${index + 1}`,
        }),
      ),
    },
  }
}

export async function readHeaderFooterContentEditor(): Promise<HeaderFooterContentEditorData> {
  const content = await prisma.websiteHeaderFooterContent.findFirst({
    where: {
      key: DEFAULT_HEADER_FOOTER_CONTENT.key,
      deletedAt: null,
    },
    select: headerFooterContentEditorSelect,
  })

  return content
    ? mapHeaderFooterContentToEditor(content)
    : mapDefaultHeaderFooterContentToEditor()
}

export async function getHeaderFooterContentEditor(): Promise<HeaderFooterContentEditorData> {
  await requireRole(["ADMIN", "SUPERADMIN"])
  await connection()
  return readHeaderFooterContentEditor()
}
