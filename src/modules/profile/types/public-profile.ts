export interface PublicProfileArticle {
  id: number
  slug: string
  title: string
  excerpt: string
  coverImageUrl: string
  category: string
  publishedAtLabel: string
  views: number
  likes: number
}

export interface PublicProfileEvent {
  id: number
  title: string
  description: string
  bannerUrl: string
  category: string
  dateLabel: string
  location: string
}

export interface PublicProfileData {
  username: string
  name: string
  roleLabel: string
  avatarUrl: string
  bannerUrl: string
  bio: string
  whatsappUrl: string | null
  instagramUrl: string | null
  xUrl: string | null
  linkedinUrl: string | null
  articleCount: number
  totalViews: number
  totalLikes: number
  articles: PublicProfileArticle[]
  events: PublicProfileEvent[]
}
