import { Header } from "@/components/ui/navbar"
import { AuthSessionProvider } from "@/modules/auth/components/auth-session-provider"
import { getCurrentUser } from "@/modules/auth/data/session-dal"
import { HeaderFooterContentProvider } from "@/modules/website-content/components/header-footer-content-provider"
import { getHeaderFooterContent } from "@/modules/website-content/data/get-header-footer-content"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const [headerFooterContent, user] = await Promise.all([
    getHeaderFooterContent(),
    getCurrentUser(),
  ])

  return (
    <AuthSessionProvider initialUser={user}>
      <HeaderFooterContentProvider data={headerFooterContent}>
        <Header />
        {children}
      </HeaderFooterContentProvider>
    </AuthSessionProvider>
  )
}
