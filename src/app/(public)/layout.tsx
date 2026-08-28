import { Header } from "@/components/ui/navbar"
import { HeaderFooterContentProvider } from "@/modules/website-content/components/header-footer-content-provider"
import { getHeaderFooterContent } from "@/modules/website-content/data/get-header-footer-content"

export default async function PublicLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const headerFooterContent = await getHeaderFooterContent()

  return (
    <HeaderFooterContentProvider data={headerFooterContent}>
      <Header />
      {children}
    </HeaderFooterContentProvider>
  )
}
