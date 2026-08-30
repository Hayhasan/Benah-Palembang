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

export interface LandingExploreItemData {
  label: string
  linkUrl: string
  storyCount: number | null
  position: number
  isVisible: boolean
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
