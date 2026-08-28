"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown, ChevronUp } from "lucide-react"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

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

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value?: string
  onChange?: (value: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange?.(event.target.value)}
      placeholder={placeholder}
      className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
  )
}

export function ArticleSettings() {
  const categories = [
    "Cerita Warga",
    "Gaya Hidup",
    "Ruang Kota",
    "Industri Kreatif",
    "Kebudayaan",
  ]

  return (
    <div className="space-y-8">
      {categories.map((category) => (
        <CategorySettings key={category} categoryName={category} />
      ))}
    </div>
  )
}

function CategorySettings({ categoryName }: { categoryName: string }) {
  const [backgroundUrl, setBackgroundUrl] = useState("")

  return (
    <SectionCard
      title={`Section Heroes — ${categoryName}`}
      desc={`Konfigurasi background, judul, dan deskripsi halaman kategori ${categoryName}.`}
    >
      <Field label="Background">
        <ImageUpload
          value={backgroundUrl}
          onChange={setBackgroundUrl}
          placeholder={`Upload background ${categoryName}...`}
        />
      </Field>
      <Field label="Judul Halaman">
        <Input defaultValue={categoryName} />
      </Field>
      <Field label="Deskripsi">
        <Textarea placeholder={`Deskripsi mengenai ${categoryName}...`} />
      </Field>
    </SectionCard>
  )
}

export function AgendaSettings() {
  const [backgroundUrl, setBackgroundUrl] = useState("")

  return (
    <div className="space-y-8">
      <SectionCard
        title="Section Heroes — Agenda"
        desc="Konfigurasi tampilan heroes halaman agenda."
      >
        <Field label="Background">
          <ImageUpload
            value={backgroundUrl}
            onChange={setBackgroundUrl}
            placeholder="Upload background agenda..."
          />
        </Field>
        <Field label="Judul Halaman">
          <Input defaultValue="Temui, ikut, dan bergerak." />
        </Field>
        <Field label="Deskripsi">
          <Textarea value="Ruang-ruang pertemuan yang mempertemukan ide, orang, dan energi baik untuk Palembang." />
        </Field>
      </SectionCard>
    </div>
  )
}
