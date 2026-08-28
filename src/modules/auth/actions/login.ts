"use server"

import { redirect } from "next/navigation"

import { recordLoginActivity } from "../data/activity"
import { findLoginAccount } from "../data/auth-account"
import { verifyPassword } from "../data/password"
import {
  checkLoginRateLimit,
  clearEmailRateLimit,
} from "../data/rate-limit"
import { createSession } from "../data/session"
import { loginSchema } from "../schemas/auth.schema"
import type { AuthActionState } from "../types/auth-action-state"

const DUMMY_PASSWORD_HASH =
  "$2b$12$tbrVIKL/W9Wev8czDfqIS.lzqylPyKTKXVmqvNlJemwq.5V2GB3rO"

export async function loginAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = loginSchema.safeParse({
    email: formData.get("email"),
    password: formData.get("password"),
  })

  if (!parsed.success) {
    return {
      message: "Periksa kembali data login Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values: {
        email:
          typeof formData.get("email") === "string"
            ? String(formData.get("email")).trim().toLowerCase()
            : "",
      },
    }
  }

  const { email, password } = parsed.data

  try {
    const rateLimit = await checkLoginRateLimit(email)
    if (rateLimit.limited) {
      return {
        message: "Terlalu banyak percobaan login. Coba lagi beberapa saat.",
        values: { email },
      }
    }

    const account = await findLoginAccount(email)
    const passwordMatches = await verifyPassword(
      password,
      account?.password ?? DUMMY_PASSWORD_HASH,
    )

    if (!account || !passwordMatches) {
      return {
        message: "Email atau password salah.",
        values: { email },
      }
    }

    if (account.deletedAt) {
      return {
        message: "Akun Anda sudah dihapus dan tidak dapat digunakan.",
        values: { email },
      }
    }

    if (account.isBanned) {
      return {
        message: "Akun Anda telah diblokir. Hubungi administrator.",
        values: { email },
      }
    }

    await createSession({ userId: account.id, role: account.role })
    await clearEmailRateLimit(rateLimit.emailKey)

    try {
      await recordLoginActivity(account.id)
    } catch (error) {
      console.error("Failed to record login activity:", error)
    }
  } catch (error) {
    console.error("Failed to login:", error)
    return {
      message: "Login belum dapat diproses. Silakan coba lagi.",
      values: { email },
    }
  }

  redirect("/dashboard")
}
