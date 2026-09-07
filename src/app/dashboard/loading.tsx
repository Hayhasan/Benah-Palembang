import { Loader2 } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="space-y-8 pb-10 animate-in fade-in duration-150">
      {/* Header bar loading state */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2.5">
            <Skeleton className="h-8 sm:h-9 w-44 sm:w-64" />
            <Loader2 className="size-4 animate-spin text-palembang-red shrink-0" />
          </div>
          <Skeleton className="h-4 w-60 sm:w-80" />
        </div>
        <Skeleton className="h-10 w-full sm:w-36 rounded-lg" />
      </div>

      {/* Cards summary placeholder */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <div key={i} className="rounded-xl border bg-background p-5 space-y-3 shadow-xs">
            <div className="flex items-center justify-between">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="size-8 rounded-md" />
            </div>
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-32" />
          </div>
        ))}
      </div>

      {/* Content / Table placeholder */}
      <div className="rounded-xl border bg-background shadow-xs overflow-hidden">
        <div className="p-4 border-b flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <Skeleton className="h-10 w-full sm:w-72 rounded-md" />
          <div className="flex gap-2">
            <Skeleton className="h-9 w-20 rounded-md" />
            <Skeleton className="h-9 w-20 rounded-md" />
          </div>
        </div>

        <div className="p-4 sm:p-6 space-y-4">
          {Array.from({ length: 5 }).map((_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 py-3 border-b last:border-0">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <Skeleton className="size-10 rounded-lg shrink-0" />
                <div className="space-y-2 flex-1 min-w-0">
                  <Skeleton className="h-4 w-3/4 max-w-[240px]" />
                  <Skeleton className="h-3 w-1/2 max-w-[160px]" />
                </div>
              </div>
              <Skeleton className="h-6 w-16 rounded-full shrink-0" />
              <Skeleton className="h-8 w-16 rounded-md shrink-0 hidden sm:block" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
