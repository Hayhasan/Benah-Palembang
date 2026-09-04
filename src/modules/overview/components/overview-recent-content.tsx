"use client"

import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ArrowUpRight } from "lucide-react"

import type { OverviewRecentContentItem } from "../types/overview"

interface OverviewRecentContentProps {
  items: OverviewRecentContentItem[]
}

export function OverviewRecentContent({ items }: OverviewRecentContentProps) {
  return (
    <Card className="flex w-full flex-col overflow-hidden border-border shadow-sm">
      <CardHeader className="bg-muted/30 border-b flex flex-row items-center justify-between py-3.5 px-6">
        <CardTitle className="text-base font-bold">Manage Content (Menunggu Persetujuan)</CardTitle>
        <div className="flex items-center gap-3">
          <Link
            href="/dashboard/content/article"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-palembang-red hover:underline"
          >
            Article
            <ArrowUpRight className="size-3.5" />
          </Link>
          <Link
            href="/dashboard/content/event"
            className="inline-flex items-center gap-0.5 text-xs font-semibold text-palembang-red hover:underline"
          >
            Event
            <ArrowUpRight className="size-3.5" />
          </Link>
        </div>
      </CardHeader>
      <CardContent className="p-0 flex-1 overflow-x-auto">
        {items.length === 0 ? (
          <div className="p-8 text-center text-xs text-muted-foreground">
            Belum ada konten yang memerlukan peninjauan.
          </div>
        ) : (
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b">
              <tr>
                <th className="px-6 py-3 font-semibold">Tipe</th>
                <th className="px-6 py-3 font-semibold">Judul Konten</th>
                <th className="px-6 py-3 font-semibold">Penulis</th>
                <th className="px-6 py-3 font-semibold text-right">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {items.map((c) => (
                <tr key={`${c.type}-${c.id}`} className="hover:bg-muted/30 transition-colors">
                  <td className="px-6 py-3 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                        c.type === "Article"
                          ? "bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400"
                          : "bg-purple-50 text-purple-600 dark:bg-purple-950/50 dark:text-purple-400"
                      }`}
                    >
                      {c.type}
                    </span>
                  </td>
                  <td className="px-6 py-3 font-medium min-w-[200px] text-foreground">
                    <Link
                      href={`/dashboard/content/${c.type === "Article" ? "article" : "event"}/${c.id}`}
                      className="block max-w-[280px] truncate hover:text-palembang-red hover:underline"
                      title={c.title}
                    >
                      {c.title}
                    </Link>
                  </td>
                  <td className="px-6 py-3 text-xs text-muted-foreground whitespace-nowrap">
                    {c.author}
                  </td>
                  <td className="px-6 py-3 text-right whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                        c.status === "Posted"
                          ? "bg-emerald-50 text-emerald-600 dark:bg-emerald-950/50 dark:text-emerald-400"
                          : c.status === "Request"
                            ? "bg-amber-50 text-amber-600 dark:bg-amber-950/50 dark:text-amber-400"
                            : c.status === "Arsip"
                              ? "bg-slate-100 text-slate-600 dark:bg-slate-800/60 dark:text-slate-300"
                              : "bg-red-50 text-red-600 dark:bg-red-950/50 dark:text-red-400"
                      }`}
                    >
                      {c.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </CardContent>
    </Card>
  )
}
