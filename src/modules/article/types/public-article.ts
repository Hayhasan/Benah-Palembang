export interface PublicArticleCardData {
  id: number
  slug: string
  title: string
  excerpt: string
  coverImageUrl: string
  category: string
  categorySlug: string
  sectionKey: string
  publishedAt: string
  publishedAtLabel: string
  readingTime: number
  isFeatured: boolean
}

export interface PublicArticleAuthorData {
  name: string
  avatarUrl: string
  bio: string
  roleLabel: string
}

export interface PublicArticleDetailData extends PublicArticleCardData {
  content: string
  tags: string[]
  author: PublicArticleAuthorData
}

export interface PublicArticlePageData {
  article: PublicArticleDetailData
  relatedArticles: PublicArticleCardData[]
}

export type LandingArticlesBySection = Record<
  string,
  PublicArticleCardData[]
>
