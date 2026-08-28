"use server"

import { after } from "next/server"

import { sendPasswordResetEmail } from "../data/mailer"
import {
  cleanupPasswordResetToken,
  createDiscardedPasswordResetToken,
  createPasswordResetToken,
  findPasswordResetAccount,
  maskEmail,
} from "../data/password-reset"
import { checkPasswordResetRateLimit } from "../data/rate-limit"
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
    const rateLimit = await checkPasswordResetRateLimit(email)
    if (rateLimit.limitedByIp) {
      return {
        status: "error",
        message:
          "Terlalu banyak permintaan reset password. Coba lagi beberapa saat.",
        email,
      }
    }

    if (!rateLimit.acquired) {
      return {
        status: "sent",
        message: GENERIC_SUCCESS_MESSAGE,
        email,
        maskedEmail: maskEmail(email),
        retryAt: Date.now() + rateLimit.retryAfterSeconds * 1000,
      }
    }

    const account = await findPasswordResetAccount(email)
    const canReset = account && !account.isBanned && !account.deletedAt

    if (canReset) {
      const resetToken = await createPasswordResetToken(account.id)

      after(async () => {
        try {
          await sendPasswordResetEmail({
            email: account.email,
            name: account.name,
            token: resetToken.token,
          })
        } catch (error) {
          console.error("Failed to send password reset email:", error)
          try {
            await cleanupPasswordResetToken({
              userId: account.id,
              tokenHash: resetToken.tokenHash,
            })
          } catch (cleanupError) {
            console.error("Failed to clean up password reset token:", cleanupError)
          }
        }
      })
    } else {
      await createDiscardedPasswordResetToken()
    }

    return {
      status: "sent",
      message: GENERIC_SUCCESS_MESSAGE,
      email,
      maskedEmail: maskEmail(email),
      retryAt: Date.now() + rateLimit.retryAfterSeconds * 1000,
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
