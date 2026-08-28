"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

import type { OverviewRecentLogItem } from "../types/overview"

interface OverviewRecentLogsProps {
  logs: OverviewRecentLogItem[]
}

export function OverviewRecentLogs({ logs }: OverviewRecentLogsProps) {
  return (
    <Card className="col-span-1 md:col-span-1 lg:col-span-3 shadow-xs border-border overflow-hidden flex flex-col">
      <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-3.5 px-6">
        <CardTitle className="text-base font-bold">Log Aktivitas Terbaru</CardTitle>
        <Link
          href="/dashboard/logs"
          className="text-xs font-semibold text-palembang-red hover:underline inline-flex items-center gap-0.5"
        >
          Lihat Semua
          <ArrowUpRight className="size-3.5" />
        </Link>
      </CardHeader>
      <CardContent className="p-4 flex-1">
        {logs.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            Belum ada aktivitas yang tercatat.
          </div>
        ) : (
          <div className="flex flex-col gap-3">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-xl border bg-card hover:bg-muted/30 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-foreground truncate">{log.user}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">{log.timeAgo}</p>
                  </div>
                </div>
                <div className="shrink-0">
                  <span className="text-[10px] sm:text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full font-medium inline-block">
                    {log.module} - {log.action}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
