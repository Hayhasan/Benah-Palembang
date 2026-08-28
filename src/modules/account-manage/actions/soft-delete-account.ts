"use server"

import type { UserRole } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"
import { revokeUserSessions } from "@/modules/auth/data/session"

import { ACCOUNT_ROUTE_CONFIG } from "../constants/account-route-role"
import { accountMutationSchema } from "../schemas/account-manage.schema"
import type { AccountActionResult } from "../types/managed-account"
import { revalidateAccountRoutes } from "./revalidate-account-routes"

export async function softDeleteAccountAction(
  input: unknown,
): Promise<AccountActionResult> {
  await requireRole(["SUPERADMIN"])

  const parsed = accountMutationSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data account tidak valid.",
    }
  }

  const { id, routeRole } = parsed.data

  try {
    const deleted = await prisma.$transaction(async (transaction) => {
      const account = await transaction.user.findFirst({
        where: {
          id,
          role: {
            in: ACCOUNT_ROUTE_CONFIG[routeRole].databaseRoles as UserRole[],
          },
          deletedAt: null,
        },
        select: {
          id: true,
          email: true,
          originalEmail: true,
          role: true,
        },
      })

      if (!account) return "not-found" as const
      if (account.role === "SUPERADMIN") return "protected" as const

      const result = await transaction.user.updateMany({
        where: {
          id: account.id,
          role: account.role,
          deletedAt: null,
        },
        data: {
          originalEmail: account.originalEmail ?? account.email,
          email: `${account.id}@deleted.invalid`,
          deletedAt: new Date(),
        },
      })

      if (result.count === 0) return "not-found" as const

      return "deleted" as const
    })

    if (deleted === "not-found") {
      return {
        success: false,
        message: "Account tidak ditemukan atau sudah dihapus.",
      }
    }

    if (deleted === "protected") {
      return {
        success: false,
        message: "SuperAdmin tidak dapat dihapus.",
      }
    }

    await revokeUserSessions(id)

    revalidateAccountRoutes(routeRole, id)

    return {
      success: true,
      message: "Account berhasil dihapus.",
    }
  } catch (error) {
    console.error("Failed to soft-delete managed account:", error)
    return {
      success: false,
      message: "Account gagal dihapus. Silakan coba lagi.",
    }
  }
}
