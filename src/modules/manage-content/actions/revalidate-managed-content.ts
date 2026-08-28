import { revalidatePath } from "next/cache"

import type { ManagedContentType } from "../types/managed-content"

export function revalidateManagedContentRoutes(
  type: ManagedContentType,
  slugOrId?: string | number,
) {
  revalidatePath("/dashboard/content")

  if (type === "ARTICLE") {
    revalidatePath("/dashboard/create-article")
    revalidatePath("/")
    if (typeof slugOrId === "string") {
      revalidatePath(`/artikel/${slugOrId}`)
    }
  } else {
    revalidatePath("/dashboard/create-event")
    revalidatePath("/agenda")
    if (slugOrId) {
      revalidatePath(`/agenda/${slugOrId}`)
    }
  }
}
