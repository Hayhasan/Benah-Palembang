"use client"

import Link from "next/link"
import {
  ChevronDown,
  ChevronUp,
  ExternalLink,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
} from "lucide-react"
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useTransition,
  type ReactNode,
} from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Textarea } from "@/components/ui/textarea"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"

import { updateLandingPageAction } from "../actions/update-landing-page"
import type {
  LandingArticleSectionEditorData,
  LandingExploreItemEditorData,
  LandingHeroSlideEditorData,
  LandingPageEditorData,
  LandingTeamMemberEditorData,
} from "../types/landing-page-editor"

const tabs = [
  { label: "Home", available: true },
  { label: "Article", available: false },
  { label: "Agenda", available: false },
  { label: "Collaboration", available: false },
  { label: "Header & Footer", available: false },
]

function SectionCard({
  title,
  description,
  children,
  defaultOpen = false,
}: {
  title: string
  description: string
  children: ReactNode
  defaultOpen?: boolean
}) {
  const [isOpen, setIsOpen] = useState(defaultOpen)

  return (
    <section className="overflow-hidden rounded-xl border bg-background shadow-sm">
      <button
        type="button"
        className="flex w-full items-center justify-between gap-4 bg-muted/30 p-4 text-left transition-colors hover:bg-muted/50"
        onClick={() => setIsOpen((current) => !current)}
        aria-expanded={isOpen}
      >
        <span>
          <span className="block font-display text-lg font-semibold">{title}</span>
          <span className="mt-1 block text-xs text-muted-foreground">
            {description}
          </span>
        </span>
        {isOpen ? (
          <ChevronUp className="size-4 shrink-0" />
        ) : (
          <ChevronDown className="size-4 shrink-0" />
        )}
      </button>
      {isOpen ? <div className="space-y-5 border-t p-5 sm:p-6">{children}</div> : null}
    </section>
  )
}

function Field({
  label,
  hint,
  children,
}: {
  label: string
  hint?: string
  children: ReactNode
}) {
  return (
    <div className="space-y-2">
      <div className="space-y-0.5">
        <Label>{label}</Label>
        {hint ? <p className="text-xs text-muted-foreground">{hint}</p> : null}
      </div>
      {children}
    </div>
  )
}

function VisibilityControl({
  checked,
  onCheckedChange,
}: {
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2 rounded-full border bg-background px-3 py-1.5">
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        aria-label="Tampilkan item"
      />
      <span className="text-xs font-medium">
        {checked ? "Ditampilkan" : "Disembunyikan"}
      </span>
    </div>
  )
}

function normalizePositions<T extends { position: number }>(items: T[]) {
  return items.map((item, index) => ({ ...item, position: index + 1 }))
}

function moveRecord<T extends { position: number }>(
  records: T[],
  index: number,
  direction: -1 | 1,
) {
  const destination = index + direction
  if (destination < 0 || destination >= records.length) return records

  const next = [...records]
  ;[next[index], next[destination]] = [next[destination], next[index]]
  return normalizePositions(next)
}

function clientKey(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function CollectionActions({
  index,
  total,
  onMove,
  onRemove,
  removeDisabled = false,
}: {
  index: number
  total: number
  onMove: (direction: -1 | 1) => void
  onRemove?: () => void
  removeDisabled?: boolean
}) {
  return (
    <div className="flex items-center gap-1">
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => onMove(-1)}
        disabled={index === 0}
        aria-label="Pindah ke atas"
      >
        <ChevronUp className="size-4" />
      </Button>
      <Button
        type="button"
        variant="ghost"
        size="icon"
        className="size-8"
        onClick={() => onMove(1)}
        disabled={index === total - 1}
        aria-label="Pindah ke bawah"
      >
        <ChevronDown className="size-4" />
      </Button>
      {onRemove ? (
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="size-8 text-red-500 hover:bg-red-50 hover:text-red-600"
          onClick={onRemove}
          disabled={removeDisabled}
          aria-label="Hapus item"
        >
          <Trash2 className="size-4" />
        </Button>
      ) : null}
    </div>
  )
}

export function ManageLandingPageForm({
  initialData,
}: {
  initialData: LandingPageEditorData
}) {
  const [data, setData] = useState(initialData)
  const [isPending, startTransition] = useTransition()
  const dataRef = useRef(data)
  const { isDirty, setIsDirty, registerSaveHandler } = useUnsavedChanges()

  useEffect(() => {
    dataRef.current = data
  }, [data])

  const changeData = useCallback(
    (updater: (current: LandingPageEditorData) => LandingPageEditorData) => {
      setData(updater)
      setIsDirty(true)
    },
    [setIsDirty],
  )

  const handleSave = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        startTransition(async () => {
          try {
            const result = await updateLandingPageAction(dataRef.current)
            if (!result.success) {
              const field = result.field ? ` (${result.field})` : ""
              toast.error(`${result.message}${field}`)
              resolve(false)
              return
            }

            setData(result.data)
            dataRef.current = result.data
            setIsDirty(false)
            toast.success(result.message)
            resolve(true)
          } catch (error) {
            console.error("Failed to save website content:", error)
            toast.error("Konten Home gagal disimpan. Silakan coba lagi.")
            resolve(false)
          }
        })
      }),
    [setIsDirty, startTransition],
  )

  useEffect(() => {
    registerSaveHandler(handleSave)
    return () => registerSaveHandler(null)
  }, [handleSave, registerSaveHandler])

  useEffect(
    () => () => {
      setIsDirty(false)
    },
    [setIsDirty],
  )

  const updateHero = (
    clientKeyValue: string,
    values: Partial<LandingHeroSlideEditorData>,
  ) => {
    changeData((current) => ({
      ...current,
      heroSlides: current.heroSlides.map((slide) =>
        slide.clientKey === clientKeyValue ? { ...slide, ...values } : slide,
      ),
    }))
  }

  const updateExploreItem = (
    clientKeyValue: string,
    values: Partial<LandingExploreItemEditorData>,
  ) => {
    changeData((current) => ({
      ...current,
      explore: {
        ...current.explore,
        items: current.explore.items.map((item) =>
          item.clientKey === clientKeyValue ? { ...item, ...values } : item,
        ),
      },
    }))
  }

  const updateArticleSection = (
    clientKeyValue: string,
    values: Partial<LandingArticleSectionEditorData>,
  ) => {
    changeData((current) => ({
      ...current,
      articleSections: current.articleSections.map((section) =>
        section.clientKey === clientKeyValue
          ? { ...section, ...values }
          : section,
      ),
    }))
  }

  const updateTeamMember = (
    clientKeyValue: string,
    values: Partial<LandingTeamMemberEditorData>,
  ) => {
    changeData((current) => ({
      ...current,
      team: {
        ...current.team,
        members: current.team.members.map((member) =>
          member.clientKey === clientKeyValue ? { ...member, ...values } : member,
        ),
      },
    }))
  }

  return (
    <div className="space-y-8 pb-10">
      <header className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/90 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-3xl font-bold tracking-tight">Manage Website</h1>
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200">
              Home terhubung
            </span>
            {isDirty ? (
              <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700 ring-1 ring-amber-200">
                Belum disimpan
              </span>
            ) : null}
          </div>
          <p className="mt-1 text-muted-foreground">
            Atur konten landing page yang tampil pada website publik.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button asChild variant="outline">
            <Link href="/" target="_blank">
              <ExternalLink className="size-4" /> Lihat website
            </Link>
          </Button>
          <Button
            type="button"
            onClick={() => void handleSave()}
            disabled={isPending || !isDirty}
            className="bg-palembang-red text-white hover:bg-palembang-red/90"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </div>
      </header>

      <nav className="border-b" aria-label="Bagian website">
        <div className="flex gap-6 overflow-x-auto pb-px">
          {tabs.map((tab) => (
            <button
              key={tab.label}
              type="button"
              disabled={!tab.available}
              className={`whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors ${
                tab.available
                  ? "border-palembang-red text-palembang-red"
                  : "cursor-not-allowed border-transparent text-muted-foreground/60"
              }`}
              title={tab.available ? undefined : "Module ini belum terhubung"}
            >
              {tab.label}
              {!tab.available ? (
                <span className="ml-2 rounded bg-muted px-1.5 py-0.5 text-[10px] font-medium uppercase tracking-wide">
                  segera
                </span>
              ) : null}
            </button>
          ))}
        </div>
      </nav>

      <div className="max-w-4xl space-y-7">
        <SectionCard
          title="Hero Carousel"
          description="Kelola gambar, teks, visibilitas, dan urutan slide utama."
          defaultOpen
        >
          <div className="space-y-5">
            {data.heroSlides.map((slide, index) => (
              <div
                key={slide.clientKey}
                className="space-y-4 rounded-xl border bg-muted/10 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 text-sm font-semibold">
                    <GripVertical className="size-4 text-muted-foreground" />
                    Slide {index + 1}
                  </div>
                  <div className="flex items-center gap-2">
                    <VisibilityControl
                      checked={slide.isVisible}
                      onCheckedChange={(isVisible) =>
                        updateHero(slide.clientKey, { isVisible })
                      }
                    />
                    <CollectionActions
                      index={index}
                      total={data.heroSlides.length}
                      onMove={(direction) =>
                        changeData((current) => ({
                          ...current,
                          heroSlides: moveRecord(
                            current.heroSlides,
                            index,
                            direction,
                          ),
                        }))
                      }
                      onRemove={() =>
                        changeData((current) => ({
                          ...current,
                          heroSlides: normalizePositions(
                            current.heroSlides.filter(
                              (item) => item.clientKey !== slide.clientKey,
                            ),
                          ),
                        }))
                      }
                      removeDisabled={data.heroSlides.length === 1}
                    />
                  </div>
                </div>

                <Field
                  label="URL gambar"
                  hint="Gunakan URL HTTP(S). Upload file akan ditambahkan bersama integrasi Cloudinary."
                >
                  <Input
                    value={slide.imageUrl}
                    onChange={(event) =>
                      updateHero(slide.clientKey, { imageUrl: event.target.value })
                    }
                    placeholder="https://..."
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Alt gambar">
                    <Input
                      value={slide.imageAlt}
                      onChange={(event) =>
                        updateHero(slide.clientKey, { imageAlt: event.target.value })
                      }
                    />
                  </Field>
                  <Field label="Eyebrow">
                    <Input
                      value={slide.eyebrow}
                      onChange={(event) =>
                        updateHero(slide.clientKey, { eyebrow: event.target.value })
                      }
                    />
                  </Field>
                </div>
                <Field label="Judul">
                  <Textarea
                    value={slide.title}
                    onChange={(event) =>
                      updateHero(slide.clientKey, { title: event.target.value })
                    }
                    className="min-h-20"
                  />
                </Field>
                <Field label="Deskripsi">
                  <Textarea
                    value={slide.description}
                    onChange={(event) =>
                      updateHero(slide.clientKey, {
                        description: event.target.value,
                      })
                    }
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Label tombol">
                    <Input
                      value={slide.buttonLabel}
                      onChange={(event) =>
                        updateHero(slide.clientKey, {
                          buttonLabel: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="URL tombol">
                    <Input
                      value={slide.buttonUrl}
                      onChange={(event) =>
                        updateHero(slide.clientKey, { buttonUrl: event.target.value })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() =>
                changeData((current) => ({
                  ...current,
                  heroSlides: [
                    ...current.heroSlides,
                    {
                      id: null,
                      clientKey: clientKey("hero"),
                      imageUrl: "",
                      imageAlt: "",
                      eyebrow: "Cerita Kota",
                      title: "",
                      description: "",
                      buttonLabel: "Jelajahi cerita",
                      buttonUrl: "/cerita-warga",
                      position: current.heroSlides.length + 1,
                      isVisible: true,
                    },
                  ],
                }))
              }
            >
              <Plus className="size-4" /> Tambah slide
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="About Benah Palembang"
          description="Narasi pengenalan yang tampil setelah hero."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow">
              <Input
                value={data.about.eyebrow}
                onChange={(event) =>
                  changeData((current) => ({
                    ...current,
                    about: { ...current.about, eyebrow: event.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Est. dan kota">
              <Input
                value={data.about.establishedText}
                onChange={(event) =>
                  changeData((current) => ({
                    ...current,
                    about: {
                      ...current.about,
                      establishedText: event.target.value,
                    },
                  }))
                }
              />
            </Field>
          </div>
          <Field label="Judul">
            <Textarea
              value={data.about.title}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  about: { ...current.about, title: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Deskripsi">
            <Textarea
              value={data.about.description}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  about: { ...current.about, description: event.target.value },
                }))
              }
              className="min-h-28"
            />
          </Field>
          <Field label="Teks penutup">
            <Input
              value={data.about.closingText}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  about: { ...current.about, closingText: event.target.value },
                }))
              }
            />
          </Field>
        </SectionCard>

        <SectionCard
          title="Jelajahi Perspektif"
          description="Atur heading dan tautan kategori pada area jelajahi."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow">
              <Input
                value={data.explore.eyebrow}
                onChange={(event) =>
                  changeData((current) => ({
                    ...current,
                    explore: { ...current.explore, eyebrow: event.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Judul">
              <Input
                value={data.explore.title}
                onChange={(event) =>
                  changeData((current) => ({
                    ...current,
                    explore: { ...current.explore, title: event.target.value },
                  }))
                }
              />
            </Field>
          </div>

          <div className="space-y-3">
            {data.explore.items.map((item, index) => (
              <div
                key={item.clientKey}
                className="space-y-3 rounded-lg border bg-muted/10 p-4"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-semibold">Item {index + 1}</span>
                  <div className="flex items-center gap-2">
                    <VisibilityControl
                      checked={item.isVisible}
                      onCheckedChange={(isVisible) =>
                        updateExploreItem(item.clientKey, { isVisible })
                      }
                    />
                    <CollectionActions
                      index={index}
                      total={data.explore.items.length}
                      onMove={(direction) =>
                        changeData((current) => ({
                          ...current,
                          explore: {
                            ...current.explore,
                            items: moveRecord(
                              current.explore.items,
                              index,
                              direction,
                            ),
                          },
                        }))
                      }
                      onRemove={() =>
                        changeData((current) => ({
                          ...current,
                          explore: {
                            ...current.explore,
                            items: normalizePositions(
                              current.explore.items.filter(
                                (record) => record.clientKey !== item.clientKey,
                              ),
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-[1fr_1.3fr_130px]">
                  <Field label="Label">
                    <Input
                      value={item.label}
                      onChange={(event) =>
                        updateExploreItem(item.clientKey, {
                          label: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="URL tujuan">
                    <Input
                      value={item.linkUrl}
                      onChange={(event) =>
                        updateExploreItem(item.clientKey, {
                          linkUrl: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Jumlah cerita">
                    <Input
                      type="number"
                      min={0}
                      value={item.storyCount ?? ""}
                      onChange={(event) =>
                        updateExploreItem(item.clientKey, {
                          storyCount:
                            event.target.value === ""
                              ? null
                              : Number(event.target.value),
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() =>
                changeData((current) => ({
                  ...current,
                  explore: {
                    ...current.explore,
                    items: [
                      ...current.explore.items,
                      {
                        id: null,
                        clientKey: clientKey("explore"),
                        label: "",
                        linkUrl: "/",
                        storyCount: null,
                        position: current.explore.items.length + 1,
                        isVisible: true,
                      },
                    ],
                  },
                }))
              }
            >
              <Plus className="size-4" /> Tambah item jelajahi
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Section Artikel"
          description="Atur presentasi section. Pin artikel menunggu module Article tersedia."
        >
          <div className="rounded-lg border border-amber-200 bg-amber-50 p-3 text-sm text-amber-800">
            Section key dikunci untuk menjaga constraint unik. Daftar artikel
            pada tiap section belum dapat dipilih sampai module Article terhubung.
          </div>
          <div className="space-y-5">
            {data.articleSections.map((section, index) => (
              <div
                key={section.clientKey}
                className="space-y-4 rounded-xl border bg-muted/10 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-semibold">{section.title}</p>
                    <p className="text-xs text-muted-foreground">
                      Key: {section.sectionKey}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <VisibilityControl
                      checked={section.isVisible}
                      onCheckedChange={(isVisible) =>
                        updateArticleSection(section.clientKey, { isVisible })
                      }
                    />
                    <CollectionActions
                      index={index}
                      total={data.articleSections.length}
                      onMove={(direction) =>
                        changeData((current) => ({
                          ...current,
                          articleSections: moveRecord(
                            current.articleSections,
                            index,
                            direction,
                          ),
                        }))
                      }
                    />
                  </div>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Section key" hint="Tidak dapat diubah.">
                    <Input value={section.sectionKey} disabled />
                  </Field>
                  <Field label="Slug kategori artikel">
                    <Input
                      value={section.articleCategorySlug ?? ""}
                      onChange={(event) =>
                        updateArticleSection(section.clientKey, {
                          articleCategorySlug: event.target.value,
                        })
                      }
                      placeholder="Kosongkan untuk section umum"
                    />
                  </Field>
                </div>
                <Field label="URL background">
                  <Input
                    value={section.backgroundImageUrl}
                    onChange={(event) =>
                      updateArticleSection(section.clientKey, {
                        backgroundImageUrl: event.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Eyebrow">
                    <Input
                      value={section.eyebrow}
                      onChange={(event) =>
                        updateArticleSection(section.clientKey, {
                          eyebrow: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Judul">
                    <Input
                      value={section.title}
                      onChange={(event) =>
                        updateArticleSection(section.clientKey, {
                          title: event.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
                <Field label="Deskripsi">
                  <Textarea
                    value={section.description}
                    onChange={(event) =>
                      updateArticleSection(section.clientKey, {
                        description: event.target.value,
                      })
                    }
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Label link">
                    <Input
                      value={section.linkLabel}
                      onChange={(event) =>
                        updateArticleSection(section.clientKey, {
                          linkLabel: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="URL link">
                    <Input
                      value={section.linkUrl}
                      onChange={(event) =>
                        updateArticleSection(section.clientKey, {
                          linkUrl: event.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
                <div className="grid gap-4 sm:grid-cols-3">
                  <Field label="Tema">
                    <Select
                      value={section.theme}
                      onValueChange={(theme: LandingArticleSectionEditorData["theme"]) =>
                        updateArticleSection(section.clientKey, { theme })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="DEFAULT">Default</SelectItem>
                        <SelectItem value="RED">Merah</SelectItem>
                        <SelectItem value="OFF_WHITE">Off white</SelectItem>
                        <SelectItem value="DARK">Gelap</SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Layout">
                    <Select
                      value={section.layout}
                      onValueChange={(layout: LandingArticleSectionEditorData["layout"]) =>
                        updateArticleSection(section.clientKey, { layout })
                      }
                    >
                      <SelectTrigger className="w-full">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="STANDARD">Standard</SelectItem>
                        <SelectItem value="FEATURED_FIRST">
                          Featured first
                        </SelectItem>
                      </SelectContent>
                    </Select>
                  </Field>
                  <Field label="Maks. artikel">
                    <Input
                      type="number"
                      min={1}
                      max={12}
                      value={section.maxItems}
                      onChange={(event) =>
                        updateArticleSection(section.clientKey, {
                          maxItems: Number(event.target.value),
                        })
                      }
                    />
                  </Field>
                </div>
              </div>
            ))}
          </div>
        </SectionCard>

        <SectionCard
          title="Tim"
          description="Kelola heading dan anggota tim yang tampil di landing page."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow">
              <Input
                value={data.team.eyebrow}
                onChange={(event) =>
                  changeData((current) => ({
                    ...current,
                    team: { ...current.team, eyebrow: event.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Judul">
              <Input
                value={data.team.title}
                onChange={(event) =>
                  changeData((current) => ({
                    ...current,
                    team: { ...current.team, title: event.target.value },
                  }))
                }
              />
            </Field>
          </div>
          <Field label="Deskripsi">
            <Textarea
              value={data.team.description}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  team: { ...current.team, description: event.target.value },
                }))
              }
            />
          </Field>

          <div className="space-y-4">
            {data.team.members.map((member, index) => (
              <div
                key={member.clientKey}
                className="space-y-4 rounded-xl border bg-muted/10 p-4 sm:p-5"
              >
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <span className="text-sm font-semibold">
                    Anggota {index + 1}
                  </span>
                  <div className="flex items-center gap-2">
                    <VisibilityControl
                      checked={member.isVisible}
                      onCheckedChange={(isVisible) =>
                        updateTeamMember(member.clientKey, { isVisible })
                      }
                    />
                    <CollectionActions
                      index={index}
                      total={data.team.members.length}
                      onMove={(direction) =>
                        changeData((current) => ({
                          ...current,
                          team: {
                            ...current.team,
                            members: moveRecord(
                              current.team.members,
                              index,
                              direction,
                            ),
                          },
                        }))
                      }
                      onRemove={() =>
                        changeData((current) => ({
                          ...current,
                          team: {
                            ...current.team,
                            members: normalizePositions(
                              current.team.members.filter(
                                (record) => record.clientKey !== member.clientKey,
                              ),
                            ),
                          },
                        }))
                      }
                    />
                  </div>
                </div>
                <Field label="URL foto">
                  <Input
                    value={member.imageUrl}
                    onChange={(event) =>
                      updateTeamMember(member.clientKey, {
                        imageUrl: event.target.value,
                      })
                    }
                    placeholder="https://..."
                  />
                </Field>
                <div className="grid gap-4 sm:grid-cols-2">
                  <Field label="Nama">
                    <Input
                      value={member.name}
                      onChange={(event) =>
                        updateTeamMember(member.clientKey, {
                          name: event.target.value,
                        })
                      }
                    />
                  </Field>
                  <Field label="Jabatan">
                    <Input
                      value={member.role}
                      onChange={(event) =>
                        updateTeamMember(member.clientKey, {
                          role: event.target.value,
                        })
                      }
                    />
                  </Field>
                </div>
                <Field label="Bio">
                  <Textarea
                    value={member.bio}
                    onChange={(event) =>
                      updateTeamMember(member.clientKey, {
                        bio: event.target.value,
                      })
                    }
                  />
                </Field>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() =>
                changeData((current) => ({
                  ...current,
                  team: {
                    ...current.team,
                    members: [
                      ...current.team.members,
                      {
                        id: null,
                        clientKey: clientKey("team"),
                        name: "",
                        role: "",
                        imageUrl: "",
                        bio: "",
                        position: current.team.members.length + 1,
                        isVisible: true,
                      },
                    ],
                  },
                }))
              }
            >
              <Plus className="size-4" /> Tambah anggota tim
            </Button>
          </div>
        </SectionCard>

        <SectionCard
          title="Call to Action"
          description="Ajakan kolaborasi pada bagian akhir landing page."
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Eyebrow">
              <Input
                value={data.cta.eyebrow}
                onChange={(event) =>
                  changeData((current) => ({
                    ...current,
                    cta: { ...current.cta, eyebrow: event.target.value },
                  }))
                }
              />
            </Field>
            <Field label="Label tombol">
              <Input
                value={data.cta.buttonLabel}
                onChange={(event) =>
                  changeData((current) => ({
                    ...current,
                    cta: { ...current.cta, buttonLabel: event.target.value },
                  }))
                }
              />
            </Field>
          </div>
          <Field label="Judul">
            <Textarea
              value={data.cta.title}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  cta: { ...current.cta, title: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Deskripsi">
            <Textarea
              value={data.cta.description}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  cta: { ...current.cta, description: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="URL tombol">
            <Input
              value={data.cta.buttonUrl}
              onChange={(event) =>
                changeData((current) => ({
                  ...current,
                  cta: { ...current.cta, buttonUrl: event.target.value },
                }))
              }
            />
          </Field>
        </SectionCard>
      </div>
    </div>
  )
}
