"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { deleteArticleCommentSchema } from "../schemas/article-comment.schema"

export interface CommentActionResult {
  success: boolean
  message: string
}

export async function deleteArticleCommentAction(
  input: unknown,
): Promise<CommentActionResult> {
  const actor = await requireCurrentUser()
  const parsed = deleteArticleCommentSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: "ID Komentar tidak valid.",
    }
  }

  const { id } = parsed.data

  try {
    const comment = await prisma.articleComment.findFirst({
      where: {
        id,
        userId: actor.id,
        deletedAt: null,
      },
      select: {
        id: true,
        article: {
          select: {
            slug: true,
          },
        },
      },
    })

    if (!comment) {
      return {
        success: false,
        message: "Komentar tidak ditemukan atau bukan milik akun Anda.",
      }
    }

    await prisma.articleComment.update({
      where: { id: comment.id },
      data: {
        deletedAt: new Date(),
      },
    })

    revalidatePath(`/artikel/${comment.article.slug}`)

    return {
      success: true,
      message: "Komentar berhasil dihapus.",
    }
  } catch (error) {
    console.error("Failed to delete article comment:", error)
    return {
      success: false,
      message: "Gagal menghapus komentar. Silakan coba lagi.",
    }
  }
}
