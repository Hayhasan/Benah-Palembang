"use client"

import { Moon, Sun } from "lucide-react"

import { useTheme } from "@/components/theme-provider"
import { cn } from "@/lib/utils"

type ModeToggleProps = {
  className?: string
  showLabel?: boolean
}

export function ModeToggle({ className, showLabel = false }: ModeToggleProps) {
  const { toggleTheme } = useTheme()

  return (
    <button
      type="button"
      onClick={toggleTheme}
      aria-label="Ganti mode warna"
      title="Ganti mode warna"
      className={cn(
        "inline-flex items-center justify-center gap-3 rounded-full border border-border bg-background text-foreground transition-all duration-200 hover:bg-muted active:scale-95",
        className
      )}
    >
      <Moon className="size-4 shrink-0 text-palembang-sage dark:hidden" />
      <Sun className="hidden size-4 shrink-0 text-amber-400 dark:block" />
      {showLabel && (
        <span className="text-xs font-semibold">
          <span className="dark:hidden">Mode Gelap</span>
          <span className="hidden dark:inline">Mode Terang</span>
        </span>
      )}
    </button>
  )
}
