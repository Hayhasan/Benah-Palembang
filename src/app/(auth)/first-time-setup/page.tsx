import { redirect } from "next/navigation"

import { getCurrentUser } from "@/modules/auth/data/session-dal"
import { FirstTimeSetupPage } from "@/modules/first-time-setup/components/first-time-setup-page"
import { checkHasAnyUser } from "@/modules/first-time-setup/data/check-setup-status"

export default async function Page() {
  const hasUser = await checkHasAnyUser()

  if (hasUser) {
    const currentUser = await getCurrentUser()
    if (currentUser) {
      redirect("/dashboard")
    }
    redirect("/login")
  }

  return <FirstTimeSetupPage />
}
