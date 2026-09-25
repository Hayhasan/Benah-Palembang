"use client"

import { Plus, Trash2, GripVertical } from "lucide-react"
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

import type {
  ArticleCategoryPagesEditorData,
  ArticleCategoryPageEditorSlide,
} from "../types/article-category-page-editor"
import { getDefaultArticleCategoryPage } from "../constants/default-article-category-pages"

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2 block">
      <span className="text-sm font-medium block">{label}</span>
      {children}
    </label>
  )
}

function newClientKey(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

export function ManageCategoryHeroTab({
  sectionKey,
  data,
  onChange,
}: {
  sectionKey: string
  data: ArticleCategoryPagesEditorData
  onChange: (
    updater: (
      current: ArticleCategoryPagesEditorData,
    ) => ArticleCategoryPagesEditorData,
  ) => void
}) {
  const category = data.categories.find((c) => c.sectionKey === sectionKey)
  const defaultData = getDefaultArticleCategoryPage(sectionKey)
  const categoryName = defaultData?.category ?? sectionKey

  const MAX_HEROES = 12
  const [draggedHeroIndex, setDraggedHeroIndex] = useState<number | null>(null)

  if (!category) {
    return (
      <div className="rounded-xl border border-dashed bg-muted/20 p-8 text-center">
        <p className="text-sm text-muted-foreground">
          Data kategori <strong>{categoryName}</strong> belum tersedia. Silakan buat melalui seed data atau tab lainnya.
        </p>
      </div>
    )
  }

  const addHeroSlide = () => {
    if (category.heroSlides.length >= MAX_HEROES) {
      toast.error(`Maksimal ${MAX_HEROES} hero slides.`)
      return
    }

    onChange((current) => ({
      ...current,
      categories: current.categories.map((c) =>
        c.clientKey === category.clientKey
          ? {
              ...c,
              heroSlides: [
                ...c.heroSlides,
                {
                  id: null,
                  clientKey: newClientKey("category-hero"),
                  imageUrl: "",
                  imageAlt: "Banner image",
                  label: categoryName.toUpperCase(),
                  title: "",
                  description: "",
                  photographerName: "",
                  position: c.heroSlides.length + 1,
                  isVisible: true,
                },
              ],
            }
          : c,
      ),
    }))
  }

  const removeHeroSlide = (clientKey: string) => {
    if (category.heroSlides.length <= 1) {
      toast.error("Minimal 1 hero slide.")
      return
    }

    onChange((current) => ({
      ...current,
      categories: current.categories.map((c) =>
        c.clientKey === category.clientKey
          ? {
              ...c,
              heroSlides: c.heroSlides
                .filter((slide) => slide.clientKey !== clientKey)
                .map((slide, index) => ({ ...slide, position: index + 1 })),
            }
          : c,
      ),
    }))
  }

  const updateHeroSlide = (
    clientKey: string,
    values: Partial<ArticleCategoryPageEditorSlide>,
  ) => {
    onChange((current) => ({
      ...current,
      categories: current.categories.map((c) =>
        c.clientKey === category.clientKey
          ? {
              ...c,
              heroSlides: c.heroSlides.map((slide) =>
                slide.clientKey === clientKey ? { ...slide, ...values } : slide,
              ),
            }
          : c,
      ),
    }))
  }

  return (
    <div className="space-y-5">

          <div className="grid grid-cols-1 gap-6 xl:grid-cols-3 items-start">
            {category.heroSlides.map((slide, slideIndex) => (
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

                  const newSlides = [...category.heroSlides]
                  const [draggedItem] = newSlides.splice(draggedHeroIndex, 1)
                  newSlides.splice(slideIndex, 0, draggedItem)

                  onChange((current) => ({
                    ...current,
                    categories: current.categories.map((c) =>
                      c.clientKey === category.clientKey
                        ? {
                            ...c,
                            heroSlides: newSlides.map((s, idx) => ({
                              ...s,
                              position: idx + 1,
                            })),
                          }
                        : c,
                    ),
                  }))
                  setDraggedHeroIndex(null)
                }}
                onDragEnd={() => setDraggedHeroIndex(null)}
              >
                <div>
                  <div className="flex items-center justify-between pb-3 border-b">
                    <div className="flex items-center gap-2">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="cursor-grab active:cursor-grabbing text-muted-foreground hover:bg-muted"
                        title="Geser untuk mengurutkan"
                      >
                        <GripVertical className="size-4" />
                      </Button>
                      <span className="text-sm font-semibold text-muted-foreground">
                        Banner #{slideIndex + 1}
                      </span>
                    </div>
                    {slideIndex > 0 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Banner ini?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Banner ini akan dihapus dari halaman kategori.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeHeroSlide(slide.clientKey)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Ya, hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    <Field label="Gambar Banner (Rasio 3:2)">
                      <ImageUpload
                        value={slide.imageUrl}
                        onChange={(url) =>
                          updateHeroSlide(slide.clientKey, { imageUrl: url })
                        }
                        placeholder={`Upload banner ${categoryName}...`}
                        aspect={3 / 2}
                      />
                    </Field>

                    <Field label="Label">
                      <Input
                        value={slide.label}
                        onChange={(e) =>
                          updateHeroSlide(slide.clientKey, { label: e.target.value })
                        }
                        placeholder="Contoh: CERITA WARGA"
                        maxLength={160}
                      />
                    </Field>

                    <Field label="Judul">
                      <Input
                        value={slide.title}
                        onChange={(e) =>
                          updateHeroSlide(slide.clientKey, { title: e.target.value })
                        }
                        placeholder={categoryName}
                        maxLength={255}
                      />
                    </Field>

                    <Field label="Deskripsi">
                      <textarea
                        value={slide.description}
                        onChange={(e) =>
                          updateHeroSlide(slide.clientKey, { description: e.target.value })
                        }
                        placeholder={`Deskripsi banner...`}
                        className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                      />
                    </Field>
                    
                    <Field label="Nama Fotografer (Opsional)">
                      <Input
                        value={slide.photographerName || ""}
                        onChange={(e) =>
                          updateHeroSlide(slide.clientKey, { photographerName: e.target.value })
                        }
                        placeholder="Contoh: Budi Santoso"
                        maxLength={160}
                      />
                    </Field>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <Button
            type="button"
            className="w-full gap-2 bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            onClick={addHeroSlide}
            disabled={category.heroSlides.length >= MAX_HEROES}
          >
            <Plus className="size-4" />
            Tambah Banner
          </Button>
    </div>
  )
}
