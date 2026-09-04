import type { ExploreCountSource } from "../types/landing-page"

/** Grid Jelajahi pada landing page dirancang untuk enam kolom. */
export const MAX_EXPLORE_ITEMS = 6

export const EXPLORE_COUNT_SOURCE_OPTIONS: {
  value: ExploreCountSource
  label: string
  description: string
}[] = [
  {
    value: "article-category",
    label: "Kategori artikel",
    description: "Menghitung artikel published pada satu section kategori.",
  },
  {
    value: "event",
    label: "Agenda (Event)",
    description: "Menghitung seluruh Event published.",
  },
  {
    value: "manual",
    label: "Angka manual",
    description: "Angka diisi sendiri dan tidak berubah otomatis.",
  },
  {
    value: "none",
    label: "Tanpa angka",
    description: "Card hanya menampilkan label tanpa angka.",
  },
]

export const DEFAULT_EXPLORE_COUNT_LABEL: Record<ExploreCountSource, string> = {
  "article-category": "Stories",
  event: "Agenda",
  manual: "Stories",
  none: "",
}
