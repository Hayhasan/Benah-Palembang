import type { Prisma } from "@prisma/client"

import type {
  PublicArticleCardData,
  PublicArticleDetailData,
} from "../types/public-article"

const ARTICLE_TIME_ZONE = "Asia/Jakarta"
const DEFAULT_AUTHOR_AVATAR =
  "https://images.pexels.com/photos/14795560/pexels-photo-14795560.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"

const publishedAtFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: ARTICLE_TIME_ZONE,
})

export const publicArticleCardSelect = {
  id: true,
  slug: true,
  title: true,
  excerpt: true,
  coverImageUrl: true,
  readingTime: true,
  isFeatured: true,
  publishedAt: true,
  websiteArticleSection: {
    select: {
      sectionKey: true,
      articleCategorySlug: true,
      categoryHeroTitle: true,
    },
  },
} satisfies Prisma.ArticleSelect

export const publicArticleDetailSelect = {
  ...publicArticleCardSelect,
  authorId: true,
  websiteArticleSectionId: true,
  content: true,
  author: {
    select: {
      name: true,
      avatarUrl: true,
      bio: true,
    },
  },
  tags: {
    where: { deletedAt: null },
    orderBy: { position: "asc" },
    select: { label: true },
  },
  comments: {
    where: { deletedAt: null },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      userId: true,
      content: true,
      createdAt: true,
      user: {
        select: {
          name: true,
          avatarUrl: true,
        },
      },
    },
  },
  likes: {
    select: {
      userId: true,
    },
  },
  _count: {
    select: {
      likes: true,
      comments: { where: { deletedAt: null } },
    },
  },
} satisfies Prisma.ArticleSelect

export type PublicArticleCardRecord = Prisma.ArticleGetPayload<{
  select: typeof publicArticleCardSelect
}>

export type PublicArticleDetailRecord = Prisma.ArticleGetPayload<{
  select: typeof publicArticleDetailSelect
}>

export function formatRelativeTime(date: Date): string {
  const now = new Date()
  const diffInSeconds = Math.max(0, Math.floor((now.getTime() - date.getTime()) / 1000))

  if (diffInSeconds < 60) {
    return "Baru saja"
  }
  const diffInMinutes = Math.floor(diffInSeconds / 60)
  if (diffInMinutes < 60) {
    return `${diffInMinutes} menit lalu`
  }
  const diffInHours = Math.floor(diffInMinutes / 60)
  if (diffInHours < 24) {
    return `${diffInHours} jam lalu`
  }
  const diffInDays = Math.floor(diffInHours / 24)
  if (diffInDays < 30) {
    return `${diffInDays} hari lalu`
  }
  const diffInMonths = Math.floor(diffInDays / 30)
  if (diffInMonths < 12) {
    return `${diffInMonths} bulan lalu`
  }
  const diffInYears = Math.floor(diffInDays / 365)
  return `${diffInYears} tahun lalu`
}

export function mapPublicArticleCard(
  article: PublicArticleCardRecord,
): PublicArticleCardData {
  if (!article.publishedAt) {
    throw new Error(`Published Article ${article.id} has no publishedAt value.`)
  }

  return {
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    coverImageUrl: article.coverImageUrl,
    category: article.websiteArticleSection.categoryHeroTitle,
    categorySlug: article.websiteArticleSection.articleCategorySlug,
    sectionKey: article.websiteArticleSection.sectionKey,
    publishedAt: article.publishedAt.toISOString(),
    publishedAtLabel: publishedAtFormatter.format(article.publishedAt),
    readingTime: article.readingTime,
    isFeatured: article.isFeatured,
  }
}

export function mapPublicArticleDetail(
  article: PublicArticleDetailRecord,
  currentUserId?: string | null,
): PublicArticleDetailData {
  const hasLiked = Boolean(
    currentUserId && article.likes.some((like) => like.userId === currentUserId),
  )

  return {
    ...mapPublicArticleCard(article),
    authorId: article.authorId,
    content: article.content,
    tags: article.tags.map((tag) => tag.label),
    author: {
      name: article.author.name,
      avatarUrl: article.author.avatarUrl || DEFAULT_AUTHOR_AVATAR,
      bio:
        article.author.bio ||
        "Penulis dan kontributor yang berbagi cerita tentang Palembang.",
      roleLabel: "Penulis & Kontributor",
    },
    comments: article.comments.map((comment) => ({
      id: comment.id,
      userId: comment.userId,
      userName: comment.user.name,
      userAvatarUrl: comment.user.avatarUrl || DEFAULT_AUTHOR_AVATAR,
      content: comment.content,
      createdAt: comment.createdAt.toISOString(),
      createdAtLabel: formatRelativeTime(comment.createdAt),
      isArticleAuthor: comment.userId === article.authorId,
    })),
    likesCount: article._count.likes,
    hasLiked,
  }
}
