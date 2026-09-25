"use client"

import {
  Calendar,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  MapPin,
  MessageCircle,
  Share2,
  Ticket,
  Users,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { PublicEventHeroCarousel } from "./public-event-hero-carousel"

import type { PublicEventDetail, PublicEventDetailData } from "../types/public-event"

function resolveEventPhotos(event: PublicEventDetail): string[] {
  const photos: string[] = []
  if (event.bannerUrl) {
    photos.push(event.bannerUrl)
  }

  // Extract any additional images from the content HTML
  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["']/gi
  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(event.content)) !== null) {
    if (match[1] && !photos.includes(match[1])) {
      photos.push(match[1])
    }
  }

  return photos
}

  export function PublicEventDetail({ data }: { data: PublicEventDetailData }) {
    const { event, relatedEvents } = data
  
    const [copied, setCopied] = useState(false)
  
    async function copyLink() {
      if (typeof window !== "undefined") {
      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      toast.success("Tautan acara berhasil disalin!")
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  function shareEvent() {
    if (typeof window !== "undefined") {
      if (navigator.share) {
        void navigator.share({
          title: event.title,
          url: window.location.href,
        }).catch(() => {})
      } else {
        void copyLink()
      }
    }
  }

  const whatsappQuestionUrl = `${event.whatsappUrl}?text=${encodeURIComponent(
    `Halo, saya ingin bertanya dan mendapatkan informasi lebih lanjut tentang acara:\n${event.title}\nTanggal: ${event.dateLabel}\nLokasi: ${event.location}`,
  )}`

  const photos = useMemo(() => {
    return resolveEventPhotos(event)
  }, [event])

  return (
    <div className="bg-white text-zinc-900">
      {/* 1. HEROES CAROUSEL AT THE VERY TOP (Fit to Screen Tanpa Padding / Full-width edge-to-edge) */}
      <section aria-label="Event Photos Carousel" className="w-full">
        <PublicEventHeroCarousel
          photos={photos}
          title={event.title}
          description={event.description}
          photographerName={event.photographer ?? undefined}
          views={event.views}
        />
      </section>

      {/* 2. EVENT HEADER (Contained with Padding) */}
      <header className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4 text-xs text-black">
          <div className="flex flex-wrap items-center gap-3">
            {/* Category Pill */}
            <Link
              href="/agenda"
              className="inline-block rounded-[3px] bg-black text-white border border-black px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em] hover:bg-zinc-800 transition-colors"
            >
              {event.category}
            </Link>
          </div>

          {event.publishedAtLabel && (
            <div className="flex items-center gap-1.5 text-zinc-500">
              <Calendar className="size-3.5" />
              <span>Diposting {event.publishedAtLabel}</span>
            </div>
          )}
        </div>
      </header>

      {/* 3. MAIN CONTENT: EVENT BODY (LEFT) & DETAIL ACARA SIDEBAR (RIGHT) */}
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] xl:grid-cols-[1fr_310px] gap-10 xl:gap-16 items-start">
          {/* Main Content Column */}
          <article className="min-w-0">
            <div className="mb-4">
              <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-black">
                Tentang Acara
              </h2>
              <div className="mt-2.5 mb-6 border-b border-dotted border-zinc-300 w-full" />
            </div>

            <div
              className="article-body prose prose-zinc max-w-none prose-headings:font-sans prose-headings:font-bold prose-p:font-serif prose-p:text-[15px] sm:prose-p:text-base prose-p:leading-[1.8] prose-p:text-zinc-800"
              dangerouslySetInnerHTML={{ __html: event.content }}
            />

            {/* Tags */}
            {event.tags.length > 0 && (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-zinc-100 pt-6">
                {event.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-[3px] bg-black px-3 py-1 text-[11px] font-medium text-white"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </article>

          {/* Right Sidebar: DETAIL ACARA (Sesuai gaya Detail Artikel) */}
          <aside className="w-full lg:sticky lg:top-24 pt-2 space-y-8 flex flex-col items-center lg:items-start text-center lg:text-left">
            {/* User Profile as Penyelenggara */}
            <div className="w-full max-w-[280px] sm:max-w-[300px] text-zinc-900">
              <div>
                <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
                  DIPOSTING OLEH
                </span>
                <div className="mt-1.5 mb-3.5 border-b border-dotted border-zinc-300 w-full" />
              </div>
              <div className="flex items-center justify-center lg:justify-start gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={undefined}
                  alt={event.organizer}
                  className="size-10 rounded-full object-cover ring-1 ring-zinc-200"
                />
                <div className="flex flex-col justify-center">
                  <span className="font-bold text-sm text-black leading-snug">
                    {event.organizer}
                  </span>
                </div>
              </div>
            </div>

            <div
              aria-label="Detail Acara"
              className="w-full max-w-[280px] sm:max-w-[300px] text-zinc-900 select-none"
            >
              {/* Heading */}
              <div>
                <h3 className="font-serif text-[19px] sm:text-[20px] font-normal tracking-[0.08em] text-[#595959] uppercase leading-tight">
                  DETAIL ACARA
                </h3>
                <div className="mt-2.5 mb-3.5 border-b border-dotted border-zinc-300 w-full" />
              </div>

              {/* Info Container */}
              <div className="grid grid-cols-2 gap-x-4 gap-y-6 w-full text-left">
                {/* Tanggal */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-black shrink-0" />
                    <span className="font-serif text-[10px] tracking-[0.14em] uppercase text-[#737373]">
                      Tanggal
                    </span>
                  </div>
                  <span className="font-serif text-xs sm:text-[13px] text-[#444] font-medium leading-snug">
                    {event.dateLabel}
                  </span>
                </div>

                {/* Waktu */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Clock3 className="size-3.5 text-black shrink-0" />
                    <span className="font-serif text-[10px] tracking-[0.14em] uppercase text-[#737373]">
                      Waktu
                    </span>
                  </div>
                  <span className="font-serif text-xs sm:text-[13px] text-[#444] font-medium leading-snug">
                    {event.timeLabel}
                  </span>
                </div>

                {/* Lokasi */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-black shrink-0" />
                    <span className="font-serif text-[10px] tracking-[0.14em] uppercase text-[#737373]">
                      Lokasi
                    </span>
                  </div>
                  <span className="font-serif text-xs sm:text-[13px] text-[#444] font-medium leading-snug">
                    {event.location}
                  </span>
                </div>

                {/* Penyelenggara */}
                <div className="flex flex-col gap-1.5">
                  <div className="flex items-center gap-1.5">
                    <Users className="size-3.5 text-black shrink-0" />
                    <span className="font-serif text-[10px] tracking-[0.14em] uppercase text-[#737373]">
                      Penyelenggara
                    </span>
                  </div>
                  <span className="font-serif text-xs sm:text-[13px] text-[#444] font-medium leading-snug break-words">
                    {event.organizer}
                  </span>
                </div>
              </div>

              <div className="mt-5 mb-5 border-b border-dotted border-zinc-300 w-full" />

              <div className="space-y-2 pt-1">
                {event.registrationUrl ? (
                  <a
                    href={event.registrationUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-[3px] bg-black px-4 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-zinc-800 transition-colors"
                  >
                    <Ticket className="size-3.5" />
                    Daftar Sekarang
                  </a>
                ) : (
                  <div className="rounded-[3px] border border-zinc-200 bg-zinc-50 px-3 py-2 text-center text-xs text-zinc-500 font-serif">
                    Pendaftaran langsung di lokasi
                  </div>
                )}

                <a
                  href={whatsappQuestionUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex w-full items-center justify-center gap-2 rounded-[3px] border border-black bg-white px-4 py-2 text-xs font-semibold text-black hover:bg-black hover:text-white transition-colors"
                >
                  <MessageCircle className="size-3.5" />
                  Tanya Penyelenggara
                </a>
              </div>

              {/* BAGIKAN ACARA (Hanya button Share dan Salin Link) */}
              <div className="pt-6">
                <div>
                  <span className="font-serif text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-[#737373]">
                    BAGIKAN ACARA
                  </span>
                  <div className="mt-1.5 mb-2.5 border-b border-dotted border-zinc-300 w-full" />
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-2 pt-1">
                  <button
                    type="button"
                    onClick={shareEvent}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[3px] border border-black bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    <Share2 className="size-3.5" />
                    <span>Share</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => void copyLink()}
                    className="flex flex-1 items-center justify-center gap-1.5 rounded-[3px] border border-black bg-white px-3 py-2 text-xs font-semibold text-black hover:bg-black hover:text-white transition-colors cursor-pointer"
                  >
                    {copied ? (
                      <>
                        <Check className="size-3.5 text-emerald-600" />
                        <span>Disalin!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="size-3.5" />
                        <span>Salin Link</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          </aside>
        </div>

        {/* 4. AGENDA LAINNYA (Related Events in Clean 3-Column Grid) */}
        {relatedEvents.length > 0 && (
          <section
            aria-label="Agenda Lainnya"
            className="mt-16 sm:mt-24 border-t border-zinc-200 pt-10 sm:pt-14"
          >
            <div>
              <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold text-black tracking-tight leading-tight">
                Agenda Lainnya
              </h2>
              <div className="mt-3 mb-8 sm:mb-12 border-b border-dotted border-zinc-300 w-full" />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-12">
              {relatedEvents.map((relatedEvent) => (
                <Link
                  key={relatedEvent.id}
                  href={`/agenda/${relatedEvent.id}`}
                  className="group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100 rounded-none">
                    <Image
                      fill
                      src={relatedEvent.bannerUrl}
                      alt={relatedEvent.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>
                  <div className="flex flex-1 flex-col pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/70">
                      {relatedEvent.category}
                    </p>
                    <h3 className="mt-1 font-sans text-base sm:text-lg font-bold leading-snug tracking-tight text-black group-hover:underline transition-colors line-clamp-2 min-h-[44px] sm:min-h-[48px]">
                      {relatedEvent.title}
                    </h3>
                    <div className="my-2 border-b border-dotted border-zinc-300" />
                    <div className="flex flex-col space-y-1 text-xs text-black/80 font-serif">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-black shrink-0" />
                        <span>{relatedEvent.dateLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-black shrink-0" />
                        <span className="truncate">{relatedEvent.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </main>

      {/* 5. FOOTER */}
      <Footer />
    </div>
  )
}
