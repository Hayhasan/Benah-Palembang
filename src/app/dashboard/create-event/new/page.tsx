import { Suspense } from "react"
import { CreateEventEditor } from "@/features/dashboard/CreateEventEditor"

export default function Page() {
  return (
    <Suspense>
      <CreateEventEditor />
    </Suspense>
  )
}
