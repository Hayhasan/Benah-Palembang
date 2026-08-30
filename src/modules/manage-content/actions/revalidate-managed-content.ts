import { revalidatePath } from "next/cache"

import type { ManagedContentType } from "../types/managed-content"

export function revalidateManagedContentRoutes(
  type: ManagedContentType,
  slugOrId?: string | number,
) {
  revalidatePath(
    type === "ARTICLE"
      ? "/dashboard/content/article"
      : "/dashboard/content/event",
  )

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
