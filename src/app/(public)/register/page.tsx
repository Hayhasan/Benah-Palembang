import { redirect } from "next/navigation"

import { RegisterPage } from "@/modules/auth/components/register-page"
import { getCurrentUser } from "@/modules/auth/data/session-dal"

export default async function Page() {
  if (await getCurrentUser()) redirect("/dashboard")

  return <RegisterPage />
}
