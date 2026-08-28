import { redirect } from "next/navigation"

import { RegisterPage } from "@/modules/auth/components/register-page"
import { getCurrentUser } from "@/modules/auth/data/session-dal"
import { checkHasAnyUser } from "@/modules/first-time-setup/data/check-setup-status"

export default async function Page() {
  const hasUser = await checkHasAnyUser()
  if (!hasUser) {
    redirect("/first-time-setup")
  }

  if (await getCurrentUser()) {
    redirect("/dashboard")
  }

  return <RegisterPage />
}
