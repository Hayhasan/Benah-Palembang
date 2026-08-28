"use server"

import { Prisma } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"
import { hashPassword } from "@/modules/auth/data/password"

import { createAccountSchema } from "../schemas/account-manage.schema"
import type { AccountActionResult } from "../types/managed-account"
import { revalidateAccountRoutes } from "./revalidate-account-routes"

export async function createAccountAction(
  input: unknown,
): Promise<AccountActionResult> {
  // TODO(auth): Require a server session with account-management permission.
  const parsed = createAccountSchema.safeParse(input)
  if (!parsed.success) {
    const issue = parsed.error.issues[0]
    return {
      success: false,
      message: issue?.message ?? "Data account tidak valid.",
      field: issue?.path.map(String).join("."),
    }
  }

  const data = parsed.data
  const allowedRole =
    (data.routeRole === "user" && data.role === "USER") ||
    (data.routeRole === "admin" &&
      (data.role === "ADMIN" || data.role === "SUPERADMIN"))

  if (!allowedRole) {
    return {
      success: false,
      message: "Role account tidak sesuai dengan halaman yang aktif.",
      field: "role",
    }
  }

  try {
    const password = await hashPassword(data.password)

    await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password,
        role: data.role,
      },
    })

    revalidateAccountRoutes()

    return {
      success: true,
      message:
        data.routeRole === "user"
          ? "User baru berhasil dibuat."
          : "Admin baru berhasil dibuat.",
    }
  } catch (error) {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === "P2002"
    ) {
      return {
        success: false,
        message: "Email sudah digunakan oleh account lain.",
        field: "email",
      }
    }

    console.error("Failed to create managed account:", error)
    return {
      success: false,
      message: "Account gagal dibuat. Silakan coba lagi.",
    }
  }
}
