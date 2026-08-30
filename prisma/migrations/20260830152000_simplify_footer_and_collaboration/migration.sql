-- Preserve usable destinations for legacy partner content that has no URL.
UPDATE "website_collaboration_partner_contents"
SET "contentUrl" = CASE "platform"
  WHEN 'YOUTUBE' THEN 'https://www.youtube.com'
  WHEN 'INSTAGRAM' THEN 'https://www.instagram.com'
  WHEN 'TIKTOK' THEN 'https://www.tiktok.com'
  WHEN 'FACEBOOK' THEN 'https://www.facebook.com'
  WHEN 'X' THEN 'https://x.com'
END
WHERE BTRIM("contentUrl") = '';

-- AlterTable
ALTER TABLE "website_collaboration_contents"
DROP COLUMN "formDescription",
DROP COLUMN "formTitle",
DROP COLUMN "heroEyebrow";

-- AlterTable
ALTER TABLE "website_collaboration_partner_contents"
DROP COLUMN "aspectRatio",
DROP COLUMN "thumbnailUrl",
DROP COLUMN "title";

-- AlterTable
ALTER TABLE "website_header_footer_contents"
ADD COLUMN "footerBackgroundText" VARCHAR(160) NOT NULL DEFAULT 'PALEMBANG',
DROP COLUMN "closingText",
DROP COLUMN "contactAddress",
DROP COLUMN "contactEmail",
DROP COLUMN "contactPhone",
DROP COLUMN "exploreDescription";

-- DropEnum
DROP TYPE "WebsiteCollaborationAspectRatio";
