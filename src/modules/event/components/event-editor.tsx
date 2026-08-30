"use client"

import {
  Archive,
  Building,
  Calendar,
  Clock,
  Eye,
  Link2,
  MapPin,
  MessageCircle,
  Save,
  Send,
} from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { TagInput } from "@/components/dashboard/TagInput"
import { TiptapEditor } from "@/components/dashboard/TiptapEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"

import { archiveEventAction } from "../actions/archive-event"
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
  const [category, setCategory] = useState(
    initialEvent?.category ?? "Festival",
  )
  const [startsOn, setStartsOn] = useState(initialEvent?.startsOn ?? "")
  const [startsTime, setStartsTime] = useState(
    initialEvent?.startsTime ?? "",
  )
  const [location, setLocation] = useState(initialEvent?.location ?? "")
  const [organizer, setOrganizer] = useState(initialEvent?.organizer ?? "")
  const [registrationUrl, setRegistrationUrl] = useState(
    initialEvent?.registrationUrl ?? "",
  )
  const [whatsappUrl, setWhatsappUrl] = useState(
    initialEvent?.whatsappUrl ?? "",
  )
  const [tags, setTags] = useState(initialEvent?.tags ?? ["Palembang", "Event"])
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
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
      category,
      startsOn,
      startsTime,
      location,
      organizer,
      registrationUrl,
      whatsappUrl,
      tags,
    }),
    [
      bannerUrl,
      category,
      content,
      description,
      eventId,
      location,
      organizer,
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
      router.push("/dashboard/create-event")
      router.refresh()
    })
  }

  const canPost = status === undefined || status === "DRAFT"
  const canArchive = status === "PUBLISHED" && eventId !== undefined
  const isBusy = isPending || isUploadingBanner || isUploadingContentImage

  return (
    <div className="space-y-8 pb-10">
      <div className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/85 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              {initialEvent ? "Edit Event" : "Buat Event Baru"}
            </h2>
            {initialEvent ? (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                {initialEvent.statusLabel}
              </span>
            ) : null}
          </div>
          <p className="text-muted-foreground">
            Simpan Event sebagai draf atau ajukan untuk ditampilkan di Agenda.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={() => void handleSave()}
            className="gap-2"
          >
            <Save className="size-4" />
            {initialEvent ? "Save Event" : "Simpan Draf"}
          </Button>
          <Button
            type="button"
            variant="outline"
            disabled={isBusy}
            onClick={() => void handlePreview()}
            className="gap-2"
          >
            <Eye className="size-4" />
            Preview
          </Button>
          {canPost ? (
            <Button
              type="button"
              disabled={isBusy}
              onClick={() => void handlePost()}
              className="gap-2 bg-emerald-600 text-white hover:bg-emerald-700"
            >
              <Send className="size-4" />
              Post
            </Button>
          ) : null}
          {canArchive ? (
            <Button
              type="button"
              variant="outline"
              disabled={isBusy}
              onClick={() => setArchiveDialogOpen(true)}
              className="gap-2 border-red-200 text-red-600 hover:bg-red-50"
            >
              <Archive className="size-4" />
              Archive
            </Button>
          ) : null}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-4">
        <div className="space-y-6 lg:col-span-3">
          <div className="space-y-4 rounded-xl border bg-background p-5 shadow-sm">
            <Field label="Judul Event">
              <Input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  markDirty()
                }}
                placeholder="Nama acara..."
                className="text-lg font-semibold"
              />
            </Field>
            <Field label="Deskripsi Singkat">
              <textarea
                value={description}
                onChange={(event) => {
                  setDescription(event.target.value)
                  markDirty()
                }}
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Ringkasan tentang Event..."
              />
            </Field>
          </div>

          <div className="space-y-4 rounded-xl border bg-background p-5 shadow-sm">
            <h3 className="border-b pb-2 text-base font-semibold">
              Informasi & Waktu Pelaksanaan
            </h3>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Tanggal Event"
                icon={<Calendar className="size-4 text-muted-foreground" />}
              >
                <Input
                  type="date"
                  value={startsOn}
                  onChange={(event) => {
                    setStartsOn(event.target.value)
                    markDirty()
                  }}
                />
              </Field>
              <Field
                label="Waktu Pelaksanaan"
                icon={<Clock className="size-4 text-muted-foreground" />}
              >
                <Input
                  type="time"
                  value={startsTime}
                  onChange={(event) => {
                    setStartsTime(event.target.value)
                    markDirty()
                  }}
                />
              </Field>
            </div>
            <Field
              label="Lokasi Acara"
              icon={<MapPin className="size-4 text-muted-foreground" />}
            >
              <Input
                value={location}
                onChange={(event) => {
                  setLocation(event.target.value)
                  markDirty()
                }}
                placeholder="Misal: Plaza Benteng Kuto Besak, Palembang"
              />
            </Field>
            <Field
              label="Penyelenggara / Organizer"
              icon={<Building className="size-4 text-muted-foreground" />}
            >
              <Input
                value={organizer}
                onChange={(event) => {
                  setOrganizer(event.target.value)
                  markDirty()
                }}
                placeholder="Misal: Komunitas Seni Wong Kito"
              />
            </Field>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field
                label="Tautan Pendaftaran / Tiket (Opsional)"
                icon={<Link2 className="size-4 text-muted-foreground" />}
              >
                <Input
                  type="url"
                  value={registrationUrl}
                  onChange={(event) => {
                    setRegistrationUrl(event.target.value)
                    markDirty()
                  }}
                  placeholder="https://..."
                />
              </Field>
              <Field
                label="Tautan WhatsApp Tombol Tanya"
                icon={
                  <MessageCircle className="size-4 text-muted-foreground" />
                }
              >
                <Input
                  type="url"
                  required
                  value={whatsappUrl}
                  onChange={(event) => {
                    setWhatsappUrl(event.target.value)
                    markDirty()
                  }}
                  placeholder="https://wa.me/628xxxxxxxxxx"
                />
                <p className="text-xs leading-5 text-muted-foreground">
                  Wajib memakai kode negara 62 tanpa tanda plus, spasi, atau
                  tanda hubung.
                </p>
              </Field>
            </div>
          </div>

          <Field label="Detail & Rangkaian Acara">
            <TiptapEditor
              content={content}
              imageUploadScope="event"
              onUploadingChange={setIsUploadingContentImage}
              onChange={(value) => {
                setContent(value)
                markDirty()
              }}
            />
          </Field>
        </div>

        <div className="space-y-6 lg:col-span-1">
          <div className="space-y-5 overflow-hidden rounded-xl border bg-background p-5 shadow-sm">
            <Field label="Banner Event">
              <ImageUpload
                value={bannerUrl}
                onChange={(value) => {
                  setBannerUrl(value)
                  markDirty()
                }}
                uploadScope="event"
                onUploadingChange={setIsUploadingBanner}
                aspect={16 / 9}
                placeholder="Upload poster/banner..."
              />
            </Field>
            <Field label="Kategori Acara">
              <select
                value={category}
                onChange={(event) => {
                  setCategory(event.target.value)
                  markDirty()
                }}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {EVENT_CATEGORIES.map((item) => (
                  <option key={item} value={item}>
                    {item}
                  </option>
                ))}
              </select>
            </Field>
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
      </div>

      <ConfirmActionDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        title="Konfirmasi Archive Event"
        description={`Event "${title || "ini"}" akan diarsipkan dan tidak lagi tampil pada halaman publik maupun daftar Event aktif.`}
        confirmText="Ya, Archive Event"
        variant="destructive"
        onConfirm={handleArchive}
      />
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
