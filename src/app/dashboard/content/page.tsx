import { requireRole } from "@/modules/auth/data/session-dal"
import { ManageContentList } from "@/modules/manage-content/components/manage-content-list"
import { getManagedContent } from "@/modules/manage-content/data/get-managed-content"

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
  await requireRole(["ADMIN", "SUPERADMIN"])

  const params = await searchParams
  const data = await getManagedContent({
    page: firstValue(params.page),
    q: firstValue(params.q),
  })

  return <ManageContentList data={data} />
}
