import "server-only"

import type { UserRole } from "@prisma/client"
import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"

import { ACCOUNT_ROUTE_CONFIG } from "../constants/account-route-role"
import { accountMutationSchema } from "../schemas/account-manage.schema"
import type {
  AccountRouteRole,
  ManagedAccountDetail,
} from "../types/managed-account"
import {
  managedAccountDetailSelect,
  mapManagedAccountDetail,
} from "./account-manage.mapper"

export async function getManagedAccount(
  routeRole: AccountRouteRole,
  id: string,
): Promise<ManagedAccountDetail | null> {
  await connection()

  const parsed = accountMutationSchema.safeParse({ routeRole, id })
  if (!parsed.success) return null

  const account = await prisma.user.findFirst({
    where: {
      id: parsed.data.id,
      role: {
        in: ACCOUNT_ROUTE_CONFIG[routeRole].databaseRoles as UserRole[],
      },
      deletedAt: null,
    },
    select: managedAccountDetailSelect,
  })

  return account ? mapManagedAccountDetail(account) : null
}
