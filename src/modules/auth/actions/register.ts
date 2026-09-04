"use server"

import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"

import { recordLoginActivity } from "../data/activity"
import { generateUniqueUsername } from "../data/generate-unique-username"
import { hashPassword } from "../data/password"
import {
  checkRegisterRateLimit,
  clearEmailRateLimit,
} from "../data/rate-limit"
import { sanitizeReturnPath } from "../data/return-path"
import { createSession } from "../data/session"
import { registerSchema } from "../schemas/auth.schema"
import type { AuthActionState } from "../types/auth-action-state"

export async function registerAction(
  _previousState: AuthActionState,
  formData: FormData,
): Promise<AuthActionState> {
  const parsed = registerSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  const rawName = formData.get("name")
  const rawEmail = formData.get("email")
  const values = {
    name: typeof rawName === "string" ? rawName.trim() : "",
    email:
      typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "",
  }

  if (!parsed.success) {
    return {
      message: "Periksa kembali data pendaftaran Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    }
  }

  const { name, email, password } = parsed.data
  const returnPath = sanitizeReturnPath(
    typeof formData.get("from") === "string"
      ? String(formData.get("from"))
      : null,
  )
  let accountId: string

  try {
    const rateLimit = await checkRegisterRateLimit(email)
    if (rateLimit.limited) {
      return {
        message: "Terlalu banyak percobaan pendaftaran. Coba lagi beberapa saat.",
        values: { name, email },
      }
    }

    const passwordHash = await hashPassword(password)
    const username = await generateUniqueUsername(prisma, name)
    const account = await prisma.user.create({
      data: {
        name,
        username,
        email,
        password: passwordHash,
        role: "USER",
      },
      select: { id: true, role: true },
    })
    accountId = account.id

    try {
      await createSession({ userId: account.id, role: account.role })
    } catch (error) {
      console.error("Failed to create session after registration:", error)
      return {
        accountCreated: true,
        message:
          "Akun berhasil dibuat, tetapi login otomatis gagal. Silakan login dengan akun baru Anda.",
        values: { name, email },
      }
    }

    await clearEmailRateLimit(rateLimit.emailKey)
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        message: "Email sudah terdaftar.",
        fieldErrors: { email: ["Email sudah terdaftar."] },
        values: { name, email },
      }
    }

    console.error("Failed to register:", error)
    return {
      message: "Pendaftaran belum dapat diproses. Silakan coba lagi.",
      values: { name, email },
    }
  }

  try {
    await recordLoginActivity(accountId)
  } catch (error) {
    console.error("Failed to record registration activity:", error)
  }

  redirect(returnPath ?? "/dashboard")
}
