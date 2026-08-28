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

export interface PublicArticleCommentItem {
  id: number
  userId: string
  userName: string
  userAvatarUrl: string
  content: string
  createdAt: string
  createdAtLabel: string
  isArticleAuthor: boolean
}

export interface PublicArticleDetailData extends PublicArticleCardData {
  authorId: string
  content: string
  tags: string[]
  author: PublicArticleAuthorData
  comments: PublicArticleCommentItem[]
}

export interface PublicArticlePageData {
  article: PublicArticleDetailData
  relatedArticles: PublicArticleCardData[]
}

export type LandingArticlesBySection = Record<
  string,
  PublicArticleCardData[]
>

