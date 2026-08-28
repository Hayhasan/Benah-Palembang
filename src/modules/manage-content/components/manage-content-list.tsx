"use client"

import {
  CheckCircle,
  Eye,
  Heart,
  MessageCircle,
  RotateCcw,
  Search,
  Trash2,
  Users,
  XCircle,
} from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { approveContentAction } from "../actions/approve-content"
import { rejectContentAction } from "../actions/reject-content"
import { restoreContentAction } from "../actions/restore-content"
import { takedownContentAction } from "../actions/takedown-content"
import type {
  ManagedContentListItem,
  ManagedContentListResult,
} from "../types/managed-content"

const DEFAULT_BANNER =
  "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"

export function ManageContentList({
  data,
}: {
  data: ManagedContentListResult
}) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const [searchTerm, setSearchTerm] = useState(data.query)
  const [isPending, startTransition] = useTransition()

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    content: ManagedContentListItem | null
    action: "approve" | "reject" | "takedown" | "restore"
  }>({
    open: false,
    content: null,
    action: "takedown",
  })

  function updateQuery(nextPage: number, nextQuery?: string) {
    const params = new URLSearchParams(searchParams.toString())

    if (nextPage > 1) {
      params.set("page", String(nextPage))
    } else {
      params.delete("page")
    }

    const trimmedQuery = nextQuery !== undefined ? nextQuery.trim() : searchTerm.trim()
    if (trimmedQuery) {
      params.set("q", trimmedQuery)
    } else {
      params.delete("q")
    }

    const queryString = params.toString()
    router.replace(queryString ? `${pathname}?${queryString}` : pathname, {
      scroll: false,
    })
  }

  function handleSearchSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    updateQuery(1, searchTerm)
  }

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

  function handleConfirmAction() {
    const { content, action } = confirmModal
    if (!content) return

    startTransition(async () => {
      let result = { success: false, message: "" }

      if (action === "approve") {
        result = await approveContentAction({
          type: content.type,
          id: content.id,
        })
      } else if (action === "reject") {
        result = await rejectContentAction({
          type: content.type,
          id: content.id,
        })
      } else if (action === "takedown") {
        result = await takedownContentAction({
          type: content.type,
          id: content.id,
        })
      } else if (action === "restore") {
        result = await restoreContentAction({
          type: content.type,
          id: content.id,
        })
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
            Manage Content
          </h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Moderasi artikel dan event yang diajukan oleh pengguna.
          </p>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        {/* Search Header */}
        <div className="border-b p-4">
          <form
            onSubmit={handleSearchSubmit}
            className="flex items-center gap-3"
          >
            <div className="relative w-72">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Cari konten atau author..."
                className="pl-9"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <Button
              type="submit"
              variant="outline"
              size="sm"
              className="text-xs"
            >
              Cari
            </Button>
            {data.query ? (
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="text-xs text-muted-foreground"
                onClick={() => {
                  setSearchTerm("")
                  updateQuery(1, "")
                }}
              >
                Reset
              </Button>
            ) : null}
          </form>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">Tipe</th>
                <th className="px-6 py-4 font-semibold">Banner & Judul</th>
                <th className="px-6 py-4 font-semibold">Author / Owner</th>
                <th className="px-6 py-4 font-semibold">Date & Time</th>
                <th className="px-6 py-4 font-semibold">Statistik</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.length > 0 ? (
                data.items.map((content) => {
                  const isArticle = content.type === "ARTICLE"

                  return (
                    <tr
                      key={`${content.type}-${content.id}`}
                      className="transition-colors hover:bg-muted/30"
                    >
                      {/* Tipe */}
                      <td className="whitespace-nowrap px-6 py-4">
                        <span
                          className={`rounded-full px-2.5 py-1 text-xs font-semibold ${
                            isArticle
                              ? "bg-blue-50 text-blue-600"
                              : "bg-purple-50 text-purple-600"
                          }`}
                        >
                          {content.typeLabel}
                        </span>
                      </td>

                      {/* Banner & Judul */}
                      <td className="px-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border bg-muted">
                            <Image
                              src={content.bannerUrl || DEFAULT_BANNER}
                              alt={content.title}
                              fill
                              sizes="64px"
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

                      {/* Statistik (Article: Comments; Event: Participants) */}
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
                          {isArticle ? (
                            <span
                              className="flex items-center gap-1 font-medium"
                              title="Comments"
                            >
                              <MessageCircle className="size-3.5 text-emerald-500" />{" "}
                              {content.stats.comments}
                            </span>
                          ) : (
                            <span
                              className="flex items-center gap-1 font-medium"
                              title="Participants"
                            >
                              <Users className="size-3.5 text-purple-500" />{" "}
                              {content.stats.participants}
                            </span>
                          )}
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
                              if (content.type === "ARTICLE") {
                                router.push(
                                  `/dashboard/create-article/preview/${content.id}`,
                                )
                              } else {
                                router.push(
                                  `/dashboard/create-event/preview/${content.id}`,
                                )
                              }
                            }}
                            className="gap-1.5 text-xs text-foreground hover:bg-muted"
                          >
                            <Eye className="size-3.5" /> View
                          </Button>

                          {content.status === "PENDING_REVIEW" && (
                            <>
                              <Button
                                size="sm"
                                disabled={isPending}
                                onClick={() => openConfirm(content, "approve")}
                                className="gap-1 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                              >
                                <CheckCircle className="size-3.5" /> Setujui
                              </Button>
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isPending}
                                onClick={() => openConfirm(content, "reject")}
                                className="gap-1 border-zinc-300 text-xs text-zinc-700 hover:bg-zinc-100"
                              >
                                <XCircle className="size-3.5" /> Tolak
                              </Button>
                            </>
                          )}

                          {content.status === "PUBLISHED" && (
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isPending}
                              onClick={() => openConfirm(content, "takedown")}
                              className="gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50"
                            >
                              <Trash2 className="size-3.5" /> Takedown
                            </Button>
                          )}

                          {content.status === "REJECTED" && (
                            <Button
                              size="sm"
                              disabled={isPending}
                              onClick={() => openConfirm(content, "restore")}
                              className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                            >
                              <RotateCcw className="size-3.5" /> Pulihkan
                            </Button>
                          )}

                          {content.status === "TAKEN_DOWN" && (
                            <Button
                              size="sm"
                              disabled={isPending}
                              onClick={() => openConfirm(content, "restore")}
                              className="gap-1.5 bg-red-600 text-xs text-white hover:bg-red-700"
                            >
                              <RotateCcw className="size-3.5" /> Restore
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
                    colSpan={7}
                    className="px-6 py-8 text-center text-muted-foreground"
                  >
                    Tidak ada konten ditemukan.
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
      <ConfirmActionDialog
        open={confirmModal.open}
        onOpenChange={(open) => {
          if (!open) {
            setConfirmModal((prev) => ({ ...prev, open: false }))
          }
        }}
        title={
          confirmModal.action === "approve"
            ? "Konfirmasi Persetujuan Konten"
            : confirmModal.action === "reject"
              ? "Konfirmasi Penolakan Konten"
              : confirmModal.action === "takedown"
                ? "Konfirmasi Takedown Konten"
                : "Konfirmasi Pemulihan Konten"
        }
        description={
          confirmModal.action === "approve"
            ? `Apakah Anda yakin ingin menyetujui dan mempublikasikan ${confirmModal.content?.typeLabel.toLowerCase()} "${confirmModal.content?.title}"?`
            : confirmModal.action === "reject"
              ? `Apakah Anda yakin ingin menolak pengajuan ${confirmModal.content?.typeLabel.toLowerCase()} "${confirmModal.content?.title}"?`
              : confirmModal.action === "takedown"
                ? `Apakah Anda yakin ingin men-takedown ${confirmModal.content?.typeLabel.toLowerCase()} "${confirmModal.content?.title}" dari penayangan publik?`
                : `Apakah Anda yakin ingin memulihkan ${confirmModal.content?.typeLabel.toLowerCase()} "${confirmModal.content?.title}" ke status Posted?`
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
