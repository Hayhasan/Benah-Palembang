import type {
  AccountRouteRole,
  ManagedAccountRole,
} from "../types/managed-account"

interface AccountRouteConfig {
  databaseRoles: ManagedAccountRole[]
  title: string
  description: string
  createLabel: string
  createTitle: string
  createDescription: string
  searchPlaceholder: string
  emptyLabel: string
}

export const ACCOUNT_ROUTE_CONFIG: Record<
  AccountRouteRole,
  AccountRouteConfig
> = {
  user: {
    databaseRoles: ["USER"],
    title: "Manage User",
    description: "Kelola akun pengguna reguler aplikasi.",
    createLabel: "Create User",
    createTitle: "Buat User Baru",
    createDescription: "Tambahkan akun pengguna baru ke dalam sistem.",
    searchPlaceholder: "Cari user (UUID, nama, email)...",
    emptyLabel: "user",
  },
  admin: {
    databaseRoles: ["ADMIN", "SUPERADMIN"],
    title: "Manage Admin",
    description: "Kelola akun administrator dengan hak akses tinggi.",
    createLabel: "Create Admin",
    createTitle: "Buat Admin Baru",
    createDescription: "Tambahkan akun administrator baru ke dalam sistem.",
    searchPlaceholder: "Cari admin (UUID, nama, email)...",
    emptyLabel: "admin",
  },
}

export function isAccountRouteRole(value: string): value is AccountRouteRole {
  return value === "user" || value === "admin"
}

export function accountRoleBelongsToRoute(
  routeRole: AccountRouteRole,
  role: ManagedAccountRole,
) {
  return ACCOUNT_ROUTE_CONFIG[routeRole].databaseRoles.includes(role)
}
