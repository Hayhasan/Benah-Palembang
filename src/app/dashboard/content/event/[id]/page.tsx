import { notFound } from "next/navigation"

import { requireRole } from "@/modules/auth/data/session-dal"
import { ManagedEventPreview } from "@/modules/manage-content/components/managed-event-preview"
import { getManagedEvent } from "@/modules/manage-content/data/get-managed-event"

interface PageProps {
  params: Promise<{ id: string }>
}

export default async function Page({ params }: PageProps) {
  await requireRole(["ADMIN", "SUPERADMIN"])

  const { id } = await params
  if (!/^[1-9]\d*$/.test(id)) notFound()

  const event = await getManagedEvent(Number(id))
  if (!event) notFound()

  return <ManagedEventPreview event={event} />
}
