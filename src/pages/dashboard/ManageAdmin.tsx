import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Eye, EyeOff, Ban, ShieldCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { useState, useMemo } from "react"
import { toast } from "sonner"
import { useNavigate } from "react-router-dom"

const initialAdmins = [
    { id: "ADM-001", name: "Dina Kirana", email: "dina.kirana@benahpalembang.id", role: "SuperAdmin", date: "01 Jan 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=9", isBanned: false },
    { id: "ADM-002", name: "Agus Supriyadi", email: "agus.s@benahpalembang.id", role: "SuperAdmin", date: "01 Jan 2026", lastLogin: "2 jam lalu", avatar: "https://i.pravatar.cc/150?img=12", isBanned: false },
    { id: "ADM-003", name: "Fajar Pratama", email: "fajar.p@benahpalembang.id", role: "Admin", date: "15 Jan 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=15", isBanned: false },
    { id: "ADM-004", name: "Nurul Aini", email: "nurul.aini@benahpalembang.id", role: "Admin", date: "20 Jan 2026", lastLogin: "5 jam lalu", avatar: "https://i.pravatar.cc/150?img=20", isBanned: false },
    { id: "ADM-005", name: "Rian Hidayat", email: "rian.h@benahpalembang.id", role: "Admin", date: "01 Feb 2026", lastLogin: "1 hari lalu", avatar: "https://i.pravatar.cc/150?img=60", isBanned: false },
    { id: "ADM-006", name: "Siti Rahmawati", email: "siti.rahma@benahpalembang.id", role: "Admin", date: "10 Feb 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=47", isBanned: false },
    { id: "ADM-007", name: "Bayu Anggara", email: "bayu.a@benahpalembang.id", role: "Admin", date: "15 Feb 2026", lastLogin: "3 jam lalu", avatar: "https://i.pravatar.cc/150?img=33", isBanned: false },
    { id: "ADM-008", name: "Mega Puspita", email: "mega.p@benahpalembang.id", role: "Admin", date: "01 Mar 2026", lastLogin: "2 hari lalu", avatar: "https://i.pravatar.cc/150?img=25", isBanned: false },
    { id: "ADM-009", name: "Ilham Kurniawan", email: "ilham.k@benahpalembang.id", role: "Admin", date: "10 Mar 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=52", isBanned: false },
    { id: "ADM-010", name: "Kartika Sari", email: "kartika.s@benahpalembang.id", role: "Admin", date: "20 Mar 2026", lastLogin: "4 jam lalu", avatar: "https://i.pravatar.cc/150?img=32", isBanned: true },
    { id: "ADM-011", name: "Doni Prasetyo", email: "doni.p@benahpalembang.id", role: "Admin", date: "01 Apr 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=68", isBanned: false },
    { id: "ADM-012", name: "Tania Wijaya", email: "tania.w@benahpalembang.id", role: "Admin", date: "15 Apr 2026", lastLogin: "1 hari lalu", avatar: "https://i.pravatar.cc/150?img=49", isBanned: false },
    { id: "ADM-013", name: "Hendra Saputra", email: "hendra.s@benahpalembang.id", role: "SuperAdmin", date: "01 May 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=59", isBanned: false },
    { id: "ADM-014", name: "Bagus Triadi", email: "bagus.t@benahpalembang.id", role: "Admin", date: "15 May 2026", lastLogin: "6 jam lalu", avatar: "https://i.pravatar.cc/150?img=57", isBanned: false },
    { id: "ADM-015", name: "Nadia Utami", email: "nadia.u@benahpalembang.id", role: "Admin", date: "01 Jun 2026", lastLogin: "3 hari lalu", avatar: "https://i.pravatar.cc/150?img=45", isBanned: false },
    { id: "ADM-016", name: "Aris Munandar", email: "aris.m@benahpalembang.id", role: "Admin", date: "15 Jun 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=56", isBanned: false },
    { id: "ADM-017", name: "Maya Dewi", email: "maya.d@benahpalembang.id", role: "Admin", date: "01 Jul 2026", lastLogin: "2 jam lalu", avatar: "https://i.pravatar.cc/150?img=23", isBanned: false },
    { id: "ADM-018", name: "Eko Wahyudi", email: "eko.w@benahpalembang.id", role: "Admin", date: "15 Jul 2026", lastLogin: "1 minggu lalu", avatar: "https://i.pravatar.cc/150?img=53", isBanned: false },
    { id: "ADM-019", name: "Rina Oktavia", email: "rina.o@benahpalembang.id", role: "Admin", date: "01 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=44", isBanned: false },
    { id: "ADM-020", name: "Zulqarnain", email: "zulqarnain@benahpalembang.id", role: "Admin", date: "05 Aug 2026", lastLogin: "4 jam lalu", avatar: "https://i.pravatar.cc/150?img=65", isBanned: false },
    { id: "ADM-021", name: "Annisa Permata", email: "annisa.p@benahpalembang.id", role: "Admin", date: "10 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=28", isBanned: false },
    { id: "ADM-022", name: "Gilang Ramadhan", email: "gilang.r@benahpalembang.id", role: "Admin", date: "15 Aug 2026", lastLogin: "2 hari lalu", avatar: "https://i.pravatar.cc/150?img=54", isBanned: false },
    { id: "ADM-023", name: "Devi Anggraini", email: "devi.a@benahpalembang.id", role: "Admin", date: "18 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=36", isBanned: false },
    { id: "ADM-024", name: "Farhan Hakim", email: "farhan.h@benahpalembang.id", role: "Admin", date: "20 Aug 2026", lastLogin: "5 jam lalu", avatar: "https://i.pravatar.cc/150?img=61", isBanned: false },
    { id: "ADM-025", name: "Cindy Claudia", email: "cindy.c@benahpalembang.id", role: "SuperAdmin", date: "22 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=38", isBanned: false },
    { id: "ADM-026", name: "Rahmat Hidayat", email: "rahmat.h@benahpalembang.id", role: "Admin", date: "21 Aug 2026", lastLogin: "1 jam lalu", avatar: "https://i.pravatar.cc/150?img=59", isBanned: false },
    { id: "ADM-027", name: "Siti Nurhaliza", email: "siti.n@benahpalembang.id", role: "Admin", date: "20 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=47", isBanned: false },
    { id: "ADM-028", name: "Teguh Prakoso", email: "teguh.p@benahpalembang.id", role: "Admin", date: "19 Aug 2026", lastLogin: "3 jam lalu", avatar: "https://i.pravatar.cc/150?img=60", isBanned: false },
    { id: "ADM-029", name: "Utami Dewi", email: "utami.d@benahpalembang.id", role: "Admin", date: "18 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=48", isBanned: false },
    { id: "ADM-030", name: "Vicky Prasetya", email: "vicky.p@benahpalembang.id", role: "Admin", date: "17 Aug 2026", lastLogin: "2 hari lalu", avatar: "https://i.pravatar.cc/150?img=61", isBanned: false },
    { id: "ADM-031", name: "Winda Amalia", email: "winda.a@benahpalembang.id", role: "Admin", date: "16 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=49", isBanned: false },
    { id: "ADM-032", name: "Yogi Pratama", email: "yogi.p@benahpalembang.id", role: "Admin", date: "15 Aug 2026", lastLogin: "5 jam lalu", avatar: "https://i.pravatar.cc/150?img=62", isBanned: false },
    { id: "ADM-033", name: "Zahra Salsabila", email: "zahra.s@benahpalembang.id", role: "Admin", date: "14 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=26", isBanned: false },
    { id: "ADM-034", name: "Aditya Pratama", email: "aditya.p@benahpalembang.id", role: "Admin", date: "13 Aug 2026", lastLogin: "4 jam lalu", avatar: "https://i.pravatar.cc/150?img=63", isBanned: false },
    { id: "ADM-035", name: "Bella Safira", email: "bella.s@benahpalembang.id", role: "Admin", date: "12 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=25", isBanned: false },
    { id: "ADM-036", name: "Candra Wijaya", email: "candra.w@benahpalembang.id", role: "Admin", date: "11 Aug 2026", lastLogin: "1 hari lalu", avatar: "https://i.pravatar.cc/150?img=64", isBanned: false },
    { id: "ADM-037", name: "Diah Permata", email: "diah.p@benahpalembang.id", role: "Admin", date: "10 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=24", isBanned: false },
    { id: "ADM-038", name: "Erwin Saputra", email: "erwin.s@benahpalembang.id", role: "Admin", date: "09 Aug 2026", lastLogin: "6 jam lalu", avatar: "https://i.pravatar.cc/150?img=65", isBanned: false },
    { id: "ADM-039", name: "Fanny Anggraini", email: "fanny.a@benahpalembang.id", role: "Admin", date: "08 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=22", isBanned: false },
    { id: "ADM-040", name: "Gunawan Santoso", email: "gunawan.s@benahpalembang.id", role: "Admin", date: "07 Aug 2026", lastLogin: "3 jam lalu", avatar: "https://i.pravatar.cc/150?img=67", isBanned: false },
    { id: "ADM-041", name: "Hesti Purwanti", email: "hesti.p@benahpalembang.id", role: "Admin", date: "06 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=21", isBanned: false },
    { id: "ADM-042", name: "Irfan Hakim", email: "irfan.h@benahpalembang.id", role: "Admin", date: "05 Aug 2026", lastLogin: "2 hari lalu", avatar: "https://i.pravatar.cc/150?img=68", isBanned: false },
    { id: "ADM-043", name: "Jihan Fahira", email: "jihan.f@benahpalembang.id", role: "Admin", date: "04 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=20", isBanned: false },
    { id: "ADM-044", name: "Kurniawan Dwi", email: "kurniawan.d@benahpalembang.id", role: "Admin", date: "03 Aug 2026", lastLogin: "4 jam lalu", avatar: "https://i.pravatar.cc/150?img=69", isBanned: false },
    { id: "ADM-045", name: "Larasati Dewi", email: "larasati.d@benahpalembang.id", role: "Admin", date: "02 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=70", isBanned: false },
    { id: "ADM-046", name: "Maulana Malik", email: "maulana.m@benahpalembang.id", role: "Admin", date: "01 Aug 2026", lastLogin: "5 jam lalu", avatar: "https://i.pravatar.cc/150?img=14", isBanned: false },
    { id: "ADM-047", name: "Novita Sari", email: "novita.s@benahpalembang.id", role: "Admin", date: "31 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=16", isBanned: false },
    { id: "ADM-048", name: "Oki Setiana", email: "oki.s@benahpalembang.id", role: "Admin", date: "30 Jul 2026", lastLogin: "1 hari lalu", avatar: "https://i.pravatar.cc/150?img=17", isBanned: false },
    { id: "ADM-049", name: "Putra Mahardika", email: "putra.m@benahpalembang.id", role: "Admin", date: "29 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=18", isBanned: false },
    { id: "ADM-050", name: "Qanita Lutfia", email: "qanita.l@benahpalembang.id", role: "SuperAdmin", date: "28 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=19", isBanned: false },
]

export function ManageAdmin() {
    const navigate = useNavigate()
    const [admins, setAdmins] = useState(initialAdmins)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [password, setPassword] = useState("")
    const [confirmPassword, setConfirmPassword] = useState("")
    const [showPw, setShowPw] = useState(false)
    const [showConfirmPw, setShowConfirmPw] = useState(false)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    // Ban confirmation state
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean
        adminId: string
        adminName: string
        action: "ban" | "unban"
    }>({
        open: false,
        adminId: "",
        adminName: "",
        action: "ban",
    })

    const handleCreateAdmin = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Password dan Konfirmasi Password tidak cocok!")
            return
        }
        toast.success("Admin baru berhasil ditambahkan!")
        setIsModalOpen(false)
        setPassword("")
        setConfirmPassword("")
    }

    const openBanConfirm = (admin: typeof initialAdmins[0]) => {
        setConfirmModal({
            open: true,
            adminId: admin.id,
            adminName: admin.name,
            action: admin.isBanned ? "unban" : "ban",
        })
    }

    const handleToggleBan = () => {
        const { adminId, adminName, action } = confirmModal
        setAdmins(prev => prev.map(u => u.id === adminId ? { ...u, isBanned: !u.isBanned } : u))
        if (action === "ban") {
            toast.error(`Admin ${adminName} (${adminId}) berhasil di-banned!`)
        } else {
            toast.success(`Admin ${adminName} (${adminId}) berhasil di-unbanned!`)
        }
        setConfirmModal(prev => ({ ...prev, open: false }))
    }

    const filteredAdmins = useMemo(() => {
        return admins.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [admins, searchTerm])

    // Pagination calculations
    const totalPages = Math.ceil(filteredAdmins.length / itemsPerPage)
    const paginatedAdmins = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredAdmins.slice(start, start + itemsPerPage)
    }, [filteredAdmins, currentPage, itemsPerPage])

    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Admin</h2>
                    <p className="text-muted-foreground">Kelola akun administrator dengan hak akses tinggi.</p>
                </div>
                
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-palembang-red text-white hover:bg-palembang-red/90 w-fit">
                            <Plus className="mr-2 size-4" /> Create Admin
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleCreateAdmin}>
                            <DialogHeader>
                                <DialogTitle>Buat Admin Baru</DialogTitle>
                                <DialogDescription>
                                    Tambahkan akun administrator baru ke dalam sistem.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nama Lengkap</label>
                                    <Input required placeholder="Masukkan nama" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input required type="email" placeholder="admin@example.com" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Role</label>
                                    <select required className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-palembang-charcoal text-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2">
                                        <option value="admin">Admin</option>
                                        <option value="superadmin">SuperAdmin</option>
                                    </select>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Password</label>
                                    <div className="relative">
                                        <Input required type={showPw ? "text" : "password"} value={password} onChange={e => setPassword(e.target.value)} className="pr-10" />
                                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                            {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Konfirmasi Password</label>
                                    <div className="relative">
                                        <Input required type={showConfirmPw ? "text" : "password"} value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="pr-10" />
                                        <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                            {showConfirmPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                                        </button>
                                    </div>
                                </div>
                            </div>
                            <DialogFooter>
                                <Button type="button" variant="outline" onClick={() => setIsModalOpen(false)}>Batal</Button>
                                <Button type="submit" className="bg-palembang-red text-white hover:bg-palembang-red/90">Simpan Admin</Button>
                            </DialogFooter>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari admin (nama, email, ID)..." 
                            className="pl-9" 
                            value={searchTerm}
                            onChange={e => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold">User ID</th>
                                <th className="px-6 py-4 font-semibold">Profile & Nama</th>
                                <th className="px-6 py-4 font-semibold">Email</th>
                                <th className="px-6 py-4 font-semibold">Role / Status</th>
                                <th className="px-6 py-4 font-semibold">Date Created</th>
                                <th className="px-6 py-4 font-semibold">Last Login</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginatedAdmins.length > 0 ? paginatedAdmins.map((user) => (
                                <tr key={user.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4 font-medium text-xs text-muted-foreground">{user.id}</td>
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={user.avatar || "https://i.pravatar.cc/150?img=0"} alt={user.name} className="w-8 h-8 rounded-full bg-muted object-cover" />
                                            <div className="flex flex-col">
                                                <span className="font-semibold text-foreground">{user.name}</span>
                                                {user.isBanned && (
                                                    <span className="text-[10px] text-red-600 font-bold tracking-wider uppercase">Banned</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground">{user.email}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-1.5">
                                            {user.role === 'SuperAdmin' ? (
                                                <span className="text-purple-600 bg-purple-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">{user.role}</span>
                                            ) : (
                                                <span className="text-palembang-red bg-red-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">{user.role}</span>
                                            )}
                                            {user.isBanned && (
                                                <span className="bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-xs font-semibold">Banned</span>
                                            )}
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground text-xs whitespace-nowrap">{user.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {user.lastLogin === 'Online' ? (
                                            <span className="flex items-center gap-1.5 text-emerald-600 font-medium text-xs">
                                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" /> {user.lastLogin}
                                            </span>
                                        ) : (
                                            <span className="text-muted-foreground text-xs">{user.lastLogin}</span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 items-center">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="gap-1.5 text-xs text-foreground hover:bg-muted"
                                                title="View Admin Profile"
                                                onClick={() => navigate(`/dashboard/account/admin/${user.id}?mode=view`)}
                                            >
                                                <Eye className="size-3.5" /> View
                                            </Button>

                                            {/* Ban / Unban Button */}
                                            {user.isBanned ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                                    title="Unban Admin"
                                                    onClick={() => openBanConfirm(user)}
                                                >
                                                    <ShieldCheck className="size-3.5" /> Unban
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                                    title="Ban Admin"
                                                    onClick={() => openBanConfirm(user)}
                                                >
                                                    <Ban className="size-3.5" /> Ban
                                                </Button>
                                            )}

                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="gap-1.5 text-xs text-foreground hover:bg-muted"
                                                title="Edit Admin Profile"
                                                onClick={() => navigate(`/dashboard/account/admin/${user.id}`)}
                                            >
                                                <Edit2 className="size-3.5" /> Edit
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                        Tidak ada admin yang cocok dengan pencarian "{searchTerm}"
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
                    totalItems={filteredAdmins.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            {/* Confirmation Modal */}
            <ConfirmActionDialog
                open={confirmModal.open}
                onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
                title={confirmModal.action === "ban" ? "Konfirmasi Banned Admin" : "Konfirmasi Buka Blokir Admin (Unban)"}
                description={
                    confirmModal.action === "ban"
                        ? `Apakah Anda yakin ingin memblokir (ban) admin ${confirmModal.adminName} (${confirmModal.adminId})? Administrator ini tidak akan dapat mengakses panel admin.`
                        : `Apakah Anda yakin ingin membuka blokir (unban) admin ${confirmModal.adminName} (${confirmModal.adminId})? Administrator akan dapat mengakses kembali.`
                }
                confirmText={confirmModal.action === "ban" ? "Ya, Banned Admin" : "Ya, Unban Admin"}
                cancelText="Batal"
                variant={confirmModal.action === "ban" ? "destructive" : "default"}
                onConfirm={handleToggleBan}
            />
        </div>
    )
}


