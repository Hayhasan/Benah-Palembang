"use client"

import { useEffect } from "react"
import { usePathname } from "next/navigation"

export function VisitTracker() {
  const pathname = usePathname()

  useEffect(() => {
    // Only track once per page load
    let tracked = false
    
    if (!tracked) {
      fetch("/api/track-visit", {
        method: "POST",
        // Keepalive ensures the request is not cancelled if the user navigates away quickly
        keepalive: true,
      }).catch(err => console.error("Failed to track visit", err))
      
      tracked = true
    }
  }, [pathname])

  return null
}
