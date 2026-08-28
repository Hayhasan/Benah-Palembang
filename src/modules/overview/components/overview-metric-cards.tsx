"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Activity,
  CalendarPlus,
  Eye,
  FileText,
  MousePointerClick,
  Users,
} from "lucide-react"

import type { OverviewData } from "../types/overview"

interface OverviewMetricCardsProps {
  metrics: OverviewData["metrics"]
}

export function OverviewMetricCards({ metrics }: OverviewMetricCardsProps) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {/* 1. Total Users */}
      <Card className="bg-palembang-charcoal text-white border-none shadow-md transition-all">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
          <Users className="size-4 opacity-70" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-display">{metrics.users.total}</div>
          <p className="text-xs opacity-70 mt-1">{metrics.users.growth}</p>
        </CardContent>
      </Card>

      {/* 2. Total Artikel */}
      <Card className="shadow-xs border-border">
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

      {/* 3. Total Event */}
      <Card className="shadow-xs border-border">
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

      {/* 4. Page Views */}
      <Card className="bg-palembang-red text-white border-none shadow-md">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Page Views</CardTitle>
          <Eye className="size-4 opacity-70" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-display">{metrics.views.total}</div>
          <p className="text-xs opacity-70 mt-1">{metrics.views.growth}</p>
        </CardContent>
      </Card>

      {/* 5. Klik CTA & Interaksi */}
      <Card className="shadow-xs border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Klik CTA</CardTitle>
          <MousePointerClick className="size-4 text-palembang-red" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
            {metrics.clicks.total}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{metrics.clicks.growth}</p>
        </CardContent>
      </Card>

      {/* 6. Aktivitas */}
      <Card className="shadow-xs border-border">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-xs sm:text-sm font-medium">Aktivitas</CardTitle>
          <Activity className="size-4 text-palembang-red" />
        </CardHeader>
        <CardContent>
          <div className="text-xl sm:text-2xl font-bold font-display text-foreground">
            {metrics.logs.total}
          </div>
          <p className="text-xs text-muted-foreground mt-1">{metrics.logs.growth}</p>
        </CardContent>
      </Card>
    </div>
  )
}
