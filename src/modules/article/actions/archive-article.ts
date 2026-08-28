"use server"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { articleIdSchema } from "../schemas/article.schema"
import type { ArticleActionResult } from "../types/article"
import { revalidateArticleRoutes } from "./revalidate-article-routes"

function deletionTimestamp(date: Date) {
  return date
    .toISOString()
    .replace(/[-:T]/g, "")
    .slice(0, 14)
}

function deletedSlug(slug: string, id: number, date: Date) {
  const suffix = `-deleted-${deletionTimestamp(date)}-${id}`
  const base = slug.slice(0, 180 - suffix.length).replace(/-+$/g, "")
  return `${base || "artikel"}${suffix}`
}

export async function archiveArticleAction(
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
          originalSlug: true,
          status: true,
          websiteArticleSection: {
            select: { articleCategorySlug: true },
          },
        },
      })

      if (!article) return { kind: "not-found" as const }
      if (article.status !== "PUBLISHED") {
        return { kind: "invalid-status" as const }
      }

      const now = new Date()
      await transaction.articleTag.updateMany({
        where: { articleId: article.id, deletedAt: null },
        data: { deletedAt: now },
      })
      await transaction.article.update({
        where: { id: article.id },
        data: {
          originalSlug: article.originalSlug ?? article.slug,
          slug: deletedSlug(article.originalSlug ?? article.slug, article.id, now),
          deletedAt: now,
        },
      })

      await recordActivityLog(
        {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action: "DELETE",
          module: "ARTICLE",
          description: `Mengarsipkan artikel '${article.slug}'`,
          beforeState: { id: article.id, status: article.status, active: true },
          afterState: { active: false, deletedAt: now.toISOString() },
        },
        transaction,
      )

      return { kind: "archived" as const, article }
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
        message: "Hanya Artikel yang sudah Post yang dapat diarsipkan.",
      }
    }

    revalidateArticleRoutes({
      id,
      slug: result.article.slug,
      categorySlug: result.article.websiteArticleSection.articleCategorySlug,
    })

    return {
      success: true,
      message: "Artikel berhasil diarsipkan.",
      id,
      status: "PUBLISHED",
    }
  } catch (error) {
    console.error("Failed to archive Article:", error)
    return {
      success: false,
      message: "Artikel gagal diarsipkan. Silakan coba lagi.",
    }
  }
}
