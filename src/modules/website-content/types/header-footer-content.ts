export interface WebsiteFooterLinkData {
  label: string
  linkUrl: string
  position: number
  isVisible: boolean
}

export type FooterConnectPlatform =
  | "instagram"
  | "whatsapp"
  | "youtube"
  | "tiktok"
  | "linkedin"
  | "x"
  | "facebook"
  | "mail"
  | "website"

export interface WebsiteFooterConnectLinkData {
  platform: FooterConnectPlatform
  linkUrl: string
  position: number
  isVisible: boolean
}

export interface HeaderFooterContentData {
  key: "header-footer"
  logo: {
    imageUrl: string
    imageAlt: string
    linkUrl: string
  }
  footer: {
    backgroundText: string
    description: string
    copyrightText: string
    exploreLinks: WebsiteFooterLinkData[]
    connectLinks: WebsiteFooterConnectLinkData[]
  }
}
