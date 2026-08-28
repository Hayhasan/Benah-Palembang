import type {
  HeaderFooterContentData,
  WebsiteFooterLinkData,
} from "./header-footer-content"

interface HeaderFooterEditorRecord {
  id: number | null
  clientKey: string
}

export type WebsiteFooterLinkEditorData = WebsiteFooterLinkData &
  HeaderFooterEditorRecord

export interface HeaderFooterContentEditorData
  extends Omit<HeaderFooterContentData, "footer"> {
  footer: Omit<
    HeaderFooterContentData["footer"],
    "exploreLinks" | "connectLinks"
  > & {
    exploreLinks: WebsiteFooterLinkEditorData[]
    connectLinks: WebsiteFooterLinkEditorData[]
  }
}

export type UpdateHeaderFooterContentResult =
  | {
      success: true
      data: HeaderFooterContentEditorData
      message: string
    }
  | {
      success: false
      message: string
      field?: string
    }
