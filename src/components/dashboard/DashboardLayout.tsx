"use client"

import { Sidebar } from "./Sidebar"
import { TopProgressBar } from "./TopProgressBar"
import * as React from "react"
import { useEffect, useState } from "react"
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])

    return (
        <UnsavedChangesProvider>
            <div className="min-h-screen bg-muted/20">
                <React.Suspense fallback={null}>
                    <TopProgressBar />
                </React.Suspense>
                <Sidebar />
                <main className="transition-all duration-300 pt-16 lg:pt-0 lg:pl-64 min-w-0 overflow-x-hidden">
                    <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto min-w-0">
                        {children}
                    </div>
                </main>
            </div>
        </UnsavedChangesProvider>
    )
}
