"use client"

import { Mail, MessageCircle, Play, Search, X } from "lucide-react"
import { useState } from "react"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"

import { getCollaborationContentFallbackPreview } from "../data/collaboration-content-preview"
import type {
  CollaborationContentAspectRatio,
  CollaborationPageData,
  CollaborationPartnerContentData,
  CollaborationPlatform,
} from "../types/collaboration-page"

const platformLabels: Record<CollaborationPlatform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X",
}

function platformBadgeClass(platform: CollaborationPlatform) {
  if (platform === "youtube") return "bg-red-600 text-white"
  if (platform === "instagram") {
    return "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white"
  }
  if (platform === "tiktok") {
    return "border border-white/20 bg-black text-white"
  }
  if (platform === "facebook") return "bg-blue-600 text-white"
  return "bg-foreground text-background"
}

function aspectRatioClass(aspectRatio: CollaborationContentAspectRatio) {
  if (aspectRatio === "PORTRAIT") return "aspect-[9/16]"
  if (aspectRatio === "SQUARE") return "aspect-square"
  return "aspect-video"
}

function fallbackBackgroundClass(platform: CollaborationPlatform) {
  if (platform === "youtube") return "from-red-950 via-red-700 to-black"
  if (platform === "instagram") {
    return "from-amber-400 via-fuchsia-600 to-indigo-950"
  }
  if (platform === "tiktok") return "from-cyan-400 via-black to-pink-500"
  if (platform === "facebook") return "from-blue-800 via-blue-600 to-sky-400"
  return "from-zinc-700 via-black to-zinc-950"
}

function CollaborationContentCard({
  item,
}: {
  item: CollaborationPartnerContentData
}) {
  const [thumbnailFailed, setThumbnailFailed] = useState(false)
  const preview =
    item.preview ?? getCollaborationContentFallbackPreview(item)
  const showThumbnail = preview.thumbnailUrl && !thumbnailFailed

  return (
    <a
      href={item.contentUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="group block break-inside-avoid"
      title={`Buka konten: ${preview.title}`}
    >
      <div
        className={`relative overflow-hidden rounded-2xl border border-border/40 bg-gradient-to-br ${fallbackBackgroundClass(item.platform)} ${aspectRatioClass(preview.aspectRatio)}`}
      >
        {showThumbnail ? (
          // Provider thumbnails are derived at render time and are not stored.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={preview.thumbnailUrl ?? ""}
            alt={preview.title}
            referrerPolicy="no-referrer"
            className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
            onError={() => setThumbnailFailed(true)}
          />
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.3),transparent_40%)]" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-70 transition-opacity group-hover:opacity-90" />
        <div className="absolute left-3 top-3">
          <span
            className={`rounded px-2 py-1 text-[9px] font-bold uppercase tracking-wider shadow-sm ${platformBadgeClass(item.platform)}`}
          >
            {platformLabels[item.platform]}
          </span>
        </div>
        <div className="absolute inset-x-0 bottom-0 p-4">
          <h3 className="line-clamp-3 text-sm font-bold leading-tight text-white">
            {preview.title}
          </h3>
          <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">
            {platformLabels[item.platform]}
          </p>
        </div>
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
          <span className="flex size-12 items-center justify-center rounded-full border border-white/20 bg-white/20 text-white shadow-xl backdrop-blur-md">
            <Play className="size-5 fill-current" />
          </span>
        </div>
      </div>
    </a>
  )
}

function HeroTitle({ title }: { title: string }) {
  const highlightedWord = "Palembang"
  const wordIndex = title.toLowerCase().indexOf(highlightedWord.toLowerCase())

  if (wordIndex === -1) return title

  const before = title.slice(0, wordIndex).trim()
  const highlighted = title.slice(
    wordIndex,
    wordIndex + highlightedWord.length,
  )
  const after = title.slice(wordIndex + highlightedWord.length).trim()

  return (
    <>
      {before ? (
        <>
          {before}
          <br />
        </>
      ) : null}
      <span className="text-palembang-red">{highlighted}</span>
      {after ? (
        <>
          <br />
          {after}
        </>
      ) : null}
    </>
  )
}

export function CollaborationPage({ data }: { data: CollaborationPageData }) {
  const [query, setQuery] = useState("")
  const [showAllContent, setShowAllContent] = useState(false)
  const doubledLogos = [...data.partnerLogos, ...data.partnerLogos]
  const normalizedQuery = query.trim().toLowerCase()
  const filteredContents = data.partnerContents.filter((item) => {
    if (!normalizedQuery) return true

    const preview =
      item.preview ?? getCollaborationContentFallbackPreview(item)
    return `${preview.title} ${platformLabels[item.platform]} ${item.contentUrl}`
      .toLowerCase()
      .includes(normalizedQuery)
  })
  const initialCount = 12
  const visibleContents =
    showAllContent || normalizedQuery
      ? filteredContents
      : filteredContents.slice(0, initialCount)
  const hasMoreContent =
    !showAllContent && !normalizedQuery && filteredContents.length > initialCount

  return (
    <>
      <main>
        <section className="relative overflow-hidden bg-palembang-charcoal px-6 pb-12 pt-32 text-white sm:px-10 sm:pb-14 sm:pt-36 lg:px-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-30 sm:w-2/3 lg:w-1/2 lg:opacity-40">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={data.hero.imageUrl}
              alt={data.hero.imageAlt}
              className="size-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1240px]">
            <h1 className="reveal-on-scroll max-w-4xl font-display text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
              <HeroTitle title={data.hero.title} />
            </h1>
            <p className="reveal-on-scroll reveal-delay-150 mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base">
              {data.hero.description}
            </p>
            <div className="reveal-on-scroll reveal-delay-200 mt-8 flex flex-col gap-3.5">
              <div className="flex items-center gap-3 text-palembang-red">
                <Mail className="size-4.5" />
                <a
                  href={data.contact.emailUrl}
                  className="text-sm text-white underline underline-offset-4 transition-colors hover:text-palembang-red"
                >
                  {data.contact.email}
                </a>
              </div>
              <div className="flex items-center gap-3 text-palembang-red">
                <MessageCircle className="size-4.5" />
                <a
                  href={data.contact.whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-white underline underline-offset-4 transition-colors hover:text-palembang-red"
                >
                  {data.contact.phone}
                </a>
              </div>
            </div>
          </div>
        </section>

        {doubledLogos.length > 0 ? (
          <section className="reveal-on-scroll overflow-hidden bg-background py-16 text-foreground sm:py-20">
            <div className="reveal-on-scroll mx-auto mb-12 max-w-[1240px] px-6 text-center sm:px-10 lg:px-16">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">
                Trusted By
              </p>
              <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                Our Partners
              </h2>
              <p className="mx-auto mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                Brand, komunitas, dan organisasi yang telah berkolaborasi
                bersama Benah Palembang.
              </p>
            </div>
            <div className="relative w-full overflow-hidden py-2">
              <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 bg-gradient-to-r from-background via-background/80 to-transparent backdrop-blur-[2px] sm:w-24 lg:w-32" />
              <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 bg-gradient-to-l from-background via-background/80 to-transparent backdrop-blur-[2px] sm:w-24 lg:w-32" />
              <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16">
                {doubledLogos.map((logo, index) => (
                  <div
                    key={`${logo.name}-${logo.position}-${index}`}
                    className="group flex-shrink-0 px-4"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.imageUrl}
                      alt={logo.name}
                      className="h-10 w-auto object-contain opacity-50 grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0 dark:brightness-0 dark:invert dark:group-hover:brightness-100 dark:group-hover:invert-0 sm:h-12"
                    />
                  </div>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        <section className="reveal-on-scroll bg-background px-6 py-16 text-foreground sm:px-10 sm:py-24 lg:px-16">
          <div className="mx-auto max-w-[1240px]">
            <div className="reveal-on-scroll flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">
                  Partner Content
                </p>
                <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] sm:text-4xl">
                  Konten Kolaborasi
                </h2>
                <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
                  Temukan konten dan cerita kolaborasi kami di berbagai
                  platform.
                </p>
              </div>
              <div className="flex w-full max-w-md items-center gap-3 border-b border-border pb-3">
                <Search className="size-4 text-muted-foreground" />
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Cari platform atau URL..."
                  aria-label="Cari konten kolaborasi"
                  className="w-full bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                />
                {query ? (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="text-muted-foreground hover:text-foreground"
                    aria-label="Hapus pencarian"
                  >
                    <X className="size-4" />
                  </button>
                ) : null}
              </div>
            </div>

            {visibleContents.length > 0 ? (
              <div className="reveal-stagger mt-12 columns-2 gap-4 space-y-4 sm:columns-3 lg:columns-4">
                {visibleContents.map((item) => (
                  <CollaborationContentCard
                    key={`${item.position}-${item.contentUrl}`}
                    item={item}
                  />
                ))}
              </div>
            ) : (
              <div className="reveal-on-scroll mt-12 rounded-2xl border border-dashed border-border p-12 text-center text-sm text-muted-foreground">
                Tidak ada konten kolaborasi yang cocok.
              </div>
            )}

            {hasMoreContent ? (
              <div className="reveal-on-scroll mt-10 flex justify-center">
                <button
                  type="button"
                  onClick={() => setShowAllContent(true)}
                  className="rounded-full border border-border bg-card px-8 py-3 text-sm font-semibold transition-all hover:scale-105 hover:border-palembang-red hover:text-palembang-red"
                >
                  Tampilkan Semua Konten
                </button>
              </div>
            ) : null}
          </div>
        </section>
      </main>

      <Footer />
    </>
  )
}
