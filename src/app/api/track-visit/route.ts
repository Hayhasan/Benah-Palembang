import { NextResponse } from "next/server"
import { prisma } from "@/lib/db/prisma"

export async function POST() {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0) // normalize to midnight

    const currentHour = new Date().getHours()

    await prisma.$transaction([
      prisma.dailyVisit.upsert({
        where: { date: today },
        update: { count: { increment: 1 } },
        create: { date: today, count: 1 },
      }),
      prisma.hourlyVisit.upsert({
        where: { date_hour: { date: today, hour: currentHour } },
        update: { count: { increment: 1 } },
        create: { date: today, hour: currentHour, count: 1 },
      }),
    ])

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[TRACK_VISIT_ERROR]", error)
    return new NextResponse("Internal Error", { status: 500 })
  }
}
