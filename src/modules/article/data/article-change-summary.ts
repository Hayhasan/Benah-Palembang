import "server-only"

/**
 * Snapshot field Artikel yang dibandingkan saat author menyimpan perubahan.
 * Dipakai activity log supaya admin dapat melihat field mana yang berubah,
 * terutama pada Artikel yang sedang tayang dan tidak melewati review ulang.
 */
export interface ArticleChangeSnapshot {
  title: string
  excerpt: string
  content: string
  coverImageUrl: string
  additionalBannerUrls: string[]
  categorySlug: string
  tags: string[]
  photographer?: string | null
  additionalPhotographers: string[]
  venueName?: string | null
  venueAddress?: string | null
  venuePriceLevel?: number | null
  venueOpenDays?: string | null
  venueOpenHours?: string | null
  venueFeatures?: string[]
  venueContact?: string | null
}

const TEXT_PREVIEW_LIMIT = 200

interface Comparison {
  field: string
  changed: boolean
  before: unknown
  after: unknown
}

function previewText(value: string | null) {
  if (value === null || value === "") return null
  return value.length <= TEXT_PREVIEW_LIMIT
    ? value
    : `${value.slice(0, TEXT_PREVIEW_LIMIT)}…`
}

function text(field: string, before: string | null, after: string | null) {
  return {
    field,
    changed: (before ?? "") !== (after ?? ""),
    before: previewText(before),
    after: previewText(after),
  }
}

/**
 * Rich content tidak disimpan utuh ke activity log agar kolom JsonB tidak
 * membengkak. Yang dicatat hanya penanda bahwa isinya berubah beserta
 * panjangnya sebagai indikasi besar perubahan.
 */
function html(field: string, before: string, after: string) {
  const describe = (value: string) =>
    `HTML ${value.length.toLocaleString("id-ID")} karakter`

  return {
    field,
    changed: before !== after,
    before: describe(before),
    after: describe(after),
  }
}

function list(field: string, before: string[], after: string[]) {
  return {
    field,
    changed: before.join("|") !== after.join("|"),
    before,
    after,
  }
}

export function buildArticleChangeSummary(
  before: ArticleChangeSnapshot,
  after: ArticleChangeSnapshot,
) {
  const comparisons: Comparison[] = [
    text("title", before.title, after.title),
    text("excerpt", before.excerpt, after.excerpt),
    html("content", before.content, after.content),
    text("coverImageUrl", before.coverImageUrl, after.coverImageUrl),
    list("additionalBannerUrls", before.additionalBannerUrls, after.additionalBannerUrls),
    text("categorySlug", before.categorySlug, after.categorySlug),
    list("tags", before.tags, after.tags),
    text("photographer", before.photographer ?? null, after.photographer ?? null),
    list("additionalPhotographers", before.additionalPhotographers, after.additionalPhotographers),
    text("venueName", before.venueName ?? null, after.venueName ?? null),
    text("venueAddress", before.venueAddress ?? null, after.venueAddress ?? null),
    text(
      "venuePriceLevel",
      before.venuePriceLevel ? String(before.venuePriceLevel) : null,
      after.venuePriceLevel ? String(after.venuePriceLevel) : null,
    ),
    text("venueOpenDays", before.venueOpenDays ?? null, after.venueOpenDays ?? null),
    text("venueOpenHours", before.venueOpenHours ?? null, after.venueOpenHours ?? null),
    list("venueFeatures", before.venueFeatures ?? [], after.venueFeatures ?? []),
    text("venueContact", before.venueContact ?? null, after.venueContact ?? null),
  ]

  const changed = comparisons.filter((comparison) => comparison.changed)

  return {
    changedFields: changed.map((comparison) => comparison.field),
    before: Object.fromEntries(
      changed.map((comparison) => [comparison.field, comparison.before]),
    ),
    after: Object.fromEntries(
      changed.map((comparison) => [comparison.field, comparison.after]),
    ),
  }
}
