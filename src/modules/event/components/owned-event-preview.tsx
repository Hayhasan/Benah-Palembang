"use client"

import {
  ArrowLeft,
  CalendarDays,
  Check,
  Clock3,
  Copy,
  Edit2,
  Eye,
  MapPin,
  MessageCircle,
  Share2,
  Ticket,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { PublicArticleHeroCarousel } from "@/modules/article/components/public-article-hero-carousel"
import type { OwnedEventEditorData } from "../types/owned-event"

function resolveEventPhotos(bannerUrl: string, content: string): string[] {
  const photos: string[] = []
  if (bannerUrl) photos.push(bannerUrl)

  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["']/gi
  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1] && !photos.includes(match[1])) {
      photos.push(match[1])
    }
  }

  return photos
}

export function OwnedEventPreview({ event }: { event: OwnedEventEditorData }) {
  const [copied, setCopied] = useState(false)
  const whatsappQuestionUrl = `${event.whatsappUrl}?text=${encodeURIComponent(
    `Halo, saya ingin bertanya dan mendapatkan informasi lebih lanjut tentang acara:\n${event.title}\nTanggal: ${event.dateLabel}\nLokasi: ${event.location}`,
  )}`

  const photos = useMemo(() => {
    return resolveEventPhotos(event.bannerUrl, event.content)
  }, [event.bannerUrl, event.content])

  async function copyLink() {
    try {
      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      toast.success("Tautan acara berhasil disalin!")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.info("Tautan acara: " + window.location.href)
    }
  }

  function shareEvent() {
    if (navigator.share) {
      void navigator.share({
        title: event.title,
        url: window.location.href,
      })
    } else {
      void copyLink()
    }
  }

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

      {/* ── Main Event Layout (Sama dengan Public Website) ── */}
      <div className="bg-white text-zinc-900 -mx-4 sm:-mx-6 md:-mx-10">
        {/* 1. HEROES CAROUSEL AT THE VERY TOP */}
        <section aria-label="Event Photos Carousel" className="w-full">
          <PublicArticleHeroCarousel
            photos={photos}
            photographerName={event.photographer || event.organizer}
            views={event.views}
          />
        </section>

        {/* 2. EVENT HEADER */}
        <header className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-12">
          {/* Category Pill */}
          <span className="inline-block rounded-[3px] bg-black text-white border border-black px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em]">
            {event.category}
          </span>

          {/* Event Title */}
          <h1 className="mt-4 font-sans text-2xl sm:text-4xl md:text-5xl font-bold leading-[1.18] tracking-tight text-black">
            {event.title}
          </h1>

          {/* Description / Excerpt */}
          {event.description && (
            <p className="mt-4 font-serif text-base sm:text-lg leading-relaxed text-black/85">
              {event.description}
            </p>
          )}

          {/* DATE, TIME, LOCATION, VIEWS */}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-zinc-200 py-3.5 text-xs text-black">
            <div className="flex flex-wrap items-center gap-3">
              <div className="flex items-center gap-1.5 text-zinc-600">
                <CalendarDays className="size-3.5 text-black" />
                <span>{event.dateLabel}</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <Clock3 className="size-3.5 text-black" />
                <span>{event.timeLabel}</span>
              </div>
              <span className="text-zinc-300">•</span>
              <div className="flex items-center gap-1.5 text-zinc-600">
                <MapPin className="size-3.5 text-black" />
                <span className="truncate max-w-[200px]">{event.location}</span>
              </div>
            </div>

            {event.publishedAtLabel && (
              <div className="flex items-center gap-1.5 text-zinc-500">
                <CalendarDays className="size-3.5 text-black" />
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
            <aside className="w-full lg:sticky lg:top-24 pt-2 space-y-8">
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

                {/* Tanggal */}
                <div>
                  <span className="font-serif text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-[#737373]">
                    TANGGAL
                  </span>
                  <div className="mt-1.5 mb-2 border-b border-dotted border-zinc-300 w-full" />
                  <p className="font-serif text-[13.5px] text-[#555555]">
                    {event.dateLabel}
                  </p>
                  <div className="mt-3.5 mb-3.5 border-b border-dotted border-zinc-300 w-full" />
                </div>

                {/* Waktu */}
                <div>
                  <span className="font-serif text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-[#737373]">
                    WAKTU
                  </span>
                  <div className="mt-1.5 mb-2 border-b border-dotted border-zinc-300 w-full" />
                  <p className="font-serif text-[13.5px] text-[#555555]">
                    {event.timeLabel}
                  </p>
                  <div className="mt-3.5 mb-3.5 border-b border-dotted border-zinc-300 w-full" />
                </div>

                {/* Lokasi */}
                <div>
                  <span className="font-serif text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-[#737373]">
                    LOKASI
                  </span>
                  <div className="mt-1.5 mb-2 border-b border-dotted border-zinc-300 w-full" />
                  <p className="font-serif text-[13.5px] leading-[1.45] text-[#555555]">
                    {event.location}
                  </p>
                  <div className="mt-3.5 mb-3.5 border-b border-dotted border-zinc-300 w-full" />
                </div>

                {/* Penyelenggara */}
                <div>
                  <span className="font-serif text-[11px] sm:text-[12px] tracking-[0.16em] uppercase text-[#737373]">
                    PENYELENGGARA
                  </span>
                  <div className="mt-1.5 mb-2 border-b border-dotted border-zinc-300 w-full" />
                  <p className="font-serif text-[13.5px] text-[#555555]">
                    {event.organizer}
                  </p>
                  <div className="mt-3.5 mb-3.5 border-b border-dotted border-zinc-300 w-full" />
                </div>

                {/* Registration & Actions */}
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

                  <div className="flex items-center gap-2 pt-1">
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
        </main>
      </div>
    </div>
  )
}
