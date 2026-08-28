import { notFound, redirect } from "next/navigation"

import { requireRole } from "@/modules/auth/data/session-dal"
import { AccountList } from "@/modules/account-manage/components/account-list"
import { isAccountRouteRole } from "@/modules/account-manage/constants/account-route-role"
import { getManagedAccounts } from "@/modules/account-manage/data/get-managed-accounts"

interface AccountListPageProps {
  params: Promise<{ role: string }>
  searchParams: Promise<{
    q?: string | string[]
    page?: string | string[]
  }>
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function AccountListPage({
  params,
  searchParams,
}: AccountListPageProps) {
  await requireRole(["SUPERADMIN"])

  const { role } = await params
  if (!isAccountRouteRole(role)) notFound()

  const query = await searchParams
  const rawQuery = firstValue(query.q) ?? ""
  const rawPage = firstValue(query.page) ?? "1"
  const data = await getManagedAccounts({
    routeRole: role,
    q: rawQuery,
    page: rawPage,
  })
  const requestedPage = Number(rawPage)

  if (
    Number.isInteger(requestedPage) &&
    requestedPage > 0 &&
    requestedPage !== data.page
  ) {
    const nextParams = new URLSearchParams()
    if (data.query) nextParams.set("q", data.query)
    if (data.page > 1) nextParams.set("page", String(data.page))
    const nextQuery = nextParams.toString()
    redirect(
      nextQuery
        ? `/dashboard/account/${role}?${nextQuery}`
        : `/dashboard/account/${role}`,
    )
  }

  return <AccountList routeRole={role} data={data} />
}
