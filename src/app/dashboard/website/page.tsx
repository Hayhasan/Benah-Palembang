import { ManageLandingPageForm } from "@/modules/website-content/components/manage-landing-page-form"
import { getLandingPageEditor } from "@/modules/website-content/data/get-landing-page-editor"

export default async function Page() {
  const initialData = await getLandingPageEditor()

  return <ManageLandingPageForm initialData={initialData} />
}
