import "server-only"

import { cache } from "react"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"

import type { AuthRole, AuthUser } from "../types/auth-session"
import { scheduleActivityTouch } from "./activity"
import { readSessionFromCookie } from "./session"

export const getSession = cache(readSessionFromCookie)

export const getCurrentUser = cache(async (): Promise<AuthUser | null> => {
  const session = await getSession()
  if (!session) return null

  const user = await prisma.user.findFirst({
    where: {
      id: session.userId,
      role: session.role,
      isBanned: false,
      deletedAt: null,
    },
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      avatarUrl: true,
    },
  })

  return user
})

export async function requireSession() {
  const session = await getSession()
  if (!session) redirect("/login?reason=session-required")

  await scheduleActivityTouch(session.userId)
  return session
}

export async function requireCurrentUser() {
  const user = await getCurrentUser()
  if (!user) redirect("/login?reason=session-invalid")

  await scheduleActivityTouch(user.id)
  return user
}

export async function requireRole(roles: AuthRole[]) {
  const user = await getCurrentUser()
  if (!user) redirect("/login?reason=session-invalid")
  if (!roles.includes(user.role)) {
    redirect("/dashboard")
  }

  await scheduleActivityTouch(user.id)
  return user
}
