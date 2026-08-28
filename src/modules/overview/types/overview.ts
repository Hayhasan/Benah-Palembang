export type OverviewFilterType = "daily" | "weekly" | "monthly"

export interface OverviewMetricItem {
  total: string
  growth: string
}

export interface OverviewChartPoint {
  name: string
  views: number
  interactions: number
}

export interface OverviewRecentContentItem {
  id: number
  type: "Article" | "Event"
  title: string
  status: "Request" | "Posted" | "Rejected" | "Takedown"
  timeAgo: string
}

export interface OverviewRecentLogItem {
  id: number
  user: string
  action: string
  module: string
  timeAgo: string
}

export interface OverviewData {
  periodType: OverviewFilterType
  periodLabel: string
  selectedMonth: string
  availableMonths: string[]
  metrics: {
    users: OverviewMetricItem
    articles: OverviewMetricItem
    events: OverviewMetricItem
    views: OverviewMetricItem
    clicks: OverviewMetricItem
    logs: OverviewMetricItem
  }
  chartData: OverviewChartPoint[]
  recentContents: OverviewRecentContentItem[]
  recentLogs: OverviewRecentLogItem[]
}
