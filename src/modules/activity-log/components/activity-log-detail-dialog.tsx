"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { ActivityLogItem } from "../types/activity-log"

interface ActivityLogDetailDialogProps {
  log: ActivityLogItem | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ActivityLogDetailDialog({
  log,
  open,
  onOpenChange,
}: ActivityLogDetailDialogProps) {
  if (!log) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[560px] max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg">Detail Log Aktivitas #{log.id}</DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Perubahan data oleh <span className="font-semibold text-foreground">{log.userName}</span> ({log.roleLabel}) pada modul{" "}
            <span className="font-semibold text-foreground">{log.moduleLabel}</span> &bull; {log.time}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="p-3 bg-muted/40 rounded-lg border text-xs space-y-1">
            <p className="font-medium text-foreground">{log.description}</p>
            {(log.ipAddress || log.userAgent) && (
              <p className="text-muted-foreground text-[11px]">
                {log.ipAddress ? `IP: ${log.ipAddress}` : ""}
                {log.ipAddress && log.userAgent ? " • " : ""}
                {log.userAgent ? `Perangkat: ${log.userAgent}` : ""}
              </p>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-red-600 dark:text-red-400 flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-red-600 dark:bg-red-400" /> Sebelum (Before)
              </h4>
              <pre className="bg-muted/60 p-3 rounded-md text-xs font-mono overflow-auto border max-h-[260px] text-foreground leading-relaxed">
                {log.details.before
                  ? JSON.stringify(log.details.before, null, 2)
                  : <span className="text-muted-foreground italic">Null / Tidak ada data sebelumnya</span>}
              </pre>
            </div>

            <div className="space-y-1.5">
              <h4 className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
                <div className="size-2 rounded-full bg-emerald-600 dark:bg-emerald-400" /> Sesudah (After)
              </h4>
              <pre className="bg-muted/60 p-3 rounded-md text-xs font-mono overflow-auto border max-h-[260px] text-foreground leading-relaxed">
                {log.details.after
                  ? JSON.stringify(log.details.after, null, 2)
                  : <span className="text-muted-foreground italic">Null / Record dihapus</span>}
              </pre>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
