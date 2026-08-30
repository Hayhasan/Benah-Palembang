-- Refresh only untouched legacy defaults so customized admin content is kept.
UPDATE "website_header_footer_contents"
SET "footerDescription" = 'Platform editorial yang merekam, merayakan, dan menggerakkan kota Palembang.'
WHERE "footerDescription" = 'Platform editorial yang merekam, merayakan, dan menggerakkan kota.';

UPDATE "website_header_footer_contents"
SET "copyrightText" = '© 2026 Benah Palembang. All rights reserved.'
WHERE "copyrightText" = '© 2025 Benah Palembang';

UPDATE "website_footer_explore_links" AS link
SET "position" = 6
FROM "website_header_footer_contents" AS content
WHERE link."headerFooterContentId" = content."id"
  AND content."key" = 'header-footer'
  AND content."deletedAt" IS NULL
  AND link."deletedAt" IS NULL
  AND link."label" = 'Agenda'
  AND link."linkUrl" = '/agenda'
  AND link."position" = 5;

INSERT INTO "website_footer_explore_links" (
  "headerFooterContentId",
  "label",
  "linkUrl",
  "position",
  "isVisible",
  "createdAt",
  "updatedAt"
)
SELECT
  content."id",
  'Kebudayaan',
  '/kebudayaan',
  5,
  TRUE,
  NOW(),
  NOW()
FROM "website_header_footer_contents" AS content
WHERE content."key" = 'header-footer'
  AND content."deletedAt" IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "website_footer_explore_links" AS link
    WHERE link."headerFooterContentId" = content."id"
      AND link."deletedAt" IS NULL
      AND link."linkUrl" = '/kebudayaan'
  );

INSERT INTO "website_footer_explore_links" (
  "headerFooterContentId",
  "label",
  "linkUrl",
  "position",
  "isVisible",
  "createdAt",
  "updatedAt"
)
SELECT
  content."id",
  'Kolaborasi',
  '/kolaborasi',
  7,
  TRUE,
  NOW(),
  NOW()
FROM "website_header_footer_contents" AS content
WHERE content."key" = 'header-footer'
  AND content."deletedAt" IS NULL
  AND NOT EXISTS (
    SELECT 1
    FROM "website_footer_explore_links" AS link
    WHERE link."headerFooterContentId" = content."id"
      AND link."deletedAt" IS NULL
      AND link."linkUrl" = '/kolaborasi'
  );

UPDATE "website_footer_connect_links" AS link
SET
  "label" = 'Instagram',
  "linkUrl" = 'https://instagram.com/benahpalembang'
FROM "website_header_footer_contents" AS content
WHERE link."headerFooterContentId" = content."id"
  AND content."key" = 'header-footer'
  AND content."deletedAt" IS NULL
  AND link."deletedAt" IS NULL
  AND link."label" = 'Instagram'
  AND link."linkUrl" = '#instagram';

UPDATE "website_footer_connect_links" AS link
SET
  "label" = 'WhatsApp',
  "linkUrl" = 'https://wa.me/628551241878'
FROM "website_header_footer_contents" AS content
WHERE link."headerFooterContentId" = content."id"
  AND content."key" = 'header-footer'
  AND content."deletedAt" IS NULL
  AND link."deletedAt" IS NULL
  AND link."label" = 'TikTok'
  AND link."linkUrl" = '#tiktok';

UPDATE "website_footer_connect_links" AS link
SET "linkUrl" = 'https://youtube.com/@benahpalembang'
FROM "website_header_footer_contents" AS content
WHERE link."headerFooterContentId" = content."id"
  AND content."key" = 'header-footer'
  AND content."deletedAt" IS NULL
  AND link."deletedAt" IS NULL
  AND link."label" = 'YouTube'
  AND link."linkUrl" = '#youtube';

UPDATE "website_footer_connect_links" AS link
SET
  "label" = 'Email',
  "linkUrl" = 'mailto:halo@benahpalembang.id'
FROM "website_header_footer_contents" AS content
WHERE link."headerFooterContentId" = content."id"
  AND content."key" = 'header-footer'
  AND content."deletedAt" IS NULL
  AND link."deletedAt" IS NULL
  AND link."label" = 'LinkedIn'
  AND link."linkUrl" = '#linkedin';
