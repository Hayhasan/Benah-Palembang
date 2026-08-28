-- CreateTable
CREATE TABLE "article_likes" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "article_likes_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "article_likes_userId_idx" ON "article_likes"("userId");

-- CreateIndex
CREATE INDEX "article_likes_articleId_idx" ON "article_likes"("articleId");

-- CreateIndex
CREATE UNIQUE INDEX "article_likes_articleId_userId_key" ON "article_likes"("articleId", "userId");

-- AddForeignKey
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_likes" ADD CONSTRAINT "article_likes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
