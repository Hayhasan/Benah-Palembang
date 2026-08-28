import "dotenv/config"

import { PrismaClient } from "@prisma/client"

import { seedAccountManage } from "./seeders/account-manage.seeder"
import { seedArticle } from "./seeders/article.seeder"
import { seedEvent } from "./seeders/event.seeder"
import { seedWebsiteContent } from "./seeders/website-content.seeder"

const prisma = new PrismaClient()

const seeders = {
  "account-manage": seedAccountManage,
  "website-content": seedWebsiteContent,
  event: seedEvent,
  article: seedArticle,
} as const

type SeederName = keyof typeof seeders

function assertEnvironment() {
  if (!process.env.DATABASE_URL) {
    throw new Error("DATABASE_URL is required to run database seeders")
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.ALLOW_PRODUCTION_SEED !== "true"
  ) {
    throw new Error(
      "Production seeding is disabled. Set ALLOW_PRODUCTION_SEED=true to continue.",
    )
  }
}

async function main() {
  assertEnvironment()

  const requestedSeeder = process.argv[2] as SeederName | undefined

  if (requestedSeeder) {
    const seeder = seeders[requestedSeeder]

    if (!seeder) {
      throw new Error(`Unknown seeder: ${requestedSeeder}`)
    }

    await seeder(prisma)
    return
  }

  for (const [name, seeder] of Object.entries(seeders)) {
    console.log(`[seed] running ${name}`)
    await seeder(prisma)
  }
}

main()
  .catch((error: unknown) => {
    console.error("[seed] failed", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
