"use client"

import { useNavigate } from "@/lib/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Edit2, Eye, EyeOff, Ban, ShieldCheck } from "lucide-react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog"
import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { useState, useMemo } from "react"
import { toast } from "sonner"

const initialUsers = [
    { id: "USR-001", name: "Budi Hartono", email: "budi.hartono@gmail.com", role: "User", date: "25 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=11", isBanned: false },
    { id: "USR-002", name: "Siti Aminah", email: "siti.aminah@gmail.com", role: "User", date: "24 Aug 2026", lastLogin: "2 jam lalu", avatar: "https://i.pravatar.cc/150?img=5", isBanned: false },
    { id: "USR-003", name: "Andi Saputra", email: "andi.saputra@gmail.com", role: "User", date: "23 Aug 2026", lastLogin: "1 hari lalu", avatar: "https://i.pravatar.cc/150?img=8", isBanned: false },
    { id: "USR-004", name: "Rahmat Hidayat", email: "rahmat.h@yahoo.com", role: "User", date: "22 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=12", isBanned: false },
    { id: "USR-005", name: "Dewi Lestari", email: "dewi.lestari@gmail.com", role: "User", date: "21 Aug 2026", lastLogin: "3 jam lalu", avatar: "https://i.pravatar.cc/150?img=9", isBanned: false },
    { id: "USR-006", name: "Fajar Nugraha", email: "fajar.nugraha@outlook.com", role: "User", date: "20 Aug 2026", lastLogin: "2 hari lalu", avatar: "https://i.pravatar.cc/150?img=15", isBanned: false },
    { id: "USR-007", name: "Nurul Hidayah", email: "nurul.hidayah@gmail.com", role: "User", date: "19 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=20", isBanned: false },
    { id: "USR-008", name: "Bayu Pratama", email: "bayu.pratama@gmail.com", role: "User", date: "18 Aug 2026", lastLogin: "5 jam lalu", avatar: "https://i.pravatar.cc/150?img=33", isBanned: false },
    { id: "USR-009", name: "Ayu Wulandari", email: "ayu.wulan@gmail.com", role: "User", date: "17 Aug 2026", lastLogin: "3 hari lalu", avatar: "https://i.pravatar.cc/150?img=26", isBanned: false },
    { id: "USR-010", name: "Rizky Ramadhan", email: "rizky.rmd@yahoo.com", role: "User", date: "16 Aug 2026", lastLogin: "1 hari lalu", avatar: "https://i.pravatar.cc/150?img=60", isBanned: true },
    { id: "USR-011", name: "Putri Anggraini", email: "putri.ang@gmail.com", role: "User", date: "15 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=47", isBanned: false },
    { id: "USR-012", name: "Ilham Kurniawan", email: "ilham.k@gmail.com", role: "User", date: "14 Aug 2026", lastLogin: "6 jam lalu", avatar: "https://i.pravatar.cc/150?img=52", isBanned: false },
    { id: "USR-013", name: "Kartika Sari", email: "kartika.sari@outlook.com", role: "User", date: "13 Aug 2026", lastLogin: "4 hari lalu", avatar: "https://i.pravatar.cc/150?img=32", isBanned: false },
    { id: "USR-014", name: "Doni Setiawan", email: "doni.setiawan@gmail.com", role: "User", date: "12 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=68", isBanned: false },
    { id: "USR-015", name: "Mega Utami", email: "mega.utami@gmail.com", role: "User", date: "11 Aug 2026", lastLogin: "2 hari lalu", avatar: "https://i.pravatar.cc/150?img=25", isBanned: false },
    { id: "USR-016", name: "Hendra Wijaya", email: "hendra.w@yahoo.com", role: "User", date: "10 Aug 2026", lastLogin: "1 minggu lalu", avatar: "https://i.pravatar.cc/150?img=59", isBanned: false },
    { id: "USR-017", name: "Tania Maharani", email: "tania.m@gmail.com", role: "User", date: "09 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=49", isBanned: false },
    { id: "USR-018", name: "Bagus Prasetyo", email: "bagus.p@gmail.com", role: "User", date: "08 Aug 2026", lastLogin: "12 jam lalu", avatar: "https://i.pravatar.cc/150?img=57", isBanned: false },
    { id: "USR-019", name: "Nadia Safitri", email: "nadia.safitri@gmail.com", role: "User", date: "07 Aug 2026", lastLogin: "5 hari lalu", avatar: "https://i.pravatar.cc/150?img=45", isBanned: false },
    { id: "USR-020", name: "Agus Supriyadi", email: "agus.supriyadi@gmail.com", role: "User", date: "06 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=13", isBanned: false },
    { id: "USR-021", name: "Maya Indah", email: "maya.indah@yahoo.com", role: "User", date: "05 Aug 2026", lastLogin: "3 jam lalu", avatar: "https://i.pravatar.cc/150?img=23", isBanned: false },
    { id: "USR-022", name: "Eko Prasetyo", email: "eko.pras@gmail.com", role: "User", date: "04 Aug 2026", lastLogin: "2 minggu lalu", avatar: "https://i.pravatar.cc/150?img=53", isBanned: true },
    { id: "USR-023", name: "Dina Kirana", email: "dina.kirana@gmail.com", role: "User", date: "03 Aug 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=29", isBanned: false },
    { id: "USR-024", name: "Aris Munandar", email: "aris.m@gmail.com", role: "User", date: "02 Aug 2026", lastLogin: "4 jam lalu", avatar: "https://i.pravatar.cc/150?img=56", isBanned: false },
    { id: "USR-025", name: "Rina Kusuma", email: "rina.kusuma@gmail.com", role: "User", date: "01 Aug 2026", lastLogin: "1 hari lalu", avatar: "https://i.pravatar.cc/150?img=44", isBanned: false },
    { id: "USR-026", name: "Deni Irawan", email: "deni.irawan@gmail.com", role: "User", date: "31 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=59", isBanned: false },
    { id: "USR-027", name: "Citra Lestari", email: "citra.lestari@gmail.com", role: "User", date: "30 Jul 2026", lastLogin: "2 jam lalu", avatar: "https://i.pravatar.cc/150?img=47", isBanned: false },
    { id: "USR-028", name: "Wahyu Hidayat", email: "wahyu.h@gmail.com", role: "User", date: "29 Jul 2026", lastLogin: "1 hari lalu", avatar: "https://i.pravatar.cc/150?img=60", isBanned: false },
    { id: "USR-029", name: "Tari Wulandari", email: "tari.wulan@gmail.com", role: "User", date: "28 Jul 2026", lastLogin: "5 jam lalu", avatar: "https://i.pravatar.cc/150?img=48", isBanned: false },
    { id: "USR-030", name: "Bambang Pamungkas", email: "bambang.p@gmail.com", role: "User", date: "27 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=61", isBanned: false },
    { id: "USR-031", name: "Nurul Aini", email: "nurul.aini@gmail.com", role: "User", date: "26 Jul 2026", lastLogin: "3 hari lalu", avatar: "https://i.pravatar.cc/150?img=49", isBanned: false },
    { id: "USR-032", name: "Surya Kencana", email: "surya.k@gmail.com", role: "User", date: "25 Jul 2026", lastLogin: "6 jam lalu", avatar: "https://i.pravatar.cc/150?img=62", isBanned: false },
    { id: "USR-033", name: "Mega Utami", email: "mega.utami@gmail.com", role: "User", date: "24 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=26", isBanned: false },
    { id: "USR-034", name: "Fajar Pratama", email: "fajar.pratama@gmail.com", role: "User", date: "23 Jul 2026", lastLogin: "4 hari lalu", avatar: "https://i.pravatar.cc/150?img=63", isBanned: false },
    { id: "USR-035", name: "Gita Gutawa", email: "gita.gutawa@gmail.com", role: "User", date: "22 Jul 2026", lastLogin: "1 jam lalu", avatar: "https://i.pravatar.cc/150?img=25", isBanned: false },
    { id: "USR-036", name: "Hadi Purnomo", email: "hadi.p@gmail.com", role: "User", date: "21 Jul 2026", lastLogin: "2 hari lalu", avatar: "https://i.pravatar.cc/150?img=64", isBanned: false },
    { id: "USR-037", name: "Intan Permatasari", email: "intan.p@gmail.com", role: "User", date: "20 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=24", isBanned: false },
    { id: "USR-038", name: "Joko Susilo", email: "joko.susilo@gmail.com", role: "User", date: "19 Jul 2026", lastLogin: "1 minggu lalu", avatar: "https://i.pravatar.cc/150?img=65", isBanned: true },
    { id: "USR-039", name: "Kartika Sari", email: "kartika.sari@gmail.com", role: "User", date: "18 Jul 2026", lastLogin: "3 jam lalu", avatar: "https://i.pravatar.cc/150?img=22", isBanned: false },
    { id: "USR-040", name: "Lukman Hakim", email: "lukman.h@gmail.com", role: "User", date: "17 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=67", isBanned: false },
    { id: "USR-041", name: "Melati Putri", email: "melati.putri@gmail.com", role: "User", date: "16 Jul 2026", lastLogin: "5 jam lalu", avatar: "https://i.pravatar.cc/150?img=21", isBanned: false },
    { id: "USR-042", name: "Naufal Zaki", email: "naufal.zaki@gmail.com", role: "User", date: "15 Jul 2026", lastLogin: "2 hari lalu", avatar: "https://i.pravatar.cc/150?img=68", isBanned: false },
    { id: "USR-043", name: "Olivia Maharani", email: "olivia.m@gmail.com", role: "User", date: "14 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=20", isBanned: false },
    { id: "USR-044", name: "Pandu Wijaya", email: "pandu.wijaya@gmail.com", role: "User", date: "13 Jul 2026", lastLogin: "4 jam lalu", avatar: "https://i.pravatar.cc/150?img=69", isBanned: false },
    { id: "USR-045", name: "Qori Alamsyah", email: "qori.alam@gmail.com", role: "User", date: "12 Jul 2026", lastLogin: "1 hari lalu", avatar: "https://i.pravatar.cc/150?img=70", isBanned: false },
    { id: "USR-046", name: "Ratna Juwita", email: "ratna.juwita@gmail.com", role: "User", date: "11 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=19", isBanned: false },
    { id: "USR-047", name: "Sandiaga Putra", email: "sandi.putra@gmail.com", role: "User", date: "10 Jul 2026", lastLogin: "6 jam lalu", avatar: "https://i.pravatar.cc/150?img=14", isBanned: false },
    { id: "USR-048", name: "Tiara Andini", email: "tiara.andini@gmail.com", role: "User", date: "09 Jul 2026", lastLogin: "3 hari lalu", avatar: "https://i.pravatar.cc/150?img=16", isBanned: false },
    { id: "USR-049", name: "Umar Faruq", email: "umar.faruq@gmail.com", role: "User", date: "08 Jul 2026", lastLogin: "Online", avatar: "https://i.pravatar.cc/150?img=17", isBanned: false },
    { id: "USR-050", name: "Vina Panduwinata", email: "vina.p@gmail.com", role: "User", date: "07 Jul 2026", lastLogin: "2 jam lalu", avatar: "https://i.pravatar.cc/150?img=18", isBanned: false },
]

export function ManageUser() {
    const navigate = useNavigate()
    const [users, setUsers] = useState(initialUsers)
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
        userId: string
        userName: string
        action: "ban" | "unban"
    }>({
        open: false,
        userId: "",
        userName: "",
        action: "ban",
    })

    const handleCreateUser = (e: React.FormEvent) => {
        e.preventDefault()
        if (password !== confirmPassword) {
            toast.error("Password dan Konfirmasi Password tidak cocok!")
            return
        }
        toast.success("User baru berhasil dibuat!")
        setIsModalOpen(false)
        setPassword("")
        setConfirmPassword("")
    }

    const openBanConfirm = (user: typeof initialUsers[0]) => {
        setConfirmModal({
            open: true,
            userId: user.id,
            userName: user.name,
            action: user.isBanned ? "unban" : "ban",
        })
    }

    const handleToggleBan = () => {
        const { userId, userName, action } = confirmModal
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, isBanned: !u.isBanned } : u))
        if (action === "ban") {
            toast.error(`Akun ${userName} (${userId}) berhasil di-banned!`)
        } else {
            toast.success(`Akun ${userName} (${userId}) berhasil di-unbanned!`)
        }
        setConfirmModal(prev => ({ ...prev, open: false }))
    }

    const filteredUsers = useMemo(() => {
        return users.filter(u => 
            u.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
            u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            u.id.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [users, searchTerm])

    // Pagination calculations
    const totalPages = Math.ceil(filteredUsers.length / itemsPerPage)
    const paginatedUsers = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredUsers.slice(start, start + itemsPerPage)
    }, [filteredUsers, currentPage, itemsPerPage])

    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage User</h2>
                    <p className="text-muted-foreground">Kelola akun pengguna reguler aplikasi.</p>
                </div>
                
                <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
                    <DialogTrigger asChild>
                        <Button className="bg-palembang-red text-white hover:bg-palembang-red/90 w-fit">
                            <Plus className="mr-2 size-4" /> Create User
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <form onSubmit={handleCreateUser}>
                            <DialogHeader>
                                <DialogTitle>Buat User Baru</DialogTitle>
                                <DialogDescription>
                                    Tambahkan akun pengguna baru ke dalam sistem.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4 py-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Nama Lengkap</label>
                                    <Input required placeholder="Masukkan nama" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-sm font-medium">Email</label>
                                    <Input required type="email" placeholder="email@example.com" />
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
                                <Button type="submit" className="bg-palembang-red text-white hover:bg-palembang-red/90">Simpan User</Button>
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
                            placeholder="Cari user (nama, email, ID)..." 
                            className="pl-9" 
                            value={searchTerm}
                            onChange={(e) => handleSearchChange(e.target.value)}
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
                            {paginatedUsers.length > 0 ? paginatedUsers.map((user) => (
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
                                            <span className="text-blue-600 bg-blue-50 px-2.5 py-0.5 rounded-full text-xs font-semibold">{user.role}</span>
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
                                                title="View User Profile"
                                                onClick={() => navigate(`/dashboard/account/user/${user.id}?mode=view`)}
                                            >
                                                <Eye className="size-3.5" /> View
                                            </Button>
                                            
                                            {/* Ban / Unban Button */}
                                            {user.isBanned ? (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 text-xs text-emerald-600 border-emerald-200 hover:bg-emerald-50"
                                                    title="Unban User"
                                                    onClick={() => openBanConfirm(user)}
                                                >
                                                    <ShieldCheck className="size-3.5" /> Unban
                                                </Button>
                                            ) : (
                                                <Button
                                                    variant="outline"
                                                    size="sm"
                                                    className="gap-1.5 text-xs text-red-600 border-red-200 hover:bg-red-50"
                                                    title="Ban User"
                                                    onClick={() => openBanConfirm(user)}
                                                >
                                                    <Ban className="size-3.5" /> Ban
                                                </Button>
                                            )}

                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                className="gap-1.5 text-xs text-foreground hover:bg-muted"
                                                title="Edit User Profile"
                                                onClick={() => navigate(`/dashboard/account/user/${user.id}`)}
                                            >
                                                <Edit2 className="size-3.5" /> Edit
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={7} className="px-6 py-8 text-center text-muted-foreground">
                                        Tidak ada user yang cocok dengan pencarian "{searchTerm}"
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
                    totalItems={filteredUsers.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            {/* Confirmation Modal */}
            <ConfirmActionDialog
                open={confirmModal.open}
                onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
                title={confirmModal.action === "ban" ? "Konfirmasi Banned Pengguna" : "Konfirmasi Buka Blokir (Unban)"}
                description={
                    confirmModal.action === "ban"
                        ? `Apakah Anda yakin ingin memblokir (ban) akun ${confirmModal.userName} (${confirmModal.userId})? Pengguna tidak akan dapat masuk ke sistem.`
                        : `Apakah Anda yakin ingin membuka blokir (unban) akun ${confirmModal.userName} (${confirmModal.userId})? Pengguna akan dapat masuk kembali.`
                }
                confirmText={confirmModal.action === "ban" ? "Ya, Banned Pengguna" : "Ya, Unban Pengguna"}
                cancelText="Batal"
                variant={confirmModal.action === "ban" ? "destructive" : "default"}
                onConfirm={handleToggleBan}
            />
        </div>
    )
}