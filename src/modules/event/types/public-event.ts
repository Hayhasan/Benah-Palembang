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
  views: number
}

export interface PublicEventDetail extends PublicEventListItem {
  content: string
  registrationUrl: string | null
  tags: string[]
  likesCount: number
  participantsCount: number
  hasLiked: boolean
  hasRegistered: boolean
}

export interface PublicEventDetailData {
  event: PublicEventDetail
  relatedEvents: PublicEventListItem[]
}
