import { Header } from "@/components/ui/navbar"
import { PublicScrollReveal } from "@/features/public/components/public-scroll-reveal"
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
    <>
      <script
        dangerouslySetInnerHTML={{
          __html: `(function(){document.documentElement.classList.add("motion-ready");window.setTimeout(function(){document.querySelectorAll(".reveal-on-scroll,.reveal-fade,.reveal-scale,.reveal-slide-left,.reveal-slide-right,.reveal-stagger,[data-reveal]").forEach(function(e){e.classList.add("is-revealed")})},2500)})();`,
        }}
      />
      <AuthSessionProvider initialUser={user}>
        <HeaderFooterContentProvider data={headerFooterContent}>
          <PublicScrollReveal />
          <Header />
          {children}
        </HeaderFooterContentProvider>
      </AuthSessionProvider>
    </>
  )
}
