import "server-only"

import { redirect } from "next/navigation"

import { prisma } from "@/lib/db/prisma"
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

  if (!profile) redirect("/login?reason=session-invalid")

  return mapProfile(profile)
}
