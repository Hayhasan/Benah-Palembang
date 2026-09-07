import type { Metadata } from "next"

import { absoluteUrl, SITE_NAME } from "@/lib/seo/config"
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld"
import { CollaborationPage } from "@/modules/website-content/components/collaboration-page"
import { getCollaborationPage } from "@/modules/website-content/data/get-collaboration-page"

export const metadata: Metadata = {
  title: "Kolaborasi & Kemitraan Media Palembang",
  description:
    "Jalin kolaborasi dan kemitraan strategis bersama Benah Palembang untuk peliputan berita, publikasi acara, riset, serta inisiatif kreatif di kota Palembang.",
  keywords: [
    "Kolaborasi Benah Palembang",
    "Kemitraan Media Palembang",
    "Liputan Media Palembang",
    "Kerja Sama Komunitas Palembang",
    "Media Partner Palembang",
    "Benah Palembang",
    "Palembang",
  ],
  alternates: {
    canonical: "/kolaborasi",
  },
  openGraph: {
    title: `Kolaborasi Bersama ${SITE_NAME}`,
    description:
      "Jalin kolaborasi dan kemitraan media kreatif bersama Benah Palembang.",
    url: absoluteUrl("/kolaborasi"),
    siteName: SITE_NAME,
    type: "website",
    locale: "id_ID",
  },
}

export default async function Page() {
  const data = await getCollaborationPage()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: "Kolaborasi", url: "/kolaborasi" },
        ]}
      />
      <CollaborationPage data={data} />
    </>
  )
}

