"use client"

import { useLocation } from "@/lib/navigation"
import { useCurrentUser } from "@/modules/auth/hooks/use-current-user"
import { useSession } from "@/modules/auth/hooks/use-session"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"
import { 
    LayoutDashboard, Monitor, Users, FileText, 
    PenTool, CalendarPlus, Activity,
    ChevronLeft, ChevronRight, Menu, ChevronDown, LogOut, X
} from "lucide-react"
import { useState, useEffect } from "react"
import { DEFAULT_AVATAR } from "@/lib/constants/placeholder"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export function Sidebar() {
    const user = useCurrentUser()
    const { logout, isLoggingOut } = useSession()
    const { requestNavigation } = useUnsavedChanges()
    const [collapsed, setCollapsed] = useState(false)
    const location = useLocation()
    const [mobileOpen, setMobileOpen] = useState(false)
    const [openSections, setOpenSections] = useState<Record<string, boolean>>(() => ({
        "/dashboard/account": location.pathname.startsWith("/dashboard/account"),
        "/dashboard/content": location.pathname.startsWith("/dashboard/content"),
    }))
    
    useEffect(() => {
        setMobileOpen(false)
    }, [location.pathname])

    useEffect(() => {
        if (location.pathname.startsWith("/dashboard/account")) {
            setOpenSections((prev) => ({ ...prev, "/dashboard/account": true }))
        } else if (location.pathname.startsWith("/dashboard/content")) {
            setOpenSections((prev) => ({ ...prev, "/dashboard/content": true }))
        }
    }, [location.pathname])

    const menuItems = [
        { title: "Overview", icon: LayoutDashboard, path: "/dashboard", roles: ["SUPERADMIN", "ADMIN", "USER"] },
        { title: "Manage Website", icon: Monitor, path: "/dashboard/website", roles: ["SUPERADMIN", "ADMIN"] },
        { 
            title: "Manage Account", icon: Users, path: "/dashboard/account", roles: ["SUPERADMIN"],
            subItems: [
                { title: "User", path: "/dashboard/account/user" },
                { title: "Admin", path: "/dashboard/account/admin" }
            ]
        },
        {
            title: "Manage Content", icon: FileText, path: "/dashboard/content", roles: ["SUPERADMIN", "ADMIN"],
            subItems: [
                { title: "Article", path: "/dashboard/content/article" },
                { title: "Event", path: "/dashboard/content/event" }
            ]
        },
        { title: "Create Article", icon: PenTool, path: "/dashboard/create-article", roles: ["SUPERADMIN", "ADMIN", "USER"] },
        { title: "Create Event", icon: CalendarPlus, path: "/dashboard/create-event", roles: ["SUPERADMIN", "ADMIN", "USER"] },
        { title: "Log Activities", icon: Activity, path: "/dashboard/logs", roles: ["SUPERADMIN"] },
    ]

    const filteredMenu = menuItems.filter(item => item.roles.includes(user.role))

    const handleNav = (path: string) => {
        setMobileOpen(false)
        if (location.pathname !== path) {
            requestNavigation(path)
        }
    }

    const toggleSection = (path: string, defaultSubPath?: string) => {
        if (collapsed) {
            handleNav(defaultSubPath ?? path)
            return
        }
        setOpenSections((prev) => ({
            ...prev,
            [path]: !prev[path],
        }))
    }

    const renderNavContent = (isDrawer = false) => (
        <div className="flex h-full flex-col justify-between">
            <div className="flex flex-col min-h-0 flex-1">
                <div className={cn(
                    "flex h-16 shrink-0 items-center px-4", 
                    collapsed && !isDrawer ? "justify-center" : "justify-between"
                )}>
                    {(!collapsed || isDrawer) && (
                        <button 
                            type="button"
                            onClick={() => handleNav("/")} 
                            className="flex items-center gap-2 text-left"
                        >
                            <img src="/logo.png" alt="Benah Palembang" className="h-5 object-contain brightness-0 dark:invert" />
                        </button>
                    )}
                    {isDrawer ? (
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-lg p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                            aria-label="Tutup menu"
                        >
                            <X className="size-5" />
                        </button>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => setCollapsed(!collapsed)} 
                            className="rounded-md p-1.5 hover:bg-muted text-muted-foreground hover:text-foreground"
                        >
                            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                        </button>
                    )}
                </div>

                <nav className="mt-4 flex-1 overflow-y-auto flex flex-col gap-1 px-2">
                    {filteredMenu.map((item, index) => {
                        const hasSub = !!item.subItems
                        const isCurrent = location.pathname === item.path
                        const isActive = isCurrent || (hasSub && location.pathname.startsWith(item.path))
                        const isExpanded = hasSub && !!openSections[item.path]
                        const isCollapsedMode = collapsed && !isDrawer
                        
                        return (
                            <div key={index}>
                                {hasSub ? (
                                    <button
                                        type="button"
                                        onClick={() => toggleSection(item.path, item.subItems?.[0]?.path)}
                                        className={cn(
                                            "flex w-full items-center justify-between rounded-lg px-3 py-2 transition-colors cursor-pointer text-left",
                                            isActive ? "bg-palembang-red/10 text-palembang-red font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            isCollapsedMode && "justify-center px-0"
                                        )}
                                        title={isCollapsedMode ? item.title : undefined}
                                    >
                                        <div className="flex items-center gap-3">
                                            <item.icon className="size-4 shrink-0" />
                                            {!isCollapsedMode && <span className="text-sm font-medium">{item.title}</span>}
                                        </div>
                                        {!isCollapsedMode && <ChevronDown className={cn("size-4 transition-transform duration-200", isExpanded && "rotate-180")} />}
                                    </button>
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={() => handleNav(item.path)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-3 py-2 transition-colors cursor-pointer text-left",
                                            isCurrent ? "bg-palembang-red text-white font-medium shadow-xs" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            isCollapsedMode && "justify-center px-0"
                                        )}
                                        title={isCollapsedMode ? item.title : undefined}
                                    >
                                        <item.icon className="size-4 shrink-0" />
                                        {!isCollapsedMode && <span className="text-sm font-medium">{item.title}</span>}
                                    </button>
                                )}

                                {isExpanded && !isCollapsedMode && (
                                    <div className="mt-1 flex flex-col gap-1 pl-9 pr-2">
                                        {item.subItems?.map((sub, subIdx) => {
                                            const isSubActive = location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`)
                                            return (
                                                <button
                                                    key={subIdx}
                                                    type="button"
                                                    onClick={() => handleNav(sub.path)}
                                                    className={cn(
                                                        "rounded-lg px-3 py-2 text-sm transition-colors text-left w-full cursor-pointer",
                                                        isSubActive
                                                            ? "bg-palembang-red text-white font-medium shadow-xs"
                                                            : "text-muted-foreground hover:bg-muted hover:text-foreground"
                                                    )}
                                                >
                                                    {sub.title}
                                                </button>
                                            )
                                        })}
                                    </div>
                                )}
                            </div>
                        )
                    })}
                </nav>
            </div>
            
            <div className="shrink-0 space-y-2 border-t p-3">
                <ModeToggle
                    showLabel
                    className={cn(
                        "h-9 w-full rounded-lg px-2",
                        collapsed && !isDrawer && "size-9 px-0"
                    )}
                />
                <button 
                    type="button"
                    onClick={() => handleNav("/dashboard/profile")}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-2 transition-colors text-left cursor-pointer",
                        location.pathname === "/dashboard/profile" ? "bg-muted" : "hover:bg-muted",
                        collapsed && !isDrawer && "justify-center"
                    )}
                >
                    <img
                        src={user.avatarUrl || DEFAULT_AVATAR}
                        alt={user.name}
                        className="size-8 shrink-0 rounded-full bg-muted object-cover"
                    />
                    {(!collapsed || isDrawer) && (
                        <div className="overflow-hidden">
                            <p className="truncate text-sm font-semibold">{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                    )}
                </button>
                <button
                    type="button"
                    disabled={isLoggingOut}
                    onClick={() => logout({ redirectTo: "/login" })}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-2 text-left text-sm font-medium text-destructive transition-colors hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer",
                        collapsed && !isDrawer && "justify-center"
                    )}
                    title={collapsed && !isDrawer ? "Logout" : undefined}
                >
                    <LogOut className="size-5 shrink-0" />
                    {(!collapsed || isDrawer) && (
                        <span>{isLoggingOut ? "Memproses..." : "Logout"}</span>
                    )}
                </button>
            </div>
        </div>
    )

    return (
        <>
            {/* Mobile Header Bar */}
            <div className="lg:hidden fixed left-0 top-0 z-40 flex h-16 w-full items-center justify-between border-b bg-background px-4">
                <div className="flex items-center">
                    <button 
                        type="button"
                        onClick={() => setMobileOpen(true)} 
                        className="mr-4 rounded-md p-1.5 text-muted-foreground hover:bg-muted hover:text-foreground"
                        aria-label="Buka menu"
                    >
                        <Menu className="size-6" />
                    </button>
                    <img src="/logo.png" alt="Benah Palembang" className="h-5 object-contain brightness-0 dark:invert" />
                </div>
                <ModeToggle className="size-8" />
            </div>

            {/* Mobile Sidebar Drawer */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50">
                    <div 
                        className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity" 
                        onClick={() => setMobileOpen(false)}
                        aria-hidden="true" 
                    />
                    <div className="relative z-10 flex h-full w-64 flex-col bg-background shadow-2xl">
                        {renderNavContent(true)}
                    </div>
                </div>
            )}

            {/* Desktop Sidebar */}
            <aside className={cn(
                "hidden lg:flex fixed left-0 top-0 z-30 h-screen border-r bg-background transition-all duration-300 flex-col",
                collapsed ? "w-16" : "w-64"
            )}>
                {renderNavContent(false)}
            </aside>
        </>
    )
}
