import { revalidatePath } from "next/cache"

import type { AccountRouteRole } from "../types/managed-account"

export function revalidateAccountRoutes(
  routeRole?: AccountRouteRole,
  id?: string,
) {
  revalidatePath("/dashboard/account/user")
  revalidatePath("/dashboard/account/admin")

  if (routeRole && id) {
    revalidatePath(`/dashboard/account/${routeRole}/${id}`)
  }
}
