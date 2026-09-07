"use client"

import {
  CheckCircle,
  Eye,
  Heart,
  Loader2,
  MessageCircle,
  RotateCcw,
  Search,
  Trash2,
  X,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"

import { ModerationConfirmDialog } from "./moderation-confirm-dialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DEFAULT_BANNER } from "@/lib/constants/placeholder"

import { approveContentAction } from "../actions/approve-content"
import { rejectContentAction } from "../actions/reject-content"
import { restoreContentAction } from "../actions/restore-content"
import { takedownContentAction } from "../actions/takedown-content"
import type {
  ManagedContentListItem,
  ManagedContentListResult,
} from "../types/managed-content"

export function ManageContentList({
  data,
  contentType,
}: {
  data: ManagedContentListResult
  contentType: "ARTICLE" | "EVENT"
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(data.query)
  const [isPending, startTransition] = useTransition()
  const isArticlePage = contentType === "ARTICLE"
  const contentLabel = isArticlePage ? "Article" : "Event"
  const lastSearchedQueryRef = useRef(data.query)
  const isInputFocusedRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    content: ManagedContentListItem | null
    action: "approve" | "reject" | "takedown" | "restore"
  }>({
    open: false,
    content: null,
    action: "takedown",
  })

  const updateQuery = useCallback(
    (nextPage: number, nextQuery?: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      const params = new URLSearchParams(searchParams.toString())

      if (nextPage > 1) {
        params.set("page", String(nextPage))
      } else {
        params.delete("page")
      }

      const trimmedQuery =
        nextQuery !== undefined ? nextQuery.trim() : searchTerm.trim()
      if (trimmedQuery) {
        params.set("q", trimmedQuery)
      } else {
        params.delete("q")
      }

      lastSearchedQueryRef.current = trimmedQuery
      const queryString = params.toString()
      startTransition(() => {
        router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
          scroll: false,
        })
      })
    },
    [pathname, router, searchParams, searchTerm],
  )

  // Sync state with server query only if not focused and coming from external navigation
  useEffect(() => {
    if (data.query === lastSearchedQueryRef.current) {
      return
    }
    if (isInputFocusedRef.current) {
      return
    }
    lastSearchedQueryRef.current = data.query
    setSearchTerm(data.query)
  }, [data.query])

  // Debounce search when user types (wait 600ms after user stops typing)
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (searchTerm.trim() === (data.query ?? "").trim()) {
      return
    }

    timerRef.current = setTimeout(() => {
      updateQuery(1, searchTerm)
    }, 600)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [searchTerm, updateQuery, data.query])

  function openConfirm(
    content: ManagedContentListItem,
    action: "approve" | "reject" | "takedown" | "restore",
  ) {
    setConfirmModal({
      open: true,
      content,
      action,
    })
  }

  function handleConfirmAction(note: string) {
    const { content, action } = confirmModal
    if (!content) return

    startTransition(async () => {
      let result = { success: false, message: "" }
      const payload = { type: content.type, id: content.id, note }

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
      } else {
        toast.error(result.message)
      }

      setConfirmModal({ open: false, content: null, action: "takedown" })
    })
  }

  return (
    <div className="space-y-8 pb-10">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="font-display text-3xl font-bold tracking-tight">
            Manage Content — {contentLabel}
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Moderasi {contentLabel.toLowerCase()} yang diajukan oleh pengguna.
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        {/* Search Header */}
        <div className="border-b p-4">
          <div className="relative max-w-md">
            {isPending ? (
              <Loader2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-palembang-red animate-spin" />
            ) : (
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              placeholder={`Cari ${contentLabel.toLowerCase()} atau ${
                isArticlePage ? "author" : "owner"
              }...`}
              className="pl-9 pr-9 min-h-[42px]"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onFocus={() => {
                isInputFocusedRef.current = true
              }}
              onBlur={() => {
                isInputFocusedRef.current = false
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  updateQuery(1, searchTerm)
                }
              }}
            />
            {searchTerm ? (
              <button
                type="button"
                onClick={() => {
                  if (timerRef.current) {
                    clearTimeout(timerRef.current)
                    timerRef.current = null
                  }
                  setSearchTerm("")
                  lastSearchedQueryRef.current = ""
                  updateQuery(1, "")
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Hapus pencarian"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto relative">
          {isPending && (
            <div className="absolute inset-0 z-10 bg-background/40 backdrop-blur-[1px] flex items-center justify-center pointer-events-none animate-in fade-in duration-100">
              <div className="flex items-center gap-2 bg-background/90 border shadow-md px-3.5 py-1.5 rounded-full text-xs font-medium text-foreground">
                <Loader2 className="size-3.5 animate-spin text-palembang-red" />
                <span>Memuat data...</span>
              </div>
            </div>
          )}
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Banner & Judul</th>
                <th className="px-6 py-4 font-semibold">
                  {isArticlePage ? "Author" : "Owner"}
                </th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Statistik</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.length > 0 ? (
                data.items.map((content) => {
                  return (
                    <tr
                      key={`${content.type}-${content.id}`}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {/* Banner & Judul */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                            <Image
                              src={content.bannerUrl || DEFAULT_BANNER}
                              alt={content.title}
                              fill
                              sizes="64px"
                              unoptimized={!content.bannerUrl}
                              className="object-cover"
                            />
                          </div>
                          <span
                            className="line-clamp-2 max-w-[200px] font-semibold text-foreground"
                            title={content.title}
                          >
                            {content.title}
                          </span>
                        </div>
                      </td>

                      {/* Author */}
                      <td className="whitespace-nowrap px-6 py-4 text-muted-foreground">
                        {content.owner.name}
                      </td>

                      {/* Date & Time */}
                      <td className="whitespace-nowrap px-6 py-4 text-xs text-muted-foreground">
                        {content.dateLabel}
                      </td>

                      {/* Statistik */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                          <span
                            className="flex items-center gap-1 font-medium"
                            title="Views"
                          >
                            <Eye className="size-3.5 text-blue-500" />{" "}
                            {content.stats.views}
                          </span>
                          <span
                            className="flex items-center gap-1 font-medium"
                            title="Likes"
                          >
                            <Heart className="size-3.5 text-red-500" />{" "}
                            {content.stats.likes}
                          </span>
                          {isArticlePage ? (
                            <span
                              className="flex items-center gap-1 font-medium"
                              title="Comments"
                            >
                              <MessageCircle className="size-3.5 text-emerald-500" />{" "}
                              {content.stats.comments}
                            </span>
                          ) : null}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            content.status === "PUBLISHED"
                              ? "bg-emerald-50 text-emerald-600"
                              : content.status === "PENDING_REVIEW"
                                ? "bg-amber-50 text-amber-600"
                                : content.status === "REJECTED"
                                  ? "bg-zinc-100 text-zinc-600"
                                  : "bg-red-50 text-red-600"
                          }`}
                        >
                          {content.statusLabel}
                        </span>
                      </td>

                      {/* Action */}
                      <td className="whitespace-nowrap px-6 py-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              router.push(
                                `/dashboard/content/${
                                  isArticlePage ? "article" : "event"
                                }/${content.id}`,
                              )
                            }}
                            className="gap-1.5 text-xs text-foreground hover:bg-muted min-h-[36px] px-2.5 active:scale-95"
                          >
                            <Eye className="size-3.5" /> View
                          </Button>

                          {content.status === "PENDING_REVIEW" && (
                            <>
                              <Button
                                size="sm"
                                disabled={isPending}
                                onClick={() => openConfirm(content, "approve")}
                                className="gap-1 bg-emerald-600 text-xs text-white hover:bg-emerald-700 min-h-[36px] px-2.5 active:scale-95"
                              >
                                {isPending && confirmModal.content?.id === content.id && confirmModal.action === "approve" ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <CheckCircle className="size-3.5" />
                                )}
                                {isPending && confirmModal.content?.id === content.id && confirmModal.action === "approve"
                                  ? "Memproses..."
                                  : "Setujui"}
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isPending}
                                onClick={() => openConfirm(content, "reject")}
                                className="gap-1 border-zinc-300 text-xs text-zinc-700 hover:bg-zinc-100 min-h-[36px] px-2.5 active:scale-95"
                              >
                                {isPending && confirmModal.content?.id === content.id && confirmModal.action === "reject" ? (
                                  <Loader2 className="size-3.5 animate-spin" />
                                ) : (
                                  <XCircle className="size-3.5" />
                                )}
                                {isPending && confirmModal.content?.id === content.id && confirmModal.action === "reject"
                                  ? "Memproses..."
                                  : "Tolak"}
                              </Button>
                            </>
                          )}

                          {content.status === "PUBLISHED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isPending}
                              onClick={() => openConfirm(content, "takedown")}
                              className="gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50 min-h-[36px] px-2.5 active:scale-95"
                            >
                              {isPending && confirmModal.content?.id === content.id && confirmModal.action === "takedown" ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <Trash2 className="size-3.5" />
                              )}
                              {isPending && confirmModal.content?.id === content.id && confirmModal.action === "takedown"
                                ? "Memproses..."
                                : "Takedown"}
                            </Button>
                          )}

                          {content.status === "REJECTED" && (
                            <Button
                              size="sm"
                              disabled={isPending}
                              onClick={() => openConfirm(content, "restore")}
                              className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700 min-h-[36px] px-2.5 active:scale-95"
                            >
                              {isPending && confirmModal.content?.id === content.id && confirmModal.action === "restore" ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <RotateCcw className="size-3.5" />
                              )}
                              {isPending && confirmModal.content?.id === content.id && confirmModal.action === "restore"
                                ? "Memproses..."
                                : "Pulihkan"}
                            </Button>
                          )}

                          {content.status === "TAKEN_DOWN" && (
                            <Button
                              size="sm"
                              disabled={isPending}
                              onClick={() => openConfirm(content, "restore")}
                              className="gap-1.5 bg-red-600 text-xs text-white hover:bg-red-700 min-h-[36px] px-2.5 active:scale-95"
                            >
                              {isPending && confirmModal.content?.id === content.id && confirmModal.action === "restore" ? (
                                <Loader2 className="size-3.5 animate-spin" />
                              ) : (
                                <RotateCcw className="size-3.5" />
                              )}
                              {isPending && confirmModal.content?.id === content.id && confirmModal.action === "restore"
                                ? "Memproses..."
                                : "Restore"}
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Tidak ada {contentLabel.toLowerCase()} ditemukan.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <PaginationControls
          currentPage={data.page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          itemsPerPage={data.pageSize}
          onPageChange={(page) => updateQuery(page)}
        />
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
        contentLabel={
          confirmModal.content?.type === "ARTICLE" ? "Artikel" : "Event"
        }
        contentTitle={confirmModal.content?.title ?? ""}
        isPending={isPending}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}
