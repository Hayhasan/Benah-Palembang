import type { AgendaPageData } from "../types/agenda-page"

export const DEFAULT_AGENDA_PAGE = {
  key: "agenda",
  hero: {
    imageUrl:
      "https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    imageAlt: "Agenda Palembang",
    eyebrow: "Agenda Palembang",
    title: "Temui, ikut, dan bergerak.",
    description:
      "Ruang-ruang pertemuan yang mempertemukan ide, orang, dan energi baik untuk Palembang.",
  },
} satisfies AgendaPageData
