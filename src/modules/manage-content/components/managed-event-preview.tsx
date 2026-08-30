"use client"

import {
  ArrowLeft,
  CalendarDays,
  CheckCircle,
  Clock3,
  Eye,
  Heart,
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

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
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

  function handleConfirmAction() {
    const { action } = confirmModal

    startTransition(async () => {
      let result = { success: false, message: "" }

      if (action === "approve") {
        result = await approveContentAction({
          type: "EVENT",
          id: event.id,
        })
      } else if (action === "reject") {
        result = await rejectContentAction({
          type: "EVENT",
          id: event.id,
        })
      } else if (action === "takedown") {
        result = await takedownContentAction({
          type: "EVENT",
          id: event.id,
        })
      } else if (action === "restore") {
        result = await restoreContentAction({
          type: "EVENT",
          id: event.id,
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
            <Link href="/dashboard/content/event">
              <ArrowLeft className="size-4" />
              Kembali
            </Link>
          </Button>
          <span className="inline-flex items-center gap-1.5 rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
            <Eye className="size-3.5" />
            Moderasi Event - {event.statusLabel}
          </span>
        </div>

        {/* Action Buttons for Admin (No Edit Button) */}
        <div className="flex flex-wrap items-center gap-2">
          {event.status === "PENDING_REVIEW" && (
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

          {event.status === "PUBLISHED" && (
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

          {event.status === "REJECTED" && (
            <Button
              size="sm"
              disabled={isPending}
              onClick={() => handleAction("restore")}
              className="gap-1.5 bg-emerald-600 text-xs text-white hover:bg-emerald-700"
            >
              <RotateCcw className="size-3.5" /> Pulihkan (Publish)
            </Button>
          )}

          {event.status === "TAKEN_DOWN" && (
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

      {/* ── Main Event Layout (Public Website Style) ── */}
      <div className="overflow-hidden rounded-2xl border bg-background shadow-sm">
        <header className="relative overflow-hidden bg-palembang-charcoal px-6 pb-16 pt-16 text-white sm:px-10 lg:px-16">
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
            <span className="inline-block rounded-full border border-palembang-red/40 bg-palembang-red/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-red">
              {event.category}
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
              {event.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">
              {event.description}
            </p>
            <div className="mt-8 flex flex-wrap items-center gap-5 text-xs text-white/70">
              <span className="flex items-center gap-2">
                <CalendarDays className="size-4 text-palembang-red" />
                {event.dateLabel}
              </span>
              <span className="flex items-center gap-2">
                <Heart className="size-4 text-palembang-red" />
                {event.likesCount.toLocaleString("id-ID")} likes
              </span>
              <span className="flex items-center gap-2">
                <Eye className="size-4 text-palembang-red" />
                {event.views.toLocaleString("id-ID")} views
              </span>
            </div>
          </div>
        </header>

        <main className="px-6 py-12 sm:px-10 lg:px-16 lg:py-16">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[1fr_380px]">
            <div>
              <div className="relative aspect-[16/9] overflow-hidden rounded-[1.5rem] border shadow-sm">
                <Image
                  src={event.bannerUrl}
                  alt={event.title}
                  fill
                  sizes="(min-width: 1024px) 760px, 100vw"
                  className="object-cover"
                />
              </div>

              <div className="mt-10">
                <span className="text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-red">
                  Tentang Agenda
                </span>
                <h2 className="mt-2 font-display text-2xl font-bold">
                  Detail Pelaksanaan
                </h2>
                <div
                  className="article-body mt-6 max-w-none text-base leading-8 text-foreground/80"
                  dangerouslySetInnerHTML={{ __html: event.content }}
                />
              </div>

              {event.tags.length > 0 && (
                <div className="mt-10 flex flex-wrap gap-2 border-t pt-6">
                  {event.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              )}
            </div>

            <aside className="space-y-6">
              <EventOrganizerCard organizer={event.organizer} />
              <div className="rounded-[1.5rem] border bg-card p-6 shadow-sm sm:p-8">
                <h3 className="font-display text-lg font-bold">Detail Acara</h3>
                <div className="mt-6 space-y-4 text-sm text-muted-foreground">
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

                <div className="mt-8 space-y-3 border-t pt-6">
                  {event.registrationUrl ? (
                    <a
                      href={event.registrationUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-palembang-red text-sm font-bold text-white shadow-sm transition-colors hover:bg-palembang-red/90"
                    >
                      <Ticket className="size-4" />
                      Daftar Sekarang
                    </a>
                  ) : (
                    <div className="rounded-lg bg-muted px-4 py-3 text-center text-xs leading-5 text-muted-foreground">
                      Informasi pendaftaran belum tersedia.
                    </div>
                  )}

                  <div className="grid grid-cols-3 gap-2">
                    <div className="flex h-11 items-center justify-center gap-1.5 rounded-md border border-border px-2 text-xs font-semibold text-muted-foreground">
                      <Heart className="size-4" />
                      Suka
                    </div>
                    <a
                      href={whatsappQuestionUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 items-center justify-center gap-1.5 rounded-md border border-emerald-600/30 bg-emerald-600/10 px-2 text-xs font-bold text-emerald-600 transition-all hover:bg-emerald-600 hover:text-white dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white"
                    >
                      <MessageCircle className="size-4" />
                      Tanya
                    </a>
                    <EventShareButton
                      title={event.title}
                      url={`/agenda/${event.id}`}
                      label="Bagikan"
                      className="gap-1.5 px-2 text-xs"
                    />
                  </div>
                </div>
              </div>
            </aside>
          </div>
        </main>
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
            ? "Konfirmasi Persetujuan Event"
            : confirmModal.action === "reject"
              ? "Konfirmasi Penolakan Event"
              : confirmModal.action === "takedown"
                ? "Konfirmasi Takedown Event"
                : "Konfirmasi Pemulihan Event"
        }
        description={
          confirmModal.action === "approve"
            ? `Apakah Anda yakin ingin menyetujui dan mempublikasikan event "${event.title}"?`
            : confirmModal.action === "reject"
              ? `Apakah Anda yakin ingin menolak pengajuan event "${event.title}"?`
              : confirmModal.action === "takedown"
                ? `Apakah Anda yakin ingin men-takedown event "${event.title}" dari penayangan publik?`
                : `Apakah Anda yakin ingin memulihkan event "${event.title}" ke status Posted?`
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
