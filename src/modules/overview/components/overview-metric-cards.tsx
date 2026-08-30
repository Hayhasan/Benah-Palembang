"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BookOpen,
  CalendarPlus,
  FileText,
  Eye,
  Inbox,
  Users,
} from "lucide-react"

import type { OverviewData } from "../types/overview"

export function OverviewMetricCards({ data }: { data: OverviewData }) {
  if (data.audience === "CREATOR") {
    return (
      <div className="grid grid-cols-2 gap-3 sm:gap-4">
        <Card className="border-border bg-card shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Total Publikasi
            </CardTitle>
            <BookOpen className="size-4 text-palembang-red" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-xl font-bold text-foreground sm:text-3xl">
              {data.metrics.publications.total}
            </div>
            <p className="mt-1 text-[10px] text-muted-foreground sm:text-xs">
              {data.metrics.publications.growth}
            </p>
          </CardContent>
        </Card>

        <Card className="border-none bg-palembang-red text-white shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium sm:text-sm">
              Total Views
            </CardTitle>
            <Eye className="size-4 opacity-80" />
          </CardHeader>
          <CardContent>
            <div className="font-display text-xl font-bold sm:text-3xl">
              {data.metrics.views.total}
            </div>
            <p className="mt-1 text-[10px] opacity-80 sm:text-xs">
              {data.metrics.views.growth}
            </p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const { metrics } = data

  return (
    <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
      <Card className="border-none bg-palembang-charcoal text-white shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
          <Users className="size-4 opacity-70" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-display">{metrics.users.total}</div>
          <p className="text-xs opacity-70 mt-1">{metrics.users.growth}</p>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Artikel</CardTitle>
          <FileText className="size-4 text-palembang-red" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
            {metrics.articles.total}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{metrics.articles.growth}</p>
        </CardContent>
      </Card>

      <Card className="border-border shadow-sm">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Event</CardTitle>
          <CalendarPlus className="size-4 text-palembang-red" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
            {metrics.events.total}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{metrics.events.growth}</p>
        </CardContent>
      </Card>

      {/* Total Request */}
      <Card className="bg-palembang-red text-white border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Request</CardTitle>
          <Inbox className="size-4 opacity-80" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-display">{metrics.requests.total}</div>
          <p className="text-xs opacity-80 mt-1">{metrics.requests.growth}</p>
        </CardContent>
      </Card>
    </div>
  )
}
