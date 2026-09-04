import "server-only"

import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"
import { loginRedirectUrl } from "@/modules/auth/data/return-path"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import type { ProfileData } from "../types/profile"
import { mapProfile, profileSelect } from "./profile.mapper"

export async function getCurrentProfile(): Promise<ProfileData> {
  const actor = await requireCurrentUser()
  const profile = await prisma.user.findFirst({
    where: {
      id: actor.id,
      isBanned: false,
      deletedAt: null,
    },
    select: profileSelect,
  })

  if (!profile) redirect(await loginRedirectUrl("session-invalid"))

  return mapProfile(profile)
}
