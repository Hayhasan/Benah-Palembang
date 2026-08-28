"use client"

import { useContext } from "react"

import { AuthSessionContext } from "../components/auth-session-provider"

export function useSession() {
  const context = useContext(AuthSessionContext)
  if (!context) {
    throw new Error("useSession must be used within AuthSessionProvider.")
  }

  return context
}
