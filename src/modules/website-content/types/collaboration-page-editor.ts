import type {
  CollaborationHeroSlideData,
  CollaborationPageData,
  CollaborationPartnerContentData,
  CollaborationPartnerLogoData,
} from "./collaboration-page"

interface CollaborationEditorRecord {
  id: number | null
  clientKey: string
}

export type CollaborationPartnerLogoEditorData =
  CollaborationPartnerLogoData & CollaborationEditorRecord

export type CollaborationPartnerContentEditorData =
  CollaborationPartnerContentData & CollaborationEditorRecord

export type CollaborationHeroSlideEditorData =
  CollaborationHeroSlideData & CollaborationEditorRecord

export interface CollaborationPageEditorData
  extends Omit<CollaborationPageData, "heroSlides" | "partnerLogos" | "partnerContents"> {
  heroSlides: CollaborationHeroSlideEditorData[]
  partnerLogos: CollaborationPartnerLogoEditorData[]
}

export type UpdateCollaborationPageResult =
  | {
      success: true
      data: CollaborationPageEditorData
      message: string
    }
  | {
      success: false
      message: string
      field?: string
    }
