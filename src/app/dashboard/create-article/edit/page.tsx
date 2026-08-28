import { notFound } from "next/navigation"

import { requireCurrentUser } from "@/modules/auth/data/session-dal"
import { ArticleEditor } from "@/modules/article/components/article-editor"
import { getArticleCategoryOptions } from "@/modules/article/data/get-article-category-options"
import { getOwnedArticle } from "@/modules/article/data/get-owned-article"

interface PageProps {
  searchParams: Promise<{ id?: string | string[] }>
}

export default async function Page({ searchParams }: PageProps) {
  await requireCurrentUser()

  const params = await searchParams
  const rawId = Array.isArray(params.id) ? params.id[0] : params.id

  if (!rawId || !/^[1-9]\d*$/.test(rawId)) notFound()

  const [article, categories] = await Promise.all([
    getOwnedArticle(Number(rawId)),
    getArticleCategoryOptions(),
  ])

  if (!article) notFound()

  return <ArticleEditor initialArticle={article} categories={categories} />
}
