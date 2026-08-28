import "server-only"

import { createHash, randomBytes } from "node:crypto"
import { cookies } from "next/headers"

import { authSessionRecordSchema } from "../schemas/session.schema"
import type {
  AuthRole,
  AuthSessionRecord,
  VerifiedSession,
} from "../types/auth-session"
import { authRedisKey } from "./redis-key"
import { getAuthRedis } from "./redis"

const SESSION_TTL_SECONDS = 14 * 24 * 60 * 60
const SESSION_COOKIE_NAME =
  process.env.NODE_ENV === "production"
    ? "__Host-benah_session"
    : "benah_session"

export function hashSessionToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

function generateSessionToken() {
  return randomBytes(32).toString("base64url")
}

async function getOrCreateUserVersion(userId: string) {
  const redis = getAuthRedis()
  const key = authRedisKey.userVersion(userId)
  await redis.set(key, 1, { nx: true })
  const version = await redis.get<number>(key)

  if (!version || !Number.isInteger(version) || version < 1) {
    throw new Error("Auth user version is unavailable.")
  }

  return version
}

export async function createSession(input: {
  userId: string
  role: AuthRole
}) {
  const redis = getAuthRedis()
  const cookieStore = await cookies()
  const previousToken = cookieStore.get(SESSION_COOKIE_NAME)?.value

  if (previousToken) {
    await redis.del(authRedisKey.session(hashSessionToken(previousToken)))
  }

  const token = generateSessionToken()
  const tokenHash = hashSessionToken(token)
  const version = await getOrCreateUserVersion(input.userId)
  const createdAt = new Date()
  const expiresAt = new Date(createdAt.getTime() + SESSION_TTL_SECONDS * 1000)
  const record: AuthSessionRecord = {
    userId: input.userId,
    role: input.role,
    version,
    createdAt: createdAt.toISOString(),
    expiresAt: expiresAt.toISOString(),
  }

  await redis.set(authRedisKey.session(tokenHash), record, {
    ex: SESSION_TTL_SECONDS,
  })

  try {
    cookieStore.set(SESSION_COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: SESSION_TTL_SECONDS,
      priority: "high",
    })
  } catch (error) {
    await redis.del(authRedisKey.session(tokenHash))
    throw error
  }
}

export async function readSessionFromCookie(): Promise<VerifiedSession | null> {
  const token = (await cookies()).get(SESSION_COOKIE_NAME)?.value
  if (!token || token.length < 32 || token.length > 128) return null

  try {
    const tokenHash = hashSessionToken(token)
    const redis = getAuthRedis()
    const rawRecord = await redis.get<unknown>(authRedisKey.session(tokenHash))
    const parsedRecord = authSessionRecordSchema.safeParse(rawRecord)
    if (!parsedRecord.success) return null

    if (Date.parse(parsedRecord.data.expiresAt) <= Date.now()) return null

    const currentVersion = await redis.get<number>(
      authRedisKey.userVersion(parsedRecord.data.userId),
    )
    if (currentVersion !== parsedRecord.data.version) return null

    return {
      ...parsedRecord.data,
      tokenHash,
    }
  } catch (error) {
    console.error("Failed to verify auth session:", error)
    return null
  }
}

export async function deleteCurrentSession() {
  const cookieStore = await cookies()
  const token = cookieStore.get(SESSION_COOKIE_NAME)?.value

  try {
    if (token) {
      await getAuthRedis().del(authRedisKey.session(hashSessionToken(token)))
    }
  } finally {
    cookieStore.delete(SESSION_COOKIE_NAME)
  }
}

export async function revokeUserSessions(userId: string) {
  const redis = getAuthRedis()
  const versionKey = authRedisKey.userVersion(userId)
  await redis.set(versionKey, 1, { nx: true })
  await redis.incr(versionKey)
  await redis.del(authRedisKey.presence(userId))
}
