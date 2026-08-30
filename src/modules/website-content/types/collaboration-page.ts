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

export interface CollaborationPageData {
  key: "collaboration"
  hero: {
    imageUrl: string
    imageAlt: string
    title: string
    description: string
  }
  contact: {
    email: string
    phone: string
    emailUrl: string
    whatsappUrl: string
  }
  partnerLogos: CollaborationPartnerLogoData[]
  partnerContents: CollaborationPartnerContentData[]
}
