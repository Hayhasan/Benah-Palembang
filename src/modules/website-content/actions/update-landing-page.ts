"use server"

import type { Prisma } from "@prisma/client"
import { revalidatePath } from "next/cache"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { getDefaultArticleCategoryPage } from "../constants/default-article-category-pages"
import { readLandingPageEditor } from "../data/get-landing-page-editor"
import { landingPageEditorSchema } from "../schemas/landing-page.schema"
import type {
  LandingPageEditorData,
  UpdateLandingPageResult,
} from "../types/landing-page-editor"

function rootData(data: LandingPageEditorData) {
  return {
    aboutEyebrow: data.about.eyebrow,
    aboutEstablishedText: data.about.establishedText,
    aboutTitle: data.about.title,
    aboutDescription: data.about.description,
    aboutClosingText: data.about.closingText,
    exploreEyebrow: data.explore.eyebrow,
    exploreTitle: data.explore.title,
    teamEyebrow: data.team.eyebrow,
    teamTitle: data.team.title,
    teamDescription: data.team.description,
    ctaEyebrow: data.cta.eyebrow,
    ctaTitle: data.cta.title,
    ctaDescription: data.cta.description,
    ctaButtonLabel: data.cta.buttonLabel,
    ctaButtonUrl: data.cta.buttonUrl,
  }
}

function heroSlideData(
  slide: LandingPageEditorData["heroSlides"][number],
  position: number,
) {
  return {
    imageUrl: slide.imageUrl,
    imageAlt: slide.imageAlt,
    eyebrow: slide.eyebrow,
    title: slide.title,
    description: slide.description,
    buttonLabel: slide.buttonLabel,
    buttonUrl: slide.buttonUrl,
    position,
    isVisible: slide.isVisible,
  }
}

function exploreItemData(
  item: LandingPageEditorData["explore"]["items"][number],
  position: number,
) {
  return {
    label: item.label,
    linkUrl: item.linkUrl,
    storyCount: item.storyCount,
    position,
    isVisible: item.isVisible,
  }
}

function articleSectionData(
  section: LandingPageEditorData["articleSections"][number],
  position: number,
) {
  return {
    sectionKey: section.sectionKey,
    articleCategorySlug: section.articleCategorySlug,
    eyebrow: section.eyebrow,
    title: section.title,
    description: section.description,
    backgroundImageUrl: section.backgroundImageUrl,
    linkLabel: section.linkLabel,
    theme: section.theme,
    layout: section.layout,
    maxItems: section.maxItems,
    position,
    isVisible: section.isVisible,
  }
}

function defaultArticleCategoryHeroData(sectionKey: string) {
  const category = getDefaultArticleCategoryPage(sectionKey)
  if (!category) {
    throw new Error(`Default halaman kategori untuk ${sectionKey} tidak ditemukan.`)
  }

  return {
    categoryHeroImageUrl: category.hero.imageUrl,
    categoryHeroImageAlt: category.hero.imageAlt,
    categoryHeroTitle: category.hero.title,
    categoryHeroDescription: category.hero.description,
  }
}

function teamMemberData(
  member: LandingPageEditorData["team"]["members"][number],
  position: number,
) {
  return {
    name: member.name,
    role: member.role,
    imageUrl: member.imageUrl,
    bio: member.bio,
    position,
    isVisible: member.isVisible,
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

function deletedUniqueValue(value: string, id: number, now: Date) {
  const timestamp = now.toISOString().replace(/\D/g, "").slice(0, 14)
  const suffix = `-deleted-${timestamp}-${id}`
  return `${value.slice(0, 160 - suffix.length)}${suffix}`
}

async function createLandingPage(
  tx: Prisma.TransactionClient,
  data: LandingPageEditorData,
) {
  await tx.websiteContent.create({
    data: {
      key: data.key,
      ...rootData(data),
      heroSlides: {
        create: data.heroSlides.map((slide, index) =>
          heroSlideData(slide, index + 1),
        ),
      },
      exploreItems: {
        create: data.explore.items.map((item, index) =>
          exploreItemData(item, index + 1),
        ),
      },
      articleSections: {
        create: data.articleSections.map((section, index) => ({
          ...articleSectionData(section, index + 1),
          ...defaultArticleCategoryHeroData(section.sectionKey),
        })),
      },
      teamMembers: {
        create: data.team.members.map((member, index) =>
          teamMemberData(member, index + 1),
        ),
      },
    },
  })
}

async function updateLandingPage(
  tx: Prisma.TransactionClient,
  data: LandingPageEditorData,
  existing: {
    id: number
    heroSlides: { id: number }[]
    exploreItems: { id: number }[]
    articleSections: {
      id: number
      sectionKey: string
      articleCategorySlug: string
    }[]
    teamMembers: { id: number }[]
  },
) {
  assertIdsBelongToRoot(
    "Hero slide",
    data.heroSlides.map((slide) => slide.id),
    existing.heroSlides.map((slide) => slide.id),
  )
  assertIdsBelongToRoot(
    "Item jelajahi",
    data.explore.items.map((item) => item.id),
    existing.exploreItems.map((item) => item.id),
  )
  assertIdsBelongToRoot(
    "Section artikel",
    data.articleSections.map((section) => section.id),
    existing.articleSections.map((section) => section.id),
  )
  assertIdsBelongToRoot(
    "Anggota tim",
    data.team.members.map((member) => member.id),
    existing.teamMembers.map((member) => member.id),
  )

  const currentSectionKeys = new Map(
    existing.articleSections.map((section) => [section.id, section.sectionKey]),
  )
  for (const section of data.articleSections) {
    if (
      section.id !== null &&
      currentSectionKeys.get(section.id) !== section.sectionKey
    ) {
      throw new Error("Section key artikel yang sudah tersimpan tidak dapat diubah.")
    }
  }

  const now = new Date()
  const heroIds = data.heroSlides.flatMap((slide) =>
    slide.id === null ? [] : [slide.id],
  )
  const exploreIds = data.explore.items.flatMap((item) =>
    item.id === null ? [] : [item.id],
  )
  const articleSectionIds = data.articleSections.flatMap((section) =>
    section.id === null ? [] : [section.id],
  )
  const teamMemberIds = data.team.members.flatMap((member) =>
    member.id === null ? [] : [member.id],
  )

  await tx.websiteContent.update({
    where: { id: existing.id },
    data: rootData(data),
  })

  await tx.websiteHeroSlide.updateMany({
    where: {
      websiteContentId: existing.id,
      deletedAt: null,
      id: { notIn: heroIds },
    },
    data: { deletedAt: now },
  })
  await tx.websiteExploreItem.updateMany({
    where: {
      websiteContentId: existing.id,
      deletedAt: null,
      id: { notIn: exploreIds },
    },
    data: { deletedAt: now },
  })
  await tx.websiteTeamMember.updateMany({
    where: {
      websiteContentId: existing.id,
      deletedAt: null,
      id: { notIn: teamMemberIds },
    },
    data: { deletedAt: now },
  })

  const omittedArticleSections = existing.articleSections.filter(
    (section) => !articleSectionIds.includes(section.id),
  )
  for (const section of omittedArticleSections) {
    await tx.websiteArticleSection.update({
      where: { id: section.id },
      data: {
        originalSectionKey: section.sectionKey,
        sectionKey: deletedUniqueValue(section.sectionKey, section.id, now),
        originalArticleCategorySlug: section.articleCategorySlug,
        articleCategorySlug: deletedUniqueValue(
          section.articleCategorySlug,
          section.id,
          now,
        ),
        deletedAt: now,
      },
    })
  }

  const currentCategorySlugs = new Map(
    existing.articleSections.map((section) => [
      section.id,
      section.articleCategorySlug,
    ]),
  )
  for (const section of data.articleSections) {
    const currentSlug = section.id
      ? currentCategorySlugs.get(section.id)
      : undefined

    if (section.id !== null && currentSlug !== section.articleCategorySlug) {
      await tx.websiteArticleSection.update({
        where: { id: section.id },
        data: {
          articleCategorySlug: deletedUniqueValue(
            currentSlug ?? section.articleCategorySlug,
            section.id,
            now,
          ),
        },
      })
    }
  }

  for (const [index, slide] of data.heroSlides.entries()) {
    const values = heroSlideData(slide, index + 1)
    if (slide.id === null) {
      await tx.websiteHeroSlide.create({
        data: { websiteContentId: existing.id, ...values },
      })
    } else {
      await tx.websiteHeroSlide.update({ where: { id: slide.id }, data: values })
    }
  }

  for (const [index, item] of data.explore.items.entries()) {
    const values = exploreItemData(item, index + 1)
    if (item.id === null) {
      await tx.websiteExploreItem.create({
        data: { websiteContentId: existing.id, ...values },
      })
    } else {
      await tx.websiteExploreItem.update({ where: { id: item.id }, data: values })
    }
  }

  for (const [index, section] of data.articleSections.entries()) {
    const values = articleSectionData(section, index + 1)
    if (section.id === null) {
      await tx.websiteArticleSection.create({
        data: {
          websiteContentId: existing.id,
          ...values,
          ...defaultArticleCategoryHeroData(section.sectionKey),
        },
      })
    } else {
      await tx.websiteArticleSection.update({
        where: { id: section.id },
        data: values,
      })
    }
  }

  for (const [index, member] of data.team.members.entries()) {
    const values = teamMemberData(member, index + 1)
    if (member.id === null) {
      await tx.websiteTeamMember.create({
        data: { websiteContentId: existing.id, ...values },
      })
    } else {
      await tx.websiteTeamMember.update({
        where: { id: member.id },
        data: values,
      })
    }
  }
}

export async function updateLandingPageAction(
  input: unknown,
): Promise<UpdateLandingPageResult> {
  await requireRole(["ADMIN", "SUPERADMIN"])

  const parsed = landingPageEditorSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      message: issue?.message ?? "Data website tidak valid.",
      field: issue?.path.map(String).join("."),
    }
  }

  try {
    await prisma.$transaction(async (tx) => {
      const existing = await tx.websiteContent.findFirst({
        where: { key: "home", deletedAt: null },
        select: {
          id: true,
          heroSlides: { where: { deletedAt: null }, select: { id: true } },
          exploreItems: { where: { deletedAt: null }, select: { id: true } },
          articleSections: {
            where: { deletedAt: null },
            select: {
              id: true,
              sectionKey: true,
              articleCategorySlug: true,
            },
          },
          teamMembers: { where: { deletedAt: null }, select: { id: true } },
        },
      })

      if (existing) {
        await updateLandingPage(tx, parsed.data, existing)
      } else {
        await createLandingPage(tx, parsed.data)
      }
    })

    revalidatePath("/")
    revalidatePath("/dashboard/website")

    return {
      success: true,
      data: await readLandingPageEditor(),
      message: "Konten Home berhasil disimpan.",
    }
  } catch (error) {
    console.error("Failed to update landing page:", error)
    return {
      success: false,
      message:
        error instanceof Error
          ? error.message
          : "Konten Home gagal disimpan. Silakan coba lagi.",
    }
  }
}
