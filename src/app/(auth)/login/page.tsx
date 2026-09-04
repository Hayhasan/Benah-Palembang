import { redirect } from "next/navigation"

import { LoginPage } from "@/modules/auth/components/login-page"
import { sanitizeReturnPath } from "@/modules/auth/data/return-path"
import { getCurrentUser } from "@/modules/auth/data/session-dal"
import { checkHasAnyUser } from "@/modules/first-time-setup/data/check-setup-status"

interface LoginPageProps {
  searchParams: Promise<{ reset?: string | string[]; from?: string | string[] }>
}

function firstValue(value?: string | string[]) {
  return Array.isArray(value) ? value[0] : value
}

export default async function Page({ searchParams }: LoginPageProps) {
  const hasUser = await checkHasAnyUser()
  if (!hasUser) {
    redirect("/first-time-setup")
  }

  const query = await searchParams
  const returnPath = sanitizeReturnPath(firstValue(query.from))

  if (await getCurrentUser()) {
    redirect(returnPath ?? "/dashboard")
  }

  const reset = firstValue(query.reset)

  return (
    <LoginPage
      passwordResetSuccess={reset === "success"}
      returnPath={returnPath}
    />
  )
}
