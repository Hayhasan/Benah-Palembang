import type { ArticleCategoryPageData } from "./article-category-page"

export interface ArticleCategoryPageEditorItem {
  id: number | null
  clientKey: string
  sectionKey: string
  hero: ArticleCategoryPageData["hero"]
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
