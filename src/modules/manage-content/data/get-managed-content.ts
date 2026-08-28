import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { managedContentListQuerySchema } from "../schemas/manage-content.schema"
import type {
  ManagedContentListItem,
  ManagedContentListResult,
} from "../types/managed-content"
import {
  mapArticleToManagedContent,
  mapEventToManagedContent,
} from "./managed-content.mapper"

const PAGE_SIZE = 25

export async function getManagedContent(input: {
  page?: string | number | null
  q?: string | null
}): Promise<ManagedContentListResult> {
  await connection()
  await requireCurrentUser()

  const parsed = managedContentListQuerySchema.safeParse({
    page: input.page ?? 1,
    q: input.q ?? undefined,
  })

  const page = parsed.success ? parsed.data.page : 1
  const searchQuery = parsed.success ? parsed.data.q?.trim() : undefined

  const isTypeArticle = searchQuery?.toLowerCase() === "article"
  const isTypeEvent = searchQuery?.toLowerCase() === "event"

  const [articles, events] = await Promise.all([
    isTypeEvent
      ? Promise.resolve([])
      : prisma.article.findMany({
          where: {
            deletedAt: null,
            status: { not: "DRAFT" },
            ...(searchQuery && !isTypeArticle
              ? {
                  OR: [
                    { title: { contains: searchQuery, mode: "insensitive" } },
                    { excerpt: { contains: searchQuery, mode: "insensitive" } },
                    {
                      author: {
                        name: { contains: searchQuery, mode: "insensitive" },
                      },
                    },
                  ],
                }
              : {}),
          },
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
        }),
    isTypeArticle
      ? Promise.resolve([])
      : prisma.event.findMany({
          where: {
            deletedAt: null,
            status: { not: "DRAFT" },
            ...(searchQuery && !isTypeEvent
              ? {
                  OR: [
                    { title: { contains: searchQuery, mode: "insensitive" } },
                    {
                      description: {
                        contains: searchQuery,
                        mode: "insensitive",
                      },
                    },
                    {
                      owner: {
                        name: { contains: searchQuery, mode: "insensitive" },
                      },
                    },
                  ],
                }
              : {}),
          },
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
        }),
  ])

  const allItems: ManagedContentListItem[] = [
    ...articles.map(mapArticleToManagedContent),
    ...events.map(mapEventToManagedContent),
  ]

  allItems.sort((a, b) => {
    const dateA = new Date(a.submittedAt || a.updatedAt).getTime()
    const dateB = new Date(b.submittedAt || b.updatedAt).getTime()
    return dateB - dateA
  })

  const totalItems = allItems.length
  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)
  const startIndex = (safePage - 1) * PAGE_SIZE
  const items = allItems.slice(startIndex, startIndex + PAGE_SIZE)

  return {
    items,
    page: safePage,
    pageSize: PAGE_SIZE,
    totalItems,
    totalPages,
    query: searchQuery ?? "",
  }
}
