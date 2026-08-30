import { notFound } from "next/navigation"

import { PublicProfilePage } from "@/modules/profile/components/public-profile-page"
import { getPublicProfile } from "@/modules/profile/data/get-public-profile"

export default async function Page({
  params,
}: {
  params: Promise<{ username: string }>
}) {
  const { username } = await params
  const profile = await getPublicProfile(username)

  if (!profile) notFound()

  return <PublicProfilePage profile={profile} />
}
