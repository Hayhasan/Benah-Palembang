import { revalidatePath } from "next/cache"

export function revalidateEventRoutes(id?: number) {
  revalidatePath("/agenda")
  revalidatePath("/dashboard/content/event")
  revalidatePath("/dashboard/create-event")

  if (id) {
    revalidatePath(`/agenda/${id}`)
    revalidatePath(`/dashboard/create-event/preview/${id}`)
  }
}
