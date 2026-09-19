import Link from "next/link"
import Image from "next/image"
import { ArrowRight, CalendarDays, MapPin } from "lucide-react"

import { PublicFooter } from "@/features/public/components/PublicFooter"
import { PublicArticleCard } from "@/modules/article/components/public-article-card"
import type { LandingArticlesBySection, PublicArticleCardData } from "@/modules/article/types/public-article"
import type { PublicEventListItem } from "@/modules/event/types/public-event"

import type { LandingPageView } from "../types/landing-page"
import { LandingHero } from "./landing-hero"

interface LandingPageProps {
  data: LandingPageView
  articlesBySection: LandingArticlesBySection
  latestArticles?: PublicArticleCardData[]
  events?: PublicEventListItem[]
}

const EVENT_TIME_ZONE = "Asia/Jakarta"
const datePartFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  timeZone: EVENT_TIME_ZONE,
  year: "numeric",
})

function getMonthKey(date: Date) {
  const parts = datePartFormatter.formatToParts(date)
  const month = parts.find((part) => part.type === "month")?.value
  const year = parts.find((part) => part.type === "year")?.value
  return `${year}-${month}`
}

export function LandingPage({
  data,
  articlesBySection,
  latestArticles = [],
  events = [],
}: LandingPageProps) {
  const heroSlides = data.heroSlides.filter((slide) => slide.isVisible)

  // Filter This Month's Events, fallback to latest events (3 events)
  const currentMonth = getMonthKey(new Date())
  const thisMonthEvents = events
    .filter((event) => getMonthKey(new Date(event.startsAt)) === currentMonth)
    .slice(0, 3)

  const fallbackEvents =
    thisMonthEvents.length > 0 ? thisMonthEvents : events.slice(0, 3)

  // Team members
  const teamMembers =
    data.team?.members?.filter((member) => member.isVisible) || []

  // 1 Section: Artikel Terbaru
  const articleSections = [
    {
      title: "ARTIKEL TERBARU",
      slug: "artikel",
      articles: latestArticles.slice(0, 3),
    },
    ...(data.articleSections
      ?.filter((section) => section.isVisible)
      .map((section) => ({
        title: section.title.toLowerCase().includes("cerita dari palembang") ? "Cerita Warga" : section.title,
        slug: section.articleCategorySlug,
        articles: (articlesBySection[section.sectionKey] || []).slice(0, 3),
      })) || []),
  ]

  return (
    <div className="bg-white text-zinc-900">
      {/* 1. HEROES: 3-Panel Widescreen Carousel */}
      <LandingHero slides={heroSlides} />

      {/* Main Content Container (Consistent max-w-[1240px]) */}
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-16 sm:space-y-20">
        {/* 2-6. ARTICLE SECTIONS (Cerita Warga, Gaya Hidup, Ruang Kota, Industri Kreatif, Kebudayaan) */}
        {articleSections.map((section) => (
          <div key={section.slug} className="space-y-16 sm:space-y-20">
            <section aria-label={section.title} className="space-y-6">
              <div className="flex items-center justify-between border-b border-zinc-200 pb-3 sm:pb-3.5">
                <span className="rounded-[3px] bg-black text-white border border-black px-4 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em]">
                  {section.title}
                </span>
                <Link
                  href={`/${section.slug}`}
                  className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:text-zinc-600 transition-colors"
                >
                  More Articles <ArrowRight className="size-3.5" />
                </Link>
              </div>

              {section.articles.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {section.articles.map((article) => (
                    <PublicArticleCard key={article.id} article={article} />
                  ))}
                </div>
              ) : (
                <p className="py-8 text-center text-sm text-black/70 font-serif">
                  Belum ada artikel untuk kategori ini.
                </p>
              )}
            </section>

            <hr className="border-t border-zinc-200" />
          </div>
        ))}

        {/* 7. THIS MONTH AGENDA */}
        <section aria-label="This Month Agenda" className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-200 pb-3 sm:pb-3.5">
            <span className="rounded-[3px] bg-black text-white border border-black px-4 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em]">
              AGENDA BULAN INI
            </span>
            <Link
              href="/agenda"
              className="flex items-center gap-1.5 text-xs sm:text-sm font-bold uppercase tracking-wider text-black hover:text-zinc-600 transition-colors"
            >
              More Events <ArrowRight className="size-3.5" />
            </Link>
          </div>

          {fallbackEvents.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {fallbackEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/agenda/${event.id}`}
                  className="group flex flex-col overflow-hidden"
                >
                  <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                    <Image
                      fill
                      src={event.bannerUrl}
                      alt={event.title}
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-103"
                    />
                  </div>
                  <div className="flex flex-1 flex-col pt-3">
                    <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                      {event.category}
                    </p>
                    <h4 className="mt-1 font-sans text-base sm:text-lg font-bold leading-snug tracking-tight text-black group-hover:underline line-clamp-2 min-h-[44px] sm:min-h-[48px]">
                      {event.title}
                    </h4>
                    <div className="my-2 border-b border-dotted border-zinc-300" />
                    <div className="flex flex-col space-y-1 text-xs text-black/80">
                      <div className="flex items-center gap-1.5">
                        <CalendarDays className="size-3.5 text-black shrink-0" />
                        <span>{event.dateLabel}</span>
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin className="size-3.5 text-black shrink-0" />
                        <span className="truncate">{event.location}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-black/70 font-serif">
              Belum ada agenda terdaftar untuk bulan ini.
            </p>
          )}
        </section>

        {/* Divider */}
        <hr className="border-t border-zinc-200" />

        {/* 8. ABOUT BENAH PALEMBANG */}
        {data.about.title && (
          <section id="about" aria-label="About Benah Palembang" className="py-6 sm:py-8">
            <div className="grid grid-cols-1 lg:grid-cols-[260px_1fr] gap-8 lg:gap-16 items-start">
              {/* Left Column: Eyebrow Badge & Established Text */}
              <div className="flex flex-col items-start space-y-4">
                <span className="rounded-[3px] bg-black text-white border border-black px-4 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em]">
                  ABOUT BENAH PALEMBANG
                </span>
                {data.about.establishedText && (
                  <p className="text-xs uppercase tracking-[0.16em] text-black/60 font-medium">
                    {data.about.establishedText}
                  </p>
                )}
              </div>

              {/* Right Column: Title, Divider, Editorial Description & Closing Text */}
              <div>
                <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black leading-snug">
                  {data.about.title}
                </h2>

                <div className="my-6 border-b border-dotted border-zinc-300 w-full" />

                <p className="font-serif text-base sm:text-lg leading-relaxed text-black/80 w-full text-justify">
                  {data.about.description}
                </p>

                {data.about.closingText && (
                  <div className="mt-8 flex items-center gap-2.5 text-xs font-bold uppercase tracking-[0.16em] text-black">
                    <span className="size-2 rounded-full bg-black inline-block" />
                    <span>{data.about.closingText}</span>
                  </div>
                )}
              </div>
            </div>
          </section>
        )}

        {/* 9. OUR TEAM */}
        {teamMembers.length > 0 && (
          <>
            <hr className="border-t border-zinc-200" />
            <section aria-label="Our Team" className="py-2">
              <div className="flex flex-col items-center text-center space-y-6">
                {/* Header: Align Center */}
                <div className="flex flex-col items-center text-center max-w-2xl mx-auto w-full">
                  <h2 className="font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black">
                    {data.team.title || "Di Balik Benah Palembang"}
                  </h2>
                  {data.team.description && (
                    <p className="mt-2 font-serif text-sm sm:text-base text-black/70">
                      {data.team.description}
                    </p>
                  )}
                  <div className="mt-6 border-b border-dotted border-zinc-300 w-full" />
                </div>

                {/* 3 Columns Grid: Centered */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8 pt-2 w-full justify-center">
                  {teamMembers.map((member) => (
                    <div
                      key={`${member.position}-${member.name}`}
                      className="group flex flex-col items-center text-center mx-auto w-full max-w-[320px]"
                    >
                      <div className="relative aspect-[4/5] w-full overflow-hidden bg-zinc-100 border border-zinc-200 rounded-none">
                        <Image
                          fill
                          src={member.imageUrl}
                          alt={member.name}
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          className="size-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                      </div>
                      <div className="flex flex-1 flex-col items-center text-center pt-3.5 w-full">
                        <h3 className="font-sans text-base sm:text-lg font-bold text-black group-hover:underline transition-colors">
                          {member.name}
                        </h3>
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black/60 mt-0.5">
                          {member.role}
                        </p>
                        <div className="my-2.5 border-b border-dotted border-zinc-200 w-20 mx-auto" />
                        <p className="font-serif text-xs sm:text-[13px] leading-relaxed text-black/80 line-clamp-3">
                          {member.bio}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {/* Divider */}
        <hr className="border-t border-zinc-200" />

        {/* 10. CTA COLLABORATION */}
        <section aria-label="Collaboration Call to Action" className="py-2">
          <div className="border border-black bg-white p-8 sm:p-12">
            <div className="mx-auto max-w-2xl text-center">
              <span className="inline-block rounded-[3px] bg-black text-white border border-black px-4 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em]">
                {data.cta.eyebrow || "COLLABORATION"}
              </span>
              <h2 className="mt-4 font-sans text-2xl sm:text-3xl font-bold tracking-tight text-black">
                {data.cta.title || "Jalin Kolaborasi Bersama Benah Palembang"}
              </h2>
              <p className="mt-3 font-serif text-sm leading-relaxed text-black/80">
                {data.cta.description || "Membuka ruang sinergi bagi brand, kreator, jurnalis warga, dan komunitas untuk merayakan dinamika, budaya, dan denyut kehidupan kota Palembang."}
              </p>
              <div className="mt-6 flex flex-wrap items-center justify-center gap-4">
                <Link
                  href={data.cta.buttonUrl || "/kolaborasi"}
                  className="rounded-[3px] bg-black px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-zinc-800 transition-colors"
                >
                  {data.cta.buttonLabel || "Jelajahi Kolaborasi"}
                </Link>
                <a
                  href={`mailto:${data.cta.contactEmail || "kolaborasi@benahpalembang.id"}`}
                  className="rounded-[3px] border border-black bg-white px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-black hover:bg-black hover:text-white transition-colors"
                >
                  {data.cta.contactLabel || "Hubungi Kami"}
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

      {/* FOOTER */}
      <PublicFooter />
    </div>
  )
}
