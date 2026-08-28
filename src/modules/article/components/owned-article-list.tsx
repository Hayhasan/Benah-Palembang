"use client"

import {
  Archive,
  Edit2,
  Eye,
  Heart,
  MessageCircle,
  Plus,
  Search,
  Send,
} from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { archiveArticleAction } from "../actions/archive-article"
import { postArticleAction } from "../actions/post-article"
import type {
  OwnedArticleList as OwnedArticleListData,
  OwnedArticleListItem,
} from "../types/article"

type ConfirmationState =
  | { action: "archive" | "post"; article: OwnedArticleListItem }
  | null

function statusClassName(status: OwnedArticleListItem["status"]) {
  if (status === "PUBLISHED") return "bg-emerald-50 text-emerald-700"
  if (status === "TAKEN_DOWN") return "bg-red-50 text-red-700"
  if (status === "REJECTED") return "bg-rose-50 text-rose-700"
  if (status === "PENDING_REVIEW") return "bg-blue-50 text-blue-700"
  return "bg-amber-50 text-amber-700"
}

export function OwnedArticleList({ data }: { data: OwnedArticleListData }) {
  const router = useRouter()
  const pathname = usePathname()
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null)
  const [isPending, startTransition] = useTransition()

  function buildHref(page: number, query = data.query) {
    const params = new URLSearchParams()
    const normalizedQuery = query.trim()

    if (normalizedQuery) params.set("q", normalizedQuery)
    if (page > 1) params.set("page", String(page))

    const search = params.toString()
    return search ? `${pathname}?${search}` : pathname
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    router.push(buildHref(1, String(formData.get("q") ?? "")))
  }

  function handleConfirm() {
    if (!confirmation) return

    startTransition(async () => {
      const result =
        confirmation.action === "post"
          ? await postArticleAction({ id: confirmation.article.id })
          : await archiveArticleAction({ id: confirmation.article.id })

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
    ? confirmation.action === "post"
      ? {
          title: "Konfirmasi Post Artikel",
          description: `Artikel "${confirmation.article.title}" akan diajukan untuk review sebelum tampil pada halaman publik.`,
          confirmText: "Ya, Post Artikel",
          variant: "default" as const,
        }
      : {
          title: "Konfirmasi Archive Artikel",
          description: `Artikel "${confirmation.article.title}" akan diarsipkan dan tidak lagi tampil pada halaman publik maupun daftar Artikel aktif.`,
          confirmText: "Ya, Archive Artikel",
          variant: "destructive" as const,
        }
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
          className="w-fit bg-palembang-red text-white hover:bg-palembang-red/90"
        >
          <Plus className="mr-2 size-4" />
          Create Article
        </Button>
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="border-b p-4">
          <form onSubmit={handleSearch} className="flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={data.query}
                placeholder="Cari artikel..."
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline">
              Cari
            </Button>
          </form>
        </div>

        <div className="overflow-x-auto">
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
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium">
                          <Eye className="size-3.5 text-blue-500" />
                          {article.views.toLocaleString("id-ID")}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Heart className="size-3.5 text-palembang-red" />
                          {article.likes.toLocaleString("id-ID")}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <MessageCircle className="size-3.5 text-emerald-500" />
                          {article.comments.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName(article.status)}`}
                      >
                        {article.statusLabel}
                      </span>
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
                          className="gap-1.5 text-xs"
                        >
                          <Eye className="size-3.5" />
                          View
                        </Button>

                        {article.status === "DRAFT" ? (
                          <Button
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              setConfirmation({ action: "post", article })
                            }
                            className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                          >
                            <Send className="size-3.5" />
                            Post
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
                            className="gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50"
                          >
                            <Archive className="size-3.5" />
                            Archive
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
                          className="gap-1.5 text-xs"
                        >
                          <Edit2 className="size-3.5" />
                          Edit
                        </Button>
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
          onConfirm={handleConfirm}
        />
      ) : null}
    </div>
  )
}
