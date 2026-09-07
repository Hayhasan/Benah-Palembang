import type { Metadata } from "next"
import { notFound } from "next/navigation"

import { absoluteUrl, SITE_NAME } from "@/lib/seo/config"
import { BreadcrumbJsonLd, NewsArticleJsonLd } from "@/lib/seo/json-ld"
import { PublicArticleDetail } from "@/modules/article/components/public-article-detail"
import {
  getPublicArticle,
  getPublicArticleMeta,
} from "@/modules/article/data/get-public-article"

interface PageProps {
  params: Promise<{ slug: string }>
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params
  const article = await getPublicArticleMeta(slug)

  if (!article) return {}

  const title = article.title
  const description = article.excerpt
  const url = absoluteUrl(`/artikel/${slug}`)
  const imageUrl = article.coverImageUrl
  const category = article.websiteArticleSection?.categoryHeroTitle || "Artikel"
  const tagLabels = article.tags.map((t) => t.label)

  return {
    title,
    description,
    keywords: [
      ...tagLabels,
      category,
      "Benah Palembang",
      "Berita Palembang",
      "Info Palembang",
      "Cerita Palembang",
      "Palembang",
    ],
    authors: [{ name: article.author.name }],
    alternates: {
      canonical: `/artikel/${slug}`,
    },
    openGraph: {
      title: `${title} | ${SITE_NAME}`,
      description,
      url,
      siteName: SITE_NAME,
      type: "article",
      locale: "id_ID",
      publishedTime: article.publishedAt?.toISOString(),
      modifiedTime: (article.updatedAt || article.publishedAt)?.toISOString(),
      authors: [article.author.name],
      tags: tagLabels,
      images: imageUrl
        ? [
            {
              url: imageUrl,
              alt: title,
            },
          ]
        : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${SITE_NAME}`,
      description,
      images: imageUrl ? [imageUrl] : undefined,
    },
  }
}

export default async function Page({ params }: PageProps) {
  const { slug } = await params
  const data = await getPublicArticle(slug)

  if (!data) notFound()

  const { article } = data

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: "Beranda", url: "/" },
          { name: article.category, url: `/${article.categorySlug}` },
          { name: article.title, url: `/artikel/${article.slug}` },
        ]}
      />
      <NewsArticleJsonLd
        title={article.title}
        description={article.excerpt}
        coverImageUrl={article.coverImageUrl}
        publishedAt={article.publishedAt || new Date().toISOString()}
        authorName={article.author.name}
        authorUrl={`/penulis/${article.author.username}`}
        articleUrl={`/artikel/${article.slug}`}
        categoryName={article.category}
        tags={article.tags}
      />
      <PublicArticleDetail data={data} />
    </>
  )
}

