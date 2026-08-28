import { notFound } from "next/navigation"

import { requireCurrentUser } from "@/modules/auth/data/session-dal"
import { OwnedArticlePreview } from "@/modules/article/components/owned-article-preview"
import { getOwnedArticle } from "@/modules/article/data/get-owned-article"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  await requireCurrentUser()

  const { id } = await params
  if (!/^[1-9]\d*$/.test(id)) notFound()

  const article = await getOwnedArticle(Number(id))
  if (!article) notFound()

  return <OwnedArticlePreview article={article} />
}
