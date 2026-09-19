"use server"

import type { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireRole } from "@/modules/auth/data/session-dal"

import { collaborationPlatformToDatabase } from "../data/collaboration-content.mapper"
import { readCollaborationPageEditor } from "../data/get-collaboration-page-editor"
import { collaborationPageEditorSchema } from "../schemas/collaboration-page.schema"
import type {
  CollaborationPageEditorData,
  UpdateCollaborationPageResult,
} from "../types/collaboration-page-editor"

function rootData(data: CollaborationPageEditorData) {
  return {
    contactEmail: data.contact.email,
    contactPhone: data.contact.phone,
    emailUrl: data.contact.emailUrl,
    whatsappUrl: data.contact.whatsappUrl,
  }
}

function heroSlideData(
  slide: CollaborationPageEditorData["heroSlides"][number],
  position: number,
) {
  return {
    imageUrl: slide.imageUrl,
    imageAlt: slide.imageAlt,
    title: slide.title,
    description: slide.description,
    position,
    isVisible: slide.isVisible,
  }
}

function partnerLogoData(
  logo: CollaborationPageEditorData["partnerLogos"][number],
  position: number,
) {
  return {
    name: logo.name,
    imageUrl: logo.imageUrl,
    position,
    isVisible: logo.isVisible,
  }
}



function assertIdsBelongToRoot(
  label: string,
  submittedIds: Array<number | null>,
  existingIds: number[],
) {
  const validIds = new Set(existingIds)
  const invalidId = submittedIds.find(
    (id): id is number => id !== null && !validIds.has(id),
  )

  if (invalidId !== undefined) {
    throw new Error(`${label} dengan ID ${invalidId} tidak valid.`)
  }
}

async function createCollaborationPage(
  tx: Prisma.TransactionClient,
  data: CollaborationPageEditorData,
) {
  await tx.websiteCollaborationContent.create({
    data: {
      key: data.key,
      ...rootData(data),
      heroSlides: {
        create: data.heroSlides.map((slide, index) =>
          heroSlideData(slide, index + 1),
        ),
      },
      partnerLogos: {
        create: data.partnerLogos.map((logo, index) =>
          partnerLogoData(logo, index + 1),
        ),
      },
    },
  })
}

async function updateCollaborationPage(
  tx: Prisma.TransactionClient,
  data: CollaborationPageEditorData,
  existing: {
    id: number
    heroSlides: { id: number }[]
    partnerLogos: { id: number }[]
  },
) {
  assertIdsBelongToRoot(
    "Hero Slide",
    data.heroSlides.map((slide) => slide.id),
    existing.heroSlides.map((slide) => slide.id),
  )
  assertIdsBelongToRoot(
    "Logo partner",
    data.partnerLogos.map((logo) => logo.id),
    existing.partnerLogos.map((logo) => logo.id),
  )

  const slideIds = data.heroSlides.flatMap((slide) =>
    slide.id === null ? [] : [slide.id],
  )
  const logoIds = data.partnerLogos.flatMap((logo) =>
    logo.id === null ? [] : [logo.id],
  )
  const now = new Date()

  await tx.websiteCollaborationContent.update({
    where: { id: existing.id },
    data: rootData(data),
  })

  await tx.websiteCollaborationHeroSlide.updateMany({
    where: {
      collaborationContentId: existing.id,
      deletedAt: null,
      id: { notIn: slideIds },
    },
    data: { deletedAt: now },
  })

  await tx.websiteCollaborationPartnerLogo.updateMany({
    where: {
      collaborationContentId: existing.id,
      deletedAt: null,
      id: { notIn: logoIds },
    },
    data: { deletedAt: now },
  })

  for (const [index, slide] of data.heroSlides.entries()) {
    const values = heroSlideData(slide, index + 1)
    if (slide.id === null) {
      await tx.websiteCollaborationHeroSlide.create({
        data: { collaborationContentId: existing.id, ...values },
      })
    } else {
      await tx.websiteCollaborationHeroSlide.update({
        where: { id: slide.id },
        data: values,
      })
    }
  }

  for (const [index, logo] of data.partnerLogos.entries()) {
    const values = partnerLogoData(logo, index + 1)
    if (logo.id === null) {
      await tx.websiteCollaborationPartnerLogo.create({
        data: { collaborationContentId: existing.id, ...values },
      })
    } else {
      await tx.websiteCollaborationPartnerLogo.update({
        where: { id: logo.id },
        data: values,
      })
    }
  }
}

export async function updateCollaborationPageAction(
  input: unknown,
): Promise<UpdateCollaborationPageResult> {
  const actor = await requireRole(["ADMIN", "SUPERADMIN"])

  const parsed = collaborationPageEditorSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      message: issue?.message ?? "Data Collaboration tidak valid.",
      field: issue?.path.map(String).join("."),
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.websiteCollaborationContent.findFirst({
        where: { key: "collaboration", deletedAt: null },
        select: {
          id: true,
          heroSlides: {
            where: { deletedAt: null },
            select: { id: true },
          },
          partnerLogos: {
            where: { deletedAt: null },
            select: { id: true },
          },
        },
      })

      if (existing) {
        await updateCollaborationPage(tx, parsed.data, existing)
      } else {
        await createCollaborationPage(tx, parsed.data)
      }

      await recordActivityLog(
        {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action: "UPDATE",
          module: "WEBSITE",
          description: "Memperbarui konten halaman Kolaborasi publik",
          afterState: { section: "collaboration", title: parsed.data.heroSlides[0]?.title },
        },
        tx,
      )
    })

    revalidatePath("/kolaborasi")
    revalidatePath("/dashboard/website")

    return {
      success: true,
      data: await readCollaborationPageEditor(),
      message: "Konten Collaboration berhasil disimpan.",
    }
  } catch (error) {
    console.error("Failed to update collaboration page:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Konten Collaboration gagal disimpan. Silakan coba lagi.",
    }
  }
}
