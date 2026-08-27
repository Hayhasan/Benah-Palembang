import { Suspense } from "react"
import { CreateArticleEditor } from "@/features/dashboard/CreateArticleEditor"

export default function Page() {
  return (
    <Suspense>
      <CreateArticleEditor />
    </Suspense>
  )
}
