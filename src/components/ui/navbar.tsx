"use client"

import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import {
  CalendarDays,
  ExternalLink,
  LayoutDashboard,
  Loader2,
  LogOut,
  Menu,
  Newspaper,
  Search,
  Ticket,
  X,
} from "lucide-react"
import React, { useEffect, useRef, useState } from "react"

import { DEFAULT_AVATAR } from "@/lib/constants/placeholder"
import { cn } from "@/lib/utils"
import { useSession } from "@/modules/auth/hooks/use-session"
import { searchContentAction } from "@/modules/search/actions/search-action"
import type { SearchResults } from "@/modules/search/types/search"
import { useHeaderFooterContent } from "@/modules/website-content/components/header-footer-content-provider"

type SearchTab = "all" | "articles" | "events" | "collaborations"

interface HeaderProps {
  overlay?: boolean
}

export const Header = ({ overlay = false }: HeaderProps) => {
  const { logo, footer } = useHeaderFooterContent()
  
  const navItems = [
    { name: "Cerita Warga", href: "/cerita-warga" },
    { name: "Gaya Hidup", href: "/gaya-hidup" },
    { name: "Ruang Kota", href: "/ruang-kota" },
    { name: "Industri Kreatif", href: "/industri-kreatif" },
    { name: "Kebudayaan", href: "/kebudayaan" },
    { name: "Agenda", href: "/agenda" },
    { name: "Kolaborasi", href: "/kolaborasi" },
  ]
  const { user, logout, isLoggingOut } = useSession()
  const pathname = usePathname()
  const router = useRouter()

  const [searchOpen, setSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState<SearchResults | null>(null)
  const [isSearching, setIsSearching] = useState(false)
  const [searchTab, setSearchTab] = useState<SearchTab>("all")
  const [profileOpen, setProfileOpen] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const searchInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    const timer = setTimeout(() => {
      setMobileMenuOpen(false)
      setSearchOpen(false)
      setProfileOpen(false)
    }, 0)
    return () => clearTimeout(timer)
  }, [pathname])

  useEffect(() => {
    if (searchOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus()
      }, 50)
      return () => clearTimeout(timer)
    } else {
      const timer = setTimeout(() => {
        setSearchQuery("")
        setSearchResults(null)
        setIsSearching(false)
        setSearchTab("all")
      }, 0)
      return () => clearTimeout(timer)
    }
  }, [searchOpen])

  // Live search debounce
  useEffect(() => {
    const trimmed = searchQuery.trim()
    if (!trimmed || trimmed.length < 2) {
      const timer = setTimeout(() => {
        setSearchResults(null)
        setIsSearching(false)
      }, 0)
      return () => clearTimeout(timer)
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true)
      try {
        const results = await searchContentAction(trimmed)
        setSearchResults(results)
      } catch (err) {
        console.error("Search error:", err)
      } finally {
        setIsSearching(false)
      }
    }, 250)

    return () => clearTimeout(timeoutId)
  }, [searchQuery])

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    const trimmed = searchQuery.trim()
    if (!trimmed) return
    router.push(`/search?q=${encodeURIComponent(trimmed)}`)
    setSearchOpen(false)
  }

  const isNavActive = (href: string) => {
    if (href === "/") return pathname === "/"
    return pathname === href || pathname.startsWith(`${href}/`)
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full bg-white border-b border-zinc-200 transition-all duration-200 shadow-xs pointer-events-auto",
        overlay ? "-mb-[98px]" : ""
      )}
    >
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8">
        {/* Top Row: Mobile Hamburger, Centered Logo, Search & Profile */}
        <div className="relative flex h-14 sm:h-16 items-center justify-between">
          {/* Left: Mobile hamburger trigger */}
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-1.5 text-zinc-700 hover:text-zinc-900 lg:hidden rounded transition-colors"
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            </button>
          </div>

          {/* Centered Logo (Click navigates to Home) */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
            <Link
              href="/"
              aria-label="Home"
              className="flex items-center justify-center transition-transform hover:scale-105"
            >
              {logo.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={logo.imageUrl}
                  alt={logo.imageAlt || "Benah Palembang"}
                  className="h-7 sm:h-8.5 w-auto object-contain scale-75 origin-center"
                />
              ) : (
                <div className="flex size-8.5 items-center justify-center rounded-full border-[2.5px] border-black font-extrabold text-sm sm:text-base tracking-tighter text-black scale-75 origin-center">
                  M
                </div>
              )}
            </Link>
          </div>

          {/* Right: Search & Profile */}
          <div className="flex items-center justify-end gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => setSearchOpen(true)}
              className="flex size-8 items-center justify-center rounded-full text-zinc-800 transition-colors hover:bg-zinc-100"
              aria-label="Cari artikel"
            >
              <Search className="size-4.5" />
            </button>

            {user ? (
              <div className="relative">
                <button
                  type="button"
                  onClick={() => setProfileOpen(!profileOpen)}
                  className="flex size-7.5 items-center justify-center overflow-hidden rounded-full ring-1 ring-zinc-300 transition hover:ring-zinc-600"
                  aria-label="Akun"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={user.avatarUrl || DEFAULT_AVATAR}
                    alt={user.name}
                    className="size-full object-cover"
                  />
                </button>

                {profileOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 rounded-lg border border-zinc-200 bg-white p-1.5 shadow-lg z-50 text-xs">
                    <div className="px-3 py-2 border-b border-zinc-100 font-medium text-zinc-900 truncate">
                      {user.name}
                    </div>
                    <Link
                      href="/dashboard"
                      className="flex items-center gap-2 rounded px-3 py-2 text-zinc-700 hover:bg-zinc-100 font-medium"
                      onClick={() => setProfileOpen(false)}
                    >
                      <LayoutDashboard className="size-3.5" />
                      Dashboard
                    </Link>
                    <button
                      type="button"
                      disabled={isLoggingOut}
                      onClick={() => {
                        setProfileOpen(false)
                        logout()
                      }}
                      className="flex w-full items-center gap-2 rounded px-3 py-2 text-red-600 hover:bg-red-50 font-medium"
                    >
                      <LogOut className="size-3.5" />
                      Logout
                    </button>
                  </div>
                )}
              </div>
            ) : null}
          </div>
        </div>

        {/* Navigation Row: Desktop Categories */}
        <nav
          aria-label="Kategori navigasi"
          className="hidden lg:flex items-center justify-center gap-6 sm:gap-8 pb-3 pt-1 border-t border-zinc-100 overflow-x-auto no-scrollbar"
        >
          {navItems.map((item) => {
            const active = isNavActive(item.href)
            return (
              <Link
                key={item.name}
                href={item.href}
                className={cn(
                  "whitespace-nowrap text-[11px] font-bold uppercase tracking-[0.14em] transition-colors py-1 relative",
                  active
                    ? "text-black after:absolute after:bottom-0 after:left-0 after:right-0 after:h-[2px] after:bg-black"
                    : "text-zinc-600 hover:text-black"
                )}
              >
                {item.name}
              </Link>
            )
          })}
        </nav>

        {/* Mobile Drawer Dropdown */}
        {mobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 border-b border-zinc-200 bg-white p-4 shadow-xl lg:hidden z-50">
            <div className="flex flex-col space-y-2">
              {navItems.map((item) => {
                const active = isNavActive(item.href)
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className={cn(
                      "px-3 py-2 text-xs font-bold uppercase tracking-wider rounded transition-colors",
                      active
                        ? "bg-zinc-900 text-white"
                        : "text-zinc-700 hover:bg-zinc-100"
                    )}
                  >
                    {item.name}
                  </Link>
                )
              })}
            </div>
          </div>
        )}
      </div>

      {/* Search Modal Overlay */}
      {searchOpen && (
        <div
          onClick={(e) => {
            if (e.target === e.currentTarget) setSearchOpen(false)
          }}
          className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-xs pt-12 sm:pt-20 px-4 pointer-events-auto animate-in fade-in duration-200"
        >
          <div className="relative w-full max-w-2xl rounded-xl border border-zinc-200 bg-white shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Search Input Bar */}
            <form onSubmit={handleSearchSubmit} className="flex items-center gap-3 border-b border-zinc-200 p-4 shrink-0 bg-white">
              <Search className="size-5 text-zinc-400 shrink-0" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari artikel, agenda, atau kolaborasi..."
                className="w-full bg-transparent text-sm sm:text-base text-zinc-900 outline-none placeholder:text-zinc-400"
              />
              {isSearching && <Loader2 className="size-4.5 animate-spin text-zinc-400 shrink-0" />}
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery("")}
                  className="rounded p-1 text-zinc-400 hover:text-zinc-700"
                  aria-label="Hapus kata kunci"
                >
                  <X className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setSearchOpen(false)}
                className="rounded border border-zinc-200 px-2 py-0.5 text-[11px] font-semibold text-zinc-500 hover:bg-zinc-100"
                aria-label="Tutup pencarian"
              >
                ESC
              </button>
            </form>

            {/* Category Filter Tabs */}
            {searchResults && (
              <div className="flex items-center gap-1.5 px-4 py-2.5 border-b border-zinc-100 bg-zinc-50 overflow-x-auto no-scrollbar shrink-0">
                {[
                  { key: "all", label: "Semua", count: searchResults.totalCount },
                  { key: "articles", label: "Artikel", count: searchResults.articles.length },
                  { key: "events", label: "Agenda", count: searchResults.events.length },
                  { key: "collaborations", label: "Kolaborasi", count: searchResults.collaborations.length },
                ].map((tab) => (
                  <button
                    key={tab.key}
                    type="button"
                    onClick={() => setSearchTab(tab.key as SearchTab)}
                    className={cn(
                      "whitespace-nowrap rounded-[3px] px-3 py-1 text-xs font-bold uppercase tracking-wider transition-colors",
                      searchTab === tab.key
                        ? "bg-black text-white"
                        : "bg-white text-zinc-600 border border-zinc-200 hover:border-black hover:text-black"
                    )}
                  >
                    {tab.label} ({tab.count})
                  </button>
                ))}
              </div>
            )}

            {/* Results Body */}
            <div className="overflow-y-auto p-4 flex-1 space-y-4">
              {/* Initial / Empty Query State */}
              {!searchQuery.trim() && (
                <div className="py-6">
                  <p className="text-[11px] font-bold uppercase tracking-wider text-zinc-400 mb-3">
                    Kategori Populer
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {navItems.map((item) => (
                      <Link
                        key={item.name}
                        href={item.href}
                        onClick={() => setSearchOpen(false)}
                        className="rounded-[3px] border border-zinc-200 bg-zinc-50 px-3 py-1.5 text-xs font-medium text-zinc-700 hover:border-black hover:bg-black hover:text-white transition-colors"
                      >
                        {item.name}
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {/* Searching Skeleton / Indicator */}
              {isSearching && !searchResults && (
                <div className="py-12 flex flex-col items-center justify-center text-center text-zinc-400">
                  <Loader2 className="size-6 animate-spin mb-2" />
                  <p className="text-xs">Mencari di seluruh database...</p>
                </div>
              )}

              {/* Results List */}
              {searchResults && searchResults.totalCount > 0 && (
                <div className="space-y-6">
                  {/* Articles Section */}
                  {(searchTab === "all" || searchTab === "articles") && searchResults.articles.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        <Newspaper className="size-3.5" />
                        <span>Artikel ({searchResults.articles.length})</span>
                      </div>
                      <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-100 overflow-hidden bg-white">
                        {searchResults.articles.map((art) => (
                          <Link
                            key={art.id}
                            href={`/artikel/${art.slug}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-start gap-3 p-3 hover:bg-zinc-50 transition-colors group"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={art.coverImageUrl}
                              alt={art.title}
                              className="size-14 rounded object-cover shrink-0 bg-zinc-100"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="inline-block rounded-[2px] bg-black text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1">
                                {art.category}
                              </span>
                              <h4 className="font-sans text-xs sm:text-sm font-bold text-black group-hover:underline line-clamp-1 leading-snug">
                                {art.title}
                              </h4>
                              <p className="mt-0.5 font-serif text-[11px] text-zinc-500 line-clamp-1">
                                {art.excerpt}
                              </p>
                              <div className="mt-1 flex items-center gap-2 text-[10px] text-zinc-400">
                                <span>{art.publishedAtLabel}</span>
                                <span>•</span>
                                <span>{art.readingTime} min read</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Events Section */}
                  {(searchTab === "all" || searchTab === "events") && searchResults.events.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        <Ticket className="size-3.5" />
                        <span>Agenda ({searchResults.events.length})</span>
                      </div>
                      <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-100 overflow-hidden bg-white">
                        {searchResults.events.map((ev) => (
                          <Link
                            key={ev.id}
                            href={`/agenda/${ev.id}`}
                            onClick={() => setSearchOpen(false)}
                            className="flex items-start gap-3 p-3 hover:bg-zinc-50 transition-colors group"
                          >
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={ev.bannerUrl}
                              alt={ev.title}
                              className="size-14 rounded object-cover shrink-0 bg-zinc-100"
                            />
                            <div className="flex-1 min-w-0">
                              <span className="inline-block rounded-[2px] bg-black text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1">
                                {ev.category}
                              </span>
                              <h4 className="font-sans text-xs sm:text-sm font-bold text-black group-hover:underline line-clamp-1 leading-snug">
                                {ev.title}
                              </h4>
                              <div className="mt-1 flex items-center gap-3 text-[10px] text-zinc-500">
                                <span className="flex items-center gap-1">
                                  <CalendarDays className="size-3 text-zinc-400" />
                                  {ev.dateLabel}
                                </span>
                                <span className="truncate">{ev.location}</span>
                              </div>
                            </div>
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Collaboration Section */}
                  {(searchTab === "all" || searchTab === "collaborations") && searchResults.collaborations.length > 0 && (
                    <div className="space-y-2">
                      <div className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                        <ExternalLink className="size-3.5" />
                        <span>Kolaborasi ({searchResults.collaborations.length})</span>
                      </div>
                      <div className="divide-y divide-zinc-100 rounded-lg border border-zinc-100 overflow-hidden bg-white">
                        {searchResults.collaborations.map((col) => (
                          <a
                            key={col.id}
                            href={col.contentUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => setSearchOpen(false)}
                            className="flex items-start gap-3 p-3 hover:bg-zinc-50 transition-colors group"
                          >
                            {col.thumbnailUrl ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={col.thumbnailUrl}
                                alt={col.title}
                                className="size-14 rounded object-cover shrink-0 bg-zinc-900"
                              />
                            ) : (
                              <div className="size-14 rounded flex items-center justify-center bg-zinc-900 text-white shrink-0">
                                <ExternalLink className="size-5" />
                              </div>
                            )}
                            <div className="flex-1 min-w-0">
                              <span className="inline-block rounded-[2px] bg-black text-white px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider mb-1">
                                {col.platform}
                              </span>
                              <h4 className="font-sans text-xs sm:text-sm font-bold text-black group-hover:underline line-clamp-1 leading-snug">
                                {col.title}
                              </h4>
                              <p className="mt-0.5 text-[10px] text-zinc-400 truncate">
                                {col.contentUrl}
                              </p>
                            </div>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* No Results */}
              {searchResults && searchResults.totalCount === 0 && !isSearching && (
                <div className="py-12 flex flex-col items-center justify-center text-center">
                  <div className="mb-3 flex size-10 items-center justify-center rounded-full bg-zinc-100 text-zinc-400">
                    <Search className="size-5" />
                  </div>
                  <h4 className="font-sans text-sm font-bold text-black">
                    Tidak ada hasil ditemukan
                  </h4>
                  <p className="mt-1 font-serif text-xs text-zinc-500 max-w-sm">
                    Tidak ditemukan artikel, agenda, atau kolaborasi untuk kata kunci &ldquo;{searchQuery}&rdquo;.
                  </p>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="border-t border-zinc-200 bg-zinc-50 px-4 py-2.5 flex items-center justify-between text-[11px] text-zinc-500 shrink-0">
              <span>Tekan Enter untuk melihat semua hasil</span>
              {searchQuery.trim() && (
                <button
                  type="button"
                  onClick={handleSearchSubmit}
                  className="font-bold text-black hover:underline"
                >
                  Halaman Pencarian Penuh →
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  )
}
