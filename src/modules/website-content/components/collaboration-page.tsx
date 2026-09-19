"use client"

import { ChevronDown, Mail, MessageCircle, Play, Search, X } from "lucide-react"
import { useState } from "react"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { LandingHero } from "@/modules/website-content/components/landing-hero"
import { CollaborationCta } from "@/modules/website-content/components/collaboration-cta"

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

export function CollaborationContentCard({
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
      className="group block break-inside-avoid overflow-hidden"
      title={`Buka konten: ${preview.title}`}
    >
      <div
        className={`relative overflow-hidden border border-zinc-200 bg-gradient-to-br ${fallbackBackgroundClass(item.platform)} ${aspectRatioClass(preview.aspectRatio)}`}
      >
        {showThumbnail ? (
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

        {/* Hover overlay gradient scrim */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Title: only visible on hover */}
        <div className="absolute inset-x-0 bottom-0 p-4 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <h3 className="line-clamp-2 text-sm sm:text-base font-bold leading-snug text-white drop-shadow-sm">
            {preview.title}
          </h3>
        </div>

        {/* Center Play Icon: visible on hover */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
          <span className="flex size-10 items-center justify-center rounded-full bg-white/30 text-white shadow-lg backdrop-blur-xs">
            <Play className="size-4 fill-current ml-0.5" />
          </span>
        </div>
      </div>
    </a>
  )
}

export function CollaborationPage({ data }: { data: CollaborationPageData }) {
  const [query, setQuery] = useState("")
  const [displayCount, setDisplayCount] = useState(6)
  const normalizedQuery = query.trim().toLowerCase()

  const filteredContents = data.partnerContents.filter((item) => {
    if (!normalizedQuery) return true

    const preview =
      item.preview ?? getCollaborationContentFallbackPreview(item)
    return `${preview.title} ${platformLabels[item.platform]} ${item.contentUrl}`
      .toLowerCase()
      .includes(normalizedQuery)
  })

  const visibleContents =
    normalizedQuery
      ? filteredContents
      : filteredContents.slice(0, displayCount)
  const hasMoreContent =
    !normalizedQuery && filteredContents.length > displayCount

  const heroSlides = data.heroSlides.map((slide) => ({
    imageUrl: slide.imageUrl,
    imageAlt: slide.imageAlt || slide.title,
    eyebrow: "COLLABORATION & PARTNERSHIP",
    title: slide.title,
    description: slide.description,
    buttonLabel: "HUBUNGI KAMI",
    buttonUrl: `mailto:${data.contact.email}`,
    position: slide.position,
    isVisible: slide.isVisible,
  }))

  return (
    <div className="bg-white text-zinc-900">
      {/* 1. HEROES: 3-Panel Hero Carousel */}
      <LandingHero slides={heroSlides} />

      {/* 2. DAFTAR KOLABORASI */}
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-10 sm:py-14 space-y-16">
        {/* Page Title with thin divider */}
        <div>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
            Kolaborasi & Kemitraan
          </h1>
          <p className="mt-1 font-serif text-sm text-black/70">
            {heroSlides[0]?.description}
          </p>
          <div className="mt-4 border-b border-zinc-200" />
        </div>

        {/* Partner Logos */}
        {data.partnerLogos.length > 0 && (
          <section aria-label="Partner Logos" className="border-b border-zinc-200 pb-12 overflow-hidden relative">
            {/* Create a looping effect by repeating the logos. 
                The CSS animate-marquee moves the container left by 50% of its total width.
                We duplicate it a large number of times to ensure it covers the screen even if there are few logos. */}
            <div className="flex w-max animate-marquee items-center gap-12 sm:gap-16 py-4">
              {Array.from({ length: 12 })
                .flatMap(() => data.partnerLogos)
                .map((logo, index) => (
                  <div
                    key={`logo-${logo.name}-${index}`}
                    className="flex shrink-0 items-center justify-center p-2 opacity-60 hover:opacity-100 transition-opacity"
                    title={logo.name}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={logo.imageUrl}
                      alt={logo.name}
                      className="h-8 sm:h-10 max-h-10 w-auto object-contain grayscale hover:grayscale-0 transition-all"
                    />
                  </div>
                ))}
            </div>
          </section>
        )}

        {/* Partner Content Section */}
        <section aria-label="Partner Content">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h2 className="font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black">
                Karya & Publikasi Bersama
              </h2>
            </div>

            <div className="flex items-center gap-2 border-b border-zinc-300 pb-1.5 sm:w-72">
              <Search className="size-3.5 text-black" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Cari konten atau platform..."
                className="w-full bg-transparent text-xs text-black outline-none placeholder:text-zinc-400"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery("")}
                  className="text-black hover:text-zinc-600"
                >
                  <X className="size-3.5" />
                </button>
              )}
            </div>
          </div>

          {visibleContents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {visibleContents.map((item) => (
                <CollaborationContentCard
                  key={`${item.position}-${item.contentUrl}`}
                  item={item}
                />
              ))}
            </div>
          ) : (
            <div className="border border-dashed border-zinc-200 p-12 text-center text-xs text-black/70 font-serif">
              Tidak ada konten kolaborasi yang cocok dengan pencarian.
            </div>
          )}

          {hasMoreContent && (
            <div className="mt-10 flex justify-center">
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
        </section>

        {/* Contact Callout */}
        <CollaborationCta contact={data.contact} />
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  )
}
