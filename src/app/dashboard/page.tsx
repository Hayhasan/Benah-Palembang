import { requireRole } from "@/modules/auth/data/session-dal"
import { OverviewPage } from "@/modules/overview/components/overview-page"
import { getOverviewData } from "@/modules/overview/data/get-overview-data"

interface DashboardPageProps {
  searchParams: Promise<{
    period?: string | string[]
    month?: string | string[]
  }>
}

export default async function Page({ searchParams }: DashboardPageProps) {
  await requireRole(["ADMIN", "SUPERADMIN"])

  const params = await searchParams
  const period = Array.isArray(params.period) ? params.period[0] : params.period
  const month = Array.isArray(params.month) ? params.month[0] : params.month

  const data = await getOverviewData({ period, month })

  return <OverviewPage initialData={data} />
}
