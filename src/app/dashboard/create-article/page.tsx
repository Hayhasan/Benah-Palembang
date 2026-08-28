import { OwnedArticleList } from "@/modules/article/components/owned-article-list"
import { getOwnedArticles } from "@/modules/article/data/get-owned-articles"

interface PageProps {
  searchParams: Promise<{
    page?: string | string[]
    q?: string | string[]
  }>
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function Page({ searchParams }: PageProps) {
  const params = await searchParams
  const data = await getOwnedArticles({
    page: firstValue(params.page),
    q: firstValue(params.q),
  })

  return <OwnedArticleList data={data} />
}
