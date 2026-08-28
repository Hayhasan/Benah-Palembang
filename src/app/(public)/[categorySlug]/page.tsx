import { notFound } from "next/navigation"

import { ArticleCategoryPage } from "@/modules/website-content/components/article-category-page"
import { getArticleCategoryPage } from "@/modules/website-content/data/get-article-category-page"

export default async function Page({
  params,
}: {
  params: Promise<{ categorySlug: string }>
}) {
  const { categorySlug } = await params
  const data = await getArticleCategoryPage(categorySlug)

  if (!data) notFound()

  return <ArticleCategoryPage key={data.slug} data={data} />
}
