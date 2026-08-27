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

export function CollaborationSettings() {
  const [backgroundUrl, setBackgroundUrl] = useState("")
  const [partnerLogos, setPartnerLogos] = useState([
    {
      id: 1,
      name: "Grab",
      url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Grab_Logo.svg/200px-Grab_Logo.svg.png",
    },
    {
      id: 2,
      name: "Tokopedia",
      url: "https://images.tokopedia.net/img/toppicks/social-share-tokopedia.jpg",
    },
  ])
  const [partnerContents, setPartnerContents] = useState([
    {
      id: 1,
      platform: "youtube",
      link: "https://youtube.com/watch?v=example1",
    },
    {
      id: 2,
      platform: "instagram",
      link: "https://instagram.com/reel/example",
    },
  ])
  const [newContentPlatform, setNewContentPlatform] = useState("youtube")
  const [newContentLink, setNewContentLink] = useState("")

  const addContent = () => {
    if (!newContentLink.trim()) return
    setPartnerContents((current) => [
      ...current,
      {
        id: Date.now(),
        platform: newContentPlatform,
        link: newContentLink,
      },
    ])
    setNewContentLink("")
  }

  return (
    <div className="space-y-8">
      <SectionCard
        title="Section Heroes — Collaboration"
        desc="Konfigurasi tampilan heroes halaman kolaborasi."
      >
        <Field label="Background">
          <ImageUpload
            value={backgroundUrl}
            onChange={setBackgroundUrl}
            placeholder="Upload background kolaborasi..."
          />
        </Field>
        <Field label="Judul Halaman">
          <Input defaultValue="Mari Benahi Palembang bersama." />
        </Field>
        <Field label="Deskripsi">
          <Textarea value="Kami terbuka untuk berkolaborasi dengan komunitas, brand, creative worker, organisasi, media, dan siapa pun yang ingin ikut membuat Palembang lebih hidup." />
        </Field>
      </SectionCard>

      <SectionCard
        title="Kontak Kolaborasi"
        desc="Email, WhatsApp dan link button."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email Kolaborasi">
            <Input defaultValue="kolaborasi@benahpalembang.id" />
          </Field>
          <Field label="Nomor WhatsApp">
            <Input defaultValue="+628551241878" />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="URL Button Email">
            <Input defaultValue="mailto:hayhasan.public@gmail.com?subject=Kolaborasi" />
          </Field>
          <Field label="URL Button WhatsApp">
            <Input defaultValue="https://wa.me/628551241878" />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Form Hubungi Kami"
        desc="Konfigurasi judul dan deskripsi form kontak kolaborasi."
      >
        <Field label="Judul Form">
          <Input defaultValue="Hubungi Kami" />
        </Field>
        <Field label="Deskripsi Form">
          <Textarea value="Punya ide proyek, inisiatif kreatif, liputan cerita, atau ingin bermitra bersama Benah Palembang? Kirimkan detail singkatmu dan mari diskusikan langkah selanjutnya." />
        </Field>
      </SectionCard>

      <SectionCard
        title="Partner Logos"
        desc="Upload logo partner yang ditampilkan di halaman kolaborasi. Logo akan ditampilkan grayscale dan berwarna saat di-hover."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-3 gap-4 sm:grid-cols-4 md:grid-cols-6">
            {partnerLogos.map((logo) => (
              <div
                key={logo.id}
                className="group relative flex h-20 items-center justify-center rounded-lg border bg-muted/20 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.url}
                  alt={logo.name}
                  className="max-h-10 max-w-full object-contain"
                />
                <button
                  type="button"
                  onClick={() =>
                    setPartnerLogos((current) =>
                      current.filter((item) => item.id !== logo.id),
                    )
                  }
                  className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                >
                  x
                </button>
                <span className="absolute bottom-1 left-1 right-1 truncate text-center text-[9px] text-muted-foreground">
                  {logo.name}
                </span>
              </div>
            ))}
          </div>
          <ImageUpload
            value=""
            onChange={(url) =>
              setPartnerLogos((current) => [
                ...current,
                { id: Date.now(), name: "Partner", url },
              ])
            }
            placeholder="Upload Logo Partner"
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Partner Content"
        desc="Kelola konten video kolaborasi dari berbagai platform (YouTube, Instagram, TikTok, dll)."
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Konten Saat Ini
          </p>
          {partnerContents.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">
              Belum ada konten. Tambahkan konten pertama di bawah.
            </p>
          ) : null}
          {partnerContents.map((content) => (
            <div
              key={content.id}
              className="flex items-center gap-3 rounded-lg border bg-muted/10 p-3"
            >
              <span className="rounded bg-neutral-800 px-2 py-0.5 text-[10px] font-bold uppercase text-white">
                {content.platform}
              </span>
              <span className="flex-1 truncate text-sm text-muted-foreground">
                {content.link}
              </span>
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="size-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                onClick={() =>
                  setPartnerContents((current) =>
                    current.filter((item) => item.id !== content.id),
                  )
                }
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}

          <div className="border-t pt-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tambah Konten Baru
            </p>
            <div className="flex items-center gap-3">
              <select
                value={newContentPlatform}
                onChange={(event) => setNewContentPlatform(event.target.value)}
                className="flex h-10 w-40 items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
              >
                <option value="youtube">YouTube</option>
                <option value="instagram">Instagram</option>
                <option value="tiktok">TikTok</option>
                <option value="facebook">Facebook</option>
                <option value="x">X (Twitter)</option>
              </select>
              <Input
                value={newContentLink}
                onChange={(event) => setNewContentLink(event.target.value)}
                placeholder="Masukkan link video..."
                className="flex-1"
                onKeyDown={(event) => event.key === "Enter" && addContent()}
              />
              <Button
                type="button"
                onClick={addContent}
                className="bg-palembang-red text-white hover:bg-palembang-red/90"
              >
                <Plus className="mr-2 size-4" /> Add
              </Button>
            </div>
          </div>
        </div>
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
