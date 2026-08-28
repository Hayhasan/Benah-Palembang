"use server"

import type { UserRole } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"

import { ACCOUNT_ROUTE_CONFIG } from "../constants/account-route-role"
import { setAccountBanStatusSchema } from "../schemas/account-manage.schema"
import type { AccountActionResult } from "../types/managed-account"
import { revalidateAccountRoutes } from "./revalidate-account-routes"

export async function setAccountBanStatusAction(
  input: unknown,
): Promise<AccountActionResult> {
  // TODO(auth): Require a server session with account-management permission.
  const parsed = setAccountBanStatusSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data account tidak valid.",
    }
  }

  const { id, routeRole, isBanned } = parsed.data

  try {
    const account = await prisma.user.findFirst({
      where: {
        id,
        role: {
          in: ACCOUNT_ROUTE_CONFIG[routeRole].databaseRoles as UserRole[],
        },
        deletedAt: null,
      },
      select: { role: true },
    })

    if (!account) {
      return {
        success: false,
        message: "Account tidak ditemukan atau sudah berpindah role.",
      }
    }

    if (account.role === "SUPERADMIN") {
      return {
        success: false,
        message: "SuperAdmin tidak dapat di-ban atau di-unban.",
      }
    }

    const result = await prisma.user.updateMany({
      where: {
        id,
        role: account.role,
        deletedAt: null,
      },
      data: {
        isBanned,
        bannedAt: isBanned ? new Date() : null,
      },
    })

    if (result.count === 0) {
      return {
        success: false,
        message: "Status account berubah sebelum proses selesai. Silakan coba lagi.",
      }
    }

    revalidateAccountRoutes(routeRole, id)

    return {
      success: true,
      message: isBanned
        ? "Account berhasil di-banned."
        : "Account berhasil di-unban.",
    }
  } catch (error) {
    console.error("Failed to update account ban status:", error)
    return {
      success: false,
      message: "Status account gagal diperbarui. Silakan coba lagi.",
    }
  }
}
