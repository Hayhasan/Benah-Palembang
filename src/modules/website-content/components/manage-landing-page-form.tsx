"use client"

import { Loader2, Save } from "lucide-react"
import { useState, useTransition } from "react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"

import { updateArticleCategoryPagesAction } from "../actions/update-article-category-pages"
import { updateCollaborationPageAction } from "../actions/update-collaboration-page"
import { updateHeaderFooterContentAction } from "../actions/update-header-footer-content"
import { updateLandingPageAction } from "../actions/update-landing-page"
import type { HeaderFooterContentEditorData } from "../types/header-footer-content-editor"
import type {
  LandingArticlePinOption,
  LandingPageEditorData,
} from "../types/landing-page-editor"
import { ManageHeaderSettings, ManageFooterSettings } from "./manage-header-footer-settings"
import { ManageHomeSettings } from "./manage-home-settings"
import { ManageCategoryHeroTab } from "./manage-category-hero-tab"
import { ManageCollaborationSettings } from "./manage-collaboration-settings"
import type { ArticleCategoryPagesEditorData } from "../types/article-category-page-editor"
import type { CollaborationPageEditorData } from "../types/collaboration-page-editor"
import { ARTICLE_CATEGORY_SECTION_KEYS, getDefaultArticleCategoryPage } from "../constants/default-article-category-pages"
import { ChevronDown, ChevronUp } from "lucide-react"

function CategorySectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
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
          {desc ? <p className="mt-1 text-xs text-muted-foreground">{desc}</p> : null}
        </div>
        <Button type="button" variant="ghost" size="icon" className="pointer-events-none shrink-0">
          {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
        </Button>
      </div>
      {isExpanded ? <div className="p-6">{children}</div> : null}
    </div>
  )
}

const tabs = [
  "Home",
  "Kategori",
  "Kolaborasi",
  "Header",
  "Footer",
]

export function ManageLandingPageForm({
  initialData,
  initialHeaderFooterData,
  initialCategoryPagesData,
  initialCollaborationData,
  articlePinOptions,
}: {
  initialData?: LandingPageEditorData
  initialHeaderFooterData?: HeaderFooterContentEditorData
  initialCategoryPagesData?: ArticleCategoryPagesEditorData
  initialCollaborationData?: CollaborationPageEditorData
  articlePinOptions?: LandingArticlePinOption[]
} = {}) {
  const [activeTab, setActiveTab] = useState(tabs[0])
  const [homeData, setHomeData] = useState<LandingPageEditorData | null>(
    initialData ?? null,
  )
  const [headerFooterData, setHeaderFooterData] =
    useState<HeaderFooterContentEditorData | null>(
      initialHeaderFooterData ?? null,
    )
  const [categoryPagesData, setCategoryPagesData] =
    useState<ArticleCategoryPagesEditorData | null>(
      initialCategoryPagesData ?? null,
    )
  const [collaborationData, setCollaborationData] =
    useState<CollaborationPageEditorData | null>(
      initialCollaborationData ?? null,
    )

  const [isPending, startTransition] = useTransition()

  const handleHomeChange = (
    updater: (current: LandingPageEditorData) => LandingPageEditorData,
  ) => {
    setHomeData((current) => (current ? updater(current) : current))
  }

  const handleHeaderFooterChange = (
    updater: (
      current: HeaderFooterContentEditorData,
    ) => HeaderFooterContentEditorData,
  ) => {
    setHeaderFooterData((current) => (current ? updater(current) : current))
  }

  const handleCategoryPagesChange = (
    updater: (
      current: ArticleCategoryPagesEditorData,
    ) => ArticleCategoryPagesEditorData,
  ) => {
    setCategoryPagesData((current) => (current ? updater(current) : current))
  }

  const handleCollaborationChange = (
    updater: (
      current: CollaborationPageEditorData,
    ) => CollaborationPageEditorData,
  ) => {
    setCollaborationData((current) => (current ? updater(current) : current))
  }

  const handleSave = () => {
    startTransition(async () => {
      try {
        if (activeTab === "Home" && homeData) {
          const result = await updateLandingPageAction(homeData)
          if (result.success) {
            toast.success(result.message)
            setHomeData(result.data)
          } else {
            toast.error(result.message)
          }
        } else if ((activeTab === "Header" || activeTab === "Footer") && headerFooterData) {
          const result = await updateHeaderFooterContentAction(headerFooterData)
          if (result.success) {
            toast.success(result.message)
            setHeaderFooterData(result.data)
          } else {
            toast.error(result.message)
          }
        } else if (activeTab === "Kolaborasi" && collaborationData) {
          const result = await updateCollaborationPageAction(collaborationData)
          if (result.success) {
            toast.success(result.message)
            if (result.data) {
              setCollaborationData(result.data)
            }
          } else {
            toast.error(result.message)
          }
        } else if (activeTab === "Kategori" && categoryPagesData) {
          const result = await updateArticleCategoryPagesAction(categoryPagesData)
          if (result.success) {
            toast.success(result.message)
            if (result.data) {
              setCategoryPagesData(result.data)
            }
          } else {
            toast.error(result.message)
          }
        }
      } catch {
        toast.error("Gagal menyimpan perubahan. Silakan coba lagi.")
      }
    })
  }

  const canSave =
    (activeTab === "Home" && !!homeData) ||
    (activeTab === "Header" && !!headerFooterData) ||
    (activeTab === "Footer" && !!headerFooterData) ||
    (activeTab === "Kolaborasi" && !!collaborationData) ||
    (activeTab === "Kategori" && !!categoryPagesData)

  return (
    <div className="space-y-8 pb-10">
      <div className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/80 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Manage Website</h2>
          <p className="text-muted-foreground">
            Konfigurasi dinamis untuk elemen-elemen halaman website.
          </p>
        </div>

        {canSave ? (
          <Button
            type="button"
            onClick={handleSave}
            disabled={isPending}
            className="gap-2 bg-palembang-red text-white hover:bg-palembang-red/90"
          >
            {isPending ? (
              <Loader2 className="size-4 animate-spin" />
            ) : (
              <Save className="size-4" />
            )}
            {isPending ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        ) : null}
      </div>

      <div className="relative border-b">
        <div className="flex gap-2 sm:gap-6 overflow-x-auto pb-px hide-scrollbar">
          {tabs.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`whitespace-nowrap border-b-2 py-3 px-3 sm:px-1 min-h-[44px] flex items-center text-sm font-medium transition-colors cursor-pointer active:scale-95 ${
                activeTab === tab
                  ? "border-palembang-red text-palembang-red font-semibold"
                  : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="w-full">
        {activeTab === "Home" && homeData ? (
          <ManageHomeSettings data={homeData} onChange={handleHomeChange} />
        ) : null}

        {activeTab === "Header" && headerFooterData ? (
          <ManageHeaderSettings
            data={headerFooterData}
            onChange={handleHeaderFooterChange}
          />
        ) : null}

        {activeTab === "Footer" && headerFooterData ? (
          <ManageFooterSettings
            data={headerFooterData}
            onChange={handleHeaderFooterChange}
          />
        ) : null}

        {activeTab === "Kolaborasi" && collaborationData ? (
          <ManageCollaborationSettings
            data={collaborationData}
            onChange={handleCollaborationChange}
          />
        ) : null}

        {activeTab === "Kategori" && categoryPagesData ? (
          <div className="space-y-6">

            <div className="space-y-4">
              {ARTICLE_CATEGORY_SECTION_KEYS.map((sectionKey) => {
                const categoryName = getDefaultArticleCategoryPage(sectionKey)?.category ?? sectionKey
                return (
                  <CategorySectionCard
                    key={sectionKey}
                    title={categoryName}
                    desc={`Pengaturan banner carousel halaman ${categoryName}`}
                  >
                    <ManageCategoryHeroTab
                      sectionKey={sectionKey}
                      data={categoryPagesData}
                      onChange={handleCategoryPagesChange}
                    />
                  </CategorySectionCard>
                )
              })}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}
