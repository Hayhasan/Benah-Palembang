import { ManageLandingPageForm } from "@/modules/website-content/components/manage-landing-page-form"
import { getCollaborationPageEditor } from "@/modules/website-content/data/get-collaboration-page-editor"
import { getLandingPageEditor } from "@/modules/website-content/data/get-landing-page-editor"

export default async function Page() {
  const [initialData, initialCollaborationData] = await Promise.all([
    getLandingPageEditor(),
    getCollaborationPageEditor(),
  ])

  return (
    <ManageLandingPageForm
      initialData={initialData}
      initialCollaborationData={initialCollaborationData}
    />
  )
}
