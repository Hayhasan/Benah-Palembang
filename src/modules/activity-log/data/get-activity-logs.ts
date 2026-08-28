import "server-only"

import { connection } from "next/server"
import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { activityLogListQuerySchema } from "../schemas/activity-log-query.schema"
import type { ActivityLogListResult } from "../types/activity-log"
import { mapPrismaActivityLogToDto } from "./activity-log.mapper"

const PAGE_SIZE = 25

export async function getActivityLogs(input: {
  page?: string | number | null
  q?: string | null
}): Promise<ActivityLogListResult> {
  await connection()
  await requireRole(["SUPERADMIN"])

  const parsed = activityLogListQuerySchema.safeParse({
    page: input.page ?? 1,
    q: input.q ?? undefined,
  })

  const page = parsed.success ? parsed.data.page : 1
  const searchQuery = parsed.success ? parsed.data.q?.trim() : undefined

  let whereClause: Prisma.ActivityLogWhereInput = {}

  if (searchQuery) {
    whereClause = {
      OR: [
        { userName: { contains: searchQuery, mode: "insensitive" } },
        { description: { contains: searchQuery, mode: "insensitive" } },
      ],
    }
  }

  const [totalItems, logs] = await Promise.all([
    prisma.activityLog.count({ where: whereClause }),
    prisma.activityLog.findMany({
      where: whereClause,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ])

  const totalPages = Math.max(1, Math.ceil(totalItems / PAGE_SIZE))
  const safePage = Math.min(Math.max(1, page), totalPages)

  return {
    items: logs.map(mapPrismaActivityLogToDto),
    page: safePage,
    pageSize: PAGE_SIZE,
    totalItems,
    totalPages,
    query: searchQuery ?? "",
  }
}
