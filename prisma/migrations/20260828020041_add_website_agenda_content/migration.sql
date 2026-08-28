-- CreateTable
CREATE TABLE "website_agenda_contents" (
    "id" SERIAL NOT NULL,
    "key" VARCHAR(100) NOT NULL,
    "originalKey" VARCHAR(100),
    "heroImageUrl" TEXT NOT NULL,
    "heroImageAlt" VARCHAR(255) NOT NULL,
    "heroEyebrow" VARCHAR(160) NOT NULL,
    "heroTitle" VARCHAR(255) NOT NULL,
    "heroDescription" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "website_agenda_contents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "website_agenda_contents_key_key" ON "website_agenda_contents"("key");

-- CreateIndex
CREATE INDEX "website_agenda_contents_deletedAt_idx" ON "website_agenda_contents"("deletedAt");
