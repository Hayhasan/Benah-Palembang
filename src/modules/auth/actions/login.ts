"use server"

import { headers } from "next/headers"
import { redirect } from "next/navigation"

import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { recordLoginActivity } from "../data/activity"
import { findLoginAccount } from "../data/auth-account"
import { verifyPassword } from "../data/password"
import {
  checkLoginRateLimit,
  clearEmailRateLimit,
} from "../data/rate-limit"
import { sanitizeReturnPath } from "../data/return-path"
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
  const returnPath = sanitizeReturnPath(
    typeof formData.get("from") === "string"
      ? String(formData.get("from"))
      : null,
  )

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

      const requestHeaders = await headers()
      const rawIp =
        requestHeaders.get("x-forwarded-for")?.split(",")[0]?.trim() ||
        requestHeaders.get("x-real-ip") ||
        requestHeaders.get("cf-connecting-ip") ||
        null
      const ip = !rawIp && process.env.NODE_ENV === "development" ? "127.0.0.1" : rawIp
      const userAgent = requestHeaders.get("user-agent") || null

      await recordActivityLog({
        userId: account.id,
        userName: account.name,
        userRole: account.role,
        action: "LOGIN",
        module: "AUTH",
        description: `Pengguna '${account.name}' (${account.email}) berhasil login ke dashboard`,
        afterState: { ip, device: userAgent },
        ipAddress: ip,
        userAgent,
      })
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

  redirect(returnPath ?? "/dashboard")
}
