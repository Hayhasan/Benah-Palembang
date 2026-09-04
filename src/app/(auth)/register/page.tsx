import { redirect } from "next/navigation"

import { RegisterPage } from "@/modules/auth/components/register-page"
import { sanitizeReturnPath } from "@/modules/auth/data/return-path"
import { getCurrentUser } from "@/modules/auth/data/session-dal"
import { checkHasAnyUser } from "@/modules/first-time-setup/data/check-setup-status"

interface RegisterPageProps {
  searchParams: Promise<{ from?: string | string[] }>
}

export default async function Page({ searchParams }: RegisterPageProps) {
  const hasUser = await checkHasAnyUser()
  if (!hasUser) {
    redirect("/first-time-setup")
  }

  const query = await searchParams
  const returnPath = sanitizeReturnPath(
    Array.isArray(query.from) ? query.from[0] : query.from,
  )

  if (await getCurrentUser()) {
    redirect(returnPath ?? "/dashboard")
  }

  return <RegisterPage returnPath={returnPath} />
}
