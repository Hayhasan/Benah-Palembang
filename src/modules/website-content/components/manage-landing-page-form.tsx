"use client"

import {
  ChevronDown,
  ChevronUp,
  GripVertical,
  Loader2,
  Plus,
  Save,
  Trash2,
  Users,
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

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"

import { updateAgendaPageAction } from "../actions/update-agenda-page"
import { updateCollaborationPageAction } from "../actions/update-collaboration-page"
import { updateHeaderFooterContentAction } from "../actions/update-header-footer-content"
import { updateLandingPageAction } from "../actions/update-landing-page"
import type { AgendaPageEditorData } from "../types/agenda-page-editor"
import type { CollaborationPageEditorData } from "../types/collaboration-page-editor"
import type { HeaderFooterContentEditorData } from "../types/header-footer-content-editor"
import type {
  LandingArticleSectionEditorData,
  LandingExploreItemEditorData,
  LandingHeroSlideEditorData,
  LandingPageEditorData,
  LandingTeamMemberEditorData,
} from "../types/landing-page-editor"
import { ArticleSettings } from "./website-editor-secondary-tabs"
import { ManageAgendaSettings } from "./manage-agenda-settings"
import { ManageCollaborationSettings } from "./manage-collaboration-settings"
import { ManageHeaderFooterSettings } from "./manage-header-footer-settings"

const tabs = ["Home", "Article", "Agenda", "Collaboration", "Header & Footer"]
type EditableModule = "Home" | "Agenda" | "Collaboration" | "Header & Footer"
const articleSectionNames = [
  "Cerita Palembang",
  "Gaya Hidup",
  "Ruang Kota",
  "Industri Kreatif",
  "Kebudayaan",
]

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

export function ManageLandingPageForm({
  initialData,
  initialAgendaData,
  initialCollaborationData,
  initialHeaderFooterData,
}: {
  initialData: LandingPageEditorData
  initialAgendaData: AgendaPageEditorData
  initialCollaborationData: CollaborationPageEditorData
  initialHeaderFooterData: HeaderFooterContentEditorData
}) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [data, setData] = useState(initialData)
  const [agendaData, setAgendaData] = useState(initialAgendaData)
  const [collaborationData, setCollaborationData] = useState(
    initialCollaborationData,
  )
  const [headerFooterData, setHeaderFooterData] = useState(
    initialHeaderFooterData,
  )
  const [isPending, startTransition] = useTransition()
  const dataRef = useRef(data)
  const agendaDataRef = useRef(agendaData)
  const collaborationDataRef = useRef(collaborationData)
  const headerFooterDataRef = useRef(headerFooterData)
  const activeTabRef = useRef(activeTab)
  const dirtyModulesRef = useRef<Set<EditableModule>>(new Set())
  const { setIsDirty, registerSaveHandler } = useUnsavedChanges()

  useEffect(() => {
    dataRef.current = data
  }, [data])

  useEffect(() => {
    agendaDataRef.current = agendaData
  }, [agendaData])

  useEffect(() => {
    collaborationDataRef.current = collaborationData
  }, [collaborationData])

  useEffect(() => {
    headerFooterDataRef.current = headerFooterData
  }, [headerFooterData])

  useEffect(() => {
    activeTabRef.current = activeTab
  }, [activeTab])

  const markDirty = useCallback(
    (module: EditableModule) => {
      dirtyModulesRef.current.add(module)
      setIsDirty(true)
    },
    [setIsDirty],
  )

  const changeData = useCallback(
    (updater: (current: LandingPageEditorData) => LandingPageEditorData) => {
      setData((current) => {
        const next = updater(current)
        dataRef.current = next
        return next
      })
      markDirty("Home")
    },
    [markDirty],
  )

  const changeCollaborationData = useCallback(
    (
      updater: (
        current: CollaborationPageEditorData,
      ) => CollaborationPageEditorData,
    ) => {
      const next = updater(collaborationDataRef.current)
      collaborationDataRef.current = next
      setCollaborationData(next)
      markDirty("Collaboration")
    },
    [markDirty],
  )

  const changeAgendaData = useCallback(
    (updater: (current: AgendaPageEditorData) => AgendaPageEditorData) => {
      const next = updater(agendaDataRef.current)
      agendaDataRef.current = next
      setAgendaData(next)
      markDirty("Agenda")
    },
    [markDirty],
  )

  const changeHeaderFooterData = useCallback(
    (
      updater: (
        current: HeaderFooterContentEditorData,
      ) => HeaderFooterContentEditorData,
    ) => {
      const next = updater(headerFooterDataRef.current)
      headerFooterDataRef.current = next
      setHeaderFooterData(next)
      markDirty("Header & Footer")
    },
    [markDirty],
  )

  const handleSave = useCallback(
    () =>
      new Promise<boolean>((resolve) => {
        const dirtyModules = [...dirtyModulesRef.current]

        if (dirtyModules.length === 0) {
          toast.success(
            `Pengaturan ${activeTabRef.current} berhasil disimpan!`,
          )
          resolve(true)
          return
        }

        startTransition(async () => {
          let allSucceeded = true
          const successMessages: string[] = []

          try {
            if (dirtyModules.includes("Home")) {
              const result = await updateLandingPageAction(dataRef.current)
              if (result.success) {
                setData(result.data)
                dataRef.current = result.data
                dirtyModulesRef.current.delete("Home")
                successMessages.push(result.message)
              } else {
                const field = result.field ? ` (${result.field})` : ""
                toast.error(`${result.message}${field}`)
                allSucceeded = false
              }
            }

            if (dirtyModules.includes("Collaboration")) {
              const result = await updateCollaborationPageAction(
                collaborationDataRef.current,
              )
              if (result.success) {
                setCollaborationData(result.data)
                collaborationDataRef.current = result.data
                dirtyModulesRef.current.delete("Collaboration")
                successMessages.push(result.message)
              } else {
                const field = result.field ? ` (${result.field})` : ""
                toast.error(`${result.message}${field}`)
                allSucceeded = false
              }
            }

            if (dirtyModules.includes("Agenda")) {
              const result = await updateAgendaPageAction(agendaDataRef.current)
              if (result.success) {
                setAgendaData(result.data)
                agendaDataRef.current = result.data
                dirtyModulesRef.current.delete("Agenda")
                successMessages.push(result.message)
              } else {
                const field = result.field ? ` (${result.field})` : ""
                toast.error(`${result.message}${field}`)
                allSucceeded = false
              }
            }

            if (dirtyModules.includes("Header & Footer")) {
              const result = await updateHeaderFooterContentAction(
                headerFooterDataRef.current,
              )
              if (result.success) {
                setHeaderFooterData(result.data)
                headerFooterDataRef.current = result.data
                dirtyModulesRef.current.delete("Header & Footer")
                successMessages.push(result.message)
              } else {
                const field = result.field ? ` (${result.field})` : ""
                toast.error(`${result.message}${field}`)
                allSucceeded = false
              }
            }

            setIsDirty(dirtyModulesRef.current.size > 0)
            if (successMessages.length > 0) {
              toast.success(successMessages.join(" "))
            }
            resolve(allSucceeded)
          } catch (error) {
            console.error("Failed to save website content:", error)
            setIsDirty(dirtyModulesRef.current.size > 0)
            toast.error("Konten website gagal disimpan. Silakan coba lagi.")
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
      dirtyModulesRef.current.clear()
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
      <div className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/80 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Website</h2>
          <p className="text-muted-foreground">
            Konfigurasi dinamis untuk elemen-elemen halaman website.
          </p>
        </div>
        <Button
          type="button"
          onClick={() => void handleSave()}
          disabled={isPending}
          className="w-fit bg-palembang-red text-white hover:bg-palembang-red/90"
        >
          {isPending ? (
            <Loader2 className="mr-2 size-4 animate-spin" />
          ) : (
            <Save className="mr-2 size-4" />
          )}
          {isPending ? "Menyimpan..." : "Simpan Perubahan"}
        </Button>
      </div>

      <div className="relative border-b">
        <div className="flex gap-6 overflow-x-auto pb-px hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => {
                activeTabRef.current = tab
                setActiveTab(tab)
              }}
              className={`whitespace-nowrap border-b-2 pb-3 text-sm font-medium transition-colors ${
                activeTab === tab
                  ? "border-palembang-red text-palembang-red"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-4xl">
        {activeTab === "Home" ? (
          <div className="space-y-8">
            <SectionCard
              title="Section Heroes (Carousel)"
              desc="Konfigurasi gambar, teks, dan urutan carousel utama. Geser atas/bawah untuk mengubah urutan."
            >
              <div className="space-y-6">
                {data.heroSlides.map((slide, index) => (
                  <div
                    key={slide.clientKey}
                    className="relative space-y-4 rounded-lg border bg-muted/20 p-5"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                        <GripVertical className="size-4" />
                        Slide {index + 1}
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() =>
                            changeData((current) => ({
                              ...current,
                              heroSlides: moveRecord(
                                current.heroSlides,
                                index,
                                -1,
                              ),
                            }))
                          }
                          disabled={index === 0}
                        >
                          <ChevronUp className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7"
                          onClick={() =>
                            changeData((current) => ({
                              ...current,
                              heroSlides: moveRecord(
                                current.heroSlides,
                                index,
                                1,
                              ),
                            }))
                          }
                          disabled={index === data.heroSlides.length - 1}
                        >
                          <ChevronDown className="size-4" />
                        </Button>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                          onClick={() => {
                            if (data.heroSlides.length <= 1) {
                              toast.error("Minimal harus ada 1 carousel!")
                              return
                            }
                            changeData((current) => ({
                              ...current,
                              heroSlides: normalizePositions(
                                current.heroSlides.filter(
                                  (item) => item.clientKey !== slide.clientKey,
                                ),
                              ),
                            }))
                          }}
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </div>
                    </div>
                    <Field label="Background Carousel">
                      <ImageUpload
                        value={slide.imageUrl}
                        onChange={(imageUrl) =>
                          updateHero(slide.clientKey, { imageUrl })
                        }
                        placeholder="Upload gambar background..."
                        aspect={16 / 9}
                      />
                    </Field>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Tagline">
                        <Input
                          value={slide.eyebrow}
                          onChange={(event) =>
                            updateHero(slide.clientKey, {
                              eyebrow: event.target.value,
                            })
                          }
                          placeholder="BUDAYA"
                        />
                      </Field>
                      <Field label="URL Button">
                        <Input
                          value={slide.buttonUrl}
                          onChange={(event) =>
                            updateHero(slide.clientKey, {
                              buttonUrl: event.target.value,
                            })
                          }
                          placeholder="/cerita-warga"
                        />
                      </Field>
                    </div>
                    <div className="grid gap-4 sm:grid-cols-2">
                      <Field label="Alt Gambar">
                        <Input
                          value={slide.imageAlt}
                          onChange={(event) =>
                            updateHero(slide.clientKey, {
                              imageAlt: event.target.value,
                            })
                          }
                          placeholder="Deskripsi gambar"
                        />
                      </Field>
                      <Field label="Label Button">
                        <Input
                          value={slide.buttonLabel}
                          onChange={(event) =>
                            updateHero(slide.clientKey, {
                              buttonLabel: event.target.value,
                            })
                          }
                          placeholder="Jelajahi cerita"
                        />
                      </Field>
                    </div>
                    <Field label="Judul">
                      <Input
                        value={slide.title}
                        onChange={(event) =>
                          updateHero(slide.clientKey, {
                            title: event.target.value,
                          })
                        }
                        placeholder="Judul utama carousel"
                      />
                    </Field>
                    <Field label="Deskripsi Singkat">
                      <Textarea
                        value={slide.description}
                        onChange={(description) =>
                          updateHero(slide.clientKey, { description })
                        }
                        placeholder="Tuliskan deskripsi..."
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
                      heroSlides: [
                        ...current.heroSlides,
                        {
                          id: null,
                          clientKey: clientKey("hero"),
                          imageUrl: "",
                          imageAlt: "",
                          eyebrow: "",
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
                  <Plus className="mr-2 size-4" /> Tambah Carousel Slide
                </Button>
              </div>
            </SectionCard>

            <SectionCard
              title="Section About"
              desc="Konfigurasi area tentang Benah Palembang."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Est. & Kota">
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
                <Field label="Tagline">
                  <Input
                    value={data.about.eyebrow}
                    onChange={(event) =>
                      changeData((current) => ({
                        ...current,
                        about: {
                          ...current.about,
                          eyebrow: event.target.value,
                        },
                      }))
                    }
                  />
                </Field>
              </div>
              <Field label="Judul Section">
                <Input
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
                  onChange={(description) =>
                    changeData((current) => ({
                      ...current,
                      about: { ...current.about, description },
                    }))
                  }
                />
              </Field>
              <Field label="Teks Penutup">
                <Input
                  value={data.about.closingText}
                  onChange={(event) =>
                    changeData((current) => ({
                      ...current,
                      about: {
                        ...current.about,
                        closingText: event.target.value,
                      },
                    }))
                  }
                />
              </Field>
            </SectionCard>

            <SectionCard
              title="Section Jelajahi"
              desc="Konfigurasi judul dan card jelajahi. Geser atas/bawah untuk mengubah urutan."
            >
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Tagline">
                  <Input
                    value={data.explore.eyebrow}
                    onChange={(event) =>
                      changeData((current) => ({
                        ...current,
                        explore: {
                          ...current.explore,
                          eyebrow: event.target.value,
                        },
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
                        explore: {
                          ...current.explore,
                          title: event.target.value,
                        },
                      }))
                    }
                  />
                </Field>
              </div>
              <div className="mt-4 space-y-3">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Card Jelajahi
                </p>
                {data.explore.items.map((item, index) => (
                  <div
                    key={item.clientKey}
                    className="flex items-center gap-3 rounded-lg border bg-muted/10 p-3"
                  >
                    <div className="flex flex-col gap-0.5">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-5"
                        onClick={() =>
                          changeData((current) => ({
                            ...current,
                            explore: {
                              ...current.explore,
                              items: moveRecord(
                                current.explore.items,
                                index,
                                -1,
                              ),
                            },
                          }))
                        }
                        disabled={index === 0}
                      >
                        <ChevronUp className="size-3" />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="size-5"
                        onClick={() =>
                          changeData((current) => ({
                            ...current,
                            explore: {
                              ...current.explore,
                              items: moveRecord(
                                current.explore.items,
                                index,
                                1,
                              ),
                            },
                          }))
                        }
                        disabled={index === data.explore.items.length - 1}
                      >
                        <ChevronDown className="size-3" />
                      </Button>
                    </div>
                    <Input
                      className="flex-1"
                      value={item.label}
                      onChange={(event) =>
                        updateExploreItem(item.clientKey, {
                          label: event.target.value,
                        })
                      }
                      placeholder="Judul"
                    />
                    <Input
                      className="w-28"
                      value={
                        item.storyCount === null
                          ? ""
                          : `${item.storyCount} stories`
                      }
                      onChange={(event) => {
                        const count = Number.parseInt(
                          event.target.value.replace(/\D/g, ""),
                          10,
                        )
                        updateExploreItem(item.clientKey, {
                          storyCount: Number.isNaN(count) ? null : count,
                        })
                      }}
                      placeholder="CTA"
                    />
                    <Input
                      className="w-32"
                      value={item.linkUrl}
                      onChange={(event) =>
                        updateExploreItem(item.clientKey, {
                          linkUrl: event.target.value,
                        })
                      }
                      placeholder="Link URL"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="size-8 text-red-500 hover:bg-red-50 hover:text-red-600"
                      onClick={() =>
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
                            storyCount: null,
                            linkUrl: "/",
                            position: current.explore.items.length + 1,
                            isVisible: true,
                          },
                        ],
                      },
                    }))
                  }
                >
                  <Plus className="mr-2 size-4" /> Tambah Card Jelajahi
                </Button>
              </div>
            </SectionCard>

            {data.articleSections.map((section, sectionIndex) => {
              const sectionName = articleSectionNames[sectionIndex]
              return (
                <SectionCard
                  key={section.clientKey}
                  title={`Section: ${sectionName}`}
                  desc={`Konfigurasi background, judul, deskripsi, dan pin artikel untuk kategori ${sectionName}.`}
                >
                  <Field label="Background">
                    <ImageUpload
                      value={section.backgroundImageUrl}
                      onChange={(backgroundImageUrl) =>
                        updateArticleSection(section.clientKey, {
                          backgroundImageUrl,
                        })
                      }
                      placeholder={`Upload background ${sectionName}...`}
                      aspect={3 / 2}
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Tagline">
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
                      onChange={(description) =>
                        updateArticleSection(section.clientKey, { description })
                      }
                      placeholder={`Deskripsi mengenai ${sectionName}...`}
                    />
                  </Field>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field label="Label Link (Lihat Semua)">
                      <Input
                        value={section.linkLabel}
                        onChange={(event) =>
                          updateArticleSection(section.clientKey, {
                            linkLabel: event.target.value,
                          })
                        }
                      />
                    </Field>
                    <Field label="Link URL (Lihat Semua)">
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
                        onValueChange={(
                          theme: LandingArticleSectionEditorData["theme"],
                        ) =>
                          updateArticleSection(section.clientKey, { theme })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="DEFAULT">Default</SelectItem>
                          <SelectItem value="RED">Merah</SelectItem>
                          <SelectItem value="OFF_WHITE">Off White</SelectItem>
                          <SelectItem value="DARK">Gelap</SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Layout">
                      <Select
                        value={section.layout}
                        onValueChange={(
                          layout: LandingArticleSectionEditorData["layout"],
                        ) =>
                          updateArticleSection(section.clientKey, { layout })
                        }
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="STANDARD">Standard</SelectItem>
                          <SelectItem value="FEATURED_FIRST">
                            Featured First
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </Field>
                    <Field label="Maks. Artikel">
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
                </SectionCard>
              )
            })}

            <SectionCard
              title="Section Our Team"
              desc="Konfigurasi judul dan anggota tim yang ditampilkan di homepage."
            >
              <div className="grid gap-4 sm:grid-cols-3">
                <Field label="Tagline">
                  <Input
                    value={data.team.eyebrow}
                    onChange={(event) =>
                      changeData((current) => ({
                        ...current,
                        team: {
                          ...current.team,
                          eyebrow: event.target.value,
                        },
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
                  onChange={(description) =>
                    changeData((current) => ({
                      ...current,
                      team: { ...current.team, description },
                    }))
                  }
                />
              </Field>

              <div className="mt-4 space-y-4">
                <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  <Users className="size-3.5" /> Anggota Tim
                </p>
                {data.team.members.map((member) => (
                  <div
                    key={member.clientKey}
                    className="rounded-lg border bg-muted/10 p-4"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-24 shrink-0">
                        <ImageUpload
                          value={member.imageUrl}
                          onChange={(imageUrl) =>
                            updateTeamMember(member.clientKey, { imageUrl })
                          }
                          placeholder="Foto"
                          aspect={1}
                        />
                      </div>
                      <div className="flex flex-1 flex-col gap-3">
                        <div className="flex justify-end">
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="-mr-2 -mt-2 size-7 text-red-500 hover:bg-red-50 hover:text-red-600"
                            onClick={() =>
                              changeData((current) => ({
                                ...current,
                                team: {
                                  ...current.team,
                                  members: normalizePositions(
                                    current.team.members.filter(
                                      (record) =>
                                        record.clientKey !== member.clientKey,
                                    ),
                                  ),
                                },
                              }))
                            }
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </div>
                        <Input
                          value={member.name}
                          onChange={(event) =>
                            updateTeamMember(member.clientKey, {
                              name: event.target.value,
                            })
                          }
                          placeholder="Nama Lengkap"
                        />
                        <Input
                          value={member.role}
                          onChange={(event) =>
                            updateTeamMember(member.clientKey, {
                              role: event.target.value,
                            })
                          }
                          placeholder="Jabatan"
                        />
                        <Input
                          value={member.bio}
                          onChange={(event) =>
                            updateTeamMember(member.clientKey, {
                              bio: event.target.value,
                            })
                          }
                          placeholder="Deskripsi singkat"
                        />
                      </div>
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
                      team: {
                        ...current.team,
                        members: [
                          ...current.team.members,
                          {
                            id: null,
                            clientKey: clientKey("team"),
                            imageUrl: "",
                            name: "",
                            role: "",
                            bio: "",
                            position: current.team.members.length + 1,
                            isVisible: true,
                          },
                        ],
                      },
                    }))
                  }
                >
                  <Plus className="mr-2 size-4" /> Tambah Anggota Tim
                </Button>
              </div>
            </SectionCard>

            <SectionCard
              title="Section CTA"
              desc="Konfigurasi call-to-action di bagian bawah homepage."
            >
              <Field label="Tagline">
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
              <Field label="Judul">
                <Input
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
                  onChange={(description) =>
                    changeData((current) => ({
                      ...current,
                      cta: { ...current.cta, description },
                    }))
                  }
                />
              </Field>
              <Field label="Label Button CTA">
                <Input
                  value={data.cta.buttonLabel}
                  onChange={(event) =>
                    changeData((current) => ({
                      ...current,
                      cta: {
                        ...current.cta,
                        buttonLabel: event.target.value,
                      },
                    }))
                  }
                />
              </Field>
              <Field label="URL Button CTA">
                <Input
                  value={data.cta.buttonUrl}
                  onChange={(event) =>
                    changeData((current) => ({
                      ...current,
                      cta: { ...current.cta, buttonUrl: event.target.value },
                    }))
                  }
                  placeholder="/kolaborasi"
                />
              </Field>
            </SectionCard>
          </div>
        ) : null}
        {activeTab === "Article" ? <ArticleSettings /> : null}
        {activeTab === "Agenda" ? (
          <ManageAgendaSettings data={agendaData} onChange={changeAgendaData} />
        ) : null}
        {activeTab === "Collaboration" ? (
          <ManageCollaborationSettings
            data={collaborationData}
            onChange={changeCollaborationData}
          />
        ) : null}
        {activeTab === "Header & Footer" ? (
          <ManageHeaderFooterSettings
            data={headerFooterData}
            onChange={changeHeaderFooterData}
          />
        ) : null}
      </div>
    </div>
  )
}
