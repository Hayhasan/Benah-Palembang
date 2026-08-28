import type { AuthRole } from "@/modules/auth/types/auth-session"

export interface ProfileData {
  id: string
  name: string
  email: string
  role: AuthRole
  avatarUrl: string | null
  bannerUrl: string | null
  bio: string | null
  whatsappCountryCode: string | null
  whatsappNumber: string | null
  instagramUrl: string | null
  xUrl: string | null
  linkedinUrl: string | null
}

export type ProfileUpdateInput = Omit<ProfileData, "id" | "email" | "role">

export type ProfileActionResult =
  | {
      success: true
      message: string
      data: ProfileData
    }
  | {
      success: false
      message: string
      fieldErrors?: Record<string, string[] | undefined>
    }

export type ProfilePasswordResetResult =
  | {
      success: true
      message: string
      retryAt: number
    }
  | {
      success: false
      message: string
      retryAt?: number
    }
