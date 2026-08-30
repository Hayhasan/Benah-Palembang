"use server"

import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { eventEditorSchema } from "../schemas/event.schema"
import type { EventActionResult } from "../types/owned-event"
import {
  eventContentHasText,
  sanitizeEventContent,
} from "../data/sanitize-event-content"
import { revalidateEventRoutes } from "./revalidate-event-routes"

function slugify(value: string) {
  const slug = value
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")

  return slug || "event"
}

async function createAvailableSlug(
  transaction: Prisma.TransactionClient,
  title: string,
) {
  const baseSlug = slugify(title).slice(0, 170).replace(/-+$/g, "") || "event"

  for (let suffix = 1; suffix <= 100; suffix += 1) {
    const candidate =
      suffix === 1 ? baseSlug : `${baseSlug.slice(0, 175)}-${suffix}`
    const existing = await transaction.event.findUnique({
      where: { slug: candidate },
      select: { id: true },
    })

    if (!existing) return candidate
  }

  throw new Error("Tidak dapat membuat slug Event yang unik.")
}

function parseStartsAt(startsOn: string, startsTime: string) {
  const [year, month, day] = startsOn.split("-").map(Number)
  const calendarDate = new Date(Date.UTC(year, month - 1, day))
  if (
    calendarDate.getUTCFullYear() !== year ||
    calendarDate.getUTCMonth() !== month - 1 ||
    calendarDate.getUTCDate() !== day
  ) {
    return null
  }

  const startsAt = new Date(`${startsOn}T${startsTime}:00+07:00`)
  return Number.isNaN(startsAt.getTime()) ? null : startsAt
}

export async function saveEventAction(
  input: unknown,
): Promise<EventActionResult> {
  const actor = await requireCurrentUser()
  const parsed = eventEditorSchema.safeParse(input)

  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      message: issue?.message ?? "Data Event tidak valid.",
      field: issue?.path.map(String).join("."),
    }
  }

  const data = parsed.data
  const startsAt = parseStartsAt(data.startsOn, data.startsTime)
  if (!startsAt) {
    return {
      success: false,
      message: "Tanggal atau waktu Event tidak valid.",
      field: "startsOn",
    }
  }

  const content = sanitizeEventContent(data.content)
  if (!eventContentHasText(content)) {
    return {
      success: false,
      message: "Detail Event wajib berisi teks.",
      field: "content",
    }
  }

  try {
    const result = await prisma.$transaction(async (transaction) => {
      if (data.id) {
        const currentEvent = await transaction.event.findFirst({
          where: {
            id: data.id,
            ownerId: actor.id,
            deletedAt: null,
          },
          select: { id: true, status: true },
        })

        if (!currentEvent) return { kind: "not-found" as const }
        if (data.intent === "POST" && currentEvent.status !== "DRAFT") {
          return { kind: "invalid-status" as const }
        }

        const now = new Date()
        await transaction.eventTag.updateMany({
          where: { eventId: currentEvent.id, deletedAt: null },
          data: { deletedAt: now },
        })

        const event = await transaction.event.update({
          where: { id: currentEvent.id },
          data: {
            title: data.title,
            description: data.description,
            content,
            bannerUrl: data.bannerUrl,
            category: data.category,
            startsAt,
            endsAt: null,
            location: data.location,
            organizer: data.organizer,
            registrationUrl: data.registrationUrl,
            whatsappUrl: data.whatsappUrl,
            ...(data.intent === "POST"
              ? {
                  status: "PENDING_REVIEW" as const,
                  submittedAt: now,
                }
              : {}),
            tags: {
              create: data.tags.map((label, index) => ({
                label,
                position: index + 1,
              })),
            },
          },
          select: { id: true, title: true, status: true },
        })

        await recordActivityLog(
          {
            userId: actor.id,
            userName: actor.name,
            userRole: actor.role,
            action: "UPDATE",
            module: "EVENT",
            description:
              data.intent === "POST"
                ? `Mengajukan review agenda event '${event.title}'`
                : `Menyimpan perubahan draf agenda event '${event.title}'`,
            beforeState: { status: currentEvent.status },
            afterState: { status: event.status },
          },
          transaction,
        )

        return { kind: "saved" as const, event }
      }

      const slug = await createAvailableSlug(transaction, data.title)
      const event = await transaction.event.create({
        data: {
          ownerId: actor.id,
          slug,
          title: data.title,
          description: data.description,
          content,
          bannerUrl: data.bannerUrl,
          category: data.category,
          startsAt,
          endsAt: null,
          location: data.location,
          organizer: data.organizer,
          registrationUrl: data.registrationUrl,
          whatsappUrl: data.whatsappUrl,
          status: data.intent === "POST" ? "PENDING_REVIEW" : "DRAFT",
          submittedAt: data.intent === "POST" ? new Date() : null,
          tags: {
            create: data.tags.map((label, index) => ({
              label,
              position: index + 1,
            })),
          },
        },
        select: { id: true, title: true, status: true },
      })

      await recordActivityLog(
        {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action: "CREATE",
          module: "EVENT",
          description:
            data.intent === "POST"
              ? `Membuat dan mengajukan review event '${event.title}'`
              : `Membuat draft agenda event '${event.title}'`,
          beforeState: null,
          afterState: { id: event.id, title: event.title, status: event.status },
        },
        transaction,
      )

      return { kind: "saved" as const, event }
    })

    if (result.kind === "not-found") {
      return {
        success: false,
        message: "Event tidak ditemukan atau bukan milik account ini.",
      }
    }

    if (result.kind === "invalid-status") {
      return {
        success: false,
        message: "Hanya Event berstatus Draf yang dapat diposting.",
      }
    }

    revalidateEventRoutes(result.event.id)

    return {
      success: true,
      message:
        data.intent === "POST"
          ? "Event berhasil diajukan untuk review."
          : data.id
            ? "Perubahan Event berhasil disimpan."
            : "Draf Event berhasil dibuat.",
      id: result.event.id,
      status: result.event.status,
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Slug Event sudah digunakan. Silakan ubah judul dan coba lagi.",
        field: "title",
      }
    }

    console.error("Failed to save Event:", error)
    return {
      success: false,
      message: "Event gagal disimpan. Silakan coba lagi.",
    }
  }
}
