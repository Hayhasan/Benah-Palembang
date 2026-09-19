import type { Metadata } from "next"

import { SITE_NAME } from "@/lib/seo/config"
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld"
import { SearchResultsPage } from "@/modules/search/components/search-results-page"
import { searchPublicContent } from "@/modules/search/data/search-public-content"

interface PageProps {
  searchParams: Promise<{
    q?: string
  }>
}

export async function generateMetadata({
  searchParams,
}: PageProps): Promise<Metadata> {
  const { q } = await searchParams
  const query = q?.trim() || ""

  return {
    title: query ? `Pencarian: "${query}" | ${SITE_NAME}` : `Pencarian | ${SITE_NAME}`,
    description: `Hasil pencarian untuk "${query}" di ${SITE_NAME}. Temukan artikel, agenda kegiatan, dan karya kolaborasi Palembang.`,
    robots: {
      index: false,
      follow: true,
    },
  }
}

export default async function Page({ searchParams }: PageProps) {
  const { q } = await searchParams
  const query = q?.trim() || ""
  const results = await searchPublicContent(query, 24)

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Pencarian", url: `/search${query ? `?q=${encodeURIComponent(query)}` : ""}` },
        ]}
      />
      <SearchResultsPage initialResults={results} />
    </>
  )
}
