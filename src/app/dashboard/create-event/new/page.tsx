import { requireCurrentUser } from "@/modules/auth/data/session-dal"
import { EventEditor } from "@/modules/event/components/event-editor"

export default async function Page() {
  await requireCurrentUser()

  return <EventEditor />
}
