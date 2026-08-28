import { ManageContent } from "@/features/dashboard/ManageContent"
import { requireRole } from "@/modules/auth/data/session-dal"

export default async function Page() {
  await requireRole(["ADMIN", "SUPERADMIN"])

  return <ManageContent />
}
