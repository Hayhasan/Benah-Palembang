import { Metadata } from "next"
import { getCollaborationDetail } from "@/modules/website-content/data/get-collaboration-detail"
import { CollaborationEditor } from "@/modules/website-content/components/collaboration-editor"

export const metadata: Metadata = {
  title: "Edit Kolaborasi",
}

interface EditCollaborationPageProps {
  params: Promise<{
    id: string
  }>
}

export default async function EditCollaborationPage({ params }: EditCollaborationPageProps) {
  const resolvedParams = await params
  const id = parseInt(resolvedParams.id, 10)
  const initialData = await getCollaborationDetail(id)

  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <CollaborationEditor initialData={initialData} />
    </div>
  )
}
