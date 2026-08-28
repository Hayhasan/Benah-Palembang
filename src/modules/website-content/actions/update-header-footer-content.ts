"use server"

import type { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { readHeaderFooterContentEditor } from "../data/get-header-footer-content-editor"
import { headerFooterContentEditorSchema } from "../schemas/header-footer-content.schema"
import type {
  HeaderFooterContentEditorData,
  UpdateHeaderFooterContentResult,
} from "../types/header-footer-content-editor"

function rootData(data: HeaderFooterContentEditorData) {
  return {
    logoImageUrl: data.logo.imageUrl,
    logoImageAlt: data.logo.imageAlt,
    logoLinkUrl: data.logo.linkUrl,
    footerDescription: data.footer.description,
    exploreDescription: data.footer.exploreDescription,
    contactEmail: data.footer.contactEmail,
    contactPhone: data.footer.contactPhone,
    contactAddress: data.footer.contactAddress,
    copyrightText: data.footer.copyrightText,
    closingText: data.footer.closingText,
  }
}

function footerLinkData(
  link:
    | HeaderFooterContentEditorData["footer"]["exploreLinks"][number]
    | HeaderFooterContentEditorData["footer"]["connectLinks"][number],
  position: number,
) {
  return {
    label: link.label,
    linkUrl: link.linkUrl,
    position,
    isVisible: link.isVisible,
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

async function createHeaderFooterContent(
  tx: Prisma.TransactionClient,
  data: HeaderFooterContentEditorData,
) {
  await tx.websiteHeaderFooterContent.create({
    data: {
      key: data.key,
      ...rootData(data),
      footerExploreLinks: {
        create: data.footer.exploreLinks.map((link, index) =>
          footerLinkData(link, index + 1),
        ),
      },
      footerConnectLinks: {
        create: data.footer.connectLinks.map((link, index) =>
          footerLinkData(link, index + 1),
        ),
      },
    },
  })
}

async function updateHeaderFooterContent(
  tx: Prisma.TransactionClient,
  data: HeaderFooterContentEditorData,
  existing: {
    id: number
    footerExploreLinks: { id: number }[]
    footerConnectLinks: { id: number }[]
  },
) {
  assertIdsBelongToRoot(
    "Link Explore",
    data.footer.exploreLinks.map((link) => link.id),
    existing.footerExploreLinks.map((link) => link.id),
  )
  assertIdsBelongToRoot(
    "Link Connect",
    data.footer.connectLinks.map((link) => link.id),
    existing.footerConnectLinks.map((link) => link.id),
  )

  const exploreLinkIds = data.footer.exploreLinks.flatMap((link) =>
    link.id === null ? [] : [link.id],
  )
  const connectLinkIds = data.footer.connectLinks.flatMap((link) =>
    link.id === null ? [] : [link.id],
  )
  const now = new Date()

  await tx.websiteHeaderFooterContent.update({
    where: { id: existing.id },
    data: rootData(data),
  })

  await tx.websiteFooterExploreLink.updateMany({
    where: {
      headerFooterContentId: existing.id,
      deletedAt: null,
      id: { notIn: exploreLinkIds },
    },
    data: { deletedAt: now },
  })
  await tx.websiteFooterConnectLink.updateMany({
    where: {
      headerFooterContentId: existing.id,
      deletedAt: null,
      id: { notIn: connectLinkIds },
    },
    data: { deletedAt: now },
  })

  for (const [index, link] of data.footer.exploreLinks.entries()) {
    const values = footerLinkData(link, index + 1)
    if (link.id === null) {
      await tx.websiteFooterExploreLink.create({
        data: { headerFooterContentId: existing.id, ...values },
      })
    } else {
      await tx.websiteFooterExploreLink.update({
        where: { id: link.id },
        data: values,
      })
    }
  }

  for (const [index, link] of data.footer.connectLinks.entries()) {
    const values = footerLinkData(link, index + 1)
    if (link.id === null) {
      await tx.websiteFooterConnectLink.create({
        data: { headerFooterContentId: existing.id, ...values },
      })
    } else {
      await tx.websiteFooterConnectLink.update({
        where: { id: link.id },
        data: values,
      })
    }
  }
}

export async function updateHeaderFooterContentAction(
  input: unknown,
): Promise<UpdateHeaderFooterContentResult> {
  await requireRole(["ADMIN", "SUPERADMIN"])

  const parsed = headerFooterContentEditorSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      message: issue?.message ?? "Data Header & Footer tidak valid.",
      field: issue?.path.map(String).join("."),
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.websiteHeaderFooterContent.findFirst({
        where: { key: "header-footer", deletedAt: null },
        select: {
          id: true,
          footerExploreLinks: {
            where: { deletedAt: null },
            select: { id: true },
          },
          footerConnectLinks: {
            where: { deletedAt: null },
            select: { id: true },
          },
        },
      })

      if (existing) {
        await updateHeaderFooterContent(tx, parsed.data, existing)
      } else {
        await createHeaderFooterContent(tx, parsed.data)
      }
    })

    revalidatePath("/", "layout")

    return {
      success: true,
      data: await readHeaderFooterContentEditor(),
      message: "Konten Header & Footer berhasil disimpan.",
    }
  } catch (error) {
    console.error("Failed to update header and footer content:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Konten Header & Footer gagal disimpan. Silakan coba lagi.",
    }
  }
}
