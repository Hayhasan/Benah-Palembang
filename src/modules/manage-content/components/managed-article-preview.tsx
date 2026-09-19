"use client"

import {
  ArrowLeft,
  Calendar,
  Check,
  CheckCircle,
  Copy,
  Eye,
  Loader2,
  RotateCcw,
  Share2,
  Trash2,
  XCircle,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useMemo, useState, useTransition } from "react"
import { toast } from "sonner"

import { ModerationConfirmDialog } from "./moderation-confirm-dialog"
import { Button } from "@/components/ui/button"
import { PublicArticleHeroCarousel } from "@/modules/article/components/public-article-hero-carousel"
import { PublicArticleVenueSidebar } from "@/modules/article/components/public-article-venue-sidebar"
import type { OwnedArticleEditorData } from "@/modules/article/types/article"
import type { PublicArticleDetailData } from "@/modules/article/types/public-article"

import { approveContentAction } from "../actions/approve-content"
import { rejectContentAction } from "../actions/reject-content"
import { restoreContentAction } from "../actions/restore-content"
import { takedownContentAction } from "../actions/takedown-content"

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

export function ManagedArticlePreview({
  article,
}: {
  article: OwnedArticleEditorData
}) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    action: "approve" | "reject" | "takedown" | "restore"
  }>({
    open: false,
    action: "takedown",
  })

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

  function handleAction(action: "approve" | "reject" | "takedown" | "restore") {
    setConfirmModal({
      open: true,
      action,
    })
  }

  function handleConfirmAction(note: string) {
    const { action } = confirmModal

    startTransition(async () => {
      let result = { success: false, message: "" }
      const payload = { type: "ARTICLE" as const, id: article.id, note }

      if (action === "approve") {
        result = await approveContentAction(payload)
      } else if (action === "reject") {
        result = await rejectContentAction(payload)
      } else if (action === "takedown") {
        result = await takedownContentAction(payload)
      } else if (action === "restore") {
        result = await restoreContentAction(payload)
      }

      if (result.success) {
        toast.success(result.message)
        router.refresh()
      } else {
        toast.error(result.message)
      }

      setConfirmModal((prev) => ({ ...prev, open: false }))
    })
  }

  return (
    <div className="space-y-6 pb-16">
      {/* ── Top Action & Moderation Header ── */}
      <div className="sticky top-16 z-20 -mx-4 border-b bg-background/95 px-4 py-3 shadow-xs backdrop-blur-md sm:-mx-6 sm:px-6 md:-mx-10 md:px-10 lg:top-0">
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center justify-between gap-2 sm:justify-start">
            <Button variant="outline" size="sm" asChild className="h-8 gap-1.5 px-2.5 text-xs">
              <Link href="/dashboard/content/article">
                <ArrowLeft className="size-3.5" />
                <span>Kembali</span>
              </Link>
            </Button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
              <Eye className="size-3 shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-none">
                Moderasi · {article.statusLabel}
              </span>
            </span>
          </div>

          {/* Action Buttons for Admin */}
          <div className="flex items-center gap-2">
            {article.status === "PENDING_REVIEW" && (
              <>
                <Button
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleAction("approve")}
                  className="h-8 flex-1 gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700 sm:flex-initial"
                >
                  {isPending && confirmModal.action === "approve" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <CheckCircle className="size-3.5" />
                  )}
                  {isPending && confirmModal.action === "approve"
                    ? "Memproses..."
                    : "Setujui"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => handleAction("reject")}
                  className="h-8 flex-1 gap-1.5 border-zinc-300 text-xs text-zinc-700 hover:bg-zinc-100 dark:border-zinc-700 dark:text-zinc-200 sm:flex-initial"
                >
                  {isPending && confirmModal.action === "reject" ? (
                    <Loader2 className="size-3.5 animate-spin" />
                  ) : (
                    <XCircle className="size-3.5" />
                  )}
                  {isPending && confirmModal.action === "reject"
                    ? "Memproses..."
                    : "Tolak"}
                </Button>
              </>
            )}

            {article.status === "PUBLISHED" && (
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => handleAction("takedown")}
                className="h-8 w-full gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50 dark:border-red-900/40 dark:text-red-400 sm:w-auto"
              >
                {isPending && confirmModal.action === "takedown" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Trash2 className="size-3.5" />
                )}
                {isPending && confirmModal.action === "takedown"
                  ? "Memproses..."
                  : "Takedown"}
              </Button>
            )}

            {article.status === "REJECTED" && (
              <Button
                size="sm"
                disabled={isPending}
                onClick={() => handleAction("restore")}
                className="h-8 w-full gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700 sm:w-auto"
              >
                {isPending && confirmModal.action === "restore" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="size-3.5" />
                )}
                {isPending && confirmModal.action === "restore"
                  ? "Memproses..."
                  : "Pulihkan (Publish)"}
              </Button>
            )}

            {article.status === "TAKEN_DOWN" && (
              <Button
                size="sm"
                disabled={isPending}
                onClick={() => handleAction("restore")}
                className="h-8 w-full gap-1.5 bg-red-600 text-xs text-white hover:bg-red-700 sm:w-auto"
              >
                {isPending && confirmModal.action === "restore" ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <RotateCcw className="size-3.5" />
                )}
                {isPending && confirmModal.action === "restore"
                  ? "Memproses..."
                  : "Restore"}
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* ── Main Article Layout (Sama dengan Public Website) ── */}
      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white text-zinc-900 shadow-sm">
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

      {/* Confirmation Dialog */}
      <ModerationConfirmDialog
        open={confirmModal.open}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmModal((prev) => ({ ...prev, open: false }))
          }
        }}
        action={confirmModal.action}
        contentLabel="Artikel"
        contentTitle={article.title}
        isPending={isPending}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}
