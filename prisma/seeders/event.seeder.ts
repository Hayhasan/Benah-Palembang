import { randomInt } from "node:crypto"

import type { ContentStatus, PrismaClient } from "@prisma/client"

import { DEFAULT_EVENTS } from "../../src/modules/event/constants/default-events"

const DAY_IN_MS = 24 * 60 * 60 * 1000

function lifecycleDates(startsAt: Date, status: ContentStatus) {
  const createdAt = new Date(startsAt.getTime() - 45 * DAY_IN_MS)

  if (status === "DRAFT") {
    return {
      createdAt,
      submittedAt: null,
      publishedAt: null,
    }
  }

  const submittedAt = new Date(createdAt.getTime() + DAY_IN_MS)

  if (status === "PENDING_REVIEW") {
    return {
      createdAt,
      submittedAt,
      publishedAt: null,
    }
  }

  if (status === "REJECTED") {
    return {
      createdAt,
      submittedAt,
      publishedAt: null,
    }
  }

  return {
    createdAt,
    submittedAt,
    publishedAt: new Date(createdAt.getTime() + 2 * DAY_IN_MS),
  }
}

export async function seedEvent(prisma: PrismaClient) {
  const users = await prisma.user.findMany({
    where: {
      role: "USER",
      isBanned: false,
      deletedAt: null,
    },
    select: { id: true },
  })

  if (users.length === 0) {
    throw new Error(
      "[event] no active USER account is available; run the account-manage seeder first",
    )
  }

  const canonicalSlugs = DEFAULT_EVENTS.map((event) => event.slug)
  const existingEvents = await prisma.event.findMany({
    where: {
      OR: [
        { slug: { in: canonicalSlugs } },
        { originalSlug: { in: canonicalSlugs } },
      ],
    },
    select: {
      slug: true,
      originalSlug: true,
    },
  })
  const occupiedSlugs = new Set(
    existingEvents.flatMap((event) =>
      [event.slug, event.originalSlug].filter(
        (slug): slug is string => slug !== null,
      ),
    ),
  )
  const missingEvents = DEFAULT_EVENTS.filter(
    (event) => !occupiedSlugs.has(event.slug),
  )

  if (missingEvents.length === 0) {
    console.log("[event] skipped: all default events already exist")
    return
  }

  console.log(`[event] creating ${missingEvents.length} default events`)

  await prisma.$transaction(
    async (transaction) => {
      for (const event of missingEvents) {
        const owner = users[randomInt(users.length)]
        if (!owner) throw new Error("[event] failed to select a random owner")

        const startsAt = new Date(event.startsAt)
        const endsAt = event.endsAt ? new Date(event.endsAt) : null
        const status = event.status as ContentStatus
        const lifecycle = lifecycleDates(startsAt, status)

        await transaction.event.create({
          data: {
            ownerId: owner.id,
            slug: event.slug,
            title: event.title,
            description: event.description,
            content: event.content,
            bannerUrl: event.bannerUrl,
            category: event.category,
            startsAt,
            endsAt,
            location: event.location,
            organizer: event.organizer,
            registrationUrl: event.registrationUrl,
            whatsappUrl: event.whatsappUrl,
            status,
            moderationNote:
              status === "TAKEN_DOWN"
                ? "Event diturunkan pada data mock awal."
                : null,
            ...lifecycle,
            tags: {
              create: event.tags.map((label, index) => ({
                label,
                position: index + 1,
              })),
            },
          },
        })
      }
    },
    { maxWait: 10_000, timeout: 60_000 },
  )

  console.log(
    `[event] created: ${missingEvents.length}, skipped: ${DEFAULT_EVENTS.length - missingEvents.length}`,
  )
}
