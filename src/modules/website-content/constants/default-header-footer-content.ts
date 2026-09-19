import type { HeaderFooterContentData } from "../types/header-footer-content"

export const DEFAULT_HEADER_FOOTER_CONTENT = {
  key: "header-footer",
  logo: {
    imageUrl: "/logo.png",
    imageAlt: "Benah Palembang",
  },
  footer: {
    logo: {
      imageUrl: "",
      imageAlt: "",
    },
    title: "",
    creatorText: "The content for Benah Palembang was created by the people of Palembang for the people of Palembang.",
    description:
      "Platform editorial yang merekam, merayakan, dan menggerakkan kota Palembang.",
    copyrightText: "© 2026 Benah Palembang. All rights reserved.",
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
        platform: "mail",
        linkUrl: "mailto:halo@benahpalembang.id",
        position: 3,
        isVisible: true,
      },
    ],
  },
} satisfies HeaderFooterContentData
