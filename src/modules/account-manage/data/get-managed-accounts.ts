import "server-only"

import type { Prisma, UserRole } from "@prisma/client"
import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { getAccountActivities } from "@/modules/auth/data/activity"
import { requireRole } from "@/modules/auth/data/session-dal"

import { ACCOUNT_ROUTE_CONFIG } from "../constants/account-route-role"
import { accountListQuerySchema } from "../schemas/account-manage.schema"
import type {
  AccountRouteRole,
  ManagedAccountList,
} from "../types/managed-account"
import {
  managedAccountListSelect,
  mapManagedAccountListItem,
} from "./account-manage.mapper"

const ACCOUNT_PAGE_SIZE = 25

interface GetManagedAccountsInput {
  routeRole: AccountRouteRole
  q?: string
  page?: number | string
}

export async function getManagedAccounts(
  input: GetManagedAccountsInput,
): Promise<ManagedAccountList> {
  await requireRole(["SUPERADMIN"])
  await connection()

  const query = accountListQuerySchema.parse({ q: input.q, page: input.page })
  const databaseRoles = ACCOUNT_ROUTE_CONFIG[input.routeRole]
    .databaseRoles as UserRole[]
  const idQuery = query.q
    ? accountListQuerySchema.shape.q.safeParse(query.q).success &&
      /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        query.q,
      )
      ? query.q
      : null
    : null
  const where: Prisma.UserWhereInput = {
    role: { in: databaseRoles },
    deletedAt: null,
    ...(query.q
      ? {
          OR: [
            ...(idQuery ? [{ id: idQuery }] : []),
            { name: { contains: query.q, mode: "insensitive" as const } },
            { email: { contains: query.q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  }

  const result = await prisma.$transaction(async (transaction) => {
    const totalItems = await transaction.user.count({ where })
    const totalPages = Math.ceil(totalItems / ACCOUNT_PAGE_SIZE)
    const page = totalPages === 0 ? 1 : Math.min(query.page, totalPages)
    const items = await transaction.user.findMany({
      where,
      select: managedAccountListSelect,
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      skip: (page - 1) * ACCOUNT_PAGE_SIZE,
      take: ACCOUNT_PAGE_SIZE,
    })

    return {
      items: items.map(mapManagedAccountListItem),
      page,
      pageSize: ACCOUNT_PAGE_SIZE,
      totalItems,
      totalPages,
      query: query.q,
    }
  })

  const activities = await getAccountActivities(result.items.map(({ id }) => id))
  return {
    ...result,
    generatedAt: new Date().toISOString(),
    items: result.items.map((account) => {
      const activity = activities.get(account.id)
      return {
        ...account,
        lastActivityAt: activity?.lastActivityAt ?? null,
        isOnline: activity?.isOnline ?? false,
      }
    }),
  }
}
