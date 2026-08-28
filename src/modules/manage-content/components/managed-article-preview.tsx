"use client"

import {
  ArrowLeft,
  Check,
  CheckCircle,
  Clock3,
  Copy,
  Eye,
  Heart,
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

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { Button } from "@/components/ui/button"
import { getPublicArticleMockStats } from "@/modules/article/constants/public-article-stats"
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
  const stats = getPublicArticleMockStats(article.id)
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

  function handleConfirmAction() {
    const { action } = confirmModal

    startTransition(async () => {
      let result = { success: false, message: "" }

      if (action === "approve") {
        result = await approveContentAction({
          type: "ARTICLE",
          id: article.id,
        })
      } else if (action === "reject") {
        result = await rejectContentAction({
          type: "ARTICLE",
          id: article.id,
        })
      } else if (action === "takedown") {
        result = await takedownContentAction({
          type: "ARTICLE",
          id: article.id,
        })
      } else if (action === "restore") {
        result = await restoreContentAction({
          type: "ARTICLE",
          id: article.id,
        })
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
      <div className="sticky top-0 z-20 flex flex-col gap-4 border-b bg-background/90 px-4 py-3.5 shadow-sm backdrop-blur-md sm:flex-row sm:items-center sm:justify-between md:-mx-8">
        <div className="flex flex-wrap items-center gap-3">
          <Button variant="outline" size="sm" asChild>
            <Link href="/dashboard/content">
              <ArrowLeft className="size-4" />
              Kembali
            </Link>
          </Button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <Eye className="size-3.5" />
            Moderasi Artikel - {article.statusLabel}
          </span>
        </div>

        {/* Action Buttons for Admin (No Edit Button) */}
        <div className="flex flex-wrap items-center gap-2">
          {article.status === "PENDING_REVIEW" && (
            <>
              <Button
                size="sm"
                disabled={isPending}
                onClick={() => handleAction("approve")}
                className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
              >
                <CheckCircle className="size-3.5" /> Setujui
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={isPending}
                onClick={() => handleAction("reject")}
                className="gap-1.5 border-zinc-300 text-xs text-zinc-700 hover:bg-zinc-100"
              >
                <XCircle className="size-3.5" /> Tolak
              </Button>
            </>
          )}

          {article.status === "PUBLISHED" && (
            <Button
              variant="outline"
              size="sm"
              disabled={isPending}
              onClick={() => handleAction("takedown")}
              className="gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50"
            >
              <Trash2 className="size-3.5" /> Takedown
            </Button>
          )}

          {article.status === "REJECTED" && (
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => handleAction("restore")}
              className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
            >
              <RotateCcw className="size-3.5" /> Pulihkan (Publish)
            </Button>
          )}

          {article.status === "TAKEN_DOWN" && (
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => handleAction("restore")}
              className="gap-1.5 bg-red-600 text-xs text-white hover:bg-red-700"
            >
              <RotateCcw className="size-3.5" /> Restore
            </Button>
          )}
        </div>
      </div>

      {/* ── Main Article Layout (Public Website Style) ── */}
      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        {/* Article Hero Header */}
        <header className="relative overflow-hidden bg-palembang-charcoal px-6 pb-16 pt-16 text-white sm:px-10 lg:px-16">
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
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">
              {article.categoryLabel}
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-3xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-y border-white/15 py-4">
              <div className="flex items-center gap-3">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="size-11 rounded-full border border-white/20 object-cover"
                />
                <div>
                  <p className="text-sm font-semibold text-white">
                    {article.author.name}
                  </p>
                  <p className="text-xs text-white/60">
                    {article.author.roleLabel} · {article.publishedAtLabel}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs text-white/70">
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-4 text-palembang-gold" />
                  {article.readingTime} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="size-4 text-palembang-red" />
                  {article.likesCount.toLocaleString("id-ID")} likes
                </span>
                <span className="flex items-center gap-1.5">
                  <MessageCircle className="size-4 text-emerald-400" />
                  {article.commentsCount.toLocaleString("id-ID")} comments
                </span>
                <span>{stats.views.toLocaleString("id-ID")} views</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body Content & Interaction Area */}
        <div className="mx-auto grid max-w-[1040px] gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[60px_1fr] lg:py-16">
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
          <div>
            <div
              className="article-body max-w-none leading-relaxed"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />

            {/* Tags */}
            {article.tags.length > 0 ? (
              <div className="mt-10 flex flex-wrap gap-2 border-t border-border pt-6">
                {article.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            ) : null}

            {/* Mobile Interaction Bar */}
            <div className="mt-8 flex gap-3 lg:hidden">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setLiked((v) => !v)}
              >
                <Heart
                  className={`mr-1.5 size-4 ${
                    liked ? "fill-palembang-red text-palembang-red" : ""
                  }`}
                />
                {liked ? "Disukai" : "Suka"}
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => void copyLink()}
              >
                {copied ? (
                  <Check className="mr-1.5 size-4 text-emerald-600" />
                ) : (
                  <Copy className="mr-1.5 size-4" />
                )}
                Salin Tautan
              </Button>
            </div>

            {/* Author Info Box */}
            <div className="mt-16 rounded-[1.5rem] bg-muted/50 p-6 sm:p-8">
              <div className="flex items-center gap-4">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.author.avatarUrl}
                  alt={article.author.name}
                  className="size-16 rounded-full object-cover"
                />
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-red">
                    Tentang Penulis
                  </p>
                  <h2 className="mt-1 font-display text-xl font-bold">
                    {article.author.name}
                  </h2>
                </div>
              </div>
              <p className="mt-5 text-sm leading-6 text-muted-foreground">
                {article.author.bio}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Confirmation Dialog */}
      <ConfirmActionDialog
        open={confirmModal.open}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmModal((prev) => ({ ...prev, open: false }))
          }
        }}
        title={
          confirmModal.action === "approve"
            ? "Konfirmasi Persetujuan Artikel"
            : confirmModal.action === "reject"
              ? "Konfirmasi Penolakan Artikel"
              : confirmModal.action === "takedown"
                ? "Konfirmasi Takedown Artikel"
                : "Konfirmasi Pemulihan Artikel"
        }
        description={
          confirmModal.action === "approve"
            ? `Apakah Anda yakin ingin menyetujui dan mempublikasikan artikel "${article.title}"?`
            : confirmModal.action === "reject"
              ? `Apakah Anda yakin ingin menolak pengajuan artikel "${article.title}"?`
              : confirmModal.action === "takedown"
                ? `Apakah Anda yakin ingin men-takedown artikel "${article.title}" dari penayangan publik?`
                : `Apakah Anda yakin ingin memulihkan artikel "${article.title}" ke status Posted?`
        }
        confirmText={
          confirmModal.action === "approve"
            ? "Ya, Setujui"
            : confirmModal.action === "reject"
              ? "Ya, Tolak"
              : confirmModal.action === "takedown"
                ? "Ya, Takedown"
                : "Ya, Pulihkan"
        }
        cancelText="Batal"
        variant={
          confirmModal.action === "takedown" ||
          confirmModal.action === "reject"
            ? "destructive"
            : "default"
        }
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}
