import { LogActivities } from "@/features/dashboard/LogActivities"
import { requireRole } from "@/modules/auth/data/session-dal"

export default async function Page() {
  await requireRole(["SUPERADMIN"])

  return <LogActivities />
}
