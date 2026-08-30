import type { Metadata } from "next"
import { Inter, Playfair_Display } from "next/font/google"
import { Toaster } from "@/components/ui/sonner"
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
  title: "Benah Palembang Editorial Platform",
  openGraph: {
    images: "https://bolt.new/static/og_default.png",
  },
  twitter: {
    card: "summary_large_image",
    images: "https://bolt.new/static/og_default.png",
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
      lang="en"
      data-scroll-behavior="smooth"
      suppressHydrationWarning
      className={`${inter.variable} ${playfairDisplay.variable}`}
    >
      <head>
        <script
          dangerouslySetInnerHTML={{
            __html: `(function(){try{var t=localStorage.getItem("theme");var r=t==="light"||t==="dark"?t:t==="system"&&matchMedia("(prefers-color-scheme: light)").matches?"light":"dark";document.documentElement.classList.remove("light","dark");document.documentElement.classList.add(r);document.documentElement.style.colorScheme=r}catch(e){document.documentElement.classList.add("dark");document.documentElement.style.colorScheme="dark"}})();`,
          }}
        />
      </head>
      <body>
        <Providers>{children}</Providers>
        <Toaster />
      </body>
    </html>
  )
}
