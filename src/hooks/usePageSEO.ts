import { useEffect } from "react"

export interface PageSEOProps {
  /**
   * Nama menu atau judul halaman.
   * Format document.title otomatis menjadi: "Benah Palembang - {title}"
   * Atau jika isExactTitle true, langsung memakai title.
   */
  title: string
  /**
   * Deskripsi halaman untuk meta description dan OG description.
   */
  description?: string
  /**
   * Kata kunci halaman untuk meta keywords.
   */
  keywords?: string
  /**
   * URL gambar untuk OG image dan Twitter image.
   */
  ogImage?: string
  /**
   * Path kanonikal (misal "/agenda", "/cerita-warga", dll)
   */
  canonicalPath?: string
  /**
   * Tipe OpenGraph, default 'website' atau 'article'
   */
  ogType?: "website" | "article"
  /**
   * Jika true, tidak menambahkan prefix "Benah Palembang - "
   */
  isExactTitle?: boolean
  /**
   * Schema.org JSON-LD object opsional
   */
  jsonLd?: Record<string, unknown>
}

const DEFAULT_DESCRIPTION =
  "Benah Palembang adalah platform editorial independen dan ruang kolaborasi yang merawat cerita warga, budaya, gaya hidup, industri kreatif, ruang kota, dan agenda terkini di Kota Palembang."

const DEFAULT_KEYWORDS =
  "Benah Palembang, Benah, Palembang, Kota Palembang, Pempek, Berita Palembang, Cerita Warga, Gaya Hidup, Ruang Kota, Industri Kreatif, Kebudayaan, Kuliner Palembang, Wisata Palembang, Event Palembang, Agenda Palembang, Media Palembang"

const BASE_URL = "https://benahpalembang.id"

export function usePageSEO({
  title,
  description = DEFAULT_DESCRIPTION,
  keywords = DEFAULT_KEYWORDS,
  ogImage = "/logo.png",
  canonicalPath = "",
  ogType = "website",
  isExactTitle = false,
  jsonLd,
}: PageSEOProps) {
  useEffect(() => {
    // 1. Format Title: "Benah Palembang - [Nama Menu]"
    const formattedTitle = isExactTitle
      ? title
      : `Benah Palembang - ${title}`

    document.title = formattedTitle

    // Helper to set or create meta tag
    const setMeta = (nameOrProperty: "name" | "property", key: string, content: string) => {
      let element = document.querySelector(`meta[${nameOrProperty}="${key}"]`) as HTMLMetaElement | null
      if (!element) {
        element = document.createElement("meta")
        element.setAttribute(nameOrProperty, key)
        document.head.appendChild(element)
      }
      element.setAttribute("content", content)
    }

    // 2. Primary Meta Tags
    setMeta("name", "description", description)
    setMeta("name", "keywords", keywords)
    setMeta("name", "title", formattedTitle)

    // 3. Open Graph Tags
    const fullUrl = `${BASE_URL}${canonicalPath.startsWith("/") ? canonicalPath : `/${canonicalPath}`}`
    const fullOgImage = ogImage.startsWith("http") ? ogImage : `${BASE_URL}${ogImage.startsWith("/") ? ogImage : `/${ogImage}`}`

    setMeta("property", "og:title", formattedTitle)
    setMeta("property", "og:description", description)
    setMeta("property", "og:type", ogType)
    setMeta("property", "og:url", fullUrl)
    setMeta("property", "og:image", fullOgImage)
    setMeta("property", "og:site_name", "Benah Palembang")

    // 4. Twitter Tags
    setMeta("name", "twitter:title", formattedTitle)
    setMeta("name", "twitter:description", description)
    setMeta("name", "twitter:image", fullOgImage)
    setMeta("name", "twitter:url", fullUrl)

    // 5. Canonical Link
    let canonicalLink = document.querySelector("link[rel='canonical']") as HTMLLinkElement | null
    if (!canonicalLink) {
      canonicalLink = document.createElement("link")
      canonicalLink.setAttribute("rel", "canonical")
      document.head.appendChild(canonicalLink)
    }
    canonicalLink.setAttribute("href", fullUrl)

    // 6. JSON-LD Dynamic Script
    let jsonLdScript = document.getElementById("page-jsonld") as HTMLScriptElement | null
    if (jsonLd) {
      if (!jsonLdScript) {
        jsonLdScript = document.createElement("script")
        jsonLdScript.id = "page-jsonld"
        jsonLdScript.type = "application/ld+json"
        document.head.appendChild(jsonLdScript)
      }
      jsonLdScript.textContent = JSON.stringify(jsonLd)
    } else if (jsonLdScript) {
      jsonLdScript.remove()
    }

    // Scroll to top smoothly on page change
    window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior })

    return () => {
      // Optional cleanup on unmount
    }
  }, [title, description, keywords, ogImage, canonicalPath, ogType, isExactTitle, jsonLd])
}
