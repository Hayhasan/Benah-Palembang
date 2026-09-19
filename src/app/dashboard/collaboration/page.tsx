import { Metadata } from "next"
import { getCollaborationList } from "@/modules/website-content/data/get-collaboration-list"
import { CollaborationList } from "@/modules/website-content/components/collaboration-list"

export const metadata: Metadata = {
  title: "Data Kolaborasi",
}

export default async function CollaborationPage() {
  const items = await getCollaborationList()

  return (
    <div className="flex-1 space-y-4 p-4 pt-6 md:p-8">
      <CollaborationList items={items} />
    </div>
  )
}
