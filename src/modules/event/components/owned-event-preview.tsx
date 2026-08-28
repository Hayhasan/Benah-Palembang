import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Edit2,
  Eye,
  Heart,
  MapPin,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import { Button } from "@/components/ui/button"

import { getPublicEventMockStats } from "../constants/public-event-stats"
import type { OwnedEventEditorData } from "../types/owned-event"

export function OwnedEventPreview({ event }: { event: OwnedEventEditorData }) {
  const stats = getPublicEventMockStats(event.id)

  return (
    <div className="space-y-6 pb-16">
      <div className="sticky top-0 z-20 flex flex-col gap-4 border-b bg-background/90 px-4 py-3.5 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between md:-mx-8">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/create-event">
              <ArrowLeft className="size-4" />
              Kembali
            </Link>
          </Button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <Eye className="size-3.5" />
            Preview Event - {event.statusLabel}
          </span>
        </div>
        <Button
          asChild
          className="h-8 gap-2 bg-palembang-red text-xs text-white hover:bg-palembang-red/90"
        >
          <Link href={`/dashboard/create-event/edit?id=${event.id}`}>
            <Edit2 className="size-3.5" />
            Edit Event Ini
          </Link>
        </Button>
      </div>

      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        <header className="relative overflow-hidden bg-palembang-charcoal px-6 pb-16 pt-16 text-white sm:px-10 lg:px-16">
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
            <span className="inline-block rounded-full border border-palembang-gold/40 bg-palembang-gold/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              {event.category}
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {event.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              {event.description}
            </p>
            <div className="mt-8 flex flex-wrap gap-5 border-t border-white/15 pt-5 text-xs text-white/65">
              <span className="flex items-center gap-2">
                <Eye className="size-4" />
                {stats.views.toLocaleString("id-ID")} views
              </span>
              <span className="flex items-center gap-2">
                <Heart className="size-4 text-palembang-red" />
                {event.likesCount.toLocaleString("id-ID")} likes
              </span>
              <span className="flex items-center gap-2">
                <Users className="size-4" />
                {stats.participants.toLocaleString("id-ID")} participants
              </span>
            </div>
          </div>
        </header>

        <main className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border shadow-sm">
                <Image
                  src={event.bannerUrl}
                  alt={event.title}
                  fill
                  sizes="(min-width: 1024px) 760px, 100vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">
                  Tentang Acara
                </h2>
                <div
                  className="article-body mt-4"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </div>
              {event.tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-3 py-1.5 text-xs text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}
            </div>

            <div>
              <div className="sticky top-24 space-y-6">
                <div className="rounded-[1.5rem] border border-border bg-card p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold">Detail Acara</h3>
                  <div className="mt-6 space-y-5">
                    <PreviewMeta
                      icon={<CalendarDays className="size-5" />}
                      label="Tanggal"
                      value={event.dateLabel}
                    />
                    <PreviewMeta
                      icon={<Clock3 className="size-5" />}
                      label="Waktu"
                      value={event.timeLabel}
                    />
                    <PreviewMeta
                      icon={<MapPin className="size-5" />}
                      label="Lokasi"
                      value={event.location}
                    />
                    <PreviewMeta
                      icon={<Sparkles className="size-5" />}
                      label="Penyelenggara"
                      value={event.organizer}
                    />
                  </div>
                  <div className="mt-8">
                    {event.registrationUrl ? (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-palembang-red text-sm font-bold text-white hover:bg-palembang-red/90"
                      >
                        <Ticket className="size-4" />
                        Daftar Sekarang
                      </a>
                    ) : (
                      <div className="rounded-lg bg-muted px-4 py-3 text-center text-xs text-muted-foreground">
                        Informasi pendaftaran belum tersedia.
                      </div>
                    )}
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
