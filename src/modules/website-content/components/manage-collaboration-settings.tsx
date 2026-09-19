"use client"

import { ChevronDown, ChevronUp, Plus, Trash2, GripVertical, Edit2 } from "lucide-react"
import { useState, type ReactNode } from "react"
import { toast } from "sonner"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"


import type {
  CollaborationPageEditorData,
  CollaborationPartnerContentEditorData,
  CollaborationPartnerLogoEditorData,
} from "../types/collaboration-page-editor"
import type { CollaborationPlatform } from "../types/collaboration-page"
import { CollaborationContentCard } from "./collaboration-page"

function SectionCard({
  title,
  desc,
  children,
  defaultExpanded = false,
}: {
  title: string
  desc?: string
  children: ReactNode
  defaultExpanded?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

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
    <label className="space-y-2 block">
      <span className="text-sm font-medium block">{label}</span>
      {children}
    </label>
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
  const [isLogoModalOpen, setIsLogoModalOpen] = useState(false)


  const [draggedHeroIndex, setDraggedHeroIndex] = useState<number | null>(null)

  const changeData = onChange

  const addHeroSlide = () => {
    if (data.heroSlides.length >= 10) {
      toast.error("Maksimal 10 hero slide.")
      return
    }

    changeData((current) => ({
      ...current,
      heroSlides: [
        ...current.heroSlides,
        {
          id: null,
          clientKey: clientKey("collaboration-slide"),
          imageUrl: "",
          imageAlt: "Banner image",
          title: "",
          description: "",
          position: current.heroSlides.length + 1,
          isVisible: true,
        },
      ],
    }))
  }

  const removeHeroSlide = (clientKeyValue: string) => {
    if (data.heroSlides.length <= 1) {
      toast.error("Minimal 1 hero slide.")
      return
    }

    changeData((current) => ({
      ...current,
      heroSlides: current.heroSlides
        .filter((slide) => slide.clientKey !== clientKeyValue)
        .map((slide, index) => ({ ...slide, position: index + 1 })),
    }))
  }

  const updateHeroSlide = (
    clientKeyValue: string,
    values: Partial<CollaborationPageEditorData["heroSlides"][number]>,
  ) => {
    changeData((current) => ({
      ...current,
      heroSlides: current.heroSlides.map((slide) =>
        slide.clientKey === clientKeyValue ? { ...slide, ...values } : slide,
      ),
    }))
  }

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



  return (
    <div className="space-y-8">
      <SectionCard
        title="Section Heroes — Collaboration"
        desc="Konfigurasi tampilan heroes halaman kolaborasi."
        defaultExpanded
      >
        <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start px-4 sm:px-6 pt-6 pb-4 sm:pb-6">
          {data.heroSlides.map((slide, slideIndex) => (
            <div
              key={slide.clientKey}
              className={`relative flex flex-col justify-between space-y-4 rounded-lg border bg-muted/10 p-4 shadow-sm transition-all ${
                draggedHeroIndex === slideIndex
                  ? "opacity-50 ring-2 ring-primary"
                  : ""
              }`}
              draggable
              onDragStart={() => setDraggedHeroIndex(slideIndex)}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => {
                e.preventDefault()
                if (
                  draggedHeroIndex === null ||
                  draggedHeroIndex === slideIndex
                )
                  return

                const newSlides = [...data.heroSlides]
                const [draggedItem] = newSlides.splice(draggedHeroIndex, 1)
                newSlides.splice(slideIndex, 0, draggedItem)

                changeData((current) => ({
                  ...current,
                  heroSlides: newSlides.map((s, idx) => ({
                    ...s,
                    position: idx + 1,
                  })),
                }))
                setDraggedHeroIndex(null)
              }}
              onDragEnd={() => setDraggedHeroIndex(null)}
            >
              <div className="absolute right-2 top-2 z-10 hidden sm:block">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="cursor-grab text-muted-foreground active:cursor-grabbing"
                >
                  <GripVertical className="size-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <Field label={`Background ${slideIndex + 1}`}>
                  <ImageUpload
                    value={slide.imageUrl}
                    onChange={(imageUrl) => updateHeroSlide(slide.clientKey, { imageUrl })}
                    placeholder="Upload background kolaborasi..."
                    aspect={16 / 9}
                  />
                </Field>
                <Field label="Alt Gambar">
                  <Input
                    value={slide.imageAlt}
                    onChange={(event) =>
                      updateHeroSlide(slide.clientKey, { imageAlt: event.target.value })
                    }
                  />
                </Field>
                <Field label="Judul Halaman">
                  <Input
                    value={slide.title}
                    onChange={(event) =>
                      updateHeroSlide(slide.clientKey, { title: event.target.value })
                    }
                  />
                </Field>
                <Field label="Deskripsi">
                  <Textarea
                    value={slide.description}
                    onChange={(description) => updateHeroSlide(slide.clientKey, { description })}
                  />
                </Field>
              </div>

              {data.heroSlides.length > 1 && (
                <div className="flex justify-end border-t pt-4">
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button type="button" variant="destructive" size="sm" className="w-full sm:w-auto">
                        <Trash2 className="mr-2 size-4" /> Hapus
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>Hapus Banner?</AlertDialogTitle>
                        <AlertDialogDescription>
                          Tindakan ini tidak dapat dibatalkan. Banner ini akan dihapus dari halaman kolaborasi.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Batal</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => removeHeroSlide(slide.clientKey)}
                          className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                        >
                          Ya, Hapus
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>
              )}
            </div>
          ))}
        </div>

        <div className="px-4 sm:px-6 pb-4 sm:pb-6">
          <Button
            type="button"
            onClick={addHeroSlide}
            className="w-full"
          >
            <Plus className="mr-2 size-4" /> Tambah Banner
          </Button>
        </div>
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
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 lg:grid-cols-6">
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
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <button
                      type="button"
                      className="absolute -right-2 -top-2 flex size-5 items-center justify-center rounded-full bg-red-500 text-xs text-white opacity-0 transition-opacity hover:bg-red-600 group-hover:opacity-100"
                      aria-label={`Hapus logo ${logo.name}`}
                    >
                      x
                    </button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Hapus Partner Logo?</AlertDialogTitle>
                      <AlertDialogDescription>
                        Tindakan ini tidak dapat dibatalkan. Logo {logo.name} akan dihapus dari halaman kolaborasi.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Batal</AlertDialogCancel>
                      <AlertDialogAction
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
                        className="bg-red-500 text-white hover:bg-red-600 focus:ring-red-500"
                      >
                        Ya, Hapus
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            ))}
          </div>
          <Dialog open={isLogoModalOpen} onOpenChange={setIsLogoModalOpen}>
            <DialogTrigger asChild>
              <Button type="button" className="w-full">
                <Plus className="mr-2 size-4" /> Tambah Partner Baru
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Partner Baru</DialogTitle>
                <DialogDescription>
                  Isi nama partner dan upload logo. Logo akan otomatis ditambahkan setelah upload selesai.
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 pt-4">
                <Field label="Nama Partner">
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
                    setIsLogoModalOpen(false)
                  }}
                  placeholder="Upload Logo Partner"
                  aspect={1}
                />
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </SectionCard>


    </div>
  )
}
