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

function buildChartData(
  periodType: OverviewFilterType,
  totalViews: number,
  totalInteractions: number,
): OverviewChartPoint[] {
  if (periodType === "daily") {
    const baseViews = Math.max(totalViews, 100)
    const weights = [0.05, 0.03, 0.18, 0.32, 0.24, 0.18]

    return ["00:00", "04:00", "08:00", "12:00", "16:00", "20:00"].map(
      (name, index) => ({
        name,
        views: Math.round(baseViews * (weights[index] ?? 0)),
        interactions: Math.round(totalInteractions * (weights[index] ?? 0)),
      }),
    )
  }

  if (periodType === "weekly") {
    const weights = [0.12, 0.14, 0.16, 0.15, 0.18, 0.15, 0.1]

    return ["Senin", "Selasa", "Rabu", "Kamis", "Jumat", "Sabtu", "Minggu"].map(
      (name, index) => ({
        name,
        views: Math.round(totalViews * (weights[index] ?? 0)),
        interactions: Math.round(totalInteractions * (weights[index] ?? 0)),
      }),
    )
  }

  const weights = [0.22, 0.26, 0.28, 0.24]
  return ["Minggu 1", "Minggu 2", "Minggu 3", "Minggu 4"].map(
    (name, index) => ({
      name,
      views: Math.round(totalViews * (weights[index] ?? 0)),
      interactions: Math.round(totalInteractions * (weights[index] ?? 0)),
    }),
  )
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
      articleLikes,
      eventLikes,
      articleComments,
    ] = await Promise.all([
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
      prisma.articleLike.count({
        where: {
          article: {
            authorId: actor.id,
            status: "PUBLISHED",
            deletedAt: null,
          },
        },
      }),
      prisma.eventLike.count({
        where: {
          event: {
            ownerId: actor.id,
            status: "PUBLISHED",
            deletedAt: null,
          },
        },
      }),
      prisma.articleComment.count({
        where: {
          deletedAt: null,
          article: {
            authorId: actor.id,
            status: "PUBLISHED",
            deletedAt: null,
          },
        },
      }),
    ])

    const totalPublications = totalPublishedArticles + totalPublishedEvents
    const newPublications = newPublishedArticles + newPublishedEvents
    const totalViews =
      (articleViews._sum.views ?? 0) + (eventViews._sum.views ?? 0)
    const totalInteractions = articleLikes + eventLikes + articleComments

    return {
      audience: "CREATOR",
      viewerName: actor.name,
      periodType: period.periodType,
      periodLabel: period.periodLabel,
      selectedMonth: period.selectedMonth,
      availableMonths: period.availableMonths,
      metrics: {
        publications: {
          total: formatNumber(totalPublications),
          growth: `+${newPublications} publikasi baru`,
        },
        views: {
          total: formatCompactNumber(totalViews),
          growth: "Akumulasi pembaca konten Anda",
        },
      },
      chartData: buildChartData(
        period.periodType,
        totalViews,
        totalInteractions,
      ),
    }
  }

  const [
    totalUsers,
    newUsers,
    totalArticles,
    newArticles,
    totalEvents,
    newEvents,
    totalArticleRequests,
    totalEventRequests,
    pendingArticles,
    pendingEvents,
    articleViews,
    eventViews,
    articleLikes,
    eventLikes,
    articleComments,
    recentArticles,
    recentEvents,
  ] = await Promise.all([
    prisma.user.count({ where: { deletedAt: null } }),
    prisma.user.count({
      where: {
        deletedAt: null,
        createdAt: { gte: period.periodStart, lte: period.periodEnd },
      },
    }),
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
    prisma.article.count({
      where: { deletedAt: null, status: { notIn: ["DRAFT", "ARCHIVED"] } },
    }),
    prisma.event.count({
      where: { deletedAt: null, status: { notIn: ["DRAFT", "ARCHIVED"] } },
    }),
    prisma.article.count({
      where: { deletedAt: null, status: "PENDING_REVIEW" },
    }),
    prisma.event.count({
      where: { deletedAt: null, status: "PENDING_REVIEW" },
    }),
    prisma.article.aggregate({
      _sum: { views: true },
      where: { deletedAt: null },
    }),
    prisma.event.aggregate({
      _sum: { views: true },
      where: { deletedAt: null },
    }),
    prisma.articleLike.count(),
    prisma.eventLike.count(),
    prisma.articleComment.count({ where: { deletedAt: null } }),
    prisma.article.findMany({
      where: { deletedAt: null, status: { notIn: ["DRAFT", "ARCHIVED"] } },
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
      where: { deletedAt: null, status: { notIn: ["DRAFT", "ARCHIVED"] } },
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
  const totalInteractions = articleLikes + eventLikes + articleComments

  return {
    audience: "MANAGEMENT",
    viewerName: actor.name,
    periodType: period.periodType,
    periodLabel: period.periodLabel,
    selectedMonth: period.selectedMonth,
    availableMonths: period.availableMonths,
    metrics: {
      users: {
        total: formatNumber(totalUsers),
        growth: `+${newUsers} user baru`,
      },
      articles: {
        total: formatNumber(totalArticles),
        growth: `+${newArticles} artikel baru`,
      },
      events: {
        total: formatNumber(totalEvents),
        growth: `+${newEvents} agenda baru`,
      },
      requests: {
        total: formatNumber(totalArticleRequests + totalEventRequests),
        growth: `${pendingArticles + pendingEvents} menunggu review`,
      },
    },
    chartData: buildChartData(
      period.periodType,
      totalViews,
      totalInteractions,
    ),
    recentContents,
  }
}
