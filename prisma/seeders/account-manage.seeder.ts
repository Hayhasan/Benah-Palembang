import type { PrismaClient, UserRole } from "@prisma/client"

import {
  DEFAULT_ADMIN_ACCOUNTS,
  DEFAULT_USER_ACCOUNTS,
  type AccountMock,
} from "../../src/modules/account-manage/constants/default-accounts"
import { hashPassword } from "../../src/modules/auth/data/password"

const DEFAULT_ACCOUNT_PASSWORD = "12345678"
const DEFAULT_BANNER_URL =
  "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop"

const monthIndexes: Record<string, number> = {
  Jan: 0,
  Feb: 1,
  Mar: 2,
  Apr: 3,
  May: 4,
  Jun: 5,
  Jul: 6,
  Aug: 7,
  Sep: 8,
  Oct: 9,
  Nov: 10,
  Dec: 11,
}

const roleToDatabase: Record<AccountMock["role"], UserRole> = {
  User: "USER",
  Admin: "ADMIN",
  SuperAdmin: "SUPERADMIN",
}

function parseCreatedAt(value: string) {
  const [day, month, year] = value.split(" ")
  const monthIndex = monthIndexes[month]

  if (!day || monthIndex === undefined || !year) {
    throw new Error(`[account-manage] invalid mock date: ${value}`)
  }

  return new Date(Date.UTC(Number(year), monthIndex, Number(day)))
}

function seedUsernameFromEmail(email: string) {
  return email
    .split("@")[0]
    .toLowerCase()
    .replace(/[^a-z0-9._]+/g, "_")
    .replace(/^\.+|\.+$/g, "")
    .replace(/\.\.+/g, ".")
    .slice(0, 30) || "user"
}

function reserveUsername(base: string, occupiedUsernames: Set<string>) {
  let username = base
  let suffixNumber = 2

  while (occupiedUsernames.has(username)) {
    const suffix = `_${suffixNumber}`
    username = `${base.slice(0, 30 - suffix.length)}${suffix}`
    suffixNumber += 1
  }

  occupiedUsernames.add(username)
  return username
}

function toSeedData(account: AccountMock, password: string, username: string) {
  const createdAt = parseCreatedAt(account.date)

  return {
    name: account.name,
    username,
    email: account.email.toLowerCase(),
    password,
    role: roleToDatabase[account.role],
    avatarUrl: account.avatar,
    bannerUrl: DEFAULT_BANNER_URL,
    bio: "Pengguna aktif di platform Benah Palembang. Tertarik dengan cerita-cerita kota dan kebudayaan lokal.",
    whatsappCountryCode: "62",
    whatsappNumber: "8123456789",
    instagramUrl: null,
    xUrl: null,
    linkedinUrl: null,
    isBanned: account.isBanned,
    bannedAt: account.isBanned ? createdAt : null,
    createdAt,
    deletedAt: null,
  }
}

export async function seedAccountManage(prisma: PrismaClient) {
  const accounts = [...DEFAULT_USER_ACCOUNTS, ...DEFAULT_ADMIN_ACCOUNTS]
  const canonicalEmails = accounts.map((account) => account.email.toLowerCase())
  const existingAccounts = await prisma.user.findMany({
    where: {
      OR: [
        { email: { in: canonicalEmails } },
        { originalEmail: { in: canonicalEmails } },
      ],
    },
    select: {
      email: true,
      originalEmail: true,
      username: true,
    },
  })
  const occupiedEmails = new Set(
    existingAccounts.flatMap((account) =>
      [account.email, account.originalEmail].filter(
        (email): email is string => email !== null,
      ),
    ),
  )
  const occupiedUsernames = new Set(
    existingAccounts.map((account) => account.username),
  )
  const missingAccounts = accounts.filter(
    (account) => !occupiedEmails.has(account.email.toLowerCase()),
  )

  if (missingAccounts.length === 0) {
    console.log("[account-manage] skipped: all default accounts already exist")
    return
  }

  console.log(
    `[account-manage] creating ${missingAccounts.length} default accounts`,
  )

  const password = await hashPassword(DEFAULT_ACCOUNT_PASSWORD)
  const result = await prisma.user.createMany({
    data: missingAccounts.map((account) => {
      const username = reserveUsername(
        seedUsernameFromEmail(account.email),
        occupiedUsernames,
      )
      return toSeedData(account, password, username)
    }),
  })

  console.log(
    `[account-manage] created: ${result.count}, skipped: ${accounts.length - result.count}`,
  )
}
