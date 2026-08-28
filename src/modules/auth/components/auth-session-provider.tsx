"use client"

import {
  createContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react"

import { logoutAction } from "../actions/logout"
import type { AuthUser } from "../types/auth-session"

export interface AuthSessionContextValue {
  user: AuthUser | null
  status: "authenticated" | "unauthenticated"
  isLoggingOut: boolean
  logout: () => void
}

export const AuthSessionContext = createContext<AuthSessionContextValue | null>(
  null,
)

export function AuthSessionProvider({
  children,
  initialUser,
}: {
  children: ReactNode
  initialUser: AuthUser | null
}) {
  const [isLoggingOut, startTransition] = useTransition()
  const value = useMemo<AuthSessionContextValue>(
    () => ({
      user: initialUser,
      status: initialUser ? "authenticated" : "unauthenticated",
      isLoggingOut,
      logout() {
        startTransition(async () => {
          await logoutAction()
        })
      },
    }),
    [initialUser, isLoggingOut],
  )

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}
