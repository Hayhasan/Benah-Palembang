"use client"

import type { ReactNode } from "react"
import { ThemeProvider } from "@/components/theme-provider"

/**
 * Padanan pohon provider yang dulu ada di `src/main.tsx` versi Vite.
 * `BrowserRouter` tidak diperlukan lagi — routing kini berbasis file.
 */
export function Providers({ children }: { children: ReactNode }) {
  return <ThemeProvider defaultTheme="dark">{children}</ThemeProvider>
}
