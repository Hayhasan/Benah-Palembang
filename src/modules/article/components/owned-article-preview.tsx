"use client"

import {
  ArrowLeft,
  Calendar,
  Check,
  Copy,
  Edit2,
  Eye,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { useMemo, useState } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { PublicArticleHeroCarousel } from "./public-article-hero-carousel"
import { PublicArticleVenueSidebar } from "./public-article-venue-sidebar"
import type { OwnedArticleEditorData } from "../types/article"
import type { PublicArticleDetailData } from "../types/public-article"

const SUPPLEMENTARY_CATEGORY_PHOTOS: Record<string, string[]> = {
  "cerita-warga": [
    "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/38885810/pexels-photo-38885810.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/32844866/pexels-photo-32844866.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
  ],
  "gaya-hidup": [
    "https://images.pexels.com/photos/37234075/pexels-photo-37234075.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/38885810/pexels-photo-38885810.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
  ],
  "ruang-kota": [
    "https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/32844866/pexels-photo-32844866.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
  ],
  "industri-kreatif": [
    "https://images.pexels.com/photos/32844866/pexels-photo-32844866.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/37234075/pexels-photo-37234075.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
  ],
  "kebudayaan": [
    "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/38885810/pexels-photo-38885810.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
  ],
}

function resolveArticlePhotos(
  coverImageUrl: string,
  content: string,
  categorySlug: string,
): string[] {
  const photos: string[] = []
  if (coverImageUrl) photos.push(coverImageUrl)

  const imgRegex = /<img\s+[^>]*src=["']([^"']+)["']/gi
  let match: RegExpExecArray | null
  while ((match = imgRegex.exec(content)) !== null) {
    if (match[1] && !photos.includes(match[1])) {
      photos.push(match[1])
    }
  }

  if (photos.length < 3) {
    const fallbackList =
      SUPPLEMENTARY_CATEGORY_PHOTOS[categorySlug] ||
      SUPPLEMENTARY_CATEGORY_PHOTOS["cerita-warga"]
    for (const url of fallbackList) {
      if (!photos.includes(url)) photos.push(url)
      if (photos.length >= 3) break
    }
  }

  return photos
}

export function OwnedArticlePreview({
  article,
}: {
  article: OwnedArticleEditorData
}) {
  const [copied, setCopied] = useState(false)
  const photographerName =
    article.photographer?.trim() ||
    article.author?.name ||
    "Tim Redaksi Benah Palembang"

  const photos = useMemo(() => {
    return resolveArticlePhotos(
      article.coverImageUrl,
      article.content,
      article.categorySlug,
    )
  }, [article.coverImageUrl, article.content, article.categorySlug])

  async function copyLink() {
    try {
      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      toast.success("Tautan artikel berhasil disalin!")
      window.setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.info("Tautan artikel: " + window.location.href)
    }
  }

  function shareArticle() {
    if (navigator.share) {
      void navigator.share({
        title: article.title,
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
              <Link href="/dashboard/create-article">
                <ArrowLeft className="size-3.5" />
                <span>Kembali</span>
              </Link>
            </Button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
              <Eye className="size-3 shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-none">
                Preview · {article.statusLabel}
              </span>
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Button
              asChild
              className="h-8 w-full gap-1.5 bg-palembang-red text-xs text-white hover:bg-palembang-red/90 sm:w-auto"
            >
              <Link href={`/dashboard/create-article/edit?id=${article.id}`}>
                <Edit2 className="size-3.5" />
                <span>Edit Artikel Ini</span>
              </Link>
            </Button>
          </div>
        </div>
      </div>

      {/* ── Main Article Layout (Sama dengan Public Website) ── */}
      <div className="bg-white text-zinc-900 -mx-4 sm:-mx-6 md:-mx-10">
        {/* 1. HEROES CAROUSEL AT THE VERY TOP */}
        <section aria-label="Featured Photos Carousel" className="w-full">
          <PublicArticleHeroCarousel
            photos={photos}
            title={article.title}
            description={article.excerpt}
            photographerName={photographerName}
          />
        </section>

        {/* 2. ARTICLE HEADER: Category, Author Meta */}
        <header className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 pt-6 sm:pt-8">
          <div className="flex flex-wrap items-center justify-between gap-4 border-b border-zinc-200 pb-4 text-xs text-black">
            <div className="flex flex-wrap items-center gap-3">
              {/* Category Pill */}
              <span className="inline-block rounded-[3px] bg-black text-white border border-black px-3.5 py-1 text-[10px] sm:text-xs font-bold uppercase tracking-[0.14em]">
                {article.categoryLabel}
              </span>
              <span className="text-zinc-300">•</span>
              <div className="flex items-center gap-2 select-none">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="size-7 rounded-full object-cover ring-1 ring-zinc-200"
                />
                <span className="font-semibold text-zinc-900 leading-tight">
                  {article.author.name}
                </span>
              </div>
              <span className="text-zinc-300">•</span>
              <time dateTime={article.updatedAt} className="text-zinc-500">
                {article.updatedAtLabel}
              </time>
            </div>

            <div className="flex items-center gap-4 text-zinc-500">
              <div className="flex items-center gap-1.5">
                <Eye className="size-3.5" />
                <span>{article.views.toLocaleString("id-ID")} views</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                <span>{article.publishedAtLabel || article.updatedAtLabel}</span>
              </div>
            </div>
          </div>
        </header>

        {/* 3. CONTENT AREA: ARTICLE BODY (LEFT) & SPOT INFO + BAGIKAN ARTIKEL (RIGHT) */}
        <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 sm:pb-20">
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] xl:grid-cols-[1fr_310px] gap-10 xl:gap-16 items-start">
            {/* Main Article Column */}
            <article className="min-w-0">
              <div
                className="article-body prose prose-zinc max-w-none prose-headings:font-sans prose-headings:font-bold prose-p:font-serif prose-p:text-[15px] sm:prose-p:text-base prose-p:leading-[1.8] prose-p:text-zinc-800"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {/* Tags */}
              {article.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2 border-t border-zinc-100 pt-6">
                  {article.tags.map((tag) => (
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

            {/* Right Sidebar: Venue / Spot Information Element + BAGIKAN ARTIKEL */}
            <aside className="w-full lg:sticky lg:top-24 pt-2 space-y-8">
              <PublicArticleVenueSidebar
                article={article as unknown as PublicArticleDetailData}
              />

              {/* BAGIKAN ARTIKEL */}
              <div
                aria-label="Bagikan Artikel"
                className="w-full max-w-[280px] sm:max-w-[300px] text-zinc-900"
              >
                <div>
                  <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
                    BAGIKAN ARTIKEL
                  </span>
                  <div className="mt-1.5 mb-2.5 border-b border-dotted border-zinc-300 w-full" />
                </div>

                <p className="font-serif text-xs sm:text-[13px] text-black/80 leading-relaxed mb-3.5">
                  Bagikan cerita ini kepada teman dan komunitas Anda.
                </p>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={shareArticle}
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
            </aside>
          </div>
        </main>
      </div>
    </div>
  )
}
