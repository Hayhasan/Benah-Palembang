-- AlterTable
ALTER TABLE "website_article_section_pins" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- RenameIndex
ALTER INDEX "website_article_section_pins_websiteArticleSectionId_position_i" RENAME TO "website_article_section_pins_websiteArticleSectionId_positi_idx";

-- RenameIndex
ALTER INDEX "website_article_section_pins_websiteArticleSectionId_position_k" RENAME TO "website_article_section_pins_websiteArticleSectionId_positi_key";
