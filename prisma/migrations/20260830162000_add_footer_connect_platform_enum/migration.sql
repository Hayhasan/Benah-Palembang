-- CreateEnum
CREATE TYPE "WebsiteFooterConnectPlatform" AS ENUM (
  'INSTAGRAM',
  'WHATSAPP',
  'YOUTUBE',
  'TIKTOK',
  'LINKEDIN',
  'X',
  'FACEBOOK',
  'MAIL',
  'WEBSITE'
);

-- AlterTable
ALTER TABLE "website_footer_connect_links"
ADD COLUMN "platform" "WebsiteFooterConnectPlatform" NOT NULL DEFAULT 'WEBSITE';

-- Preserve existing Connect labels as a typed platform.
UPDATE "website_footer_connect_links"
SET "platform" = CASE
  WHEN LOWER("label") = 'instagram' THEN 'INSTAGRAM'::"WebsiteFooterConnectPlatform"
  WHEN LOWER("label") IN ('whatsapp', 'wa') THEN 'WHATSAPP'::"WebsiteFooterConnectPlatform"
  WHEN LOWER("label") IN ('youtube', 'you tube') THEN 'YOUTUBE'::"WebsiteFooterConnectPlatform"
  WHEN LOWER("label") IN ('tiktok', 'tik tok') THEN 'TIKTOK'::"WebsiteFooterConnectPlatform"
  WHEN LOWER("label") IN ('linkedin', 'linked in') THEN 'LINKEDIN'::"WebsiteFooterConnectPlatform"
  WHEN LOWER("label") IN ('x', 'x (twitter)', 'twitter') THEN 'X'::"WebsiteFooterConnectPlatform"
  WHEN LOWER("label") = 'facebook' THEN 'FACEBOOK'::"WebsiteFooterConnectPlatform"
  WHEN LOWER("label") IN ('email', 'mail') THEN 'MAIL'::"WebsiteFooterConnectPlatform"
  ELSE 'WEBSITE'::"WebsiteFooterConnectPlatform"
END;

ALTER TABLE "website_footer_connect_links"
DROP COLUMN "label";
