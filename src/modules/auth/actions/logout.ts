"use server"

import { clearPresence } from "../data/activity"
import { deleteCurrentSession, readSessionFromCookie } from "../data/session"

export async function logoutAction() {
  let userId: string | null = null

  try {
    userId = (await readSessionFromCookie())?.userId ?? null
  } catch (error) {
    console.error("Failed to read session during logout:", error)
  }

  try {
    await deleteCurrentSession()
  } catch (error) {
    console.error("Failed to delete Redis session during logout:", error)
  }

  if (userId) {
    try {
      await clearPresence(userId)
    } catch (error) {
      console.error("Failed to clear presence during logout:", error)
    }
  }

  return { success: true as const }
}
