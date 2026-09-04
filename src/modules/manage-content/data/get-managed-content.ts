import "server-only"

import type { ContentStatus } from "@prisma/client"
import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { managedContentListQuerySchema } from "../schemas/manage-content.schema"
import type {
  ManagedContentListResult,
  ManagedContentType,
} from "../types/managed-content"
import {
  mapArticleToManagedContent,
  mapEventToManagedContent,
} from "./managed-content.mapper"

const PAGE_SIZE = 25

/**
 * Status yang tidak pernah tampil pada antrian moderasi. `DRAFT` belum
 * diajukan owner, dan `ARCHIVED` sudah diturunkan sendiri oleh owner sehingga
 * tidak menunggu keputusan admin.
 */
const HIDDEN_MODERATION_STATUSES: ContentStatus[] = ["DRAFT", "ARCHIVED"]

export async function getManagedContent(
  contentType: ManagedContentType,
  input: {
    page?: string | number | null
    q?: string | null
  },
): Promise<ManagedContentListResult> {
  await connection()
  await requireRole(["ADMIN", "SUPERADMIN"])

  const parsed = managedContentListQuerySchema.safeParse({
    page: input.page ?? 1,
    q: input.q ?? undefined,
  })

  const page = parsed.success ? parsed.data.page : 1
  const searchQuery = parsed.success ? parsed.data.q?.trim() : undefined

  const articleWhere = {
    deletedAt: null,
    status: { notIn: HIDDEN_MODERATION_STATUSES },
    ...(searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" as const } },
            { excerpt: { contains: searchQuery, mode: "insensitive" as const } },
            {
              author: {
                name: { contains: searchQuery, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  }
  const eventWhere = {
    deletedAt: null,
    status: { notIn: HIDDEN_MODERATION_STATUSES },
    ...(searchQuery
      ? {
          OR: [
            { title: { contains: searchQuery, mode: "insensitive" as const } },
            {
              description: {
                contains: searchQuery,
                mode: "insensitive" as const,
              },
            },
            {
              owner: {
                name: { contains: searchQuery, mode: "insensitive" as const },
              },
            },
          ],
        }
      : {}),
  }

  const totalItems =
    contentType === "ARTICLE"
      ? await prisma.article.count({ where: articleWhere })
      : await prisma.event.count({ where: eventWhere })
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const skip = (safePage - 1) * PAGE_SIZE

  const items =
    contentType === "ARTICLE"
      ? (
          await prisma.article.findMany({
            where: articleWhere,
            orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
            skip,
            take: PAGE_SIZE,
            include: {
              author: {
                select: { id: true, name: true, avatarUrl: true },
              },
              _count: {
                select: {
                  likes: true,
                  comments: {
                    where: { deletedAt: null },
                  },
                },
              },
            },
          })
        ).map(mapArticleToManagedContent)
      : (
          await prisma.event.findMany({
            where: eventWhere,
            orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
            skip,
            take: PAGE_SIZE,
            include: {
              owner: {
                select: { id: true, name: true, avatarUrl: true },
              },
              _count: {
                select: {
                  likes: true,
                },
              },
            },
          })
        ).map(mapEventToManagedContent)

  return {
    items,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalItems,
    totalPages,
    query: searchQuery ?? "",
  }
}
