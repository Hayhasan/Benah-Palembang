import { ManageLandingPageForm } from "@/modules/website-content/components/manage-landing-page-form"
import { getCollaborationPageEditor } from "@/modules/website-content/data/get-collaboration-page-editor"
import { getHeaderFooterContentEditor } from "@/modules/website-content/data/get-header-footer-content-editor"
import { getLandingPageEditor } from "@/modules/website-content/data/get-landing-page-editor"

export default async function Page() {
  const [initialData, initialCollaborationData, initialHeaderFooterData] =
    await Promise.all([
      getLandingPageEditor(),
      getCollaborationPageEditor(),
      getHeaderFooterContentEditor(),
    ])

  return (
    <ManageLandingPageForm
      initialData={initialData}
      initialCollaborationData={initialCollaborationData}
      initialHeaderFooterData={initialHeaderFooterData}
    />
  )
}
