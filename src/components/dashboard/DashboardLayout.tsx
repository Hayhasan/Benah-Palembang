import { Outlet, Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Sidebar } from "./Sidebar"
import { useEffect, useState } from "react"
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext"
import { usePageSEO } from "@/hooks/usePageSEO"

export function DashboardLayout() {
    const { user } = useAuth()
    const [isMobile, setIsMobile] = useState(false)
    const location = useLocation()

    const getDashboardTitle = (path: string) => {
        if (path === "/dashboard") return "Dashboard Overview"
        if (path.includes("/dashboard/website")) return "Kelola Website"
        if (path.includes("/dashboard/account/user")) return "Kelola User"
        if (path.includes("/dashboard/account/admin")) return "Kelola Admin"
        if (path.includes("/dashboard/content/article")) return "Kelola Konten: Article"
        if (path.includes("/dashboard/content/event")) return "Kelola Konten: Event"
        if (path.includes("/dashboard/content")) return "Kelola Konten"
        if (path.includes("/dashboard/create-article")) return "Buat Artikel"
        if (path.includes("/dashboard/create-event")) return "Buat Agenda"
        if (path.includes("/dashboard/logs")) return "Aktivitas Log"
        if (path.includes("/dashboard/profile")) return "Profil Saya"
        return "Dashboard"
    }

    usePageSEO({
        title: getDashboardTitle(location.pathname),
        description: "Panel Administrasi Benah Palembang",
    })

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (!user) {
        return <Navigate to="/login" replace />
    }

    const currentTitle = getDashboardTitle(location.pathname)

    return (
        <UnsavedChangesProvider>
            <div className="min-h-screen bg-muted/20 text-foreground">
                <Sidebar />
                <div className={`transition-all duration-300 ${isMobile ? "pt-16" : "pl-64"}`}>
                    {/* Topbar Header */}
                    <header className="sticky top-0 z-20 flex h-16 w-full items-center justify-between border-b border-border/80 bg-background/85 px-6 backdrop-blur-md shadow-xs">
                        <div className="flex items-center gap-3">
                            <h1 className="text-base font-bold text-foreground sm:text-lg">{currentTitle}</h1>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* User Role Info */}
                            <div className="flex items-center gap-2.5">
                                <img src={user.avatar} alt={user.name} className="size-8 rounded-full object-cover border border-border" />
                                <div className="text-left leading-tight hidden sm:block">
                                    <p className="text-xs font-bold text-foreground truncate max-w-[140px]">{user.name}</p>
                                    <p className="text-[10px] text-palembang-red font-semibold uppercase tracking-wider">{user.role}</p>
                                </div>
                            </div>
                        </div>
                    </header>

                    {/* Main Content Area */}
                    <main>
                        <div className="p-6 md:p-10 max-w-7xl mx-auto">
                            <Outlet />
                        </div>
                    </main>
                </div>
            </div>
        </UnsavedChangesProvider>
    )
}

