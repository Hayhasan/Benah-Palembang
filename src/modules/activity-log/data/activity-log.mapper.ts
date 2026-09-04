import type { ActivityLog, ActivityAction, ActivityModule, UserRole } from "@prisma/client"
import type { ActivityLogItem } from "../types/activity-log"

const ACTION_MAP: Record<
  ActivityAction,
  {
    label: string
    iconName: ActivityLogItem["iconName"]
    colorClass: string
  }
> = {
  CREATE: {
    label: "Create",
    iconName: "plus",
    colorClass: "text-emerald-500 bg-emerald-50",
  },
  UPDATE: {
    label: "Edit",
    iconName: "edit",
    colorClass: "text-blue-500 bg-blue-50",
  },
  DELETE: {
    label: "Delete",
    iconName: "trash",
    colorClass: "text-red-500 bg-red-50",
  },
  LOGIN: {
    label: "Login",
    iconName: "login",
    colorClass: "text-zinc-600 bg-zinc-100",
  },
  LOGOUT: {
    label: "Logout",
    iconName: "login",
    colorClass: "text-zinc-600 bg-zinc-100",
  },
  APPROVE: {
    label: "Approve",
    iconName: "check-circle",
    colorClass: "text-emerald-600 bg-emerald-50",
  },
  REJECT: {
    label: "Reject",
    iconName: "trash",
    colorClass: "text-red-500 bg-red-50",
  },
  TAKEDOWN: {
    label: "Takedown",
    iconName: "shield-alert",
    colorClass: "text-red-500 bg-red-50",
  },
  RESTORE: {
    label: "Restore",
    iconName: "rotate-ccw",
    colorClass: "text-amber-500 bg-amber-50",
  },
  ARCHIVE: {
    label: "Archive",
    iconName: "archive",
    colorClass: "text-slate-600 bg-slate-100",
  },
  BAN: {
    label: "Ban",
    iconName: "shield-alert",
    colorClass: "text-red-600 bg-red-50",
  },
  UNBAN: {
    label: "Unban",
    iconName: "check-circle",
    colorClass: "text-emerald-600 bg-emerald-50",
  },
  CHANGE_ROLE: {
    label: "Change Role",
    iconName: "edit",
    colorClass: "text-purple-600 bg-purple-50",
  },
}

const MODULE_MAP: Record<ActivityModule, string> = {
  AUTH: "Auth",
  PROFILE: "Profile",
  ACCOUNT: "ManageAccount",
  WEBSITE: "ManageWebsite",
  ARTICLE: "Article",
  EVENT: "Event",
  CONTENT: "ManageContent",
}

const ROLE_MAP: Record<UserRole, string> = {
  USER: "User",
  ADMIN: "Admin",
  SUPERADMIN: "SuperAdmin",
}

function formatLogTime(date: Date): string {
  const day = date.getDate().toString().padStart(2, "0")
  const months = [
    "Jan",
    "Feb",
    "Mar",
    "Apr",
    "Mei",
    "Jun",
    "Jul",
    "Agu",
    "Sep",
    "Okt",
    "Nov",
    "Des",
  ]
  const month = months[date.getMonth()]
  const year = date.getFullYear()
  const hours = date.getHours().toString().padStart(2, "0")
  const minutes = date.getMinutes().toString().padStart(2, "0")

  return `${day} ${month} ${year}, ${hours}:${minutes}`
}

export function mapPrismaActivityLogToDto(log: ActivityLog): ActivityLogItem {
  const actionMeta = ACTION_MAP[log.action] ?? {
    label: log.action,
    iconName: "activity" as const,
    colorClass: "text-zinc-600 bg-zinc-100",
  }

  const before =
    log.beforeState && typeof log.beforeState === "object" && !Array.isArray(log.beforeState)
      ? (log.beforeState as Record<string, unknown>)
      : null

  const after =
    log.afterState && typeof log.afterState === "object" && !Array.isArray(log.afterState)
      ? (log.afterState as Record<string, unknown>)
      : null

  return {
    id: log.id,
    userId: log.userId,
    userName: log.userName,
    userRole: log.userRole,
    roleLabel: ROLE_MAP[log.userRole] ?? log.userRole,
    action: log.action,
    actionLabel: actionMeta.label,
    module: log.module,
    moduleLabel: MODULE_MAP[log.module] ?? log.module,
    description: log.description,
    time: formatLogTime(log.createdAt),
    createdAt: log.createdAt.toISOString(),
    iconName: actionMeta.iconName,
    colorClass: actionMeta.colorClass,
    ipAddress: log.ipAddress,
    userAgent: log.userAgent,
    details: {
      before,
      after,
    },
  }
}
