import type { HeaderFooterContentData } from "../types/header-footer-content"

export const DEFAULT_HEADER_FOOTER_CONTENT = {
  key: "header-footer",
  logo: {
    imageUrl: "/logo.png",
    imageAlt: "Benah Palembang",
    linkUrl: "/",
  },
  footer: {
    backgroundText: "PALEMBANG",
    description:
      "Platform editorial yang merekam, merayakan, dan menggerakkan kota Palembang.",
    copyrightText: "© 2026 Benah Palembang. All rights reserved.",
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
        label: "Kebudayaan",
        linkUrl: "/kebudayaan",
        position: 5,
        isVisible: true,
      },
      {
        label: "Agenda",
        linkUrl: "/agenda",
        position: 6,
        isVisible: true,
      },
      {
        label: "Kolaborasi",
        linkUrl: "/kolaborasi",
        position: 7,
        isVisible: true,
      },
    ],
    connectLinks: [
      {
        platform: "instagram",
        linkUrl: "https://instagram.com/benahpalembang",
        position: 1,
        isVisible: true,
      },
      {
        platform: "whatsapp",
        linkUrl: "https://wa.me/628551241878",
        position: 2,
        isVisible: true,
      },
      {
        platform: "youtube",
        linkUrl: "https://youtube.com/@benahpalembang",
        position: 3,
        isVisible: true,
      },
      {
        platform: "mail",
        linkUrl: "mailto:halo@benahpalembang.id",
        position: 4,
        isVisible: true,
      },
    ],
  },
} satisfies HeaderFooterContentData
