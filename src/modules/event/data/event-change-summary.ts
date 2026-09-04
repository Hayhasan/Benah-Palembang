import "server-only"

/**
 * Snapshot field Event yang dibandingkan saat owner menyimpan perubahan.
 * Dipakai activity log supaya admin dapat melihat field mana yang berubah,
 * terutama pada Event yang sedang tayang dan tidak melewati review ulang.
 */
export interface EventChangeSnapshot {
  title: string
  description: string
  content: string
  bannerUrl: string
  category: string
  startsAt: Date
  location: string
  organizer: string
  registrationUrl: string | null
  whatsappUrl: string
  tags: string[]
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

function date(field: string, before: Date, after: Date) {
  return {
    field,
    changed: before.getTime() !== after.getTime(),
    before: before.toISOString(),
    after: after.toISOString(),
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

export function buildEventChangeSummary(
  before: EventChangeSnapshot,
  after: EventChangeSnapshot,
) {
  const comparisons: Comparison[] = [
    text("title", before.title, after.title),
    text("description", before.description, after.description),
    html("content", before.content, after.content),
    text("bannerUrl", before.bannerUrl, after.bannerUrl),
    text("category", before.category, after.category),
    date("startsAt", before.startsAt, after.startsAt),
    text("location", before.location, after.location),
    text("organizer", before.organizer, after.organizer),
    text("registrationUrl", before.registrationUrl, after.registrationUrl),
    text("whatsappUrl", before.whatsappUrl, after.whatsappUrl),
    list("tags", before.tags, after.tags),
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
