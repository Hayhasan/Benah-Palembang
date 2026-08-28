import type { HeaderFooterContentData } from "../types/header-footer-content"

export const DEFAULT_HEADER_FOOTER_CONTENT = {
  key: "header-footer",
  logo: {
    imageUrl: "/logo.png",
    imageAlt: "Benah Palembang",
    linkUrl: "/",
  },
  footer: {
    description:
      "Platform editorial yang merekam, merayakan, dan menggerakkan kota.",
    exploreDescription: "",
    contactEmail: "halo@benahpalembang.id",
    contactPhone: "+62 711 123 456",
    contactAddress: "Palembang, Sumatera Selatan",
    copyrightText: "© 2025 Benah Palembang",
    closingText: "Made with care in Palembang",
    exploreLinks: [
      {
        label: "Cerita Warga",
        linkUrl: "/cerita-warga",
        position: 1,
        isVisible: true,
      },
      {
        label: "Gaya Hidup",
        linkUrl: "/gaya-hidup",
        position: 2,
        isVisible: true,
      },
      {
        label: "Ruang Kota",
        linkUrl: "/ruang-kota",
        position: 3,
        isVisible: true,
      },
      {
        label: "Industri Kreatif",
        linkUrl: "/industri-kreatif",
        position: 4,
        isVisible: true,
      },
      {
        label: "Agenda",
        linkUrl: "/agenda",
        position: 5,
        isVisible: true,
      },
    ],
    connectLinks: [
      {
        label: "Instagram",
        linkUrl: "#instagram",
        position: 1,
        isVisible: true,
      },
      {
        label: "TikTok",
        linkUrl: "#tiktok",
        position: 2,
        isVisible: true,
      },
      {
        label: "YouTube",
        linkUrl: "#youtube",
        position: 3,
        isVisible: true,
      },
      {
        label: "LinkedIn",
        linkUrl: "#linkedin",
        position: 4,
        isVisible: true,
      },
    ],
  },
} satisfies HeaderFooterContentData
