"use server"

import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { articleEditorSchema } from "../schemas/article.schema"
import type { ArticleActionResult } from "../types/article"
import {
  articleContentHasText,
  calculateReadingTime,
  sanitizeArticleContent,
} from "../data/sanitize-article-content"
import { revalidateArticleRoutes } from "./revalidate-article-routes"

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "artikel"
}

async function createAvailableSlug(
  transaction: Prisma.TransactionClient,
  title: string,
) {
  const baseSlug = slugify(title).slice(0, 170).replace(/-+$/g, "") || "artikel"

  for (let suffix = 1; suffix <= 100; suffix += 1) {
    const candidate =
      suffix === 1 ? baseSlug : `${baseSlug.slice(0, 175)}-${suffix}`
    const existing = await transaction.article.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!existing) return candidate
  }

  throw new Error("Tidak dapat membuat slug Artikel yang unik.")
}

export async function saveArticleAction(
  input: unknown,
): Promise<ArticleActionResult> {
  const actor = await requireCurrentUser()
  const parsed = articleEditorSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      message: issue?.message ?? "Data Artikel tidak valid.",
      field: issue?.path.map(String).join("."),
    }
  }

  const data = parsed.data
  const content = sanitizeArticleContent(data.content)
  if (!articleContentHasText(content)) {
    return {
      success: false,
      message: "Konten Artikel wajib berisi teks.",
      field: "content",
    }
  }

  const readingTime = calculateReadingTime(content)

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const section = await transaction.websiteArticleSection.findFirst({
        where: {
          id: data.websiteArticleSectionId,
          deletedAt: null,
          websiteContent: { key: "home", deletedAt: null },
        },
        select: { id: true, articleCategorySlug: true },
      })

      if (!section) {
        return { kind: "invalid-section" as const }
      }

      if (data.id) {
        const currentArticle = await transaction.article.findFirst({
          where: {
            id: data.id,
            authorId: actor.id,
            deletedAt: null,
          },
          select: { id: true, slug: true, status: true },
        })

        if (!currentArticle) return { kind: "not-found" as const }
        if (data.intent === "POST" && currentArticle.status !== "DRAFT") {
          return { kind: "invalid-status" as const }
        }

        const now = new Date()
        await transaction.articleTag.updateMany({
          where: { articleId: currentArticle.id, deletedAt: null },
          data: { deletedAt: now },
        })

        const article = await transaction.article.update({
          where: { id: currentArticle.id },
          data: {
            websiteArticleSectionId: section.id,
            title: data.title,
            excerpt: data.excerpt,
            content,
            coverImageUrl: data.coverImageUrl,
            readingTime,
            ...(data.intent === "POST"
              ? {
                  status: "PENDING_REVIEW" as const,
                  submittedAt: now,
                }
              : {}),
            tags: {
              create: data.tags.map((label, index) => ({
                label,
                position: index + 1,
              })),
            },
          },
          select: {
            id: true,
            slug: true,
            status: true,
            websiteArticleSection: {
              select: { articleCategorySlug: true },
            },
          },
        })

        return { kind: "saved" as const, article }
      }

      const slug = await createAvailableSlug(transaction, data.title)
      const article = await transaction.article.create({
        data: {
          authorId: actor.id,
          websiteArticleSectionId: section.id,
          slug,
          title: data.title,
          excerpt: data.excerpt,
          content,
          coverImageUrl: data.coverImageUrl,
          readingTime,
          status: data.intent === "POST" ? "PENDING_REVIEW" : "DRAFT",
          submittedAt: data.intent === "POST" ? new Date() : null,
          tags: {
            create: data.tags.map((label, index) => ({
              label,
              position: index + 1,
            })),
          },
        },
        select: {
          id: true,
          slug: true,
          status: true,
          websiteArticleSection: {
            select: { articleCategorySlug: true },
          },
        },
      })

      return { kind: "saved" as const, article }
    })

    if (result.kind === "invalid-section") {
      return {
        success: false,
        message: "Kategori artikel tidak valid atau tidak aktif.",
        field: "websiteArticleSectionId",
      }
    }

    if (result.kind === "not-found") {
      return {
        success: false,
        message: "Artikel tidak ditemukan atau bukan milik account ini.",
      }
    }

    if (result.kind === "invalid-status") {
      return {
        success: false,
        message: "Hanya Artikel berstatus Draf yang dapat diposting.",
      }
    }

    revalidateArticleRoutes({
      id: result.article.id,
      slug: result.article.slug,
      categorySlug: result.article.websiteArticleSection.articleCategorySlug,
    })

    return {
      success: true,
      message:
        data.intent === "POST"
          ? "Artikel berhasil diajukan untuk review."
          : data.id
            ? "Perubahan Artikel berhasil disimpan."
            : "Draf Artikel berhasil dibuat.",
      id: result.article.id,
      status: result.article.status,
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message:
          "Slug Artikel sudah digunakan. Silakan ubah judul dan coba lagi.",
        field: "title",
      }
    }

    console.error("Failed to save Article:", error)
    return {
      success: false,
      message: "Artikel gagal disimpan. Silakan coba lagi.",
    }
  }
}
