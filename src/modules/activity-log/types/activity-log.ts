import type { ActivityAction, ActivityModule, UserRole } from "@prisma/client"

export type ActivityActionType = ActivityAction
export type ActivityModuleType = ActivityModule

export interface ActivityLogDetailSnapshot {
  before: Record<string, unknown> | null
  after: Record<string, unknown> | null
}

export interface ActivityLogItem {
  id: number
  userId: string | null
  userName: string
  userRole: UserRole
  roleLabel: string
  action: ActivityActionType
  actionLabel: string
  module: ActivityModuleType
  moduleLabel: string
  description: string
  time: string
  createdAt: string
  iconName: "plus" | "edit" | "trash" | "login" | "shield-alert" | "check-circle" | "rotate-ccw" | "archive" | "activity"
  colorClass: string
  ipAddress: string | null
  userAgent: string | null
  details: ActivityLogDetailSnapshot
}

export interface ActivityLogListResult {
  items: ActivityLogItem[]
  page: number
  pageSize: number
  totalItems: number
  totalPages: number
  query: string
}
