import { getDefaultArticleCategoryPage } from "./default-article-category-pages"
import type { LandingPageData } from "../types/landing-page"

const heroDescription =
  "Ruang untuk cerita, budaya, kreativitas, dan kehidupan Palembang."

export const DEFAULT_LANDING_PAGE = {
  key: "home",
  heroSlides: [
    {
      imageUrl:
        "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      imageAlt: "Palembang",
      eyebrow: "Cerita Kota",
      title: "Merekam Palembang\nDi Setiap Sudutnya",
      description: heroDescription,
      buttonLabel: "Jelajahi cerita",
      buttonUrl: "/cerita-warga",
      position: 1,
      isVisible: true,
    },
    {
      imageUrl:
        "https://images.pexels.com/photos/38885810/pexels-photo-38885810.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      imageAlt: "Kehidupan di tepi Sungai Musi",
      eyebrow: "Sungai Musi",
      title: "Kehidupan di\nTepi Sungai",
      description: heroDescription,
      buttonLabel: "Jelajahi cerita",
      buttonUrl: "/cerita-warga",
      position: 2,
      isVisible: true,
    },
    {
      imageUrl:
        "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=1920&h=1080&fit=crop",
      imageAlt: "Kebudayaan Palembang",
      eyebrow: "Kebudayaan",
      title: "Warisan yang\nTerus Hidup",
      description: heroDescription,
      buttonLabel: "Jelajahi cerita",
      buttonUrl: "/cerita-warga",
      position: 3,
      isVisible: true,
    },
  ],
  about: {
    eyebrow: "About Benah Palembang",
    establishedText: "Est. 2025 · Palembang",
    title: "Merekam, merayakan, dan menggerakkan Palembang.",
    description:
      "Benah Palembang adalah platform editorial yang percaya bahwa kota bukan hanya tentang bangunan dan jalan. Ia adalah tentang manusia, ingatan, budaya, dan cerita-cerita kecil yang membentuk identitas kita.",
    closingText: "Untuk kota yang lebih hidup",
  },
  explore: {
    eyebrow: "Jelajahi perspektif",
    title: "Satu kota, banyak cerita.",
    items: [
      {
        label: "Cerita Warga",
        linkUrl: "/cerita-warga",
        storyCount: 10,
        position: 1,
        isVisible: true,
      },
      {
        label: "Gaya Hidup",
        linkUrl: "/gaya-hidup",
        storyCount: 10,
        position: 2,
        isVisible: true,
      },
      {
        label: "Ruang Kota",
        linkUrl: "/ruang-kota",
        storyCount: 10,
        position: 3,
        isVisible: true,
      },
      {
        label: "Industri Kreatif",
        linkUrl: "/industri-kreatif",
        storyCount: 10,
        position: 4,
        isVisible: true,
      },
      {
        label: "Kebudayaan",
        linkUrl: "/kebudayaan",
        storyCount: 10,
        position: 5,
        isVisible: true,
      },
    ],
  },
  articleSections: [
    {
      sectionKey: "featured",
      articleCategorySlug:
        getDefaultArticleCategoryPage("featured")?.slug ?? "cerita-warga",
      eyebrow: "Pilihan redaksi",
      title: "Cerita dari Palembang",
      description:
        "Menyusuri denyut kota melalui cerita warga, ruang kota, budaya, dan mereka yang membuat Palembang terus bergerak.",
      backgroundImageUrl:
        "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      linkLabel: "Lihat semua cerita",
      position: 1,
      isVisible: true,
    },
    {
      sectionKey: "gaya-hidup",
      articleCategorySlug: "gaya-hidup",
      eyebrow: "Kategori Cerita",
      title: "Gaya Hidup",
      description: "Cara Palembang hidup, makan, dan merayakan kesehariannya.",
      backgroundImageUrl:
        "https://images.pexels.com/photos/37234075/pexels-photo-37234075.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      linkLabel: "Lihat semua",
      position: 2,
      isVisible: true,
    },
    {
      sectionKey: "ruang-kota",
      articleCategorySlug: "ruang-kota",
      eyebrow: "Kategori Cerita",
      title: "Ruang Kota",
      description:
        "Mengamati bagaimana kota berubah dan apa yang tersisa dari perubahan itu.",
      backgroundImageUrl:
        "https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      linkLabel: "Lihat semua",
      position: 3,
      isVisible: true,
    },
    {
      sectionKey: "industri-kreatif",
      articleCategorySlug: "industri-kreatif",
      eyebrow: "Kategori Cerita",
      title: "Industri Kreatif",
      description:
        "Meliput geliat ekonomi kreatif dan para pelakunya di Palembang.",
      backgroundImageUrl:
        "https://images.pexels.com/photos/36748274/pexels-photo-36748274.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      linkLabel: "Lihat semua",
      position: 4,
      isVisible: true,
    },
    {
      sectionKey: "kebudayaan",
      articleCategorySlug: "kebudayaan",
      eyebrow: "Kategori Cerita",
      title: "Kebudayaan",
      description:
        "Tradisi, seni, dan warisan budaya yang membentuk jiwa Palembang.",
      backgroundImageUrl:
        "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      linkLabel: "Lihat semua",
      position: 5,
      isVisible: true,
    },
  ],
  team: {
    eyebrow: "Orang-orang di balik cerita",
    title: "Our Team",
    description:
      "Kami adalah kumpulan penulis, fotografer, peneliti, dan warga kota yang percaya pada kekuatan cerita.",
    members: [
      {
        name: "Ahmad Fauzi",
        role: "Founder & Pemimpin Redaksi",
        imageUrl:
          "https://images.pexels.com/photos/31409070/pexels-photo-31409070.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop",
        bio: "Membangun Benah Palembang dari keyakinan bahwa setiap kota layak punya platform cerita yang kuat.",
        position: 1,
        isVisible: true,
      },
      {
        name: "Anisa Putri",
        role: "Editor Utama",
        imageUrl:
          "https://images.pexels.com/photos/14795560/pexels-photo-14795560.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop",
        bio: "Memastikan setiap cerita yang terbit dari Benah Palembang memiliki kedalaman dan kejujuran.",
        position: 2,
        isVisible: true,
      },
      {
        name: "Sari Dewi",
        role: "Kepala Divisi Kebudayaan",
        imageUrl:
          "https://images.pexels.com/photos/34373985/pexels-photo-34373985.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop",
        bio: "Menjaga agar warisan budaya Palembang terus hidup dan relevan di tengah perubahan zaman.",
        position: 3,
        isVisible: true,
      },
      {
        name: "Rizki Pratama",
        role: "Creative Director",
        imageUrl:
          "https://images.pexels.com/photos/32844866/pexels-photo-32844866.jpeg?auto=compress&cs=tinysrgb&w=600&h=700&fit=crop",
        bio: "Membangun identitas visual Benah Palembang dengan sentuhan modern yang berakar pada estetika lokal.",
        position: 4,
        isVisible: true,
      },
    ],
  },
  cta: {
    eyebrow: "Buka ruang kolaborasi",
    title: "Kota ini milik\nkita semua.",
    description:
      "Punya cerita, ide, atau ingin membuat sesuatu bersama? Kami ingin mendengarnya.",
    buttonLabel: "Let's collaborate",
    buttonUrl: "/kolaborasi",
    backgroundImageUrl:
      "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    contactLabel: "Hubungi Kami",
    contactEmail: "kolaborasi@benahpalembang.id",
  },
} satisfies LandingPageData
