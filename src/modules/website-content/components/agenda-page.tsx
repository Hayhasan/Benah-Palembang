"use client"

import {
  CalendarDays,
  ChevronDown,
  Clock3,
  MapPin,
  Ticket,
} from "lucide-react"
import Link from "next/link"
import { useState } from "react"

import { agendaItems } from "@/data/mockData"
import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"

import type { AgendaPageData } from "../types/agenda-page"

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

export function AgendaPage({ data }: { data: AgendaPageData }) {
  const [filter, setFilter] = useState("this-month")
  const [showAll, setShowAll] = useState(false)

  const initialCount = 4
  const visibleAgenda = showAll
    ? agendaItems
    : agendaItems.slice(0, initialCount)
  const hasMore = !showAll && agendaItems.length > initialCount

  return (
    <>
      <div className="relative overflow-hidden bg-palembang-red px-6 pb-24 pt-40 text-white sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-30 sm:w-2/3 lg:w-1/2 lg:opacity-40">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.hero.imageUrl}
            alt={data.hero.imageAlt}
            className="size-full object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-palembang-red via-palembang-red/50 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-palembang-red/40 via-transparent to-palembang-red" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">
            {data.hero.eyebrow}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl font-black leading-[0.9] tracking-[-0.065em] sm:text-8xl">
            <AgendaHeroTitle title={data.hero.title} />
          </h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-white/85">
            {data.hero.description}
          </p>
        </div>
      </div>
      <main className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="mb-12 flex gap-4 overflow-x-auto border-b border-border pb-px">
            <button
              type="button"
              onClick={() => setFilter("this-month")}
              className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                filter === "this-month"
                  ? "border-palembang-red text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              This Month
            </button>
            <button
              type="button"
              onClick={() => setFilter("upcoming")}
              className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                filter === "upcoming"
                  ? "border-palembang-red text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Upcoming
            </button>
            <button
              type="button"
              onClick={() => setFilter("past")}
              className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${
                filter === "past"
                  ? "border-palembang-red text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              Past Event
            </button>
          </div>
          <div className="relative">
            <div className="grid gap-8">
              {visibleAgenda.map((item) => (
                <Link
                  key={item.id}
                  href={`/agenda/${item.id}`}
                  className="group grid gap-6 border-b border-border pb-8 md:grid-cols-[240px_1fr_220px] md:gap-10"
                >
                  <div className="img-zoom aspect-[4/3] overflow-hidden rounded-2xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.title}
                      className="size-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-palembang-red">
                      {item.category}
                    </p>
                    <h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight tracking-[-0.04em] transition-colors group-hover:text-palembang-red">
                      {item.title}
                    </h2>
                    <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                      {item.description}
                    </p>
                    <p className="mt-5 text-xs font-semibold text-muted-foreground">
                      {item.organizer}
                    </p>
                  </div>
                  <div className="flex flex-col justify-between text-sm">
                    <div className="space-y-2 text-muted-foreground">
                      <p className="flex items-center gap-2">
                        <CalendarDays className="size-4 text-palembang-red" />
                        {item.date}
                      </p>
                      <p className="flex items-center gap-2">
                        <Clock3 className="size-4 text-palembang-red" />
                        {item.time}
                      </p>
                      <p className="flex items-center gap-2">
                        <MapPin className="size-4 text-palembang-red" />
                        {item.location}
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
                  Tampilkan Seluruh Agenda ({agendaItems.length} Acara)
                  <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}
