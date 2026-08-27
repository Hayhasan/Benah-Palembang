import { Suspense } from "react"
import { EventPreview } from "@/features/dashboard/EventPreview"

export default function Page() {
  return (
    <Suspense>
      <EventPreview />
    </Suspense>
  )
}
