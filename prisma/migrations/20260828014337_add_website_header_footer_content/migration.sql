-- CreateTable
CREATE TABLE "website_header_footer_contents" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "originalKey" VARCHAR(100),
    "logoImageUrl" TEXT NOT NULL,
    "logoImageAlt" VARCHAR(255) NOT NULL,
    "logoLinkUrl" TEXT NOT NULL,
    "footerDescription" TEXT NOT NULL,
    "exploreDescription" TEXT NOT NULL,
    "contactEmail" VARCHAR(255) NOT NULL,
    "contactPhone" VARCHAR(50) NOT NULL,
    "contactAddress" VARCHAR(255) NOT NULL,
    "copyrightText" VARCHAR(255) NOT NULL,
    "closingText" VARCHAR(255) NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_header_footer_contents_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_footer_explore_links" (
    "id" SERIAL NOT NULL,
    "headerFooterContentId" INTEGER NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_footer_explore_links_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "website_footer_connect_links" (
    "id" SERIAL NOT NULL,
    "headerFooterContentId" INTEGER NOT NULL,
    "label" VARCHAR(160) NOT NULL,
    "linkUrl" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "isVisible" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_footer_connect_links_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "website_header_footer_contents_key_key" ON "website_header_footer_contents"("key");

-- CreateIndex
CREATE INDEX "website_header_footer_contents_deletedAt_idx" ON "website_header_footer_contents"("deletedAt");

-- CreateIndex
CREATE INDEX "website_footer_explore_links_headerFooterContentId_deletedA_idx" ON "website_footer_explore_links"("headerFooterContentId", "deletedAt", "position");

-- CreateIndex
CREATE INDEX "website_footer_connect_links_headerFooterContentId_deletedA_idx" ON "website_footer_connect_links"("headerFooterContentId", "deletedAt", "position");

-- AddForeignKey
ALTER TABLE "website_footer_explore_links" ADD CONSTRAINT "website_footer_explore_links_headerFooterContentId_fkey" FOREIGN KEY ("headerFooterContentId") REFERENCES "website_header_footer_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "website_footer_connect_links" ADD CONSTRAINT "website_footer_connect_links_headerFooterContentId_fkey" FOREIGN KEY ("headerFooterContentId") REFERENCES "website_header_footer_contents"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
