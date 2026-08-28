"use client"

import { Mail, MessageCircle } from "lucide-react"
import { useState, type ReactNode } from "react"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"

import type {
  CollaborationPageData,
  CollaborationPlatform,
} from "../types/collaboration-page"

const aspectRatioClasses = {
  "9:16": "aspect-[9/16]",
  "4:5": "aspect-[4/5]",
  "16:9": "aspect-[16/9]",
  "1:1": "aspect-[1/1]",
} as const

function PlatformIcon({ platform }: { platform: CollaborationPlatform }) {
  if (platform === "youtube") {
    return (
      <span className="rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
        YT
      </span>
    )
  }

  if (platform === "instagram") {
    return (
      <span className="rounded bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
        IG
      </span>
    )
  }

  if (platform === "tiktok") {
    return (
      <span className="rounded border border-white/20 bg-black px-1.5 py-0.5 text-[9px] font-bold text-white">
        TK
      </span>
    )
  }

  return (
    <span className="rounded bg-blue-600 px-1.5 py-0.5 text-[9px] font-bold text-white">
      {platform === "x" ? "X" : "FB"}
    </span>
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

function OptionalContentLink({
  href,
  children,
}: {
  href: string
  children: ReactNode
}) {
  if (!href) return <div className="break-inside-avoid">{children}</div>

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="block break-inside-avoid"
    >
      {children}
    </a>
  )
}

export function CollaborationPage({ data }: { data: CollaborationPageData }) {
  const [showAllContent, setShowAllContent] = useState(false)
  const doubledLogos = [...data.partnerLogos, ...data.partnerLogos]
  const hasMoreContent = data.partnerContents.length > 6
  const visibleContents = showAllContent
    ? data.partnerContents
    : data.partnerContents.slice(0, 6)

  return (
    <>
      <div className="relative bg-palembang-charcoal">
        <div className="absolute inset-x-0 top-0 h-[600px] overflow-hidden">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={data.hero.imageUrl}
            alt={data.hero.imageAlt}
            className="size-full object-cover opacity-40"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/30 via-palembang-charcoal/80 to-palembang-charcoal" />
        </div>
        <main className="relative z-10 px-6 pb-24 pt-40 text-white sm:px-10 lg:px-16 lg:pb-36">
          <div className="mx-auto max-w-[1240px]">
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">
              {data.hero.eyebrow}
            </p>
            <h1 className="mt-6 max-w-5xl font-display text-6xl font-black leading-[0.88] tracking-[-0.065em] sm:text-8xl lg:text-9xl">
              <HeroTitle title={data.hero.title} />
            </h1>
            <div className="mt-16">
              <div>
                <p className="max-w-lg text-lg leading-8 text-white/65">
                  {data.hero.description}
                </p>
                <div className="mt-10 flex flex-col gap-4">
                  <div className="flex items-center gap-3 text-palembang-gold">
                    <Mail className="size-5" />
                    <a
                      href={data.contact.emailUrl}
                      className="text-sm text-white underline underline-offset-4 transition-colors hover:text-palembang-gold"
                    >
                      {data.contact.email}
                    </a>
                  </div>
                  <div className="flex items-center gap-3 text-palembang-gold">
                    <MessageCircle className="size-5" />
                    <a
                      href={data.contact.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm text-white underline underline-offset-4 transition-colors hover:text-palembang-gold"
                    >
                      {data.contact.phone}
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>

      <section className="overflow-hidden bg-palembang-off-white py-16 sm:py-20">
        <div className="mx-auto mb-10 max-w-[1240px] px-6 sm:px-10 lg:px-16">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">
            Trusted By
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-palembang-charcoal sm:text-4xl">
            Our Partners
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">
            Brand, komunitas, dan organisasi yang telah berkolaborasi bersama
            Benah Palembang.
          </p>
        </div>
        <div className="relative">
          <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-palembang-off-white to-transparent" />
          <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-palembang-off-white to-transparent" />
          <div className="flex animate-marquee items-center gap-12">
            {doubledLogos.map((logo, index) => (
              <div
                key={`${logo.name}-${logo.position}-${index}`}
                className="group flex-shrink-0 cursor-pointer px-4"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  className="h-12 w-auto object-contain opacity-50 grayscale transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 group-hover:grayscale-0"
                />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="bg-palembang-charcoal px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
        <div className="mx-auto max-w-[1240px]">
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">
            Partner Content
          </p>
          <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">
            Konten Kolaborasi
          </h2>
          <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">
            Konten promosi dan cerita dari partner-partner kami di berbagai
            platform.
          </p>

          <div className="relative mt-12">
            <div className="columns-2 gap-4 space-y-4 sm:columns-3 lg:columns-4">
              {visibleContents.map((item) => (
                <OptionalContentLink
                  key={`${item.title}-${item.position}`}
                  href={item.contentUrl}
                >
                  <div className="group cursor-pointer">
                    <div
                      className={`relative overflow-hidden rounded-2xl ${aspectRatioClasses[item.aspectRatio]}`}
                    >
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={item.thumbnailUrl}
                        alt={item.title}
                        className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                      <div className="absolute left-3 top-3">
                        <PlatformIcon platform={item.platform} />
                      </div>
                      <div className="absolute inset-x-0 bottom-0 p-4">
                        <h3 className="text-sm font-bold leading-tight text-white">
                          {item.title}
                        </h3>
                        <p className="mt-1 text-[10px] font-semibold uppercase tracking-widest text-white/60">
                          {item.platform}
                        </p>
                      </div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 transition-opacity group-hover:opacity-100">
                        <div className="flex size-12 items-center justify-center rounded-full bg-white/20 backdrop-blur-md">
                          <svg
                            xmlns="http://www.w3.org/2000/svg"
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill="white"
                          >
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        </div>
                      </div>
                    </div>
                  </div>
                </OptionalContentLink>
              ))}
            </div>

            {hasMoreContent && !showAllContent ? (
              <div className="absolute inset-x-0 bottom-0 flex h-64 items-end justify-center bg-gradient-to-t from-palembang-charcoal via-palembang-charcoal/90 to-transparent">
                <button
                  type="button"
                  onClick={() => setShowAllContent(true)}
                  className="mb-8 rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:scale-105 hover:border-white/40 hover:bg-white/20"
                >
                  Tampilkan Semua Konten
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <Footer />
    </>
  )
}
