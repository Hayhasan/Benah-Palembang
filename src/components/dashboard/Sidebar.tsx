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
import { useRouter } from "next/navigation"
import { DEFAULT_AVATAR } from "@/lib/constants/placeholder"
import { cn } from "@/lib/utils"
import { ModeToggle } from "@/components/mode-toggle"

export function Sidebar() {
    const router = useRouter()
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
        if (mobileOpen) {
            document.body.style.overflow = "hidden"
        } else {
            document.body.style.overflow = ""
        }
        return () => {
            document.body.style.overflow = ""
        }
    }, [mobileOpen])

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

    // Prefetch all dashboard routes for instant page switching
    useEffect(() => {
        menuItems.forEach((item) => {
            router.prefetch(item.path)
            item.subItems?.forEach((sub) => router.prefetch(sub.path))
        })
        router.prefetch("/dashboard/profile")
    }, [router])

    const filteredMenu = menuItems.filter(item => item.roles.includes(user.role))

    const handleNav = (path: string) => {
        setMobileOpen(false)
        if (location.pathname !== path) {
            window.dispatchEvent(new Event("app:navigation-start"))
            requestNavigation(path)
        }
    }

    const toggleSection = (path: string) => {
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
                    collapsed && !isDrawer ? "justify-center" : "justify-between",
                    isDrawer && "px-5 border-b"
                )}>
                    {(!collapsed || isDrawer) && (
                        <button 
                            type="button"
                            onClick={() => handleNav("/")} 
                            className="flex items-center gap-2 text-left min-h-[44px] px-2 rounded-lg hover:bg-muted/50 transition-colors"
                        >
                            <img src="/logo.png" alt="Benah Palembang" className={cn("object-contain brightness-0 dark:invert", isDrawer ? "h-6" : "h-5")} />
                        </button>
                    )}
                    {isDrawer ? (
                        <button
                            type="button"
                            onClick={() => setMobileOpen(false)}
                            className="rounded-full p-2.5 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-transform"
                            aria-label="Tutup menu"
                        >
                            <X className="size-6" />
                        </button>
                    ) : (
                        <button 
                            type="button"
                            onClick={() => setCollapsed(!collapsed)} 
                            className="rounded-md p-2 hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
                            aria-label={collapsed ? "Perluas sidebar" : "Ciutkan sidebar"}
                        >
                            {collapsed ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
                        </button>
                    )}
                </div>

                <nav className={cn(
                    "mt-4 flex-1 overflow-y-auto flex flex-col gap-1 px-2",
                    isDrawer && "px-4 gap-2"
                )}>
                    {filteredMenu.map((item, index) => {
                        const hasSub = !!item.subItems
                        const isCurrent = location.pathname === item.path
                        const isActive = isCurrent || (hasSub && location.pathname.startsWith(item.path))
                        const isExpanded = hasSub && !!openSections[item.path]
                        const isCollapsedMode = collapsed && !isDrawer
                        
                        return (
                            <div key={index}>
                                {hasSub ? (
                                    <div className="flex flex-col">
                                        <div className={cn(
                                            "flex w-full items-center rounded-lg transition-colors",
                                            isActive ? "bg-palembang-red/10 text-palembang-red font-medium" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            isCollapsedMode && "justify-center"
                                        )}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    // Klik menu utama langsung navigasi ke sub-halaman pertama dan ganti halaman seketika
                                                    handleNav(item.subItems?.[0]?.path ?? item.path)
                                                }}
                                                className={cn(
                                                    "flex flex-1 items-center gap-3 rounded-l-lg py-2.5 px-3.5 sm:py-2 sm:px-3 text-left cursor-pointer min-h-[44px] sm:min-h-[38px] active:scale-[0.99] transition-transform",
                                                    isDrawer && "min-h-[48px] px-4 text-base",
                                                    isCollapsedMode && "justify-center px-0 flex-initial min-w-[40px] rounded-lg"
                                                )}
                                                title={isCollapsedMode ? item.title : undefined}
                                            >
                                                <item.icon className={cn("shrink-0", isDrawer ? "size-5" : "size-4")} />
                                                {!isCollapsedMode && <span className={cn(isDrawer ? "text-base font-medium" : "text-sm font-medium")}>{item.title}</span>}
                                            </button>
                                            {!isCollapsedMode && (
                                                <button
                                                    type="button"
                                                    onClick={(e) => {
                                                        e.stopPropagation()
                                                        toggleSection(item.path)
                                                    }}
                                                    className={cn(
                                                        "p-2.5 sm:p-1.5 text-muted-foreground hover:text-foreground rounded-r-lg min-h-[44px] min-w-[44px] sm:min-h-[36px] sm:min-w-[36px] flex items-center justify-center cursor-pointer active:scale-95 transition-transform",
                                                        isDrawer && "min-h-[48px] min-w-[50px] px-3.5"
                                                    )}
                                                    aria-label={`Buka/Tutup sub menu ${item.title}`}
                                                >
                                                    <ChevronDown className={cn(isDrawer ? "size-5" : "size-4", "transition-transform duration-200", isExpanded && "rotate-180")} />
                                                </button>
                                            )}
                                        </div>

                                        {isExpanded && !isCollapsedMode && (
                                            <div className={cn("mt-1 flex flex-col gap-1 pl-7 pr-1", isDrawer && "pl-9 pr-2 gap-1.5")}>
                                                {item.subItems?.map((sub, subIdx) => {
                                                    const isSubActive = location.pathname === sub.path || location.pathname.startsWith(`${sub.path}/`)
                                                    return (
                                                        <button
                                                            key={subIdx}
                                                            type="button"
                                                            onClick={() => handleNav(sub.path)}
                                                            className={cn(
                                                                "rounded-lg px-3.5 py-2.5 sm:px-3 sm:py-2 text-sm transition-all text-left w-full cursor-pointer min-h-[42px] sm:min-h-[36px] flex items-center active:scale-[0.99]",
                                                                isDrawer && "min-h-[46px] px-4 text-base font-medium",
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
                                ) : (
                                    <button 
                                        type="button"
                                        onClick={() => handleNav(item.path)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-lg px-3.5 py-2.5 sm:px-3 sm:py-2 transition-all cursor-pointer text-left min-h-[44px] sm:min-h-[38px] active:scale-[0.99]",
                                            isDrawer && "min-h-[48px] px-4 text-base",
                                            isCurrent ? "bg-palembang-red text-white font-medium shadow-xs" : "text-muted-foreground hover:bg-muted hover:text-foreground",
                                            isCollapsedMode && "justify-center px-0 min-h-[40px]"
                                        )}
                                        title={isCollapsedMode ? item.title : undefined}
                                    >
                                        <item.icon className={cn("shrink-0", isDrawer ? "size-5" : "size-4")} />
                                        {!isCollapsedMode && <span className={cn(isDrawer ? "text-base font-medium" : "text-sm font-medium")}>{item.title}</span>}
                                    </button>
                                )}
                            </div>
                        )
                    })}
                </nav>
            </div>
            
            <div className={cn("shrink-0 space-y-2 border-t p-3", isDrawer && "p-4 space-y-3")}>
                <ModeToggle
                    showLabel
                    className={cn(
                        "h-10 sm:h-9 min-h-[44px] sm:min-h-[36px] w-full rounded-lg px-3",
                        isDrawer && "min-h-[48px] text-base px-4",
                        collapsed && !isDrawer && "size-9 px-0 min-h-0"
                    )}
                />
                <button 
                    type="button"
                    onClick={() => handleNav("/dashboard/profile")}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-2.5 sm:p-2 transition-all text-left cursor-pointer min-h-[48px] sm:min-h-[42px] active:scale-[0.99]",
                        isDrawer && "min-h-[52px] p-3",
                        location.pathname === "/dashboard/profile" ? "bg-muted" : "hover:bg-muted",
                        collapsed && !isDrawer && "justify-center"
                    )}
                >
                    <img
                        src={user.avatarUrl || DEFAULT_AVATAR}
                        alt={user.name}
                        className={cn("shrink-0 rounded-full bg-muted object-cover", isDrawer ? "size-10" : "size-8")}
                    />
                    {(!collapsed || isDrawer) && (
                        <div className="overflow-hidden">
                            <p className={cn("truncate font-semibold", isDrawer ? "text-base" : "text-sm")}>{user.name}</p>
                            <p className="truncate text-xs text-muted-foreground capitalize">{user.role}</p>
                        </div>
                    )}
                </button>
                <button
                    type="button"
                    disabled={isLoggingOut}
                    onClick={() => logout({ redirectTo: "/login" })}
                    className={cn(
                        "flex w-full items-center gap-3 rounded-lg p-2.5 sm:p-2 text-left text-sm font-medium text-destructive transition-all hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-60 cursor-pointer min-h-[44px] sm:min-h-[38px] active:scale-[0.99]",
                        isDrawer && "min-h-[48px] p-3 text-base font-semibold",
                        collapsed && !isDrawer && "justify-center"
                    )}
                    title={collapsed && !isDrawer ? "Logout" : undefined}
                >
                    <LogOut className={cn("shrink-0", isDrawer ? "size-5" : "size-5")} />
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
                        className="mr-3 rounded-lg p-2 min-h-[44px] min-w-[44px] flex items-center justify-center text-muted-foreground hover:bg-muted hover:text-foreground active:scale-95 transition-transform"
                        aria-label="Buka menu"
                    >
                        <Menu className="size-6" />
                    </button>
                    <img src="/logo.png" alt="Benah Palembang" className="h-5 object-contain brightness-0 dark:invert" />
                </div>
                <ModeToggle className="size-10 min-h-[44px] min-w-[44px]" />
            </div>

            {/* Mobile Sidebar Fullscreen */}
            {mobileOpen && (
                <div className="lg:hidden fixed inset-0 z-50 flex h-full w-full flex-col bg-background animate-in fade-in duration-200">
                    {renderNavContent(true)}
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
