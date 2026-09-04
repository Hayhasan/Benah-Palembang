export interface LandingHeroSlideData {
  imageUrl: string
  imageAlt: string
  eyebrow: string
  title: string
  description: string
  buttonLabel: string
  buttonUrl: string
  position: number
  isVisible: boolean
}

export type ExploreCountSource =
  | "manual"
  | "article-category"
  | "event"
  | "none"

export interface LandingExploreItemData {
  label: string
  linkUrl: string
  countSource: ExploreCountSource
  /** Section artikel yang dihitung saat countSource "article-category". */
  countArticleSectionKey: string | null
  /** Satuan yang ditampilkan setelah angka, misalnya "Stories" atau "Agenda". */
  countLabel: string | null
  /** Angka manual yang hanya dipakai saat countSource "manual". */
  storyCount: number | null
  position: number
  isVisible: boolean
}

/** Explore item setelah angkanya diselesaikan di server. */
export interface LandingExploreItemView extends LandingExploreItemData {
  count: number | null
}

export interface LandingArticleSectionData {
  sectionKey: string
  articleCategorySlug: string
  eyebrow: string
  title: string
  description: string
  backgroundImageUrl: string
  linkLabel: string
  position: number
  isVisible: boolean
}

export interface LandingTeamMemberData {
  name: string
  role: string
  imageUrl: string
  bio: string
  position: number
  isVisible: boolean
}

export interface LandingPageData {
  key: string
  about: {
    eyebrow: string
    establishedText: string
    title: string
    description: string
    closingText: string
  }
  explore: {
    eyebrow: string
    title: string
    items: LandingExploreItemData[]
  }
  heroSlides: LandingHeroSlideData[]
  articleSections: LandingArticleSectionData[]
  team: {
    eyebrow: string
    title: string
    description: string
    members: LandingTeamMemberData[]
  }
  cta: {
    eyebrow: string
    title: string
    description: string
    buttonLabel: string
    buttonUrl: string
    backgroundImageUrl: string
    contactLabel: string
    contactEmail: string
  }
}

/** Landing page setelah angka explore diselesaikan di server. */
export interface LandingPageView extends Omit<LandingPageData, "explore"> {
  explore: Omit<LandingPageData["explore"], "items"> & {
    items: LandingExploreItemView[]
  }
}
