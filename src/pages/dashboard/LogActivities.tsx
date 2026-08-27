import { Search, Trash2, Edit, Plus, LogIn, Eye, ShieldAlert, CheckCircle2, RotateCcw } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { useState, useMemo } from "react"

type LogType = {
    id: number
    user: string
    role: string
    action: string
    module: string
    desc: string
    time: string
    icon: any
    color: string
    details: {
        before: Record<string, any> | null
        after: Record<string, any> | null
    }
}

const dummyLogs: LogType[] = [
    { id: 1, user: "Budi Hartono", role: "User", action: "Create", module: "Article", desc: "Membuat draft artikel 'Palembang di Balik Senja'", time: "25 Aug 2026, 14:00", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { title: "Palembang di Balik Senja", status: "Draf" } } },
    { id: 2, user: "Siti Aminah", role: "User", action: "Edit", module: "Profile", desc: "Mengubah avatar dan bio profil", time: "25 Aug 2026, 10:15", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { bio: "Bio lama" }, after: { bio: "Bio baru pecinta budaya Palembang" } } },
    { id: 3, user: "Agus Supriyadi", role: "SuperAdmin", action: "Takedown", module: "Content", desc: "Menurunkan artikel 'Pelanggaran Ketentuan Komunitas'", time: "24 Aug 2026, 16:45", icon: Trash2, color: "text-red-500 bg-red-50", details: { before: { status: "Posted" }, after: { status: "Takedown", reason: "Violation of Terms" } } },
    { id: 4, user: "Dina Kirana", role: "Admin", action: "Login", module: "Auth", desc: "Berhasil login ke dalam dashboard admin", time: "24 Aug 2026, 09:30", icon: LogIn, color: "text-zinc-600 bg-zinc-100", details: { before: null, after: { ip: "192.168.1.1", device: "Chrome / Windows" } } },
    { id: 5, user: "Fajar Pratama", role: "Admin", action: "Approve", module: "ManageContent", desc: "Menyetujui event 'Festival Kuliner Malam Ampera'", time: "23 Aug 2026, 15:20", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", details: { before: { status: "Request" }, after: { status: "Posted" } } },
    { id: 6, user: "Rahmat Hidayat", role: "User", action: "Create", module: "Event", desc: "Mengajukan agenda 'Lomba Perahu Bidar 2026'", time: "23 Aug 2026, 11:10", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { title: "Lomba Perahu Bidar 2026", status: "Request" } } },
    { id: 7, user: "Agus Supriyadi", role: "SuperAdmin", action: "Ban", module: "ManageUser", desc: "Memblokir akun pengguna USR-010 karena spam komentar", time: "22 Aug 2026, 17:00", icon: ShieldAlert, color: "text-red-600 bg-red-50", details: { before: { isBanned: false }, after: { isBanned: true, reason: "Spam komentar" } } },
    { id: 8, user: "Nurul Aini", role: "Admin", action: "Edit", module: "ManageWebsite", desc: "Memperbarui banner hero website publik", time: "22 Aug 2026, 13:45", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { title: "Edisi Juli" }, after: { title: "Edisi Agustus 2026" } } },
    { id: 9, user: "Dewi Lestari", role: "User", action: "Edit", module: "Article", desc: "Menyunting isi artikel 'Kain Songket Palembang'", time: "21 Aug 2026, 16:30", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { wordCount: 450 }, after: { wordCount: 780 } } },
    { id: 10, user: "Dina Kirana", role: "Admin", action: "Restore", module: "CreateArticle", desc: "Memulihkan artikel 'Komunitas Skateboard Palembang'", time: "21 Aug 2026, 10:00", icon: RotateCcw, color: "text-amber-500 bg-amber-50", details: { before: { status: "Takedown" }, after: { status: "Post" } } },
    { id: 11, user: "Bayu Pratama", role: "User", action: "Login", module: "Auth", desc: "Pengguna login melalui peramban mobile", time: "20 Aug 2026, 20:15", icon: LogIn, color: "text-zinc-600 bg-zinc-100", details: { before: null, after: { ip: "114.122.45.10", device: "Safari / iOS" } } },
    { id: 12, user: "Siti Rahmawati", role: "Admin", action: "Create", module: "ManageAdmin", desc: "Menambahkan admin baru 'Farhan Hakim'", time: "20 Aug 2026, 14:20", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { email: "farhan.h@benahpalembang.id", role: "Admin" } } },
    { id: 13, user: "Andi Saputra", role: "User", action: "Create", module: "Article", desc: "Membuat draft 'Arsitektur Masjid Cheng Ho'", time: "19 Aug 2026, 09:40", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { title: "Arsitektur Masjid Cheng Ho", status: "Draf" } } },
    { id: 14, user: "Agus Supriyadi", role: "SuperAdmin", action: "Edit", module: "ManageWebsite", desc: "Memperbarui informasi kontak & nomor WhatsApp kolaborasi", time: "19 Aug 2026, 08:30", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { phone: "+62812345678" }, after: { phone: "+628551241878" } } },
    { id: 15, user: "Ayu Wulandari", role: "User", action: "Edit", module: "Profile", desc: "Memperbarui tautan media sosial Instagram & LinkedIn", time: "18 Aug 2026, 15:50", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { ig: "" }, after: { ig: "https://instagram.com/ayuwulan" } } },
    { id: 16, user: "Fajar Pratama", role: "Admin", action: "Reject", module: "ManageContent", desc: "Menolak pengajuan artikel yang tidak sesuai pedoman redaksi", time: "18 Aug 2026, 11:25", icon: Trash2, color: "text-red-500 bg-red-50", details: { before: { status: "Request" }, after: { status: "Rejected" } } },
    { id: 17, user: "Ilham Kurniawan", role: "Admin", action: "Login", module: "Auth", desc: "Login dashboard admin berhasil", time: "17 Aug 2026, 08:00", icon: LogIn, color: "text-zinc-600 bg-zinc-100", details: { before: null, after: { ip: "180.252.12.8", device: "Chrome / macOS" } } },
    { id: 18, user: "Nurul Hidayah", role: "User", action: "Create", module: "Event", desc: "Mengajukan workshop kriya songket", time: "16 Aug 2026, 16:10", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { title: "Workshop Songket Tradisional", status: "Request" } } },
    { id: 19, user: "Dina Kirana", role: "Admin", action: "Approve", module: "ManageContent", desc: "Menyetujui artikel 'Jejak Sejarah Kesultanan Palembang'", time: "16 Aug 2026, 10:45", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", details: { before: { status: "Request" }, after: { status: "Posted" } } },
    { id: 20, user: "Doni Setiawan", role: "User", action: "Edit", module: "Profile", desc: "Memperbarui foto profil avatar", time: "15 Aug 2026, 14:00", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { avatar: "old.jpg" }, after: { avatar: "new.jpg" } } },
    { id: 21, user: "Agus Supriyadi", role: "SuperAdmin", action: "Unban", module: "ManageUser", desc: "Membuka blokir akun pengguna USR-022 setelah masa banding", time: "14 Aug 2026, 17:30", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", details: { before: { isBanned: true }, after: { isBanned: false } } },
    { id: 22, user: "Tania Maharani", role: "User", action: "Create", module: "Article", desc: "Membuat draft 'Ragam Motif Rumah Limas'", time: "13 Aug 2026, 11:15", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { title: "Ragam Motif Rumah Limas", status: "Draf" } } },
    { id: 23, user: "Hendra Saputra", role: "SuperAdmin", action: "Edit", module: "ManageWebsite", desc: "Memperbarui daftar mitra kolaborator di footer", time: "12 Aug 2026, 09:20", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { totalPartners: 4 }, after: { totalPartners: 6 } } },
    { id: 24, user: "Bagus Prasetyo", role: "User", action: "Login", module: "Auth", desc: "Pengguna login ke ruang personal", time: "11 Aug 2026, 19:40", icon: LogIn, color: "text-zinc-600 bg-zinc-100", details: { before: null, after: { ip: "114.124.8.90", device: "Firefox / Windows" } } },
    { id: 25, user: "Cindy Claudia", role: "SuperAdmin", action: "Create", module: "ManageAdmin", desc: "Menambahkan superadmin baru ke sistem manajemen", time: "10 Aug 2026, 13:00", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { email: "cindy.c@benahpalembang.id", role: "SuperAdmin" } } },
    { id: 26, user: "Rahmat Hidayat", role: "Admin", action: "Approve", module: "ManageContent", desc: "Menyetujui posting artikel 'Pindang Patin Karuhun'", time: "09 Aug 2026, 11:20", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", details: { before: { status: "Request" }, after: { status: "Posted" } } },
    { id: 27, user: "Siti Nurhaliza", role: "Admin", action: "Edit", module: "ManageWebsite", desc: "Memperbarui logo sponsor kegiatan festival", time: "08 Aug 2026, 14:10", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { sponsors: 3 }, after: { sponsors: 5 } } },
    { id: 28, user: "Teguh Prakoso", role: "User", action: "Create", module: "Article", desc: "Membuat draft 'Perjalanan Seni Teater Dulmuluk'", time: "07 Aug 2026, 09:30", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { title: "Perjalanan Seni Teater Dulmuluk", status: "Draf" } } },
    { id: 29, user: "Utami Dewi", role: "Admin", action: "Takedown", module: "CreateArticle", desc: "Menurunkan sementara artikel karena revisi data", time: "06 Aug 2026, 16:45", icon: ShieldAlert, color: "text-red-500 bg-red-50", details: { before: { status: "Post" }, after: { status: "Takedown" } } },
    { id: 30, user: "Vicky Prasetya", role: "User", action: "Login", module: "Auth", desc: "Login berhasil melalui perangkat desktop", time: "05 Aug 2026, 18:00", icon: LogIn, color: "text-zinc-600 bg-zinc-100", details: { before: null, after: { ip: "114.125.10.45", device: "Chrome / Windows" } } },
    { id: 31, user: "Winda Amalia", role: "Admin", action: "Create", module: "Event", desc: "Membuat publikasi event 'Palembang Jazz Night'", time: "04 Aug 2026, 10:00", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { title: "Palembang Jazz Night", status: "Post" } } },
    { id: 32, user: "Yogi Pratama", role: "User", action: "Edit", module: "Profile", desc: "Memperbarui biodata singkat di profil", time: "03 Aug 2026, 13:15", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { bio: "" }, after: { bio: "Penikmat kopi dan ruang kota Palembang" } } },
    { id: 33, user: "Zahra Salsabila", role: "Admin", action: "Approve", module: "ManageContent", desc: "Menyetujui agenda 'Workshop Daur Ulang'", time: "02 Aug 2026, 15:40", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", details: { before: { status: "Request" }, after: { status: "Posted" } } },
    { id: 34, user: "Aditya Pratama", role: "User", action: "Login", module: "Auth", desc: "Pengguna login ke dashboard", time: "01 Aug 2026, 08:20", icon: LogIn, color: "text-zinc-600 bg-zinc-100", details: { before: null, after: { ip: "180.250.3.11", device: "Edge / Windows" } } },
    { id: 35, user: "Bella Safira", role: "Admin", action: "Edit", module: "ManageWebsite", desc: "Memperbarui deskripsi visi misi editorial", time: "31 Jul 2026, 11:00", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { version: "1.0" }, after: { version: "1.1" } } },
    { id: 36, user: "Candra Wijaya", role: "User", action: "Create", module: "Article", desc: "Membuat draft 'Sensasi Sambal Tempoyak Durian'", time: "30 Jul 2026, 14:50", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { title: "Sensasi Sambal Tempoyak", status: "Draf" } } },
    { id: 37, user: "Diah Permata", role: "SuperAdmin", action: "Ban", module: "ManageUser", desc: "Memblokir akun yang terindikasi bot", time: "29 Jul 2026, 17:10", icon: ShieldAlert, color: "text-red-600 bg-red-50", details: { before: { isBanned: false }, after: { isBanned: true, reason: "Aktivitas bot mencurigakan" } } },
    { id: 38, user: "Erwin Saputra", role: "Admin", action: "Restore", module: "CreateEvent", desc: "Mengaktifkan kembali agenda yang sempat ditunda", time: "28 Jul 2026, 10:30", icon: RotateCcw, color: "text-amber-500 bg-amber-50", details: { before: { status: "Takedown" }, after: { status: "Post" } } },
    { id: 39, user: "Fanny Anggraini", role: "User", action: "Edit", module: "Profile", desc: "Menambahkan tautan akun X / Twitter", time: "27 Jul 2026, 16:00", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { twitter: "" }, after: { twitter: "https://x.com/fannyang" } } },
    { id: 40, user: "Gunawan Santoso", role: "Admin", action: "Approve", module: "ManageContent", desc: "Menyetujui artikel 'Potret Warga Bantaran Sekanak'", time: "26 Jul 2026, 09:15", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", details: { before: { status: "Request" }, after: { status: "Posted" } } },
    { id: 41, user: "Hesti Purwanti", role: "User", action: "Login", module: "Auth", desc: "Login berhasil via aplikasi", time: "25 Jul 2026, 19:25", icon: LogIn, color: "text-zinc-600 bg-zinc-100", details: { before: null, after: { ip: "114.120.9.18", device: "Safari / iOS" } } },
    { id: 42, user: "Irfan Hakim", role: "Admin", action: "Create", module: "ManageAdmin", desc: "Mendaftarkan staf kurator konten baru", time: "24 Jul 2026, 13:40", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { email: "jihan.f@benahpalembang.id", role: "Admin" } } },
    { id: 43, user: "Jihan Fahira", role: "Admin", action: "Edit", module: "ManageWebsite", desc: "Memperbarui susunan banner featured article", time: "23 Jul 2026, 11:30", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { featuredId: 1 }, after: { featuredId: 4 } } },
    { id: 44, user: "Kurniawan Dwi", role: "User", action: "Create", module: "Event", desc: "Mengajukan kompetisi esport regional", time: "22 Jul 2026, 15:10", icon: Plus, color: "text-emerald-500 bg-emerald-50", details: { before: null, after: { title: "Palembang Esport Championship", status: "Request" } } },
    { id: 45, user: "Larasati Dewi", role: "Admin", action: "Reject", module: "ManageContent", desc: "Menolak konten yang memuat informasi duplikat", time: "21 Jul 2026, 10:00", icon: Trash2, color: "text-red-500 bg-red-50", details: { before: { status: "Request" }, after: { status: "Rejected" } } },
    { id: 46, user: "Maulana Malik", role: "User", action: "Login", module: "Auth", desc: "Pengguna login ke akun", time: "20 Jul 2026, 08:45", icon: LogIn, color: "text-zinc-600 bg-zinc-100", details: { before: null, after: { ip: "180.245.88.12", device: "Chrome / Android" } } },
    { id: 47, user: "Novita Sari", role: "Admin", action: "Approve", module: "ManageContent", desc: "Menyetujui publikasi artikel cagar budaya", time: "19 Jul 2026, 14:20", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", details: { before: { status: "Request" }, after: { status: "Posted" } } },
    { id: 48, user: "Oki Setiana", role: "SuperAdmin", action: "Unban", module: "ManageUser", desc: "Membuka status blokir akun", time: "18 Jul 2026, 16:50", icon: CheckCircle2, color: "text-emerald-600 bg-emerald-50", details: { before: { isBanned: true }, after: { isBanned: false } } },
    { id: 49, user: "Putra Mahardika", role: "Admin", action: "Edit", module: "ManageWebsite", desc: "Memperbarui link sosial media TikTok di footer", time: "17 Jul 2026, 11:15", icon: Edit, color: "text-blue-500 bg-blue-50", details: { before: { tiktok: "" }, after: { tiktok: "https://tiktok.com/@benahpalembang" } } },
    { id: 50, user: "Qanita Lutfia", role: "SuperAdmin", action: "Login", module: "Auth", desc: "Login superadmin berhasil", time: "16 Jul 2026, 07:30", icon: LogIn, color: "text-zinc-600 bg-zinc-100", details: { before: null, after: { ip: "114.120.1.99", device: "Chrome / Windows" } } },
]

export function LogActivities() {
    const [selectedLog, setSelectedLog] = useState<LogType | null>(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    const filteredLogs = useMemo(() => {
        return dummyLogs.filter(log => 
            log.user.toLowerCase().includes(searchTerm.toLowerCase()) || 
            log.module.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.desc.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.action.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [searchTerm])

    const totalPages = Math.ceil(filteredLogs.length / itemsPerPage)
    const paginatedLogs = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredLogs.slice(start, start + itemsPerPage)
    }, [filteredLogs, currentPage, itemsPerPage])

    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Log Activities</h2>
                    <p className="text-muted-foreground">Melacak semua aktivitas perubahan yang terjadi di website.</p>
                </div>
            </div>

            <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <input 
                            type="text" 
                            placeholder="Cari log (user, aksi, modul)..." 
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
                            className="h-10 w-full rounded-md border border-input bg-transparent pl-9 pr-3 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User</th>
                                <th className="px-6 py-4 font-semibold">Aksi</th>
                                <th className="px-6 py-4 font-semibold">Modul</th>
                                <th className="px-6 py-4 font-semibold">Deskripsi Aktivitas</th>
                                <th className="px-6 py-4 font-semibold">Waktu</th>
                                <th className="px-6 py-4 font-semibold text-right">Detail</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginatedLogs.length > 0 ? paginatedLogs.map((log) => (
                                <tr key={log.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="font-semibold text-foreground">{log.user}</span>
                                        <p className="text-xs text-muted-foreground mt-0.5">{log.role}</p>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-2">
                                            <div className={`p-1.5 rounded-md ${log.color}`}>
                                                <log.icon className="size-3.5" />
                                            </div>
                                            <span className="font-medium text-foreground">{log.action}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className="px-2.5 py-0.5 bg-muted rounded-full text-xs font-semibold text-foreground">
                                            {log.module}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground max-w-[280px] truncate" title={log.desc}>
                                        {log.desc}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">{log.time}</td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button 
                                                    variant="outline" 
                                                    size="sm" 
                                                    className="gap-1.5 text-xs text-foreground hover:bg-muted"
                                                    onClick={() => setSelectedLog(log)}
                                                >
                                                    <Eye className="size-3.5" /> Detail
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent className="sm:max-w-[500px]">
                                                <DialogHeader>
                                                    <DialogTitle>Detail Log Aktivitas #{selectedLog?.id}</DialogTitle>
                                                    <DialogDescription>
                                                        Perubahan status/data yang dilakukan oleh {selectedLog?.user} ({selectedLog?.role})
                                                    </DialogDescription>
                                                </DialogHeader>
                                                {selectedLog && (
                                                    <div className="space-y-4 py-4">
                                                        <div className="grid grid-cols-2 gap-4">
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-semibold text-red-600 flex items-center gap-1.5">
                                                                    <div className="w-2 h-2 rounded-full bg-red-600" /> Sebelum (Before)
                                                                </h4>
                                                                <pre className="bg-muted/50 p-4 rounded-md text-xs overflow-auto border font-mono">
                                                                    {selectedLog.details.before 
                                                                        ? JSON.stringify(selectedLog.details.before, null, 2) 
                                                                        : <span className="text-muted-foreground italic">Null / Tidak ada data sebelumnya</span>}
                                                                </pre>
                                                            </div>
                                                            <div className="space-y-2">
                                                                <h4 className="text-sm font-semibold text-emerald-600 flex items-center gap-1.5">
                                                                    <div className="w-2 h-2 rounded-full bg-emerald-600" /> Sesudah (After)
                                                                </h4>
                                                                <pre className="bg-muted/50 p-4 rounded-md text-xs overflow-auto border font-mono">
                                                                    {selectedLog.details.after 
                                                                        ? JSON.stringify(selectedLog.details.after, null, 2) 
                                                                        : <span className="text-muted-foreground italic">Null / Dihapus</span>}
                                                                </pre>
                                                            </div>
                                                        </div>
                                                    </div>
                                                )}
                                            </DialogContent>
                                        </Dialog>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        Tidak ada log yang cocok dengan pencarian "{searchTerm}"
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
                {/* Pagination Controls */}
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredLogs.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>
        </div>
    )
}
