"use client"

import { Sidebar } from "./Sidebar"
import { TopProgressBar } from "./TopProgressBar"
import * as React from "react"
import { UnsavedChangesProvider } from "@/context/UnsavedChangesContext"
import { DashboardSidebarProvider, useDashboardSidebar } from "@/context/DashboardSidebarContext"
import { cn } from "@/lib/utils"

export function DashboardLayout({ children }: { children: React.ReactNode }) {
    return (
        <UnsavedChangesProvider>
            <DashboardSidebarProvider>
                <DashboardLayoutContent>{children}</DashboardLayoutContent>
            </DashboardSidebarProvider>
        </UnsavedChangesProvider>
    )
}

function DashboardLayoutContent({ children }: { children: React.ReactNode }) {
    const { collapsed } = useDashboardSidebar()

    return (
        <div className="min-h-screen bg-muted/20">
            <React.Suspense fallback={null}>
                <TopProgressBar />
            </React.Suspense>
            <Sidebar />
            <main className={cn(
                "transition-all duration-300 pt-16 lg:pt-0 min-w-0 overflow-x-hidden",
                collapsed ? "lg:pl-16" : "lg:pl-64"
            )}>
                <div className="p-4 sm:p-6 md:p-10 max-w-7xl mx-auto min-w-0">
                    {children}
                </div>
            </main>
        </div>
    )
}
