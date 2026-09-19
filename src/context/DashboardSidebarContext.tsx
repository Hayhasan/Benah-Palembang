"use client"

import * as React from "react"

interface DashboardSidebarContextType {
  collapsed: boolean
  setCollapsed: React.Dispatch<React.SetStateAction<boolean>>
  toggleCollapsed: () => void
}

const DashboardSidebarContext = React.createContext<DashboardSidebarContextType>({
  collapsed: false,
  setCollapsed: () => {},
  toggleCollapsed: () => {},
})

export function DashboardSidebarProvider({ children }: { children: React.ReactNode }) {
  const [collapsed, setCollapsed] = React.useState(false)

  const toggleCollapsed = React.useCallback(() => {
    setCollapsed((prev) => !prev)
  }, [])

  return (
    <DashboardSidebarContext.Provider value={{ collapsed, setCollapsed, toggleCollapsed }}>
      {children}
    </DashboardSidebarContext.Provider>
  )
}

export function useDashboardSidebar() {
  return React.useContext(DashboardSidebarContext)
}
