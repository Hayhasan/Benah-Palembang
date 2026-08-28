"use client"

import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import type { AgendaPageData } from "@/modules/website-content/types/agenda-page"

import type { PublicEventListItem } from "../types/public-event"

type EventFilter = "this-month" | "upcoming" | "past"

const INITIAL_EVENT_COUNT = 4
const EVENT_TIME_ZONE = "Asia/Jakarta"

const datePartFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  timeZone: EVENT_TIME_ZONE,
  year: "numeric",
})

function AgendaHeroTitle({ title }: { title: string }) {
  const breakIndex = title.lastIndexOf(",")

  if (breakIndex === -1) return title

  return (
    <>
      {title.slice(0, breakIndex + 1)}
      <br />
      {title.slice(breakIndex + 1).trimStart()}
    </>
  )
}

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
  const [showAll, setShowAll] = useState(false)
  const filteredEvents = filterEvents(events, filter, new Date())
  const visibleEvents = showAll
    ? filteredEvents
    : filteredEvents.slice(0, INITIAL_EVENT_COUNT)
  const hasMore = !showAll && filteredEvents.length > INITIAL_EVENT_COUNT

  function selectFilter(nextFilter: EventFilter) {
    setFilter(nextFilter)
    setShowAll(false)
  }

  return (
    <>
      <div className="relative overflow-hidden bg-palembang-red px-6 pb-24 pt-40 text-white sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-30 sm:w-2/3 lg:w-1/2 lg:opacity-40">
          <Image
            src={content.hero.imageUrl}
            alt={content.hero.imageAlt}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, (min-width: 640px) 67vw, 100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-palembang-red via-palembang-red/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-palembang-red/40 via-transparent to-palembang-red" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">
            {content.hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl font-black leading-[0.9] tracking-[-0.065em] sm:text-8xl">
            <AgendaHeroTitle title={content.hero.title} />
          </h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-white/85">
            {content.hero.description}
          </p>
        </div>
      </div>

      <main className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex gap-4 overflow-x-auto border-b border-border pb-px">
            {[
              ["this-month", "This Month"],
              ["upcoming", "Upcoming"],
              ["past", "Past Event"],
            ].map(([value, label]) => (
              <button
                key={value}
                type="button"
                onClick={() => selectFilter(value as EventFilter)}
                className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                  filter === value
                    ? "border-palembang-red text-foreground"
                    : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {visibleEvents.length > 0 ? (
            <div className="relative">
              <div className="grid gap-8">
                {visibleEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/agenda/${event.id}`}
                    className="group grid gap-6 border-b border-border pb-8 md:grid-cols-[240px_1fr_220px] md:gap-10"
                  >
                    <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-2xl">
                      <Image
                        src={event.bannerUrl}
                        alt={event.title}
                        fill
                        sizes="(min-width: 768px) 240px, 100vw"
                        className="object-cover"
                      />
                    </div>
                    <div>
                      <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-palembang-red">
                        {event.category}
                      </p>
                      <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight tracking-[-0.04em] transition-colors group-hover:text-palembang-red">
                        {event.title}
                      </h2>
                      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                        {event.description}
                      </p>
                      <p className="mt-5 text-xs font-semibold text-muted-foreground">
                        {event.organizer}
                      </p>
                    </div>
                    <div className="flex flex-col justify-between text-sm">
                      <div className="space-y-2 text-muted-foreground">
                        <p className="flex items-start gap-2">
                          <CalendarDays className="mt-0.5 size-4 shrink-0 text-palembang-red" />
                          {event.dateLabel}
                        </p>
                        <p className="flex items-start gap-2">
                          <Clock3 className="mt-0.5 size-4 shrink-0 text-palembang-red" />
                          {event.timeLabel}
                        </p>
                        <p className="flex items-start gap-2">
                          <MapPin className="mt-0.5 size-4 shrink-0 text-palembang-red" />
                          {event.location}
                        </p>
                      </div>
                      <span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-all group-hover:border-palembang-red group-hover:text-palembang-red">
                        <Ticket className="size-4" />
                        Detail acara
                      </span>
                    </div>
                  </Link>
                ))}
              </div>

              {hasMore ? (
                <div className="absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-6 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="group flex items-center gap-3 rounded-full border border-border bg-background/95 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red"
                  >
                    Tampilkan Seluruh Agenda ({filteredEvents.length} Acara)
                    <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
              <CalendarDays className="mx-auto size-8 text-palembang-red" />
              <h2 className="mt-5 font-display text-2xl font-bold">
                Belum ada agenda pada periode ini
              </h2>
              <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
                Pilih filter waktu lainnya untuk melihat agenda Benah Palembang.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
