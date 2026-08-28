import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import { DEFAULT_AGENDA_PAGE } from "../constants/default-agenda-page"
import type { AgendaPageData } from "../types/agenda-page"
import { agendaContentSelect, mapAgendaContent } from "./agenda-content.mapper"

export async function getAgendaPage(): Promise<AgendaPageData> {
  await connection()

  const content = await prisma.websiteAgendaContent.findFirst({
    where: {
      key: DEFAULT_AGENDA_PAGE.key,
      deletedAt: null,
    },
    select: agendaContentSelect,
  })

  return content ? mapAgendaContent(content) : DEFAULT_AGENDA_PAGE
}
