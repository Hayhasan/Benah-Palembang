import type {
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

export interface CollaborationPageEditorData
  extends Omit<CollaborationPageData, "partnerLogos" | "partnerContents"> {
  partnerLogos: CollaborationPartnerLogoEditorData[]
  partnerContents: CollaborationPartnerContentEditorData[]
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
