"use client"

import {
  Archive,
  Edit2,
  Eye,
  Loader2,
  Plus,
  RotateCcw,
  Search,
  Send,
  Trash2,
  X,
} from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useCallback, useEffect, useRef, useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { archiveArticleAction } from "../actions/archive-article"
import { postArticleAction } from "../actions/post-article"
import { republishArticleAction } from "../actions/republish-article"
import { softDeleteArticleAction } from "../actions/soft-delete-article"
import {
  isDeletableArticleStatus,
  isResubmittableArticleStatus,
} from "../constants/article-status"
import type {
  OwnedArticleList as OwnedArticleListData,
  OwnedArticleListItem,
} from "../types/article"

type OwnedArticleAction = "post" | "archive" | "republish" | "delete"

type ConfirmationState =
  | { action: OwnedArticleAction; article: OwnedArticleListItem }
  | null

function statusClassName(status: OwnedArticleListItem["status"]) {
  if (status === "PUBLISHED") return "bg-emerald-50 text-emerald-700"
  if (status === "TAKEN_DOWN") return "bg-red-50 text-red-700"
  if (status === "REJECTED") return "bg-rose-50 text-rose-700"
  if (status === "PENDING_REVIEW") return "bg-blue-50 text-blue-700"
  if (status === "ARCHIVED") return "bg-slate-100 text-slate-700"
  return "bg-amber-50 text-amber-700"
}

/**
 * Alasan moderasi ditampilkan kepada author supaya Artikel `REJECTED` dapat
 * diperbaiki lalu diajukan ulang, dan Artikel `TAKEN_DOWN` jelas sebabnya.
 */
function ModerationNote({
  status,
  note,
}: {
  status: OwnedArticleListItem["status"]
  note: string | null
}) {
  if (status !== "REJECTED" && status !== "TAKEN_DOWN") return null

  const label = status === "REJECTED" ? "Alasan ditolak" : "Alasan takedown"

  return (
    <p className="mt-1.5 max-w-[220px] whitespace-normal text-xs text-muted-foreground">
      <span className="font-semibold text-foreground">{label}:</span>{" "}
      {note || "tidak dicantumkan admin."}
    </p>
  )
}

export function OwnedArticleList({ data }: { data: OwnedArticleListData }) {
  const router = useRouter()
  const pathname = usePathname()
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null)
  const [isPending, startTransition] = useTransition()

  const [searchInput, setSearchInput] = useState(data.query)
  const lastSearchedQueryRef = useRef(data.query)
  const isInputFocusedRef = useRef(false)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const buildHref = useCallback(
    (page: number, query = data.query) => {
      const params = new URLSearchParams()
      const normalizedQuery = query.trim()

      if (normalizedQuery) params.set("q", normalizedQuery)
      if (page > 1) params.set("page", String(page))

      const search = params.toString()
      return search ? `${pathname}?${search}` : pathname
    },
    [data.query, pathname],
  )

  const executeSearch = useCallback(
    (newQuery: string) => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
      const normalizedInput = newQuery.trim()
      const normalizedCurrent = (data.query ?? "").trim()
      if (normalizedInput !== normalizedCurrent) {
        lastSearchedQueryRef.current = normalizedInput
        startTransition(() => {
          router.replace(buildHref(1, newQuery), { scroll: false })
        })
      }
    },
    [buildHref, data.query, router],
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
    setSearchInput(data.query)
  }, [data.query])

  // Debounce search when user types (wait 600ms after user stops typing)
  useEffect(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }

    if (searchInput.trim() === (data.query ?? "").trim()) {
      return
    }

    timerRef.current = setTimeout(() => {
      executeSearch(searchInput)
    }, 600)

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [searchInput, executeSearch, data.query])

  function runAction(action: OwnedArticleAction, id: number) {
    if (action === "post") return postArticleAction({ id })
    if (action === "archive") return archiveArticleAction({ id })
    if (action === "republish") return republishArticleAction({ id })
    return softDeleteArticleAction({ id })
  }

  function handleConfirm() {
    if (!confirmation) return

    startTransition(async () => {
      const result = await runAction(
        confirmation.action,
        confirmation.article.id,
      )

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      setConfirmation(null)
      router.refresh()
    })
  }

  const confirmationCopy = confirmation
    ? {
        post: {
          title: "Konfirmasi Post Artikel",
          description: `Artikel "${confirmation.article.title}" akan diajukan untuk review sebelum tampil pada halaman publik.`,
          confirmText: "Ya, Post Artikel",
          variant: "default" as const,
        },
        archive: {
          title: "Konfirmasi Archive Artikel",
          description: `Artikel "${confirmation.article.title}" akan diturunkan dari halaman publik dan tersimpan sebagai Arsip. Artikel tetap tampil pada daftar ini dan dapat dipublikasikan ulang kapan saja tanpa review.`,
          confirmText: "Ya, Archive Artikel",
          variant: "default" as const,
        },
        republish: {
          title: "Konfirmasi Publikasi Ulang",
          description: `Artikel "${confirmation.article.title}" akan kembali tampil pada halaman publik. Artikel ini sudah pernah disetujui sehingga tidak perlu review ulang.`,
          confirmText: "Ya, Publikasikan",
          variant: "default" as const,
        },
        delete: {
          title: "Konfirmasi Hapus Artikel",
          description: `Artikel "${confirmation.article.title}" akan dihapus dan tidak dapat dikembalikan dari dashboard.`,
          confirmText: "Ya, Hapus Artikel",
          variant: "destructive" as const,
        },
      }[confirmation.action]
    : null

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kelola Artikel</h2>
          <p className="text-muted-foreground">
            Tulis dan kelola artikel cerita warga account Anda.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/create-article/new")}
          className="w-full sm:w-fit min-h-[44px] bg-palembang-red text-white hover:bg-palembang-red/90 font-semibold active:scale-[0.98]"
        >
          <Plus className="mr-2 size-4" />
          Create Article
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="border-b p-4">
          <div className="relative max-w-md">
            {isPending ? (
              <Loader2 className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-palembang-red animate-spin" />
            ) : (
              <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
            )}
            <Input
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onFocus={() => {
                isInputFocusedRef.current = true
              }}
              onBlur={() => {
                isInputFocusedRef.current = false
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  e.preventDefault()
                  executeSearch(searchInput)
                }
              }}
              placeholder="Cari artikel..."
              className="pl-9 pr-9 min-h-[42px]"
            />
            {searchInput ? (
              <button
                type="button"
                onClick={() => {
                  if (timerRef.current) {
                    clearTimeout(timerRef.current)
                    timerRef.current = null
                  }
                  setSearchInput("")
                  lastSearchedQueryRef.current = ""
                  startTransition(() => {
                    router.replace(buildHref(1, ""), { scroll: false })
                  })
                }}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                aria-label="Hapus pencarian"
              >
                <X className="size-4" />
              </button>
            ) : null}
          </div>
        </div>

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
                <th className="px-6 py-4 font-semibold">Deskripsi Singkat</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Statistik</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.length > 0 ? (
                data.items.map((article) => (
                  <tr
                    key={article.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={article.coverImageUrl}
                            alt={article.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <div>
                          <span
                            className="line-clamp-2 max-w-[200px] font-semibold text-foreground"
                            title={article.title}
                          >
                            {article.title}
                          </span>
                          <span className="text-[11px] text-muted-foreground">
                            {article.category}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td
                      className="max-w-[220px] truncate px-6 py-4 text-muted-foreground"
                      title={article.excerpt}
                    >
                      {article.excerpt}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-muted-foreground">
                      {article.updatedAtLabel}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span className="flex items-center gap-1 text-xs font-medium text-muted-foreground">
                        <Eye className="size-3.5 text-blue-500" />
                        {article.views.toLocaleString("id-ID")}
                      </span>
                    </td>
                    <td className="px-6 py-4 align-top">
                      <span
                        className={`inline-block whitespace-nowrap rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName(article.status)}`}
                      >
                        {article.statusLabel}
                      </span>
                      <ModerationNote
                        status={article.status}
                        note={article.moderationNote}
                      />
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/create-article/preview/${article.id}`,
                            )
                          }
                          className="gap-1.5 text-xs min-h-[36px] px-2.5 active:scale-95"
                        >
                          <Eye className="size-3.5" />
                          View
                        </Button>

                        {isResubmittableArticleStatus(article.status) ? (
                          <Button
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              setConfirmation({ action: "post", article })
                            }
                            className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700 min-h-[36px] px-2.5 active:scale-95"
                          >
                            {isPending && confirmation?.article.id === article.id && confirmation?.action === "post" ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Send className="size-3.5" />
                            )}
                            {isPending && confirmation?.article.id === article.id && confirmation?.action === "post"
                              ? "Memproses..."
                              : "Post"}
                          </Button>
                        ) : null}

                        {article.status === "PUBLISHED" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              setConfirmation({ action: "archive", article })
                            }
                            className="gap-1.5 border-slate-200 text-xs text-slate-600 hover:bg-slate-50 min-h-[36px] px-2.5 active:scale-95"
                          >
                            {isPending && confirmation?.article.id === article.id && confirmation?.action === "archive" ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Archive className="size-3.5" />
                            )}
                            {isPending && confirmation?.article.id === article.id && confirmation?.action === "archive"
                              ? "Memproses..."
                              : "Archive"}
                          </Button>
                        ) : null}

                        {article.status === "ARCHIVED" ? (
                          <Button
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              setConfirmation({ action: "republish", article })
                            }
                            className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700 min-h-[36px] px-2.5 active:scale-95"
                          >
                            {isPending && confirmation?.article.id === article.id && confirmation?.action === "republish" ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <RotateCcw className="size-3.5" />
                            )}
                            {isPending && confirmation?.article.id === article.id && confirmation?.action === "republish"
                              ? "Memproses..."
                              : "Publikasikan"}
                          </Button>
                        ) : null}

                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/create-article/edit?id=${article.id}`,
                            )
                          }
                          className="gap-1.5 text-xs min-h-[36px] px-2.5 active:scale-95"
                        >
                          <Edit2 className="size-3.5" />
                          Edit
                        </Button>

                        {isDeletableArticleStatus(article.status) ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              setConfirmation({ action: "delete", article })
                            }
                            className="gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50 min-h-[36px] px-2.5 active:scale-95"
                          >
                            {isPending && confirmation?.article.id === article.id && confirmation?.action === "delete" ? (
                              <Loader2 className="size-3.5 animate-spin" />
                            ) : (
                              <Trash2 className="size-3.5" />
                            )}
                            {isPending && confirmation?.article.id === article.id && confirmation?.action === "delete"
                              ? "Memproses..."
                              : "Hapus"}
                          </Button>
                        ) : null}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={6}
                    className="px-6 py-12 text-center text-muted-foreground"
                  >
                    Belum ada artikel yang sesuai.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={data.page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          itemsPerPage={data.pageSize}
          onPageChange={(page) => router.push(buildHref(page))}
        />
      </div>

      {confirmationCopy ? (
        <ConfirmActionDialog
          open={confirmation !== null}
          onOpenChange={(open) => {
            if (!open) setConfirmation(null)
          }}
          title={confirmationCopy.title}
          description={confirmationCopy.description}
          confirmText={confirmationCopy.confirmText}
          variant={confirmationCopy.variant}
          isLoading={isPending}
          onConfirm={handleConfirm}
        />
      ) : null}
    </div>
  )
}
