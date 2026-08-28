"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState, type ReactNode } from "react"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { AgendaPageEditorData } from "../types/agenda-page-editor"

function SectionCard({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children: ReactNode
}) {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <div className="overflow-visible rounded-xl border bg-background shadow-sm">
      <div
        className={`flex cursor-pointer items-center justify-between bg-muted/30 p-4 transition-colors hover:bg-muted/50 ${
          isExpanded ? "rounded-t-xl border-b" : "rounded-xl"
        }`}
        onClick={() => setIsExpanded((current) => !current)}
      >
        <div>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          {desc ? (
            <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="pointer-events-none shrink-0"
        >
          {isExpanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </Button>
      </div>
      {isExpanded ? <div className="space-y-5 p-6">{children}</div> : null}
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

export function ManageAgendaSettings({
  data,
  onChange,
}: {
  data: AgendaPageEditorData
  onChange: (
    updater: (current: AgendaPageEditorData) => AgendaPageEditorData,
  ) => void
}) {
  return (
    <div className="space-y-8">
      <SectionCard
        title="Section Heroes — Agenda"
        desc="Konfigurasi tampilan heroes halaman agenda."
      >
        <Field label="Background">
          <ImageUpload
            value={data.hero.imageUrl}
            onChange={(imageUrl) =>
              onChange((current) => ({
                ...current,
                hero: { ...current.hero, imageUrl },
              }))
            }
            placeholder="Upload background agenda..."
          />
        </Field>
        <Field label="Judul Halaman">
          <Input
            value={data.hero.title}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                hero: { ...current.hero, title: event.target.value },
              }))
            }
          />
        </Field>
        <Field label="Deskripsi">
          <textarea
            value={data.hero.description}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                hero: { ...current.hero, description: event.target.value },
              }))
            }
            className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
          />
        </Field>
      </SectionCard>
    </div>
  )
}
