export interface PublicArticleCardData {
  id: number
  slug: string
  title: string
  excerpt: string
  label?: string | null
  coverImageUrl: string
  additionalBannerUrls: string[]
  category: string
  categorySlug: string
  sectionKey: string
  publishedAt: string
  publishedAtLabel: string
  readingTime: number
  isFeatured: boolean
  views: number
}

export interface PublicArticleAuthorData {
  name: string
  username: string
  avatarUrl: string
  bio: string
  roleLabel: string
}



export interface PublicArticleDetailData extends PublicArticleCardData {
  authorId: string
  content: string
  tags: string[]
  additionalPhotographers: string[]
  author: PublicArticleAuthorData
  photographer?: string | null
  venueName?: string | null
  venueAddress?: string | null
  venuePriceLevel?: number | null
  venueOpenDays?: string | null
  venueOpenHours?: string | null
  venueFeatures?: string[]
  venueContact?: string | null
}

export interface PublicArticlePageData {
  article: PublicArticleDetailData
  relatedArticles: PublicArticleCardData[]
}

export type LandingArticlesBySection = Record<
  string,
  PublicArticleCardData[]
>
