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

const RATE_LIMIT_SCRIPT = `
local first = redis.call("INCR", KEYS[1])
if first == 1 then redis.call("EXPIRE", KEYS[1], ARGV[1]) end
local second = redis.call("INCR", KEYS[2])
if second == 1 then redis.call("EXPIRE", KEYS[2], ARGV[1]) end
return {first, second}
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
