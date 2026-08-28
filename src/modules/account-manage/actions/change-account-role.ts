"use server"

import type { UserRole } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"
import { revokeUserSessions } from "@/modules/auth/data/session"

import { ACCOUNT_ROUTE_CONFIG } from "../constants/account-route-role"
import { changeAccountRoleSchema } from "../schemas/account-manage.schema"
import type {
  AccountActionResult,
  AccountRouteRole,
} from "../types/managed-account"
import { revalidateAccountRoutes } from "./revalidate-account-routes"

export async function changeAccountRoleAction(
  input: unknown,
): Promise<AccountActionResult> {
  await requireRole(["SUPERADMIN"])

  const parsed = changeAccountRoleSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data account tidak valid.",
    }
  }

  const { id, routeRole, targetRole } = parsed.data

  try {
    const nextRouteRole = await prisma.$transaction(async (transaction) => {
      const account = await transaction.user.findFirst({
        where: {
          id,
          role: {
            in: ACCOUNT_ROUTE_CONFIG[routeRole].databaseRoles as UserRole[],
          },
          deletedAt: null,
        },
        select: { role: true },
      })

      if (!account) return null

      const validTransition =
        (account.role === "USER" && targetRole === "ADMIN") ||
        (account.role === "ADMIN" && targetRole === "USER")

      if (!validTransition) return null

      await transaction.user.update({
        where: { id },
        data: { role: targetRole },
      })

      return (targetRole === "USER" ? "user" : "admin") as AccountRouteRole
    })

    if (!nextRouteRole) {
      return {
        success: false,
        message:
          "Perubahan role hanya tersedia antara User dan Admin. SuperAdmin tidak dapat diubah.",
      }
    }

    await revokeUserSessions(id)

    revalidateAccountRoutes(routeRole, id)
    revalidateAccountRoutes(nextRouteRole, id)

    return {
      success: true,
      message:
        targetRole === "ADMIN"
          ? "User berhasil dipromosikan menjadi Admin."
          : "Admin berhasil diubah menjadi User.",
      nextRouteRole,
    }
  } catch (error) {
    console.error("Failed to change managed account role:", error)
    return {
      success: false,
      message: "Role account gagal diperbarui. Silakan coba lagi.",
    }
  }
}
