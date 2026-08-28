import { randomInt } from "node:crypto"

import type { ContentStatus, PrismaClient } from "@prisma/client"

import { DEFAULT_ARTICLES } from "../../src/modules/article/constants/default-articles"

export async function seedArticle(prisma: PrismaClient) {
  const [users, sections] = await Promise.all([
    prisma.user.findMany({
      where: {
        role: "USER",
        isBanned: false,
        deletedAt: null,
      },
      select: { id: true },
    }),
    prisma.websiteArticleSection.findMany({
      where: {
        deletedAt: null,
        websiteContent: {
          key: "home",
          deletedAt: null,
        },
      },
      select: {
        id: true,
        articleCategorySlug: true,
      },
    }),
  ])

  if (users.length === 0) {
    throw new Error(
      "[article] no active USER account is available; run the account-manage seeder first",
    )
  }

  const sectionsBySlug = new Map(
    sections.map((section) => [section.articleCategorySlug, section]),
  )
  const requiredCategorySlugs = [
    ...new Set(DEFAULT_ARTICLES.map((article) => article.categorySlug)),
  ]
  const missingCategorySlugs = requiredCategorySlugs.filter(
    (slug) => !sectionsBySlug.has(slug),
  )

  if (missingCategorySlugs.length > 0) {
    throw new Error(
      `[article] active WebsiteArticleSection rows are missing for: ${missingCategorySlugs.join(", ")}; run the website-content seeder first`,
    )
  }

  const canonicalSlugs = DEFAULT_ARTICLES.map((article) => article.slug)
  const existingArticles = await prisma.article.findMany({
    where: {
      OR: [
        { slug: { in: canonicalSlugs } },
        { originalSlug: { in: canonicalSlugs } },
      ],
    },
    select: {
      slug: true,
      originalSlug: true,
    },
  })
  const occupiedSlugs = new Set(
    existingArticles.flatMap((article) =>
      [article.slug, article.originalSlug].filter(
        (slug): slug is string => slug !== null,
      ),
    ),
  )
  const missingArticles = DEFAULT_ARTICLES.filter(
    (article) => !occupiedSlugs.has(article.slug),
  )

  if (missingArticles.length === 0) {
    console.log("[article] skipped: all default articles already exist")
    return
  }

  console.log(`[article] creating ${missingArticles.length} default articles`)

  await prisma.$transaction(
    async (transaction) => {
      for (const article of missingArticles) {
        const author = users[randomInt(users.length)]
        const section = sectionsBySlug.get(article.categorySlug)

        if (!author) {
          throw new Error("[article] failed to select a random author")
        }
        if (!section) {
          throw new Error(
            `[article] WebsiteArticleSection ${article.categorySlug} is missing`,
          )
        }

        const status = article.status as ContentStatus
        await transaction.article.create({
          data: {
            authorId: author.id,
            websiteArticleSectionId: section.id,
            slug: article.slug,
            title: article.title,
            excerpt: article.excerpt,
            content: article.content,
            coverImageUrl: article.coverImageUrl,
            readingTime: article.readingTime,
            isFeatured: article.isFeatured,
            status,
            moderationNote:
              status === "TAKEN_DOWN"
                ? "Article diturunkan pada data mock awal."
                : null,
            createdAt: new Date(article.createdAt),
            submittedAt: article.submittedAt
              ? new Date(article.submittedAt)
              : null,
            publishedAt: article.publishedAt
              ? new Date(article.publishedAt)
              : null,
            tags: {
              create: article.tags.map((label, index) => ({
                label,
                position: index + 1,
              })),
            },
          },
        })
      }
    },
    { maxWait: 10_000, timeout: 120_000 },
  )

  console.log(
    `[article] created: ${missingArticles.length}, skipped: ${DEFAULT_ARTICLES.length - missingArticles.length}`,
  )
}
