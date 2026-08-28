import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { AuthSessionProvider } from "@/modules/auth/components/auth-session-provider"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

export default async function Layout({
  children,
}: {
  children: React.ReactNode
}) {
  const user = await requireCurrentUser()

  return (
    <AuthSessionProvider initialUser={user}>
      <DashboardLayout>{children}</DashboardLayout>
    </AuthSessionProvider>
  )
}
