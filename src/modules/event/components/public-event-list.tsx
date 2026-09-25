"use client"

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  MapPin,
  Ticket,
  ChevronDown,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { getIndonesianHoliday } from "@/lib/indonesian-holidays"
import { cn } from "@/lib/utils"
import { LandingHero } from "@/modules/website-content/components/landing-hero"
import type { AgendaPageData } from "@/modules/website-content/types/agenda-page"

import type { PublicEventListItem } from "../types/public-event"
import {
  AgendaCalendar,
  getDateKey,
  getEventDateKeys,
} from "./agenda-calendar"

const INITIAL_EVENT_COUNT = 6

export function PublicEventList({
  content,
  events,
}: {
  content: AgendaPageData
  events: PublicEventListItem[]
}) {
  const [displayCount, setDisplayCount] = useState(INITIAL_EVENT_COUNT)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedEventId, setSelectedEventId] = useState<number | null>(null)

  const nowTime = new Date().getTime()

  const selectedDateHoliday = useMemo(() => {
    return selectedDate ? getIndonesianHoliday(selectedDate) : null
  }, [selectedDate])

  // Selected event (if clicked from right list or card)
  const selectedEvent = useMemo(() => {
    if (!selectedEventId) return null
    return events.find((e) => e.id === selectedEventId) || null
  }, [events, selectedEventId])

  // Events on selected date (if date clicked from calendar)
  const eventsOnSelectedDate = useMemo(() => {
    if (!selectedDate) return []
    const key = getDateKey(selectedDate)
    return events.filter((ev) => getEventDateKeys(ev).includes(key))
  }, [events, selectedDate])

  // All events sorted: upcoming first (nearest to farthest), then past
  const sortedEvents = useMemo(() => {
    return [...events].sort((first, second) => {
      const aEnd = new Date(first.endsAt ?? first.startsAt).getTime()
      const bEnd = new Date(second.endsAt ?? second.startsAt).getTime()
      const aUpcoming = aEnd >= nowTime
      const bUpcoming = bEnd >= nowTime

      if (aUpcoming && !bUpcoming) return -1
      if (!aUpcoming && bUpcoming) return 1

      if (aUpcoming && bUpcoming) {
        return (
          new Date(first.startsAt).getTime() -
          new Date(second.startsAt).getTime()
        )
      }
      return (
        new Date(second.startsAt).getTime() - new Date(first.startsAt).getTime()
      )
    })
  }, [events, nowTime])

  const visibleEvents = sortedEvents.slice(0, displayCount)
  const hasMore = sortedEvents.length > displayCount

  // Handlers for interactions
  const handleSelectDate = (date: Date | undefined) => {
    setSelectedDate(date)
    setSelectedEventId(null)
  }

  const handleSelectEvent = (event: PublicEventListItem) => {
    setSelectedEventId(event.id)
    setSelectedDate(undefined)
  }

  const handleResetToAll = () => {
    setSelectedDate(undefined)
    setSelectedEventId(null)
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

      {/* 2. DAFTAR AGENDA — 2-Column Layout */}
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 lg:gap-10 items-start">
          {/* LEFT COLUMN: List Preview Section with Left Square Thumbnails */}
          <div className="order-2 lg:order-1 lg:col-span-2">
            {/* CASE 1: Single Event Preview (when agenda on list is clicked) */}
            {selectedEvent ? (
              <div className="flex flex-col animate-in fade-in duration-200">
                {/* Header bar with Back button and Status */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
                  <div className="flex items-center gap-2">
                    <span className="inline-block rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-black text-white">
                      {selectedEvent.category}
                    </span>
                    {new Date(selectedEvent.startsAt).getTime() <= nowTime &&
                      new Date(
                        selectedEvent.endsAt ?? selectedEvent.startsAt
                      ).getTime() >= nowTime && (
                        <span className="inline-block rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-emerald-600 text-white animate-pulse">
                          Sedang Berlangsung
                        </span>
                      )}
                    {new Date(
                      selectedEvent.endsAt ?? selectedEvent.startsAt
                    ).getTime() < nowTime && (
                      <span className="inline-block rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-600">
                        Acara Telah Selesai
                      </span>
                    )}
                  </div>
                </div>

                {/* Box Preview with Square Thumbnail on Left */}
                <div className="border border-zinc-200 bg-white p-3 sm:p-6 shadow-xs flex flex-row gap-3 sm:gap-6">
                  {/* Left: Square Thumbnail */}
                  <Link
                    href={`/agenda/${selectedEvent.id}`}
                    className="relative size-24 sm:size-48 md:size-56 aspect-square shrink-0 overflow-hidden bg-zinc-100 group"
                  >
                    <Image
                      src={selectedEvent.bannerUrl}
                      alt={selectedEvent.title}
                      fill
                      sizes="(max-width: 640px) 100vw, 240px"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      priority
                    />
                  </Link>

                  {/* Right: Info in the Box */}
                  <div className="flex flex-1 flex-col justify-between min-w-0">
                    <div>
                      <h2 className="font-sans text-xl sm:text-2xl font-extrabold tracking-tight text-black leading-tight">
                        <Link
                          href={`/agenda/${selectedEvent.id}`}
                          className="hover:underline"
                        >
                          {selectedEvent.title}
                        </Link>
                      </h2>

                      {/* Metadata bar */}
                      <div className="flex flex-col sm:flex-row flex-wrap sm:items-center gap-y-1.5 sm:gap-x-4 my-2 sm:my-3 py-2 sm:py-2.5 border-y border-zinc-100 text-[11px] sm:text-xs text-black/80">
                        <div className="flex items-center gap-1.5">
                          <CalendarDays className="size-3 sm:size-3.5 text-black shrink-0" />
                          <span className="font-semibold">
                            {selectedEvent.dateLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock3 className="size-3 sm:size-3.5 text-black shrink-0" />
                          <span className="font-semibold">
                            {selectedEvent.timeLabel}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <MapPin className="size-3 sm:size-3.5 text-black shrink-0" />
                          <span className="font-semibold truncate max-w-[160px] sm:max-w-[200px]">
                            {selectedEvent.location}
                          </span>
                        </div>
                      </div>

                      {/* Description */}
                      {selectedEvent.description && (
                        <p className="hidden sm:block text-xs sm:text-sm text-zinc-600 leading-relaxed whitespace-pre-line">
                          {selectedEvent.description}
                        </p>
                      )}
                    </div>

                    {/* Organizer & Action Button */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 mt-4 border-t border-zinc-100">
                      {selectedEvent.organizer && (
                        <div className="text-xs text-zinc-500">
                          Penyelenggara:{" "}
                          <span className="font-bold text-black block sm:inline mt-1 sm:mt-0">
                            {selectedEvent.organizer}
                          </span>
                        </div>
                      )}
                      <Link
                        href={`/agenda/${selectedEvent.id}`}
                        className="inline-flex items-center justify-center gap-2 bg-black text-white px-3 sm:px-5 py-2 sm:py-2.5 text-[10px] sm:text-xs font-bold uppercase tracking-[0.12em] hover:bg-zinc-800 transition-colors w-full sm:w-auto mt-2 sm:mt-0 sm:ml-auto cursor-pointer"
                      >
                        <span>Lihat Detail Lengkap</span>
                        <ArrowRight className="size-3 sm:size-3.5" />
                      </Link>
                    </div>
                  </div>
                </div>
              </div>
            ) : selectedDate ? (
              /* CASE 2: Date clicked from Calendar */
              <div className="flex flex-col animate-in fade-in duration-200">
                {/* Header bar */}
                <div className="flex items-center justify-between pb-4 border-b border-zinc-200 mb-6">
                  <div>
                    <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-black">
                      Agenda:{" "}
                      {selectedDate.toLocaleDateString("id-ID", {
                        weekday: "long",
                        day: "numeric",
                        month: "long",
                        year: "numeric",
                        timeZone: "Asia/Jakarta",
                      })}
                    </h2>
                    <p className="text-xs text-zinc-500 mt-0.5">
                      {eventsOnSelectedDate.length} agenda ditemukan pada
                      tanggal ini.
                    </p>
                  </div>
                </div>

                {/* Indonesian Holiday / Hari Besar Banner */}
                {selectedDateHoliday && (
                  <div
                    className={cn(
                      "flex items-center gap-2.5 px-3.5 py-2.5 rounded border text-xs mb-5",
                      selectedDateHoliday.isHoliday
                        ? "bg-red-50 border-red-200 text-red-900"
                        : "bg-blue-50 border-blue-200 text-blue-900"
                    )}
                  >
                    <span
                      className={cn(
                        "px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider shrink-0",
                        selectedDateHoliday.isHoliday
                          ? "bg-red-600 text-white"
                          : "bg-blue-600 text-white"
                      )}
                    >
                      {selectedDateHoliday.isHoliday
                        ? "Libur Nasional"
                        : "Hari Besar"}
                    </span>
                    <span className="font-semibold">
                      {selectedDateHoliday.name}
                    </span>
                  </div>
                )}

                {eventsOnSelectedDate.length > 0 ? (
                  /* List of boxes with square thumbnails on the left */
                  <div className="flex flex-col space-y-4 sm:space-y-5">
                    {eventsOnSelectedDate.map((event) => {
                      const isOngoing =
                        new Date(event.startsAt).getTime() <= nowTime &&
                        new Date(event.endsAt ?? event.startsAt).getTime() >=
                          nowTime
                      const isPast =
                        new Date(event.endsAt ?? event.startsAt).getTime() <
                        nowTime

                      return (
                        <div
                          key={event.id}
                          className="group flex flex-row gap-3 sm:gap-5 p-3 sm:p-5 border border-zinc-200 bg-white shadow-xs hover:border-black transition-all"
                        >
                          {/* Square Thumbnail on Left */}
                          <Link
                            href={`/agenda/${event.id}`}
                            className="relative size-24 sm:size-40 md:size-44 aspect-square shrink-0 overflow-hidden bg-zinc-100"
                          >
                            <Image
                              src={event.bannerUrl}
                              alt={event.title}
                              fill
                              sizes="(max-width: 640px) 100vw, 180px"
                              className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                            />
                          </Link>

                          {/* Info on Right */}
                          <div className="flex flex-1 flex-col justify-between min-w-0">
                            <div>
                              <div className="flex items-center gap-2 mb-2 flex-wrap">
                                <span className="inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-black text-white">
                                  {event.category}
                                </span>
                                {isOngoing && (
                                  <span className="inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white animate-pulse">
                                    Sedang Berlangsung
                                  </span>
                                )}
                                {isPast && (
                                  <span className="inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-600">
                                    Acara Selesai
                                  </span>
                                )}
                              </div>

                              <h3 className="font-sans text-base sm:text-lg font-bold tracking-tight text-black leading-snug">
                                <Link
                                  href={`/agenda/${event.id}`}
                                  className="hover:underline"
                                >
                                  {event.title}
                                </Link>
                              </h3>

                              {event.description && (
                                <p className="mt-1.5 sm:mt-2 hidden sm:block text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                                  {event.description}
                                </p>
                              )}
                            </div>

                            {/* Metadata & Detail Button */}
                            <div className="mt-2 sm:mt-3.5 pt-2 sm:pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] sm:text-xs">
                              <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-1 sm:gap-x-4 sm:gap-y-1.5 text-[10px] sm:text-[11px] text-zinc-600">
                                <div className="flex items-center gap-1.5">
                                  <CalendarDays className="size-3 sm:size-3.5 text-black shrink-0" />
                                  <span>{event.dateLabel}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <Clock3 className="size-3 sm:size-3.5 text-black shrink-0" />
                                  <span>{event.timeLabel}</span>
                                </div>
                                <div className="flex items-center gap-1.5">
                                  <MapPin className="size-3 sm:size-3.5 text-black shrink-0" />
                                  <span className="truncate max-w-[140px] sm:max-w-[200px]">
                                    {event.location}
                                  </span>
                                </div>
                              </div>

                              <Link
                                href={`/agenda/${event.id}`}
                                className="hidden sm:inline-flex items-center gap-1.5 bg-black text-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                              >
                                <span>Detail Acara</span>
                                <ArrowRight className="size-3" />
                              </Link>
                            </div>
                          </div>
                        </div>
                      )
                    })}
                  </div>
                ) : (
                  /* 0 events on this date -> Empty State */
                  <div className="border border-dashed border-zinc-300 rounded-lg p-12 text-center my-6 bg-zinc-50/50">
                    <div className="mx-auto flex size-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400 mb-3">
                      <CalendarDays className="size-7 text-zinc-500" />
                    </div>
                    <h3 className="font-sans text-lg font-bold text-black">
                      Tidak Ada Agenda
                    </h3>
                    <p className="mt-1 font-serif text-sm text-zinc-500 max-w-sm mx-auto">
                      {selectedDateHoliday ? (
                        <span>
                          Tanggal ini bertepatan dengan{" "}
                          <strong className="text-zinc-800">
                            {selectedDateHoliday.name} (
                            {selectedDateHoliday.description})
                          </strong>
                          , namun belum ada kegiatan atau agenda yang terjadwal.
                        </span>
                      ) : (
                        `Tidak ada agenda yang dijadwalkan pada hari ${selectedDate.toLocaleDateString(
                          "id-ID",
                          {
                            weekday: "long",
                            day: "numeric",
                            month: "long",
                            year: "numeric",
                            timeZone: "Asia/Jakarta",
                          }
                        )}.`
                      )}
                    </p>
                    <button
                      type="button"
                      onClick={handleResetToAll}
                      className="mt-5 inline-flex items-center gap-1.5 rounded-none border border-black bg-black px-5 py-2.5 text-xs font-bold uppercase tracking-wider text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                    >
                      Lihat Semua Agenda
                    </button>
                  </div>
                )}
              </div>
            ) : (
              /* CASE 3: Default view (All events in list with square thumbnails on left) */
              <div>
                <div className="pb-4 border-b border-zinc-200 mb-6">
                  <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
                    Agenda Palembang
                  </h1>
                  <p className="mt-1 font-serif text-sm text-black/70">
                    Jadwal acara, festival, pameran, dan kegiatan kreatif terkini di kota.
                  </p>
                </div>

                {visibleEvents.length > 0 ? (
                  <div>
                    {/* List of Boxes with Square Thumbnails on Left */}
                    <div className="flex flex-col space-y-4 sm:space-y-5">
                      {visibleEvents.map((event) => {
                        const isOngoing =
                          new Date(event.startsAt).getTime() <= nowTime &&
                          new Date(event.endsAt ?? event.startsAt).getTime() >=
                            nowTime
                        const isPast =
                          new Date(event.endsAt ?? event.startsAt).getTime() <
                          nowTime

                        return (
                          <div
                            key={event.id}
                            className="group flex flex-row gap-3 sm:gap-5 p-3 sm:p-5 border border-zinc-200 bg-white shadow-xs hover:border-black transition-all"
                          >
                            {/* Square Thumbnail on Left */}
                            <Link
                              href={`/agenda/${event.id}`}
                              className="relative size-24 sm:size-40 md:size-44 aspect-square shrink-0 overflow-hidden bg-zinc-100"
                            >
                              <Image
                                src={event.bannerUrl}
                                alt={event.title}
                                fill
                                sizes="(max-width: 640px) 100vw, 180px"
                                className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                              />
                            </Link>

                            {/* Info on Right */}
                            <div className="flex flex-1 flex-col justify-between min-w-0">
                              <div>
                                <div className="flex items-center gap-2 mb-2 flex-wrap">
                                  <span className="inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-black text-white">
                                    {event.category}
                                  </span>
                                  {isOngoing && (
                                    <span className="inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white animate-pulse">
                                      Sedang Berlangsung
                                    </span>
                                  )}
                                  {isPast && (
                                    <span className="inline-block rounded-[2px] px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-600">
                                      Acara Selesai
                                    </span>
                                  )}
                                </div>

                                <h3 className="font-sans text-base sm:text-lg font-bold tracking-tight text-black leading-snug">
                                  <Link
                                    href={`/agenda/${event.id}`}
                                    className="hover:underline"
                                  >
                                    {event.title}
                                  </Link>
                                </h3>

                                {event.description && (
                                  <p className="mt-1.5 sm:mt-2 hidden sm:block text-xs sm:text-sm text-zinc-600 line-clamp-2 leading-relaxed">
                                    {event.description}
                                  </p>
                                )}
                              </div>

                              {/* Metadata & Detail Button */}
                              <div className="mt-2 sm:mt-3.5 pt-2 sm:pt-3 border-t border-zinc-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-[10px] sm:text-xs">
                                <div className="flex flex-col sm:flex-row sm:flex-wrap sm:items-center gap-y-1 sm:gap-x-4 sm:gap-y-1.5 text-[10px] sm:text-[11px] text-zinc-600">
                                  <div className="flex items-center gap-1.5">
                                    <CalendarDays className="size-3 sm:size-3.5 text-black shrink-0" />
                                    <span>{event.dateLabel}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <Clock3 className="size-3 sm:size-3.5 text-black shrink-0" />
                                    <span>{event.timeLabel}</span>
                                  </div>
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="size-3 sm:size-3.5 text-black shrink-0" />
                                    <span className="truncate max-w-[140px] sm:max-w-[200px]">
                                      {event.location}
                                    </span>
                                  </div>
                                </div>

                                <Link
                                  href={`/agenda/${event.id}`}
                                  className="hidden sm:inline-flex items-center gap-1.5 bg-black text-white px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wider hover:bg-zinc-800 transition-colors shrink-0 self-start sm:self-auto cursor-pointer"
                                >
                                  <span>Detail Acara</span>
                                  <ArrowRight className="size-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        )
                      })}
                    </div>

                    {hasMore && (
                      <div className="mt-12 flex justify-center">
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
                      Tidak Ada Agenda
                    </h2>
                    <p className="mt-2 font-serif text-sm text-zinc-500">
                      Belum ada agenda yang dijadwalkan saat ini.
                    </p>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* RIGHT COLUMN: Calendar & List View */}
          <div className="order-1 lg:order-2 lg:col-span-1">
            <AgendaCalendar
              events={events}
              selectedDate={selectedDate}
              onSelectDate={handleSelectDate}
              selectedEventId={selectedEventId}
              onSelectEvent={handleSelectEvent}
            />
          </div>
        </div>
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  )
}
