"use client"

import { useState } from "react"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Textarea } from "@/components/ui/textarea"

export type ModerationAction = "approve" | "reject" | "takedown" | "restore"

const NOTE_MAX_LENGTH = 1000

/** Reject dan Takedown wajib beralasan; keputusan lain tidak memakai catatan. */
export function moderationRequiresNote(action: ModerationAction) {
  return action === "reject" || action === "takedown"
}

function dialogCopy(action: ModerationAction, contentLabel: string) {
  const lowerLabel = contentLabel.toLowerCase()

  if (action === "approve") {
    return {
      title: `Konfirmasi Persetujuan ${contentLabel}`,
      description: (title: string) =>
        `Apakah Anda yakin ingin menyetujui dan mempublikasikan ${lowerLabel} "${title}"?`,
      confirmText: "Ya, Setujui",
      variant: "default" as const,
      noteLabel: "",
      notePlaceholder: "",
    }
  }

  if (action === "reject") {
    return {
      title: `Konfirmasi Penolakan ${contentLabel}`,
      description: (title: string) =>
        `Pengajuan ${lowerLabel} "${title}" akan ditolak dan dikembalikan kepada penulis.`,
      confirmText: "Ya, Tolak",
      variant: "destructive" as const,
      noteLabel: "Alasan penolakan",
      notePlaceholder:
        "Contoh: Banner belum sesuai ketentuan dan dua paragraf terakhir perlu sumber yang jelas.",
    }
  }

  if (action === "takedown") {
    return {
      title: `Konfirmasi Takedown ${contentLabel}`,
      description: (title: string) =>
        `${contentLabel} "${title}" akan diturunkan dari penayangan publik.`,
      confirmText: "Ya, Takedown",
      variant: "destructive" as const,
      noteLabel: "Alasan takedown",
      notePlaceholder:
        "Contoh: Terdapat informasi yang keliru pada bagian jadwal acara.",
    }
  }

  return {
    title: `Konfirmasi Pemulihan ${contentLabel}`,
    description: (title: string) =>
      `Apakah Anda yakin ingin memulihkan ${lowerLabel} "${title}" ke status Posted?`,
    confirmText: "Ya, Pulihkan",
    variant: "default" as const,
    noteLabel: "",
    notePlaceholder: "",
  }
}

interface ModerationConfirmDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  action: ModerationAction
  /** "Artikel" atau "Event", dipakai pada seluruh copy dialog. */
  contentLabel: string
  contentTitle: string
  isPending?: boolean
  onConfirm: (note: string) => void
}

export function ModerationConfirmDialog({
  open,
  onOpenChange,
  action,
  contentLabel,
  contentTitle,
  isPending = false,
  onConfirm,
}: ModerationConfirmDialogProps) {
  const [note, setNote] = useState("")

  /** Catatan dikosongkan setiap dialog ditutup agar tidak terbawa ke konten lain. */
  function handleOpenChange(next: boolean) {
    if (!next) setNote("")
    onOpenChange(next)
  }

  const copy = dialogCopy(action, contentLabel)
  const requiresNote = moderationRequiresNote(action)
  const trimmedNote = note.trim()
  const canConfirm = !requiresNote || trimmedNote.length > 0

  return (
    <AlertDialog open={open} onOpenChange={handleOpenChange}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>{copy.title}</AlertDialogTitle>
          <AlertDialogDescription>
            {copy.description(contentTitle)}
          </AlertDialogDescription>
        </AlertDialogHeader>

        {requiresNote ? (
          <div className="space-y-2">
            <label
              htmlFor="moderation-note"
              className="text-sm font-semibold text-foreground"
            >
              {copy.noteLabel}
              <span className="text-palembang-red"> *</span>
            </label>
            <Textarea
              id="moderation-note"
              value={note}
              onChange={(event) => setNote(event.target.value)}
              maxLength={NOTE_MAX_LENGTH}
              placeholder={copy.notePlaceholder}
              className="min-h-28 resize-none"
            />
            <div className="flex items-start justify-between gap-3">
              <p className="text-xs text-muted-foreground">
                Alasan ini ditampilkan pada dashboard pemilik konten dan dikirim
                melalui email notifikasi.
              </p>
              <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                {trimmedNote.length}/{NOTE_MAX_LENGTH}
              </span>
            </div>
          </div>
        ) : null}

        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => handleOpenChange(false)}>
            Batal
          </AlertDialogCancel>
          <AlertDialogAction
            variant={copy.variant}
            disabled={!canConfirm || isPending}
            onClick={(event) => {
              if (!canConfirm) {
                event.preventDefault()
                return
              }
              onConfirm(trimmedNote)
            }}
          >
            {copy.confirmText}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
