import { notFound } from "next/navigation"

import { PublicArticleDetail } from "@/modules/article/components/public-article-detail"
import { getPublicArticle } from "@/modules/article/data/get-public-article"

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const data = await getPublicArticle(slug)

  if (!data) notFound()

  return <PublicArticleDetail data={data} />
}
