"use client"

import {
  Archive,
  X,
  RotateCcw,
  Building,
  Calendar,
  Clock,
  Eye,
  Link2,
  Loader2,
  MapPin,
  MessageCircle,
  Save,
  Send,
  ChevronDown,
  Camera
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

function formatWhatsappInput(value: string) {
  if (!value) return ""
  let clean = value.replace(/\D/g, "")
  if (clean.startsWith("0")) clean = "62" + clean.substring(1)
  if (!clean.startsWith("62")) clean = "62" + clean
  return `https://wa.me/${clean}`
}

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { TagInput } from "@/components/dashboard/TagInput"
import { TiptapEditor } from "@/components/dashboard/TiptapEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"
import { useDashboardSidebar } from "@/context/DashboardSidebarContext"

import { archiveEventAction } from "../actions/archive-event"
import { ArticleEditorHeroCarousel } from "../../article/components/article-editor-hero-carousel"
import { isResubmittableEventStatus } from "../constants/event-status"
import { republishEventAction } from "../actions/republish-event"
import { saveEventAction } from "../actions/save-event"
import type {
  EventActionResult,
  EventSaveIntent,
  OwnedEventEditorData,
} from "../types/owned-event"

const EVENT_CATEGORIES = [
  "Festival",
  "Pameran",
  "Diskusi",
  "Pertunjukan",
  "Workshop",
  "Olahraga & Kompetisi",
  "Pelatihan",
  "Komunitas",
  "Kuliah Umum",
  "Networking",
]

interface EventEditorProps {
  initialEvent?: OwnedEventEditorData
}

export function EventEditor({ initialEvent }: EventEditorProps) {
  const router = useRouter()
  const { collapsed } = useDashboardSidebar()
  const { registerSaveHandler, setIsDirty } = useUnsavedChanges()
  const [isPending, startTransition] = useTransition()
  const [eventId, setEventId] = useState(initialEvent?.id)
  const [status, setStatus] = useState(initialEvent?.status)
  const [title, setTitle] = useState(initialEvent?.title ?? "")
  const [description, setDescription] = useState(
    initialEvent?.description ?? "",
  )
  const [content, setContent] = useState(initialEvent?.content ?? "")
  const [bannerUrl, setBannerUrl] = useState(initialEvent?.bannerUrl ?? "")
  const [additionalBannerUrls, setAdditionalBannerUrls] = useState<string[]>(initialEvent?.additionalBannerUrls ?? [])
  const initialCategory = initialEvent?.category ?? "Festival"
  const [category, setCategory] = useState(initialCategory)
  const [isCustomCategory, setIsCustomCategory] = useState(
    !EVENT_CATEGORIES.includes(initialCategory)
  )
  const [startsOn, setStartsOn] = useState(initialEvent?.startsOn ?? "")
  const [startsTime, setStartsTime] = useState(
    initialEvent?.startsTime ?? "",
  )
  const [location, setLocation] = useState(initialEvent?.location ?? "")
  const [organizer, setOrganizer] = useState(initialEvent?.organizer ?? "")
  const [photographer, setPhotographer] = useState(initialEvent?.photographer ?? "")
  const [registrationUrl, setRegistrationUrl] = useState(
    initialEvent?.registrationUrl ?? "",
  )
  const [whatsappUrl, setWhatsappUrl] = useState(
    initialEvent?.whatsappUrl ?? "",
  )
  const [tags, setTags] = useState(initialEvent?.tags ?? ["Palembang", "Event"])
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [republishDialogOpen, setRepublishDialogOpen] = useState(false)
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false)

  const markDirty = () => setIsDirty(true)

  const actionPayload = useCallback(
    (intent: EventSaveIntent) => ({
      id: eventId,
      intent,
      title,
      description,
      content,
      bannerUrl,
      additionalBannerUrls,
      category,
      startsOn,
      startsTime,
      location,
      organizer,
      photographer,
      registrationUrl,
      whatsappUrl,
      tags,
    }),
    [
      bannerUrl,
      additionalBannerUrls,
      category,
      content,
      description,
      eventId,
      location,
      organizer,
      photographer,
      registrationUrl,
      startsOn,
      startsTime,
      tags,
      title,
      whatsappUrl,
    ],
  )

  const runSaveAction = useCallback(
    (intent: EventSaveIntent) =>
      new Promise<EventActionResult>((resolve) => {
        startTransition(async () => {
          resolve(await saveEventAction(actionPayload(intent)))
        })
      }),
    [actionPayload],
  )

  const saveEvent = useCallback(
    async (intent: EventSaveIntent) => {
      const result = await runSaveAction(intent)
      if (!result.success) {
        toast.error(result.message)
        return null
      }

      setEventId(result.id)
      setStatus(result.status)
      setIsDirty(false)
      toast.success(result.message)
      return result
    },
    [runSaveAction, setIsDirty],
  )

  useEffect(() => {
    registerSaveHandler(async () => Boolean(await saveEvent("SAVE")))
    return () => registerSaveHandler(null)
  }, [registerSaveHandler, saveEvent])

  useEffect(
    () => () => {
      setIsDirty(false)
    },
    [setIsDirty],
  )

  async function handleSave() {
    const result = await saveEvent("SAVE")
    if (!result) return

    if (!initialEvent) {
      router.replace(`/dashboard/create-event/edit?id=${result.id}`)
    } else {
      router.push("/dashboard/create-event")
    }
    router.refresh()
  }

  async function handlePost() {
    const result = await saveEvent("POST")
    if (!result) return

    router.push("/dashboard/create-event")
    router.refresh()
  }

  async function handlePreview() {
    const result = await saveEvent("SAVE")
    if (!result) return

    router.push(`/dashboard/create-event/preview/${result.id}`)
  }

  function handleArchive() {
    if (!eventId) return

    startTransition(async () => {
      const result = await archiveEventAction({ id: eventId })
      if (!result.success) {
        toast.error(result.message)
        return
      }

      setIsDirty(false)
      toast.success(result.message)
      setArchiveDialogOpen(false)
      router.push("/dashboard/create-event")
      router.refresh()
    })
  }

  function handleRepublish() {
    if (!eventId) return

    startTransition(async () => {
      const result = await republishEventAction({ id: eventId })
      if (!result.success) {
        toast.error(result.message)
        return
      }

      setIsDirty(false)
      toast.success(result.message)
      setRepublishDialogOpen(false)
      router.push("/dashboard/create-event")
      router.refresh()
    })
  }

  const canPost = status === undefined || isResubmittableEventStatus(status)
  const canArchive = status === "PUBLISHED" && eventId !== undefined
  const canRepublish = status === "ARCHIVED" && eventId !== undefined
  const isBusy = isPending || isUploadingBanner || isUploadingContentImage

  return (
    <div className="bg-white text-zinc-900 min-h-screen pb-32">
      {/* 1. HEROES CAROUSEL AT THE VERY TOP */}
      <ArticleEditorHeroCarousel
        photos={[bannerUrl, ...additionalBannerUrls.filter(Boolean)].filter(Boolean)}
        title={title}
        onTitleChange={(val) => {
          setTitle(val)
          markDirty()
        }}
        excerpt={description}
        onExcerptChange={(val) => {
          setDescription(val)
          markDirty()
        }}
        photographerName={photographer || undefined}
        onOpenUploadModal={() => setBannerDialogOpen(true)}
      />

      {/* Banner Upload Modal */}
      <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
        <DialogContent className="sm:max-w-5xl lg:max-w-6xl bg-white border-zinc-200 text-zinc-900 p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="px-6 py-4 border-b border-zinc-200 shrink-0">
            <DialogTitle className="text-zinc-900">Upload Banner Event</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Upload foto utama dan hingga 4 foto tambahan untuk event ini.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className={cn(
              "mt-4",
              bannerUrl ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "block"
            )}>
              {/* Main Banner */}
              <div className={cn(
                "relative group space-y-2",
                bannerUrl ? "w-full aspect-[3/2]" : "w-full aspect-[4/3] sm:aspect-[21/9]"
              )}>
                <div className="absolute top-2 left-2 z-20 pointer-events-none rounded bg-black/60 px-2 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                  Banner Utama (Wajib)
                </div>
                <div className="h-full w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200 shadow-sm">
                  <ImageUpload
                    value={bannerUrl}
                    onChange={(value) => {
                      setBannerUrl(value)
                      markDirty()
                    }}
                    uploadScope="website-content"
                    onUploadingChange={setIsUploadingBanner}
                    aspect={bannerUrl ? 3 / 2 : 21 / 9}
                    placeholder="Klik untuk upload banner utama..."
                    className="h-full w-full opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Additional Banners */}
              {bannerUrl && [0, 1, 2, 3].map((index) => {
                const url = additionalBannerUrls[index] || ""
                const isVisible = index === 0 || !!additionalBannerUrls[index - 1]
                if (!isVisible) return null

                return (
                  <div key={`banner-${index}`} className="space-y-2 relative group aspect-[3/2]">
                    {url && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2 z-30 size-7 bg-red-500/80 hover:bg-red-600 text-white rounded-full shadow-md backdrop-blur-md opacity-0 group-hover:opacity-100 transition-opacity"
                        onClick={() => {
                          const newUrls = [...additionalBannerUrls]
                          newUrls.splice(index, 1)
                          setAdditionalBannerUrls(newUrls)
                          markDirty()
                        }}
                      >
                        <X className="size-3.5" />
                      </Button>
                    )}
                    <div className="absolute top-2 left-2 z-20 pointer-events-none rounded bg-black/40 px-2 py-0.5 text-[10px] font-bold text-white/80 uppercase tracking-wider backdrop-blur-sm">
                      Foto {index + 2}
                    </div>
                    <div className="h-full w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200 shadow-sm">
                      <ImageUpload
                        value={url}
                        onChange={(value) => {
                          const newUrls = [...additionalBannerUrls]
                          if (value) {
                            newUrls[index] = value
                          } else {
                            newUrls[index] = ""
                          }
                          setAdditionalBannerUrls(newUrls.filter(Boolean))
                          markDirty()
                        }}
                        uploadScope="event"
                        onUploadingChange={setIsUploadingBanner}
                        aspect={3 / 2}
                        placeholder="+"
                        className="h-full w-full opacity-70 hover:opacity-100 transition-opacity"
                      />
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
          <DialogFooter className="px-6 py-4 border-t border-zinc-200 bg-zinc-50 shrink-0 flex justify-end">
            <Button
              type="button"
              onClick={() => setBannerDialogOpen(false)}
              className="bg-black text-white hover:bg-zinc-800 px-8"
            >
              Terapkan
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>



      {/* 3. MAIN CONTENT AND SIDEBAR */}
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">
          
          {/* Main Content Area */}
          <div className="flex-1 min-w-0 max-w-[720px]">
            {status === "REJECTED" || status === "TAKEN_DOWN" ? (
              <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm mb-8">
                <p className="font-semibold text-red-700">
                  {status === "REJECTED"
                    ? "Event ini ditolak admin"
                    : "Event ini diturunkan admin"}
                </p>
                <p className="mt-1 text-red-700/90">
                  {initialEvent?.moderationNote ||
                    "Admin tidak mencantumkan alasan. Silakan hubungi admin sebelum mengajukan ulang."}
                </p>
              </div>
            ) : null}


            <div className="prose prose-zinc prose-lg max-w-none prose-headings:font-sans prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-3xl prose-h3:text-2xl prose-p:font-serif prose-p:leading-relaxed prose-p:text-zinc-800 prose-a:text-black hover:prose-a:text-zinc-600 prose-a:underline-offset-4 prose-img:rounded-xl">
              <TiptapEditor
                content={content}
                imageUploadScope="event"
                onUploadingChange={setIsUploadingContentImage}
                onChange={(value) => {
                  setContent(value)
                  markDirty()
                }}
              />
            </div>
            
            <div className="mt-10 pt-10 border-t border-zinc-200">
               <Field label="Tags">
                <TagInput
                  tags={tags}
                  setTags={(value) => {
                    setTags(value)
                    markDirty()
                  }}
                />
              </Field>
            </div>
          </div>

          {/* Sticky Sidebar */}
          <aside className="w-full lg:w-[320px] xl:w-[360px] shrink-0 space-y-8">
            <div className="sticky top-24 space-y-8">
              
              {/* Publishing Actions Panel removed, moved to sticky footer */}

              {/* Kategori Event */}
              <div className="w-full text-zinc-900">
                <div>
                  <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
                    KATEGORI EVENT
                  </span>
                  <div className="mt-1.5 mb-3.5 border-b border-dotted border-zinc-300 w-full" />
                </div>
                <div className="relative inline-flex items-center w-full">
                  <select
                    value={isCustomCategory ? "Lainnya" : category}
                    onChange={(e) => {
                      const val = e.target.value
                      if (val === "Lainnya") {
                        setIsCustomCategory(true)
                        setCategory("")
                      } else {
                        setIsCustomCategory(false)
                        setCategory(val)
                      }
                      markDirty()
                    }}
                    className="w-full appearance-none rounded-[3px] bg-black text-white border border-black pl-4 pr-10 py-2.5 text-xs font-bold uppercase tracking-[0.14em] hover:bg-zinc-800 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-zinc-400"
                  >
                    {EVENT_CATEGORIES.map((item) => (
                      <option key={item} value={item}>
                        {item}
                      </option>
                    ))}
                    <option value="Lainnya">LAINNYA</option>
                  </select>
                  <ChevronDown className="absolute right-3 size-4 text-white pointer-events-none" />
                </div>
                {isCustomCategory && (
                  <div className="mt-3">
                    <Input
                      value={category}
                      onChange={(e) => {
                        setCategory(e.target.value)
                        markDirty()
                      }}
                      placeholder="Ketik kategori event..."
                      className="h-10 text-sm border-zinc-200 focus-visible:ring-zinc-950"
                    />
                  </div>
                )}
              </div>

              {/* Event Details Panel */}
              <div className="rounded-2xl border border-zinc-200 bg-white p-6 space-y-6">
                <h3 className="font-sans text-base font-bold text-zinc-900 border-b border-zinc-100 pb-3">
                  Detail Informasi Event
                </h3>
                
                <Field label="Tanggal Event" icon={<Calendar className="size-4 text-zinc-400" />}>
                  <Input
                    type="date"
                    value={startsOn}
                    onChange={(e) => {
                      setStartsOn(e.target.value)
                      markDirty()
                    }}
                    className="h-9 border-zinc-200 focus-visible:ring-zinc-950"
                  />
                </Field>

                <Field label="Waktu Pelaksanaan" icon={<Clock className="size-4 text-zinc-400" />}>
                  <Input
                    type="time"
                    value={startsTime}
                    onChange={(e) => {
                      setStartsTime(e.target.value)
                      markDirty()
                    }}
                    className="h-9 border-zinc-200 focus-visible:ring-zinc-950"
                  />
                </Field>

                <Field label="Lokasi Acara" icon={<MapPin className="size-4 text-zinc-400" />}>
                  <Input
                    value={location}
                    onChange={(e) => {
                      setLocation(e.target.value)
                      markDirty()
                    }}
                    placeholder="Misal: Plaza BKB"
                    className="h-9 border-zinc-200 focus-visible:ring-zinc-950"
                  />
                </Field>

                <Field label="Penyelenggara / Organizer" icon={<Building className="size-4 text-zinc-400" />}>
                  <Input
                    value={organizer}
                    onChange={(e) => {
                      setOrganizer(e.target.value)
                      markDirty()
                    }}
                    placeholder="Nama penyelenggara"
                    className="h-9 border-zinc-200 focus-visible:ring-zinc-950"
                  />
                </Field>

                <Field label="Fotografer (Opsional)" icon={<Camera className="size-4 text-zinc-400" />}>
                  <Input
                    value={photographer}
                    onChange={(e) => {
                      setPhotographer(e.target.value)
                      markDirty()
                    }}
                    placeholder="Nama fotografer acara"
                    className="h-9 border-zinc-200 focus-visible:ring-zinc-950"
                  />
                </Field>
                
                <Field label="Tautan Pendaftaran (Opsional)" icon={<Link2 className="size-4 text-zinc-400" />}>
                  <Input
                    type="url"
                    value={registrationUrl}
                    onChange={(e) => {
                      setRegistrationUrl(e.target.value)
                      markDirty()
                    }}
                    placeholder="https://..."
                    className="h-9 border-zinc-200 focus-visible:ring-zinc-950"
                  />
                </Field>
                
                <Field label="Tautan WhatsApp" icon={<MessageCircle className="size-4 text-zinc-400" />}>
                  <Input
                    type="url"
                    value={whatsappUrl}
                    onChange={(e) => {
                      setWhatsappUrl(e.target.value)
                      markDirty()
                    }}
                    onBlur={(e) => {
                      const formatted = formatWhatsappInput(e.target.value)
                      if (formatted !== e.target.value) {
                        setWhatsappUrl(formatted)
                        markDirty()
                      }
                    }}
                    placeholder="https://wa.me/..."
                    className="h-9 border-zinc-200 focus-visible:ring-zinc-950"
                  />
                </Field>

              </div>
            </div>
          </aside>

        </div>
      </div>

      <ConfirmActionDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        title="Konfirmasi Archive Event"
        description={"Event ini akan diturunkan dari halaman publik dan tersimpan sebagai Arsip."}
        confirmText="Ya, Archive Event"
        variant="default"
        isLoading={isPending}
        onConfirm={handleArchive}
      />

      <ConfirmActionDialog
        open={republishDialogOpen}
        onOpenChange={setRepublishDialogOpen}
        title="Konfirmasi Publikasi Ulang"
        description={"Event ini akan kembali tampil pada halaman publik."}
        confirmText="Ya, Publikasikan"
        variant="default"
        isLoading={isPending}
        onConfirm={handleRepublish}
      />

      {/* Sticky Footer */}
      <div
        className={cn(
          "fixed bottom-0 right-0 z-40 bg-white border-t border-zinc-200 p-4 shadow-[0_-4px_6px_-1px_rgba(0,0,0,0.05)] transition-all duration-300",
          collapsed ? "left-0 lg:left-16" : "left-0 lg:left-64"
        )}
      >
        <div className="max-w-[1240px] mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="hidden sm:block">
              <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-zinc-500">
                Status Event
              </span>
              <p className="text-sm font-bold mt-0.5 text-black">{initialEvent?.statusLabel || "Draft Baru"}</p>
            </div>
          </div>
          <div className="flex flex-wrap items-center justify-end gap-2 w-full sm:w-auto">
            {canArchive && (
              <Button
                type="button"
                variant="ghost"
                disabled={isBusy}
                onClick={() => setArchiveDialogOpen(true)}
                className="flex-1 sm:flex-none h-11 px-4 text-red-600 hover:bg-red-50 hover:text-red-700 rounded-[3px] font-bold tracking-widest text-[10px] uppercase"
              >
                {isPending && archiveDialogOpen ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Archive className="size-3.5 mr-1.5" />}
                ARSIPKAN
              </Button>
            )}

            {canRepublish && (
              <Button
                type="button"
                variant="ghost"
                disabled={isBusy}
                onClick={() => setRepublishDialogOpen(true)}
                className="flex-1 sm:flex-none h-11 px-4 text-emerald-600 hover:bg-emerald-50 hover:text-emerald-700 rounded-[3px] font-bold tracking-widest text-[10px] uppercase"
              >
                {isPending && republishDialogOpen ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <RotateCcw className="size-3.5 mr-1.5" />}
                PUBLIKASI ULANG
              </Button>
            )}

            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => void handlePreview()}
              className="flex-1 sm:flex-none h-11 px-6 border-zinc-300 text-zinc-600 hover:bg-zinc-100 rounded-[3px] font-bold tracking-widest text-[10px] uppercase transition-colors"
            >
              {isPending ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Eye className="size-3.5 mr-1.5" />}
              PREVIEW
            </Button>

            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => void handleSave()}
              className="flex-1 sm:flex-none h-11 px-6 border-black text-black hover:bg-black hover:text-white rounded-[3px] font-bold tracking-widest text-[10px] uppercase transition-colors"
            >
              {isPending ? <Loader2 className="size-3.5 animate-spin mr-1.5" /> : <Save className="size-3.5 mr-1.5" />}
              {initialEvent ? "SIMPAN" : "DRAF"}
            </Button>

            {canPost && (
              <Button
                type="button"
                disabled={isBusy}
                onClick={() => void handlePost()}
                className="flex-1 sm:flex-none w-full sm:w-auto h-11 px-8 bg-black text-white hover:bg-zinc-800 rounded-[3px] font-bold tracking-widest text-[10px] uppercase"
              >
                {isPending ? <Loader2 className="size-4 animate-spin mr-2" /> : <Send className="size-3.5 mr-2" />}
                POST SEKARANG
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


function Field({
  children,
  icon,
  label,
}: {
  children: React.ReactNode
  icon?: React.ReactNode
  label: string
}) {
  return (
    <div className="space-y-2">
      <label className="flex items-center gap-1.5 text-sm font-medium">
        {icon}
        {label}
      </label>
      {children}
    </div>
  )
}
