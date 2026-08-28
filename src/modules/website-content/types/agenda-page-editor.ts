import type { AgendaPageData } from "./agenda-page"

export type AgendaPageEditorData = AgendaPageData

export type UpdateAgendaPageResult =
  | {
      success: true
      data: AgendaPageEditorData
      message: string
    }
  | {
      success: false
      message: string
      field?: string
    }
