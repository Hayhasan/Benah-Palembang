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
  }
  headerColors: {
    bgColor: string
    textColor: string
    buttonColor: string
  }
  footer: {
    logo: {
      imageUrl: string
      imageAlt: string
    }
    title: string
    description: string
    creatorText: string
    copyrightText: string
    bgColor: string
    textColor: string
    connectLinks: WebsiteFooterConnectLinkData[]
  }
}
