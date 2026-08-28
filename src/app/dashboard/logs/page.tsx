import { ActivityLogList } from "@/modules/activity-log/components/activity-log-list"
import { getActivityLogs } from "@/modules/activity-log/data/get-activity-logs"
import { requireRole } from "@/modules/auth/data/session-dal"

interface PageProps {
  searchParams: Promise<{
    page?: string | string[]
    q?: string | string[]
  }>
}

function firstValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function Page({ searchParams }: PageProps) {
  await requireRole(["SUPERADMIN"])

  const params = await searchParams
  const data = await getActivityLogs({
    page: firstValue(params.page),
    q: firstValue(params.q),
  })

  return <ActivityLogList data={data} />
}
