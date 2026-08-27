import { Suspense } from "react"
import { UserProfile } from "@/features/dashboard/UserProfile"

export default function Page() {
  return (
    <Suspense>
      <UserProfile />
    </Suspense>
  )
}
