"use server"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { articleIdSchema } from "../schemas/article.schema"
import type { ArticleActionResult } from "../types/article"
import { revalidateArticleRoutes } from "./revalidate-article-routes"

export async function republishArticleAction(
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
          title: true,
          slug: true,
          status: true,
          publishedAt: true,
          websiteArticleSection: {
            select: { articleCategorySlug: true },
          },
        },
      })

      if (!article) return { kind: "not-found" as const }
      if (article.status !== "ARCHIVED") {
        return { kind: "invalid-status" as const }
      }

      await transaction.article.update({
        where: { id: article.id },
        data: {
          status: "PUBLISHED",
          publishedAt: article.publishedAt ?? new Date(),
        },
      })

      await recordActivityLog(
        {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action: "RESTORE",
          module: "ARTICLE",
          description: `Mempublikasikan ulang artikel arsip '${article.title}'`,
          beforeState: { id: article.id, status: article.status },
          afterState: { id: article.id, status: "PUBLISHED" },
        },
        transaction,
      )

      return { kind: "republished" as const, article }
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
          "Hanya Artikel berstatus Arsip yang dapat dipublikasikan ulang.",
      }
    }

    revalidateArticleRoutes({
      id,
      slug: result.article.slug,
      categorySlug: result.article.websiteArticleSection.articleCategorySlug,
    })

    return {
      success: true,
      message: "Artikel berhasil dipublikasikan ulang tanpa review.",
      id,
      status: "PUBLISHED",
    }
  } catch (error) {
    console.error("Failed to republish Article:", error)
    return {
      success: false,
      message: "Artikel gagal dipublikasikan ulang. Silakan coba lagi.",
    }
  }
}
