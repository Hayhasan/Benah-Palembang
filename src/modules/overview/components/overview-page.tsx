"use client"

import { useTransition } from "react"
import { usePathname, useRouter, useSearchParams } from "next/navigation"
import { Loader2 } from "lucide-react"
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
            {initialData.audience === "CREATOR"
              ? "Ringkasan performa publikasi Anda"
              : "Ringkasan performa & konten website"}{" "}
            •{" "}
            <span className="font-semibold text-foreground">{initialData.periodLabel}</span>
            {isPending && (
              <span className="inline-flex items-center gap-1.5 ml-2 text-xs text-palembang-red font-semibold animate-pulse">
                <Loader2 className="size-3.5 animate-spin" />
                Memuat data...
              </span>
            )}
          </p>
        </div>

        {/* Filter Area: Tab Bar (Harian / Mingguan) + Dropdown (Bulanan) */}
        <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto">
          {/* Tab Bar for Harian & Mingguan */}
          <div className="inline-flex items-center bg-muted/60 p-1 rounded-xl border border-border shadow-xs flex-1 sm:flex-initial">
            <button
              type="button"
              onClick={() => handlePeriodChange("daily")}
              className={`flex-1 sm:flex-initial px-4 py-2 min-h-[38px] flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all active:scale-95 ${
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
              className={`flex-1 sm:flex-initial px-4 py-2 min-h-[38px] flex items-center justify-center text-xs sm:text-sm font-semibold rounded-lg cursor-pointer transition-all active:scale-95 ${
                initialData.periodType === "weekly"
                  ? "bg-palembang-red text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
            >
              Mingguan
            </button>
          </div>

          {/* Dropdown for Bulanan */}
          <div className="w-full sm:w-[180px]">
            <Select
              value={initialData.periodType === "monthly" ? initialData.selectedMonth : ""}
              onValueChange={handleMonthSelect}
            >
              <SelectTrigger
                className={`h-10 sm:h-9 min-h-[40px] sm:min-h-[36px] text-xs sm:text-sm rounded-xl transition-colors ${
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
                  <SelectItem key={month} value={month} className="text-xs sm:text-sm py-2">
                    {month}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>

      <OverviewMetricCards data={initialData} />

      {/* Interactive Analytics Graph */}
      <OverviewChart
        chartData={initialData.chartData}
        periodLabel={initialData.periodLabel}
      />

      {initialData.audience === "MANAGEMENT" ? (
        <OverviewRecentContent items={initialData.recentContents} />
      ) : null}
    </div>
  )
}
