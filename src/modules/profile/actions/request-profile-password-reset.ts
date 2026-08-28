"use server"

import { requireCurrentUser } from "@/modules/auth/data/session-dal"
import { requestPasswordReset } from "@/modules/auth/data/request-password-reset"

import type { ProfilePasswordResetResult } from "../types/profile"

export async function requestProfilePasswordResetAction(): Promise<
  ProfilePasswordResetResult
> {
  const actor = await requireCurrentUser()

  try {
    const result = await requestPasswordReset(actor.email)

    if (result.status === "rate-limited") {
      return {
        success: false,
        message:
          "Terlalu banyak permintaan reset password. Coba lagi beberapa saat.",
      }
    }

    const retryAt = Date.now() + result.retryAfterSeconds * 1000
    if (result.status === "cooldown") {
      return {
        success: false,
        message: `Silakan tunggu ${result.retryAfterSeconds} detik sebelum mengirim ulang.`,
        retryAt,
      }
    }

    return {
      success: true,
      message: "Email reset password telah dikirim.",
      retryAt,
    }
  } catch (error) {
    console.error("Failed to request profile password reset:", error)
    return {
      success: false,
      message: "Email reset password belum dapat dikirim. Silakan coba lagi.",
    }
  }
}
