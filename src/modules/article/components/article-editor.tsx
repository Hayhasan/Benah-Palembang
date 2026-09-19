"use client"

import { Archive, Eye, Loader2, RotateCcw, Save, Send, X, Check, ChevronDown } from "lucide-react"
import { useRouter } from "next/navigation"
import { useCallback, useEffect, useState, useTransition } from "react"
import { toast } from "sonner"

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { TagInput } from "@/components/dashboard/TagInput"
import { TiptapEditor } from "@/components/dashboard/TiptapEditor"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { cn } from "@/lib/utils"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"
import { useDashboardSidebar } from "@/context/DashboardSidebarContext"
import { ArticleEditorHeroCarousel } from "./article-editor-hero-carousel"

import { archiveArticleAction } from "../actions/archive-article"
import { isResubmittableArticleStatus } from "../constants/article-status"
import { republishArticleAction } from "../actions/republish-article"
import { saveArticleAction } from "../actions/save-article"
import type {
  ArticleActionResult,
  ArticleCategoryOption,
  ArticleSaveIntent,
  OwnedArticleEditorData,
} from "../types/article"


const COUNTRY_CODES = [
  { label: "Indonesia (+62)", value: "+62" },
  { label: "Singapore (+65)", value: "+65" },
  { label: "Malaysia (+60)", value: "+60" },
  { label: "USA/Canada (+1)", value: "+1" },
  { label: "UK (+44)", value: "+44" },
  { label: "Australia (+61)", value: "+61" },
]
interface ArticleEditorProps {
  initialArticle?: OwnedArticleEditorData
  categories: ArticleCategoryOption[]
}

export function ArticleEditor({
  initialArticle,
  categories,
}: ArticleEditorProps) {
  const router = useRouter()
  const { collapsed } = useDashboardSidebar()
  const { registerSaveHandler, setIsDirty } = useUnsavedChanges()
  const [isPending, startTransition] = useTransition()
  const [articleId, setArticleId] = useState(initialArticle?.id)
  const [status, setStatus] = useState(initialArticle?.status)
  const [title, setTitle] = useState(initialArticle?.title ?? "")
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt ?? "")
  const [content, setContent] = useState(initialArticle?.content ?? "")
  const [label, setLabel] = useState(initialArticle?.label ?? "")
  const [coverImageUrl, setCoverImageUrl] = useState(
    initialArticle?.coverImageUrl ?? "",
  )
  const [websiteArticleSectionId, setWebsiteArticleSectionId] = useState<number>(
    initialArticle?.websiteArticleSectionId ?? categories[0]?.id ?? 1,
  )
  const [tags, setTags] = useState(
    initialArticle?.tags ?? ["Palembang", "Budaya"],
  )
  const [archiveDialogOpen, setArchiveDialogOpen] = useState(false)
  const [republishDialogOpen, setRepublishDialogOpen] = useState(false)
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [bannerDialogOpen, setBannerDialogOpen] = useState(false)
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false)
  const [additionalBannerUrls, setAdditionalBannerUrls] = useState<string[]>(initialArticle?.additionalBannerUrls ?? [])
  const [photographer, setPhotographer] = useState(initialArticle?.photographer ?? "")
  const [additionalPhotographers, setAdditionalPhotographers] = useState<string[]>(initialArticle?.additionalPhotographers ?? [])
  const [venueName, setVenueName] = useState(initialArticle?.venueName ?? "")
  const [venueAddress, setVenueAddress] = useState(initialArticle?.venueAddress ?? "")
  const [venuePriceLevel, setVenuePriceLevel] = useState<number>(initialArticle?.venuePriceLevel ?? 1)
  
  const PRESET_DAYS = [
    "Setiap Hari (Sen - Min)",
    "Senin - Jumat",
    "Senin - Sabtu",
    "Sabtu - Minggu",
  ]
  
  const ALLOWED_MAPPING: Record<string, string> = {
    "featured": "Cerita Warga",
    "gaya-hidup": "Gaya Hidup",
    "ruang-kota": "Ruang Kota",
    "industri-kreatif": "Industri Kreatif",
    "kebudayaan": "Kebudayaan"
  }
  
  const filteredCategories = categories
    .filter(cat => ALLOWED_MAPPING[cat.sectionKey])
    .map(cat => ({
      ...cat,
      label: ALLOWED_MAPPING[cat.sectionKey]
    }))
  
  const [dayOption, setDayOption] = useState(() => {
    if (!initialArticle?.venueOpenDays) return ""
    return PRESET_DAYS.includes(initialArticle.venueOpenDays) ? initialArticle.venueOpenDays : "custom"
  })
  const [customDays, setCustomDays] = useState(() => {
    if (!initialArticle?.venueOpenDays) return ""
    return !PRESET_DAYS.includes(initialArticle.venueOpenDays) ? initialArticle.venueOpenDays : ""
  })
  
  const [openTime, setOpenTime] = useState(() => {
    if (!initialArticle?.venueOpenHours) return ""
    return initialArticle.venueOpenHours.split("-")[0]?.trim() || ""
  })
  const [closeTime, setCloseTime] = useState(() => {
    if (!initialArticle?.venueOpenHours) return ""
    return initialArticle.venueOpenHours.split("-")[1]?.trim() || ""
  })

  const [venueFeatures, setVenueFeatures] = useState<string[]>(initialArticle?.venueFeatures ?? [])
  
  const [contactNumber, setContactNumber] = useState(() => {
    if (!initialArticle?.venueContact) return ""
    if (initialArticle.venueContact.startsWith("+62")) {
      return initialArticle.venueContact.substring(3)
    }
    return initialArticle.venueContact
  })
  const [countryCode, setCountryCode] = useState(() => {
    if (initialArticle?.venueContact?.startsWith("+62")) return "+62"
    return "+62"
  })
  const [openCountrySelect, setOpenCountrySelect] = useState(false)

  const markDirty = () => setIsDirty(true)

  const actionPayload = useCallback(
    (intent: ArticleSaveIntent) => ({
      id: articleId,
      intent,
      title,
      excerpt,
      content,
      label,
      coverImageUrl,
      websiteArticleSectionId,
      tags,
      additionalBannerUrls,
      photographer,
      additionalPhotographers,
      venueName,
      venueAddress,
      venuePriceLevel,
      venueOpenDays: dayOption === "custom" ? customDays : (dayOption || undefined),
      venueOpenHours: openTime && closeTime ? `${openTime} - ${closeTime}` : undefined,
      venueFeatures,
      venueContact: contactNumber ? `${countryCode}${contactNumber.replace(/^0+/, "")}` : undefined,
    }),
    [
      articleId,
      content,
      label,
      coverImageUrl,
      excerpt,
      tags,
      title,
      websiteArticleSectionId,
      additionalBannerUrls,
      photographer,
      additionalPhotographers,
      venueName,
      venueAddress,
      venuePriceLevel,
      dayOption,
      customDays,
      openTime,
      closeTime,
      venueFeatures,
      contactNumber,
      countryCode,
    ],
  )

  const runSaveAction = useCallback(
    (intent: ArticleSaveIntent) =>
      new Promise<ArticleActionResult>((resolve) => {
        startTransition(async () => {
          resolve(await saveArticleAction(actionPayload(intent)))
        })
      }),
    [actionPayload],
  )

  const saveArticle = useCallback(
    async (intent: ArticleSaveIntent) => {
      const result = await runSaveAction(intent)
      if (!result.success) {
        toast.error(result.message)
        return null
      }

      setArticleId(result.id)
      setStatus(result.status)
      setIsDirty(false)
      toast.success(result.message)
      return result
    },
    [runSaveAction, setIsDirty],
  )

  useEffect(() => {
    registerSaveHandler(async () => Boolean(await saveArticle("SAVE")))
    return () => registerSaveHandler(null)
  }, [registerSaveHandler, saveArticle])

  useEffect(
    () => () => {
      setIsDirty(false)
    },
    [setIsDirty],
  )

  async function handleSave() {
    const result = await saveArticle("SAVE")
    if (!result) return

    if (!initialArticle) {
      router.replace(`/dashboard/create-article/edit?id=${result.id}`)
    } else {
      router.push("/dashboard/create-article")
    }
    router.refresh()
  }

  async function handlePost() {
    const result = await saveArticle("POST")
    if (!result) return

    router.push("/dashboard/create-article")
    router.refresh()
  }

  async function handlePreview() {
    const result = await saveArticle("SAVE")
    if (!result) return

    router.push(`/dashboard/create-article/preview/${result.id}`)
  }

  function handleArchive() {
    if (!articleId) return

    startTransition(async () => {
      const result = await archiveArticleAction({ id: articleId })
      if (!result.success) {
        toast.error(result.message)
        return
      }

      setIsDirty(false)
      toast.success(result.message)
      setArchiveDialogOpen(false)
      router.push("/dashboard/create-article")
      router.refresh()
    })
  }

  function handleRepublish() {
    if (!articleId) return

    startTransition(async () => {
      const result = await republishArticleAction({ id: articleId })
      if (!result.success) {
        toast.error(result.message)
        return
      }

      setIsDirty(false)
      toast.success(result.message)
      setRepublishDialogOpen(false)
      router.push("/dashboard/create-article")
      router.refresh()
    })
  }

  const canPost =
    status === undefined || isResubmittableArticleStatus(status)
  const canArchive = status === "PUBLISHED" && articleId !== undefined
  const canRepublish = status === "ARCHIVED" && articleId !== undefined
  const isBusy = isPending || isUploadingBanner || isUploadingContentImage
  const bannerPhotos = [coverImageUrl, ...additionalBannerUrls.filter(Boolean)].filter(Boolean)

  return (
    <div className="bg-white text-zinc-900 min-h-screen pb-32 -mx-4 sm:-mx-6 md:-mx-10 -mt-4 sm:-mt-6 md:-mt-10">
      {/* 1. HEROES CAROUSEL AT THE VERY TOP (Layaknya pada halaman detail artikel public) */}
      <ArticleEditorHeroCarousel
        photos={bannerPhotos}
        title={title}
        onTitleChange={(val) => {
          setTitle(val)
          markDirty()
        }}
        excerpt={excerpt}
        onExcerptChange={(val) => {
          setExcerpt(val)
          markDirty()
        }}
        photographerName={photographer}
        label={label}
        onOpenUploadModal={() => setBannerDialogOpen(true)}
      />

      {/* Banner Upload Modal */}
      <Dialog open={bannerDialogOpen} onOpenChange={setBannerDialogOpen}>
        <DialogContent className="sm:max-w-5xl lg:max-w-6xl bg-white border-zinc-200 text-zinc-900 p-0 overflow-hidden flex flex-col max-h-[90vh]">
          <DialogHeader className="px-6 py-4 border-b border-zinc-200 shrink-0">
            <DialogTitle className="text-zinc-900">Upload Banner Artikel</DialogTitle>
            <DialogDescription className="text-zinc-500">
              Upload foto utama dan hingga 4 foto tambahan untuk artikel ini.
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className={cn(
              "mt-4",
              coverImageUrl ? "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4" : "block"
            )}>
              {/* Main Banner */}
              <div className={cn(
                "relative group space-y-2",
                coverImageUrl ? "w-full aspect-[3/2]" : "w-full aspect-[4/3] sm:aspect-[21/9]"
              )}>
                <div className="absolute top-2 left-2 z-20 pointer-events-none rounded bg-black/60 px-2 py-1 text-xs font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                  Banner Utama (Wajib)
                </div>
                <div className="h-full w-full overflow-hidden rounded-xl bg-zinc-100 border border-zinc-200 shadow-sm">
                  <ImageUpload
                    value={coverImageUrl}
                    onChange={(value) => {
                      setCoverImageUrl(value)
                      markDirty()
                    }}
                    uploadScope="article"
                    onUploadingChange={setIsUploadingBanner}
                    aspect={coverImageUrl ? 3 / 2 : 21 / 9}
                    placeholder="Klik untuk upload banner utama..."
                    className="h-full w-full opacity-90 hover:opacity-100 transition-opacity"
                  />
                </div>
              </div>

              {/* Additional Banners */}
              {coverImageUrl && [0, 1, 2, 3].map((index) => {
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
                        uploadScope="article"
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



      {status === "REJECTED" || status === "TAKEN_DOWN" ? (
        <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 mt-6">
          <div className="rounded-[3px] border border-red-200 bg-red-50 p-4 text-sm">
            <p className="font-bold text-red-700 uppercase tracking-wider text-xs">
              {status === "REJECTED"
                ? "Artikel ini ditolak admin"
                : "Artikel ini diturunkan admin"}
            </p>
            <p className="mt-1 font-serif text-red-700/90">
              {initialArticle?.moderationNote ||
                "Admin tidak mencantumkan alasan. Silakan hubungi admin sebelum mengajukan ulang."}
            </p>
          </div>
        </div>
      ) : null}

      {/* 3. CONTENT AREA: ARTICLE BODY (LEFT) & SIDEBAR (RIGHT) */}
      <main className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-16 sm:pb-20">
        <div className="grid grid-cols-1 lg:grid-cols-[1fr_290px] xl:grid-cols-[1fr_310px] gap-10 xl:gap-16 items-start">
          
          {/* LEFT: Main Article Column */}
          <article className="min-w-0 flex flex-col">
            
            {/* Label Artikel */}
            <div className="mb-4 space-y-1.5 text-left w-full">
              <label className="font-sans text-[10px] font-bold tracking-[0.14em] uppercase text-zinc-500">
                LABEL ARTIKEL (OPSIONAL)
              </label>
              <Input
                value={label}
                onChange={(event) => {
                  setLabel(event.target.value)
                  markDirty()
                }}
                placeholder="Contoh: Liputan Khusus"
                className="h-10 text-sm rounded-[3px] border-zinc-300 bg-white"
              />
            </div>

            <div className="border border-zinc-200/60 rounded-xl bg-zinc-50/50 p-2 sm:p-4 mb-6 shadow-sm focus-within:bg-white focus-within:border-zinc-300 transition-colors">
              <div className="article-body prose prose-zinc max-w-none prose-headings:font-sans prose-headings:font-bold prose-p:font-serif prose-p:text-[15px] sm:prose-p:text-base prose-p:leading-[1.8] prose-p:text-zinc-800 focus:outline-none min-h-[500px] w-full">
                <TiptapEditor
                  content={content}
                  imageUploadScope="article"
                  onUploadingChange={setIsUploadingContentImage}
                  onChange={(value) => {
                    setContent(value)
                    markDirty()
                  }}
                />
              </div>
            </div>

            {/* Tags */}
            <div className="mt-4 flex flex-col gap-2 border-t border-zinc-100 pt-6">
              <span className="font-sans text-[11px] font-bold tracking-[0.14em] uppercase text-zinc-500">
                TAGS ARTIKEL
              </span>
              <div className="bg-transparent border-zinc-300">
                <TagInput
                  tags={tags}
                  setTags={(value) => {
                    setTags(value)
                    markDirty()
                  }}
                  placeholder="Ketik tag lalu tekan enter..."
                />
              </div>
            </div>
          </article>

          {/* RIGHT: Sidebar */}
          <aside className="w-full lg:sticky lg:top-24 space-y-10 flex flex-col items-center lg:items-start text-center lg:text-left">
            
            {/* Action Buttons Panel removed, moved to sticky footer */}

            {/* Kategori Artikel */}
            <div className="w-full max-w-[280px] sm:max-w-[300px] text-zinc-900">
              <div>
                <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
                  KATEGORI ARTIKEL
                </span>
                <div className="mt-1.5 mb-3.5 border-b border-dotted border-zinc-300 w-full" />
              </div>
              <div className="relative inline-flex items-center w-full">
                <select
                  value={websiteArticleSectionId}
                  onChange={(event) => {
                    setWebsiteArticleSectionId(Number(event.target.value))
                    markDirty()
                  }}
                  className="w-full appearance-none rounded-[3px] bg-black text-white border border-black pl-4 pr-10 py-2.5 text-xs font-bold uppercase tracking-[0.14em] hover:bg-zinc-800 transition-colors cursor-pointer outline-none focus:ring-2 focus:ring-zinc-400"
                >
                  {filteredCategories.map((cat) => (
                    <option key={cat.id} value={cat.id}>
                      {cat.label}
                    </option>
                  ))}
                </select>
                <ChevronDown className="absolute right-3 size-4 text-white pointer-events-none" />
              </div>
            </div>

            {/* Author Profile */}
            <div className="w-full max-w-[280px] sm:max-w-[300px] text-zinc-900">
              <div>
                <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
                  KREDIT PENULIS & FOTOGRAFER
                </span>
                <div className="mt-1.5 mb-3.5 border-b border-dotted border-zinc-300 w-full" />
              </div>
              
              <div className="space-y-4">
                <div className="space-y-1.5 text-left">
                  <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-zinc-500">Fotografer Utama</label>
                  <Input
                    value={photographer}
                    onChange={(event) => {
                      setPhotographer(event.target.value)
                      markDirty()
                    }}
                    placeholder="Nama Fotografer Utama"
                    className="h-9 text-sm rounded-[3px] border-zinc-300 bg-white"
                  />
                </div>

                {additionalPhotographers.map((name, index) => (
                  <div key={`photo-credit-${index}`} className="space-y-1.5 text-left">
                    <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-zinc-500">Fotografer Tambahan {index + 1}</label>
                    <Input
                      value={name}
                      onChange={(event) => {
                        const newPhotographers = [...additionalPhotographers]
                        newPhotographers[index] = event.target.value
                        setAdditionalPhotographers(newPhotographers)
                        markDirty()
                      }}
                      placeholder={`Nama Fotografer ${index + 1}`}
                      className="h-9 text-sm rounded-[3px] border-zinc-300 bg-white"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Venue / Spot Information */}
            <div className="w-full max-w-[280px] sm:max-w-[300px] text-zinc-900 border border-zinc-200 rounded-xl overflow-hidden bg-white shadow-sm">
              <div className="bg-zinc-50 px-5 py-4 border-b border-zinc-200">
                <span className="font-sans text-[11px] sm:text-xs font-bold tracking-[0.14em] uppercase text-black">
                  INFO SPOT / TEMPAT (OPSIONAL)
                </span>
              </div>
              
              <div className="p-5 space-y-5 text-left">
                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-zinc-500">Nama Tempat</label>
                  <Input
                    value={venueName}
                    onChange={(event) => {
                      setVenueName(event.target.value)
                      markDirty()
                    }}
                    placeholder="Contoh: Ayam Goreng Buni"
                    className="h-9 text-sm rounded-[3px] border-zinc-300"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-zinc-500 flex items-center justify-between">
                    <span>Level Harga</span>
                    <span className="text-black">{venuePriceLevel} / 5</span>
                  </label>
                  <div className="flex items-center gap-1.5">
                    {[1, 2, 3, 4, 5].map((level) => (
                      <button
                        key={level}
                        type="button"
                        onClick={() => {
                          setVenuePriceLevel(level)
                          markDirty()
                        }}
                        className={`size-6 rounded-full border transition-all cursor-pointer ${
                          level <= venuePriceLevel
                            ? "bg-black border-black shadow-sm"
                            : "bg-zinc-100 border-zinc-200 hover:bg-zinc-200"
                        }`}
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-zinc-500">Alamat Lengkap</label>
                  <textarea
                    value={venueAddress}
                    onChange={(event) => {
                      setVenueAddress(event.target.value)
                      markDirty()
                    }}
                    rows={2}
                    className="w-full rounded-[3px] border border-zinc-300 bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring resize-none"
                    placeholder="Jl. Dempo Luar No. 18..."
                  />
                </div>

                <div className="space-y-3">
                  <div className="space-y-1.5">
                    <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-zinc-500">Hari Buka</label>
                    <select
                      value={dayOption}
                      onChange={(event) => {
                        setDayOption(event.target.value)
                        markDirty()
                      }}
                      className="flex h-9 w-full rounded-[3px] border border-zinc-300 bg-transparent px-3 py-1 text-sm outline-none focus:ring-1 focus:ring-ring"
                    >
                      <option value="">(Pilih hari...)</option>
                      {PRESET_DAYS.filter(d => d).map(d => (
                        <option key={d} value={d}>{d}</option>
                      ))}
                      <option value="custom">Custom (Ketik Sendiri)</option>
                    </select>
                    {dayOption === "custom" && (
                      <Input
                        value={customDays}
                        onChange={(event) => {
                          setCustomDays(event.target.value)
                          markDirty()
                        }}
                        placeholder="Ketik hari operasional..."
                        className="h-9 mt-1.5 text-sm rounded-[3px] border-zinc-300"
                      />
                    )}
                  </div>
                  <div className="space-y-1.5">
                    <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-zinc-500">Jam Operasional</label>
                    <div className="flex items-center gap-2">
                      <Input
                        type="time"
                        value={openTime}
                        onChange={(event) => {
                          setOpenTime(event.target.value)
                          markDirty()
                        }}
                        className="h-9 px-2 text-sm rounded-[3px] border-zinc-300"
                      />
                      <span className="text-zinc-400">-</span>
                      <Input
                        type="time"
                        value={closeTime}
                        onChange={(event) => {
                          setCloseTime(event.target.value)
                          markDirty()
                        }}
                        className="h-9 px-2 text-sm rounded-[3px] border-zinc-300"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-zinc-500">Fasilitas / Info Tambahan</label>
                  <div className="border-zinc-300 rounded-[3px]">
                    <TagInput
                      tags={venueFeatures}
                      setTags={(value) => {
                        setVenueFeatures(value)
                        markDirty()
                      }}
                      allowSpaces={true}
                      prefix=""
                      placeholder="Ketik fasilitas..."
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="font-sans text-[10px] font-bold tracking-widest uppercase text-zinc-500">Kontak Telepon</label>
                  <div className="flex gap-1.5">
                    <Popover open={openCountrySelect} onOpenChange={setOpenCountrySelect}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="outline"
                          role="combobox"
                          aria-expanded={openCountrySelect}
                          className="h-9 w-[70px] justify-between font-normal px-2 rounded-[3px] border-zinc-300"
                        >
                          <span className="truncate text-xs">
                            {countryCode || "+62"}
                          </span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-[200px] p-0">
                        <Command>
                          <CommandInput placeholder="Cari negara..." />
                          <CommandList>
                            <CommandEmpty>Tidak ditemukan.</CommandEmpty>
                            <CommandGroup>
                              {COUNTRY_CODES.map((c) => (
                                <CommandItem
                                  key={c.value}
                                  value={c.label}
                                  onSelect={(currentValue: string) => {
                                    const selected = COUNTRY_CODES.find(
                                      (item) => item.label.toLowerCase() === currentValue.toLowerCase()
                                    )
                                    setCountryCode(selected ? selected.value : "+62")
                                    setOpenCountrySelect(false)
                                    markDirty()
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      "mr-2 size-4",
                                      countryCode === c.value ? "opacity-100" : "opacity-0"
                                    )}
                                  />
                                  <span className="text-xs">{c.label}</span>
                                </CommandItem>
                              ))}
                            </CommandGroup>
                          </CommandList>
                        </Command>
                      </PopoverContent>
                    </Popover>
                    <Input
                      value={contactNumber}
                      onChange={(event) => {
                        setContactNumber(event.target.value)
                        markDirty()
                      }}
                      placeholder="81234567890"
                      className="h-9 flex-1 text-sm rounded-[3px] border-zinc-300"
                    />
                  </div>
                </div>

              </div>
            </div>
          </aside>
        </div>
      </main>

      <ConfirmActionDialog
        open={archiveDialogOpen}
        onOpenChange={setArchiveDialogOpen}
        title="Arsipkan Artikel?"
        description="Artikel ini tidak akan tampil lagi di halaman publik namun tetap tersimpan sebagai draf/arsip."
        onConfirm={handleArchive}
        confirmText="Arsipkan"
      />

      <ConfirmActionDialog
        open={republishDialogOpen}
        onOpenChange={setRepublishDialogOpen}
        title="Publikasikan Ulang Artikel?"
        description="Artikel ini akan kembali tayang di halaman publik."
        onConfirm={handleRepublish}
        confirmText="Publikasikan Ulang"
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
                Status Artikel
              </span>
              <p className="text-sm font-bold mt-0.5 text-black">{status === "PUBLISHED" ? "Dipublikasikan" : status === "ARCHIVED" ? "Diarsipkan" : status === "REJECTED" ? "Ditolak" : status === "TAKEN_DOWN" ? "Diturunkan" : "Draf"}</p>
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
              {initialArticle ? "SIMPAN" : "DRAF"}
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
