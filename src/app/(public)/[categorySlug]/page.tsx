import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { absoluteUrl, SITE_NAME } from "@/lib/seo/config"
import { BreadcrumbJsonLd } from "@/lib/seo/json-ld"
import { getPublicArticlesByCategory } from "@/modules/article/data/get-public-articles-by-category"
import { ArticleCategoryPage } from "@/modules/website-content/components/article-category-page"
import { getArticleCategoryPage } from "@/modules/website-content/data/get-article-category-page"

interface PageProps {
  params: Promise<{ categorySlug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { categorySlug } = await params
  const data = await getArticleCategoryPage(categorySlug)

  if (!data) return {}

  const title = `${data.category} Palembang - Info, Berita & Cerita Kota`
  const description =
    data.heroSlides?.[0]?.description ||
    `Kumpulan artikel, info, dan liputan mendalam seputar ${data.category} di kota Palembang persembahan Benah Palembang.`

  return {
    title,
    description,
    keywords: [
      data.category,
      `${data.category} Palembang`,
      "Benah Palembang",
      "Info Palembang",
      "Berita Palembang",
      "Cerita Palembang",
      "Palembang",
    ],
    alternates: {
      canonical: `/${categorySlug}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url: absoluteUrl(`/${categorySlug}`),
      siteName: SITE_NAME,
      type: "website",
      locale: "id_ID",
      images: data.heroSlides?.[0]?.imageUrl
        ? [
            {
              url: data.heroSlides[0].imageUrl,
              alt: data.heroSlides[0].imageAlt || title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: data.heroSlides?.[0]?.imageUrl ? [data.heroSlides[0].imageUrl] : undefined,
    },
  }
}

import { getCollaborationPage } from "@/modules/website-content/data/get-collaboration-page"

export default async function Page({ params }: PageProps) {
  const { categorySlug } = await params
  const [data, articles, collaboration] = await Promise.all([
    getArticleCategoryPage(categorySlug),
    getPublicArticlesByCategory(categorySlug),
    getCollaborationPage(),
  ])

  if (!data) notFound()

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: data.category, url: `/${data.slug}` },
        ]}
      />
      <ArticleCategoryPage
        key={data.slug}
        data={data}
        articles={articles}
        contact={collaboration.contact}
      />
    </>
  )
}

