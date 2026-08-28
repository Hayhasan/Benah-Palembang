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
import { DEFAULT_USER_ACCOUNTS } from "@/modules/account-manage/constants/default-accounts"

export function ManageUser() {
    const navigate = useNavigate()
    const [users, setUsers] = useState(DEFAULT_USER_ACCOUNTS)
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

    const openBanConfirm = (user: typeof DEFAULT_USER_ACCOUNTS[number]) => {
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
