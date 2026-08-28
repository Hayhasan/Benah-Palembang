"use server"

import { maskEmail } from "../data/password-reset"
import { requestPasswordReset } from "../data/request-password-reset"
import { forgotPasswordSchema } from "../schemas/auth.schema"
import type { PasswordResetRequestState } from "../types/password-reset"

const GENERIC_SUCCESS_MESSAGE =
  "Jika email terdaftar, tautan reset password telah dikirim. Silakan periksa inbox atau folder spam."

export async function requestPasswordResetAction(
  _previousState: PasswordResetRequestState,
  formData: FormData,
): Promise<PasswordResetRequestState> {
  const parsed = forgotPasswordSchema.safeParse({ email: formData.get("email") })
  const rawEmail = formData.get("email")
  const normalizedInput =
    typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : ""

  if (!parsed.success) {
    return {
      status: "error",
      message: "Periksa kembali alamat email Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      email: normalizedInput,
    }
  }

  const { email } = parsed.data

  try {
    const request = await requestPasswordReset(email)
    if (request.status === "rate-limited") {
      return {
        status: "error",
        message:
          "Terlalu banyak permintaan reset password. Coba lagi beberapa saat.",
        email,
      }
    }

    if (request.status === "cooldown") {
      return {
        status: "sent",
        message: GENERIC_SUCCESS_MESSAGE,
        email,
        maskedEmail: maskEmail(email),
        retryAt: Date.now() + request.retryAfterSeconds * 1000,
      }
    }

    return {
      status: "sent",
      message: GENERIC_SUCCESS_MESSAGE,
      email,
      maskedEmail: maskEmail(email),
      retryAt: Date.now() + request.retryAfterSeconds * 1000,
    }
  } catch (error) {
    console.error("Failed to request password reset:", error)
    return {
      status: "error",
      message:
        "Permintaan reset password belum dapat diproses. Silakan coba lagi.",
      email,
    }
  }
}
