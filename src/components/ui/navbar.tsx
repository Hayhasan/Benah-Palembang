import { Link, useLocation } from 'react-router-dom'
import { Equal, X, ChevronDown, LogOut, LayoutDashboard, Sun, Moon } from 'lucide-react'
import { Button } from '@/components/ui/liquid-glass-button'
import React, { useState, useRef, useCallback } from 'react'
import { cn } from '@/lib/utils'
import { useAuth } from '@/context/AuthContext'
import { useTheme } from '@/context/ThemeContext'

const categories = [
    { name: 'Cerita Warga', href: '/cerita-warga' },
    { name: 'Gaya Hidup', href: '/gaya-hidup' },
    { name: 'Ruang Kota', href: '/ruang-kota' },
    { name: 'Industri Kreatif', href: '/industri-kreatif' },
    { name: 'Kebudayaan', href: '/kebudayaan' },
]

export const Header = () => {
    const { user, logout } = useAuth()
    const { theme, toggleTheme } = useTheme()
    const [profileOpen, setProfileOpen] = useState(false)
    const [menuState, setMenuState] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [articleOpen, setArticleOpen] = useState(false)
    const location = useLocation()
    const isHome = location.pathname === "/"
    const isHomeActive = location.pathname === "/"
    const isArticleActive = categories.some(cat => location.pathname === cat.href) || location.pathname.startsWith("/article/")
    const isAgendaActive = location.pathname.startsWith("/agenda")
    const isCollabActive = location.pathname === "/kolaborasi"
    const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null)

    const handleDropdownEnter = useCallback(() => { 
        if (closeTimer.current) { 
            clearTimeout(closeTimer.current)
            closeTimer.current = null 
        }
        setArticleOpen(true) 
    }, [])
    
    const handleDropdownLeave = useCallback(() => { 
        closeTimer.current = setTimeout(() => setArticleOpen(false), 250) 
    }, [])

    React.useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 50)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])
    
    React.useEffect(() => {
        setMenuState(false)
        setArticleOpen(false)
    }, [location.pathname])

    const hasDarkHero = isHome || isArticleActive || isAgendaActive || isCollabActive || location.pathname.startsWith('/penulis/') || location.pathname.startsWith('/kategori/')
    const isOverDarkHero = !isScrolled && hasDarkHero && !menuState
    const isLogoWhite = theme === 'dark' || isOverDarkHero

    return (
        <header>
            <nav
                data-state={menuState ? 'active' : 'inactive'}
                className="fixed left-0 top-0 w-full z-50 px-2">
                <div className={cn(
                    'mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12', 
                    isScrolled && 'bg-background/85 max-w-4xl rounded-2xl border border-border/80 backdrop-blur-xl lg:px-5 shadow-sm text-foreground', 
                    !isScrolled && isOverDarkHero && 'bg-transparent text-white', 
                    !isScrolled && !isOverDarkHero && 'bg-transparent text-foreground'
                )}>
                    <div className="relative flex flex-wrap items-center justify-between gap-6 lg:gap-0 py-2">
                        <div className="flex w-full items-center justify-between lg:w-auto">
                            <Link
                                to="/"
                                aria-label="home"
                                className="flex gap-2 items-center">
                                <img src={isLogoWhite ? "/logo.png" : "/logohitam.png"} alt="Benah Palembang" className={cn("transition-all duration-300 object-contain", isScrolled ? "h-6" : "h-7")} />
                            </Link>

                            <div className="flex items-center gap-2 lg:hidden">
                                <button
                                    onClick={toggleTheme}
                                    aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                    title={theme === 'dark' ? 'Mode Terang' : 'Mode Gelap'}
                                    className={cn(
                                        "flex size-8 items-center justify-center rounded-full border transition-all duration-200",
                                        isOverDarkHero
                                            ? "border-white/20 bg-white/10 text-white"
                                            : "border-border bg-background text-foreground"
                                    )}
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="size-4 text-amber-400" />
                                    ) : (
                                        <Moon className="size-4 text-palembang-sage" />
                                    )}
                                </button>

                                <button
                                    onClick={() => setMenuState(!menuState)}
                                    aria-label={menuState ? 'Close Menu' : 'Open Menu'}
                                    className={cn("relative z-20 block cursor-pointer p-1.5", isOverDarkHero ? "text-white" : "text-foreground")}>
                                    {menuState ? <X className="size-6" /> : <Equal className="size-6" />}
                                </button>
                            </div>
                        </div>

                        <div className="absolute inset-0 m-auto hidden size-fit lg:block">
                            <ul className="flex items-center gap-8 text-[11px] font-bold uppercase tracking-[0.16em]">
                                <li>
                                    <Link
                                        to="/"
                                        className={cn(
                                            "duration-150 transition-colors py-1",
                                            isHomeActive
                                                ? "text-palembang-red font-bold"
                                                : (isOverDarkHero ? "text-white/80 hover:text-palembang-red" : "text-muted-foreground hover:text-palembang-red")
                                        )}
                                    >
                                        Home
                                    </Link>
                                </li>
                                <li className="relative" onMouseEnter={handleDropdownEnter} onMouseLeave={handleDropdownLeave}>
                                    <button 
                                        onClick={() => setArticleOpen((value) => !value)} 
                                        className={cn(
                                            "flex items-center gap-1 duration-150 transition-colors py-1",
                                            isArticleActive
                                                ? "text-palembang-red font-bold"
                                                : (isOverDarkHero ? "text-white/80 hover:text-palembang-red" : "text-muted-foreground hover:text-palembang-red")
                                        )}
                                    >
                                        Article <ChevronDown className={cn("size-3 transition-transform duration-300", articleOpen && "rotate-180")} />
                                    </button>
                                    
                                    {/* Dropdown Menu */}
                                    <div className={cn("absolute left-1/2 top-full mt-4 w-56 -translate-x-1/2 rounded-2xl border border-border bg-background p-2 text-foreground shadow-xl transition-all duration-200", articleOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 translate-y-2 invisible")}>
                                        <div className="absolute inset-x-0 -top-4 h-4" /> {/* Invisible hover bridge */}
                                        {categories.map((category, index) => {
                                            const isCatActive = location.pathname === category.href
                                            return (
                                                <Link 
                                                    key={index} 
                                                    to={category.href} 
                                                    className={cn(
                                                        "flex items-center justify-between rounded-xl px-3 py-2.5 text-xs font-medium normal-case tracking-normal transition-colors",
                                                        isCatActive ? "bg-palembang-red/10 text-palembang-red font-semibold" : "text-foreground hover:bg-muted"
                                                    )}
                                                    onClick={() => setArticleOpen(false)}
                                                >
                                                    <span>{category.name}</span>
                                                    {isCatActive && <span className="size-1.5 rounded-full bg-palembang-red" />}
                                                </Link>
                                            )
                                        })}
                                    </div>
                                </li>
                                <li>
                                    <Link
                                        to="/agenda"
                                        className={cn(
                                            "duration-150 transition-colors py-1",
                                            isAgendaActive
                                                ? "text-palembang-red font-bold"
                                                : (!isScrolled && isHome ? "text-white/80 hover:text-palembang-red" : "text-muted-foreground hover:text-palembang-red")
                                        )}
                                    >
                                        Agenda
                                    </Link>
                                </li>
                                <li>
                                    <Link
                                        to="/kolaborasi"
                                        className={cn(
                                            "duration-150 transition-colors py-1",
                                            isCollabActive
                                                ? "text-palembang-red font-bold"
                                                : (!isScrolled && isHome ? "text-white/80 hover:text-palembang-red" : "text-muted-foreground hover:text-palembang-red")
                                        )}
                                    >
                                        Collaboration
                                    </Link>
                                </li>
                            </ul>
                        </div>

                        <div className={cn("lg:flex mb-6 w-full flex-wrap items-center justify-end space-y-8 rounded-3xl p-6 md:flex-nowrap lg:m-0 lg:w-fit lg:gap-6 lg:space-y-0 lg:border-transparent lg:bg-transparent lg:p-0 lg:shadow-none dark:lg:bg-transparent", menuState ? "block bg-background/80 backdrop-blur-2xl border border-white/15 shadow-2xl" : "hidden lg:flex")}>
                            <div className="lg:hidden w-full overflow-y-auto max-h-[60vh] pr-2 no-scrollbar">
                                <ul className="space-y-4 text-base font-medium">
                                    <li>
                                        <Link to="/" className={cn("block duration-150 py-2 border-b border-border/40 transition-colors", isHomeActive ? "text-palembang-red font-bold" : "text-foreground hover:text-palembang-red")}>
                                            Home
                                        </Link>
                                    </li>
                                    <li>
                                        <div className={cn("block py-2 font-bold uppercase tracking-wider text-[11px] mt-2", isArticleActive ? "text-palembang-red" : "text-muted-foreground")}>
                                            Article
                                        </div>
                                        <ul className="pl-4 space-y-3 mt-3">
                                            {categories.map((category, index) => {
                                                const isCatActive = location.pathname === category.href
                                                return (
                                                    <li key={index}>
                                                        <Link to={category.href} className={cn("block duration-150 text-sm transition-colors", isCatActive ? "text-palembang-red font-bold" : "text-foreground hover:text-palembang-red")}>
                                                            {category.name}
                                                        </Link>
                                                    </li>
                                                )
                                            })}
                                        </ul>
                                    </li>
                                    <li>
                                        <Link to="/agenda" className={cn("block duration-150 py-2 border-b border-border/40 mt-2 transition-colors", isAgendaActive ? "text-palembang-red font-bold" : "text-foreground hover:text-palembang-red")}>
                                            Agenda
                                        </Link>
                                    </li>
                                    <li>
                                        <Link to="/kolaborasi" className={cn("block duration-150 py-2 border-b border-border/40 transition-colors", isCollabActive ? "text-palembang-red font-bold" : "text-foreground hover:text-palembang-red")}>
                                            Collaboration
                                        </Link>
                                    </li>
                                </ul>
                            </div>
                            <div className="flex w-full flex-col space-y-3 sm:flex-row sm:gap-2 sm:space-y-0 md:w-fit text-foreground mt-4 lg:mt-0 items-center">
                                {/* Desktop Theme Toggle Button */}
                                <button
                                    onClick={toggleTheme}
                                    aria-label={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
                                    title={theme === 'dark' ? 'Ganti ke Mode Terang' : 'Ganti ke Mode Gelap'}
                                    className={cn(
                                        "hidden lg:flex size-9 items-center justify-center rounded-full border transition-all duration-300 hover:scale-105 active:scale-95",
                                        isOverDarkHero
                                            ? "border-white/20 bg-white/10 text-white hover:bg-white/20"
                                            : "border-border bg-background text-foreground hover:bg-muted"
                                    )}
                                >
                                    {theme === 'dark' ? (
                                        <Sun className="size-4 text-amber-400 transition-transform duration-300 hover:rotate-45" />
                                    ) : (
                                        <Moon className="size-4 text-palembang-sage transition-transform duration-300 hover:-rotate-12" />
                                    )}
                                </button>

                                {user ? (
                                    <div className="relative">
                                        <button 
                                            onClick={() => setProfileOpen(!profileOpen)}
                                            className={cn("flex items-center gap-3 rounded-full border p-1.5 pr-4 transition-colors hover:bg-muted/50", isOverDarkHero ? "border-white/20 text-white hover:bg-white/10" : "border-border text-foreground")}
                                        >
                                            <img src={user.avatar} alt={user.name} className="size-7 rounded-full object-cover" />
                                            <span className="text-sm font-semibold">{user.name}</span>
                                        </button>
                                        
                                        {profileOpen && (
                                            <div className="absolute right-0 top-full mt-2 w-48 rounded-xl border border-border bg-background p-2 text-foreground shadow-xl">
                                                <Link 
                                                    to="/dashboard" 
                                                    className="flex items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium transition-colors hover:bg-muted"
                                                    onClick={() => setProfileOpen(false)}
                                                >
                                                    <LayoutDashboard className="size-4" />
                                                    Dashboard
                                                </Link>
                                                <button 
                                                    onClick={() => { setProfileOpen(false); logout(); }}
                                                    className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-destructive transition-colors hover:bg-destructive/10"
                                                >
                                                    <LogOut className="size-4" />
                                                    Logout
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <>
                                        {/* Mobile view buttons: Login (Red) & Sign Up (Transparent), No Get Started */}
                                        <div className="flex w-full flex-col gap-2.5 lg:hidden">
                                            <Link
                                                to="/login"
                                                className="flex h-11 w-full items-center justify-center rounded-xl bg-palembang-red text-sm font-bold text-white shadow-md transition-colors hover:bg-palembang-red/90"
                                            >
                                                Login
                                            </Link>
                                            <Link
                                                to="/register"
                                                className="flex h-11 w-full items-center justify-center rounded-xl border border-border/70 bg-background/50 text-sm font-semibold text-foreground transition-colors hover:bg-muted"
                                            >
                                                Sign Up
                                            </Link>
                                        </div>

                                        {/* Desktop view buttons */}
                                        <div className="hidden lg:flex items-center gap-2">
                                            <Button
                                                asChild
                                                variant="outline"
                                                size="sm"
                                                className={cn(isScrolled && 'lg:hidden')}>
                                                <Link to="/login">
                                                    <span>Login</span>
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                size="sm"
                                                className={cn(isScrolled && 'lg:hidden')}>
                                                <Link to="/register">
                                                    <span>Sign Up</span>
                                                </Link>
                                            </Button>
                                            <Button
                                                asChild
                                                size="sm"
                                                className={cn(isScrolled ? 'lg:inline-flex' : 'hidden')}>
                                                <Link to="/login">
                                                    <span>Get Started</span>
                                                </Link>
                                            </Button>
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </nav>
        </header>
    )
}
