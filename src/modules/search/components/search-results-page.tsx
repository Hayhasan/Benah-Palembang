"use client"

import { CalendarDays, Clock3, ExternalLink, MapPin, Search, SearchX } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"

import type { SearchResults } from "../types/search"

type ActiveTab = "all" | "articles" | "events" | "collaborations"

export function SearchResultsPage({
  initialResults,
}: {
  initialResults: SearchResults
}) {
  const router = useRouter()
  const [activeTab, setActiveTab] = useState<ActiveTab>("all")
  const [queryInput, setQueryInput] = useState(initialResults.query)

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (!queryInput.trim()) return
    router.push(`/search?q=${encodeURIComponent(queryInput.trim())}`)
  }

  const { articles, events, collaborations, totalCount } = initialResults

  const showArticles =
    (activeTab === "all" || activeTab === "articles") && articles.length > 0
  const showEvents =
    (activeTab === "all" || activeTab === "events") && events.length > 0
  const showCollaborations =
    (activeTab === "all" || activeTab === "collaborations") &&
    collaborations.length > 0

  const hasAnyResults =
    (activeTab === "all" && totalCount > 0) ||
    (activeTab === "articles" && articles.length > 0) ||
    (activeTab === "events" && events.length > 0) ||
    (activeTab === "collaborations" && collaborations.length > 0)

  return (
    <div className="bg-white text-zinc-900 min-h-screen flex flex-col justify-between">
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-10 sm:py-16 w-full flex-1">
        {/* Header & Search Bar */}
        <div className="mb-10 sm:mb-12">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-zinc-200">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-zinc-400">
                PENCARIAN KONTEN
              </p>
              <h1 className="mt-2 font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-black">
                {initialResults.query ? (
                  <>
                    Hasil untuk:{" "}
                    <span className="italic">“{initialResults.query}”</span>
                  </>
                ) : (
                  "Semua Konten"
                )}
              </h1>
              <p className="mt-2 font-serif text-sm text-zinc-500">
                Ditemukan {totalCount} hasil pencarian dari seluruh artikel, agenda, dan kolaborasi.
              </p>
            </div>

            {/* In-page search bar */}
            <form
              onSubmit={handleSearch}
              className="flex items-center gap-2 border border-zinc-300 rounded-[3px] bg-white px-3.5 py-2 sm:w-80"
            >
              <Search className="size-4 text-zinc-400 shrink-0" />
              <input
                type="text"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                placeholder="Cari konten lainnya..."
                className="w-full bg-transparent text-xs text-black outline-none placeholder:text-zinc-400"
              />
              <button
                type="submit"
                className="text-xs font-bold uppercase tracking-wider text-black hover:text-zinc-600"
              >
                Cari
              </button>
            </form>
          </div>

          {/* Filter Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto no-scrollbar pt-6 pb-2">
            {[
              { key: "all", label: "Semua", count: totalCount },
              { key: "articles", label: "Artikel", count: articles.length },
              { key: "events", label: "Agenda", count: events.length },
              {
                key: "collaborations",
                label: "Kolaborasi",
                count: collaborations.length,
              },
            ].map((tab) => (
              <button
                key={tab.key}
                type="button"
                onClick={() => setActiveTab(tab.key as ActiveTab)}
                className={`whitespace-nowrap rounded-[3px] px-4 py-1.5 text-xs font-bold uppercase tracking-[0.1em] transition-all border ${
                  activeTab === tab.key
                    ? "bg-black text-white border-black"
                    : "bg-white text-zinc-700 border-zinc-200 hover:border-black hover:text-black"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            ))}
          </div>
        </div>

        {/* Results List */}
        {hasAnyResults ? (
          <div className="space-y-16 sm:space-y-20">
            {/* 1. ARTICLES */}
            {showArticles && (
              <section aria-label="Hasil Artikel" className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                  <span className="rounded-[3px] bg-black text-white border border-black px-4 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em]">
                    ARTIKEL ({articles.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {articles.map((article) => (
                    <Link
                      key={article.id}
                      href={`/artikel/${article.slug}`}
                      className="group flex flex-col overflow-hidden"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={article.coverImageUrl}
                          alt={article.title}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </div>
                      <div className="flex flex-1 flex-col pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                          {article.category}
                        </p>
                        <h3 className="mt-1 font-sans text-base sm:text-lg font-bold leading-snug tracking-tight text-black group-hover:underline line-clamp-2 min-h-[44px] sm:min-h-[48px]">
                          {article.title}
                        </h3>
                        <p className="mt-2 font-serif text-xs sm:text-[13px] leading-relaxed text-black/80 line-clamp-2">
                          {article.excerpt}
                        </p>
                        <div className="my-2 border-b border-dotted border-zinc-200" />
                        <div className="flex items-center justify-between text-[11px] text-zinc-500">
                          <span>{article.publishedAtLabel}</span>
                          <span>{article.views.toLocaleString("id-ID")} views</span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              </section>
            )}

            {/* 2. AGENDA */}
            {showEvents && (
              <section aria-label="Hasil Agenda" className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                  <span className="rounded-[3px] bg-black text-white border border-black px-4 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em]">
                    AGENDA ({events.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
                  {events.map((event) => (
                    <Link
                      key={event.id}
                      href={`/agenda/${event.id}`}
                      className="group flex flex-col overflow-hidden"
                    >
                      <div className="relative aspect-[16/10] w-full overflow-hidden bg-zinc-100">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={event.bannerUrl}
                          alt={event.title}
                          className="size-full object-cover transition-transform duration-500 group-hover:scale-103"
                        />
                      </div>
                      <div className="flex flex-1 flex-col pt-3">
                        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-black">
                          {event.category}
                        </p>
                        <h3 className="mt-1 font-sans text-base sm:text-lg font-bold leading-snug tracking-tight text-black group-hover:underline line-clamp-2 min-h-[44px] sm:min-h-[48px]">
                          {event.title}
                        </h3>
                        <div className="my-2 border-b border-dotted border-zinc-300" />
                        <div className="flex flex-col space-y-1 text-xs text-black/80">
                          <div className="flex items-center gap-1.5">
                            <CalendarDays className="size-3.5 text-black shrink-0" />
                            <span>{event.dateLabel}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <Clock3 className="size-3.5 text-black shrink-0" />
                            <span>{event.timeLabel}</span>
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
              </section>
            )}

            {/* 3. COLLABORATION */}
            {showCollaborations && (
              <section aria-label="Hasil Kolaborasi" className="space-y-6">
                <div className="flex items-center justify-between border-b border-zinc-200 pb-3">
                  <span className="rounded-[3px] bg-black text-white border border-black px-4 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em]">
                    KOLABORASI ({collaborations.length})
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {collaborations.map((item) => (
                    <a
                      key={item.id}
                      href={item.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block break-inside-avoid overflow-hidden"
                      title={item.title}
                    >
                      <div className="relative aspect-video overflow-hidden border border-zinc-200 bg-zinc-900">
                        {item.thumbnailUrl ? (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={item.thumbnailUrl}
                            alt={item.title}
                            className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                          />
                        ) : (
                          <div className="size-full flex items-center justify-center bg-zinc-800 text-zinc-500">
                            <ExternalLink className="size-6" />
                          </div>
                        )}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
                        <div className="absolute inset-x-0 bottom-0 p-3.5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 z-10">
                          <h3 className="line-clamp-2 text-xs sm:text-sm font-bold leading-snug text-white">
                            {item.title}
                          </h3>
                        </div>
                      </div>
                    </a>
                  ))}
                </div>
              </section>
            )}
          </div>
        ) : (
          <div className="min-h-[40vh] flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-4 flex size-14 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <SearchX className="size-7" />
            </div>
            <h2 className="font-sans text-xl sm:text-2xl font-bold text-black">
              Tidak Ada Hasil Ditemukan
            </h2>
            <p className="mt-2 font-serif text-sm text-zinc-500 max-w-md">
              Kami tidak dapat menemukan artikel, agenda, atau kolaborasi yang cocok
              dengan kata kunci &ldquo;{initialResults.query}&rdquo;. Silakan coba kata kunci lain.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  )
}
