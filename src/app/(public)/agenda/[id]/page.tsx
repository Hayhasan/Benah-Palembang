import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { absoluteUrl, SITE_NAME } from "@/lib/seo/config"
import { BreadcrumbJsonLd, EventJsonLd } from "@/lib/seo/json-ld"
import { PublicEventDetail } from "@/modules/event/components/public-event-detail"
import {
  getPublicEvent,
  getPublicEventMeta,
} from "@/modules/event/data/get-public-event"

interface PageProps {
  params: Promise<{ id: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { id } = await params

  if (!/^[1-9]\d*$/.test(id)) return {}

  const event = await getPublicEventMeta(Number(id))
  if (!event) return {}

  const title = `${event.title} - Agenda Palembang`
  const description = `${event.title} diselenggarakan oleh ${event.organizer} di ${event.location}. ${event.description}`.slice(
    0,
    160,
  )
  const url = absoluteUrl(`/agenda/${id}`)
  const imageUrl = event.bannerUrl

  return {
    title,
    description,
    keywords: [
      event.title,
      event.category,
      event.location,
      "Agenda Palembang",
      "Event Palembang",
      "Kegiatan Palembang",
      "Benah Palembang",
      "Palembang",
    ],
    alternates: {
      canonical: `/agenda/${id}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "website",
      locale: "id_ID",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { id } = await params

  if (!/^[1-9]\d*$/.test(id)) notFound()

  const data = await getPublicEvent(Number(id))
  if (!data) notFound()

  const { event } = data

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Agenda", url: "/agenda" },
          { name: event.title, url: `/agenda/${event.id}` },
        ]}
      />
      <EventJsonLd
        title={event.title}
        description={event.description}
        imageUrl={event.bannerUrl}
        startDate={event.dateLabel}
        location={event.location}
        organizer={event.organizer}
        eventUrl={`/agenda/${event.id}`}
      />
      <PublicEventDetail data={data} />
    </>
  )
}

