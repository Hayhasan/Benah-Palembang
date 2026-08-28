"use server"

import type { UserRole } from "@prisma/client"

import { prisma } from "@/lib/db/prisma"
import { recordActivityLog } from "@/modules/activity-log/data/record-activity-log"
import { requireRole } from "@/modules/auth/data/session-dal"
import { revokeUserSessions } from "@/modules/auth/data/session"

import { ACCOUNT_ROUTE_CONFIG } from "../constants/account-route-role"
import { setAccountBanStatusSchema } from "../schemas/account-manage.schema"
import type { AccountActionResult } from "../types/managed-account"
import { revalidateAccountRoutes } from "./revalidate-account-routes"

export async function setAccountBanStatusAction(
  input: unknown,
): Promise<AccountActionResult> {
  const actor = await requireRole(["SUPERADMIN"])

  const parsed = setAccountBanStatusSchema.safeParse(input)
  if (!parsed.success) {
    return {
      success: false,
      message: parsed.error.issues[0]?.message ?? "Data account tidak valid.",
    }
  }

  const { id, routeRole, isBanned } = parsed.data

  try {
    const result = await prisma.$transaction(async (tx) => {
      const account = await tx.user.findFirst({
        where: {
          id,
          role: {
            in: ACCOUNT_ROUTE_CONFIG[routeRole].databaseRoles as UserRole[],
          },
          deletedAt: null,
        },
        select: { id: true, name: true, email: true, role: true, isBanned: true },
      })

      if (!account) return { kind: "not-found" as const }
      if (account.role === "SUPERADMIN") return { kind: "protected" as const }

      const updateResult = await tx.user.updateMany({
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

      if (updateResult.count === 0) return { kind: "conflict" as const }

      await recordActivityLog(
        {
          userId: actor.id,
          userName: actor.name,
          userRole: actor.role,
          action: isBanned ? "BAN" : "UNBAN",
          module: "ACCOUNT",
          description: isBanned
            ? `Memblokir akun pengguna '${account.name}' (${account.email})`
            : `Membuka blokir akun pengguna '${account.name}' (${account.email})`,
          beforeState: { isBanned: account.isBanned },
          afterState: { isBanned },
        },
        tx,
      )

      return { kind: "ok" as const }
    })

    if (result.kind === "not-found") {
      return {
        success: false,
        message: "Account tidak ditemukan atau sudah berpindah role.",
      }
    }

    if (result.kind === "protected") {
      return {
        success: false,
        message: "SuperAdmin tidak dapat di-ban atau di-unban.",
      }
    }

    if (result.kind === "conflict") {
      return {
        success: false,
        message: "Status account berubah sebelum proses selesai. Silakan coba lagi.",
      }
    }

    if (isBanned) await revokeUserSessions(id)

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
