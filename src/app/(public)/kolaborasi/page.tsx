import { CollaborationPage } from "@/modules/website-content/components/collaboration-page"
import { getCollaborationPage } from "@/modules/website-content/data/get-collaboration-page"

export default async function Page() {
  const data = await getCollaborationPage()

  return <CollaborationPage data={data} />
}
