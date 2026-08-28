"use client"

import { ChevronDown, ChevronUp } from "lucide-react"
import { useState, type ReactNode } from "react"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import { getDefaultArticleCategoryPage } from "../constants/default-article-category-pages"
import type {
  ArticleCategoryPageEditorItem,
  ArticleCategoryPagesEditorData,
} from "../types/article-category-page-editor"

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

export function ManageArticleCategorySettings({
  data,
  onChange,
}: {
  data: ArticleCategoryPagesEditorData
  onChange: (
    updater: (
      current: ArticleCategoryPagesEditorData,
    ) => ArticleCategoryPagesEditorData,
  ) => void
}) {
  const updateCategory = (
    clientKey: string,
    values: Partial<ArticleCategoryPageEditorItem["hero"]>,
  ) => {
    onChange((current) => ({
      ...current,
      categories: current.categories.map((category) =>
        category.clientKey === clientKey
          ? { ...category, hero: { ...category.hero, ...values } }
          : category,
      ),
    }))
  }

  return (
    <div className="space-y-8">
      {data.categories.map((category) => {
        const categoryName =
          getDefaultArticleCategoryPage(category.sectionKey)?.category ??
          category.sectionKey

        return (
          <SectionCard
            key={category.clientKey}
            title={`Section Heroes — ${categoryName}`}
            desc={`Konfigurasi background, judul, dan deskripsi halaman kategori ${categoryName}.`}
          >
            <Field label="Background">
              <ImageUpload
                value={category.hero.imageUrl}
                onChange={(imageUrl) =>
                  updateCategory(category.clientKey, { imageUrl })
                }
                placeholder={`Upload background ${categoryName}...`}
              />
            </Field>
            <Field label="Judul Halaman">
              <Input
                value={category.hero.title}
                onChange={(event) =>
                  updateCategory(category.clientKey, {
                    title: event.target.value,
                  })
                }
              />
            </Field>
            <Field label="Deskripsi">
              <textarea
                value={category.hero.description}
                onChange={(event) =>
                  updateCategory(category.clientKey, {
                    description: event.target.value,
                  })
                }
                placeholder={`Deskripsi mengenai ${categoryName}...`}
                className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
              />
            </Field>
          </SectionCard>
        )
      })}
    </div>
  )
}
