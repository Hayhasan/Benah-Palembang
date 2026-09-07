import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit2,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Sparkles,
  Ticket,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import type { OwnedEventEditorData } from "../types/owned-event"
import { EventOrganizerCard } from "./event-organizer-card"
import { EventShareButton } from "./event-share-button"

export function OwnedEventPreview({ event }: { event: OwnedEventEditorData }) {
  const whatsappQuestionUrl = `${event.whatsappUrl}?text=${encodeURIComponent(
    `Halo, saya ingin bertanya dan mendapatkan informasi lebih lanjut tentang acara:\n${event.title}\nTanggal: ${event.dateLabel}\nLokasi: ${event.location}`,
  )}`

  return (
    <div className="space-y-6 pb-16">
      {/* ── Top Action & Control Header ── */}
      <div className="sticky top-16 z-20 -mx-4 border-b bg-background/95 px-4 py-3 shadow-xs backdrop-blur-md sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:top-0">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 px-2.5 text-xs">
              <Link href="/dashboard/create-event">
                <ArrowLeft className="size-3.5" />
                <span>Kembali</span>
              </Link>
            </Button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
              <Eye className="size-3 shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-none">
                Preview · {event.statusLabel}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="h-8 w-full gap-1.5 bg-palembang-red text-xs text-white hover:bg-palembang-red/90 sm:w-auto"
            >
              <Link href={`/dashboard/create-event/edit?id=${event.id}`}>
                <Edit2 className="size-3.5" />
                <span>Edit Event Ini</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main Event Layout (Public Website Style) ── */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm sm:rounded-2xl">
        <header className="relative overflow-hidden bg-palembang-charcoal px-4 py-8 text-white sm:px-8 sm:py-12 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-30 sm:w-2/3 lg:w-1/2 lg:opacity-45">
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
          </div>
          <div className="relative z-10 mx-auto max-w-[1240px]">
            <span className="inline-block rounded-full border border-palembang-red/40 bg-palembang-red/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-red sm:px-3.5 sm:py-1">
              {event.category}
            </span>
            <h1 className="mt-3 max-w-4xl font-display text-2xl font-black leading-tight tracking-[-0.03em] sm:mt-4 sm:text-4xl lg:text-6xl break-words">
              {event.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base sm:leading-7">
              {event.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/75 sm:mt-8 sm:gap-5">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-palembang-red" />
                {event.dateLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="size-3.5 text-palembang-red" />
                {event.likesCount.toLocaleString("id-ID")} likes
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="size-3.5 text-sky-400" />
                {event.views.toLocaleString("id-ID")} views
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-8 sm:py-10 lg:px-16 lg:py-14">
          <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
            <div className="min-w-0">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border shadow-sm sm:rounded-[1.5rem]">
                <Image
                  src={event.bannerUrl}
                  alt={event.title}
                  fill
                  sizes="(min-width: 1024px) 760px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-8 sm:mt-10">
                <h2 className="font-display text-xl font-bold tracking-[-0.02em] sm:text-2xl">
                  Tentang Acara
                </h2>
                <div
                  className="article-body mt-3 sm:mt-4"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </div>
              {event.tags.length > 0 ? (
                <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-5 sm:mt-10 sm:pt-6">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground sm:px-3 sm:py-1.5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <div className="sticky top-24 space-y-5 sm:space-y-6">
                <EventOrganizerCard organizer={event.organizer} />
                <div className="rounded-xl border border-border bg-card p-4 shadow-sm sm:rounded-[1.5rem] sm:p-6">
                  <h3 className="font-display text-base font-bold sm:text-lg">Detail Acara</h3>
                  <div className="mt-4 space-y-4 sm:mt-6 sm:space-y-5">
                    <PreviewMeta
                      icon={<CalendarDays className="size-4 sm:size-5" />}
                      label="Tanggal"
                      value={event.dateLabel}
                    />
                    <PreviewMeta
                      icon={<Clock3 className="size-4 sm:size-5" />}
                      label="Waktu"
                      value={event.timeLabel}
                    />
                    <PreviewMeta
                      icon={<MapPin className="size-4 sm:size-5" />}
                      label="Lokasi"
                      value={event.location}
                    />
                    <PreviewMeta
                      icon={<Sparkles className="size-4 sm:size-5" />}
                      label="Penyelenggara / Publisher"
                      value={event.organizer}
                    />
                  </div>
                  <div className="mt-6 space-y-3 border-t border-border pt-5 sm:mt-8 sm:pt-6">
                    {event.registrationUrl ? (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-palembang-red text-xs font-bold text-white shadow-sm transition-colors hover:bg-palembang-red/90 sm:h-11 sm:text-sm"
                      >
                        <Ticket className="size-4" />
                        Daftar Sekarang
                      </a>
                    ) : (
                      <div className="rounded-lg bg-muted px-4 py-2.5 text-center text-xs text-muted-foreground sm:py-3">
                        Informasi pendaftaran belum tersedia.
                      </div>
                    )}

                    <div className="grid grid-cols-3 gap-2">
                      <div className="flex h-10 items-center justify-center gap-1.5 rounded-md border border-border px-2 text-xs font-semibold text-muted-foreground sm:h-11">
                        <Heart className="size-3.5 sm:size-4" />
                        <span>Suka</span>
                      </div>
                      <a
                        href={whatsappQuestionUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-10 items-center justify-center gap-1.5 rounded-md border border-emerald-600/30 bg-emerald-600/10 px-2 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white sm:h-11"
                      >
                        <MessageCircle className="size-3.5 sm:size-4" />
                        <span>Tanya</span>
                      </a>
                      <EventShareButton
                        title={event.title}
                        url={`/agenda/${event.id}`}
                        label="Bagikan"
                        className="h-10 gap-1.5 px-2 text-xs font-semibold sm:h-11"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}

function PreviewMeta({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode
  label: string
  value: string
}) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 shrink-0 text-palembang-red">{icon}</span>
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">
          {label}
        </p>
        <p className="mt-1 text-sm font-semibold">{value}</p>
      </div>
    </div>
  )
}
