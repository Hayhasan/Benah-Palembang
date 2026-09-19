import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { absoluteUrl, SITE_NAME } from "@/lib/seo/config"
import { BreadcrumbJsonLd, ProfileJsonLd } from "@/lib/seo/json-ld"
import { PublicProfilePage } from "@/modules/profile/components/public-profile-page"
import { getPublicProfile } from "@/modules/profile/data/get-public-profile"

interface PageProps {
  params: Promise<{ username: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { username } = await params
  const profile = await getPublicProfile(username)

  if (!profile) return {}

  const title = `Profil ${profile.name} - ${profile.roleLabel}`
  const description =
    profile.bio ||
    `Baca artikel dan liputan karya ${profile.name} di Benah Palembang.`
  const url = absoluteUrl(`/penulis/${username}`)
  const imageUrl = profile.avatarUrl

  return {
    title,
    description,
    keywords: [
      profile.name,
      username,
      "Penulis Benah Palembang",
      "Kontributor Benah",
      "Jurnalis Palembang",
      "Benah Palembang",
      "Palembang",
    ],
    alternates: {
      canonical: `/penulis/${username}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "profile",
      locale: "id_ID",
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: profile.name,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function Page() {
  notFound()
}

