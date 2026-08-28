-- CreateTable
CREATE TABLE "articles" (
    "id" SERIAL NOT NULL,
    "authorId" UUID NOT NULL,
    "websiteArticleSectionId" INTEGER NOT NULL,
    "slug" VARCHAR(180) NOT NULL,
    "originalSlug" VARCHAR(180),
    "title" VARCHAR(255) NOT NULL,
    "excerpt" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "coverImageUrl" TEXT NOT NULL,
    "readingTime" INTEGER NOT NULL,
    "isFeatured" BOOLEAN NOT NULL DEFAULT false,
    "status" "ContentStatus" NOT NULL DEFAULT 'DRAFT',
    "moderationNote" TEXT,
    "submittedAt" TIMESTAMPTZ(6),
    "publishedAt" TIMESTAMPTZ(6),
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "articles_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "article_tags" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "label" VARCHAR(80) NOT NULL,
    "position" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ(6) NOT NULL,
    "deletedAt" TIMESTAMPTZ(6),

    CONSTRAINT "article_tags_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "articles_slug_key" ON "articles"("slug");

-- CreateIndex
CREATE INDEX "articles_authorId_deletedAt_updatedAt_idx" ON "articles"("authorId", "deletedAt", "updatedAt");

-- CreateIndex
CREATE INDEX "articles_websiteArticleSectionId_status_deletedAt_published_idx" ON "articles"("websiteArticleSectionId", "status", "deletedAt", "publishedAt");

-- CreateIndex
CREATE INDEX "article_tags_articleId_deletedAt_position_idx" ON "article_tags"("articleId", "deletedAt", "position");

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "articles" ADD CONSTRAINT "articles_websiteArticleSectionId_fkey" FOREIGN KEY ("websiteArticleSectionId") REFERENCES "website_article_sections"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "article_tags" ADD CONSTRAINT "article_tags_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "articles"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
