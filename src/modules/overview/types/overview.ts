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
  author: string
  status: "Request" | "Posted" | "Rejected" | "Takedown"
  timeAgo: string
}

interface OverviewBaseData {
  periodType: OverviewFilterType
  periodLabel: string
  selectedMonth: string
  availableMonths: string[]
  viewerName: string
  chartData: OverviewChartPoint[]
}

export interface ManagementOverviewData extends OverviewBaseData {
  audience: "MANAGEMENT"
  metrics: {
    users: OverviewMetricItem
    articles: OverviewMetricItem
    events: OverviewMetricItem
    requests: OverviewMetricItem
  }
  recentContents: OverviewRecentContentItem[]
}

export interface CreatorOverviewData extends OverviewBaseData {
  audience: "CREATOR"
  metrics: {
    publications: OverviewMetricItem
    views: OverviewMetricItem
  }
}

export type OverviewData = ManagementOverviewData | CreatorOverviewData
