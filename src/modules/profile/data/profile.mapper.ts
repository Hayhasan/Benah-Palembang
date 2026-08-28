import "server-only"

import type { Prisma } from "@prisma/client"

import type { ProfileData } from "../types/profile"

export const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  bannerUrl: true,
  bio: true,
  whatsappCountryCode: true,
  whatsappNumber: true,
  instagramUrl: true,
  xUrl: true,
  linkedinUrl: true,
} satisfies Prisma.UserSelect

type ProfileRecord = Prisma.UserGetPayload<{
  select: typeof profileSelect
}>

export function mapProfile(record: ProfileRecord): ProfileData {
  return {
    id: record.id,
    name: record.name,
    email: record.email,
    role: record.role,
    avatarUrl: record.avatarUrl,
    bannerUrl: record.bannerUrl,
    bio: record.bio,
    whatsappCountryCode: record.whatsappCountryCode,
    whatsappNumber: record.whatsappNumber,
    instagramUrl: record.instagramUrl,
    xUrl: record.xUrl,
    linkedinUrl: record.linkedinUrl,
  }
}
