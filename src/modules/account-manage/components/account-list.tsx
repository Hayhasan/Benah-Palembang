"use client"

import { usePathname, useRouter } from "next/navigation"
import { useEffect, useState, useTransition } from "react"
import { Ban, Eye, Search, ShieldCheck, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DEFAULT_AVATAR } from "@/lib/constants/placeholder"

import { setAccountBanStatusAction } from "../actions/set-account-ban-status"
import { softDeleteAccountAction } from "../actions/soft-delete-account"
import { ACCOUNT_ROUTE_CONFIG } from "../constants/account-route-role"
import type {
  AccountRouteRole,
  ManagedAccountList,
  ManagedAccountListItem,
} from "../types/managed-account"
import { CreateAccountDialog } from "./create-account-dialog"

type ConfirmationState =
  | {
      action: "ban" | "unban" | "delete"
      account: ManagedAccountListItem
    }
  | null

interface AccountListProps {
  routeRole: AccountRouteRole
  data: ManagedAccountList
}

function roleLabel(role: ManagedAccountListItem["role"]) {
  if (role === "SUPERADMIN") return "SuperAdmin"
  if (role === "ADMIN") return "Admin"
  return "User"
}

function roleClassName(role: ManagedAccountListItem["role"]) {
  if (role === "SUPERADMIN") return "bg-purple-50 text-purple-600"
  if (role === "ADMIN") return "bg-red-50 text-palembang-red"
  return "bg-blue-50 text-blue-600"
}

function formatRelativeActivity(timestamp: string | null, now: number) {
  if (!timestamp) return "-"

  const elapsedSeconds = Math.max(
    0,
    Math.floor((now - new Date(timestamp).getTime()) / 1000),
  )
  if (elapsedSeconds < 60) return "Baru saja"

  const elapsedMinutes = Math.floor(elapsedSeconds / 60)
  if (elapsedMinutes < 60) return `${elapsedMinutes} menit lalu`

  const elapsedHours = Math.floor(elapsedMinutes / 60)
  if (elapsedHours < 24) return `${elapsedHours} jam lalu`

  const elapsedDays = Math.floor(elapsedHours / 24)
  return `${elapsedDays} hari lalu`
}

export function AccountList({ routeRole, data }: AccountListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const config = ACCOUNT_ROUTE_CONFIG[routeRole]
  const [confirmation, setConfirmation] = useState<ConfirmationState>(null)
  const [isPending, startTransition] = useTransition()
  const [now, setNow] = useState(() => new Date(data.generatedAt).getTime())

  useEffect(() => {
    const timer = window.setInterval(() => setNow(Date.now()), 30_000)
    return () => window.clearInterval(timer)
  }, [])

  function buildHref(page: number, query = data.query) {
    const params = new URLSearchParams()
    const normalizedQuery = query.trim()

    if (normalizedQuery) params.set("q", normalizedQuery)
    if (page > 1) params.set("page", String(page))

    const search = params.toString()
    return search ? `${pathname}?${search}` : pathname
  }

  function handleSearch(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const query = String(formData.get("q") ?? "")
    router.push(buildHref(1, query))
  }

  function handleConfirm() {
    if (!confirmation) return

    const { action, account } = confirmation
    startTransition(async () => {
      const result =
        action === "delete"
          ? await softDeleteAccountAction({ id: account.id, routeRole })
          : await setAccountBanStatusAction({
              id: account.id,
              routeRole,
              isBanned: action === "ban",
            })

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.refresh()
    })
  }

  const confirmationCopy = confirmation
    ? confirmation.action === "delete"
      ? {
          title: `Hapus ${routeRole === "user" ? "User" : "Admin"}`,
          description: `Apakah Anda yakin ingin menghapus account ${confirmation.account.name} (${confirmation.account.id})? Account akan di-soft-delete dan tidak lagi muncul pada dashboard.`,
          confirmText: "Ya, Hapus Account",
          variant: "destructive" as const,
        }
      : confirmation.action === "ban"
        ? {
            title: "Konfirmasi Ban Account",
            description: `Apakah Anda yakin ingin memblokir account ${confirmation.account.name} (${confirmation.account.id})?`,
            confirmText: "Ya, Ban Account",
            variant: "destructive" as const,
          }
        : {
            title: "Konfirmasi Unban Account",
            description: `Apakah Anda yakin ingin membuka blokir account ${confirmation.account.name} (${confirmation.account.id})?`,
            confirmText: "Ya, Unban Account",
            variant: "default" as const,
          }
    : null

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">{config.title}</h2>
          <p className="text-muted-foreground">{config.description}</p>
        </div>
        <CreateAccountDialog key={routeRole} routeRole={routeRole} />
      </div>

      <div className="overflow-hidden rounded-xl border bg-background shadow-sm">
        <div className="border-b p-4">
          <form onSubmit={handleSearch} className="flex max-w-md gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                name="q"
                defaultValue={data.query}
                placeholder={config.searchPlaceholder}
                className="pl-9"
              />
            </div>
            <Button type="submit" variant="outline">
              Cari
            </Button>
          </form>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="border-b bg-muted/50 text-xs uppercase text-muted-foreground">
              <tr>
                <th className="px-6 py-4 font-semibold">User ID</th>
                <th className="px-6 py-4 font-semibold">Profile & Nama</th>
                <th className="px-6 py-4 font-semibold">Email</th>
                <th className="px-6 py-4 font-semibold">Role / Status</th>
                <th className="px-6 py-4 font-semibold">Date Created</th>
                <th className="px-6 py-4 font-semibold">Last Activity</th>
                <th className="px-6 py-4 text-right font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.length > 0 ? (
                data.items.map((account) => (
                  <tr
                    key={account.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="max-w-52 px-6 py-4 font-mono text-xs text-muted-foreground">
                      <span className="block truncate" title={account.id}>
                        {account.id}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={account.avatarUrl || DEFAULT_AVATAR}
                          alt={account.name}
                          className="size-8 rounded-full bg-muted object-cover"
                        />
                        <div className="flex flex-col">
                          <span className="font-semibold text-foreground">
                            {account.name}
                          </span>
                          {account.isBanned && (
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                              Banned
                            </span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {account.email}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex items-center gap-1.5">
                        <span
                          className={`rounded-full px-2.5 py-0.5 text-xs font-semibold ${roleClassName(account.role)}`}
                        >
                          {roleLabel(account.role)}
                        </span>
                        {account.isBanned && (
                          <span className="rounded-full bg-red-50 px-2 py-0.5 text-xs font-semibold text-red-600">
                            Banned
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-muted-foreground">
                      {account.createdAtLabel}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-xs text-muted-foreground">
                      {account.isOnline &&
                      (!account.lastActivityAt ||
                        now - new Date(account.lastActivityAt).getTime() <
                          10 * 60 * 1000) ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-2.5 py-1 font-semibold text-emerald-700">
                          <span className="size-1.5 rounded-full bg-emerald-500" />
                          Online
                        </span>
                      ) : (
                        formatRelativeActivity(account.lastActivityAt, now)
                      )}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="gap-1.5 text-xs"
                          onClick={() =>
                            router.push(
                              `/dashboard/account/${routeRole}/${account.id}`,
                            )
                          }
                        >
                          <Eye className="size-3.5" /> View
                        </Button>
                        {account.role !== "SUPERADMIN" && (
                          <>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isPending}
                              className={
                                account.isBanned
                                  ? "gap-1.5 border-emerald-200 text-xs text-emerald-600 hover:bg-emerald-50"
                                  : "gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50"
                              }
                              onClick={() =>
                                setConfirmation({
                                  action: account.isBanned ? "unban" : "ban",
                                  account,
                                })
                              }
                            >
                              {account.isBanned ? (
                                <ShieldCheck className="size-3.5" />
                              ) : (
                                <Ban className="size-3.5" />
                              )}
                              {account.isBanned ? "Unban" : "Ban"}
                            </Button>
                            <Button
                              variant="outline"
                              size="sm"
                              disabled={isPending}
                              className="gap-1.5 border-red-200 text-xs text-red-600 hover:bg-red-50"
                              onClick={() =>
                                setConfirmation({ action: "delete", account })
                              }
                            >
                              <Trash2 className="size-3.5" /> Delete
                            </Button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={7}
                    className="px-6 py-10 text-center text-muted-foreground"
                  >
                    Tidak ada {config.emptyLabel} yang cocok dengan pencarian
                    {data.query ? ` "${data.query}"` : ""}.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        <PaginationControls
          currentPage={data.page}
          totalPages={data.totalPages}
          totalItems={data.totalItems}
          itemsPerPage={data.pageSize}
          onPageChange={(page) => router.push(buildHref(page))}
        />
      </div>

      {confirmationCopy && (
        <ConfirmActionDialog
          open={confirmation !== null}
          onOpenChange={(open) => {
            if (!open) setConfirmation(null)
          }}
          title={confirmationCopy.title}
          description={confirmationCopy.description}
          confirmText={confirmationCopy.confirmText}
          cancelText="Batal"
          variant={confirmationCopy.variant}
          onConfirm={handleConfirm}
        />
      )}
    </div>
  )
}
