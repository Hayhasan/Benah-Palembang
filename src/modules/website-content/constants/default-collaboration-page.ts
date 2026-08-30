import type { CollaborationPageData } from "../types/collaboration-page"

export const DEFAULT_COLLABORATION_PAGE = {
  key: "collaboration",
  hero: {
    imageUrl:
      "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop",
    imageAlt: "Background Kolaborasi",
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
      contentUrl: "https://youtu.be/_EwNLB1VpvQ?si=ksb1vljQnsvvB1lJ",
      position: 1,
      isVisible: true,
    },
    {
      platform: "instagram",
      contentUrl:
        "https://www.instagram.com/reel/DZlnmuWoT0B/?utm_source=ig_web_copy_link&igsi=NTc4MTIwNjQ2YQ==",
      position: 2,
      isVisible: true,
    },
    {
      platform: "tiktok",
      contentUrl:
        "https://www.tiktok.com/@gyan.im/video/7679374541843402005?is_from_webapp=1&sender_device=pc",
      position: 3,
      isVisible: true,
    },
    {
      platform: "youtube",
      contentUrl: "https://youtu.be/vQicNbw04WM?si=bjMh3vBSxwpf8c0K",
      position: 4,
      isVisible: true,
    },
  ],
} satisfies CollaborationPageData
