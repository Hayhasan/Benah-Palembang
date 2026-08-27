import { Suspense } from "react"
import { ArticlePreview } from "@/features/dashboard/ArticlePreview"

export default function Page() {
  return (
    <Suspense>
      <ArticlePreview />
    </Suspense>
  )
}
