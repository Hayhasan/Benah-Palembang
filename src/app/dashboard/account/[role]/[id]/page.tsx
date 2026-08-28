import { notFound } from "next/navigation"

import { requireRole } from "@/modules/auth/data/session-dal"
import { AccountDetail } from "@/modules/account-manage/components/account-detail"
import { isAccountRouteRole } from "@/modules/account-manage/constants/account-route-role"
import { getManagedAccount } from "@/modules/account-manage/data/get-managed-account"

interface AccountDetailPageProps {
  params: Promise<{
    role: string
    id: string
  }>
}

export default async function AccountDetailPage({
  params,
}: AccountDetailPageProps) {
  await requireRole(["SUPERADMIN"])

  const { role, id } = await params
  if (!isAccountRouteRole(role)) notFound()

  const account = await getManagedAccount(role, id)
  if (!account) notFound()

  return <AccountDetail routeRole={role} account={account} />
}
