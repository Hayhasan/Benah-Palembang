"use server"

import type { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireRole } from "@/modules/auth/data/session-dal"

import {
  collaborationAspectRatioToDatabase,
  collaborationPlatformToDatabase,
} from "../data/collaboration-content.mapper"
import { readCollaborationPageEditor } from "../data/get-collaboration-page-editor"
import { collaborationPageEditorSchema } from "../schemas/collaboration-page.schema"
import type {
  CollaborationPageEditorData,
  UpdateCollaborationPageResult,
} from "../types/collaboration-page-editor"

function rootData(data: CollaborationPageEditorData) {
  return {
    heroImageUrl: data.hero.imageUrl,
    heroImageAlt: data.hero.imageAlt,
    heroEyebrow: data.hero.eyebrow,
    heroTitle: data.hero.title,
    heroDescription: data.hero.description,
    contactEmail: data.contact.email,
    contactPhone: data.contact.phone,
    emailUrl: data.contact.emailUrl,
    whatsappUrl: data.contact.whatsappUrl,
    formTitle: data.form.title,
    formDescription: data.form.description,
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

function partnerContentData(
  item: CollaborationPageEditorData["partnerContents"][number],
  position: number,
) {
  return {
    platform: collaborationPlatformToDatabase[item.platform],
    title: item.title,
    thumbnailUrl: item.thumbnailUrl,
    contentUrl: item.contentUrl,
    aspectRatio: collaborationAspectRatioToDatabase[item.aspectRatio],
    position,
    isVisible: item.isVisible,
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
      partnerLogos: {
        create: data.partnerLogos.map((logo, index) =>
          partnerLogoData(logo, index + 1),
        ),
      },
      partnerContents: {
        create: data.partnerContents.map((item, index) =>
          partnerContentData(item, index + 1),
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
    partnerLogos: { id: number }[]
    partnerContents: { id: number }[]
  },
) {
  assertIdsBelongToRoot(
    "Logo partner",
    data.partnerLogos.map((logo) => logo.id),
    existing.partnerLogos.map((logo) => logo.id),
  )
  assertIdsBelongToRoot(
    "Konten partner",
    data.partnerContents.map((item) => item.id),
    existing.partnerContents.map((item) => item.id),
  )

  const logoIds = data.partnerLogos.flatMap((logo) =>
    logo.id === null ? [] : [logo.id],
  )
  const contentIds = data.partnerContents.flatMap((item) =>
    item.id === null ? [] : [item.id],
  )
  const now = new Date()

  await tx.websiteCollaborationContent.update({
    where: { id: existing.id },
    data: rootData(data),
  })

  await tx.websiteCollaborationPartnerLogo.updateMany({
    where: {
      collaborationContentId: existing.id,
      deletedAt: null,
      id: { notIn: logoIds },
    },
    data: { deletedAt: now },
  })
  await tx.websiteCollaborationPartnerContent.updateMany({
    where: {
      collaborationContentId: existing.id,
      deletedAt: null,
      id: { notIn: contentIds },
    },
    data: { deletedAt: now },
  })

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

  for (const [index, item] of data.partnerContents.entries()) {
    const values = partnerContentData(item, index + 1)
    if (item.id === null) {
      await tx.websiteCollaborationPartnerContent.create({
        data: { collaborationContentId: existing.id, ...values },
      })
    } else {
      await tx.websiteCollaborationPartnerContent.update({
        where: { id: item.id },
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
          partnerLogos: {
            where: { deletedAt: null },
            select: { id: true },
          },
          partnerContents: {
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
          afterState: { section: "collaboration", title: parsed.data.hero.title },
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
