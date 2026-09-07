"use client"

import { useEffect, useState } from "react"
import { useLocation } from "@/lib/navigation"

export function TopProgressBar() {
  const location = useLocation()
  const [isVisible, setIsVisible] = useState(false)
  const [progress, setProgress] = useState(0)

  // Selesai loading saat pathname atau searchParams berubah
  useEffect(() => {
    if (isVisible) {
      setProgress(100)
      const timer = setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
      }, 300)
      return () => clearTimeout(timer)
    }
  }, [location.pathname, location.search])

  useEffect(() => {
    let t1: NodeJS.Timeout
    let t2: NodeJS.Timeout

    const startProgress = () => {
      setIsVisible(true)
      setProgress(25)
      t1 = setTimeout(() => setProgress(65), 180)
      t2 = setTimeout(() => setProgress(88), 500)
    }

    const endProgress = () => {
      clearTimeout(t1)
      clearTimeout(t2)
      setProgress(100)
      setTimeout(() => {
        setIsVisible(false)
        setProgress(0)
      }, 250)
    }

    // Tangkap klik pada tautan internal aplikasi
    const handleDocumentClick = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a")
      if (
        anchor &&
        anchor.href &&
        anchor.href.startsWith(window.location.origin) &&
        !anchor.target &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        try {
          const url = new URL(anchor.href)
          if (
            url.pathname !== window.location.pathname ||
            url.search !== window.location.search
          ) {
            startProgress()
          }
        } catch {
          // ignore
        }
      }
    }

    window.addEventListener("click", handleDocumentClick, true)
    window.addEventListener("app:navigation-start", startProgress)
    window.addEventListener("app:navigation-end", endProgress)

    return () => {
      clearTimeout(t1)
      clearTimeout(t2)
      window.removeEventListener("click", handleDocumentClick, true)
      window.removeEventListener("app:navigation-start", startProgress)
      window.removeEventListener("app:navigation-end", endProgress)
    }
  }, [])

  if (!isVisible && progress === 0) return null

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] pointer-events-none h-0.5 sm:h-1 bg-transparent">
      <div
        className="h-full bg-palembang-red shadow-[0_0_10px_rgba(163,34,35,0.8)] transition-all duration-300 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
