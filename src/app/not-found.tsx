import { Header } from "@/components/ui/navbar"
import { PublicFooter } from "@/features/public/components/PublicFooter"
import { PublicNotFound } from "@/features/public/components/public-not-found"
import { AuthSessionProvider } from "@/modules/auth/components/auth-session-provider"
import { getCurrentUser } from "@/modules/auth/data/session-dal"
import { HeaderFooterContentProvider } from "@/modules/website-content/components/header-footer-content-provider"
import { getHeaderFooterContent } from "@/modules/website-content/data/get-header-footer-content"

export default async function NotFoundPage() {
  const [user, headerFooterContent] = await Promise.all([
    getCurrentUser(),
    getHeaderFooterContent(),
  ])

  return (
    <AuthSessionProvider initialUser={user}>
      <HeaderFooterContentProvider data={headerFooterContent}>
        <div className="bg-white text-zinc-900 min-h-screen flex flex-col justify-between">
          <Header overlay={false} />
          <PublicNotFound />
          <PublicFooter />
        </div>
      </HeaderFooterContentProvider>
    </AuthSessionProvider>
  )
}
