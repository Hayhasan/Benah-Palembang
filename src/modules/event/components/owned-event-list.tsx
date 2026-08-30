"use client"

import {
  Archive,
  Edit2,
  Eye,
  Heart,
  Plus,
  Search,
  Send,
  Users,
} from "lucide-react"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { archiveEventAction } from "../actions/archive-event"
import { postEventAction } from "../actions/post-event"
import type {
  OwnedEventList,
  OwnedEventListItem,
} from "../types/owned-event"

type ConfirmationState =
  | { action: "archive" | "post"; event: OwnedEventListItem }
  | null

function statusClassName(status: OwnedEventListItem["status"]) {
  if (status === "PUBLISHED") return "bg-emerald-50 text-emerald-700"
  if (status === "TAKEN_DOWN") return "bg-red-50 text-red-700"
  if (status === "REJECTED") return "bg-rose-50 text-rose-700"
  if (status === "PENDING_REVIEW") return "bg-blue-50 text-blue-700"
  return "bg-amber-50 text-amber-700"
}

export function OwnedEventList({ data }: { data: OwnedEventList }) {
  const router = useRouter()
  const rawPathname = usePathname()
  const pathname = rawPathname ?? ""
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null)
  const [isPending, startTransition] = useTransition()

  function buildHref(page: number, query = data.query): string {
    const params = new URLSearchParams()
    const normalizedQuery = query.trim()

    if (normalizedQuery) params.set("q", normalizedQuery)
    if (page > 1) params.set("page", String(page))

    const search = params.toString()
    return search ? `${pathname}?${search}` : pathname || "/"
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
          ? await postEventAction({ id: confirmation.event.id })
          : await archiveEventAction({ id: confirmation.event.id })

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
          title: "Konfirmasi Post Event",
          description: `Event "${confirmation.event.title}" akan diajukan untuk review sebelum tampil pada halaman publik.`,
          confirmText: "Ya, Post Event",
          variant: "default" as const,
        }
      : {
          title: "Konfirmasi Archive Event",
          description: `Event "${confirmation.event.title}" akan diarsipkan dan tidak lagi tampil pada halaman publik maupun daftar Event aktif.`,
          confirmText: "Ya, Archive Event",
          variant: "destructive" as const,
        }
    : null

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Kelola Event</h2>
          <p className="text-muted-foreground">
            Buat, edit, dan pantau agenda milik account Anda.
          </p>
        </div>
        <Button
          onClick={() => router.push("/dashboard/create-event/new")}
          className="w-fit bg-palembang-red text-white hover:bg-palembang-red/90"
        >
          <Plus className="mr-2 size-4" />
          Create Event
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
                placeholder="Cari event..."
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
                <th className="px-6 py-4 font-semibold">Banner & Judul Event</th>
                <th className="px-6 py-4 font-semibold">Deskripsi Singkat</th>
                <th className="px-6 py-4 font-semibold">Waktu Pelaksanaan</th>
                <th className="px-6 py-4 font-semibold">Statistik</th>
                <th className="px-6 py-4 font-semibold">Status</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.length > 0 ? (
                data.items.map((event) => (
                  <tr
                    key={event.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="relative h-12 w-16 shrink-0 overflow-hidden rounded-md border">
                          <Image
                            src={event.bannerUrl}
                            alt={event.title}
                            fill
                            sizes="64px"
                            className="object-cover"
                          />
                        </div>
                        <span
                          className="line-clamp-2 max-w-[220px] font-semibold text-foreground"
                          title={event.title}
                        >
                          {event.title}
                        </span>
                      </div>
                    </td>
                    <td
                      className="max-w-[240px] truncate px-6 py-4 text-muted-foreground"
                      title={event.description}
                    >
                      {event.description}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-muted-foreground">
                      {event.startsAtLabel}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1 font-medium">
                          <Eye className="size-3.5 text-blue-500" />
                          {event.views.toLocaleString("id-ID")}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Heart className="size-3.5 text-palembang-red" />
                          {event.likes.toLocaleString("id-ID")}
                        </span>
                        <span className="flex items-center gap-1 font-medium">
                          <Users className="size-3.5 text-orange-500" />
                          {event.participants.toLocaleString("id-ID")}
                        </span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusClassName(event.status)}`}
                      >
                        {event.statusLabel}
                      </span>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() =>
                            router.push(
                              `/dashboard/create-event/preview/${event.id}`,
                            )
                          }
                          className="gap-1.5 text-xs"
                        >
                          <Eye className="size-3.5" />
                          View
                        </Button>

                        {event.status === "DRAFT" ? (
                          <Button
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              setConfirmation({ action: "post", event })
                            }
                            className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
                          >
                            <Send className="size-3.5" />
                            Post
                          </Button>
                        ) : null}

                        {event.status === "PUBLISHED" ? (
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={isPending}
                            onClick={() =>
                              setConfirmation({ action: "archive", event })
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
                              `/dashboard/create-event/edit?id=${event.id}`,
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
                    Belum ada Event yang sesuai.
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
