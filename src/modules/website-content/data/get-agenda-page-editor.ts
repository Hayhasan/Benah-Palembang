import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { DEFAULT_AGENDA_PAGE } from "../constants/default-agenda-page"
import type { AgendaPageEditorData } from "../types/agenda-page-editor"
import { agendaContentSelect, mapAgendaContent } from "./agenda-content.mapper"

export async function readAgendaPageEditor(): Promise<AgendaPageEditorData> {
  const content = await prisma.websiteAgendaContent.findFirst({
    where: {
      key: DEFAULT_AGENDA_PAGE.key,
      deletedAt: null,
    },
    select: agendaContentSelect,
  })

  return content ? mapAgendaContent(content) : DEFAULT_AGENDA_PAGE
}

export async function getAgendaPageEditor(): Promise<AgendaPageEditorData> {
  await requireRole(["ADMIN", "SUPERADMIN"])
  await connection()
  return readAgendaPageEditor()
}
