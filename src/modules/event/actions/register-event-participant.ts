"use server"

import { revalidatePath } from "next/cache"
import { cookies, headers } from "next/headers"

import { prisma } from "@/lib/db/prisma"
import { DEVICE_ID_COOKIE_NAME } from "@/lib/views/view-tracker"
import { getCurrentUser } from "@/modules/auth/data/session-dal"

import { registerEventParticipantSchema } from "../schemas/event-participant.schema"

export interface RegisterEventParticipantResult {
  success: boolean
  message: string
  isNew?: boolean
  participantsCount?: number
}

async function resolveParticipantIdentifier(userId?: string | null): Promise<{
  identifier: string
  deviceId: string | null
}> {
  if (userId) {
    return { identifier: `user:${userId}`, deviceId: null }
  }

  try {
    const cookieStore = await cookies()
    const cookieDeviceId = cookieStore.get(DEVICE_ID_COOKIE_NAME)?.value
    if (cookieDeviceId) {
      return { identifier: `device:${cookieDeviceId}`, deviceId: cookieDeviceId }
    }

    const headerList = await headers()
    const headerDeviceId = headerList.get("x-device-id")
    if (headerDeviceId) {
      return { identifier: `device:${headerDeviceId}`, deviceId: headerDeviceId }
    }
  } catch {
    // If running in isolated context
  }

  const fallbackId = crypto.randomUUID()
  return { identifier: `device:${fallbackId}`, deviceId: fallbackId }
}

export async function registerEventParticipantAction(
  input: unknown,
): Promise<RegisterEventParticipantResult> {
  const parsed = registerEventParticipantSchema.safeParse(input)

  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "ID Event tidak valid.",
    }
  }

  const { eventId } = parsed.data
  const actor = await getCurrentUser()
  const { identifier, deviceId } = await resolveParticipantIdentifier(actor?.id)

  try {
    const event = await prisma.event.findFirst({
      where: {
        id: eventId,
        status: "PUBLISHED",
        deletedAt: null,
      },
      select: { id: true },
    })

    if (!event) {
      return {
        success: false,
        message: "Event tidak ditemukan atau belum dipublikasikan.",
      }
    }

    const existing = await prisma.eventParticipant.findUnique({
      where: {
        eventId_identifier: {
          eventId: event.id,
          identifier,
        },
      },
    })

    let isNew = false
    if (!existing) {
      await prisma.eventParticipant.create({
        data: {
          eventId: event.id,
          userId: actor?.id ?? null,
          deviceId: actor ? null : deviceId,
          identifier,
        },
      })
      isNew = true
    }

    const participantsCount = await prisma.eventParticipant.count({
      where: {
        eventId: event.id,
        deletedAt: null,
      },
    })

    if (isNew) {
      revalidatePath(`/agenda/${event.id}`)
      revalidatePath("/dashboard/content")
      revalidatePath("/dashboard/create-event")
    }

    return {
      success: true,
      message: isNew
        ? "Berhasil mendaftar acara."
        : "Anda sudah terdaftar untuk acara ini.",
      isNew,
      participantsCount,
    }
  } catch (error) {
    console.error("Failed to register event participant:", error)
    return {
      success: false,
      message: "Terjadi kesalahan saat memproses pendaftaran acara.",
    }
  }
}
