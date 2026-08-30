import "server-only"

import type { Prisma } from "@prisma/client"

import {
  ARTICLE_GALLERY_LIMIT,
  articleGallerySelect,
  articleGalleryWhere,
  mapArticleGallery,
} from "@/modules/article/data/article-gallery.mapper"

import type { ProfileData } from "../types/profile"

export const profileSelect = {
  id: true,
  name: true,
  username: true,
  email: true,
  role: true,
  avatarUrl: true,
  bannerUrl: true,
  bio: true,
  whatsappCountryCode: true,
  whatsappNumber: true,
  instagramUrl: true,
  xUrl: true,
  linkedinUrl: true,
  authoredArticles: {
    where: articleGalleryWhere,
    orderBy: [{ updatedAt: "desc" }, { id: "desc" }],
    take: ARTICLE_GALLERY_LIMIT,
    select: articleGallerySelect,
  },
  _count: {
    select: {
      authoredArticles: { where: articleGalleryWhere },
    },
  },
} satisfies Prisma.UserSelect

type ProfileRecord = Prisma.UserGetPayload<{
  select: typeof profileSelect
}>

export function mapProfile(record: ProfileRecord): ProfileData {
  return {
    id: record.id,
    name: record.name,
    username: record.username,
    email: record.email,
    role: record.role,
    avatarUrl: record.avatarUrl,
    bannerUrl: record.bannerUrl,
    bio: record.bio,
    whatsappCountryCode: record.whatsappCountryCode,
    whatsappNumber: record.whatsappNumber,
    instagramUrl: record.instagramUrl,
    xUrl: record.xUrl,
    linkedinUrl: record.linkedinUrl,
    articleGallery: mapArticleGallery(
      record.authoredArticles,
      record._count.authoredArticles,
    ),
  }
}
