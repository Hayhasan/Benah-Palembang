import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FileText, CalendarPlus, Eye, TrendingUp, BookOpen, Inbox } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useAuth } from "@/context/AuthContext"

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
    requests: { total: string; growth: string }
    userPubs?: { total: string; growth: string }
    userViews?: { total: string; growth: string }
    chartData: { name: string; views: number; interactions: number }[]
}

const defaultMonthlyData: PeriodData = {
    periodLabel: "Bulan Ini",
    users: { total: "128", growth: "+12% dari bulan lalu" },
    articles: { total: "45", growth: "+8 artikel baru" },
    events: { total: "12", growth: "+3 agenda baru" },
    views: { total: "24.5K", growth: "+18.2% pembaca" },
    requests: { total: "8", growth: "3 menunggu review" },
    userPubs: { total: "14", growth: "+2 publikasi baru" },
    userViews: { total: "8.9K", growth: "+15.4% pembaca" },
    chartData: [
        { name: "Mgg 1", views: 4200, interactions: 520 },
        { name: "Mgg 2", views: 5800, interactions: 780 },
        { name: "Mgg 3", views: 6400, interactions: 890 },
        { name: "Mgg 4", views: 8100, interactions: 1010 },
    ]
}

const mockOverviewData: Record<string, PeriodData> = {
    daily: {
        periodLabel: "Hari Ini (28 Agt 2026)",
        users: { total: "14", growth: "+3 user baru" },
        articles: { total: "2", growth: "2 draft diposting" },
        events: { total: "1", growth: "1 agenda terverifikasi" },
        views: { total: "1,420", growth: "+12.4% vs kemarin" },
        requests: { total: "2", growth: "1 menunggu review" },
        userPubs: { total: "14", growth: "Aktif berkarya" },
        userViews: { total: "450", growth: "+8.5% hari ini" },
        chartData: [
            { name: "06:00", views: 120, interactions: 15 },
            { name: "09:00", views: 340, interactions: 45 },
            { name: "12:00", views: 510, interactions: 68 },
            { name: "15:00", views: 620, interactions: 82 },
            { name: "18:00", views: 780, interactions: 95 },
            { name: "21:00", views: 430, interactions: 55 },
        ]
    },
    weekly: {
        periodLabel: "7 Hari Terakhir",
        users: { total: "42", growth: "+18% vs minggu lalu" },
        articles: { total: "11", growth: "+4 artikel baru" },
        events: { total: "4", growth: "+2 agenda baru" },
        views: { total: "7,850", growth: "+14.8% vs minggu lalu" },
        requests: { total: "5", growth: "2 menunggu review" },
        userPubs: { total: "14", growth: "+1 minggu ini" },
        userViews: { total: "2.8K", growth: "+12% minggu ini" },
        chartData: [
            { name: "Sen", views: 890, interactions: 110 },
            { name: "Sel", views: 1050, interactions: 135 },
            { name: "Rab", views: 1200, interactions: 155 },
            { name: "Kam", views: 980, interactions: 120 },
            { name: "Jum", views: 1450, interactions: 190 },
            { name: "Sab", views: 1780, interactions: 230 },
            { name: "Min", views: 1500, interactions: 195 },
        ]
    },
    "Juni 2026": {
        periodLabel: "Juni 2026",
        users: { total: "128", growth: "+12% dari Mei 2026" },
        articles: { total: "45", growth: "+8 artikel baru" },
        events: { total: "12", growth: "+3 agenda baru" },
        views: { total: "24.5K", growth: "+18.2% dari Mei 2026" },
        requests: { total: "8", growth: "3 menunggu review" },
        userPubs: { total: "14", growth: "+2 bulan ini" },
        userViews: { total: "8.9K", growth: "+15.4% bulan ini" },
        chartData: [
            { name: "Mgg 1", views: 4800, interactions: 580 },
            { name: "Mgg 2", views: 5600, interactions: 710 },
            { name: "Mgg 3", views: 6700, interactions: 890 },
            { name: "Mgg 4", views: 7400, interactions: 1020 },
        ]
    },
    "Juli 2026": {
        periodLabel: "Juli 2026",
        users: { total: "145", growth: "+13.2% dari Juni 2026" },
        articles: { total: "52", growth: "+7 artikel baru" },
        events: { total: "15", growth: "+3 agenda baru" },
        views: { total: "28.1K", growth: "+14.7% dari Juni 2026" },
        requests: { total: "12", growth: "4 menunggu review" },
        userPubs: { total: "16", growth: "+2 bulan ini" },
        userViews: { total: "10.2K", growth: "+14.6% bulan ini" },
        chartData: [
            { name: "Mgg 1", views: 5900, interactions: 720 },
            { name: "Mgg 2", views: 6800, interactions: 890 },
            { name: "Mgg 3", views: 7400, interactions: 980 },
            { name: "Mgg 4", views: 8000, interactions: 1210 },
        ]
    },
    "Agustus 2026": {
        periodLabel: "Agustus 2026",
        users: { total: "168", growth: "+15.8% dari Juli 2026" },
        articles: { total: "60", growth: "+8 artikel baru" },
        events: { total: "18", growth: "+3 agenda baru" },
        views: { total: "34.2K", growth: "+21.7% dari Juli 2026" },
        requests: { total: "15", growth: "5 menunggu review" },
        userPubs: { total: "18", growth: "+2 bulan ini" },
        userViews: { total: "12.5K", growth: "+22.5% bulan ini" },
        chartData: [
            { name: "Mgg 1", views: 7200, interactions: 910 },
            { name: "Mgg 2", views: 8400, interactions: 1120 },
            { name: "Mgg 3", views: 9100, interactions: 1240 },
            { name: "Mgg 4", views: 9500, interactions: 1230 },
        ]
    }
}

const recentContents = [
    { id: 1, type: "Article", title: "Menyusuri Jejak Trem di Palembang", author: "Budi Hartono", status: "Posted" },
    { id: 2, type: "Article", title: "Resep Pindang Patin Warisan Karuhun", author: "Siti Aminah", status: "Posted" },
    { id: 3, type: "Event", title: "Pameran Fotografi: Warna Palembang", author: "Agus Supriyadi", status: "Request" },
    { id: 4, type: "Article", title: "Pusat Kebudayaan Sriwijaya: Menjaga Nafas Warisan Luhur", author: "Dina Kirana", status: "Posted" },
    { id: 5, type: "Event", title: "Festival Kuliner Malam Ampera", author: "Rian Pratama", status: "Takedown" },
]

export function Overview() {
    const { user } = useAuth()
    const isUserRole = user?.role === "user"

    const [filterType, setFilterType] = useState<"daily" | "weekly" | "monthly">("monthly")
    const [selectedMonth, setSelectedMonth] = useState<string>("Juni 2026")

    const activeData: PeriodData = 
        filterType === "daily"
            ? mockOverviewData.daily
            : filterType === "weekly"
            ? mockOverviewData.weekly
            : mockOverviewData[selectedMonth] || defaultMonthlyData

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b pb-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight font-display">Overview</h2>
                    <p className="text-muted-foreground text-sm mt-0.5">
                        {isUserRole 
                            ? `Ringkasan performa publikasi Anda • ${activeData.periodLabel}`
                            : `Ringkasan performa & konten website • ${activeData.periodLabel}`
                        }
                    </p>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
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

            {isUserRole ? (
                <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <Card className="shadow-sm border-border bg-card">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Publikasi</CardTitle>
                            <BookOpen className="size-4 text-palembang-red" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-3xl font-bold font-display text-foreground">
                                {activeData.userPubs?.total || "14"}
                            </div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">
                                {activeData.userPubs?.growth || "+2 publikasi baru"}
                            </p>
                        </CardContent>
                    </Card>

                    <Card className="bg-palembang-red text-white border-none shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Views</CardTitle>
                            <Eye className="size-4 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-xl sm:text-3xl font-bold font-display">
                                {activeData.userViews?.total || "8.9K"}
                            </div>
                            <p className="text-[10px] sm:text-xs opacity-80 mt-1">
                                {activeData.userViews?.growth || "+15.4% pembaca"}
                            </p>
                        </CardContent>
                    </Card>
                </div>
            ) : (
                /* Admin & Superadmin: 4 Score Cards (2 columns on mobile, 4 on desktop) */
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                    <Card className="bg-palembang-charcoal text-white border-none shadow-md transition-all">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Users</CardTitle>
                            <Users className="size-4 opacity-70" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg sm:text-2xl font-bold font-display">{activeData.users.total}</div>
                            <p className="text-[10px] sm:text-xs opacity-70 mt-1">{activeData.users.growth}</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Artikel</CardTitle>
                            <FileText className="size-4 text-palembang-red" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg sm:text-2xl font-bold font-display text-foreground">{activeData.articles.total}</div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{activeData.articles.growth}</p>
                        </CardContent>
                    </Card>

                    <Card className="shadow-sm border-border">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Event</CardTitle>
                            <CalendarPlus className="size-4 text-palembang-red" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg sm:text-2xl font-bold font-display text-foreground">{activeData.events.total}</div>
                            <p className="text-[10px] sm:text-xs text-muted-foreground mt-1">{activeData.events.growth}</p>
                        </CardContent>
                    </Card>

                    <Card className="bg-palembang-red text-white border-none shadow-md">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-xs sm:text-sm font-medium">Total Request</CardTitle>
                            <Inbox className="size-4 opacity-80" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-lg sm:text-2xl font-bold font-display">{activeData.requests.total}</div>
                            <p className="text-[10px] sm:text-xs opacity-80 mt-1">{activeData.requests.growth}</p>
                        </CardContent>
                    </Card>
                </div>
            )}

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
                        <div className="grid grid-cols-4 sm:grid-cols-6 md:grid-cols-7 gap-2 sm:gap-4 items-end h-[190px] pt-6 pb-2 border-b border-border/60">
                            {activeData.chartData.map((item, idx) => {
                                const maxVal = Math.max(...activeData.chartData.map(d => d.views), 100)
                                const heightPercent = Math.min(100, Math.max(15, Math.round((item.views / maxVal) * 100)))
                                const interPercent = Math.min(100, Math.max(10, Math.round((item.interactions / (maxVal * 0.15 || 50)) * 100)))
                                
                                return (
                                    <div key={idx} className="group relative flex flex-col items-center h-full justify-end">
                                        <div className="absolute -top-12 z-20 opacity-0 group-hover:opacity-100 transition-opacity bg-palembang-charcoal text-white text-[11px] py-1.5 px-2.5 rounded-lg shadow-lg pointer-events-none whitespace-nowrap border border-white/10">
                                            <p className="font-bold text-palembang-gold">{item.name}</p>
                                            <p className="text-white/90 font-medium">{item.views.toLocaleString()} Views</p>
                                            <p className="text-white/60 text-[10px]">{item.interactions.toLocaleString()} Interaksi</p>
                                        </div>

                                        <div className="w-full max-w-[32px] flex items-end justify-center gap-1 h-full pb-1">
                                            <div 
                                                style={{ height: `${heightPercent}%` }}
                                                className="w-1/2 bg-gradient-to-t from-palembang-red/80 to-palembang-red rounded-t-md group-hover:brightness-110 transition-all duration-500 shadow-xs"
                                            />
                                            <div 
                                                style={{ height: `${interPercent}%` }}
                                                className="w-1/3 bg-gradient-to-t from-zinc-700 to-zinc-500 dark:from-palembang-gold/60 dark:to-palembang-gold rounded-t-sm group-hover:brightness-125 transition-all duration-500"
                                            />
                                        </div>

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

            {!isUserRole && (
                <div className="w-full">
                    <Card className="shadow-sm border-border overflow-hidden flex flex-col">
                        <CardHeader className="bg-muted/30 border-b">
                            <CardTitle className="text-lg">Manage Content (Menunggu Persetujuan)</CardTitle>
                        </CardHeader>
                        <CardContent className="p-0 flex-1 overflow-x-auto no-scrollbar">
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
                                    {recentContents.map((c) => (
                                        <tr key={c.id} className="hover:bg-muted/30">
                                            <td className="px-6 py-3 whitespace-nowrap">
                                                <span className={`px-2 py-1 rounded-full text-[10px] font-semibold ${c.type === 'Article' ? 'bg-blue-50 text-blue-600' : 'bg-purple-50 text-purple-600'}`}>
                                                    {c.type}
                                                </span>
                                            </td>
                                            <td className="px-6 py-3 font-medium min-w-[200px]">{c.title}</td>
                                            <td className="px-6 py-3 text-muted-foreground text-xs">{c.author}</td>
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
                </div>
            )}
        </div>
    )
}
