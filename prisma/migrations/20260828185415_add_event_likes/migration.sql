-- CreateTable
CREATE TABLE "event_likes" (
    "id" SERIAL NOT NULL,
    "eventId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "event_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "event_likes_userId_idx" ON "event_likes"("userId");

-- CreateIndex
CREATE INDEX "event_likes_eventId_idx" ON "event_likes"("eventId");

-- CreateIndex
CREATE UNIQUE INDEX "event_likes_eventId_userId_key" ON "event_likes"("eventId", "userId");

-- AddForeignKey
ALTER TABLE "event_likes" ADD CONSTRAINT "event_likes_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "event_likes" ADD CONSTRAINT "event_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
