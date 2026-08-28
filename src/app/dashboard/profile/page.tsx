import { requireCurrentUser } from "@/modules/auth/data/session-dal"
import { ProfilePage } from "@/modules/profile/components/profile-page"
import { getCurrentProfile } from "@/modules/profile/data/get-current-profile"

export default async function Page() {
  await requireCurrentUser()

  const profile = await getCurrentProfile()

  return <ProfilePage initialProfile={profile} />
}
