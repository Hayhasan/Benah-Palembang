export interface PublicEventStats {
  views: number
  likes: number
  participants: number
}

export function getPublicEventMockStats(eventId: number): PublicEventStats {
  return {
    views: 900 + eventId * 173,
    likes: 120 + eventId * 37,
    participants: 35 + ((eventId * 29) % 480),
  }
}
