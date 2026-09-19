export type CollaborationPlatform =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "x"

export type CollaborationContentAspectRatio =
  | "LANDSCAPE"
  | "PORTRAIT"
  | "SQUARE"

export interface CollaborationContentPreviewData {
  title: string
  thumbnailUrl: string | null
  aspectRatio: CollaborationContentAspectRatio
}

export interface CollaborationPartnerLogoData {
  name: string
  imageUrl: string
  position: number
  isVisible: boolean
}

export interface CollaborationPartnerContentData {
  platform: CollaborationPlatform
  contentUrl: string
  preview?: CollaborationContentPreviewData
  position: number
  isVisible: boolean
}

export interface CollaborationHeroSlideData {
  imageUrl: string
  imageAlt: string
  title: string
  description: string
  position: number
  isVisible: boolean
}

export interface CollaborationPageData {
  key: "collaboration"
  heroSlides: CollaborationHeroSlideData[]
  contact: {
    email: string
    phone: string
    emailUrl: string
    whatsappUrl: string
  }
  partnerLogos: CollaborationPartnerLogoData[]
  partnerContents: CollaborationPartnerContentData[]
}
