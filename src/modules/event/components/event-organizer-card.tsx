import { Building2 } from "lucide-react"

export function EventOrganizerCard({ organizer }: { organizer: string }) {
  return (
    <div className="rounded-[1.5rem] border border-border bg-card p-5 shadow-sm">
      <div className="flex items-center gap-3.5">
        <div className="flex size-12 shrink-0 items-center justify-center rounded-full border border-border bg-muted text-palembang-red ring-2 ring-palembang-red/20">
          <Building2 className="size-5" />
        </div>
        <div className="min-w-0 flex-1">
          <span className="text-[9px] font-bold uppercase tracking-wider text-palembang-red">
            Publisher & Organizer
          </span>
          <h4 className="truncate font-display text-sm font-bold text-foreground">
            {organizer}
          </h4>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Penyelenggara agenda ini
          </p>
        </div>
      </div>
    </div>
  )
}
