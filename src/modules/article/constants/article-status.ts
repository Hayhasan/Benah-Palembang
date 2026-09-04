import type { ContentStatus } from "@prisma/client"

/**
 * Status Artikel yang boleh dihapus permanen oleh author. Artikel `PUBLISHED`
 * harus diarsipkan lebih dahulu, dan `PENDING_REVIEW` maupun `TAKEN_DOWN`
 * sedang berada pada flow moderasi sehingga tidak dapat dihapus author.
 */
export const DELETABLE_ARTICLE_STATUSES: readonly ContentStatus[] = [
  "DRAFT",
  "REJECTED",
  "ARCHIVED",
]

export function isDeletableArticleStatus(status: ContentStatus) {
  return DELETABLE_ARTICLE_STATUSES.includes(status)
}

/**
 * Status Artikel yang boleh diajukan author ke `PENDING_REVIEW`. Artikel
 * `REJECTED` ikut di sini supaya penolakan dapat diperbaiki lalu diajukan ulang
 * tanpa membuat Artikel baru dari nol.
 */
export const RESUBMITTABLE_ARTICLE_STATUSES: readonly ContentStatus[] = [
  "DRAFT",
  "REJECTED",
]

export function isResubmittableArticleStatus(status: ContentStatus) {
  return RESUBMITTABLE_ARTICLE_STATUSES.includes(status)
}
