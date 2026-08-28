import { Overview } from "@/features/dashboard/Overview"
import { requireRole } from "@/modules/auth/data/session-dal"

export default async function Page() {
  await requireRole(["ADMIN", "SUPERADMIN"])

  return <Overview />
}
