"use server"

import type { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireRole } from "@/modules/auth/data/session-dal"

import { getDefaultArticleCategoryPage } from "../constants/default-article-category-pages"
import { DEFAULT_LANDING_PAGE } from "../constants/default-landing-page"
import { readArticleCategoryPageEditor } from "../data/get-article-category-page-editor"
import { exploreItemPersistenceData } from "../data/website-content.mapper"
import { articleCategoryPagesEditorSchema } from "../schemas/article-category-page.schema"
import type {
  ArticleCategoryPageEditorItem,
  ArticleCategoryPagesEditorData,
  UpdateArticleCategoryPagesResult,
} from "../types/article-category-page-editor"

function categoryHeroData(category: ArticleCategoryPageEditorItem) {
  return {
    categoryHeroImageUrl: category.hero.imageUrl,
    categoryHeroImageAlt: category.hero.imageAlt,
    categoryHeroTitle: category.hero.title,
    categoryHeroDescription: category.hero.description,
  }
}

function defaultArticleSectionData(sectionKey: string) {
  const section = DEFAULT_LANDING_PAGE.articleSections.find(
    (item) => item.sectionKey === sectionKey,
  )
  const category = getDefaultArticleCategoryPage(sectionKey)

  if (!section || !category) {
    throw new Error(`Default kategori artikel ${sectionKey} tidak ditemukan.`)
  }

  return {
    ...section,
    categoryHeroImageUrl: category.hero.imageUrl,
    categoryHeroImageAlt: category.hero.imageAlt,
    categoryHeroTitle: category.hero.title,
    categoryHeroDescription: category.hero.description,
  }
}

async function createDefaultWebsiteContent(
  tx: Prisma.TransactionClient,
  data: ArticleCategoryPagesEditorData,
) {
  const submittedByKey = new Map(
    data.categories.map((category) => [category.sectionKey, category]),
  )

  const content = await tx.websiteContent.create({
    data: {
      key: DEFAULT_LANDING_PAGE.key,
      aboutEyebrow: DEFAULT_LANDING_PAGE.about.eyebrow,
      aboutEstablishedText: DEFAULT_LANDING_PAGE.about.establishedText,
      aboutTitle: DEFAULT_LANDING_PAGE.about.title,
      aboutDescription: DEFAULT_LANDING_PAGE.about.description,
      aboutClosingText: DEFAULT_LANDING_PAGE.about.closingText,
      exploreEyebrow: DEFAULT_LANDING_PAGE.explore.eyebrow,
      exploreTitle: DEFAULT_LANDING_PAGE.explore.title,
      teamEyebrow: DEFAULT_LANDING_PAGE.team.eyebrow,
      teamTitle: DEFAULT_LANDING_PAGE.team.title,
      teamDescription: DEFAULT_LANDING_PAGE.team.description,
      ctaEyebrow: DEFAULT_LANDING_PAGE.cta.eyebrow,
      ctaTitle: DEFAULT_LANDING_PAGE.cta.title,
      ctaDescription: DEFAULT_LANDING_PAGE.cta.description,
      ctaButtonLabel: DEFAULT_LANDING_PAGE.cta.buttonLabel,
      ctaButtonUrl: DEFAULT_LANDING_PAGE.cta.buttonUrl,
      heroSlides: { create: DEFAULT_LANDING_PAGE.heroSlides },
      articleSections: {
        create: DEFAULT_LANDING_PAGE.articleSections.map((section) => {
          const submitted = submittedByKey.get(section.sectionKey)
          return {
            ...defaultArticleSectionData(section.sectionKey),
            ...(submitted ? categoryHeroData(submitted) : {}),
          }
        }),
      },
      teamMembers: { create: DEFAULT_LANDING_PAGE.team.members },
    },
    select: {
      id: true,
      articleSections: { select: { id: true, sectionKey: true } },
    },
  })

  // Explore item default merujuk article section, sehingga baru dapat dibuat
  // setelah section pada aggregate yang sama memiliki ID.
  const sectionIdByKey = new Map(
    content.articleSections.map((section) => [section.sectionKey, section.id]),
  )
  await tx.websiteExploreItem.createMany({
    data: DEFAULT_LANDING_PAGE.explore.items.map((item, index) => ({
      websiteContentId: content.id,
      ...exploreItemPersistenceData(item, index + 1, sectionIdByKey),
    })),
  })
}

async function updateArticleCategoryPages(
  tx: Prisma.TransactionClient,
  data: ArticleCategoryPagesEditorData,
  existing: {
    id: number
    articleSections: { id: number; sectionKey: string }[]
  },
) {
  const existingIds = new Set(existing.articleSections.map((section) => section.id))
  const existingKeysById = new Map(
    existing.articleSections.map((section) => [section.id, section.sectionKey]),
  )

  for (const category of data.categories) {
    if (category.id !== null && !existingIds.has(category.id)) {
      throw new Error(`Kategori artikel dengan ID ${category.id} tidak valid.`)
    }
    if (
      category.id !== null &&
      existingKeysById.get(category.id) !== category.sectionKey
    ) {
      throw new Error("Identitas kategori artikel tidak dapat diubah.")
    }

    if (category.id === null) {
      await tx.websiteArticleSection.create({
        data: {
          websiteContentId: existing.id,
          ...defaultArticleSectionData(category.sectionKey),
          ...categoryHeroData(category),
        },
      })
    } else {
      await tx.websiteArticleSection.update({
        where: { id: category.id },
        data: categoryHeroData(category),
      })
    }
  }
}

export async function updateArticleCategoryPagesAction(
  input: unknown,
): Promise<UpdateArticleCategoryPagesResult> {
  const actor = await requireRole(["ADMIN", "SUPERADMIN"])

  const parsed = articleCategoryPagesEditorSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      message: issue?.message ?? "Data halaman kategori artikel tidak valid.",
      field: issue?.path.map(String).join("."),
    }
  }

  try {
    await prisma.$transaction(async (transaction) => {
      const existing = await transaction.websiteContent.findFirst({
        where: { key: DEFAULT_LANDING_PAGE.key, deletedAt: null },
        select: {
          id: true,
          articleSections: {
            where: { deletedAt: null },
            select: { id: true, sectionKey: true },
          },
        },
      })

      if (existing) {
        await updateArticleCategoryPages(transaction, parsed.data, existing)
      } else {
        await createDefaultWebsiteContent(transaction, parsed.data)
      }

      await recordActivityLog(
        {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action: "UPDATE",
          module: "WEBSITE",
          description: "Memperbarui konten halaman kategori artikel publik",
          afterState: { totalCategories: parsed.data.categories.length },
        },
        transaction,
      )
    })

    revalidatePath("/", "layout")

    return {
      success: true,
      data: await readArticleCategoryPageEditor(),
      message: "Konten halaman kategori Article berhasil disimpan.",
    }
  } catch (error) {
    console.error("Failed to update article category pages:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Konten halaman kategori Article gagal disimpan. Silakan coba lagi.",
    }
  }
}
