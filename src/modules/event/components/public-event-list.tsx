"use client"

import {
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { LandingHero } from "@/modules/website-content/components/landing-hero"
import type { AgendaPageData } from "@/modules/website-content/types/agenda-page"

import type { PublicEventListItem } from "../types/public-event"

type EventFilter = "this-month" | "upcoming" | "past"

const INITIAL_EVENT_COUNT = 6
const EVENT_TIME_ZONE = "Asia/Jakarta"

const datePartFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  timeZone: EVENT_TIME_ZONE,
  year: "numeric",
})

function getMonthKey(date: Date) {
  const parts = datePartFormatter.formatToParts(date)
  const month = parts.find((part) => part.type === "month")?.value
  const year = parts.find((part) => part.type === "year")?.value

  return `${year}-${month}`
}

function filterEvents(
  events: PublicEventListItem[],
  filter: EventFilter,
  now: Date,
) {
  const nowTime = now.getTime()
  const currentMonth = getMonthKey(now)

  return events
    .filter((event) => {
      const startsAt = new Date(event.startsAt)
      const endsAt = new Date(event.endsAt ?? event.startsAt)

      if (filter === "this-month") {
        return getMonthKey(startsAt) === currentMonth
      }

      if (filter === "upcoming") return endsAt.getTime() >= nowTime

      return endsAt.getTime() < nowTime
    })
    .sort((first, second) => {
      const difference =
        new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime()

      return filter === "past" ? -difference : difference
    })
}

export function PublicEventList({
  content,
  events,
}: {
  content: AgendaPageData
  events: PublicEventListItem[]
}) {
  const [filter, setFilter] = useState<EventFilter>("this-month")
  const [displayCount, setDisplayCount] = useState(INITIAL_EVENT_COUNT)
  const filteredEvents = filterEvents(events, filter, new Date())
  const visibleEvents = filteredEvents.slice(0, displayCount)
  const hasMore = filteredEvents.length > displayCount

  function selectFilter(nextFilter: EventFilter) {
    setFilter(nextFilter)
    setDisplayCount(INITIAL_EVENT_COUNT)
  }

  // Generate hero slides from events or agenda content
  const heroSlides =
    events.length > 0
      ? events.slice(0, 3).map((ev, idx) => ({
          imageUrl: ev.bannerUrl,
          imageAlt: ev.title,
          eyebrow: "AGENDA PALEMBANG",
          title: ev.title,
          description: ev.description,
          buttonLabel: "LIHAT DETAIL ACARA",
          buttonUrl: `/agenda/${ev.id}`,
          position: idx + 1,
          isVisible: true,
        }))
      : [
          {
            imageUrl: content.hero.imageUrl,
            imageAlt: content.hero.imageAlt || content.hero.title,
            eyebrow: content.hero.eyebrow || "AGENDA KOTA",
            title: content.hero.title,
            description: content.hero.description,
            buttonLabel: "JELAJAHI AGENDA",
            buttonUrl: "/agenda",
            position: 1,
            isVisible: true,
          },
        ]

  return (
    <div className="bg-white text-zinc-900">
      {/* 1. HEROES: 3-Panel Carousel */}
      <LandingHero slides={heroSlides} />

      {/* 2. DAFTAR AGENDA */}
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {/* Page Title with thin divider */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b border-zinc-200 mb-8">
          <div>
            <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
              Agenda Palembang
            </h1>
            <p className="mt-1 font-serif text-sm text-black/70">
              Jadwal acara, festival, pameran, dan kegiatan kreatif terkini di kota.
            </p>
          </div>

          {/* Filter Tabs: This Month, Upcoming, Past Event */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
            {[
              ["this-month", "This Month"],
              ["upcoming", "Upcoming"],
              ["past", "Past Event"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => selectFilter(value as EventFilter)}
                className={`whitespace-nowrap rounded-[3px] px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.1em] transition-all border ${
                  filter === value
                    ? "bg-black text-white border-black shadow-xs"
                    : "bg-[#e5e3de] text-black border-zinc-300 hover:bg-[#d8d6d0]"
                }`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>

        {/* Event Cards 3-Column Grid */}
        {visibleEvents.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
              {visibleEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/agenda/${event.id}`}
                  className="group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                    <Image
                      src={event.bannerUrl}
                      alt={event.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>
                    <div className="flex flex-1 flex-col pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/70">
                      {event.category}
                    </p>
                    <h3 className="mt-1 font-sans text-base sm:text-lg font-bold leading-snug tracking-tight text-black group-hover:underline line-clamp-2 min-h-[44px] sm:min-h-[48px]">
                      {event.title}
                    </h3>

                    {/* Dotted Divider */}
                    <div className="my-2 border-b border-dotted border-zinc-300" />

                    <div className="mt-auto flex flex-col space-y-1 text-xs text-black/80">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-black shrink-0" />
                        <span>{event.dateLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <Clock3 className="size-3.5 text-black shrink-0" />
                        <span>{event.timeLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-black shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>

            {hasMore && (
              <div className="mt-14 flex justify-center">
                <button
                  type="button"
                  onClick={() => setDisplayCount((prev) => prev + 6)}
                  className="flex items-center gap-2 rounded-none border border-black bg-white px-8 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                >
                  More Articles
                  <ChevronDown className="size-3.5" />
                </button>
              </div>
            )}
          </div>
        ) : (
          <div className="min-h-[30vh] flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <Ticket className="size-6" />
            </div>
            <h2 className="font-sans text-xl font-bold text-zinc-800">
              Belum ada agenda pada periode ini
            </h2>
            <p className="mt-2 font-serif text-sm text-zinc-500">
              Pilih filter waktu lainnya untuk melihat jadwal agenda Benah Palembang.
            </p>
          </div>
        )}
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  )
}
