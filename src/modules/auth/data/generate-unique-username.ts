import "server-only"

import type { Prisma, PrismaClient } from "@prisma/client"

import {
  USERNAME_MAX_LENGTH,
  usernameFromName,
} from "../schemas/username.schema"

type UsernameDatabase = PrismaClient | Prisma.TransactionClient

export async function generateUniqueUsername(
  database: UsernameDatabase,
  name: string,
) {
  const base = usernameFromName(name)
  let candidate = base
  let suffixNumber = 2

  while (
    await database.user.findUnique({
      where: { username: candidate },
      select: { id: true },
    })
  ) {
    const suffix = `_${suffixNumber}`
    candidate = `${base.slice(0, USERNAME_MAX_LENGTH - suffix.length)}${suffix}`
    suffixNumber += 1
  }

  return candidate
}
