import "server-only"

import type { Prisma } from "@prisma/client"
import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { DEFAULT_HEADER_FOOTER_CONTENT } from "../constants/default-header-footer-content"
import type { HeaderFooterContentEditorData } from "../types/header-footer-content-editor"
import { footerConnectPlatformFromDatabase } from "./header-footer-content.mapper"

export const headerFooterContentEditorSelect = {
  key: true,
  logoImageUrl: true,
  footerLogoImageUrl: true,
  footerLogoImageAlt: true,
  footerTitle: true,
  footerDescription: true,
  footerCreatorText: true,
  copyrightText: true,

  footerConnectLinks: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: {
      id: true,
      platform: true,
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
      imageAlt: "", // Kept in Editor type but not DB
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
      connectLinks: content.footerConnectLinks.map((link) => ({
        ...link,
        platform: footerConnectPlatformFromDatabase(link.platform),
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
