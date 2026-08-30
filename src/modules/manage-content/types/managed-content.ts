export type ManagedContentType = "ARTICLE" | "EVENT"

export type ManagedContentStatus =
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "TAKEN_DOWN"

export interface ManagedContentStatistics {
  views: string
  likes: string
  comments?: number
}

export interface ManagedContentListItem {
  id: number
  type: ManagedContentType
  typeLabel: "Article" | "Event"
  title: string
  description: string
  bannerUrl: string
  owner: {
    id: string
    name: string
    avatarUrl: string | null
  }
  status: ManagedContentStatus
  statusLabel: "Request" | "Posted" | "Rejected" | "Takedown"
  submittedAt: string | null
  publishedAt: string | null
  createdAt: string
  updatedAt: string
  dateLabel: string
  stats: ManagedContentStatistics
}

export interface ManagedContentListResult {
  items: ManagedContentListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  query: string
}

export interface ManageContentActionResult {
  success: boolean
  message: string
}
