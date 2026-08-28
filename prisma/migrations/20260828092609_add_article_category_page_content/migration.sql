-- Add nullable columns first so existing article sections can be backfilled.
ALTER TABLE "website_article_sections"
ADD COLUMN "originalArticleCategorySlug" VARCHAR(160),
ADD COLUMN "categoryHeroImageUrl" TEXT,
ADD COLUMN "categoryHeroImageAlt" VARCHAR(255),
ADD COLUMN "categoryHeroTitle" VARCHAR(255),
ADD COLUMN "categoryHeroDescription" TEXT;

-- Existing landing presentation is the safest fallback for any historical row.
UPDATE "website_article_sections"
SET
  "articleCategorySlug" = COALESCE("articleCategorySlug", "sectionKey"),
  "categoryHeroImageUrl" = "backgroundImageUrl",
  "categoryHeroImageAlt" = "title",
  "categoryHeroTitle" = "title",
  "categoryHeroDescription" = "description";

-- The first fixed section represents the Cerita Warga category on its own page.
UPDATE "website_article_sections"
SET
  "articleCategorySlug" = 'cerita-warga',
  "categoryHeroImageUrl" = 'https://images.pexels.com/photos/38885810/pexels-photo-38885810.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop',
  "categoryHeroImageAlt" = 'Cerita Warga',
  "categoryHeroTitle" = 'Cerita Warga',
  "categoryHeroDescription" = 'Kisah-kisah nyata dari sudut-sudut Palembang yang jarang terlihat.'
WHERE "sectionKey" = 'featured' AND "deletedAt" IS NULL;

-- Release category slugs that may still be held by historical soft-deleted rows.
UPDATE "website_article_sections"
SET
  "originalArticleCategorySlug" = "articleCategorySlug",
  "articleCategorySlug" = LEFT("articleCategorySlug", 120)
    || '-deleted-'
    || TO_CHAR(COALESCE("deletedAt", CURRENT_TIMESTAMP), 'YYYYMMDDHH24MISS')
    || '-'
    || "id"::TEXT
WHERE "deletedAt" IS NOT NULL;

ALTER TABLE "website_article_sections"
ALTER COLUMN "articleCategorySlug" SET NOT NULL,
ALTER COLUMN "categoryHeroImageUrl" SET NOT NULL,
ALTER COLUMN "categoryHeroImageAlt" SET NOT NULL,
ALTER COLUMN "categoryHeroTitle" SET NOT NULL,
ALTER COLUMN "categoryHeroDescription" SET NOT NULL,
DROP COLUMN "linkUrl";

CREATE UNIQUE INDEX "website_article_sections_content_category_slug_key"
ON "website_article_sections"("websiteContentId", "articleCategorySlug");
