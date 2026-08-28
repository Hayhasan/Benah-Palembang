import "server-only"

import { after } from "next/server"
import { headers } from "next/headers"

import { authRedisKey } from "./redis-key"
import { getAuthRedis } from "./redis"

const PRESENCE_TTL_SECONDS = 10 * 60
const ACTIVITY_GATE_SECONDS = 2 * 60

export interface AccountActivity {
  lastLoginAt: string | null
  lastActivityAt: string | null
  isOnline: boolean
}

function timestampToIso(value: unknown) {
  if (typeof value === "number" && Number.isFinite(value)) {
    return new Date(value).toISOString()
  }

  if (typeof value === "string") {
    const numericValue = Number(value)
    if (Number.isFinite(numericValue)) return new Date(numericValue).toISOString()

    const parsed = Date.parse(value)
    if (!Number.isNaN(parsed)) return new Date(parsed).toISOString()
  }

  return null
}

export async function recordLoginActivity(userId: string) {
  const timestamp = Date.now()
  const redis = getAuthRedis()
  await redis
    .pipeline()
    .set(authRedisKey.lastLogin(userId), timestamp)
    .set(authRedisKey.lastActivity(userId), timestamp)
    .set(authRedisKey.presence(userId), timestamp, {
      ex: PRESENCE_TTL_SECONDS,
    })
    .exec()
}

export async function clearPresence(userId: string) {
  await getAuthRedis().del(authRedisKey.presence(userId))
}

async function touchActivity(userId: string) {
  const redis = getAuthRedis()
  const gate = await redis.set(authRedisKey.activityGate(userId), 1, {
    nx: true,
    ex: ACTIVITY_GATE_SECONDS,
  })
  if (gate !== "OK") return

  const timestamp = Date.now()
  await redis
    .pipeline()
    .set(authRedisKey.lastActivity(userId), timestamp)
    .set(authRedisKey.presence(userId), timestamp, {
      ex: PRESENCE_TTL_SECONDS,
    })
    .exec()
}

export async function scheduleActivityTouch(userId: string) {
  const requestHeaders = await headers()
  const isPrefetch =
    requestHeaders.get("next-router-prefetch") === "1" ||
    requestHeaders.get("purpose")?.toLowerCase() === "prefetch"

  if (isPrefetch) return

  after(async () => {
    try {
      await touchActivity(userId)
    } catch (error) {
      console.error("Failed to update auth activity:", error)
    }
  })
}

export async function getAccountActivities(userIds: string[]) {
  const result = new Map<string, AccountActivity>()
  if (userIds.length === 0) return result

  try {
    const redis = getAuthRedis()
    const keys = userIds.flatMap((userId) => [
      authRedisKey.lastLogin(userId),
      authRedisKey.lastActivity(userId),
      authRedisKey.presence(userId),
    ])
    const values = await redis.mget<unknown[]>(...keys)

    userIds.forEach((userId, index) => {
      const offset = index * 3
      result.set(userId, {
        lastLoginAt: timestampToIso(values[offset]),
        lastActivityAt: timestampToIso(values[offset + 1]),
        isOnline: values[offset + 2] !== null,
      })
    })
  } catch (error) {
    console.error("Failed to read auth activity:", error)
    userIds.forEach((userId) => {
      result.set(userId, {
        lastLoginAt: null,
        lastActivityAt: null,
        isOnline: false,
      })
    })
  }

  return result
}
