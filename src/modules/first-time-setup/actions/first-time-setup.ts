"use server"

import { Prisma } from "@prisma/client"
import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { recordLoginActivity } from "@/modules/auth/data/activity"
import { hashPassword } from "@/modules/auth/data/password"
import { createSession } from "@/modules/auth/data/session"

import { firstTimeSetupSchema } from "../schemas/first-time-setup.schema"
import type { FirstTimeSetupActionState } from "../types/first-time-setup"

export async function firstTimeSetupAction(
  _previousState: FirstTimeSetupActionState,
  formData: FormData,
): Promise<FirstTimeSetupActionState> {
  const parsed = firstTimeSetupSchema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    password: formData.get("password"),
    confirmPassword: formData.get("confirmPassword"),
  })

  const rawName = formData.get("name")
  const rawEmail = formData.get("email")
  const values = {
    name: typeof rawName === "string" ? rawName.trim() : "",
    email: typeof rawEmail === "string" ? rawEmail.trim().toLowerCase() : "",
  }

  if (!parsed.success) {
    return {
      message: "Periksa kembali data pendaftaran SuperAdmin Anda.",
      fieldErrors: parsed.error.flatten().fieldErrors,
      values,
    }
  }

  const { name, email, password } = parsed.data
  let createdAccount: { id: string; role: "SUPERADMIN" }

  try {
    const passwordHash = await hashPassword(password)

    // Execute atomic creation & setup guard in transaction
    createdAccount = await prisma.$transaction(async (tx) => {
      const existingUserCount = await tx.user.count({
        where: { deletedAt: null },
      })

      if (existingUserCount > 0) {
        throw new Error("SETUP_ALREADY_COMPLETED")
      }

      const account = await tx.user.create({
        data: {
          name,
          email,
          password: passwordHash,
          role: "SUPERADMIN",
        },
        select: { id: true, role: true },
      })

      await recordActivityLog(
        {
          userId: account.id,
          userName: name,
          userRole: "SUPERADMIN",
          action: "CREATE",
          module: "AUTH",
          description: "Inisialisasi sistem: Akun SuperAdmin pertama berhasil dibuat",
          afterState: {
            email,
            role: "SUPERADMIN",
            name,
          },
        },
        tx,
      )

      return { id: account.id, role: "SUPERADMIN" as const }
    })

    // Establish Redis session & auth cookies
    try {
      await createSession({
        userId: createdAccount.id,
        role: createdAccount.role,
      })
    } catch (error) {
      console.error("Failed to create session after first time setup:", error)
      return {
        message:
          "Akun SuperAdmin berhasil dibuat, tetapi login otomatis gagal. Silakan login manual.",
        values: { name, email },
      }
    }
  } catch (error) {
    if (error instanceof Error && error.message === "SETUP_ALREADY_COMPLETED") {
      return {
        message: "Inisialisasi sistem sudah pernah selesai. Silakan login dengan akun yang terdaftar.",
        values: { name, email },
      }
    }

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

    console.error("Failed to complete first time setup:", error)
    return {
      message: "Inisialisasi sistem belum dapat diproses. Silakan coba lagi.",
      values: { name, email },
    }
  }

  try {
    await recordLoginActivity(createdAccount.id)
  } catch (error) {
    console.error("Failed to record setup login activity:", error)
  }

  redirect("/dashboard")
}
