"use server"

import { Prisma } from "@prisma/client"
import type { ContentStatus } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { RESUBMITTABLE_EVENT_STATUSES } from "../constants/event-status"
import { eventEditorSchema } from "../schemas/event.schema"
import type { EventActionResult } from "../types/owned-event"
import { buildEventChangeSummary } from "../data/event-change-summary"
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

/**
 * Event `PUBLISHED` dapat disunting tanpa review ulang, sehingga deskripsi log
 * dibedakan agar admin langsung mengenali suntingan pada konten yang tayang.
 */
function editDescription(
  title: string,
  previousStatus: ContentStatus,
  intent: "SAVE" | "POST",
) {
  if (intent === "POST") return `Mengajukan review event '${title}'`
  if (previousStatus === "PUBLISHED") return `Menyunting event tayang '${title}'`
  return `Menyimpan perubahan event '${title}'`
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
          select: {
            id: true,
            status: true,
            title: true,
            description: true,
            content: true,
            bannerUrl: true,
            category: true,
            startsAt: true,
            location: true,
            organizer: true,
            registrationUrl: true,
            whatsappUrl: true,
            tags: {
              where: { deletedAt: null },
              orderBy: { position: "asc" },
              select: { label: true },
            },
          },
        })

        if (!currentEvent) return { kind: "not-found" as const }
        if (
          data.intent === "POST" &&
          !RESUBMITTABLE_EVENT_STATUSES.includes(currentEvent.status)
        ) {
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
                  moderationNote: null,
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

        const changes = buildEventChangeSummary(
          {
            title: currentEvent.title,
            description: currentEvent.description,
            content: currentEvent.content,
            bannerUrl: currentEvent.bannerUrl,
            category: currentEvent.category,
            startsAt: currentEvent.startsAt,
            location: currentEvent.location,
            organizer: currentEvent.organizer,
            registrationUrl: currentEvent.registrationUrl,
            whatsappUrl: currentEvent.whatsappUrl,
            tags: currentEvent.tags.map((tag) => tag.label),
          },
          {
            title: data.title,
            description: data.description,
            content,
            bannerUrl: data.bannerUrl,
            category: data.category,
            startsAt,
            location: data.location,
            organizer: data.organizer,
            registrationUrl: data.registrationUrl,
            whatsappUrl: data.whatsappUrl,
            tags: data.tags,
          },
        )

        await recordActivityLog(
          {
            userId: actor.id,
            userName: actor.name,
            userRole: actor.role,
            action: "UPDATE",
            module: "EVENT",
            description: editDescription(
              event.title,
              currentEvent.status,
              data.intent,
            ),
            beforeState: {
              status: currentEvent.status,
              ...changes.before,
            },
            afterState: {
              status: event.status,
              changedFields: changes.changedFields,
              ...changes.after,
            },
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
        message:
          "Hanya Event berstatus Draf atau Rejected yang dapat diposting.",
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
