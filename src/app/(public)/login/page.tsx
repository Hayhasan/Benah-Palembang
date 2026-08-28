import { redirect } from "next/navigation"

import { LoginPage } from "@/modules/auth/components/login-page"
import { getCurrentUser } from "@/modules/auth/data/session-dal"

export default async function Page() {
  if (await getCurrentUser()) redirect("/dashboard")

  return <LoginPage />
}
