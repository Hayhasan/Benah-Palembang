"use client"

import {
  ArrowRight,
  CalendarDays,
  Clock3,
  Eye,
  Heart,
  MapPin,
  Sparkles,
  Ticket,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { SectionHeading } from "@/features/public/components/SectionHeading"
import { useSession } from "@/modules/auth/hooks/use-session"

import { toggleEventLikeAction } from "../actions/toggle-event-like"
import { getPublicEventMockStats } from "../constants/public-event-stats"
import type { PublicEventDetailData } from "../types/public-event"
import { EventShareButton } from "./event-share-button"

export function PublicEventDetail({ data }: { data: PublicEventDetailData }) {
  const { event, relatedEvents } = data
  const stats = getPublicEventMockStats(event.id)
  const router = useRouter()
  const { user, status } = useSession()
  const isAuthenticated = status === "authenticated" && Boolean(user)

  const [optimisticLike, setOptimisticLike] = useState<boolean | null>(null)
  const [likesCountDelta, setLikesCountDelta] = useState(0)
  const [, startTransition] = useTransition()

  const isLiked = isAuthenticated ? (optimisticLike ?? event.hasLiked) : false
  const likesCount = Math.max(0, event.likesCount + (isAuthenticated ? likesCountDelta : 0))

  function handleToggleLike() {
    if (!isAuthenticated) {
      toast.info("Silakan masuk terlebih dahulu untuk menyukai acara ini.", {
        action: {
          label: "Masuk",
          onClick: () =>
            router.push(
              `/login?redirect=${encodeURIComponent(`/agenda/${event.id}`)}`,
            ),
        },
      })
      return
    }

    const nextLiked = !isLiked
    setOptimisticLike(nextLiked)
    setLikesCountDelta((prev) => (nextLiked ? prev + 1 : prev - 1))

    startTransition(async () => {
      const result = await toggleEventLikeAction({ eventId: event.id })
      if (!result.success) {
        toast.error(result.message)
        setOptimisticLike(!nextLiked)
        setLikesCountDelta((prev) => (nextLiked ? prev - 1 : prev + 1))
        return
      }
      setOptimisticLike(result.hasLiked ?? nextLiked)
      setLikesCountDelta(0)
    })
  }

  return (
    <>
      <div className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-40 text-white sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-30 sm:w-2/3 lg:w-1/2 lg:opacity-45">
          <Image
            src={event.bannerUrl}
            alt={event.title}
            fill
            priority
            sizes="(min-width: 1024px) 50vw, (min-width: 640px) 67vw, 100vw"
            className="object-cover object-right"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <Link
            href="/agenda"
            className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold hover:underline"
          >
            <ArrowRight className="size-3 rotate-180" />
            Kembali ke Agenda
          </Link>
          <div className="mt-6">
            <span className="inline-block rounded-full border border-palembang-gold/40 bg-palembang-gold/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              {event.category}
            </span>
          </div>
          <h1 className="mt-4 max-w-4xl font-display text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
            {event.title}
          </h1>
          <p className="mt-8 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
            {event.description}
          </p>
          <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 border-t border-white/15 pt-5 text-xs text-white/65">
            <span className="flex items-center gap-2">
              <Eye className="size-4" />
              {stats.views.toLocaleString("id-ID")} views
            </span>
            <span className="flex items-center gap-2">
              <Heart
                className={`size-4 ${
                  isLiked ? "fill-palembang-red text-palembang-red" : ""
                }`}
              />
              {likesCount.toLocaleString("id-ID")} likes
            </span>
            <span className="flex items-center gap-2">
              <Users className="size-4" />
              {stats.participants.toLocaleString("id-ID")} participants
            </span>
          </div>
        </div>
      </div>

      <main className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem]">
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
              <div className="sticky top-28 space-y-6">
                <div className="rounded-[1.5rem] border border-border bg-background p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold">Detail Acara</h3>
                  <div className="mt-6 space-y-5">
                    <EventMeta
                      icon={<CalendarDays className="size-5" />}
                      label="Tanggal"
                      value={event.dateLabel}
                    />
                    <EventMeta
                      icon={<Clock3 className="size-5" />}
                      label="Waktu"
                      value={event.timeLabel}
                    />
                    <EventMeta
                      icon={<MapPin className="size-5" />}
                      label="Lokasi"
                      value={event.location}
                    />
                    <EventMeta
                      icon={<Sparkles className="size-5" />}
                      label="Penyelenggara"
                      value={event.organizer}
                    />
                  </div>

                  <div className="mt-8 grid gap-3">
                    {event.registrationUrl ? (
                      <a
                        href={event.registrationUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-palembang-red text-sm font-bold text-white transition-colors hover:bg-palembang-red/90"
                      >
                        <Ticket className="size-4" />
                        Daftar Sekarang
                      </a>
                    ) : (
                      <div className="rounded-lg bg-muted px-4 py-3 text-center text-xs leading-5 text-muted-foreground">
                        Informasi pendaftaran belum tersedia.
                      </div>
                    )}

                    <div className="grid grid-cols-2 gap-2.5">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleToggleLike}
                        className={`h-11 w-full font-semibold ${
                          isLiked
                            ? "border-palembang-red text-palembang-red hover:bg-red-50 hover:text-palembang-red"
                            : "hover:border-palembang-red hover:text-palembang-red"
                        }`}
                      >
                        <Heart
                          className={`size-4 ${
                            isLiked ? "fill-palembang-red text-palembang-red" : ""
                          }`}
                        />
                        <span>{isLiked ? "Disukai" : "Suka"}</span>
                      </Button>

                      <EventShareButton title={event.title} />
                    </div>
                  </div>
                </div>

                <div className="rounded-[1.5rem] border border-border bg-muted/40 p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-palembang-charcoal px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-gold">
                    <Sparkles className="size-3" />
                    {event.category}
                  </div>
                  <h4 className="mt-3 font-display text-base font-bold text-foreground">
                    Kategori: {event.category}
                  </h4>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Acara ini terbuka untuk kolaborasi komunitas dan publik.
                    Hubungi penyelenggara untuk informasi lebih lanjut.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {relatedEvents.length > 0 ? (
        <section className="bg-palembang-off-white px-6 py-20 text-palembang-charcoal sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1240px]">
            <SectionHeading eyebrow="Jangan lewatkan" title="Agenda Lainnya" />
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {relatedEvents.map((relatedEvent) => (
                <Link
                  key={relatedEvent.id}
                  href={`/agenda/${relatedEvent.id}`}
                  className="group"
                >
                  <div className="img-zoom relative aspect-[4/3] overflow-hidden rounded-[1.25rem]">
                    <Image
                      src={relatedEvent.bannerUrl}
                      alt={relatedEvent.title}
                      fill
                      sizes="(min-width: 768px) 33vw, 100vw"
                      className="object-cover"
                    />
                  </div>
                  <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-palembang-red">
                    {relatedEvent.category}
                  </p>
                  <h3 className="mt-2 font-display text-xl font-bold leading-tight tracking-[-0.03em] transition-colors group-hover:text-palembang-red">
                    {relatedEvent.title}
                  </h3>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1.5">
                      <CalendarDays className="size-3.5" />
                      {relatedEvent.dateLabel}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <MapPin className="size-3.5" />
                      {relatedEvent.location.split(",")[0]}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <Footer />
    </>
  )
}

function EventMeta({
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
