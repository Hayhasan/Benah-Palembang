-- Store the four explicitly selected homepage articles for every article section.
CREATE TABLE "website_article_section_pins" (
    "id" SERIAL NOT NULL,
    "websiteArticleSectionId" INTEGER NOT NULL,
    "articleId" INTEGER NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "website_article_section_pins_pkey" PRIMARY KEY ("id"),
    CONSTRAINT "website_article_section_pins_position_check" CHECK ("position" BETWEEN 1 AND 4)
);

-- Preserve the current homepage result as the initial pin selection.
INSERT INTO "website_article_section_pins" (
    "websiteArticleSectionId",
    "articleId",
    "position"
)
SELECT
    ranked."websiteArticleSectionId",
    ranked."id",
    ranked."position"
FROM (
    SELECT
        article."id",
        article."websiteArticleSectionId",
        ROW_NUMBER() OVER (
            PARTITION BY article."websiteArticleSectionId"
            ORDER BY article."isFeatured" DESC, article."publishedAt" DESC, article."id" DESC
        ) AS "position"
    FROM "articles" AS article
    INNER JOIN "website_article_sections" AS section
        ON section."id" = article."websiteArticleSectionId"
    INNER JOIN "website_contents" AS content
        ON content."id" = section."websiteContentId"
    WHERE article."status" = 'PUBLISHED'
      AND article."publishedAt" IS NOT NULL
      AND article."deletedAt" IS NULL
      AND section."deletedAt" IS NULL
      AND section."isVisible" = TRUE
      AND content."key" = 'home'
      AND content."deletedAt" IS NULL
) AS ranked
WHERE ranked."position" <= 4;

CREATE UNIQUE INDEX "website_article_section_pins_articleId_key"
ON "website_article_section_pins"("articleId");

CREATE UNIQUE INDEX "website_article_section_pins_websiteArticleSectionId_position_key"
ON "website_article_section_pins"("websiteArticleSectionId", "position");

CREATE INDEX "website_article_section_pins_websiteArticleSectionId_position_idx"
ON "website_article_section_pins"("websiteArticleSectionId", "position");

ALTER TABLE "website_article_section_pins"
ADD CONSTRAINT "website_article_section_pins_websiteArticleSectionId_fkey"
FOREIGN KEY ("websiteArticleSectionId") REFERENCES "website_article_sections"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;

ALTER TABLE "website_article_section_pins"
ADD CONSTRAINT "website_article_section_pins_articleId_fkey"
FOREIGN KEY ("articleId") REFERENCES "articles"("id")
ON DELETE RESTRICT ON UPDATE CASCADE;
