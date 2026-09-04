import "server-only"

import { getRedis } from "@/lib/redis/redis"

export async function checkRedis(): Promise<string> {
  const response = await getRedis().ping()

  if (typeof response !== "string" || response.toUpperCase() !== "PONG") {
    throw new Error("Redis tidak membalas PONG.")
  }

  return response
}
