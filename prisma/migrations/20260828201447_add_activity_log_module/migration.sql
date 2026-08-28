-- CreateEnum
CREATE TYPE "ActivityAction" AS ENUM ('CREATE', 'UPDATE', 'DELETE', 'LOGIN', 'LOGOUT', 'APPROVE', 'REJECT', 'TAKEDOWN', 'RESTORE', 'BAN', 'UNBAN', 'CHANGE_ROLE');

-- CreateEnum
CREATE TYPE "ActivityModule" AS ENUM ('AUTH', 'PROFILE', 'ACCOUNT', 'WEBSITE', 'ARTICLE', 'EVENT', 'CONTENT');

-- CreateTable
CREATE TABLE "activity_logs" (
    "id" SERIAL NOT NULL,
    "userId" UUID,
    "userName" VARCHAR(160) NOT NULL,
    "userRole" "UserRole" NOT NULL DEFAULT 'USER',
    "action" "ActivityAction" NOT NULL,
    "module" "ActivityModule" NOT NULL,
    "description" TEXT NOT NULL,
    "beforeState" JSONB,
    "afterState" JSONB,
    "ipAddress" VARCHAR(64),
    "userAgent" TEXT,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "activity_logs_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "activity_logs_userId_createdAt_idx" ON "activity_logs"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_module_createdAt_idx" ON "activity_logs"("module", "createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_action_createdAt_idx" ON "activity_logs"("action", "createdAt");

-- CreateIndex
CREATE INDEX "activity_logs_createdAt_idx" ON "activity_logs"("createdAt" DESC);

-- AddForeignKey
ALTER TABLE "activity_logs" ADD CONSTRAINT "activity_logs_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL ON UPDATE CASCADE;
