"use client"

import {
  CalendarDays,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  LayoutList,
  MapPin,
  Ticket,
} from "lucide-react"
import { useMemo, useState } from "react"

import { id } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
  getIndonesianHoliday,
  getMonthHolidays,
} from "@/lib/indonesian-holidays"
import { cn } from "@/lib/utils"

import type { PublicEventListItem } from "../types/public-event"

const EVENT_TIME_ZONE = "Asia/Jakarta"

const MONTH_NAMES = [
  "Januari",
  "Februari",
  "Maret",
  "April",
  "Mei",
  "Juni",
  "Juli",
  "Agustus",
  "September",
  "Oktober",
  "November",
  "Desember",
]

const dateKeyFormatter = new Intl.DateTimeFormat("en-CA", {
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
  timeZone: EVENT_TIME_ZONE,
})

const datePartFormatter = new Intl.DateTimeFormat("en-US", {
  month: "numeric",
  timeZone: EVENT_TIME_ZONE,
  year: "numeric",
})

export function getDateKey(date: Date): string {
  return dateKeyFormatter.format(date)
}

function getMonthKey(date: Date): string {
  const parts = datePartFormatter.formatToParts(date)
  const month = parts.find((part) => part.type === "month")?.value
  const year = parts.find((part) => part.type === "year")?.value

  return `${year}-${month}`
}

function getWeekRange(now: Date): { start: Date; end: Date } {
  const current = new Date(now)
  const day = current.getDay()
  const diffToMonday = day === 0 ? -6 : 1 - day

  const monday = new Date(current)
  monday.setDate(current.getDate() + diffToMonday)
  monday.setHours(0, 0, 0, 0)

  const sunday = new Date(monday)
  sunday.setDate(monday.getDate() + 6)
  sunday.setHours(23, 59, 59, 999)

  return { start: monday, end: sunday }
}

export function getEventDateKeys(event: PublicEventListItem): string[] {
  const keys: string[] = []
  const start = new Date(event.startsAt)
  const end = event.endsAt ? new Date(event.endsAt) : start
  const current = new Date(start)
  current.setHours(0, 0, 0, 0)

  const endDay = new Date(end)
  endDay.setHours(23, 59, 59, 999)

  while (current <= endDay) {
    keys.push(getDateKey(current))
    current.setDate(current.getDate() + 1)
  }

  return keys
}

type ListFilter = "this-week" | "this-month" | "upcoming" | "past"

interface AgendaCalendarProps {
  events: PublicEventListItem[]
  selectedDate?: Date
  onSelectDate?: (date: Date | undefined) => void
  selectedEventId?: number | null
  onSelectEvent?: (event: PublicEventListItem) => void
}

export function AgendaCalendar({
  events,
  selectedDate,
  onSelectDate,
  selectedEventId,
  onSelectEvent,
}: AgendaCalendarProps) {
  const [viewMode, setViewMode] = useState<"calendar" | "list">("calendar")
  const [listFilter, setListFilter] = useState<ListFilter>("this-week")
  const [currentMonth, setCurrentMonth] = useState<Date>(new Date())
  const [showMonthPicker, setShowMonthPicker] = useState(false)
  const [pickerYearOverride, setPickerYearOverride] = useState<number | null>(null)
  const pickerYear = pickerYearOverride ?? currentMonth.getFullYear()

  // Build map of dateKey → events
  const eventsByDate = useMemo(() => {
    const map = new Map<string, PublicEventListItem[]>()
    for (const event of events) {
      const keys = getEventDateKeys(event)
      for (const key of keys) {
        const existing = map.get(key) || []
        existing.push(event)
        map.set(key, existing)
      }
    }
    return map
  }, [events])

  // Custom matcher: returns true if date has any event
  const hasEventMatcher = useMemo(() => {
    return (date: Date) => eventsByDate.has(getDateKey(date))
  }, [eventsByDate])

  const now = useMemo(() => new Date(), [])
  const nowTime = now.getTime()
  const { start: weekStart, end: weekEnd } = useMemo(
    () => getWeekRange(now),
    [now]
  )

  // Hari Libur & Hari Besar pada bulan yang sedang dilihat di kalender
  const currentMonthHolidays = useMemo(() => {
    return getMonthHolidays(
      currentMonth.getFullYear(),
      currentMonth.getMonth()
    )
  }, [currentMonth])

  const handlePrevMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1)
    )
  }

  const handleNextMonth = () => {
    setCurrentMonth(
      new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1)
    )
  }

  // Events for List View filtered by This Week, This Month, Upcoming, Past Event
  // Sorted from nearest to farthest
  const sortedListEvents = useMemo(() => {
    const currentMonthKey = getMonthKey(now)

    return events
      .filter((event) => {
        const startsAt = new Date(event.startsAt)
        const endsAt = new Date(event.endsAt ?? event.startsAt)

        if (listFilter === "this-week") {
          return (
            startsAt.getTime() <= weekEnd.getTime() &&
            endsAt.getTime() >= weekStart.getTime()
          )
        }

        if (listFilter === "this-month") {
          return getMonthKey(startsAt) === currentMonthKey
        }

        if (listFilter === "upcoming") {
          return endsAt.getTime() >= nowTime
        }

        return endsAt.getTime() < nowTime
      })
      .sort((first, second) => {
        const difference =
          new Date(first.startsAt).getTime() - new Date(second.startsAt).getTime()

        return listFilter === "past" ? -difference : difference
      })
  }, [events, listFilter, now, nowTime, weekStart, weekEnd])

  return (
    <div className="sticky top-28">
      <div className="rounded-none border border-zinc-200 bg-white overflow-hidden shadow-xs">
        {/* Section Header with Calendar & List View Toggle Icons */}
        <div className="flex items-center justify-between border-b border-zinc-200 px-4 py-3 bg-zinc-50/70">
          <h3 className="font-sans text-xs font-bold uppercase tracking-[0.14em] text-black">
            {viewMode === "calendar" ? "Kalender Agenda" : "Daftar Agenda"}
          </h3>

          {/* 2 View Toggle Icons */}
          <div className="flex items-center gap-1 bg-zinc-200/80 p-0.5 rounded border border-zinc-300">
            <button
              type="button"
              onClick={() => setViewMode("calendar")}
              className={cn(
                "flex size-7 items-center justify-center rounded transition-all cursor-pointer",
                viewMode === "calendar"
                  ? "bg-black text-white shadow-xs"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-100"
              )}
              title="Calendar View"
              aria-label="Tampilan Kalender"
            >
              <CalendarDays className="size-3.5" />
            </button>
            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={cn(
                "flex size-7 items-center justify-center rounded transition-all cursor-pointer",
                viewMode === "list"
                  ? "bg-black text-white shadow-xs"
                  : "text-zinc-600 hover:text-black hover:bg-zinc-100"
              )}
              title="List View"
              aria-label="Tampilan Daftar"
            >
              <LayoutList className="size-3.5" />
            </button>
          </div>
        </div>

        {/* 1. CALENDAR VIEW */}
        {viewMode === "calendar" && (
          <div className="flex flex-col items-center">
            {/* Header: Prev Button, Month & Year Picker Trigger, Next Button (SEJAJAR DENGAN BULAN) */}
            <div className="w-full flex items-center justify-between px-3 py-2.5 border-b border-zinc-100 bg-white">
              <button
                type="button"
                onClick={handlePrevMonth}
                className="flex size-7 items-center justify-center rounded hover:bg-zinc-100 text-zinc-700 hover:text-black transition-colors cursor-pointer"
                title="Bulan sebelumnya"
                aria-label="Bulan sebelumnya"
              >
                <ChevronLeft className="size-4" />
              </button>

              <button
                type="button"
                onClick={() => {
                  setPickerYearOverride(null)
                  setShowMonthPicker(!showMonthPicker)
                }}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1 rounded transition-colors text-xs font-bold uppercase tracking-wider cursor-pointer group",
                  showMonthPicker
                    ? "bg-black text-white shadow-xs"
                    : "text-black hover:bg-zinc-100"
                )}
                title="Klik untuk memilih bulan & tahun"
              >
                <span>
                  {currentMonth.toLocaleDateString("id-ID", {
                    month: "long",
                    year: "numeric",
                    timeZone: EVENT_TIME_ZONE,
                  })}
                </span>
                <ChevronDown
                  className={cn(
                    "size-3 transition-transform duration-200",
                    showMonthPicker && "rotate-180"
                  )}
                />
              </button>

              <button
                type="button"
                onClick={handleNextMonth}
                className="flex size-7 items-center justify-center rounded hover:bg-zinc-100 text-zinc-700 hover:text-black transition-colors cursor-pointer"
                title="Bulan berikutnya"
                aria-label="Bulan berikutnya"
              >
                <ChevronRight className="size-4" />
              </button>
            </div>

            {/* If Month & Year Picker is open */}
            {showMonthPicker ? (
              <div className="w-full p-4 animate-in fade-in zoom-in-95 duration-150">
                {/* Year Switcher */}
                <div className="flex items-center justify-between mb-3 px-2 py-1.5 bg-zinc-50 rounded border border-zinc-200">
                  <button
                    type="button"
                    onClick={() => setPickerYearOverride(pickerYear - 1)}
                    className="flex size-7 items-center justify-center rounded hover:bg-zinc-200 text-zinc-700 hover:text-black transition-colors cursor-pointer"
                    aria-label="Tahun sebelumnya"
                  >
                    <ChevronLeft className="size-4" />
                  </button>
                  <span className="font-extrabold text-sm text-black tracking-tight">
                    {pickerYear}
                  </span>
                  <button
                    type="button"
                    onClick={() => setPickerYearOverride(pickerYear + 1)}
                    className="flex size-7 items-center justify-center rounded hover:bg-zinc-200 text-zinc-700 hover:text-black transition-colors cursor-pointer"
                    aria-label="Tahun berikutnya"
                  >
                    <ChevronRight className="size-4" />
                  </button>
                </div>

                {/* 12 Months Grid */}
                <div className="grid grid-cols-3 gap-2">
                  {MONTH_NAMES.map((monthName, idx) => {
                    const isCurrent =
                      currentMonth.getFullYear() === pickerYear &&
                      currentMonth.getMonth() === idx
                    const isTodayMonth =
                      now.getFullYear() === pickerYear &&
                      now.getMonth() === idx

                    return (
                      <button
                        key={monthName}
                        type="button"
                        onClick={() => {
                          const next = new Date(pickerYear, idx, 1)
                          setCurrentMonth(next)
                          setPickerYearOverride(null)
                          setShowMonthPicker(false)
                        }}
                        className={cn(
                          "py-2 px-1 text-xs font-semibold rounded transition-all cursor-pointer relative",
                          isCurrent
                            ? "bg-black text-white font-bold shadow-xs"
                            : isTodayMonth
                            ? "bg-zinc-100 text-black font-bold border border-zinc-300 hover:bg-zinc-200"
                            : "text-zinc-700 hover:bg-zinc-100 hover:text-black"
                        )}
                      >
                        {monthName}
                      </button>
                    )
                  })}
                </div>

                {/* Quick Action: Bulan Ini & Tutup */}
                <div className="flex items-center justify-between mt-4 pt-3 border-t border-zinc-100 text-[11px]">
                  <button
                    type="button"
                    onClick={() => {
                      const today = new Date()
                      setCurrentMonth(today)
                      setPickerYearOverride(null)
                      setShowMonthPicker(false)
                    }}
                    className="font-bold text-zinc-600 hover:text-black underline cursor-pointer"
                  >
                    Bulan Ini
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setPickerYearOverride(null)
                      setShowMonthPicker(false)
                    }}
                    className="font-bold text-zinc-500 hover:text-black cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            ) : (
              /* Days Grid Component */
              <div className="w-full flex justify-center items-center p-3">
                <Calendar
                  mode="single"
                  locale={id}
                  selected={selectedDate}
                  onSelect={(d) => {
                    onSelectDate?.(d)
                  }}
                  month={currentMonth}
                  onMonthChange={setCurrentMonth}
                  modifiers={{
                    hasEvent: hasEventMatcher,
                    isHoliday: (date) => {
                      const h = getIndonesianHoliday(date)
                      return h?.isHoliday === true
                    },
                    isSunday: (date) => date.getDay() === 0,
                    isObservance: (date) => {
                      const h = getIndonesianHoliday(date)
                      return Boolean(h && !h.isHoliday)
                    },
                  }}
                  modifiersClassNames={{
                    hasEvent: "has-agenda-event",
                  }}
                  className="mx-auto flex justify-center items-center !p-0"
                  classNames={{
                    root: "mx-auto w-fit flex justify-center",
                    months: "mx-auto flex justify-center",
                    month: "mx-auto flex flex-col items-center justify-center !gap-2",
                    table: "mx-auto border-collapse",
                    nav: "hidden", // Using aligned custom header above
                    month_caption: "hidden", // Using aligned custom header above
                    weekdays: "flex justify-center",
                    weekday:
                      "flex-1 text-[0.8rem] font-medium text-muted-foreground select-none first:text-red-600 first:font-bold",
                    week: "flex justify-center mt-1.5",
                  }}
                />
              </div>
            )}

            {/* Legend */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-1.5 w-full px-4 py-2 text-[10px] text-zinc-500 border-b border-zinc-100 bg-zinc-50/50">
              <span className="flex items-center gap-1.5">
                <span className="inline-flex size-3.5 items-center justify-center rounded-full bg-black text-[8px] font-bold text-white leading-none">
                  •
                </span>
                Agenda
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-flex size-2 rounded-full bg-red-600" />
                <span className="text-red-600 font-semibold">Libur / Minggu</span>
              </span>
              <span className="flex items-center gap-1.5">
                <span className="inline-flex size-2 rounded-full bg-blue-600" />
                <span className="text-zinc-700">Hari Besar</span>
              </span>
            </div>

            {/* Daftar Hari Libur & Hari Besar Bulan Ini */}
            {currentMonthHolidays.length > 0 && (
              <div className="w-full p-3 bg-zinc-50/40">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[11px] font-bold text-zinc-700 uppercase tracking-wider">
                    Hari Libur & Besar Bulan Ini
                  </span>
                  <span className="text-[10px] px-1.5 py-0.5 rounded bg-zinc-200/80 text-zinc-600 font-semibold">
                    {currentMonthHolidays.length} Hari
                  </span>
                </div>
                <div className="flex flex-col gap-1.5 max-h-48 overflow-y-auto pr-1">
                  {currentMonthHolidays.map((item) => {
                    const isSelected =
                      selectedDate &&
                      getDateKey(selectedDate) === item.dateKey

                    return (
                      <button
                        key={`${item.dateKey}-${item.name}`}
                        type="button"
                        onClick={() => {
                          const dateObj = new Date(
                            currentMonth.getFullYear(),
                            currentMonth.getMonth(),
                            item.day,
                            12,
                            0,
                            0
                          )
                          onSelectDate?.(dateObj)
                        }}
                        className={cn(
                          "w-full flex items-center justify-between gap-2 p-2 rounded text-left transition-all cursor-pointer border",
                          isSelected
                            ? "bg-zinc-100 border-zinc-400 shadow-xs"
                            : "bg-white border-zinc-200 hover:border-zinc-300 hover:bg-zinc-50/80"
                        )}
                        title={`Klik untuk melihat tanggal ${item.day} ${MONTH_NAMES[currentMonth.getMonth()]}`}
                      >
                        <div className="flex items-center gap-2 min-w-0">
                          <span
                            className={cn(
                              "inline-flex shrink-0 items-center justify-center text-[10px] font-bold px-1.5 py-0.5 rounded min-w-8 text-center",
                              item.isHoliday
                                ? "bg-red-100 text-red-700 font-bold"
                                : "bg-blue-50 text-blue-700 font-semibold"
                            )}
                          >
                            {item.day} {MONTH_NAMES[currentMonth.getMonth()].slice(0, 3)}
                          </span>
                          <span className="text-xs text-zinc-800 font-medium truncate">
                            {item.name}
                          </span>
                        </div>
                        <span
                          className={cn(
                            "shrink-0 text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded",
                            item.isHoliday
                              ? "bg-red-600 text-white"
                              : "bg-blue-100 text-blue-700"
                          )}
                        >
                          {item.isHoliday ? "Libur" : "Hari Besar"}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 2. LIST VIEW: This Week, This Month, Upcoming, Past Event */}
        {viewMode === "list" && (
          <div>
            {/* Filter Sub-header with This Week, This Month, Upcoming, Past Event */}
            <div className="flex flex-col gap-2 p-3 bg-zinc-50 border-b border-zinc-200">
              <div className="flex items-center justify-between text-[10px]">
                <span className="text-[10px] text-zinc-500 font-medium">
                  {sortedListEvents.length} Agenda
                </span>
              </div>
              <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
                {[
                  ["this-week", "This Week"],
                  ["this-month", "This Month"],
                  ["upcoming", "Upcoming"],
                  ["past", "Past Event"],
                ].map(([val, label]) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setListFilter(val as ListFilter)}
                    className={cn(
                      "whitespace-nowrap rounded-[3px] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider transition-all border cursor-pointer",
                      listFilter === val
                        ? "bg-black text-white border-black shadow-xs"
                        : "bg-white text-zinc-700 border-zinc-200 hover:bg-zinc-100"
                    )}
                  >
                    {label}
                  </button>
                ))}
              </div>
            </div>

            {/* List View Items: Click to preview in section kiri */}
            <div className="divide-y divide-zinc-100 max-h-[520px] overflow-y-auto">
              {sortedListEvents.length > 0 ? (
                sortedListEvents.map((event) => {
                  const startsAt = new Date(event.startsAt)
                  const endsAt = new Date(event.endsAt ?? event.startsAt)
                  const isPast = endsAt.getTime() < nowTime
                  const isOngoing =
                    startsAt.getTime() <= nowTime && endsAt.getTime() >= nowTime
                  const isSelected = selectedEventId === event.id

                  return (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => onSelectEvent?.(event)}
                      className={cn(
                        "w-full text-left group flex gap-3 p-3.5 transition-all cursor-pointer border-l-2",
                        isSelected
                          ? "bg-zinc-100 border-black ring-1 ring-zinc-300"
                          : "hover:bg-zinc-50 border-transparent"
                      )}
                    >
                      {/* Left: Date Badge */}
                      <div
                        className={cn(
                          "flex flex-col items-center justify-center shrink-0 w-11 h-13 rounded border text-center p-1 transition-colors",
                          isSelected
                            ? "bg-black text-white border-black"
                            : "bg-zinc-100 border-zinc-200 text-black group-hover:border-black"
                        )}
                      >
                        <span
                          className={cn(
                            "text-[9px] font-bold uppercase tracking-wider leading-none",
                            isSelected ? "text-white/80" : "text-black/60"
                          )}
                        >
                          {startsAt.toLocaleDateString("id-ID", {
                            month: "short",
                            timeZone: EVENT_TIME_ZONE,
                          })}
                        </span>
                        <span className="text-sm font-extrabold leading-none mt-1">
                          {startsAt.toLocaleDateString("id-ID", {
                            day: "numeric",
                            timeZone: EVENT_TIME_ZONE,
                          })}
                        </span>
                      </div>

                      {/* Right: Event Info */}
                      <div className="flex flex-1 flex-col justify-between min-w-0">
                        <div className="flex items-center gap-1.5 mb-1 flex-wrap">
                          <span className="inline-block rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-black text-white">
                            {event.category}
                          </span>
                          {isOngoing && (
                            <span className="inline-block rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-emerald-600 text-white animate-pulse">
                              Berlangsung
                            </span>
                          )}
                          {isPast && (
                            <span className="inline-block rounded-[2px] px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wider bg-zinc-200 text-zinc-600">
                              Selesai
                            </span>
                          )}
                        </div>

                        <h4 className="font-sans text-xs font-bold text-black group-hover:underline line-clamp-2 leading-snug">
                          {event.title}
                        </h4>

                        <div className="mt-1.5 flex flex-col space-y-0.5 text-[10px] text-black/60">
                          <div className="flex items-center gap-1">
                            <Clock3 className="size-3 shrink-0" />
                            <span>{event.timeLabel}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <MapPin className="size-3 shrink-0" />
                            <span className="truncate">{event.location}</span>
                          </div>
                        </div>
                      </div>
                    </button>
                  )
                })
              ) : (
                <div className="px-4 py-12 text-center">
                  <Ticket className="size-6 text-zinc-300 mx-auto mb-2" />
                  <p className="text-xs font-bold text-zinc-600">
                    Tidak ada agenda
                  </p>
                  <p className="mt-1 text-[11px] text-zinc-400">
                    Belum ada agenda pada periode ini.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CSS: Styling circle label hitam dengan teks tanggal putih & centering */}
      <style>{`
        .has-agenda-event button,
        td.has-agenda-event button,
        button[data-has-event="true"] {
          background-color: #000 !important;
          color: #fff !important;
          border-radius: 9999px !important;
          font-weight: 700 !important;
        }
        .has-agenda-event button:hover,
        td.has-agenda-event button:hover,
        button[data-has-event="true"]:hover {
          background-color: #27272a !important;
        }
        .has-agenda-event button[data-selected-single="true"],
        td.has-agenda-event button[data-selected-single="true"],
        button[data-has-event="true"][data-selected-single="true"] {
          box-shadow: 0 0 0 2px #fff, 0 0 0 4px #000 !important;
        }
        .rdp-month {
          margin-left: auto !important;
          margin-right: auto !important;
        }
        .rdp-table {
          margin-left: auto !important;
          margin-right: auto !important;
        }
      `}</style>
    </div>
  )
}
