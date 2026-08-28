import "server-only"

import { cookies, headers } from "next/headers"

import { prisma } from "@/lib/db/prisma"
import { getRedis } from "@/lib/redis/redis"

export const DEVICE_ID_COOKIE_NAME = "benah_device_id"
export const VIEW_TTL_SECONDS = 24 * 60 * 60 // 24 hours (Option A)

function viewRedisNamespace() {
  const rawPrefix = process.env.REDIS_PREFIX?.trim() || "benah"
  return `${rawPrefix.replace(/:+$/, "")}:view`
}

export const viewRedisKey = {
  article: (articleId: number, identifier: string) =>
    `${viewRedisNamespace()}:article:${articleId}:${identifier}`,
  event: (eventId: number, identifier: string) =>
    `${viewRedisNamespace()}:event:${eventId}:${identifier}`,
}

export async function resolveClientIdentifier(userId?: string | null): Promise<string> {
  if (userId) {
    return `user:${userId}`
  }

  try {
    const cookieStore = await cookies()
    const cookieDeviceId = cookieStore.get(DEVICE_ID_COOKIE_NAME)?.value
    if (cookieDeviceId) {
      return `device:${cookieDeviceId}`
    }

    const headerList = await headers()
    const headerDeviceId = headerList.get("x-device-id")
    if (headerDeviceId) {
      return `device:${headerDeviceId}`
    }
  } catch {
    // If running in a context where cookies/headers are unavailable
  }

  return "guest:anonymous"
}

export async function recordArticleView(
  articleId: number,
  userId?: string | null,
): Promise<boolean> {
  try {
    const identifier = await resolveClientIdentifier(userId)
    const redis = getRedis()
    const key = viewRedisKey.article(articleId, identifier)

    const result = await redis.set(key, "1", {
      ex: VIEW_TTL_SECONDS,
      nx: true,
    })

    if (result === "OK") {
      await prisma.article.update({
        where: { id: articleId },
        data: {
          views: { increment: 1 },
        },
      })
      return true
    }

    return false
  } catch (error) {
    console.error(`[ViewTracker] Failed to record article view (ID: ${articleId}):`, error)
    return false
  }
}

export async function recordEventView(
  eventId: number,
  userId?: string | null,
): Promise<boolean> {
  try {
    const identifier = await resolveClientIdentifier(userId)
    const redis = getRedis()
    const key = viewRedisKey.event(eventId, identifier)

    const result = await redis.set(key, "1", {
      ex: VIEW_TTL_SECONDS,
      nx: true,
    })

    if (result === "OK") {
      await prisma.event.update({
        where: { id: eventId },
        data: {
          views: { increment: 1 },
        },
      })
      return true
    }

    return false
  } catch (error) {
    console.error(`[ViewTracker] Failed to record event view (ID: ${eventId}):`, error)
    return false
  }
}
