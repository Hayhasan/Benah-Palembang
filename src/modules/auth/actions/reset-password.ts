"use server"

import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"

import { hashPassword } from "../data/password"
import {
  consumePasswordResetToken,
  getPasswordResetRecord,
  getPasswordResetTokenStatus,
  hashPasswordResetToken,
} from "../data/password-reset"
import { revokeUserSessions } from "../data/session"
import { resetPasswordSchema } from "../schemas/auth.schema"
import type { PasswordResetFormState } from "../types/password-reset"

export async function resetPasswordAction(
  _previousState: PasswordResetFormState,
  formData: FormData,
): Promise<PasswordResetFormState> {
  const parsed = resetPasswordSchema.safeParse({
    token: formData.get("token"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  if (!parsed.success) {
    return {
      message: "Periksa kembali password baru Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
    }
  }

  const { token, password } = parsed.data

  try {
    const tokenStatus = await getPasswordResetTokenStatus(token)
    if (tokenStatus.status !== "valid") {
      return {
        message:
          tokenStatus.status === "replaced"
            ? "Tautan ini sudah digantikan oleh permintaan reset password yang lebih baru."
            : tokenStatus.status === "used"
              ? "Tautan reset password ini sudah pernah digunakan."
              : "Tautan reset password tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.",
      }
    }

    const record = await getPasswordResetRecord(token)
    if (!record) {
      return {
        message:
          "Tautan reset password tidak valid atau sudah kedaluwarsa. Silakan minta tautan baru.",
      }
    }

    const account = await prisma.user.findFirst({
      where: {
        id: record.userId,
        isBanned: false,
        deletedAt: null,
      },
      select: { id: true },
    })
    if (!account) {
      return {
        message:
          "Akun tidak dapat menggunakan tautan reset password ini. Silakan hubungi administrator.",
      }
    }

    const passwordHash = await hashPassword(password)
    const tokenHash = hashPasswordResetToken(token)
    const consumeResult = await consumePasswordResetToken({
      userId: account.id,
      tokenHash,
    })

    if (consumeResult !== "consumed") {
      return {
        message:
          consumeResult === "replaced"
            ? "Tautan ini sudah digantikan oleh permintaan reset password yang lebih baru."
            : consumeResult === "used"
              ? "Tautan reset password ini sudah pernah digunakan."
              : "Tautan reset password tidak valid atau sudah kedaluwarsa.",
      }
    }

    await revokeUserSessions(account.id)

    const updated = await prisma.user.updateMany({
      where: {
        id: account.id,
        isBanned: false,
        deletedAt: null,
      },
      data: { password: passwordHash },
    })

    if (updated.count === 0) {
      return {
        message:
          "Password gagal diperbarui karena status akun berubah. Silakan minta tautan baru.",
      }
    }
  } catch (error) {
    console.error("Failed to reset password:", error)
    return {
      message: "Password belum dapat diperbarui. Silakan coba lagi.",
    }
  }

  redirect("/login?reset=success")
}
