"use client"

import { useSession } from "./use-session"

export function useCurrentUser() {
  const { user } = useSession()
  if (!user) {
    throw new Error("useCurrentUser requires an authenticated session.")
  }

  return user
}
