/*
  Warnings:

  - You are about to drop the column `heroDescription` on the `website_collaboration_contents` table. All the data in the column will be lost.
  - You are about to drop the column `heroImageAlt` on the `website_collaboration_contents` table. All the data in the column will be lost.
  - You are about to drop the column `heroImageUrl` on the `website_collaboration_contents` table. All the data in the column will be lost.
  - You are about to drop the column `heroTitle` on the `website_collaboration_contents` table. All the data in the column will be lost.
  - You are about to drop the column `footerBackgroundText` on the `website_header_footer_contents` table. All the data in the column will be lost.
  - You are about to drop the column `logoImageAlt` on the `website_header_footer_contents` table. All the data in the column will be lost.
  - You are about to drop the column `logoLinkUrl` on the `website_header_footer_contents` table. All the data in the column will be lost.
  - You are about to drop the `article_comments` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `article_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `event_likes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `website_footer_explore_links` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_comments" DROP CONSTRAINT "article_comments_userId_fkey";

-- DropForeignKey
ALTER TABLE "article_likes" DROP CONSTRAINT "article_likes_articleId_fkey";

-- DropForeignKey
ALTER TABLE "article_likes" DROP CONSTRAINT "article_likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "event_likes" DROP CONSTRAINT "event_likes_eventId_fkey";

-- DropForeignKey
ALTER TABLE "event_likes" DROP CONSTRAINT "event_likes_userId_fkey";

-- DropForeignKey
ALTER TABLE "website_footer_explore_links" DROP CONSTRAINT "website_footer_explore_links_headerFooterContentId_fkey";

-- AlterTable
ALTER TABLE "articles" ADD COLUMN     "additionalBannerUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "additionalPhotographers" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "label" VARCHAR(160);

-- AlterTable
ALTER TABLE "events" ADD COLUMN     "additionalBannerUrls" TEXT[] DEFAULT ARRAY[]::TEXT[],
ADD COLUMN     "photographer" VARCHAR(255);

-- AlterTable
ALTER TABLE "website_collaboration_contents" DROP COLUMN "heroDescription",
DROP COLUMN "heroImageAlt",
DROP COLUMN "heroImageUrl",
DROP COLUMN "heroTitle";

-- AlterTable
ALTER TABLE "website_collaboration_partner_contents" ADD COLUMN     "title" VARCHAR(255);

-- AlterTable
ALTER TABLE "website_header_footer_contents" DROP COLUMN "footerBackgroundText",
DROP COLUMN "logoImageAlt",
DROP COLUMN "logoLinkUrl",
ADD COLUMN     "footerBgColor" VARCHAR(9) NOT NULL DEFAULT '#000000',
ADD COLUMN     "footerCreatorText" TEXT NOT NULL DEFAULT 'The content for Benah Palembang was created by the people of Palembang for the people of Palembang.',
ADD COLUMN     "footerLogoImageAlt" VARCHAR(255),
ADD COLUMN     "footerLogoImageUrl" TEXT,
ADD COLUMN     "footerTextColor" VARCHAR(9) NOT NULL DEFAULT '#ffffff',
ADD COLUMN     "footerTitle" VARCHAR(255),
ADD COLUMN     "headerBgColor" VARCHAR(9) NOT NULL DEFAULT '#ffffff',
ADD COLUMN     "headerButtonColor" VARCHAR(9) NOT NULL DEFAULT '#000000',
ADD COLUMN     "headerTextColor" VARCHAR(9) NOT NULL DEFAULT '#000000';

-- DropTable
DROP TABLE "article_comments";

-- DropTable
DROP TABLE "article_likes";

-- DropTable
DROP TABLE "event_likes";

-- DropTable
DROP TABLE "website_footer_explore_links";

-- CreateTable
CREATE TABLE "website_article_section_hero_slides" (
    "id" SERIAL NOT NULL,
    "websiteArticleSectionId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" VARCHAR(255) NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "photographerName" VARCHAR(160),
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_article_section_hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_collaboration_hero_slides" (
    "id" SERIAL NOT NULL,
    "collaborationContentId" INTEGER NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "imageAlt" VARCHAR(255) NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_collaboration_hero_slides_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_visits" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,

    CONSTRAINT "daily_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "hourly_visits" (
    "id" SERIAL NOT NULL,
    "date" DATE NOT NULL,
    "hour" SMALLINT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "hourly_visits_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_daily_views" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "article_daily_views_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_daily_views" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "date" DATE NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,

    CONSTRAINT "event_daily_views_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "website_article_section_hero_slides_websiteArticleSectionId_idx" ON "website_article_section_hero_slides"("websiteArticleSectionId", "deletedAt", "position");

-- CreateIndex
CREATE INDEX "website_collaboration_hero_slides_collaborationContentId_de_idx" ON "website_collaboration_hero_slides"("collaborationContentId", "deletedAt", "position");

-- CreateIndex
CREATE UNIQUE INDEX "daily_visits_date_key" ON "daily_visits"("date");

-- CreateIndex
CREATE INDEX "hourly_visits_date_idx" ON "hourly_visits"("date");

-- CreateIndex
CREATE UNIQUE INDEX "hourly_visits_date_hour_key" ON "hourly_visits"("date", "hour");

-- CreateIndex
CREATE INDEX "article_daily_views_date_idx" ON "article_daily_views"("date");

-- CreateIndex
CREATE UNIQUE INDEX "article_daily_views_articleId_date_key" ON "article_daily_views"("articleId", "date");

-- CreateIndex
CREATE INDEX "event_daily_views_date_idx" ON "event_daily_views"("date");

-- CreateIndex
CREATE UNIQUE INDEX "event_daily_views_eventId_date_key" ON "event_daily_views"("eventId", "date");

-- AddForeignKey
ALTER TABLE "website_article_section_hero_slides" ADD CONSTRAINT "website_article_section_hero_slides_websiteArticleSectionI_fkey" FOREIGN KEY ("websiteArticleSectionId") REFERENCES "website_article_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_collaboration_hero_slides" ADD CONSTRAINT "website_collaboration_hero_slides_collaborationContentId_fkey" FOREIGN KEY ("collaborationContentId") REFERENCES "website_collaboration_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_daily_views" ADD CONSTRAINT "article_daily_views_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_daily_views" ADD CONSTRAINT "event_daily_views_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE CASCADE ON UPDATE CASCADE;
