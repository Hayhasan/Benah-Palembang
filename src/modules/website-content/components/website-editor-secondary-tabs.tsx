"use client"

import { useState, type ReactNode } from "react"
import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"

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

export function HeaderFooterSettings() {
  const [logoUrl, setLogoUrl] = useState("")
  const [exploreLinks, setExploreLinks] = useState([
    { id: 1, nama: "Cerita Warga", url: "/cerita-warga" },
    { id: 2, nama: "Gaya Hidup", url: "/gaya-hidup" },
    { id: 3, nama: "Ruang Kota", url: "/ruang-kota" },
    { id: 4, nama: "Industri Kreatif", url: "/industri-kreatif" },
    { id: 5, nama: "Agenda", url: "/agenda" },
  ])
  const [connectLinks, setConnectLinks] = useState([
    { id: 1, nama: "Instagram", url: "https://instagram.com/benahpalembang" },
    { id: 2, nama: "TikTok", url: "#tiktok" },
    {
      id: 3,
      nama: "YouTube",
      url: "https://youtube.com/@benahpalembang",
    },
    { id: 4, nama: "LinkedIn", url: "#linkedin" },
  ])

  return (
    <div className="space-y-8">
      <SectionCard title="Logo & Header" desc="Konfigurasi logo dan link utama header.">
        <Field label="Logo Website (Upload)">
          <ImageUpload
            value={logoUrl}
            onChange={setLogoUrl}
            placeholder="Pilih logo (PNG/SVG)..."
          />
        </Field>
        <Field label="URL Logo (Redirect Link)">
          <Input defaultValue="/" />
        </Field>
      </SectionCard>

      <SectionCard
        title="Footer — Explore"
        desc="Link navigasi pada kolom Explore footer."
      >
        <div className="space-y-4">
          <Field label="Deskripsi Explore">
            <Input placeholder="Deskripsi singkat untuk kolom explore footer..." />
          </Field>
          <div className="space-y-3">
            {exploreLinks.map((link, index) => (
              <div key={link.id} className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  value={link.nama}
                  onChange={(event) =>
                    setExploreLinks((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, nama: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="Nama"
                />
                <Input
                  className="flex-[2]"
                  value={link.url}
                  onChange={(event) =>
                    setExploreLinks((current) =>
                      current.map((item, itemIndex) =>
                        itemIndex === index
                          ? { ...item, url: event.target.value }
                          : item,
                      ),
                    )
                  }
                  placeholder="URL"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() =>
                    setExploreLinks((current) =>
                      current.filter((_, itemIndex) => itemIndex !== index),
                    )
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() =>
                setExploreLinks((current) => [
                  ...current,
                  { id: Date.now(), nama: "", url: "" },
                ])
              }
            >
              <Plus className="mr-2 size-4" /> Tambah Link Explore
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Footer — Connect"
        desc="Link sosial media pada kolom Connect footer."
      >
        <div className="space-y-3">
          {connectLinks.map((link, index) => (
            <div key={link.id} className="flex items-center gap-2">
              <Input
                className="flex-1"
                value={link.nama}
                onChange={(event) =>
                  setConnectLinks((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, nama: event.target.value }
                        : item,
                    ),
                  )
                }
                placeholder="Platform"
              />
              <Input
                className="flex-[2]"
                value={link.url}
                onChange={(event) =>
                  setConnectLinks((current) =>
                    current.map((item, itemIndex) =>
                      itemIndex === index
                        ? { ...item, url: event.target.value }
                        : item,
                    ),
                  )
                }
                placeholder="URL"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() =>
                  setConnectLinks((current) =>
                    current.filter((_, itemIndex) => itemIndex !== index),
                  )
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
            onClick={() =>
              setConnectLinks((current) => [
                ...current,
                { id: Date.now(), nama: "", url: "" },
              ])
            }
          >
            <Plus className="mr-2 size-4" /> Tambah Link Connect
          </Button>
        </div>
      </SectionCard>

      <SectionCard
        title="Footer — Contact & Copyright"
        desc="Informasi kontak dan hak cipta di bagian bawah footer."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email Kontak">
            <Input defaultValue="halo@benahpalembang.id" />
          </Field>
          <Field label="Nomor HP / WhatsApp">
            <Input defaultValue="+62 711 123 456" />
          </Field>
        </div>
        <Field label="Alamat">
          <Input defaultValue="Palembang, Sumatera Selatan" />
        </Field>
        <Field label="Copyright">
          <Input defaultValue="© 2025 Benah Palembang" />
        </Field>
      </SectionCard>
    </div>
  )
}
