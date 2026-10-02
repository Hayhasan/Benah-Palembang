import "dotenv/config"

import { PrismaClient } from "@prisma/client"

import { seedAccountManage } from "./seeders/account-manage.seeder"
import { seedArticle } from "./seeders/article.seeder"
import { seedEvent } from "./seeders/event.seeder"
import { seedWebsiteContent } from "./seeders/website-content.seeder"

const prisma = new PrismaClient()

/**
 * Seeder wajib: dijalankan saat `npm run seed` (tanpa argumen).
 * Hanya mengisi data minimum agar website bisa berfungsi:
 *   - website-content  : konten landing page, header/footer, kolaborasi, agenda
 *   - account-manage   : akun admin & superadmin default
 *
 * Seeder opsional (data dummy / development only):
 *   npm run seed:article  → isi artikel dummy
 *   npm run seed:event    → isi event dummy
 */
const requiredSeeders = {
  "account-manage": seedAccountManage,
  "website-content": seedWebsiteContent,
} as const

/** Semua seeder yang bisa dipanggil secara eksplisit via argumen CLI. */
const allSeeders = {
  ...requiredSeeders,
  event: seedEvent,
  article: seedArticle,
} as const

type SeederName = keyof typeof allSeeders

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
    const seeder = allSeeders[requestedSeeder]

    if (!seeder) {
      throw new Error(
        `Unknown seeder: "${requestedSeeder}". Available: ${Object.keys(allSeeders).join(", ")}`,
      )
    }

    console.log(`[seed] running ${requestedSeeder}`)
    await seeder(prisma)
    return
  }

  // Tanpa argumen: hanya jalankan seeder wajib (konten default, tanpa dummy data)
  for (const [name, seeder] of Object.entries(requiredSeeders)) {
    console.log(`[seed] running ${name}`)
    await seeder(prisma)
  }

  console.log("[seed] done — database ready with default content only")
  console.log("[seed] tip: run 'npm run seed:article' or 'npm run seed:event' to add dummy data")
}

main()
  .catch((error: unknown) => {
    console.error("[seed] failed", error)
    process.exitCode = 1
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
