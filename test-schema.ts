import { headerFooterContentEditorSchema } from './src/modules/website-content/schemas/header-footer-content.schema';

const data = {
  key: "header-footer",
  logo: {
    imageUrl: "/logo.png",
    imageAlt: "Benah Palembang",
  },
  headerColors: {
    bgColor: "#ffffff",
    textColor: "#000000",
    buttonColor: "#000000",
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
    bgColor: "#000000",
    textColor: "#ffffff",
    connectLinks: [
      {
        id: null,
        clientKey: "default-footer-connect-1",
        platform: "instagram",
        linkUrl: "https://instagram.com/benahpalembang",
        position: 1,
        isVisible: true,
      },
    ],
  },
}

const result = headerFooterContentEditorSchema.safeParse(data);
console.log(result.success ? "SUCCESS" : result.error.issues);
