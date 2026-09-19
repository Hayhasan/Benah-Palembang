import { Metadata } from "next"
import { CollaborationEditor } from "@/modules/website-content/components/collaboration-editor"

export const metadata: Metadata = {
  title: "Tambah Kolaborasi",
}

export default function CreateCollaborationPage() {
  return (
    <div className="flex-1 p-4 pt-6 md:p-8">
      <CollaborationEditor />
    </div>
  )
}
