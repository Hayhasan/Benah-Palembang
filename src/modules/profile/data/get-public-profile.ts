import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { usernameSchema } from "@/modules/auth/schemas/username.schema"

import type { PublicProfileData } from "../types/public-profile"

const DEFAULT_BANNER =
  "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop"
const DEFAULT_AVATAR =
  "https://images.pexels.com/photos/14795560/pexels-photo-14795560.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop"

const publishedAtFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

function roleLabel(role: "USER" | "ADMIN" | "SUPERADMIN") {
  return role === "USER" ? "Penulis & Kontributor" : "Tim Redaksi Benah"
}

export async function getPublicProfile(
  rawUsername: string,
): Promise<PublicProfileData | null> {
  await connection()

  const parsedUsername = usernameSchema.safeParse(rawUsername)
  if (!parsedUsername.success) return null

  const profile = await prisma.user.findFirst({
    where: {
      username: parsedUsername.data,
      isBanned: false,
      deletedAt: null,
    },
    select: {
      username: true,
      name: true,
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
        where: {
          status: "PUBLISHED",
          publishedAt: { not: null },
          deletedAt: null,
          websiteArticleSection: {
            deletedAt: null,
            websiteContent: { key: "home", deletedAt: null },
          },
        },
        orderBy: [{ publishedAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          slug: true,
          title: true,
          excerpt: true,
          coverImageUrl: true,
          publishedAt: true,
          views: true,
          websiteArticleSection: {
            select: { categoryHeroTitle: true },
          },
          _count: { select: { likes: true } },
        },
      },
      ownedEvents: {
        where: {
          status: "PUBLISHED",
          deletedAt: null,
        },
        orderBy: [{ startsAt: "desc" }, { id: "desc" }],
        select: {
          id: true,
          title: true,
          description: true,
          bannerUrl: true,
          category: true,
          startsAt: true,
          location: true,
        },
      },
    },
  })

  if (!profile) return null

  const articles = profile.authoredArticles.map((article) => ({
    id: article.id,
    slug: article.slug,
    title: article.title,
    excerpt: article.excerpt,
    coverImageUrl: article.coverImageUrl,
    category: article.websiteArticleSection.categoryHeroTitle,
    publishedAtLabel: publishedAtFormatter.format(article.publishedAt!),
    views: article.views,
    likes: article._count.likes,
  }))

  return {
    username: profile.username,
    name: profile.name,
    roleLabel: roleLabel(profile.role),
    avatarUrl: profile.avatarUrl || DEFAULT_AVATAR,
    bannerUrl: profile.bannerUrl || DEFAULT_BANNER,
    bio:
      profile.bio ||
      "Penulis dan kontributor yang berbagi cerita tentang kehidupan, kebudayaan, dan ruang kota Palembang.",
    whatsappUrl:
      profile.whatsappCountryCode && profile.whatsappNumber
        ? `https://wa.me/${profile.whatsappCountryCode}${profile.whatsappNumber}`
        : null,
    instagramUrl: profile.instagramUrl,
    xUrl: profile.xUrl,
    linkedinUrl: profile.linkedinUrl,
    articleCount: articles.length,
    totalViews: articles.reduce((total, article) => total + article.views, 0),
    totalLikes: articles.reduce((total, article) => total + article.likes, 0),
    articles,
    events: profile.ownedEvents.map((event) => ({
      id: event.id,
      title: event.title,
      description: event.description,
      bannerUrl: event.bannerUrl,
      category: event.category,
      dateLabel: publishedAtFormatter.format(event.startsAt),
      location: event.location,
    })),
  }
}
