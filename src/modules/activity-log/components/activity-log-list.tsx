"use client"

import {
  Search,
  Trash2,
  Edit,
  Plus,
  LogIn,
  Eye,
  ShieldAlert,
  CheckCircle2,
  RotateCcw,
  Activity,
  History,
} from "lucide-react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { useState, useTransition } from "react"

import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { Button } from "@/components/ui/button"

import type { ActivityLogItem, ActivityLogListResult } from "../types/activity-log"
import { ActivityLogDetailDialog } from "./activity-log-detail-dialog"

interface ActivityLogListProps {
  data: ActivityLogListResult
}

function renderActionIcon(iconName: ActivityLogItem["iconName"]) {
  switch (iconName) {
    case "plus":
      return <Plus className="size-3.5" />
    case "edit":
      return <Edit className="size-3.5" />
    case "trash":
      return <Trash2 className="size-3.5" />
    case "login":
      return <LogIn className="size-3.5" />
    case "shield-alert":
      return <ShieldAlert className="size-3.5" />
    case "check-circle":
      return <CheckCircle2 className="size-3.5" />
    case "rotate-ccw":
      return <RotateCcw className="size-3.5" />
    default:
      return <Activity className="size-3.5" />
  }
}

export function ActivityLogList({ data }: ActivityLogListProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const [selectedLog, setSelectedLog] = useState<ActivityLogItem | null>(null)
  const [dialogOpen, setDialogOpen] = useState(false)
  const [searchInput, setSearchInput] = useState(data.query)

  const updateUrl = (newPage: number, newQuery: string) => {
    const params = new URLSearchParams(searchParams.toString())

    if (newQuery.trim()) {
      params.set("q", newQuery.trim())
    } else {
      params.delete("q")
    }

    if (newPage > 1) {
      params.set("page", String(newPage))
    } else {
      params.delete("page")
    }

    startTransition(() => {
      const qs = params.toString()
      router.push(qs ? `${pathname}?${qs}` : pathname)
    })
  }

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    updateUrl(1, searchInput)
  }

  const handlePageChange = (page: number) => {
    updateUrl(page, data.query)
  }

  const openDetail = (log: ActivityLogItem) => {
    setSelectedLog(log)
    setDialogOpen(true)
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Log Activities</h2>
          <p className="text-muted-foreground">
            Melacak semua aktivitas perubahan yang terjadi di website.
          </p>
        </div>
      </div>

      <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full sm:w-80">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Cari log (user, aksi, deskripsi)..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
            />
          </form>
          {isPending && (
            <span className="text-xs text-muted-foreground animate-pulse self-center sm:self-auto">
              Memuat data...
            </span>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
              <tr>
                <th className="px-6 py-4 font-semibold">User</th>
                <th className="px-6 py-4 font-semibold">Aksi</th>
                <th className="px-6 py-4 font-semibold">Modul</th>
                <th className="px-6 py-4 font-semibold">Deskripsi Aktivitas</th>
                <th className="px-6 py-4 font-semibold">Waktu</th>
                <th className="px-6 py-4 font-semibold text-right">Detail</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {data.items.length > 0 ? (
                data.items.map((log) => (
                  <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="font-semibold text-foreground">{log.userName}</span>
                      <p className="text-xs text-muted-foreground mt-0.5">{log.roleLabel}</p>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className={`p-1.5 rounded-md ${log.colorClass}`}>
                          {renderActionIcon(log.iconName)}
                        </div>
                        <span className="font-medium text-foreground">{log.actionLabel}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="px-2.5 py-0.5 bg-muted rounded-full text-xs font-semibold text-foreground">
                        {log.moduleLabel}
                      </span>
                    </td>
                    <td
                      className="px-6 py-4 text-muted-foreground max-w-[320px] truncate"
                      title={log.description}
                    >
                      {log.description}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">
                      {log.time}
                    </td>
                    <td className="px-6 py-4 text-right whitespace-nowrap">
                      <Button
                        variant="outline"
                        size="sm"
                        className="gap-1.5 text-xs text-foreground hover:bg-muted"
                        onClick={() => openDetail(log)}
                      >
                        <Eye className="size-3.5" /> Detail
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={6} className="px-6 py-12 text-center text-muted-foreground">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <History className="size-8 text-muted-foreground/50" />
                      <p className="font-medium text-foreground">
                        {data.query
                          ? `Tidak ada log yang cocok dengan pencarian "${data.query}"`
                          : "Belum ada aktivitas yang tercatat"}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {data.query
                          ? "Coba gunakan kata kunci pencarian yang lain."
                          : "Seluruh aktivitas operasional dan mutasi data akan muncul di sini."}
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {data.totalItems > 0 && (
          <PaginationControls
            currentPage={data.page}
            totalPages={data.totalPages}
            totalItems={data.totalItems}
            itemsPerPage={data.pageSize}
            onPageChange={handlePageChange}
          />
        )}
      </div>

      <ActivityLogDetailDialog
        log={selectedLog}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  )
}
