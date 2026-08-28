"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireRole } from "@/modules/auth/data/session-dal"

import { readAgendaPageEditor } from "../data/get-agenda-page-editor"
import { agendaPageEditorSchema } from "../schemas/agenda-page.schema"
import type {
  AgendaPageEditorData,
  UpdateAgendaPageResult,
} from "../types/agenda-page-editor"

function agendaContentData(data: AgendaPageEditorData) {
  return {
    heroImageUrl: data.hero.imageUrl,
    heroImageAlt: data.hero.imageAlt,
    heroEyebrow: data.hero.eyebrow,
    heroTitle: data.hero.title,
    heroDescription: data.hero.description,
  }
}

export async function updateAgendaPageAction(
  input: unknown,
): Promise<UpdateAgendaPageResult> {
  const actor = await requireRole(["ADMIN", "SUPERADMIN"])

  const parsed = agendaPageEditorSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      message: issue?.message ?? "Data Agenda tidak valid.",
      field: issue?.path.map(String).join("."),
    }
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const existing = await transaction.websiteAgendaContent.findFirst({
        where: { key: "agenda", deletedAt: null },
        select: { id: true },
      })

      if (existing) {
        await transaction.websiteAgendaContent.update({
          where: { id: existing.id },
          data: agendaContentData(parsed.data),
        })
      } else {
        await transaction.websiteAgendaContent.create({
          data: {
            key: parsed.data.key,
            ...agendaContentData(parsed.data),
          },
        })
      }

      await recordActivityLog(
        {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action: "UPDATE",
          module: "WEBSITE",
          description: "Memperbarui konten halaman Agenda publik",
          afterState: { section: "agenda", title: parsed.data.hero.title },
        },
        transaction,
      )
    })

    revalidatePath("/agenda")
    revalidatePath("/dashboard/website")

    return {
      success: true,
      data: await readAgendaPageEditor(),
      message: "Konten Agenda berhasil disimpan.",
    }
  } catch (error) {
    console.error("Failed to update agenda page:", error)
    return {
      success: false,
      message: "Konten Agenda gagal disimpan. Silakan coba lagi.",
    }
  }
}
