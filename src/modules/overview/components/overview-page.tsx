"use client"

import { useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import type { OverviewData, OverviewFilterType } from "../types/overview"
import { OverviewChart } from "./overview-chart"
import { OverviewMetricCards } from "./overview-metric-cards"
import { OverviewRecentContent } from "./overview-recent-content"
import { OverviewRecentLogs } from "./overview-recent-logs"

interface OverviewPageProps {
  initialData: OverviewData
}

export function OverviewPage({ initialData }: OverviewPageProps) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()

  const handlePeriodChange = (newPeriod: OverviewFilterType, newMonth?: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    params.set("period", newPeriod)
    if (newMonth) {
      params.set("month", newMonth)
    } else if (newPeriod !== "monthly") {
      params.delete("month")
    }

    startTransition(() => {
      router.push(`${pathname}?${params.toString()}`)
    })
  }

  const handleMonthSelect = (selectedMonth: string) => {
    handlePeriodChange("monthly", selectedMonth)
  }

  return (
    <div
      className={`space-y-8 pb-10 transition-opacity duration-200 ${
        isPending ? "opacity-70 pointer-events-none" : "opacity-100"
      }`}
    >
      {/* Header + Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight font-display">Overview</h2>
          <p className="text-muted-foreground text-sm mt-0.5">
            Ringkasan aktivitas dan performa website •{" "}
            <span className="font-semibold text-foreground">{initialData.periodLabel}</span>
          </p>
        </div>

        {/* Filter Area: Tab Bar (Harian / Mingguan) + Dropdown (Bulanan) */}
        <div className="flex flex-wrap items-center gap-2.5">
          {/* Tab Bar for Harian & Mingguan */}
          <div className="inline-flex items-center bg-muted/60 p-1 rounded-xl border border-border shadow-xs">
            <button
              type="button"
              onClick={() => handlePeriodChange("daily")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                initialData.periodType === "daily"
                  ? "bg-palembang-red text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Harian
            </button>
            <button
              type="button"
              onClick={() => handlePeriodChange("weekly")}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                initialData.periodType === "weekly"
                  ? "bg-palembang-red text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Mingguan
            </button>
          </div>

          {/* Dropdown for Bulanan */}
          <div className="w-[180px]">
            <Select
              value={initialData.periodType === "monthly" ? initialData.selectedMonth : ""}
              onValueChange={handleMonthSelect}
            >
              <SelectTrigger
                className={`h-9 text-xs rounded-xl transition-colors ${
                  initialData.periodType === "monthly"
                    ? "border-palembang-red bg-palembang-red/10 text-palembang-red font-semibold"
                    : "bg-background"
                }`}
              >
                <SelectValue placeholder="Pilih Bulan (Bulanan)">
                  {initialData.periodType === "monthly"
                    ? initialData.selectedMonth
                    : "Bulanan (Pilih)"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent className="max-h-60">
                {initialData.availableMonths.map((month) => (
                  <SelectItem key={month} value={month} className="text-xs">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      {/* 6 Metric Overview Cards */}
      <OverviewMetricCards metrics={initialData.metrics} />

      {/* Interactive Analytics Graph */}
      <OverviewChart
        chartData={initialData.chartData}
        periodLabel={initialData.periodLabel}
      />

      {/* Bottom Section: Content Approval & Logs */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <OverviewRecentContent items={initialData.recentContents} />
        <OverviewRecentLogs logs={initialData.recentLogs} />
      </div>
    </div>
  )
}
