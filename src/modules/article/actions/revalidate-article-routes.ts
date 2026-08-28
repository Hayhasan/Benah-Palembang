import { revalidatePath } from "next/cache"

export function revalidateArticleRoutes(params?: {
  id?: number
  slug?: string
  categorySlug?: string
}) {
  revalidatePath("/")
  revalidatePath("/dashboard/content")
  revalidatePath("/dashboard/create-article")

  if (params?.id) {
    revalidatePath(`/dashboard/create-article/preview/${params.id}`)
    revalidatePath(`/dashboard/article/preview/${params.id}`)
  }

  if (params?.slug) {
    revalidatePath(`/artikel/${params.slug}`)
  }

  if (params?.categorySlug) {
    revalidatePath(`/${params.categorySlug}`)
  }
}
