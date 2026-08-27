"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CalendarPlus, Activity, Eye, MousePointerClick, TrendingUp } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"


const monthsList = [
    "Januari 2026",
    "Februari 2026",
    "Maret 2026",
    "April 2026",
    "Mei 2026",
    "Juni 2026",
    "Juli 2026",
    "Agustus 2026",
    "September 2026",
    "Oktober 2026",
    "November 2026",
    "Desember 2026",
]

interface PeriodData {
    periodLabel: string
    users: { total: string; growth: string }
    articles: { total: string; growth: string }
    events: { total: string; growth: string }
    views: { total: string; growth: string }
    clicks: { total: string; growth: string }
    logs: { total: string; growth: string }
    chartData: { name: string; views: number; interactions: number }[]
}

const mockOverviewData: Record<string, PeriodData> = {
    daily: {
        periodLabel: "Harian (24 Jam Terakhir)",
        users: { total: "148", growth: "+14 hari ini" },
        articles: { total: "3", growth: "+3 artikel hari ini" },
        events: { total: "1", growth: "+1 event hari ini" },
        views: { total: "2.8K", growth: "+8.5% dibanding kemarin" },
        clicks: { total: "142", growth: "Hari ini" },
        logs: { total: "12", growth: "Log tercatat hari ini" },
        chartData: [
            { name: "00:00", views: 120, interactions: 15 },
            { name: "04:00", views: 80, interactions: 8 },
            { name: "08:00", views: 450, interactions: 42 },
            { name: "12:00", views: 820, interactions: 85 },
            { name: "16:00", views: 710, interactions: 64 },
            { name: "20:00", views: 620, interactions: 52 },
        ],
    },
    weekly: {
        periodLabel: "Mingguan (7 Hari Terakhir)",
        users: { total: "492", growth: "+38 minggu ini" },
        articles: { total: "18", growth: "+14 artikel minggu ini" },
        events: { total: "6", growth: "+4 event minggu ini" },
        views: { total: "18.5K", growth: "+15.2% dibanding pekan lalu" },
        clicks: { total: "980", growth: "Pekan ini" },
        logs: { total: "64", growth: "Log tercatat pekan ini" },
        chartData: [
            { name: "Senin", views: 2100, interactions: 190 },
            { name: "Selasa", views: 2400, interactions: 210 },
            { name: "Rabu", views: 2800, interactions: 260 },
            { name: "Kamis", views: 2600, interactions: 230 },
            { name: "Jumat", views: 3100, interactions: 290 },
            { name: "Sabtu", views: 3500, interactions: 340 },
            { name: "Minggu", views: 2000, interactions: 180 },
        ],
    },
    "Juni 2026": {
        periodLabel: "Bulan Juni 2026",
        users: { total: "1,120", growth: "+10% pada Juni 2026" },
        articles: { total: "42", growth: "+8 artikel baru" },
        events: { total: "12", growth: "+3 event baru" },
        views: { total: "39.4K", growth: "+11% pada Juni 2026" },
        clicks: { total: "1.8K", growth: "Total Juni 2026" },
        logs: { total: "210", growth: "Log tercatat" },
        chartData: [
            { name: "Minggu 1", views: 8900, interactions: 410 },
            { name: "Minggu 2", views: 9800, interactions: 460 },
            { name: "Minggu 3", views: 10400, interactions: 490 },
            { name: "Minggu 4", views: 10300, interactions: 440 },
        ],
    },
    "Juli 2026": {
        periodLabel: "Bulan Juli 2026",
        users: { total: "1,180", growth: "+11.5% pada Juli 2026" },
        articles: { total: "49", growth: "+10 artikel baru" },
        events: { total: "14", growth: "+4 event baru" },
        views: { total: "42.8K", growth: "+14% pada Juli 2026" },
        clicks: { total: "1.9K", growth: "Total Juli 2026" },
        logs: { total: "245", growth: "Log tercatat" },
        chartData: [
            { name: "Minggu 1", views: 9400, interactions: 430 },
            { name: "Minggu 2", views: 10600, interactions: 480 },
            { name: "Minggu 3", views: 11200, interactions: 520 },
            { name: "Minggu 4", views: 11600, interactions: 530 },
        ],
    },
    "Agustus 2026": {
        periodLabel: "Bulan Agustus 2026",
        users: { total: "1,234", growth: "+12.4% pada Agustus 2026" },
        articles: { total: "56", growth: "+12 artikel baru" },
        events: { total: "15", growth: "+5 event baru" },
        views: { total: "45.2K", growth: "+18.2% pada Agustus 2026" },
        clicks: { total: "2.1K", growth: "Total Agustus 2026" },
        logs: { total: "320", growth: "Log tercatat" },
        chartData: [
            { name: "Minggu 1", views: 10200, interactions: 480 },
            { name: "Minggu 2", views: 11400, interactions: 530 },
            { name: "Minggu 3", views: 11800, interactions: 560 },
            { name: "Minggu 4", views: 11800, interactions: 550 },
        ],
    },
}

const defaultMonthlyData: PeriodData = {
    periodLabel: "Bulanan",
    users: { total: "1,150", growth: "+9% bulan ini" },
    articles: { total: "45", growth: "+8 artikel baru" },
    events: { total: "13", growth: "+3 event baru" },
    views: { total: "41.0K", growth: "+12% bulan ini" },
    clicks: { total: "1.9K", growth: "Bulan ini" },
    logs: { total: "230", growth: "Log tercatat" },
    chartData: [
        { name: "Minggu 1", views: 9500, interactions: 430 },
        { name: "Minggu 2", views: 10200, interactions: 470 },
        { name: "Minggu 3", views: 10800, interactions: 500 },
        { name: "Minggu 4", views: 10500, interactions: 480 },
    ],
}

const recentContents = [
    { id: 1, title: "Jejak Sejarah Kesultanan Palembang", type: "Article", status: "Request" },
    { id: 2, title: "Festival Kuliner Malam Ampera", type: "Event", status: "Posted" },
    { id: 3, title: "Opini: Ruang Terbuka Hijau", type: "Article", status: "Takedown" },
]

const recentLogs = [
    { id: 1, user: "Budi Hartono", action: "Create", module: "Article", time: "14:00" },
    { id: 2, user: "Siti Aminah", action: "Edit", module: "Profile", time: "10:15" },
    { id: 3, user: "Agus Supriyadi", action: "Takedown", module: "Content", time: "Kemarin" },
    { id: 4, user: "Dina Kirana", action: "Login", module: "Auth", time: "Kemarin" },
]

export function Overview() {
    const [filterType, setFilterType] = useState<"daily" | "weekly" | "monthly">("monthly")
    const [selectedMonth, setSelectedMonth] = useState<string>("Juni 2026")

    // Determine current active data
    const activeData: PeriodData = 
        filterType === "daily"
            ? mockOverviewData.daily
            : filterType === "weekly"
            ? mockOverviewData.weekly
            : mockOverviewData[selectedMonth] || defaultMonthlyData

    return (
        <div className="space-y-8 pb-10">
            {/* Header + Filter Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-display">Overview</h2>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        Ringkasan aktivitas dan performa website • <span className="font-semibold text-foreground">{activeData.periodLabel}</span>
                    </p>
                </div>

                {/* Filter Area: Tab Bar (Harian / Mingguan) + Dropdown (Bulanan) */}
                <div className="flex flex-wrap items-center gap-2.5">
                    {/* Tab Bar for Harian & Mingguan */}
                    <div className="inline-flex items-center bg-muted/60 p-1 rounded-xl border border-border shadow-xs">
                        <button
                            type="button"
                            onClick={() => setFilterType("daily")}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                filterType === "daily"
                                    ? "bg-palembang-red text-white shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                            Harian
                        </button>
                        <button
                            type="button"
                            onClick={() => setFilterType("weekly")}
                            className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-all ${
                                filterType === "weekly"
                                    ? "bg-palembang-red text-white shadow-sm"
                                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                            }`}
                        >
                            Mingguan
                        </button>
                    </div>

                    {/* Dropdown for Bulanan */}
                    <div className="w-[180px]">
                        <Select
                            value={filterType === "monthly" ? selectedMonth : ""}
                            onValueChange={(val) => {
                                setSelectedMonth(val)
                                setFilterType("monthly")
                            }}
                        >
                            <SelectTrigger className={`h-9 text-xs rounded-xl transition-colors ${
                                filterType === "monthly" 
                                    ? "border-palembang-red bg-palembang-red/10 text-palembang-red font-semibold" 
                                    : "bg-background"
                            }`}>
                                <SelectValue placeholder="Pilih Bulan (Bulanan)">
                                    {filterType === "monthly" ? selectedMonth : "Bulanan (Pilih)"}
                                </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-60">
                                {monthsList.map((month) => (
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
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
                <Card className="bg-palembang-charcoal text-white border-none shadow-md transition-all">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
                        <Users className="size-4 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold font-display">{activeData.users.total}</div>
                        <p className="text-xs opacity-70 mt-1">{activeData.users.growth}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Artikel</CardTitle>
                        <FileText className="size-4 text-palembang-red" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold font-display text-foreground">{activeData.articles.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">{activeData.articles.growth}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Total Event</CardTitle>
                        <CalendarPlus className="size-4 text-palembang-red" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold font-display text-foreground">{activeData.events.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">{activeData.events.growth}</p>
                    </CardContent>
                </Card>

                <Card className="bg-palembang-red text-white border-none shadow-md">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Page Views</CardTitle>
                        <Eye className="size-4 opacity-70" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold font-display">{activeData.views.total}</div>
                        <p className="text-xs opacity-70 mt-1">{activeData.views.growth}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Klik CTA</CardTitle>
                        <MousePointerClick className="size-4 text-palembang-red" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold font-display text-foreground">{activeData.clicks.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">{activeData.clicks.growth}</p>
                    </CardContent>
                </Card>

                <Card className="shadow-sm border-border">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-xs sm:text-sm font-medium">Aktivitas</CardTitle>
                        <Activity className="size-4 text-palembang-red" />
                    </CardHeader>
                    <CardContent>
                        <div className="text-xl sm:text-2xl font-bold font-display text-foreground">{activeData.logs.total}</div>
                        <p className="text-xs text-muted-foreground mt-1">{activeData.logs.growth}</p>
                    </CardContent>
                </Card>
            </div>

            {/* Interactive Analytics Graph */}
            <Card className="shadow-sm border-border overflow-hidden">
                <CardHeader className="flex flex-row items-center justify-between bg-muted/20 border-b pb-3">
                    <div>
                        <CardTitle className="text-base font-bold flex items-center gap-2">
                            <TrendingUp className="size-4 text-palembang-red" />
                            Grafik Performa & Kunjungan Pembaca
                        </CardTitle>
                        <p className="text-xs text-muted-foreground mt-0.5">
                            Data kunjungan (views) dan interaksi ({activeData.periodLabel})
                        </p>
                    </div>
                    <div className="flex items-center gap-4 text-xs font-medium">
                        <span className="flex items-center gap-1.5 text-palembang-red">
                            <span className="size-2.5 rounded-full bg-palembang-red inline-block" /> Page Views
                        </span>
                        <span className="flex items-center gap-1.5 text-palembang-charcoal dark:text-palembang-gold">
                            <span className="size-2.5 rounded-full bg-palembang-charcoal dark:bg-palembang-gold inline-block" /> Interaksi
                        </span>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 pb-4 px-4 sm:px-6">
                    <div className="space-y-4">
                        {/* Interactive Bar & Curve Analytics Visualizer */}
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 sm:gap-4 items-end h-[190px] pt-6 pb-2 border-b border-border/60">
                            {activeData.chartData.map((item, idx) => {
                                const maxVal = Math.max(...activeData.chartData.map(d => d.views), 100)
                                const heightPercent = Math.min(100, Math.max(15, Math.round((item.views / maxVal) * 100)))
                                const interPercent = Math.min(100, Math.max(10, Math.round((item.interactions / (maxVal * 0.15 || 50)) * 100)))
                                
                                return (
                                    <div key={idx} className="group relative flex flex-col items-center h-full justify-end">
                                        {/* Hover Tooltip */}
                                        <div className="absolute -top-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-palembang-charcoal text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap border border-white/10">
                                            <p className="font-bold text-palembang-gold">{item.name}</p>
                                            <p className="text-white/90 font-medium">{item.views.toLocaleString()} Views</p>
                                            <p className="text-white/60 text-[10px]">{item.interactions.toLocaleString()} Interaksi</p>
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

            {/* Bottom Section: Content Approval & Logs */}
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-1 md:col-span-1 lg:col-span-4 shadow-sm border-border overflow-hidden flex flex-col">
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="text-lg">Manage Content (Menunggu Persetujuan)</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0 flex-1 overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead className="text-xs text-muted-foreground uppercase bg-muted/20 border-b">
                                <tr>
                                    <th className="px-6 py-3 font-semibold">Tipe</th>
                                    <th className="px-6 py-3 font-semibold">Judul Konten</th>
                                    <th className="px-6 py-3 font-semibold text-right">Status</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y">
                                {recentContents.map((c) => (
                                    <tr key={c.id} className="hover:bg-muted/30">
                                        <td className="px-6 py-3 whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${c.type === 'Article' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                {c.type}
                                            </span>
                                        </td>
                                        <td className="px-6 py-3 font-medium min-w-[200px]">{c.title}</td>
                                        <td className="px-6 py-3 text-right whitespace-nowrap">
                                            <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${
                                                c.status === 'Posted' ? 'bg-emerald-50 text-emerald-600' : 
                                                c.status === 'Request' ? 'bg-amber-50 text-amber-600' : 
                                                'bg-red-50 text-red-600'
                                            }`}>
                                                {c.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </CardContent>
                </Card>

                {/* Log Aktivitas Terbaru - Flex Layout */}
                <Card className="col-span-1 md:col-span-1 lg:col-span-3 shadow-sm border-border overflow-hidden flex flex-col">
                    <CardHeader className="bg-muted/30 border-b">
                        <CardTitle className="text-lg">Log Aktivitas Terbaru</CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 flex-1">
                        <div className="flex flex-col gap-4">
                            {recentLogs.map((log) => (
                                <div key={log.id} className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 p-3 rounded-lg border bg-card hover:bg-muted/30 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-foreground truncate">{log.user}</p>
                                            <p className="text-xs text-muted-foreground mt-0.5">{log.time}</p>
                                        </div>
                                    </div>
                                    <div className="flex-shrink-0">
                                        <span className="text-[10px] sm:text-xs px-2.5 py-1 bg-secondary text-secondary-foreground rounded-full font-medium inline-block">
                                            {log.module} - {log.action}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}