import "server-only"

import { headers } from "next/headers"
import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import type { ActivityAction, ActivityModule, UserRole } from "@prisma/client"

export interface RecordActivityLogParams {
  userId?: string | null
  userName: string
  userRole?: UserRole
  action: ActivityAction
  module: ActivityModule
  description: string
  beforeState?: Record<string, unknown> | null
  afterState?: Record<string, unknown> | null
  ipAddress?: string | null
  userAgent?: string | null
}

async function resolveRequestMetadata(
  explicitIp?: string | null,
  explicitUa?: string | null,
) {
  let ipAddress = explicitIp ?? null
  let userAgent = explicitUa ?? null

  if (ipAddress && userAgent) {
    return { ipAddress, userAgent }
  }

  try {
    const headerStore = await headers()

    if (!ipAddress) {
      const forwarded = headerStore.get("x-forwarded-for")
      const realIp = headerStore.get("x-real-ip")
      const cfIp = headerStore.get("cf-connecting-ip")
      ipAddress = forwarded?.split(",")[0]?.trim() || realIp || cfIp || null

      if (!ipAddress && process.env.NODE_ENV === "development") {
        ipAddress = "127.0.0.1"
      }
    }

    if (!userAgent) {
      userAgent = headerStore.get("user-agent") || null
    }
  } catch {
    // When invoked outside Next.js request context (e.g. CLI script)
    if (!ipAddress && process.env.NODE_ENV === "development") {
      ipAddress = "127.0.0.1"
    }
  }

  return { ipAddress, userAgent }
}

export async function recordActivityLog(
  params: RecordActivityLogParams,
  tx?: Prisma.TransactionClient,
) {
  const db = tx ?? prisma
  const meta = await resolveRequestMetadata(params.ipAddress, params.userAgent)

  return db.activityLog.create({
    data: {
      userId: params.userId ?? null,
      userName: params.userName,
      userRole: params.userRole ?? "USER",
      action: params.action,
      module: params.module,
      description: params.description,
      beforeState:
        params.beforeState !== undefined && params.beforeState !== null
          ? (params.beforeState as Prisma.InputJsonValue)
          : Prisma.DbNull,
      afterState:
        params.afterState !== undefined && params.afterState !== null
          ? (params.afterState as Prisma.InputJsonValue)
          : Prisma.DbNull,
      ipAddress: meta.ipAddress,
      userAgent: meta.userAgent,
    },
  })
}
