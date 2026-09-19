import type { ArticleCategoryPageData } from "../types/article-category-page"

export const DEFAULT_ARTICLE_CATEGORY_PAGES = [
  {
    sectionKey: "featured",
    slug: "cerita-warga",
    category: "Cerita Warga",
    heroSlides: [
      {
        id: null,
        clientKey: "default-cerita-warga-1",
        imageUrl:
          "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        imageAlt: "Cerita Warga Palembang",
        label: "CERITA WARGA",
        title: "Suara dari Sudut Kota",
        description:
          "Menyusuri denyut kota melalui cerita warga, ruang kota, budaya, dan mereka yang membuat Palembang terus bergerak.",
        photographerName: "",
        position: 1,
        isVisible: true,
      },
    ],
  },
  {
    sectionKey: "gaya-hidup",
    slug: "gaya-hidup",
    category: "Gaya Hidup",
    heroSlides: [
      {
        id: null,
        clientKey: "default-gaya-hidup-1",
        imageUrl:
          "https://images.pexels.com/photos/37234075/pexels-photo-37234075.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        imageAlt: "Gaya Hidup Palembang",
        label: "GAYA HIDUP",
        title: "Cara Kota Ini Hidup",
        description:
          "Cara Palembang hidup, makan, dan merayakan kesehariannya.",
        photographerName: "",
        position: 1,
        isVisible: true,
      },
    ],
  },
  {
    sectionKey: "ruang-kota",
    slug: "ruang-kota",
    category: "Ruang Kota",
    heroSlides: [
      {
        id: null,
        clientKey: "default-ruang-kota-1",
        imageUrl:
          "https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        imageAlt: "Ruang Kota",
        label: "RUANG KOTA",
        title: "Ruang Kota",
        description:
          "Mengamati bagaimana kota berubah dan apa yang tersisa dari perubahan itu.",
        photographerName: "",
        position: 1,
        isVisible: true,
      },
    ],
  },
  {
    sectionKey: "industri-kreatif",
    slug: "industri-kreatif",
    category: "Industri Kreatif",
    heroSlides: [
      {
        id: null,
        clientKey: "default-industri-kreatif-1",
        imageUrl:
          "https://images.pexels.com/photos/36748274/pexels-photo-36748274.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        imageAlt: "Industri Kreatif Palembang",
        label: "INDUSTRI KREATIF",
        title: "Geliat Karya",
        description:
          "Meliput geliat ekonomi kreatif dan para pelakunya di Palembang.",
        photographerName: "",
        position: 1,
        isVisible: true,
      },
    ],
  },
  {
    sectionKey: "kebudayaan",
    slug: "kebudayaan",
    category: "Kebudayaan",
    heroSlides: [
      {
        id: null,
        clientKey: "default-kebudayaan-1",
        imageUrl:
          "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
        imageAlt: "Kebudayaan Palembang",
        label: "KEBUDAYAAN",
        title: "Warisan yang Hidup",
        description:
          "Tradisi, seni, dan warisan budaya yang membentuk jiwa Palembang.",
        photographerName: "",
        position: 1,
        isVisible: true,
      },
    ],
  },
] as const satisfies readonly ArticleCategoryPageData[]

export const ARTICLE_CATEGORY_SECTION_KEYS = DEFAULT_ARTICLE_CATEGORY_PAGES.map(
  (category) => category.sectionKey,
)

export function getDefaultArticleCategoryPage(sectionKey: string) {
  return DEFAULT_ARTICLE_CATEGORY_PAGES.find(
    (category) => category.sectionKey === sectionKey,
  )
}
