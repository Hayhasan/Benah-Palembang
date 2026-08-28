-- CreateEnum
CREATE TYPE "ContentStatus" AS ENUM ('DRAFT', 'PENDING_REVIEW', 'PUBLISHED', 'REJECTED', 'TAKEN_DOWN');

-- CreateTable
CREATE TABLE "events" (
    "id" SERIAL NOT NULL,
    "ownerId" UUID NOT NULL,
    "reviewedById" UUID,
    "slug" VARCHAR(180) NOT NULL,
    "originalSlug" VARCHAR(180),
    "title" VARCHAR(255) NOT NULL,
    "description" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "bannerUrl" TEXT NOT NULL,
    "category" VARCHAR(100) NOT NULL,
    "startsAt" TIMESTAMPTZ(6) NOT NULL,
    "endsAt" TIMESTAMPTZ(6),
    "location" VARCHAR(255) NOT NULL,
    "organizer" VARCHAR(255) NOT NULL,
    "registrationUrl" TEXT,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "moderationNote" TEXT,
    "submittedAt" TIMESTAMPTZ(6),
    "publishedAt" TIMESTAMPTZ(6),
    "reviewedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "event_tags" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "label" VARCHAR(80) NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "event_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "events_slug_key" ON "events"("slug");

-- CreateIndex
CREATE INDEX "events_ownerId_deletedAt_updatedAt_idx" ON "events"("ownerId", "deletedAt", "updatedAt");

-- CreateIndex
CREATE INDEX "events_status_deletedAt_startsAt_idx" ON "events"("status", "deletedAt", "startsAt");

-- CreateIndex
CREATE INDEX "event_tags_eventId_deletedAt_position_idx" ON "event_tags"("eventId", "deletedAt", "position");

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "events" ADD CONSTRAINT "events_reviewedById_fkey" FOREIGN KEY ("reviewedById") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_tags" ADD CONSTRAINT "event_tags_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
