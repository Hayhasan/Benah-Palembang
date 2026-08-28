export type AuthRole = "USER" | "ADMIN" | "SUPERADMIN"

export interface AuthUser {
  id: string
  name: string
  email: string
  role: AuthRole
  avatarUrl: string | null
}

export interface AuthSessionRecord {
  userId: string
  role: AuthRole
  version: number
  createdAt: string
  expiresAt: string
}

export interface VerifiedSession extends AuthSessionRecord {
  tokenHash: string
}
