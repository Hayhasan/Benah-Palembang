import "server-only"

import { Redis } from "@upstash/redis"

let redis: Redis | undefined

export function getAuthRedis() {
  if (redis) return redis

  const url = process.env.UPSTASH_REDIS_REST_URL?.trim()
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim()

  if (!url || !token) {
    throw new Error(
      "UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN are required for Auth.",
    )
  }

  redis = new Redis({ url, token })
  return redis
}
