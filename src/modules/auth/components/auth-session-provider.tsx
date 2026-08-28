"use client"

import {
  createContext,
  useMemo,
  useTransition,
  type ReactNode,
} from "react"
import { useRouter } from "next/navigation"

import { logoutAction } from "../actions/logout"
import type { AuthUser } from "../types/auth-session"

export interface AuthSessionContextValue {
  user: AuthUser | null
  status: "authenticated" | "unauthenticated"
  isLoggingOut: boolean
  logout: (options?: { redirectTo?: string }) => void
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
  const router = useRouter()
  const [isLoggingOut, startTransition] = useTransition()
  const value = useMemo<AuthSessionContextValue>(
    () => ({
      user: initialUser,
      status: initialUser ? "authenticated" : "unauthenticated",
      isLoggingOut,
      logout(options) {
        startTransition(async () => {
          await logoutAction()
          if (options?.redirectTo) {
            router.replace(options.redirectTo)
          } else {
            router.refresh()
          }
        })
      },
    }),
    [initialUser, isLoggingOut, router],
  )

  return (
    <AuthSessionContext.Provider value={value}>
      {children}
    </AuthSessionContext.Provider>
  )
}
