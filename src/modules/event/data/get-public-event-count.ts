import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

export async function getPublicEventCount() {
  await connection()

  return prisma.event.count({
    where: {
      status: "PUBLISHED",
      deletedAt: null,
    },
  })
}
