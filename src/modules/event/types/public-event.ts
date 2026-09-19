export interface PublicEventListItem {
  id: number
  slug: string
  title: string
  description: string
  bannerUrl: string
  additionalBannerUrls: string[]
  category: string
  startsAt: string
  endsAt: string | null
  dateLabel: string
  timeLabel: string
  location: string
  organizer: string
  photographer: string | null
  views: number
  publishedAt: string | null
  publishedAtLabel: string | null
}

export interface PublicEventDetail extends PublicEventListItem {
  content: string
  registrationUrl: string | null
  whatsappUrl: string
  tags: string[]
}

export interface PublicEventDetailData {
  event: PublicEventDetail
  relatedEvents: PublicEventListItem[]
}
