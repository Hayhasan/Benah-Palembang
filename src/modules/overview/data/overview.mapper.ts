import type { ContentStatus } from "@prisma/client"

export const INDONESIAN_MONTHS = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

export function getAvailableMonthsList(year = 2026): string[] {
  return INDONESIAN_MONTHS.map((m) => `${m} ${year}`)
}

export function formatNumber(value: number): string {
  return new Intl.NumberFormat("id-ID").format(value)
}

export function formatCompactNumber(value: number): string {
  if (value < 1000) {
    return value.toString()
  }
  if (value < 1_000_000) {
    const k = value / 1000
    return `${k >= 10 ? k.toFixed(0) : k.toFixed(1).replace(/\.0$/, "")}K`
  }
  const m = value / 1_000_000
  return `${m >= 10 ? m.toFixed(0) : m.toFixed(1).replace(/\.0$/, "")}M`
}

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMinutes = Math.floor(diffMs / (1000 * 60))
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24))

  const isToday =
    now.getDate() === date.getDate() &&
    now.getMonth() === date.getMonth() &&
    now.getFullYear() === date.getFullYear()

  const yesterday = new Date(now)
  yesterday.setDate(now.getDate() - 1)
  const isYesterday =
    yesterday.getDate() === date.getDate() &&
    yesterday.getMonth() === date.getMonth() &&
    yesterday.getFullYear() === date.getFullYear()

  if (diffMinutes < 1) return "Baru saja"
  if (diffMinutes < 60) return `${diffMinutes} mnt lalu`
  if (isToday) {
    const hours = date.getHours().toString().padStart(2, "0")
    const minutes = date.getMinutes().toString().padStart(2, "0")
    return `${hours}:${minutes}`
  }
  if (isYesterday) return "Kemarin"
  if (diffDays < 7) return `${diffDays} hari lalu`

  const day = date.getDate().toString().padStart(2, "0")
  const month = INDONESIAN_MONTHS[date.getMonth()]?.slice(0, 3) || ""
  return `${day} ${month}`
}

export function mapContentStatusToOverviewStatus(
  status: ContentStatus,
): "Request" | "Posted" | "Rejected" | "Takedown" | "Arsip" {
  switch (status) {
    case "PENDING_REVIEW":
      return "Request"
    case "PUBLISHED":
      return "Posted"
    case "REJECTED":
      return "Rejected"
    case "TAKEN_DOWN":
      return "Takedown"
    case "ARCHIVED":
      return "Arsip"
    default:
      return "Request"
  }
}
