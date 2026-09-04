"use server"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { isResubmittableArticleStatus } from "../constants/article-status"
import { articleIdSchema } from "../schemas/article.schema"
import type { ArticleActionResult } from "../types/article"
import { revalidateArticleRoutes } from "./revalidate-article-routes"

export async function postArticleAction(
  input: unknown,
): Promise<ArticleActionResult> {
  const actor = await requireCurrentUser()
  const parsed = articleIdSchema.safeParse(input)

  if (!parsed.success) {
    return { success: false, message: "ID Artikel tidak valid." }
  }

  const { id } = parsed.data

  try {
    const result = await prisma.$transaction(async (transaction) => {
      const article = await transaction.article.findFirst({
        where: { id, authorId: actor.id, deletedAt: null },
        select: {
          id: true,
          slug: true,
          status: true,
          websiteArticleSection: {
            select: { articleCategorySlug: true },
          },
        },
      })

      if (!article) return { kind: "not-found" as const }
      if (!isResubmittableArticleStatus(article.status)) {
        return { kind: "invalid-status" as const }
      }

      await transaction.article.update({
        where: { id },
        data: {
          status: "PENDING_REVIEW",
          submittedAt: new Date(),
          moderationNote: null,
        },
      })

      return { kind: "posted" as const, article }
    })

    if (result.kind === "not-found") {
      return {
        success: false,
        message: "Artikel tidak ditemukan atau bukan milik account ini.",
      }
    }

    if (result.kind === "invalid-status") {
      return {
        success: false,
        message:
          "Hanya Artikel berstatus Draf atau Rejected yang dapat diposting.",
      }
    }

    revalidateArticleRoutes({
      id,
      slug: result.article.slug,
      categorySlug: result.article.websiteArticleSection.articleCategorySlug,
    })

    return {
      success: true,
      message: "Artikel berhasil diajukan untuk review.",
      id,
      status: "PENDING_REVIEW",
    }
  } catch (error) {
    console.error("Failed to post Article:", error)
    return {
      success: false,
      message: "Artikel gagal diposting. Silakan coba lagi.",
    }
  }
}
