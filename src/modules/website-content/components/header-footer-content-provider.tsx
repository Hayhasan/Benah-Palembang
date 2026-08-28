"use client"

import { createContext, useContext, type ReactNode } from "react"

import { DEFAULT_HEADER_FOOTER_CONTENT } from "../constants/default-header-footer-content"
import type { HeaderFooterContentData } from "../types/header-footer-content"

const HeaderFooterContentContext = createContext<HeaderFooterContentData>(
  DEFAULT_HEADER_FOOTER_CONTENT,
)

export function HeaderFooterContentProvider({
  data,
  children,
}: {
  data: HeaderFooterContentData
  children: ReactNode
}) {
  return (
    <HeaderFooterContentContext.Provider value={data}>
      {children}
    </HeaderFooterContentContext.Provider>
  )
}

export function useHeaderFooterContent() {
  return useContext(HeaderFooterContentContext)
}
