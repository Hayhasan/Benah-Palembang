import {
  absoluteUrl,
  CONTACT_EMAIL,
  DEFAULT_DESCRIPTION,
  SITE_NAME,
  SITE_URL,
  SOCIAL_LINKS,
} from "./config"

interface BreadcrumbItem {
  name: string
  url: string
}

export function OrganizationJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsMediaOrganization",
    name: SITE_NAME,
    alternateName: [
      "Benah",
      "BenahPalembang",
      "Media Benah Palembang",
      "Benah Palembang Editorial",
      "Info Palembang",
      "Berita Palembang",
    ],
    url: SITE_URL,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl("/logo.png"),
      width: 512,
      height: 512,
    },
    sameAs: SOCIAL_LINKS,
    address: {
      "@type": "PostalAddress",
      addressLocality: "Palembang",
      addressRegion: "Sumatera Selatan",
      addressCountry: "ID",
    },
    contactPoint: {
      "@type": "ContactPoint",
      contactType: "customer service",
      email: CONTACT_EMAIL,
      availableLanguage: ["id", "en"],
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function WebSiteJsonLd() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    alternateName: [
      "Benah",
      "BenahPalembang",
      "Info Palembang",
      "Berita Palembang",
    ],
    url: SITE_URL,
    description: DEFAULT_DESCRIPTION,
    inLanguage: "id-ID",
    publisher: {
      "@type": "Organization",
      name: SITE_NAME,
      url: SITE_URL,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

export function BreadcrumbJsonLd({ items }: { items: BreadcrumbItem[] }) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: item.url.startsWith("http") ? item.url : absoluteUrl(item.url),
    })),
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface NewsArticleJsonLdProps {
  title: string
  description: string
  coverImageUrl: string
  publishedAt: string | Date
  updatedAt?: string | Date
  authorName: string
  authorUrl?: string
  articleUrl: string
  categoryName?: string
  tags?: string[]
}

export function NewsArticleJsonLd({
  title,
  description,
  coverImageUrl,
  publishedAt,
  updatedAt,
  authorName,
  authorUrl,
  articleUrl,
  categoryName,
  tags = [],
}: NewsArticleJsonLdProps) {
  const pubDate =
    typeof publishedAt === "string" ? publishedAt : publishedAt.toISOString()
  const modDate = updatedAt
    ? typeof updatedAt === "string"
      ? updatedAt
      : updatedAt.toISOString()
    : pubDate

  const schema = {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": articleUrl.startsWith("http") ? articleUrl : absoluteUrl(articleUrl),
    },
    headline: title,
    description,
    image: [
      coverImageUrl.startsWith("http")
        ? coverImageUrl
        : absoluteUrl(coverImageUrl),
    ],
    datePublished: pubDate,
    dateModified: modDate,
    author: {
      "@type": "Person",
      name: authorName,
      url: authorUrl
        ? authorUrl.startsWith("http")
          ? authorUrl
          : absoluteUrl(authorUrl)
        : undefined,
    },
    publisher: {
      "@type": "NewsMediaOrganization",
      name: SITE_NAME,
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: absoluteUrl("/logo.png"),
      },
    },
    inLanguage: "id-ID",
    articleSection: categoryName,
    keywords: tags.length > 0 ? tags.join(", ") : undefined,
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface EventJsonLdProps {
  title: string
  description: string
  imageUrl?: string
  startDate: string | Date
  endDate?: string | Date | null
  location: string
  organizer: string
  eventUrl: string
}

export function EventJsonLd({
  title,
  description,
  imageUrl,
  startDate,
  endDate,
  location,
  organizer,
  eventUrl,
}: EventJsonLdProps) {
  const start =
    typeof startDate === "string" ? startDate : startDate.toISOString()
  const end = endDate
    ? typeof endDate === "string"
      ? endDate
      : endDate.toISOString()
    : undefined

  const schema = {
    "@context": "https://schema.org",
    "@type": "Event",
    name: title,
    description,
    image: imageUrl
      ? [imageUrl.startsWith("http") ? imageUrl : absoluteUrl(imageUrl)]
      : undefined,
    startDate: start,
    endDate: end,
    eventStatus: "https://schema.org/EventScheduled",
    eventAttendanceMode: "https://schema.org/OfflineEventAttendanceMode",
    location: {
      "@type": "Place",
      name: location,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Palembang",
        addressRegion: "Sumatera Selatan",
        addressCountry: "ID",
      },
    },
    organizer: {
      "@type": "Organization",
      name: organizer,
    },
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": eventUrl.startsWith("http") ? eventUrl : absoluteUrl(eventUrl),
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}

interface ProfileJsonLdProps {
  name: string
  username: string
  bio?: string
  avatarUrl?: string
  profileUrl: string
}

export function ProfileJsonLd({
  name,
  username,
  bio,
  avatarUrl,
  profileUrl,
}: ProfileJsonLdProps) {
  const fullUrl = profileUrl.startsWith("http")
    ? profileUrl
    : absoluteUrl(profileUrl)

  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name,
      alternateName: username,
      description: bio,
      image: avatarUrl
        ? avatarUrl.startsWith("http")
          ? avatarUrl
          : absoluteUrl(avatarUrl)
        : undefined,
      url: fullUrl,
    },
  }

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  )
}
