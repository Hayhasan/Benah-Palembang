"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { TrendingUp } from "lucide-react"

import type { OverviewChartPoint } from "../types/overview"

interface OverviewChartProps {
  chartData: OverviewChartPoint[]
  periodLabel: string
}

export function OverviewChart({ chartData, periodLabel }: OverviewChartProps) {
  const maxViews = Math.max(...chartData.map((d) => d.views), 100)
  const maxInteractions = Math.max(...chartData.map((d) => d.interactions), 20)

  return (
    <Card className="shadow-xs border-border overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b pb-3">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="size-4 text-palembang-red" />
            Grafik Performa & Kunjungan Pembaca
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Data kunjungan (views) dan interaksi ({periodLabel})
          </p>
        </div>
        <div className="flex items-center gap-4 text-xs font-medium">
          <span className="flex items-center gap-1.5 text-palembang-red">
            <span className="size-2.5 rounded-full bg-palembang-red inline-block" /> Page Views
          </span>
          <span className="flex items-center gap-1.5 text-palembang-charcoal dark:text-palembang-gold">
            <span className="size-2.5 rounded-full bg-palembang-charcoal dark:bg-palembang-gold inline-block" />{" "}
            Interaksi
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4 px-4 sm:px-6">
        <div className="space-y-4">
          <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 sm:gap-4 items-end h-[190px] pt-6 pb-2 border-b border-border/60">
            {chartData.map((item, idx) => {
              const heightPercent = Math.min(
                100,
                Math.max(15, Math.round((item.views / maxViews) * 100)),
              )
              const interPercent = Math.min(
                100,
                Math.max(10, Math.round((item.interactions / maxInteractions) * 100)),
              )

              return (
                <div
                  key={idx}
                  className="group relative flex flex-col items-center h-full justify-end"
                >
                  {/* Hover Tooltip */}
                  <div className="absolute -top-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-palembang-charcoal text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap border border-white/10">
                    <p className="font-bold text-palembang-gold">{item.name}</p>
                    <p className="text-white/90 font-medium">
                      {item.views.toLocaleString("id-ID")} Views
                    </p>
                    <p className="text-white/60 text-[10px]">
                      {item.interactions.toLocaleString("id-ID")} Interaksi
                    </p>
                  </div>

                  {/* Dual Metric Bars */}
                  <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-full pb-1">
                    {/* Views Bar */}
                    <div
                      style={{ height: `${heightPercent}%` }}
                      className="w-1/2 bg-gradient-to-t from-palembang-red/80 to-palembang-red rounded-t-md group-hover:brightness-110 transition-all duration-500 shadow-xs"
                    />
                    {/* Interactions Bar */}
                    <div
                      style={{ height: `${interPercent}%` }}
                      className="w-1/3 bg-gradient-to-t from-zinc-700 to-zinc-500 dark:from-palembang-gold/60 dark:to-palembang-gold rounded-t-sm group-hover:brightness-125 transition-all duration-500"
                    />
                  </div>

                  {/* Label */}
                  <span className="text-[11px] font-medium text-muted-foreground mt-2 truncate w-full text-center group-hover:text-foreground group-hover:font-bold transition-colors">
                    {item.name}
                  </span>
                </div>
              )
            })}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
