"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { toggleArticleLikeSchema } from "../schemas/article-like.schema"

export interface ToggleArticleLikeResult {
  success: boolean
  message: string
  hasLiked?: boolean
  likesCount?: number
}

export async function toggleArticleLikeAction(
  input: unknown,
): Promise<ToggleArticleLikeResult> {
  const actor = await requireCurrentUser()
  const parsed = toggleArticleLikeSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "ID Artikel tidak valid.",
    }
  }

  const { articleId } = parsed.data

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

    const existingLike = await prisma.articleLike.findUnique({
      where: {
        articleId_userId: {
          articleId: article.id,
          userId: actor.id,
        },
      },
    })

    let hasLiked = false
    if (existingLike) {
      await prisma.articleLike.delete({
        where: { id: existingLike.id },
      })
      hasLiked = false
    } else {
      await prisma.articleLike.create({
        data: {
          articleId: article.id,
          userId: actor.id,
        },
      })
      hasLiked = true
    }

    const likesCount = await prisma.articleLike.count({
      where: { articleId: article.id },
    })

    revalidatePath(`/artikel/${article.slug}`)
    revalidatePath("/dashboard/content")
    revalidatePath("/dashboard/create-article")

    return {
      success: true,
      message: hasLiked
        ? "Berhasil menyukai artikel."
        : "Batal menyukai artikel.",
      hasLiked,
      likesCount,
    }
  } catch (error) {
    console.error("Failed to toggle article like:", error)
    return {
      success: false,
      message: "Terjadi kesalahan saat memproses suka artikel.",
    }
  }
}
