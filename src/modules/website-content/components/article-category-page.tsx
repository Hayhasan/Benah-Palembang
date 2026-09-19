"use client"

import { useState } from "react"
import { ChevronDown, SearchX } from "lucide-react"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { PublicArticleCard } from "@/modules/article/components/public-article-card"
import type { PublicArticleCardData } from "@/modules/article/types/public-article"

import type { ArticleCategoryPageData } from "../types/article-category-page"
import { LandingHero } from "./landing-hero"
import { CollaborationCta } from "./collaboration-cta"

export function ArticleCategoryPage({
  data,
  articles,
  contact,
}: {
  data: ArticleCategoryPageData
  articles: PublicArticleCardData[]
  contact: {
    email: string
    emailUrl: string
    whatsappUrl: string
  }
}) {
  const [displayCount, setDisplayCount] = useState(6)

  const heroSlides = data.heroSlides.map((slide, index) => ({
    imageUrl: slide.imageUrl,
    imageAlt: slide.imageAlt,
    eyebrow: slide.label,
    title: slide.title,
    description: slide.description,
    photographerName: slide.photographerName || undefined,
    buttonLabel: "JELAJAHI CERITA",
    buttonUrl: `/${data.slug}`,
    position: slide.position || index + 1,
    isVisible: slide.isVisible ?? true,
  }))

  const visibleArticles = articles.slice(0, displayCount)
  const hasMore = articles.length > displayCount

  return (
    <div className="bg-white text-zinc-900">
      {/* 1. HEROES: 3-Panel Widescreen Carousel */}
      <LandingHero slides={heroSlides} />

      {/* 2. CATEGORY ARTICLE SECTION (Matching Reference Screenshot) */}
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-10 sm:py-16">
        {/* Category Title with subtle dotted divider line matching reference */}
        <div>
          <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold text-black tracking-tight leading-tight">
            {data.category}
          </h1>
          {data.heroSlides && data.heroSlides[0]?.description && (
            <p className="mt-2 font-serif text-sm sm:text-base text-black/70">
              {data.heroSlides[0].description}
            </p>
          )}
          <div className="mt-4 mb-8 sm:mb-12 border-b border-dotted border-zinc-300 w-full" />
        </div>

        {/* 3-Column Articles Grid */}
        {articles.length > 0 ? (
          <div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 sm:gap-x-10 lg:gap-x-12 gap-y-12 lg:gap-y-16">
              {visibleArticles.map((article) => (
                <PublicArticleCard key={article.id} article={article} />
              ))}
            </div>

            {hasMore && (
              <div className="mt-14 sm:mt-16 flex justify-center">
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
          </div>
        ) : (
          <div className="min-h-[30vh] flex flex-col items-center justify-center py-16 text-center">
            <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
              <SearchX className="size-6" />
            </div>
            <h2 className="font-sans text-xl font-bold text-zinc-800">
              Belum ada artikel di kategori {data.category}
            </h2>
            <p className="mt-2 font-serif text-sm text-zinc-500">
              Cerita baru akan segera hadir. Silakan periksa kembali nanti.
            </p>
          </div>
        )}
      </main>

      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 pb-10 sm:pb-16">
        <CollaborationCta contact={contact} />
      </main>

      {/* 3. FOOTER */}
      <Footer />
    </div>
  )
}
