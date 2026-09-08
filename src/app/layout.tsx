import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
import {
  DEFAULT_DESCRIPTION,
  DEFAULT_KEYWORDS,
  DEFAULT_TITLE,
  SITE_NAME,
  SITE_URL,
} from "@/lib/seo/config"
import { OrganizationJsonLd, WebSiteJsonLd } from "@/lib/seo/json-ld"
import { Providers } from "./providers"
import "./globals.css"

// Padanan self-host dari @import Google Fonts milik proyek Vite. Keduanya
// variable font, jadi seluruh rentang weight yang dipakai desain lama
// (Inter 300-700, Playfair Display 400-900 + italic) tetap tersedia.
const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter-family",
})

const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  style: ["normal", "italic"],
  display: "swap",
  variable: "--font-playfair-family",
})

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: DEFAULT_TITLE,
    template: `%s | ${SITE_NAME}`,
  },
  description: DEFAULT_DESCRIPTION,
  keywords: DEFAULT_KEYWORDS,
  authors: [{ name: SITE_NAME, url: SITE_URL }],
  creator: SITE_NAME,
  publisher: SITE_NAME,
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  alternates: {
    canonical: "./",
  },
  openGraph: {
    type: "website",
    locale: "id_ID",
    url: SITE_URL,
    siteName: SITE_NAME,
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
  },
  twitter: {
    card: "summary_large_image",
    title: DEFAULT_TITLE,
    description: DEFAULT_DESCRIPTION,
    creator: "@benahpalembang",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    // `globals.css` menyetel `scroll-behavior: smooth` pada <html>. Sejak
    // Next.js 16 framework tidak lagi otomatis menonaktifkannya saat pindah
    // route; `data-scroll-behavior="smooth"` mengembalikan perilaku scroll
    // instan saat navigasi tanpa mengganggu anchor scroll di dalam halaman.
    <html
      lang="id"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${playfairDisplay.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var isDark=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches;var r=(t==="light"||t==="dark")?t:(isDark?"dark":"light");document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(r);document.documentElement.style.colorScheme=r}catch(e){var f=window.matchMedia&&window.matchMedia("(prefers-color-scheme: dark)").matches?"dark":"light";document.documentElement.classList.add(f);document.documentElement.style.colorScheme=f}})();`,
          }}
        />
        <OrganizationJsonLd />
        <WebSiteJsonLd />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
