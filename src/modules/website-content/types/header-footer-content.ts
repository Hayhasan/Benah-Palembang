export interface WebsiteFooterLinkData {
  label: string
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
    description: string
    exploreDescription: string
    contactEmail: string
    contactPhone: string
    contactAddress: string
    copyrightText: string
    closingText: string
    exploreLinks: WebsiteFooterLinkData[]
    connectLinks: WebsiteFooterLinkData[]
  }
}
