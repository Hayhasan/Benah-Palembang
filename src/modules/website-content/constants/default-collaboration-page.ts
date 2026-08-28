import type { CollaborationPageData } from "../types/collaboration-page"

export const DEFAULT_COLLABORATION_PAGE = {
  key: "collaboration",
  hero: {
    imageUrl:
      "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop",
    imageAlt: "Background Kolaborasi",
    eyebrow: "Collaboration",
    title: "Mari Benahi Palembang bersama.",
    description:
      "Kami terbuka untuk berkolaborasi dengan komunitas, brand, creative worker, organisasi, media, dan siapa pun yang ingin ikut membuat Palembang lebih hidup.",
  },
  contact: {
    email: "kolaborasi@benahpalembang.id",
    phone: "08551241878",
    emailUrl: "mailto:kolaborasi@benahpalembang.id?subject=Kolaborasi",
    whatsappUrl: "https://wa.me/628551241878",
  },
  form: {
    title: "Hubungi Kami",
    description:
      "Punya ide proyek, inisiatif kreatif, liputan cerita, atau ingin bermitra bersama Benah Palembang? Kirimkan detail singkatmu dan mari diskusikan langkah selanjutnya.",
  },
  partnerLogos: [
    {
      name: "Grab",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Grab_Logo.svg/200px-Grab_Logo.svg.png",
      position: 1,
      isVisible: true,
    },
    {
      name: "Tokopedia",
      imageUrl:
        "https://images.tokopedia.net/img/toppicks/social-share-tokopedia.jpg",
      position: 2,
      isVisible: true,
    },
    {
      name: "Bank Sumsel",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_Bank_SumselBabel.svg/200px-Logo_Bank_SumselBabel.svg.png",
      position: 3,
      isVisible: true,
    },
    {
      name: "Telkomsel",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Logo_of_Telkomsel_%282021%29.svg/200px-Logo_of_Telkomsel_%282021%29.svg.png",
      position: 4,
      isVisible: true,
    },
    {
      name: "Sriwijaya FC",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Sriwijaya_FC_logo.svg/200px-Sriwijaya_FC_logo.svg.png",
      position: 5,
      isVisible: true,
    },
    {
      name: "Kompas",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kompas_Logo.svg/200px-Kompas_Logo.svg.png",
      position: 6,
      isVisible: true,
    },
    {
      name: "Gojek",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Gojek_logo_2019.svg/200px-Gojek_logo_2019.svg.png",
      position: 7,
      isVisible: true,
    },
    {
      name: "Pertamina",
      imageUrl:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Logo_Pertamina.svg/200px-Logo_Pertamina.svg.png",
      position: 8,
      isVisible: true,
    },
  ],
  partnerContents: [
    {
      platform: "youtube",
      title: "Kolaborasi Benah x Grab Palembang",
      thumbnailUrl:
        "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "9:16",
      position: 1,
      isVisible: true,
    },
    {
      platform: "instagram",
      title: "Kampanye Budaya Bersama Tokopedia",
      thumbnailUrl:
        "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "4:5",
      position: 2,
      isVisible: true,
    },
    {
      platform: "tiktok",
      title: "Cerita Lorong — Viral Series",
      thumbnailUrl:
        "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "9:16",
      position: 3,
      isVisible: true,
    },
    {
      platform: "youtube",
      title: "Documentary: Sriwijaya Heritage",
      thumbnailUrl:
        "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "16:9",
      position: 4,
      isVisible: true,
    },
    {
      platform: "instagram",
      title: "Reels — Kuliner Khas Palembang",
      thumbnailUrl:
        "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "4:5",
      position: 5,
      isVisible: true,
    },
    {
      platform: "tiktok",
      title: "Palembang Hidden Gems Challenge",
      thumbnailUrl:
        "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "9:16",
      position: 6,
      isVisible: true,
    },
    {
      platform: "youtube",
      title: "Pertamina x Benah — CSR Kota Hijau",
      thumbnailUrl:
        "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "16:9",
      position: 7,
      isVisible: true,
    },
    {
      platform: "instagram",
      title: "Behind the Scenes — Tim Benah",
      thumbnailUrl:
        "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "1:1",
      position: 8,
      isVisible: true,
    },
    {
      platform: "tiktok",
      title: "Makeover Lorong Seni Palembang",
      thumbnailUrl:
        "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "9:16",
      position: 9,
      isVisible: true,
    },
    {
      platform: "youtube",
      title: "Talk Show: Masa Depan Kota Kreatif",
      thumbnailUrl:
        "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=400",
      contentUrl: "",
      aspectRatio: "4:5",
      position: 10,
      isVisible: true,
    },
  ],
} satisfies CollaborationPageData
