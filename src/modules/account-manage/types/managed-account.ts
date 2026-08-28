export type AccountRouteRole = "user" | "admin"

export type ManagedAccountRole = "USER" | "ADMIN" | "SUPERADMIN"

export interface ManagedAccountListItem {
  id: string
  name: string
  email: string
  role: ManagedAccountRole
  avatarUrl: string | null
  isBanned: boolean
  createdAt: string
  createdAtLabel: string
  lastLoginAt: string | null
}

export interface ManagedAccountDetail extends ManagedAccountListItem {
  bannerUrl: string | null
  bio: string | null
  whatsappCountryCode: string | null
  whatsappNumber: string | null
  instagramUrl: string | null
  xUrl: string | null
  linkedinUrl: string | null
  bannedAt: string | null
  updatedAt: string
  updatedAtLabel: string
}

export interface ManagedAccountList {
  items: ManagedAccountListItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  query: string
}

export type AccountActionResult =
  | {
      success: true
      message: string
      nextRouteRole?: AccountRouteRole
    }
  | {
      success: false
      message: string
      field?: string
    }
