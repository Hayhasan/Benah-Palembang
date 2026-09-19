"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  ResponsiveContainer,
} from "recharts"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart3, LineChartIcon, TrendingUp } from "lucide-react"

import type { OverviewChartPoint } from "../types/overview"

interface OverviewChartProps {
  chartData: OverviewChartPoint[]
  periodLabel: string
}

type ChartViewType = "bar" | "line"

export function OverviewChart({ chartData, periodLabel }: OverviewChartProps) {
  const [chartView, setChartView] = useState<ChartViewType>("bar")

  return (
    <Card className="shadow-xs border-border overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b pb-3">
        <div>
          <CardTitle className="text-base font-bold flex items-center gap-2">
            <TrendingUp className="size-4 text-palembang-red" />
            Grafik Kunjungan
          </CardTitle>
          <p className="text-xs text-muted-foreground mt-0.5">
            Data kunjungan (views) ({periodLabel})
          </p>
        </div>
        <div className="flex items-center gap-2">
          {/* Chart View Toggle */}
          <div className="inline-flex items-center bg-muted/60 p-0.5 rounded-lg border border-border shadow-xs">
            <button
              type="button"
              onClick={() => setChartView("bar")}
              className={`p-2 rounded-md cursor-pointer transition-all active:scale-95 ${
                chartView === "bar"
                  ? "bg-palembang-red text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              aria-label="Bar Chart"
            >
              <BarChart3 className="size-4" />
            </button>
            <button
              type="button"
              onClick={() => setChartView("line")}
              className={`p-2 rounded-md cursor-pointer transition-all active:scale-95 ${
                chartView === "line"
                  ? "bg-palembang-red text-white shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              }`}
              aria-label="Line Chart"
            >
              <LineChartIcon className="size-4" />
            </button>
          </div>
          {/* Legend */}
          <div className="hidden sm:flex items-center gap-4 text-xs font-medium ml-2">
            <span className="flex items-center gap-1.5 text-palembang-red">
              <span className="size-2.5 rounded-full bg-palembang-red inline-block" /> Page Views
            </span>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-6 pb-4 px-2 sm:px-6">
        <div className="pointer-events-none select-none">
          <ResponsiveContainer width="100%" height={280}>
            {chartView === "bar" ? (
              <BarChart data={chartData} barCategoryGap="20%">
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  className="text-muted-foreground"
                />
                <Bar
                  dataKey="views"
                  name="views"
                  fill="var(--color-palembang-red, #C62828)"
                  radius={[6, 6, 0, 0]}
                  maxBarSize={40}
                  isAnimationActive={false}
                />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                <XAxis
                  dataKey="name"
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  className="text-muted-foreground"
                />
                <YAxis
                  tick={{ fontSize: 11 }}
                  tickLine={false}
                  axisLine={false}
                  width={40}
                  className="text-muted-foreground"
                />
                <Line
                  type="monotone"
                  dataKey="views"
                  name="views"
                  stroke="var(--color-palembang-red, #C62828)"
                  strokeWidth={2.5}
                  dot={{ fill: "var(--color-palembang-red, #C62828)", r: 4 }}
                  activeDot={false}
                  isAnimationActive={false}
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </div>
        {/* Mobile Legend */}
        <div className="flex sm:hidden items-center justify-center gap-4 text-xs font-medium mt-3 pt-3 border-t border-border/60">
          <span className="flex items-center gap-1.5 text-palembang-red">
            <span className="size-2.5 rounded-full bg-palembang-red inline-block" /> Page Views
          </span>
        </div>
      </CardContent>
    </Card>
  )
}
