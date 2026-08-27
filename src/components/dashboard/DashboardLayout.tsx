import { Outlet, Navigate } from "react-router-dom"
import { useAuth } from "@/context/AuthContext"
import { Sidebar } from "./Sidebar"
import { useEffect, useState } from "react"
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext"

export function DashboardLayout() {
    const { user } = useAuth()
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    if (!user) {
        return <Navigate to="/login" replace />
    }

    return (
        <UnsavedChangesProvider>
            <div className="min-h-screen bg-muted/20">
                <Sidebar />
                <main className={`transition-all duration-300 ${isMobile ? "pt-16" : "pl-64"}`}>
                    <div className="p-6 md:p-10 max-w-7xl mx-auto">
                        <Outlet />
                    </div>
                </main>
            </div>
        </UnsavedChangesProvider>
    )
}

