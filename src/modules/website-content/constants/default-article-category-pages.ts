import type { ArticleCategoryPageData } from "../types/article-category-page"

export const DEFAULT_ARTICLE_CATEGORY_PAGES = [
  {
    sectionKey: "featured",
    slug: "cerita-warga",
    category: "Cerita Warga",
    hero: {
      imageUrl:
        "https://images.pexels.com/photos/38885810/pexels-photo-38885810.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      imageAlt: "Cerita Warga",
      title: "Cerita Warga",
      description:
        "Kisah-kisah nyata dari sudut-sudut Palembang yang jarang terlihat.",
    },
  },
  {
    sectionKey: "gaya-hidup",
    slug: "gaya-hidup",
    category: "Gaya Hidup",
    hero: {
      imageUrl:
        "https://images.pexels.com/photos/37234075/pexels-photo-37234075.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      imageAlt: "Gaya Hidup",
      title: "Gaya Hidup",
      description: "Cara Palembang hidup, makan, dan merayakan kesehariannya.",
    },
  },
  {
    sectionKey: "ruang-kota",
    slug: "ruang-kota",
    category: "Ruang Kota",
    hero: {
      imageUrl:
        "https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      imageAlt: "Ruang Kota",
      title: "Ruang Kota",
      description:
        "Mengamati bagaimana kota berubah dan apa yang tersisa dari perubahan itu.",
    },
  },
  {
    sectionKey: "industri-kreatif",
    slug: "industri-kreatif",
    category: "Industri Kreatif",
    hero: {
      imageUrl:
        "https://images.pexels.com/photos/36748274/pexels-photo-36748274.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      imageAlt: "Industri Kreatif",
      title: "Industri Kreatif",
      description:
        "Meliput geliat ekonomi kreatif dan para pelakunya di Palembang.",
    },
  },
  {
    sectionKey: "kebudayaan",
    slug: "kebudayaan",
    category: "Kebudayaan",
    hero: {
      imageUrl:
        "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop",
      imageAlt: "Kebudayaan",
      title: "Kebudayaan",
      description:
        "Tradisi, seni, dan warisan budaya yang membentuk jiwa Palembang.",
    },
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
