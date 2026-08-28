import "server-only"

import { prisma } from "@/lib/db/prisma"

export const authAccountSelect = {
  id: true,
  name: true,
  email: true,
  password: true,
  role: true,
  avatarUrl: true,
  isBanned: true,
  deletedAt: true,
} as const

export async function findLoginAccount(email: string) {
  const currentAccount = await prisma.user.findUnique({
    where: { email },
    select: authAccountSelect,
  })
  if (currentAccount) return currentAccount

  return prisma.user.findFirst({
    where: {
      originalEmail: email,
      deletedAt: { not: null },
    },
    select: authAccountSelect,
    orderBy: { deletedAt: "desc" },
  })
}
