import { ProfilePage } from "@/modules/profile/components/profile-page"
import { getCurrentProfile } from "@/modules/profile/data/get-current-profile"

export default async function Page() {
  const profile = await getCurrentProfile()

  return <ProfilePage initialProfile={profile} />
}
