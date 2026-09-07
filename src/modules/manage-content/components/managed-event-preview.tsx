"use client"

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock3,
  Eye,
  Heart,
  Loader2,
  MapPin,
  MessageCircle,
  RotateCcw,
  Sparkles,
  Ticket,
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
import { EventOrganizerCard } from "@/modules/event/components/event-organizer-card"
import { EventShareButton } from "@/modules/event/components/event-share-button"
import type { OwnedEventEditorData } from "@/modules/event/types/owned-event"

import { approveContentAction } from "../actions/approve-content"
import { rejectContentAction } from "../actions/reject-content"
import { restoreContentAction } from "../actions/restore-content"
import { takedownContentAction } from "../actions/takedown-content"

export function ManagedEventPreview({
  event,
}: {
  event: OwnedEventEditorData
}) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const whatsappQuestionUrl = `${event.whatsappUrl}?text=${encodeURIComponent(
    `Halo, saya ingin bertanya dan mendapatkan informasi lebih lanjut tentang acara:\n${event.title}\nTanggal: ${event.dateLabel}\nLokasi: ${event.location}`,
  )}`

  const [confirmModal, setConfirmModal] = useState<{
    open: boolean
    action: "approve" | "reject" | "takedown" | "restore"
  }>({
    open: false,
    action: "takedown",
  })

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
      const payload = { type: "EVENT" as const, id: event.id, note }

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
              <Link href="/dashboard/content/event">
                <ArrowLeft className="size-3.5" />
                <span>Kembali</span>
              </Link>
            </Button>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700 dark:border-blue-900/50 dark:bg-blue-950/50 dark:text-blue-300">
              <Eye className="size-3 shrink-0" />
              <span className="truncate max-w-[160px] sm:max-w-none">
                Moderasi · {event.statusLabel}
              </span>
            </span>
          </div>

          {/* Action Buttons for Admin */}
          <div className="flex items-center gap-2">
            {event.status === "PENDING_REVIEW" && (
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

            {event.status === "PUBLISHED" && (
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

            {event.status === "REJECTED" && (
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

            {event.status === "TAKEN_DOWN" && (
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

      {/* ── Main Event Layout (Public Website Style) ── */}
      <div className="overflow-hidden rounded-xl border bg-background shadow-sm sm:rounded-2xl">
        <header className="relative overflow-hidden bg-palembang-charcoal px-4 py-8 text-white sm:px-8 sm:py-12 lg:px-16 lg:py-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-30 sm:w-2/3 lg:w-1/2 lg:opacity-45">
            <Image
              src={event.bannerUrl}
              alt={event.title}
              fill
              priority
              sizes="(min-width: 1024px) 50vw, 100vw"
              className="object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
          </div>
          <div className="relative z-10 mx-auto max-w-[1240px]">
            <span className="inline-block rounded-full border border-palembang-red/40 bg-palembang-red/15 px-3 py-0.5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-red sm:px-3.5 sm:py-1">
              {event.category}
            </span>
            <h1 className="mt-3 max-w-4xl font-display text-2xl font-black leading-tight tracking-[-0.03em] sm:mt-4 sm:text-4xl lg:text-6xl break-words">
              {event.title}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/75 sm:mt-6 sm:text-base sm:leading-7">
              {event.description}
            </p>
            <div className="mt-6 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-white/75 sm:mt-8 sm:gap-5">
              <span className="flex items-center gap-1.5">
                <CalendarDays className="size-3.5 text-palembang-red" />
                {event.dateLabel}
              </span>
              <span className="flex items-center gap-1.5">
                <Heart className="size-3.5 text-palembang-red" />
                {event.likesCount.toLocaleString("id-ID")} likes
              </span>
              <span className="flex items-center gap-1.5">
                <Eye className="size-3.5 text-sky-400" />
                {event.views.toLocaleString("id-ID")} views
              </span>
            </div>
          </div>
        </header>

        <main className="px-4 py-6 sm:px-8 sm:py-10 lg:px-16 lg:py-14">
          <div className="mx-auto grid max-w-[1240px] gap-8 lg:grid-cols-[1fr_380px] lg:gap-12">
            <div className="min-w-0">
              <div className="relative aspect-[16/9] overflow-hidden rounded-xl border shadow-sm sm:rounded-[1.5rem]">
                <Image
                  src={event.bannerUrl}
                  alt={event.title}
                  fill
                  sizes="(min-width: 1024px) 760px, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-8 sm:mt-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-red">
                  Tentang Agenda
                </span>
                <h2 className="mt-1 font-display text-xl font-bold sm:mt-2 sm:text-2xl">
                  Detail Pelaksanaan
                </h2>
                <div
                  className="article-body mt-4 max-w-none text-base leading-8 text-foreground/80 sm:mt-6"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </div>

              {event.tags.length > 0 && (
                <div className="mt-8 flex flex-wrap gap-2 border-t pt-5 sm:mt-10 sm:pt-6">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-2.5 py-1 text-xs font-medium text-muted-foreground sm:px-3 sm:py-1.5"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-5 sm:space-y-6">
              <EventOrganizerCard organizer={event.organizer} />
              <div className="rounded-xl border bg-card p-4 shadow-sm sm:rounded-[1.5rem] sm:p-6 sm:p-8">
                <h3 className="font-display text-base font-bold sm:text-lg">Detail Acara</h3>
                <div className="mt-4 space-y-3.5 text-sm text-muted-foreground sm:mt-6 sm:space-y-4">
                  <div className="flex items-start gap-3">
                    <CalendarDays className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">Tanggal</p>
                      <p>{event.dateLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Clock3 className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">Waktu</p>
                      <p>{event.timeLabel}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <MapPin className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">Lokasi</p>
                      <p>{event.location}</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <Sparkles className="mt-0.5 size-4 shrink-0 text-foreground" />
                    <div>
                      <p className="font-semibold text-foreground">
                        Penyelenggara
                      </p>
                      <p>{event.organizer}</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 space-y-3 border-t pt-5 sm:mt-8 sm:pt-6">
                  {event.registrationUrl ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 w-full items-center justify-center gap-2 rounded-md bg-palembang-red text-xs font-bold text-white shadow-sm transition-colors hover:bg-palembang-red/90 sm:h-11 sm:text-sm"
                    >
                      <Ticket className="size-4" />
                      Daftar Sekarang
                    </a>
                  ) : (
                    <div className="rounded-lg bg-muted px-4 py-2.5 text-center text-xs leading-5 text-muted-foreground sm:py-3">
                      Informasi pendaftaran belum tersedia.
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex h-10 items-center justify-center gap-1.5 rounded-md border border-border px-2 text-xs font-semibold text-muted-foreground sm:h-11">
                      <Heart className="size-3.5 sm:size-4" />
                      <span>Suka</span>
                    </div>
                    <a
                      href={whatsappQuestionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-10 items-center justify-center gap-1.5 rounded-md border border-emerald-600/30 bg-emerald-600/10 px-2 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white sm:h-11"
                    >
                      <MessageCircle className="size-3.5 sm:size-4" />
                      <span>Tanya</span>
                    </a>
                    <EventShareButton
                      title={event.title}
                      url={`/agenda/${event.id}`}
                      label="Bagikan"
                      className="h-10 gap-1.5 px-2 text-xs font-semibold sm:h-11"
                    />
                  </div>
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
        contentLabel="Event"
        contentTitle={event.title}
        isPending={isPending}
        onConfirm={handleConfirmAction}
      />
    </div>
  )
}
