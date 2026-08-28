import "server-only"

import { cache } from "react"
import { prisma } from "@/lib/db/prisma"

/**
 * Checks whether the platform already has at least one active user registered.
 * Cached per request/render cycle using React cache().
 */
export const checkHasAnyUser = cache(async (): Promise<boolean> => {
  const count = await prisma.user.count({
    where: {
      deletedAt: null,
    },
  })

  return count > 0
})
