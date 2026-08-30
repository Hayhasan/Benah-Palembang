import type {
  LandingArticleSectionData,
  LandingExploreItemData,
  LandingHeroSlideData,
  LandingPageData,
  LandingTeamMemberData,
} from "./landing-page"

interface EditorRecord {
  id: number | null
  clientKey: string
}

export type LandingHeroSlideEditorData = LandingHeroSlideData & EditorRecord

export type LandingExploreItemEditorData = LandingExploreItemData & EditorRecord

export type LandingArticleSectionEditorData = LandingArticleSectionData &
  EditorRecord & {
    pinnedArticleIds: number[]
  }

export interface LandingArticlePinOption {
  id: number
  sectionKey: string
  title: string
  slug: string
  publishedAtLabel: string
  isAvailable: boolean
}

export type LandingTeamMemberEditorData = LandingTeamMemberData & EditorRecord

export interface LandingPageEditorData
  extends Omit<
    LandingPageData,
    "heroSlides" | "explore" | "articleSections" | "team"
  > {
  key: "home"
  heroSlides: LandingHeroSlideEditorData[]
  explore: Omit<LandingPageData["explore"], "items"> & {
    items: LandingExploreItemEditorData[]
  }
  articleSections: LandingArticleSectionEditorData[]
  team: Omit<LandingPageData["team"], "members"> & {
    members: LandingTeamMemberEditorData[]
  }
}

export type UpdateLandingPageResult =
  | {
      success: true
      data: LandingPageEditorData
      message: string
    }
  | {
      success: false
      message: string
      field?: string
    }
