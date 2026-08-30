import type { Article, AgendaItem } from "@/data/mockData"

const BASE_URL = "https://benahpalembang.id"

export function generateArticleJsonLd(article: Article) {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `${BASE_URL}/artikel/${article.slug}`
    },
    "headline": article.title,
    "description": article.excerpt,
    "image": [article.coverImage.startsWith("http") ? article.coverImage : `${BASE_URL}${article.coverImage}`],
    "datePublished": "2026-08-01T08:00:00+07:00",
    "dateModified": "2026-08-28T08:00:00+07:00",
    "author": {
      "@type": "Person",
      "name": article.author.name,
      "jobTitle": article.author.role
    },
    "publisher": {
      "@type": "Organization",
      "name": "Benah Palembang",
      "logo": {
        "@type": "ImageObject",
        "url": `${BASE_URL}/logo.png`
      }
    },
    "articleSection": article.category,
    "keywords": `${article.tags.join(", ")}, Benah Palembang, Berita Palembang, Kota Palembang, ${article.category}`,
    "inLanguage": "id-ID"
  }
}

export function generateEventJsonLd(event: AgendaItem) {
  return {
    "@context": "https://schema.org",
    "@type": "Event",
    "name": event.title,
    "description": event.description,
    "image": [event.image.startsWith("http") ? event.image : `${BASE_URL}${event.image}`],
    "startDate": "2026-08-30T09:00:00+07:00",
    "endDate": "2026-08-30T17:00:00+07:00",
    "eventAttendanceMode": "https://schema.org/OfflineEventAttendanceMode",
    "eventStatus": "https://schema.org/EventScheduled",
    "location": {
      "@type": "Place",
      "name": event.location,
      "address": {
        "@type": "PostalAddress",
        "addressLocality": "Palembang",
        "addressRegion": "Sumatera Selatan",
        "addressCountry": "ID"
      }
    },
    "organizer": {
      "@type": "Organization",
      "name": event.organizer || "Benah Palembang",
      "url": BASE_URL
    },
    "inLanguage": "id-ID"
  }
}

export function generateBreadcrumbJsonLd(items: { name: string; url: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    "itemListElement": items.map((item, index) => ({
      "@type": "ListItem",
      "position": index + 1,
      "name": item.name,
      "item": item.url.startsWith("http") ? item.url : `${BASE_URL}${item.url}`
    }))
  }
}
