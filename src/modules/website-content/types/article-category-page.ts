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
  hero: {
    imageUrl: string
    imageAlt: string
    title: string
    description: string
  }
}
