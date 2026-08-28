-- CreateEnum
CREATE TYPE "WebsiteArticleSectionTheme" AS ENUM ('DEFAULT', 'RED', 'OFF_WHITE', 'DARK');

-- CreateEnum
CREATE TYPE "WebsiteArticleSectionLayout" AS ENUM ('STANDARD', 'FEATURED_FIRST');

-- CreateTable
CREATE TABLE "website_contents" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "originalKey" VARCHAR(100),
    "aboutEyebrow" VARCHAR(160) NOT NULL,
    "aboutEstablishedText" VARCHAR(160) NOT NULL,
    "aboutTitle" VARCHAR(255) NOT NULL,
    "aboutDescription" TEXT NOT NULL,
    "aboutClosingText" VARCHAR(255) NOT NULL,
    "exploreEyebrow" VARCHAR(160) NOT NULL,
    "exploreTitle" VARCHAR(255) NOT NULL,
    "teamEyebrow" VARCHAR(160) NOT NULL,
    "teamTitle" VARCHAR(255) NOT NULL,
    "teamDescription" TEXT NOT NULL,
    "ctaEyebrow" VARCHAR(160) NOT NULL,
    "ctaTitle" VARCHAR(255) NOT NULL,
    "ctaDescription" TEXT NOT NULL,
    "ctaButtonLabel" VARCHAR(100) NOT NULL,
    "ctaButtonUrl" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_hero_slides" (
    "id" SERIAL NOT NULL,
    "websiteContentId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" VARCHAR(255) NOT NULL,
    "eyebrow" VARCHAR(160) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "buttonLabel" VARCHAR(100) NOT NULL,
    "buttonUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_explore_items" (
    "id" SERIAL NOT NULL,
    "websiteContentId" INTEGER NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "storyCount" INTEGER,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_explore_items_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_article_sections" (
    "id" SERIAL NOT NULL,
    "websiteContentId" INTEGER NOT NULL,
    "sectionKey" VARCHAR(160) NOT NULL,
    "originalSectionKey" VARCHAR(160),
    "articleCategorySlug" VARCHAR(160),
    "eyebrow" VARCHAR(160) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "backgroundImageUrl" TEXT NOT NULL,
    "linkLabel" VARCHAR(100) NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "theme" "WebsiteArticleSectionTheme" NOT NULL DEFAULT 'DEFAULT',
    "layout" "WebsiteArticleSectionLayout" NOT NULL DEFAULT 'STANDARD',
    "maxItems" INTEGER NOT NULL DEFAULT 4,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_article_sections_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_team_members" (
    "id" SERIAL NOT NULL,
    "websiteContentId" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "role" VARCHAR(160) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "bio" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_team_members_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "website_contents_key_key" ON "website_contents"("key");

-- CreateIndex
CREATE INDEX "website_contents_deletedAt_idx" ON "website_contents"("deletedAt");

-- CreateIndex
CREATE INDEX "website_hero_slides_websiteContentId_deletedAt_position_idx" ON "website_hero_slides"("websiteContentId", "deletedAt", "position");

-- CreateIndex
CREATE INDEX "website_explore_items_websiteContentId_deletedAt_position_idx" ON "website_explore_items"("websiteContentId", "deletedAt", "position");

-- CreateIndex
CREATE INDEX "website_article_sections_websiteContentId_deletedAt_positio_idx" ON "website_article_sections"("websiteContentId", "deletedAt", "position");

-- CreateIndex
CREATE UNIQUE INDEX "website_article_sections_websiteContentId_sectionKey_key" ON "website_article_sections"("websiteContentId", "sectionKey");

-- CreateIndex
CREATE INDEX "website_team_members_websiteContentId_deletedAt_position_idx" ON "website_team_members"("websiteContentId", "deletedAt", "position");

-- AddForeignKey
ALTER TABLE "website_hero_slides" ADD CONSTRAINT "website_hero_slides_websiteContentId_fkey" FOREIGN KEY ("websiteContentId") REFERENCES "website_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_explore_items" ADD CONSTRAINT "website_explore_items_websiteContentId_fkey" FOREIGN KEY ("websiteContentId") REFERENCES "website_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_article_sections" ADD CONSTRAINT "website_article_sections_websiteContentId_fkey" FOREIGN KEY ("websiteContentId") REFERENCES "website_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_team_members" ADD CONSTRAINT "website_team_members_websiteContentId_fkey" FOREIGN KEY ("websiteContentId") REFERENCES "website_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
