"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { createArticleCommentSchema } from "../schemas/article-comment.schema"

export interface CommentActionResult {
  success: boolean
  message: string
}

export async function createArticleCommentAction(
  input: unknown,
): Promise<CommentActionResult> {
  const actor = await requireCurrentUser()
  const parsed = createArticleCommentSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      message: issue?.message ?? "Data komentar tidak valid.",
    }
  }

  const { articleId, content } = parsed.data

  try {
    const article = await prisma.article.findFirst({
      where: {
        id: articleId,
        status: "PUBLISHED",
        publishedAt: { not: null },
        deletedAt: null,
      },
      select: { id: true, slug: true },
    })

    if (!article) {
      return {
        success: false,
        message: "Artikel tidak ditemukan atau belum dipublikasikan.",
      }
    }

    await prisma.articleComment.create({
      data: {
        articleId: article.id,
        userId: actor.id,
        content,
      },
    })

    revalidatePath(`/artikel/${article.slug}`)

    return {
      success: true,
      message: "Komentar berhasil dikirim.",
    }
  } catch (error) {
    console.error("Failed to create article comment:", error)
    return {
      success: false,
      message: "Gagal mengirim komentar. Silakan coba lagi.",
    }
  }
}
