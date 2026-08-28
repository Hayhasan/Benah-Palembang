import "server-only"

import type { Prisma } from "@prisma/client"

import type { AgendaPageData } from "../types/agenda-page"

export const agendaContentSelect = {
  key: true,
  heroImageUrl: true,
  heroImageAlt: true,
  heroEyebrow: true,
  heroTitle: true,
  heroDescription: true,
} satisfies Prisma.WebsiteAgendaContentSelect

type AgendaContentRecord = Prisma.WebsiteAgendaContentGetPayload<{
  select: typeof agendaContentSelect
}>

export function mapAgendaContent(content: AgendaContentRecord): AgendaPageData {
  return {
    key: "agenda",
    hero: {
      imageUrl: content.heroImageUrl,
      imageAlt: content.heroImageAlt,
      eyebrow: content.heroEyebrow,
      title: content.heroTitle,
      description: content.heroDescription,
    },
  }
}
