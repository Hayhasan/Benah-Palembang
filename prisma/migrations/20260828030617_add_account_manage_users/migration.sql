-- CreateEnum
CREATE TYPE "UserRole" AS ENUM ('USER', 'ADMIN', 'SUPERADMIN');

-- CreateTable
CREATE TABLE "users" (
    "id" UUID NOT NULL,
    "name" VARCHAR(160) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "originalEmail" VARCHAR(255),
    "password" TEXT NOT NULL,
    "role" "UserRole" NOT NULL DEFAULT 'USER',
    "avatarUrl" TEXT,
    "bannerUrl" TEXT,
    "bio" TEXT,
    "whatsappCountryCode" VARCHAR(8),
    "whatsappNumber" VARCHAR(32),
    "instagramUrl" TEXT,
    "xUrl" TEXT,
    "linkedinUrl" TEXT,
    "isBanned" BOOLEAN NOT NULL DEFAULT false,
    "bannedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "users_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");

-- CreateIndex
CREATE INDEX "users_role_deletedAt_createdAt_idx" ON "users"("role", "deletedAt", "createdAt");

-- CreateIndex
CREATE INDEX "users_isBanned_deletedAt_idx" ON "users"("isBanned", "deletedAt");
