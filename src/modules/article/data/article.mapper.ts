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
} satisfies Prisma.ArticleSelect

export type PublicArticleCardRecord = Prisma.ArticleGetPayload<{
  select: typeof publicArticleCardSelect
}>

export type PublicArticleDetailRecord = Prisma.ArticleGetPayload<{
  select: typeof publicArticleDetailSelect
}>

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
): PublicArticleDetailData {
  return {
    ...mapPublicArticleCard(article),
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
  }
}
