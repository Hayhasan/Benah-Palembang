import "server-only"

import { createHash } from "node:crypto"
import { headers } from "next/headers"

import { authRedisKey } from "./redis-key"
import { getAuthRedis } from "./redis"

const RATE_LIMIT_WINDOW_SECONDS = 15 * 60
const LOGIN_EMAIL_LIMIT = 5
const LOGIN_IP_LIMIT = 30
const REGISTER_EMAIL_LIMIT = 5
const REGISTER_IP_LIMIT = 15
const PASSWORD_RESET_COOLDOWN_SECONDS = 60
const PASSWORD_RESET_IP_LIMIT = 10

const RATE_LIMIT_SCRIPT = `
local first = redis.call("INCR", KEYS[1])
if first == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
local second = redis.call("INCR", KEYS[2])
if second == 1 then redis.call("EXPIRE", KEYS[2], ARGV[1]) end
return {first, second}
`

const PASSWORD_RESET_RATE_LIMIT_SCRIPT = `
local ipCount = redis.call("INCR", KEYS[1])
if ipCount == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
if ipCount > tonumber(ARGV[2]) then return {0, 0, ipCount} end
local acquired = redis.call("SET", KEYS[2], ARGV[3], "NX", "EX", ARGV[4])
local ttl = redis.call("TTL", KEYS[2])
if acquired then return {1, ttl, ipCount} end
return {0, ttl, ipCount}
`

function hashIdentifier(value: string) {
  return createHash("sha256").update(value).digest("hex")
}

async function getClientIp() {
  const requestHeaders = await headers()
  return (
    requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    requestHeaders.get("x-real-ip")?.trim() ||
    "unknown"
  )
}

async function checkRateLimit(input: {
  email: string
  type: "login" | "register"
}) {
  const ipHash = hashIdentifier(await getClientIp())
  const emailHash = hashIdentifier(input.email)
  const isLogin = input.type === "login"
  const keys = isLogin
    ? [authRedisKey.loginRateIp(ipHash), authRedisKey.loginRateEmail(emailHash)]
    : [
        authRedisKey.registerRateIp(ipHash),
        authRedisKey.registerRateEmail(emailHash),
      ]
  const [ipCount, emailCount] = await getAuthRedis().eval<
    [number],
    [number, number]
  >(RATE_LIMIT_SCRIPT, keys, [RATE_LIMIT_WINDOW_SECONDS])

  return {
    limited:
      ipCount > (isLogin ? LOGIN_IP_LIMIT : REGISTER_IP_LIMIT) ||
      emailCount > (isLogin ? LOGIN_EMAIL_LIMIT : REGISTER_EMAIL_LIMIT),
    emailKey: keys[1],
  }
}

export function checkLoginRateLimit(email: string) {
  return checkRateLimit({ email, type: "login" })
}

export function checkRegisterRateLimit(email: string) {
  return checkRateLimit({ email, type: "register" })
}

export async function clearEmailRateLimit(emailKey: string) {
  await getAuthRedis().del(emailKey)
}

export async function checkPasswordResetRateLimit(email: string) {
  const ipHash = hashIdentifier(await getClientIp())
  const emailHash = hashIdentifier(email)
  const [acquired, retryAfterSeconds, ipCount] = await getAuthRedis().eval<
    [number, number, number, number],
    [number, number, number]
  >(
    PASSWORD_RESET_RATE_LIMIT_SCRIPT,
    [
      authRedisKey.passwordResetRateIp(ipHash),
      authRedisKey.passwordResetCooldown(emailHash),
    ],
    [
      RATE_LIMIT_WINDOW_SECONDS,
      PASSWORD_RESET_IP_LIMIT,
      Date.now(),
      PASSWORD_RESET_COOLDOWN_SECONDS,
    ],
  )

  return {
    limitedByIp: ipCount > PASSWORD_RESET_IP_LIMIT,
    acquired: acquired === 1,
    retryAfterSeconds: Math.max(
      1,
      retryAfterSeconds > 0
        ? retryAfterSeconds
        : PASSWORD_RESET_COOLDOWN_SECONDS,
    ),
  }
}
