"use client"

import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { Sun, Moon } from "lucide-react"
import { useTheme } from "@/components/theme-provider"

interface AuthPageShellProps {
  asideDescription: string
  children: ReactNode
}

export function AuthPageShell({
  asideDescription,
  children,
}: AuthPageShellProps) {
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background text-foreground px-6 py-24 sm:py-32 transition-colors duration-300">
      {/* Top action bar: Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md shadow-xs hover:bg-muted transition-all cursor-pointer"
        >
          {theme === "dark" ? (
            <Sun className="size-4 text-amber-400" />
          ) : (
            <Moon className="size-4 text-palembang-sage" />
          )}
        </button>
      </div>

      <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-border bg-card text-card-foreground shadow-2xl backdrop-blur-sm lg:grid-cols-2">
        <div className="relative hidden min-h-[600px] overflow-hidden bg-palembang-charcoal lg:block">
          <Image
            fill
            src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop"
            alt="Jembatan Ampera"
            sizes="50vw"
            className="size-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <Image
              src="/logo.png"
              alt="Benah Palembang"
              width={210}
              height={44}
              className="h-8 w-auto"
            />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">
              {asideDescription}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 text-foreground sm:p-14">
          <Link href="/" className="inline-block">
            <img
              src={theme === "light" ? "/logohitam.png" : "/logo.png"}
              alt="Benah Palembang"
              className="h-6 w-auto"
            />
          </Link>
          {children}
        </div>
      </div>
    </main>
  )
}
