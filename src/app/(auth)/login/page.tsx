import { redirect } from "next/navigation"

import { LoginPage } from "@/modules/auth/components/login-page"
import { getCurrentUser } from "@/modules/auth/data/session-dal"
import { checkHasAnyUser } from "@/modules/first-time-setup/data/check-setup-status"

interface LoginPageProps {
  searchParams: Promise<{ reset?: string | string[] }>
}

export default async function Page({ searchParams }: LoginPageProps) {
  const hasUser = await checkHasAnyUser()
  if (!hasUser) {
    redirect("/first-time-setup")
  }

  if (await getCurrentUser()) {
    redirect("/dashboard")
  }

  const query = await searchParams
  const reset = Array.isArray(query.reset) ? query.reset[0] : query.reset

  return <LoginPage passwordResetSuccess={reset === "success"} />
}
