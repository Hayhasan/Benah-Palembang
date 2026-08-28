-- CreateEnum
CREATE TYPE "WebsiteCollaborationPlatform" AS ENUM ('YOUTUBE', 'INSTAGRAM', 'TIKTOK', 'FACEBOOK', 'X');

-- CreateEnum
CREATE TYPE "WebsiteCollaborationAspectRatio" AS ENUM ('PORTRAIT_9_16', 'PORTRAIT_4_5', 'LANDSCAPE_16_9', 'SQUARE_1_1');

-- CreateTable
CREATE TABLE "website_collaboration_contents" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "originalKey" VARCHAR(100),
    "heroImageUrl" TEXT NOT NULL,
    "heroImageAlt" VARCHAR(255) NOT NULL,
    "heroEyebrow" VARCHAR(160) NOT NULL,
    "heroTitle" VARCHAR(255) NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "contactEmail" VARCHAR(255) NOT NULL,
    "contactPhone" VARCHAR(50) NOT NULL,
    "emailUrl" TEXT NOT NULL,
    "whatsappUrl" TEXT NOT NULL,
    "formTitle" VARCHAR(255) NOT NULL,
    "formDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_collaboration_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_collaboration_partner_logos" (
    "id" SERIAL NOT NULL,
    "collaborationContentId" INTEGER NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "imageUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_collaboration_partner_logos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_collaboration_partner_contents" (
    "id" SERIAL NOT NULL,
    "collaborationContentId" INTEGER NOT NULL,
    "platform" "WebsiteCollaborationPlatform" NOT NULL,
    "title" VARCHAR(255) NOT NULL,
    "thumbnailUrl" TEXT NOT NULL,
    "contentUrl" TEXT NOT NULL,
    "aspectRatio" "WebsiteCollaborationAspectRatio" NOT NULL,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_collaboration_partner_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "website_collaboration_contents_key_key" ON "website_collaboration_contents"("key");

-- CreateIndex
CREATE INDEX "website_collaboration_contents_deletedAt_idx" ON "website_collaboration_contents"("deletedAt");

-- CreateIndex
CREATE INDEX "website_collaboration_partner_logos_collaborationContentId__idx" ON "website_collaboration_partner_logos"("collaborationContentId", "deletedAt", "position");

-- CreateIndex
CREATE INDEX "website_collaboration_partner_contents_collaborationContent_idx" ON "website_collaboration_partner_contents"("collaborationContentId", "deletedAt", "position");

-- AddForeignKey
ALTER TABLE "website_collaboration_partner_logos" ADD CONSTRAINT "website_collaboration_partner_logos_collaborationContentId_fkey" FOREIGN KEY ("collaborationContentId") REFERENCES "website_collaboration_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_collaboration_partner_contents" ADD CONSTRAINT "website_collaboration_partner_contents_collaborationConten_fkey" FOREIGN KEY ("collaborationContentId") REFERENCES "website_collaboration_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
