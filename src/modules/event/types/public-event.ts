export interface PublicEventListItem {
  id: number
  slug: string
  title: string
  description: string
  bannerUrl: string
  category: string
  startsAt: string
  endsAt: string | null
  dateLabel: string
  timeLabel: string
  location: string
  organizer: string
}

export interface PublicEventDetail extends PublicEventListItem {
  content: string
  registrationUrl: string | null
  tags: string[]
}

export interface PublicEventDetailData {
  event: PublicEventDetail
  relatedEvents: PublicEventListItem[]
}
