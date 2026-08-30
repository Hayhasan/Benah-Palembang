"use client"

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useState, type ReactNode } from "react"
import { toast } from "sonner"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type {
  CollaborationPageEditorData,
  CollaborationPartnerContentEditorData,
  CollaborationPartnerLogoEditorData,
} from "../types/collaboration-page-editor"
import type { CollaborationPlatform } from "../types/collaboration-page"

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
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
  )
}

function clientKey(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function platformBadgeClass(platform: CollaborationPlatform) {
  if (platform === "youtube") return "bg-red-600 text-white"
  if (platform === "instagram") {
    return "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white"
  }
  if (platform === "tiktok") {
    return "border border-white/20 bg-black text-white"
  }
  if (platform === "facebook") return "bg-blue-600 text-white"
  return "bg-neutral-800 text-white"
}

export function ManageCollaborationSettings({
  data,
  onChange,
}: {
  data: CollaborationPageEditorData
  onChange: (
    updater: (
      current: CollaborationPageEditorData,
    ) => CollaborationPageEditorData,
  ) => void
}) {
  const [newLogoName, setNewLogoName] = useState("")
  const [newContentPlatform, setNewContentPlatform] =
    useState<CollaborationPlatform>("youtube")
  const [newContentLink, setNewContentLink] = useState("")

  const changeData = onChange

  const updateLogo = (
    clientKeyValue: string,
    values: Partial<CollaborationPartnerLogoEditorData>,
  ) => {
    changeData((current) => ({
      ...current,
      partnerLogos: current.partnerLogos.map((logo) =>
        logo.clientKey === clientKeyValue ? { ...logo, ...values } : logo,
      ),
    }))
  }

  const updateContent = (
    clientKeyValue: string,
    values: Partial<CollaborationPartnerContentEditorData>,
  ) => {
    changeData((current) => ({
      ...current,
      partnerContents: current.partnerContents.map((item) =>
        item.clientKey === clientKeyValue ? { ...item, ...values } : item,
      ),
    }))
  }

  const addPartnerContent = () => {
    if (!newContentLink.trim()) {
      toast.error("URL konten wajib diisi.")
      return
    }

    changeData((current) => ({
      ...current,
      partnerContents: [
        ...current.partnerContents,
        {
          id: null,
          clientKey: clientKey("collaboration-content"),
          platform: newContentPlatform,
          contentUrl: newContentLink.trim(),
          position: current.partnerContents.length + 1,
          isVisible: true,
        },
      ],
    }))
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
            value={data.hero.imageUrl}
            onChange={(imageUrl) =>
              changeData((current) => ({
                ...current,
                hero: { ...current.hero, imageUrl },
              }))
            }
            placeholder="Upload background kolaborasi..."
            aspect={16 / 9}
          />
        </Field>
        <Field label="Alt Gambar">
          <Input
            value={data.hero.imageAlt}
            onChange={(event) =>
              changeData((current) => ({
                ...current,
                hero: { ...current.hero, imageAlt: event.target.value },
              }))
            }
          />
        </Field>
        <Field label="Judul Halaman">
          <Input
            value={data.hero.title}
            onChange={(event) =>
              changeData((current) => ({
                ...current,
                hero: { ...current.hero, title: event.target.value },
              }))
            }
          />
        </Field>
        <Field label="Deskripsi">
          <Textarea
            value={data.hero.description}
            onChange={(description) =>
              changeData((current) => ({
                ...current,
                hero: { ...current.hero, description },
              }))
            }
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Kontak Kolaborasi"
        desc="Email, WhatsApp dan link button."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email Kolaborasi">
            <Input
              type="email"
              value={data.contact.email}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  contact: { ...current.contact, email: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Nomor WhatsApp">
            <Input
              value={data.contact.phone}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  contact: { ...current.contact, phone: event.target.value },
                }))
              }
            />
          </Field>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="URL Button Email">
            <Input
              value={data.contact.emailUrl}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  contact: {
                    ...current.contact,
                    emailUrl: event.target.value,
                  },
                }))
              }
            />
          </Field>
          <Field label="URL Button WhatsApp">
            <Input
              value={data.contact.whatsappUrl}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  contact: {
                    ...current.contact,
                    whatsappUrl: event.target.value,
                  },
                }))
              }
            />
          </Field>
        </div>
      </SectionCard>

      <SectionCard
        title="Partner Logos"
        desc="Upload logo partner yang ditampilkan di halaman kolaborasi. Logo akan ditampilkan grayscale dan berwarna saat di-hover."
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4">
            {data.partnerLogos.map((logo) => (
              <div
                key={logo.clientKey}
                className="group relative flex h-28 flex-col items-center justify-between rounded-lg border bg-muted/20 p-3"
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={logo.imageUrl}
                  alt={logo.name}
                  className="max-h-12 max-w-full object-contain"
                />
                <Input
                  value={logo.name}
                  onChange={(event) =>
                    updateLogo(logo.clientKey, { name: event.target.value })
                  }
                  className="h-7 px-2 text-center text-[10px]"
                  aria-label="Nama partner"
                />
                <button
                  type="button"
                  onClick={() =>
                    changeData((current) => ({
                      ...current,
                      partnerLogos: current.partnerLogos
                        .filter((item) => item.clientKey !== logo.clientKey)
                        .map((item, index) => ({
                          ...item,
                          position: index + 1,
                        })),
                    }))
                  }
                  className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                  aria-label={`Hapus logo ${logo.name}`}
                >
                  x
                </button>
              </div>
            ))}
          </div>
          <Field label="Nama Partner Baru">
            <Input
              value={newLogoName}
              onChange={(event) => setNewLogoName(event.target.value)}
              placeholder="Nama partner"
            />
          </Field>
          <ImageUpload
            value=""
            onChange={(imageUrl) => {
              changeData((current) => ({
                ...current,
                partnerLogos: [
                  ...current.partnerLogos,
                  {
                    id: null,
                    clientKey: clientKey("collaboration-logo"),
                    name:
                      newLogoName.trim() ||
                      `Partner ${current.partnerLogos.length + 1}`,
                    imageUrl,
                    position: current.partnerLogos.length + 1,
                    isVisible: true,
                  },
                ],
              }))
              setNewLogoName("")
            }}
            placeholder="Upload Logo Partner"
            aspect={1}
          />
        </div>
      </SectionCard>

      <SectionCard
        title="Partner Content"
        desc="Kelola platform dan URL konten. Thumbnail serta rasio public diturunkan otomatis dari link dan dibuka pada tab baru."
      >
        <div className="space-y-4">
          <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
            Konten Saat Ini
          </p>
          {data.partnerContents.length === 0 ? (
            <p className="text-sm italic text-muted-foreground">
              Belum ada konten. Tambahkan konten pertama di bawah.
            </p>
          ) : null}
          {data.partnerContents.map((content) => (
            <div
              key={content.clientKey}
              className="rounded-lg border bg-muted/10 p-4"
            >
              <div className="mb-4 flex items-center gap-3">
                <span
                  className={`rounded px-2 py-0.5 text-[10px] font-bold uppercase ${platformBadgeClass(content.platform)}`}
                >
                  {content.platform}
                </span>
                <span className="flex-1 truncate text-sm text-muted-foreground">
                  {content.contentUrl}
                </span>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() =>
                    changeData((current) => ({
                      ...current,
                      partnerContents: current.partnerContents
                        .filter(
                          (item) => item.clientKey !== content.clientKey,
                        )
                        .map((item, index) => ({
                          ...item,
                          position: index + 1,
                        })),
                    }))
                  }
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
              <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
                <select
                  value={content.platform}
                  onChange={(event) =>
                    updateContent(content.clientKey, {
                      platform: event.target.value as CollaborationPlatform,
                    })
                  }
                  className="flex h-10 items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                >
                  <option value="youtube">YouTube</option>
                  <option value="instagram">Instagram</option>
                  <option value="tiktok">TikTok</option>
                  <option value="facebook">Facebook</option>
                  <option value="x">X (Twitter)</option>
                </select>
                <Input
                  value={content.contentUrl}
                  onChange={(event) =>
                    updateContent(content.clientKey, {
                      contentUrl: event.target.value,
                    })
                  }
                  placeholder="https://youtube.com/..."
                />
              </div>
            </div>
          ))}

          <div className="border-t pt-2">
            <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Tambah Konten Baru
            </p>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-[180px_1fr]">
                <select
                  value={newContentPlatform}
                  onChange={(event) =>
                    setNewContentPlatform(
                      event.target.value as CollaborationPlatform,
                    )
                  }
                  className="flex h-10 items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
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
                  placeholder="https://youtube.com/..."
                  onKeyDown={(event) => {
                    if (event.key === "Enter") addPartnerContent()
                  }}
                />
              </div>
              <Button
                type="button"
                onClick={addPartnerContent}
                className="w-full bg-palembang-red text-white hover:bg-palembang-red/90"
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
