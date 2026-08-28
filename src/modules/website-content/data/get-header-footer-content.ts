import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import { DEFAULT_HEADER_FOOTER_CONTENT } from "../constants/default-header-footer-content"
import type { HeaderFooterContentData } from "../types/header-footer-content"
import {
  headerFooterContentSelect,
  mapHeaderFooterContent,
} from "./header-footer-content.mapper"

export async function getHeaderFooterContent(): Promise<HeaderFooterContentData> {
  await connection()

  const content = await prisma.websiteHeaderFooterContent.findFirst({
    where: {
      key: DEFAULT_HEADER_FOOTER_CONTENT.key,
      deletedAt: null,
    },
    select: headerFooterContentSelect,
  })

  return content
    ? mapHeaderFooterContent(content)
    : DEFAULT_HEADER_FOOTER_CONTENT
}
