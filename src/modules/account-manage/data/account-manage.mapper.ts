import "server-only"

import type { Prisma } from "@prisma/client"

import type {
  ManagedAccountDetail,
  ManagedAccountListItem,
} from "../types/managed-account"

export const managedAccountListSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  isBanned: true,
  createdAt: true,
} satisfies Prisma.UserSelect

export const managedAccountDetailSelect = {
  ...managedAccountListSelect,
  bannerUrl: true,
  bio: true,
  whatsappCountryCode: true,
  whatsappNumber: true,
  instagramUrl: true,
  xUrl: true,
  linkedinUrl: true,
  bannedAt: true,
  updatedAt: true,
} satisfies Prisma.UserSelect

type AccountListRecord = Prisma.UserGetPayload<{
  select: typeof managedAccountListSelect
}>

type AccountDetailRecord = Prisma.UserGetPayload<{
  select: typeof managedAccountDetailSelect
}>

const dateFormatter = new Intl.DateTimeFormat("id-ID", {
  day: "2-digit",
  month: "short",
  year: "numeric",
  timeZone: "Asia/Jakarta",
})

export function mapManagedAccountListItem(
  account: AccountListRecord,
): ManagedAccountListItem {
  return {
    id: account.id,
    name: account.name,
    email: account.email,
    role: account.role,
    avatarUrl: account.avatarUrl,
    isBanned: account.isBanned,
    createdAt: account.createdAt.toISOString(),
    createdAtLabel: dateFormatter.format(account.createdAt),
    lastLoginAt: null,
  }
}

export function mapManagedAccountDetail(
  account: AccountDetailRecord,
): ManagedAccountDetail {
  return {
    ...mapManagedAccountListItem(account),
    bannerUrl: account.bannerUrl,
    bio: account.bio,
    whatsappCountryCode: account.whatsappCountryCode,
    whatsappNumber: account.whatsappNumber,
    instagramUrl: account.instagramUrl,
    xUrl: account.xUrl,
    linkedinUrl: account.linkedinUrl,
    bannedAt: account.bannedAt?.toISOString() ?? null,
    updatedAt: account.updatedAt.toISOString(),
    updatedAtLabel: dateFormatter.format(account.updatedAt),
  }
}
