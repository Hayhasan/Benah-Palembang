"use server"

import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"

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
  // TODO(auth): Require an authenticated admin/superadmin server session here.
  // The current AuthContext is client-only and cannot secure this mutation.
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
    })

    revalidatePath("/agenda")

    return {
      success: true,
      data: await readAgendaPageEditor(),
      message: "Konten Agenda berhasil disimpan.",
    }
  } catch (error) {
    console.error("Failed to update agenda page:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Konten Agenda gagal disimpan. Silakan coba lagi.",
    }
  }
}
