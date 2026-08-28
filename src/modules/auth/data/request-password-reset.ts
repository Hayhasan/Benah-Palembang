import "server-only"

import { after } from "next/server"

import { sendPasswordResetEmail } from "./mailer"
import {
  cleanupPasswordResetToken,
  createDiscardedPasswordResetToken,
  createPasswordResetToken,
  findPasswordResetAccount,
} from "./password-reset"
import { checkPasswordResetRateLimit } from "./rate-limit"

export type PasswordResetRequestResult =
  | { status: "accepted"; retryAfterSeconds: number }
  | { status: "cooldown"; retryAfterSeconds: number }
  | { status: "rate-limited" }

export async function requestPasswordReset(
  email: string,
): Promise<PasswordResetRequestResult> {
  const rateLimit = await checkPasswordResetRateLimit(email)

  if (rateLimit.limitedByIp) return { status: "rate-limited" }
  if (!rateLimit.acquired) {
    return {
      status: "cooldown",
      retryAfterSeconds: rateLimit.retryAfterSeconds,
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
          console.error(
            "Failed to clean up password reset token:",
            cleanupError,
          )
        }
      }
    })
  } else {
    await createDiscardedPasswordResetToken()
  }

  return {
    status: "accepted",
    retryAfterSeconds: rateLimit.retryAfterSeconds,
  }
}
