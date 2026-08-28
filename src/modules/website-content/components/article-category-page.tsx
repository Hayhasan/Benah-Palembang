"use client"

import { ChevronDown, Search } from "lucide-react"
import { useState } from "react"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { PublicArticleCard } from "@/modules/article/components/public-article-card"
import type { PublicArticleCardData } from "@/modules/article/types/public-article"

import type { ArticleCategoryPageData } from "../types/article-category-page"

export function ArticleCategoryPage({
  data,
  articles,
}: {
  data: ArticleCategoryPageData
  articles: PublicArticleCardData[]
}) {
  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState(false)
  const filtered = articles.filter((article) =>
    `${article.title} ${article.excerpt}`
      .toLowerCase()
      .includes(query.toLowerCase()),
  )
  const initialCount = 4
  const visibleArticles =
    showAll || query ? filtered : filtered.slice(0, initialCount)
  const hasMore = !showAll && !query && filtered.length > initialCount

  return (
    <>
      <div className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-40 text-white sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-25 sm:w-2/3 lg:w-1/2 lg:opacity-40">
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
          <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">
            Category / {data.category}
          </p>
          <h1 className="mt-6 max-w-4xl font-display text-6xl font-black leading-[0.9] tracking-[-0.065em] sm:text-8xl">
            {data.hero.title}
          </h1>
          <p className="mt-8 max-w-lg text-base leading-7 text-white/65">
            {data.hero.description}
          </p>
          <div className="mt-10 flex max-w-xl items-center gap-3 border-b border-white/30 pb-3">
            <Search className="size-4 text-white/50" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stories..."
              aria-label="Search stories"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
          </div>
        </div>
      </div>
      <main className="relative px-6 py-20 sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          {filtered.length > 0 ? (
            <div className="relative">
              <div className="columns-2 gap-3 sm:columns-2 sm:gap-6 lg:columns-4">
                {visibleArticles.map((article) => (
                  <PublicArticleCard
                    key={article.id}
                    article={article}
                    masonry
                  />
                ))}
              </div>
              {hasMore ? (
                <div className="absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-6 backdrop-blur-[2px]">
                  <button
                    type="button"
                    onClick={() => setShowAll(true)}
                    className="group flex items-center gap-3 rounded-full border border-border bg-background/95 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red"
                  >
                    Tampilkan Seluruh Cerita ({filtered.length} Berita)
                    <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="py-20 text-center">
              <p className="font-display text-3xl">Cerita tidak ditemukan.</p>
              <p className="mt-3 text-sm text-muted-foreground">
                Coba kata kunci lain.
              </p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}
