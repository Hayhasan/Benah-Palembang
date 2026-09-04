import "server-only"

import { applicationUrl, escapeHtml, sendMail } from "@/lib/mail/mailer"

import type { ManagedContentType } from "../types/managed-content"

export type ModerationDecision =
  | "APPROVED"
  | "REJECTED"
  | "TAKEN_DOWN"
  | "RESTORED"

interface DecisionCopy {
  subject: string
  heading: string
  intro: string
  /** Tautan yang paling berguna untuk pemilik konten setelah keputusan ini. */
  target: "PUBLIC" | "DASHBOARD"
  ctaLabel: string
  accent: string
  closing: string
}

function decisionCopy(
  decision: ModerationDecision,
  contentLabel: string,
  title: string,
): DecisionCopy {
  switch (decision) {
    case "APPROVED":
      return {
        subject: `${contentLabel} "${title}" disetujui dan sudah tayang`,
        heading: `${contentLabel} Anda sudah tayang`,
        intro: `Admin menyetujui pengajuan ${contentLabel.toLowerCase()} Anda. Sekarang ${contentLabel.toLowerCase()} tersebut sudah dapat dilihat publik.`,
        target: "PUBLIC",
        ctaLabel: `Lihat ${contentLabel}`,
        accent: "#1f7a4d",
        closing:
          "Anda tetap dapat menyunting kapan saja melalui dashboard tanpa perlu pengajuan ulang.",
      }
    case "REJECTED":
      return {
        subject: `${contentLabel} "${title}" belum disetujui`,
        heading: `${contentLabel} Anda belum disetujui`,
        intro: `Admin belum menyetujui pengajuan ${contentLabel.toLowerCase()} Anda. Silakan perbaiki sesuai catatan di bawah, lalu ajukan kembali dari dashboard.`,
        target: "DASHBOARD",
        ctaLabel: `Perbaiki ${contentLabel}`,
        accent: "#b5222a",
        closing:
          "Setelah diperbaiki, tekan tombol Post untuk mengajukannya kembali.",
      }
    case "TAKEN_DOWN":
      return {
        subject: `${contentLabel} "${title}" diturunkan dari halaman publik`,
        heading: `${contentLabel} Anda diturunkan admin`,
        intro: `Admin menurunkan ${contentLabel.toLowerCase()} Anda dari halaman publik. Data Anda tidak dihapus dan tetap tersimpan pada dashboard.`,
        target: "DASHBOARD",
        ctaLabel: `Buka ${contentLabel}`,
        accent: "#b5222a",
        closing:
          "Hubungi admin apabila Anda memerlukan penjelasan lebih lanjut mengenai keputusan ini.",
      }
    case "RESTORED":
      return {
        subject: `${contentLabel} "${title}" dipulihkan dan tayang kembali`,
        heading: `${contentLabel} Anda tayang kembali`,
        intro: `Admin memulihkan ${contentLabel.toLowerCase()} Anda sehingga kembali tampil pada halaman publik.`,
        target: "PUBLIC",
        ctaLabel: `Lihat ${contentLabel}`,
        accent: "#1f7a4d",
        closing:
          "Anda tetap dapat menyunting kapan saja melalui dashboard tanpa perlu pengajuan ulang.",
      }
  }
}

function contentUrls(input: {
  contentType: ManagedContentType
  id: number
  slug: string
}) {
  const base = applicationUrl()

  if (input.contentType === "ARTICLE") {
    return {
      public: `${base}/artikel/${input.slug}`,
      dashboard: `${base}/dashboard/create-article/edit?id=${input.id}`,
    }
  }

  return {
    public: `${base}/agenda/${input.id}`,
    dashboard: `${base}/dashboard/create-event/edit?id=${input.id}`,
  }
}

export interface ModerationEmailInput {
  decision: ModerationDecision
  contentType: ManagedContentType
  id: number
  slug: string
  title: string
  note: string | null
  recipient: { name: string; email: string }
}

/**
 * Menyusun isi email tanpa mengirimnya, sehingga copy dan tautan tujuan dapat
 * diperiksa terpisah dari koneksi SMTP.
 */
export function buildContentModerationEmail(input: ModerationEmailInput) {
  const contentLabel = input.contentType === "ARTICLE" ? "Artikel" : "Event"
  const copy = decisionCopy(input.decision, contentLabel, input.title)
  const urls = contentUrls(input)
  const actionUrl = copy.target === "PUBLIC" ? urls.public : urls.dashboard

  const noteBlock = input.note
    ? `
            <div style="margin:0 0 20px;padding:14px 16px;background:#f4f1ea;border-left:4px solid ${copy.accent};border-radius:8px">
              <p style="margin:0 0 6px;font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#777168">Catatan admin</p>
              <p style="margin:0;line-height:1.7;color:#252422">${escapeHtml(input.note)}</p>
            </div>`
    : ""

  return {
    to: input.recipient.email,
    subject: copy.subject,
    text: [
      `Halo ${input.recipient.name},`,
      "",
      copy.intro,
      "",
      `${contentLabel}: ${input.title}`,
      ...(input.note ? ["", `Catatan admin: ${input.note}`] : []),
      "",
      `Buka: ${actionUrl}`,
      "",
      copy.closing,
    ].join("\n"),
    html: `
      <div style="background:#f4f1ea;padding:32px 16px;font-family:Arial,sans-serif;color:#252422">
        <div style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #ddd7ca;border-radius:16px;overflow:hidden">
          <div style="background:#252422;padding:24px 28px;color:#ffffff">
            <p style="margin:0;color:#d7a84b;font-size:12px;font-weight:700;letter-spacing:1.6px;text-transform:uppercase">Benah Palembang</p>
            <h1 style="margin:10px 0 0;font-size:24px;line-height:1.3">${escapeHtml(copy.heading)}</h1>
          </div>
          <div style="padding:28px">
            <p style="margin:0 0 16px">Halo ${escapeHtml(input.recipient.name)},</p>
            <p style="margin:0 0 20px;line-height:1.7;color:#5b5750">${escapeHtml(copy.intro)}</p>
            <p style="margin:0 0 20px;padding:14px 16px;background:#faf8f4;border:1px solid #ddd7ca;border-radius:8px;line-height:1.6">
              <span style="font-size:12px;font-weight:700;letter-spacing:1px;text-transform:uppercase;color:#777168">${escapeHtml(contentLabel)}</span><br />
              <span style="font-size:16px;font-weight:700">${escapeHtml(input.title)}</span>
            </p>${noteBlock}
            <a href="${escapeHtml(actionUrl)}" style="display:inline-block;background:${copy.accent};color:#ffffff;text-decoration:none;font-weight:700;padding:13px 20px;border-radius:8px">${escapeHtml(copy.ctaLabel)}</a>
            <p style="margin:24px 0 0;font-size:13px;line-height:1.6;color:#777168">${escapeHtml(copy.closing)}</p>
          </div>
        </div>
      </div>
    `,
  }
}

/**
 * Notifikasi keputusan moderasi ke pemilik konten.
 *
 * Sengaja tidak pernah melempar error: keputusan moderasi sudah tersimpan di
 * database sebelum fungsi ini dipanggil, sehingga kegagalan SMTP tidak boleh
 * membuat aksi admin dilaporkan gagal. Kegagalan dicatat pada server log.
 */
export async function notifyContentDecision(input: ModerationEmailInput) {
  try {
    await sendMail(buildContentModerationEmail(input))
  } catch (error) {
    console.error(
      `Failed to send ${input.decision} notification for ${input.contentType} ${input.id}:`,
      error,
    )
  }
}
