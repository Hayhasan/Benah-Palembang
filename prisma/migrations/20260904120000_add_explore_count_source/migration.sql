-- CreateEnum
CREATE TYPE "WebsiteExploreCountSource" AS ENUM (
  'MANUAL',
  'ARTICLE_CATEGORY',
  'EVENT',
  'NONE'
);

-- AlterTable
ALTER TABLE "website_explore_items"
ADD COLUMN "countSource" "WebsiteExploreCountSource" NOT NULL DEFAULT 'MANUAL',
ADD COLUMN "countArticleSectionId" INTEGER,
ADD COLUMN "countLabel" VARCHAR(60);

-- CreateIndex
CREATE INDEX "website_explore_items_countArticleSectionId_idx"
ON "website_explore_items"("countArticleSectionId");

-- AddForeignKey
ALTER TABLE "website_explore_items"
ADD CONSTRAINT "website_explore_items_countArticleSectionId_fkey"
FOREIGN KEY ("countArticleSectionId") REFERENCES "website_article_sections"("id")
ON DELETE SET NULL ON UPDATE CASCADE;

-- Link only untouched legacy explore items to their article section so customized
-- counts entered by an admin keep working as manual values.
UPDATE "website_explore_items" AS item
SET
  "countSource" = 'ARTICLE_CATEGORY'::"WebsiteExploreCountSource",
  "countArticleSectionId" = section."id",
  "countLabel" = 'Stories',
  "storyCount" = NULL
FROM "website_article_sections" AS section
JOIN "website_contents" AS content ON content."id" = section."websiteContentId"
WHERE item."websiteContentId" = section."websiteContentId"
  AND content."key" = 'home'
  AND content."deletedAt" IS NULL
  AND section."deletedAt" IS NULL
  AND item."deletedAt" IS NULL
  AND item."linkUrl" = '/' || section."articleCategorySlug"
  AND item."storyCount" = 10;

-- The Agenda shortcut is no longer injected by the landing page component, so any
-- legacy row pointing at /agenda now counts published Events instead.
UPDATE "website_explore_items" AS item
SET
  "countSource" = 'EVENT'::"WebsiteExploreCountSource",
  "countArticleSectionId" = NULL,
  "countLabel" = 'Agenda',
  "storyCount" = NULL
FROM "website_contents" AS content
WHERE item."websiteContentId" = content."id"
  AND content."key" = 'home'
  AND content."deletedAt" IS NULL
  AND item."deletedAt" IS NULL
  AND item."linkUrl" = '/agenda';

-- Databases seeded before this migration only have the five category shortcuts.
-- Materialize the Agenda card so the landing page keeps rendering six items.
INSERT INTO "website_explore_items" (
  "websiteContentId",
  "label",
  "linkUrl",
  "countSource",
  "countLabel",
  "storyCount",
  "position",
  "isVisible",
  "createdAt",
  "updatedAt"
)
SELECT
  content."id",
  'Agenda Kota',
  '/agenda',
  'EVENT'::"WebsiteExploreCountSource",
  'Agenda',
  NULL,
  COALESCE(
    (
      SELECT MAX(existing."position") + 1
      FROM "website_explore_items" AS existing
      WHERE existing."websiteContentId" = content."id"
        AND existing."deletedAt" IS NULL
    ),
    1
  ),
  TRUE,
  NOW(),
  NOW()
FROM "website_contents" AS content
WHERE content."key" = 'home'
  AND content."deletedAt" IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "website_explore_items" AS agenda
    WHERE agenda."websiteContentId" = content."id"
      AND agenda."deletedAt" IS NULL
      AND agenda."linkUrl" = '/agenda'
  );
