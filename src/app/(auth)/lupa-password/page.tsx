import { redirect } from "next/navigation"

import { ForgotPasswordPage } from "@/modules/auth/components/forgot-password-page"
import { checkHasAnyUser } from "@/modules/first-time-setup/data/check-setup-status"

export default async function Page() {
  const hasUser = await checkHasAnyUser()
  if (!hasUser) {
    redirect("/first-time-setup")
  }

  return <ForgotPasswordPage />
}
