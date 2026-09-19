import type { WebsiteCollaborationPlatform } from "@prisma/client"

export interface CollaborationContentListItem {
  id: number
  title: string | null
  platform: WebsiteCollaborationPlatform
  contentUrl: string
  isVisible: boolean
  createdAt: string
  updatedAt: string
}
