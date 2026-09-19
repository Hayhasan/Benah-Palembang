import { requireRole } from "@/modules/auth/data/session-dal"
import { getArticleCategoryPageEditor } from "@/modules/website-content/data/get-article-category-page-editor"
import { getCollaborationPageEditor } from "@/modules/website-content/data/get-collaboration-page-editor"
import { getHeaderFooterContentEditor } from "@/modules/website-content/data/get-header-footer-content-editor"
import {
  getLandingArticlePinOptions,
  getLandingPageEditor,
} from "@/modules/website-content/data/get-landing-page-editor"
import { ManageLandingPageForm } from "@/modules/website-content/components/manage-landing-page-form"

export default async function Page() {
  await requireRole(["ADMIN", "SUPERADMIN"])

  const [
    initialData,
    initialHeaderFooterData,
    initialCategoryPagesData,
    initialCollaborationData,
    articlePinOptions,
  ] = await Promise.all([
    getLandingPageEditor(),
    getHeaderFooterContentEditor(),
    getArticleCategoryPageEditor(),
    getCollaborationPageEditor(),
    getLandingArticlePinOptions(),
  ])

  return (
    <ManageLandingPageForm
      initialData={initialData}
      initialHeaderFooterData={initialHeaderFooterData}
      initialCategoryPagesData={initialCategoryPagesData}
      initialCollaborationData={initialCollaborationData}
      articlePinOptions={articlePinOptions}
    />
  )
}
