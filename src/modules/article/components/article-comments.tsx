"use client"

import {
  ChevronDown,
  Loader2,
  LogIn,
  MessageCircle,
  MessageSquareDashed,
  Send,
  Trash2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { Button } from "@/components/ui/button"
import { DEFAULT_AVATAR } from "@/lib/constants/placeholder"
import { useSession } from "@/modules/auth/hooks/use-session"

import { createArticleCommentAction } from "../actions/create-article-comment"
import { deleteArticleCommentAction } from "../actions/delete-article-comment"
import type { PublicArticleCommentItem } from "../types/public-article"

const INITIAL_VISIBLE_COUNT = 4

interface ArticleCommentsProps {
  articleId: number
  articleSlug: string
  comments: PublicArticleCommentItem[]
}

export function ArticleComments({
  articleId,
  articleSlug,
  comments,
}: ArticleCommentsProps) {
  const router = useRouter()
  const { user, status } = useSession()
  const isAuthenticated = status === "authenticated" && Boolean(user)

  const [commentText, setCommentText] = useState("")
  const [isCreatePending, startCreateTransition] = useTransition()
  const [isDeletePending, startDeleteTransition] = useTransition()
  const [deletingCommentId, setDeletingCommentId] = useState<number | null>(null)
  const [commentToDelete, setCommentToDelete] =
    useState<PublicArticleCommentItem | null>(null)
  const [showAll, setShowAll] = useState(false)

  const visibleComments = showAll
    ? comments
    : comments.slice(0, INITIAL_VISIBLE_COUNT)
  const hasMoreComments =
    comments.length > INITIAL_VISIBLE_COUNT && !showAll

  function handleCreateComment(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const trimmed = commentText.trim()

    if (!trimmed) {
      toast.error("Komentar tidak boleh kosong.")
      return
    }

    if (trimmed.length > 1000) {
      toast.error("Komentar maksimal 1.000 karakter.")
      return
    }

    startCreateTransition(async () => {
      const result = await createArticleCommentAction({
        articleId,
        content: trimmed,
      })

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      setCommentText("")
      router.refresh()
    })
  }

  function handleConfirmDelete() {
    if (!commentToDelete) return
    const targetId = commentToDelete.id
    setDeletingCommentId(targetId)

    startDeleteTransition(async () => {
      try {
        const result = await deleteArticleCommentAction({
          id: targetId,
        })

        if (!result.success) {
          toast.error(result.message)
          return
        }

        toast.success(result.message)
        setCommentToDelete(null)
        router.refresh()
      } finally {
        setDeletingCommentId(null)
      }
    })
  }

  const isFormDisabled = isCreatePending || isDeletePending

  return (
    <section id="komentar" className="mt-14 border-t border-border pt-10">
      {/* ── Heading ── */}
      <div className="mb-8 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageCircle className="size-5 text-palembang-red" />
          <h3 className="font-display text-xl font-bold tracking-[-0.03em]">
            Komentar ({comments.length})
          </h3>
        </div>
      </div>

      {/* ── Comment Input Area ── */}
      {isAuthenticated && user ? (
        <form onSubmit={handleCreateComment} className="mb-8">
          <div className="flex gap-3">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={user.avatarUrl || DEFAULT_AVATAR}
              alt={user.name}
              className="size-10 shrink-0 rounded-full border border-border bg-muted object-cover"
            />
            <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-2.5 transition-all focus-within:border-palembang-red focus-within:ring-2 focus-within:ring-palembang-red/20">
              <input
                value={commentText}
                onChange={(event) => setCommentText(event.target.value)}
                placeholder={`Tulis komentar sebagai ${user.name}...`}
                disabled={isFormDisabled}
                maxLength={1000}
                className="min-w-0 flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={isFormDisabled || !commentText.trim()}
                aria-label="Kirim komentar"
                className="rounded-full bg-palembang-red p-2 text-white transition-all hover:scale-105 hover:bg-palembang-red/90 active:scale-95 disabled:opacity-50"
              >
                {isCreatePending ? (
                  <Loader2 className="size-3.5 animate-spin" />
                ) : (
                  <Send className="size-3.5" />
                )}
              </button>
            </div>
          </div>
        </form>
      ) : (
        <div className="mb-8 flex flex-col items-center justify-between gap-4 rounded-2xl border border-border bg-muted/40 p-5 sm:flex-row">
          <div className="flex items-center gap-3">
            <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-palembang-red/10 text-palembang-red">
              <MessageCircle className="size-5" />
            </div>
            <div>
              <p className="text-sm font-bold text-foreground">
                Ingin ikut berkomentar?
              </p>
              <p className="text-xs text-muted-foreground">
                Silakan masuk ke akun Anda terlebih dahulu.
              </p>
            </div>
          </div>
          <Button
            asChild
            className="w-full bg-palembang-red px-5 text-xs font-semibold text-white hover:bg-palembang-red/90 sm:w-auto"
          >
            <Link
              href={`/login?redirect=${encodeURIComponent(`/artikel/${articleSlug}#komentar`)}`}
            >
              <LogIn className="size-3.5" />
              Masuk untuk Komentar
            </Link>
          </Button>
        </div>
      )}

      {/* ── Comment List & Empty State ── */}
      {comments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-border/70 py-12 text-center">
          <MessageSquareDashed className="mx-auto size-10 text-muted-foreground/60" />
          <p className="mt-3 text-sm font-medium text-foreground">
            Belum ada komentar
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            Jadilah yang pertama membagikan tanggapan untuk cerita ini!
          </p>
        </div>
      ) : (
        <div className="relative">
          <div className="space-y-6">
            {visibleComments.map((comment) => {
              const isOwner = user?.id === comment.userId
              const isThisDeleting = deletingCommentId === comment.id

              return (
                <div
                  key={comment.id}
                  className={`group flex items-start gap-3.5 rounded-xl border border-border/40 bg-muted/20 p-3.5 transition-colors hover:bg-muted/30 ${
                    isThisDeleting ? "pointer-events-none opacity-50" : ""
                  }`}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={comment.userAvatarUrl}
                    alt={comment.userName}
                    className="size-10 shrink-0 rounded-full border border-border object-cover"
                  />
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="text-sm font-semibold text-foreground">
                          {comment.userName}
                        </span>
                        {comment.isArticleAuthor ? (
                          <span className="rounded-full bg-palembang-red/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-palembang-red">
                            Penulis
                          </span>
                        ) : null}
                        <span className="text-[11px] text-muted-foreground">
                          · {comment.createdAtLabel}
                        </span>
                      </div>

                      {isOwner ? (
                        <button
                          type="button"
                          onClick={() => setCommentToDelete(comment)}
                          disabled={isDeletePending}
                          className={`transition-opacity hover:text-red-600 ${
                            isThisDeleting
                              ? "opacity-100"
                              : "opacity-0 group-hover:opacity-100"
                          }`}
                          title="Hapus komentar"
                          aria-label="Hapus komentar"
                        >
                          {isThisDeleting ? (
                            <Loader2 className="size-3.5 animate-spin text-red-600" />
                          ) : (
                            <Trash2 className="size-3.5 text-muted-foreground hover:text-red-600" />
                          )}
                        </button>
                      ) : null}
                    </div>

                    <p className="text-sm leading-relaxed text-foreground/90 whitespace-pre-wrap">
                      {comment.content}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Show More Gradient Button ── */}
          {hasMoreComments ? (
            <div className="absolute inset-x-0 -bottom-4 flex h-36 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-2 backdrop-blur-[2px]">
              <button
                type="button"
                onClick={() => setShowAll(true)}
                className="group flex items-center gap-2 rounded-full border border-border bg-background/95 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-palembang-red hover:text-palembang-red"
              >
                Lihat Komentar Lainnya ({comments.length - INITIAL_VISIBLE_COUNT})
                <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>
          ) : null}
        </div>
      )}

      {/* ── Delete Confirmation Dialog ── */}
      <ConfirmActionDialog
        open={commentToDelete !== null}
        onOpenChange={(open) => {
          if (!open) setCommentToDelete(null)
        }}
        title="Konfirmasi Hapus Komentar"
        description="Apakah Anda yakin ingin menghapus komentar ini? Tindakan ini tidak dapat dibatalkan."
        confirmText="Ya, Hapus Komentar"
        variant="destructive"
        onConfirm={handleConfirmDelete}
      />
    </section>
  )
}
