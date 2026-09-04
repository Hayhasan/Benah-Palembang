import type { ContentStatus } from "@prisma/client"

/**
 * Status Event yang boleh dihapus permanen oleh owner. Event `PUBLISHED`
 * harus diarsipkan lebih dahulu, dan `PENDING_REVIEW` maupun `TAKEN_DOWN`
 * sedang berada pada flow moderasi sehingga tidak dapat dihapus owner.
 */
export const DELETABLE_EVENT_STATUSES: readonly ContentStatus[] = [
  "DRAFT",
  "REJECTED",
  "ARCHIVED",
]

export function isDeletableEventStatus(status: ContentStatus) {
  return DELETABLE_EVENT_STATUSES.includes(status)
}

/**
 * Status Event yang boleh diajukan owner ke `PENDING_REVIEW`. Event `REJECTED`
 * ikut di sini supaya penolakan dapat diperbaiki lalu diajukan ulang tanpa
 * membuat Event baru dari nol.
 */
export const RESUBMITTABLE_EVENT_STATUSES: readonly ContentStatus[] = [
  "DRAFT",
  "REJECTED",
]

export function isResubmittableEventStatus(status: ContentStatus) {
  return RESUBMITTABLE_EVENT_STATUSES.includes(status)
}
