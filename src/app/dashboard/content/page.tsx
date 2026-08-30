import { redirect } from "next/navigation"

import { requireRole } from "@/modules/auth/data/session-dal"

export default async function Page() {
  await requireRole(["ADMIN", "SUPERADMIN"])
  redirect("/dashboard/content/article")
}
