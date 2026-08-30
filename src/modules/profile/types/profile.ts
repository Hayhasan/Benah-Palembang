import type { AuthRole } from "@/modules/auth/types/auth-session"
import type { ArticleGalleryData } from "@/modules/article/types/article-gallery"

export interface ProfileData {
  id: string
  name: string
  username: string
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
  articleGallery: ArticleGalleryData
}

export type ProfileUpdateInput = Omit<
  ProfileData,
  "id" | "email" | "role" | "articleGallery"
>

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
