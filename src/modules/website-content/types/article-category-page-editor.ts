import type { ArticleCategoryPageData } from "./article-category-page"

export interface ArticleCategoryPageEditorSlide {
  id: number | null
  clientKey: string
  imageUrl: string
  imageAlt: string
  label: string
  title: string
  description: string
  photographerName?: string | null
  position: number
  isVisible: boolean
}

export interface ArticleCategoryPageEditorItem {
  id: number | null
  clientKey: string
  sectionKey: string
  heroSlides: ArticleCategoryPageEditorSlide[]
}

export interface ArticleCategoryPagesEditorData {
  key: "home"
  categories: ArticleCategoryPageEditorItem[]
}

export type UpdateArticleCategoryPagesResult =
  | {
      success: true
      data: ArticleCategoryPagesEditorData
      message: string
    }
  | {
      success: false
      message: string
      field?: string
    }
