import "server-only"

import { createHash, randomBytes } from "node:crypto"

import { prisma } from "@/lib/db/prisma"

import {
  passwordResetRecordSchema,
  passwordResetTokenSchema,
} from "../schemas/auth.schema"
import type { PasswordResetTokenStatus } from "../types/password-reset"
import { authRedisKey } from "./redis-key"
import { getAuthRedis } from "./redis"

export const PASSWORD_RESET_TTL_SECONDS = 10 * 60

const CONSUME_RESET_TOKEN_SCRIPT = `
local token = redis.call("GET", KEYS[1])
if not token then
  if redis.call("EXISTS", KEYS[3]) == 1 then return "used" end
  return "invalid"
end
local active = redis.call("GET", KEYS[2])
if active ~= ARGV[1] then return "replaced" end
redis.call("DEL", KEYS[1])
redis.call("DEL", KEYS[2])
redis.call("SET", KEYS[3], 1, "EX", ARGV[2])
return "consumed"
`

const CLEANUP_RESET_TOKEN_SCRIPT = `
local active = redis.call("GET", KEYS[2])
if active == ARGV[1] then redis.call("DEL", KEYS[2]) end
redis.call("DEL", KEYS[1])
return 1
`

export function hashPasswordResetToken(token: string) {
  return createHash("sha256").update(token).digest("hex")
}

export function maskEmail(email: string) {
  const [localPart, domain] = email.split("@")
  if (!localPart || !domain) return email

  const visible = localPart.slice(0, Math.min(2, localPart.length))
  return `${visible}${"*".repeat(Math.max(3, localPart.length - visible.length))}@${domain}`
}

export async function findPasswordResetAccount(email: string) {
  return prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      name: true,
      email: true,
      isBanned: true,
      deletedAt: true,
    },
  })
}

export async function createPasswordResetToken(userId: string) {
  const token = randomBytes(32).toString("base64url")
  const tokenHash = hashPasswordResetToken(token)
  const createdAt = new Date()
  const expiresAt = new Date(
    createdAt.getTime() + PASSWORD_RESET_TTL_SECONDS * 1000,
  )
  const redis = getAuthRedis()

  await redis
    .pipeline()
    .set(
      authRedisKey.passwordResetToken(tokenHash),
      {
        userId,
        tokenHash,
        createdAt: createdAt.toISOString(),
        expiresAt: expiresAt.toISOString(),
      },
      { ex: PASSWORD_RESET_TTL_SECONDS },
    )
    .set(authRedisKey.passwordResetActive(userId), tokenHash, {
      ex: PASSWORD_RESET_TTL_SECONDS,
    })
    .exec()

  return { token, tokenHash }
}

export async function createDiscardedPasswordResetToken() {
  const tokenHash = hashPasswordResetToken(
    randomBytes(32).toString("base64url"),
  )
  await getAuthRedis().set(authRedisKey.passwordResetDiscard(tokenHash), 1, {
    ex: PASSWORD_RESET_TTL_SECONDS,
  })
}

export async function cleanupPasswordResetToken(input: {
  userId: string
  tokenHash: string
}) {
  await getAuthRedis().eval<[string], number>(
    CLEANUP_RESET_TOKEN_SCRIPT,
    [
      authRedisKey.passwordResetToken(input.tokenHash),
      authRedisKey.passwordResetActive(input.userId),
    ],
    [input.tokenHash],
  )
}

export async function getPasswordResetTokenStatus(
  token: string,
): Promise<PasswordResetTokenStatus> {
  if (!passwordResetTokenSchema.safeParse(token).success) {
    return { status: "invalid" }
  }

  const tokenHash = hashPasswordResetToken(token)
  const redis = getAuthRedis()
  const wasUsed = await redis.exists(authRedisKey.passwordResetUsed(tokenHash))
  if (wasUsed) return { status: "used" }

  const rawRecord = await redis.get<unknown>(
    authRedisKey.passwordResetToken(tokenHash),
  )
  const parsedRecord = passwordResetRecordSchema.safeParse(rawRecord)
  if (!parsedRecord.success) return { status: "invalid" }
  if (parsedRecord.data.tokenHash !== tokenHash) return { status: "invalid" }
  if (Date.parse(parsedRecord.data.expiresAt) <= Date.now()) {
    return { status: "invalid" }
  }

  const activeTokenHash = await redis.get<string>(
    authRedisKey.passwordResetActive(parsedRecord.data.userId),
  )
  if (activeTokenHash !== tokenHash) return { status: "replaced" }

  const account = await prisma.user.findFirst({
    where: {
      id: parsedRecord.data.userId,
      isBanned: false,
      deletedAt: null,
    },
    select: { email: true },
  })
  if (!account) return { status: "invalid" }

  return { status: "valid", maskedEmail: maskEmail(account.email) }
}

export async function getPasswordResetRecord(token: string) {
  if (!passwordResetTokenSchema.safeParse(token).success) return null

  const tokenHash = hashPasswordResetToken(token)
  const rawRecord = await getAuthRedis().get<unknown>(
    authRedisKey.passwordResetToken(tokenHash),
  )
  const parsedRecord = passwordResetRecordSchema.safeParse(rawRecord)
  return parsedRecord.success && parsedRecord.data.tokenHash === tokenHash
    ? parsedRecord.data
    : null
}

export async function consumePasswordResetToken(input: {
  userId: string
  tokenHash: string
}) {
  return getAuthRedis().eval<
    [string, number],
    "consumed" | "used" | "replaced" | "invalid"
  >(
    CONSUME_RESET_TOKEN_SCRIPT,
    [
      authRedisKey.passwordResetToken(input.tokenHash),
      authRedisKey.passwordResetActive(input.userId),
      authRedisKey.passwordResetUsed(input.tokenHash),
    ],
    [input.tokenHash, PASSWORD_RESET_TTL_SECONDS],
  )
}
