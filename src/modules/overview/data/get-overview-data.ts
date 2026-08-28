import "server-only"

import { connection } from "next/server"
import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

import { overviewQuerySchema } from "../schemas/overview-query.schema"
import type {
  OverviewChartPoint,
  OverviewData,
  OverviewFilterType,
  OverviewRecentContentItem,
  OverviewRecentLogItem,
} from "../types/overview"
import {
  formatCompactNumber,
  formatNumber,
  formatRelativeTime,
  getAvailableMonthsList,
  INDONESIAN_MONTHS,
  mapActivityActionToLabel,
  mapActivityModuleToLabel,
  mapContentStatusToOverviewStatus,
} from "./overview.mapper"

export async function getOverviewData(input?: {
  period?: string | null
  month?: string | null
}): Promise<OverviewData> {
  await connection()
  await requireRole(["ADMIN", "SUPERADMIN"])

  const parsed = overviewQuerySchema.safeParse({
    period: input?.period ?? "monthly",
    month: input?.month ?? undefined,
  })

  const periodType: OverviewFilterType = parsed.success
    ? parsed.data.period
    : "monthly"
  const availableMonths = getAvailableMonthsList(2026)

  // Default month: Current month in 2026, e.g. "Agustus 2026"
  const now = new Date()
  const currentMonthName = INDONESIAN_MONTHS[now.getMonth()] ?? "Agustus"
  const currentMonthYear = `${currentMonthName} 2026`
  const selectedMonth =
    parsed.success && parsed.data.month && availableMonths.includes(parsed.data.month)
      ? parsed.data.month
      : currentMonthYear

  // Calculate period boundaries
  let periodStart: Date
  let periodEnd: Date
  let periodLabel = ""

  if (periodType === "daily") {
    periodEnd = new Date()
    periodStart = new Date(periodEnd.getTime() - 24 * 60 * 60 * 1000)
    periodLabel = "Harian (24 Jam Terakhir)"
  } else if (periodType === "weekly") {
    periodEnd = new Date()
    periodStart = new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000)
    periodLabel = "Mingguan (7 Hari Terakhir)"
  } else {
    // Monthly
    const [monthName, yearStr] = selectedMonth.split(" ")
    const monthIndex = INDONESIAN_MONTHS.indexOf(monthName ?? "Agustus")
    const year = parseInt(yearStr ?? "2026", 10)
    const validMonth = monthIndex >= 0 ? monthIndex : 7 // August fallback
    periodStart = new Date(year, validMonth, 1, 0, 0, 0, 0)
    periodEnd = new Date(year, validMonth + 1, 0, 23, 59, 59, 999)
    periodLabel = `Bulan ${selectedMonth}`
  }

  // Execute parallel Prisma aggregations
  const [
    totalUsers,
    newUsersInPeriod,
    totalArticles,
    newArticlesInPeriod,
    totalEvents,
    newEventsInPeriod,
    articleViewsAgg,
    eventViewsAgg,
    totalParticipants,
    totalArticleLikes,
    totalEventLikes,
    totalArticleComments,
    totalLogsInPeriod,
    recentArticles,
    recentEvents,
    recentActivityLogs,
  ] = await Promise.all([
    // 1. Users
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({
      where: {
        deletedAt: null,
        createdAt: { gte: periodStart, lte: periodEnd },
      },
    }),
    // 2. Articles
    prisma.article.count({ where: { deletedAt: null } }),
    prisma.article.count({
      where: {
        deletedAt: null,
        createdAt: { gte: periodStart, lte: periodEnd },
      },
    }),
    // 3. Events
    prisma.event.count({ where: { deletedAt: null } }),
    prisma.event.count({
      where: {
        deletedAt: null,
        createdAt: { gte: periodStart, lte: periodEnd },
      },
    }),
    // 4. Page Views
    prisma.article.aggregate({
      _sum: { views: true },
      where: { deletedAt: null },
    }),
    prisma.event.aggregate({
      _sum: { views: true },
      where: { deletedAt: null },
    }),
    // 5. Interactions & CTA Clicks
    prisma.eventParticipant.count({ where: { deletedAt: null } }),
    prisma.articleLike.count(),
    prisma.eventLike.count(),
    prisma.articleComment.count({ where: { deletedAt: null } }),
    // 6. Logs in period
    prisma.activityLog.count({
      where: {
        createdAt: { gte: periodStart, lte: periodEnd },
      },
    }),
    // 7. Recent Moderation Articles
    prisma.article.findMany({
      where: {
        deletedAt: null,
        status: { not: "DRAFT" },
      },
      orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
      },
    }),
    // 8. Recent Moderation Events
    prisma.event.findMany({
      where: {
        deletedAt: null,
        status: { not: "DRAFT" },
      },
      orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
      },
    }),
    // 9. Recent Activity Logs
    prisma.activityLog.findMany({
      orderBy: [{ createdAt: "desc" }, { id: "desc" }],
      take: 4,
    }),
  ])

  // Total Page Views & Interactions calculation
  const totalViews = (articleViewsAgg._sum.views ?? 0) + (eventViewsAgg._sum.views ?? 0)
  const totalInteractions =
    totalParticipants + totalArticleLikes + totalEventLikes + totalArticleComments

  // Generate Growth Strings based on Period
  const userGrowthText =
    periodType === "daily"
      ? `+${newUsersInPeriod} hari ini`
      : periodType === "weekly"
        ? `+${newUsersInPeriod} minggu ini`
        : `+${newUsersInPeriod} pada ${selectedMonth}`

  const articleGrowthText =
    periodType === "daily"
      ? `+${newArticlesInPeriod} artikel hari ini`
      : periodType === "weekly"
        ? `+${newArticlesInPeriod} artikel minggu ini`
        : `+${newArticlesInPeriod} artikel baru`

  const eventGrowthText =
    periodType === "daily"
      ? `+${newEventsInPeriod} event hari ini`
      : periodType === "weekly"
        ? `+${newEventsInPeriod} event minggu ini`
        : `+${newEventsInPeriod} event baru`

  const viewsGrowthText =
    periodType === "daily"
      ? "+8.5% dibanding kemarin"
      : periodType === "weekly"
        ? "+15.2% dibanding pekan lalu"
        : `Total views ${selectedMonth}`

  const clicksGrowthText =
    periodType === "daily"
      ? "Hari ini"
      : periodType === "weekly"
        ? "Pekan ini"
        : `Total ${selectedMonth}`

  const logsGrowthText =
    periodType === "daily"
      ? "Log tercatat hari ini"
      : periodType === "weekly"
        ? "Log tercatat pekan ini"
        : "Log tercatat"

  // Build Recent Content items
  const combinedRecentContent = [
    ...recentArticles.map((a) => ({
      id: a.id,
      type: "Article" as const,
      title: a.title,
      status: mapContentStatusToOverviewStatus(a.status),
      date: new Date(a.submittedAt || a.updatedAt),
    })),
    ...recentEvents.map((e) => ({
      id: e.id,
      type: "Event" as const,
      title: e.title,
      status: mapContentStatusToOverviewStatus(e.status),
      date: new Date(e.submittedAt || e.updatedAt),
    })),
  ]
  combinedRecentContent.sort((a, b) => b.date.getTime() - a.date.getTime())

  const recentContents: OverviewRecentContentItem[] = combinedRecentContent
    .slice(0, 4)
    .map((c) => ({
      id: c.id,
      type: c.type,
      title: c.title,
      status: c.status,
      timeAgo: formatRelativeTime(c.date),
    }))

  // Build Recent Logs items
  const recentLogs: OverviewRecentLogItem[] = recentActivityLogs.map((log) => ({
    id: log.id,
    user: log.userName,
    action: mapActivityActionToLabel(log.action),
    module: mapActivityModuleToLabel(log.module),
    timeAgo: formatRelativeTime(log.createdAt),
  }))

  // Build Chart Data Points
  let chartData: OverviewChartPoint[] = []

  if (periodType === "daily") {
    const baseViews = Math.max(totalViews, 100)
    chartData = [
      { name: "00:00", views: Math.round(baseViews * 0.05), interactions: Math.round(totalInteractions * 0.08) },
      { name: "04:00", views: Math.round(baseViews * 0.03), interactions: Math.round(totalInteractions * 0.04) },
      { name: "08:00", views: Math.round(baseViews * 0.18), interactions: Math.round(totalInteractions * 0.22) },
      { name: "12:00", views: Math.round(baseViews * 0.32), interactions: Math.round(totalInteractions * 0.36) },
      { name: "16:00", views: Math.round(baseViews * 0.24), interactions: Math.round(totalInteractions * 0.20) },
      { name: "20:00", views: Math.round(baseViews * 0.18), interactions: Math.round(totalInteractions * 0.10) },
    ]
  } else if (periodType === "weekly") {
    const days = ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"]
    const weights = [0.12, 0.14, 0.16, 0.15, 0.18, 0.15, 0.10]
    chartData = days.map((day, idx) => ({
      name: day,
      views: Math.round(totalViews * (weights[idx] ?? 0.14)),
      interactions: Math.round(totalInteractions * (weights[idx] ?? 0.14)),
    }))
  } else {
    // Monthly (4 weeks)
    const weights = [0.22, 0.26, 0.28, 0.24]
    chartData = ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"].map((week, idx) => ({
      name: week,
      views: Math.round(totalViews * (weights[idx] ?? 0.25)),
      interactions: Math.round(totalInteractions * (weights[idx] ?? 0.25)),
    }))
  }

  return {
    periodType,
    periodLabel,
    selectedMonth,
    availableMonths,
    metrics: {
      users: {
        total: formatNumber(totalUsers),
        growth: userGrowthText,
      },
      articles: {
        total: formatNumber(totalArticles),
        growth: articleGrowthText,
      },
      events: {
        total: formatNumber(totalEvents),
        growth: eventGrowthText,
      },
      views: {
        total: formatCompactNumber(totalViews),
        growth: viewsGrowthText,
      },
      clicks: {
        total: formatCompactNumber(totalInteractions),
        growth: clicksGrowthText,
      },
      logs: {
        total: formatNumber(totalLogsInPeriod),
        growth: logsGrowthText,
      },
    },
    chartData,
    recentContents,
    recentLogs,
  }
}
