"use client"

import { useLocation } from "@/lib/navigation"
import { useAuth } from "@/context/AuthContext"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"
import { 
    LayoutDashboard, Monitor, Users, FileText, 
    PenTool, CalendarPlus, Activity, User, 
    ChevronLeft, ChevronRight, Menu, ChevronDown 
} from "lucide-react"
import { useState, useEffect } from "react"
import { cn } from "@/lib/utils"

export function Sidebar() {
    const { user } = useAuth()
    const { requestNavigation } = useUnsavedChanges()
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const [isMobile, setIsMobile] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [accountOpen, setAccountOpen] = useState(
        location.pathname.startsWith("/dashboard/account"),
    )
    
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 1024)
        checkMobile()
        window.addEventListener('resize', checkMobile)
        return () => window.removeEventListener('resize', checkMobile)
    }, [])
    
    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    if (!user) return null

    const menuItems = [
        { title: "Overview", icon: LayoutDashboard, path: "/dashboard", roles: ["superadmin", "admin"] },
        { title: "Manage Website", icon: Monitor, path: "/dashboard/website", roles: ["superadmin"] },
        { 
            title: "Manage Account", icon: Users, path: "/dashboard/account", roles: ["superadmin"],
            subItems: [
                { title: "User", path: "/dashboard/account/user" },
                { title: "Admin", path: "/dashboard/account/admin" }
            ]
        },
        { title: "Manage Content", icon: FileText, path: "/dashboard/content", roles: ["superadmin", "admin"] },
        { title: "Create Article", icon: PenTool, path: "/dashboard/create-article", roles: ["superadmin", "admin", "user"] },
        { title: "Create Event", icon: CalendarPlus, path: "/dashboard/create-event", roles: ["superadmin", "admin", "user"] },
        { title: "Log Activities", icon: Activity, path: "/dashboard/logs", roles: ["superadmin"] },
    ]

    const filteredMenu = menuItems.filter(item => item.roles.includes(user.role))

    const handleNav = (path: string) => {
        requestNavigation(path)
    }

    const SidebarContent = () => (
        <div className="flex h-full flex-col justify-between">
            <div>
                <div className={cn("flex h-16 items-center px-4", collapsed ? "justify-center" : "justify-between")}>
                    {!collapsed && (
                        <button onClick={() => handleNav("/")} className="flex items-center gap-2 text-left">
                            <img src="/logo.png" alt="Benah Palembang" className="h-5" />
                        </button>
                    )}
                    {!isMobile && (
                        <button onClick={() => setCollapsed(!collapsed)} className="rounded-md p-1.5 hover:bg-muted">
                            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                        </button>
                    )}
                </div>

                <nav className="mt-6 flex flex-col gap-1 px-2">
                    {filteredMenu.map((item, index) => {
                        const hasSub = !!item.subItems
                        const isActive = location.pathname === item.path || (hasSub && location.pathname.startsWith(item.path))
                        
                        return (
                            <div key={index}>
                                {hasSub ? (
                                    <button
                                        onClick={() => setAccountOpen(!accountOpen)}
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors",
                                            isActive ? "bg-palembang-red/10 text-palembang-red" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            collapsed && "justify-center px-0"
                                        )}
                                        title={collapsed ? item.title : undefined}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="size-4 shrink-0" />
                                            {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                                        </div>
                                        {!collapsed && <ChevronDown className={cn("size-4 transition-transform", accountOpen && "rotate-180")} />}
                                    </button>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={() => handleNav(item.path)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors text-left",
                                            isActive ? "bg-palembang-red text-white" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            collapsed && "justify-center px-0"
                                        )}
                                        title={collapsed ? item.title : undefined}
                                    >
                                        <item.icon className="size-4 shrink-0" />
                                        {!collapsed && <span className="text-sm font-medium">{item.title}</span>}
                                    </button>
                                )}

                                {hasSub && accountOpen && !collapsed && (
                                    <div className="mt-1 flex flex-col gap-1 pl-9 pr-2">
                                        {item.subItems?.map((sub, subIdx) => (
                                            <button
                                                key={subIdx}
                                                type="button"
                                                onClick={() => handleNav(sub.path)}
                                                className={cn(
                                                    "rounded-lg px-3 py-2 text-sm transition-colors text-left w-full",
                                                    location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`)
                                                        ? "bg-palembang-red text-white"
                                                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                )}
                                            >
                                                {sub.title}
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>
            </div>
            
            <div className="p-4">
                <button 
                    type="button"
                    onClick={() => handleNav("/dashboard/profile")}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-2 transition-colors text-left",
                        location.pathname === "/dashboard/profile" ? "bg-muted" : "hover:bg-muted",
                        collapsed && "justify-center"
                    )}
                >
                    <User className="size-5 text-muted-foreground shrink-0" />
                    {!collapsed && (
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-semibold">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                    )}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {isMobile && (
                <div className="fixed left-0 top-0 z-40 flex h-16 w-full items-center border-b bg-background px-4">
                    <button onClick={() => setMobileOpen(true)} className="mr-4">
                        <Menu className="size-6" />
                    </button>
                    <img src="/logo.png" alt="Benah Palembang" className="h-5" />
                </div>
            )}

            {isMobile && mobileOpen && (
                <div className="fixed inset-0 z-50 flex">
                    <div className="absolute inset-0 bg-black/50" onClick={() => setMobileOpen(false)} />
                    <div className="relative w-64 bg-background shadow-xl">
                        <SidebarContent />
                    </div>
                </div>
            )}

            {!isMobile && (
                <aside className={cn(
                    "fixed left-0 top-0 z-30 h-screen border-r bg-background transition-all duration-300",
                    collapsed ? "w-16" : "w-64"
                )}>
                    <SidebarContent />
                </aside>
            )}
        </>
    )
}
