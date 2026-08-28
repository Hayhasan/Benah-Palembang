export type CollaborationPlatform =
  | "youtube"
  | "instagram"
  | "tiktok"
  | "facebook"
  | "x"

export type CollaborationAspectRatio = "9:16" | "4:5" | "16:9" | "1:1"

export interface CollaborationPartnerLogoData {
  name: string
  imageUrl: string
  position: number
  isVisible: boolean
}

export interface CollaborationPartnerContentData {
  platform: CollaborationPlatform
  title: string
  thumbnailUrl: string
  contentUrl: string
  aspectRatio: CollaborationAspectRatio
  position: number
  isVisible: boolean
}

export interface CollaborationPageData {
  key: "collaboration"
  hero: {
    imageUrl: string
    imageAlt: string
    eyebrow: string
    title: string
    description: string
  }
  contact: {
    email: string
    phone: string
    emailUrl: string
    whatsappUrl: string
  }
  form: {
    title: string
    description: string
  }
  partnerLogos: CollaborationPartnerLogoData[]
  partnerContents: CollaborationPartnerContentData[]
}
