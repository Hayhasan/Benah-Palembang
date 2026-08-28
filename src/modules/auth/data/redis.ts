import "server-only"

import { getRedis } from "@/lib/redis/redis"

export function getAuthRedis() {
  return getRedis()
}
