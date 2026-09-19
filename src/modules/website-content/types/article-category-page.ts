export type WebsiteArticleCategory =
  | "Cerita Warga"
  | "Gaya Hidup"
  | "Ruang Kota"
  | "Industri Kreatif"
  | "Kebudayaan"

export interface ArticleCategoryPageData {
  sectionKey: string
  slug: string
  category: WebsiteArticleCategory
  heroSlides: {
    id?: number | null
    clientKey?: string
    imageUrl: string
    imageAlt: string
    label: string
    title: string
    description: string
    photographerName?: string | null
    position?: number
    isVisible?: boolean
  }[]
}
