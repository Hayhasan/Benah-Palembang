"use client"

import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock3,
  Copy,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  RotateCcw,
  Share2,
  Trash2,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { ModerationConfirmDialog } from "./moderation-confirm-dialog"
import { Button } from "@/components/ui/button"
import type { OwnedArticleEditorData } from "@/modules/article/types/article"

import { approveContentAction } from "../actions/approve-content"
import { rejectContentAction } from "../actions/reject-content"
import { restoreContentAction } from "../actions/restore-content"
import { takedownContentAction } from "../actions/takedown-content"

export function ManagedArticlePreview({
  article,
}: {
  article: OwnedArticleEditorData
}) {
  const router = useRouter()
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isPending, startTransition] = useTransition()

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    action: "approve" | "reject" | "takedown" | "restore"
  }>({
    open: false,
    action: "takedown",
  })

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

      {/* ── Main Article Layout (Public Website Style) ── */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm sm:rounded-2xl">
        {/* Article Hero Header */}
        <header className="relative overflow-hidden bg-palembang-charcoal px-4 py-8 text-white sm:px-8 sm:py-12 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-30 sm:w-2/3 lg:w-1/2 lg:opacity-45">
            {article.coverImageUrl ? (
              <Image
                src={article.coverImageUrl}
                alt={article.title}
                fill
                priority
                sizes="(min-width: 1024px) 50vw, 100vw"
                className="object-cover object-right"
              />
            ) : null}
            <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1040px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-red">
              {article.categoryLabel}
            </span>
            <h1 className="mt-3 max-w-4xl font-display text-2xl font-black leading-tight tracking-[-0.03em] sm:mt-4 sm:text-4xl lg:text-5xl break-words">
              {article.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/80 sm:mt-6 sm:text-base sm:leading-7">
              {article.excerpt}
            </p>

            <div className="mt-6 flex flex-col gap-4 border-y border-white/15 py-3.5 sm:mt-8 sm:flex-row sm:items-center sm:justify-between sm:gap-6 sm:py-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="size-10 sm:size-11 rounded-full border border-white/20 object-cover"
                />
                <div className="min-w-0">
                  <p className="truncate text-sm font-semibold text-white">
                    {article.author.name}
                  </p>
                  <p className="text-xs text-white/60">
                    {article.author.roleLabel} · {article.publishedAtLabel}
                  </p>
                </div>
              </div>

              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/75 sm:gap-5">
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-3.5 text-palembang-red" />
                  {article.readingTime} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="size-3.5 text-palembang-red" />
                  {article.likesCount.toLocaleString("id-ID")} likes
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="size-3.5 text-emerald-400" />
                  {article.commentsCount.toLocaleString("id-ID")} comments
                </span>
                <span className="flex items-center gap-1.5">
                  <Eye className="size-3.5 text-sky-400" />
                  {article.views.toLocaleString("id-ID")} views
                </span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body Content & Interaction Area */}
        <div className="mx-auto grid max-w-[1040px] gap-8 px-4 py-6 sm:px-8 sm:py-10 lg:grid-cols-[60px_1fr] lg:gap-10 lg:py-14">
          {/* Floating Aside Actions on Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col items-center gap-3">
              <button
                type="button"
                aria-label="Sukai artikel"
                onClick={() => setLiked((value) => !value)}
                className={`rounded-full border bg-background p-3 transition-colors ${
                  liked
                    ? "border-palembang-red bg-palembang-red text-white"
                    : "border-border hover:border-palembang-red hover:text-palembang-red"
                }`}
                title="Sukai Artikel"
              >
                <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
              </button>
              <button
                type="button"
                aria-label="Bagikan artikel"
                onClick={shareArticle}
                className="rounded-full border border-border bg-background p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"
                title="Bagikan"
              >
                <Share2 className="size-4" />
              </button>
              <button
                type="button"
                aria-label="Salin tautan"
                onClick={() => void copyLink()}
                className="rounded-full border border-border bg-background p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"
                title="Salin Tautan"
              >
                {copied ? (
                  <Check className="size-4 text-emerald-600" />
                ) : (
                  <Copy className="size-4" />
                )}
              </button>
            </div>
          </aside>

          {/* Main Article Content */}
          <div className="min-w-0">
            <div
              className="article-body max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2 border-t border-border pt-5 sm:mt-10 sm:pt-6">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground sm:px-3 sm:py-1.5"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Mobile Interaction Bar */}
            <div className="mt-8 grid grid-cols-3 gap-2 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiked((v) => !v)}
                className={`h-10 text-xs font-semibold ${
                  liked
                    ? "border-palembang-red bg-palembang-red/10 text-palembang-red"
                    : ""
                }`}
              >
                <Heart
                  className={`mr-1.5 size-3.5 ${
                    liked ? "fill-current text-palembang-red" : ""
                  }`}
                />
                {liked ? "Disukai" : "Suka"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={shareArticle}
                className="h-10 text-xs font-semibold"
              >
                <Share2 className="mr-1.5 size-3.5" />
                Bagikan
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void copyLink()}
                className="h-10 text-xs font-semibold"
              >
                {copied ? (
                  <Check className="mr-1.5 size-3.5 text-emerald-600" />
                ) : (
                  <Copy className="mr-1.5 size-3.5" />
                )}
                {copied ? "Tersalin" : "Salin"}
              </Button>
            </div>

            {/* Author Info Box */}
            <div className="mt-10 rounded-2xl bg-muted/40 p-4 sm:mt-16 sm:rounded-[1.5rem] sm:p-8">
              <div className="flex items-center gap-3.5 sm:gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="size-12 sm:size-16 rounded-full object-cover"
                />
                <div className="min-w-0">
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-red">
                    Tentang Penulis
                  </p>
                  <h2 className="mt-0.5 truncate font-display text-lg font-bold sm:mt-1 sm:text-xl">
                    {article.author.name}
                  </h2>
                </div>
              </div>
              <p className="mt-3.5 text-xs leading-relaxed text-muted-foreground sm:mt-5 sm:text-sm sm:leading-6">
                {article.author.bio}
              </p>
            </div>
          </div>
        </div>
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
