import "server-only"

import { connection } from "next/server"

import { prisma } from "@/lib/db/prisma"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

import { overviewQuerySchema } from "../schemas/overview-query.schema"
import type {
  OverviewChartPoint,
  OverviewData,
  OverviewFilterType,
  OverviewRecentContentItem,
} from "../types/overview"
import {
  formatCompactNumber,
  formatNumber,
  formatRelativeTime,
  getAvailableMonthsList,
  INDONESIAN_MONTHS,
  mapContentStatusToOverviewStatus,
} from "./overview.mapper"

function buildCreatorChartData(
  periodType: OverviewFilterType,
  dailyViews: { date: Date; count: number }[],
  periodStart: Date,
): OverviewChartPoint[] {
  if (periodType === "daily") {
    const todayCount = dailyViews[0]?.count ?? 0
    const weights = [0.05, 0.03, 0.18, 0.32, 0.24, 0.18]
    return ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map(
      (name, index) => ({
        name,
        views: Math.round(todayCount * (weights[index] ?? 0)),
        interactions: 0,
      })
    )
  }

  if (periodType === "weekly") {
    const points: OverviewChartPoint[] = []
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    for (let i = 0; i < 7; i++) {
      const d = new Date(periodStart)
      d.setDate(d.getDate() + i)
      const view = dailyViews.find(v => v.date.toDateString() === d.toDateString())
      points.push({
        name: days[d.getDay()] ?? "",
        views: view?.count ?? 0,
        interactions: 0,
      })
    }
    return points
  }

  const points: OverviewChartPoint[] = [
    { name: "Minggu 1", views: 0, interactions: 0 },
    { name: "Minggu 2", views: 0, interactions: 0 },
    { name: "Minggu 3", views: 0, interactions: 0 },
    { name: "Minggu 4", views: 0, interactions: 0 },
  ]
  
  dailyViews.forEach(v => {
    const date = v.date.getDate()
    if (date <= 7) points[0].views += v.count
    else if (date <= 14) points[1].views += v.count
    else if (date <= 21) points[2].views += v.count
    else points[3].views += v.count
  })
  
  return points
}

function buildRealChartData(
  periodType: OverviewFilterType,
  dailyVisits: { date: Date; count: number }[],
  hourlyVisits: { hour: number; count: number }[],
  periodStart: Date,
): OverviewChartPoint[] {
  if (periodType === "daily") {
    return [
      { name: "00:00", hours: [0, 1, 2, 3] },
      { name: "04:00", hours: [4, 5, 6, 7] },
      { name: "08:00", hours: [8, 9, 10, 11] },
      { name: "12:00", hours: [12, 13, 14, 15] },
      { name: "16:00", hours: [16, 17, 18, 19] },
      { name: "20:00", hours: [20, 21, 22, 23] },
    ].map(group => {
      const views = hourlyVisits
        .filter(v => group.hours.includes(v.hour))
        .reduce((sum, v) => sum + v.count, 0)
      return {
        name: group.name,
        views,
        interactions: 0,
      }
    })
  }

  if (periodType === "weekly") {
    const points: OverviewChartPoint[] = []
    const days = ["Minggu", "Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu"]
    for (let i = 0; i < 7; i++) {
      const d = new Date(periodStart)
      d.setDate(d.getDate() + i)
      const visit = dailyVisits.find(v => v.date.toDateString() === d.toDateString())
      points.push({
        name: days[d.getDay()] ?? "",
        views: visit?.count ?? 0,
        interactions: 0,
      })
    }
    return points
  }

  const points: OverviewChartPoint[] = [
    { name: "Minggu 1", views: 0, interactions: 0 },
    { name: "Minggu 2", views: 0, interactions: 0 },
    { name: "Minggu 3", views: 0, interactions: 0 },
    { name: "Minggu 4", views: 0, interactions: 0 },
  ]
  
  dailyVisits.forEach(v => {
    const date = v.date.getDate()
    if (date <= 7) points[0].views += v.count
    else if (date <= 14) points[1].views += v.count
    else if (date <= 21) points[2].views += v.count
    else points[3].views += v.count
  })
  
  return points
}

function getPeriodConfig(input?: {
  period?: string | null
  month?: string | null
}) {
  const parsed = overviewQuerySchema.safeParse({
    period: input?.period ?? "monthly",
    month: input?.month ?? undefined,
  })
  const periodType: OverviewFilterType = parsed.success
    ? parsed.data.period
    : "monthly"
  const availableMonths = getAvailableMonthsList(2026)
  const now = new Date()
  const currentMonthName = INDONESIAN_MONTHS[now.getMonth()] ?? "Agustus"
  const currentMonthYear = `${currentMonthName} 2026`
  const selectedMonth =
    parsed.success &&
    parsed.data.month &&
    availableMonths.includes(parsed.data.month)
      ? parsed.data.month
      : currentMonthYear

  if (periodType === "daily") {
    const periodEnd = new Date()
    return {
      periodType,
      periodLabel: "Hari Ini",
      selectedMonth,
      availableMonths,
      periodStart: new Date(periodEnd.getTime() - 24 * 60 * 60 * 1000),
      periodEnd,
    }
  }

  if (periodType === "weekly") {
    const periodEnd = new Date()
    return {
      periodType,
      periodLabel: "7 Hari Terakhir",
      selectedMonth,
      availableMonths,
      periodStart: new Date(periodEnd.getTime() - 7 * 24 * 60 * 60 * 1000),
      periodEnd,
    }
  }

  const [monthName, yearValue] = selectedMonth.split(" ")
  const monthIndex = INDONESIAN_MONTHS.indexOf(monthName ?? "Agustus")
  const year = Number.parseInt(yearValue ?? "2026", 10)
  const validMonth = monthIndex >= 0 ? monthIndex : 7

  return {
    periodType,
    periodLabel: selectedMonth,
    selectedMonth,
    availableMonths,
    periodStart: new Date(year, validMonth, 1, 0, 0, 0, 0),
    periodEnd: new Date(year, validMonth + 1, 0, 23, 59, 59, 999),
  }
}

export async function getOverviewData(input?: {
  period?: string | null
  month?: string | null
}): Promise<OverviewData> {
  await connection()
  const actor = await requireCurrentUser()
  const period = getPeriodConfig(input)

  if (actor.role === "USER") {
    const [
      totalPublishedArticles,
      totalPublishedEvents,
      newPublishedArticles,
      newPublishedEvents,
      articleViews,
      eventViews,
      articleDailyViews,
      eventDailyViews,    ] = await Promise.all([
      prisma.article.count({
        where: { authorId: actor.id, status: "PUBLISHED", deletedAt: null },
      }),
      prisma.event.count({
        where: { ownerId: actor.id, status: "PUBLISHED", deletedAt: null },
      }),
      prisma.article.count({
        where: {
          authorId: actor.id,
          status: "PUBLISHED",
          deletedAt: null,
          publishedAt: { gte: period.periodStart, lte: period.periodEnd },
        },
      }),
      prisma.event.count({
        where: {
          ownerId: actor.id,
          status: "PUBLISHED",
          deletedAt: null,
          publishedAt: { gte: period.periodStart, lte: period.periodEnd },
        },
      }),
      prisma.article.aggregate({
        _sum: { views: true },
        where: { authorId: actor.id, status: "PUBLISHED", deletedAt: null },
      }),
      prisma.event.aggregate({
        _sum: { views: true },
        where: { ownerId: actor.id, status: "PUBLISHED", deletedAt: null },
      }),
      prisma.articleDailyView.groupBy({
        by: ["date"],
        _sum: { count: true },
        where: {
          date: { gte: period.periodStart, lte: period.periodEnd },
          article: { authorId: actor.id, status: "PUBLISHED", deletedAt: null },
        },
      }),
      prisma.eventDailyView.groupBy({
        by: ["date"],
        _sum: { count: true },
        where: {
          date: { gte: period.periodStart, lte: period.periodEnd },
          event: { ownerId: actor.id, status: "PUBLISHED", deletedAt: null },
        },
      }),
    ])

    const totalPublications = totalPublishedArticles + totalPublishedEvents
    const newPublications = newPublishedArticles + newPublishedEvents
    const totalViews = (articleViews._sum.views ?? 0) + (eventViews._sum.views ?? 0)
    const totalInteractions = 0
    const dailyViewsMap = new Map<string, number>()
    
    articleDailyViews.forEach(v => {
      const key = v.date.toDateString()
      dailyViewsMap.set(key, (dailyViewsMap.get(key) ?? 0) + (v._sum.count ?? 0))
    })
    
    eventDailyViews.forEach(v => {
      const key = v.date.toDateString()
      dailyViewsMap.set(key, (dailyViewsMap.get(key) ?? 0) + (v._sum.count ?? 0))
    })

    const dailyViews = Array.from(dailyViewsMap.entries()).map(([dateStr, count]) => ({
      date: new Date(dateStr),
      count,
    }))

    return {
      audience: "CREATOR",
      viewerName: actor.name,
      periodType: period.periodType,
      periodLabel: period.periodLabel,
      selectedMonth: period.selectedMonth,
      availableMonths: period.availableMonths,
      metrics: {
        publications: {
          total: formatNumber(newPublications),
          growth: `Dari total ${totalPublications} publikasi`,
        },
        views: {
          total: formatCompactNumber(totalViews),
          growth: "Total akumulasi pembaca",
        },
      },
      chartData: buildCreatorChartData(
        period.periodType,
        dailyViews,
        period.periodStart,
      ),
    }
  }

  const [
    totalArticles,
    newArticles,
    totalEvents,
    newEvents,
    totalCollaborationPartners,
    articleViews,
    eventViews,

    recentArticles,
    recentEvents,
    dailyVisits,
    hourlyVisits,
  ] = await Promise.all([
    prisma.article.count({ where: { deletedAt: null } }),
    prisma.article.count({
      where: {
        deletedAt: null,
        createdAt: { gte: period.periodStart, lte: period.periodEnd },
      },
    }),
    prisma.event.count({ where: { deletedAt: null } }),
    prisma.event.count({
      where: {
        deletedAt: null,
        createdAt: { gte: period.periodStart, lte: period.periodEnd },
      },
    }),
    prisma.websiteCollaborationPartnerLogo.count({
      where: { deletedAt: null },
    }),
    prisma.article.aggregate({
      _sum: { views: true },
      where: { deletedAt: null },
    }),
    prisma.event.aggregate({
      _sum: { views: true },
      where: { deletedAt: null },
    }),

    prisma.article.findMany({
      where: { 
        deletedAt: null, 
        status: { notIn: ["DRAFT", "ARCHIVED"] },
        createdAt: { gte: period.periodStart, lte: period.periodEnd }
      },
      orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
        author: { select: { name: true } },
      },
    }),
    prisma.event.findMany({
      where: { 
        deletedAt: null, 
        status: { notIn: ["DRAFT", "ARCHIVED"] },
        createdAt: { gte: period.periodStart, lte: period.periodEnd }
      },
      orderBy: [{ submittedAt: "desc" }, { updatedAt: "desc" }],
      take: 5,
      select: {
        id: true,
        title: true,
        status: true,
        submittedAt: true,
        updatedAt: true,
        owner: { select: { name: true } },
      },
    }),

    prisma.dailyVisit.findMany({
      where: {
        date: { gte: period.periodStart, lte: period.periodEnd },
      },
    }) as Promise<{ date: Date; count: number }[]>,

    prisma.hourlyVisit.findMany({
      where: {
        date: { gte: period.periodStart, lte: period.periodEnd },
      },
    }) as Promise<{ hour: number; count: number }[]>,
  ])

  const combinedRecentContent = [
    ...recentArticles.map((article) => ({
      id: article.id,
      type: "Article" as const,
      title: article.title,
      author: article.author.name,
      status: mapContentStatusToOverviewStatus(article.status),
      date: article.submittedAt ?? article.updatedAt,
    })),
    ...recentEvents.map((event) => ({
      id: event.id,
      type: "Event" as const,
      title: event.title,
      author: event.owner.name,
      status: mapContentStatusToOverviewStatus(event.status),
      date: event.submittedAt ?? event.updatedAt,
    })),
  ].sort((first, second) => second.date.getTime() - first.date.getTime())

  const recentContents: OverviewRecentContentItem[] = combinedRecentContent
    .slice(0, 5)
    .map((content) => ({
      id: content.id,
      type: content.type,
      title: content.title,
      author: content.author,
      status: content.status,
      timeAgo: formatRelativeTime(content.date),
    }))
  const totalViews =
    (articleViews._sum.views ?? 0) + (eventViews._sum.views ?? 0)
  const totalVisitsInPeriod = dailyVisits.reduce((acc, curr) => acc + curr.count, 0)
  const totalInteractions = 0

  return {
    audience: "MANAGEMENT",
    viewerName: actor.name,
    periodType: period.periodType,
    periodLabel: period.periodLabel,
    selectedMonth: period.selectedMonth,
    availableMonths: period.availableMonths,
    metrics: {
      visits: {
        total: formatNumber(totalVisitsInPeriod),
        growth: "Total kunjungan pada periode ini",
      },
      articles: {
        total: formatNumber(newArticles),
        growth: `Dari total ${totalArticles} artikel`,
      },
      events: {
        total: formatNumber(newEvents),
        growth: `Dari total ${totalEvents} agenda`,
      },
      collaborations: {
        total: formatNumber(totalCollaborationPartners),
        growth: "Total aktif saat ini",
      },
    },
    chartData: buildRealChartData(
      period.periodType,
      dailyVisits,
      hourlyVisits,
      period.periodStart,
    ),
    recentContents,
  }
}
