function getValidSiteUrl(): string {
  const candidate = (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.APP_URL ||
    ""
  ).trim()

  // Mencegah localhost/127.0.0.1 masuk ke sitemap, robots, dan schema.org
  // Jika di lokal atau di server produksi env belum terisi domain publik,
  // otomatis gunakan domain resmi https://benahpalembang.com
  if (
    !candidate ||
    candidate.includes("localhost") ||
    candidate.includes("127.0.0.1")
  ) {
    return "https://benahpalembang.com"
  }

  if (!/^https?:\/\//i.test(candidate)) {
    return `https://${candidate.replace(/\/$/, "")}`
  }

  return candidate.replace(/\/$/, "")
}

export const SITE_URL = getValidSiteUrl()

export const SITE_NAME = "Benah Palembang"

export const DEFAULT_TITLE =
  "Benah Palembang - Info, Berita, Budaya & Cerita Kota Palembang"

export const DEFAULT_DESCRIPTION =
  "Portal media editorial independen yang merekam, merayakan, dan menggerakkan kota Palembang. Temukan info Palembang terkini, berita, agenda kegiatan, gaya hidup, kebudayaan wong kito, dan ragam cerita sudut kota Palembang."

export const DEFAULT_KEYWORDS = [
  "Benah Palembang",
  "Palembang",
  "Benah",
  "Info Palembang",
  "Berita Palembang",
  "Kabar Palembang",
  "Cerita Palembang",
  "Cerita Warga Palembang",
  "Agenda Palembang",
  "Event Palembang",
  "Budaya Palembang",
  "Wong Kito",
  "Wisata Palembang",
  "Kuliner Palembang",
  "Seputar Palembang",
  "Media Palembang",
  "Komunitas Kreatif Palembang",
  "Sungai Musi",
]

export const SOCIAL_LINKS = [
  "https://instagram.com/benahpalembang",
  "https://youtube.com/@benahpalembang",
]

export const CONTACT_EMAIL = "halo@benahpalembang.com"

export function absoluteUrl(path = "") {
  const cleanBase = SITE_URL.replace(/\/$/, "")
  const cleanPath = path ? (path.startsWith("/") ? path : `/${path}`) : ""
  return `${cleanBase}${cleanPath}`
}
