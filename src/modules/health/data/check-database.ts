import "server-only"

import { prisma } from "@/lib/db/prisma"

/**
 * Query nyata ke table `users` sekaligus menjadi keep-alive Supabase free tier
 * yang mem-pause project setelah tujuh hari tanpa aktivitas database.
 */
export async function checkDatabase(): Promise<string> {
  const total = await prisma.user.count()
  return `user count: ${total}`
}
