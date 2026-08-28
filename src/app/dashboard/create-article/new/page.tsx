import { ArticleEditor } from "@/modules/article/components/article-editor"
import { getArticleCategoryOptions } from "@/modules/article/data/get-article-category-options"

export default async function Page() {
  const categories = await getArticleCategoryOptions()

  return <ArticleEditor categories={categories} />
}
