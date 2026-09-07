import type { Metadata } from "next"

import { absoluteUrl, SITE_NAME } from "@/lib/seo/config"
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld"
import { PublicEventList } from "@/modules/event/components/public-event-list"
import { getPublicEvents } from "@/modules/event/data/get-public-events"
import { getAgendaPage } from "@/modules/website-content/data/get-agenda-page"

export const metadata: Metadata = {
  title: "Agenda & Event Palembang - Jadwal Acara & Kegiatan Terkini",
  description:
    "Temukan info lengkap jadwal acara, festival budaya, pameran kreatif, workshop, dan aneka kegiatan seru terkini di kota Palembang bersama Benah Palembang.",
  keywords: [
    "Agenda Palembang",
    "Event Palembang",
    "Jadwal Acara Palembang",
    "Kegiatan Palembang",
    "Info Palembang",
    "Festival Palembang",
    "Benah Palembang",
    "Palembang",
  ],
  alternates: {
    canonical: "/agenda",
  },
  openGraph: {
    title: `Agenda & Event Palembang | ${SITE_NAME}`,
    description:
      "Temukan jadwal acara, agenda kreatif, dan kegiatan komunitas terkini di Palembang.",
    url: absoluteUrl("/agenda"),
    siteName: SITE_NAME,
    type: "website",
    locale: "id_ID",
  },
}

export default async function Page() {
  const [content, events] = await Promise.all([
    getAgendaPage(),
    getPublicEvents(),
  ])

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Agenda", url: "/agenda" },
        ]}
      />
      <PublicEventList content={content} events={events} />
    </>
  )
}

