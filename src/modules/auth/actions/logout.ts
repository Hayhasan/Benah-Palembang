"use server"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"

import { clearPresence } from "../data/activity"
import { deleteCurrentSession, readSessionFromCookie } from "../data/session"

export async function logoutAction() {
  let userId: string | null = null

  try {
    userId = (await readSessionFromCookie())?.userId ?? null
  } catch (error) {
    console.error("Failed to read session during logout:", error)
  }

  if (userId) {
    try {
      const user = await prisma.user.findFirst({
        where: { id: userId, deletedAt: null },
        select: { id: true, name: true, role: true },
      })

      if (user) {
        await recordActivityLog({
          userId: user.id,
          userName: user.name,
          userRole: user.role,
          action: "LOGOUT",
          module: "AUTH",
          description: `Pengguna '${user.name}' keluar (logout) dari sistem`,
          beforeState: { session: "ACTIVE" },
          afterState: { session: "REVOKED" },
        })
      }
    } catch (error) {
      console.error("Failed to record activity log for logout:", error)
    }
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
