"use client"

import { Archive, Eye, Save, Send } from "lucide-react"
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

import { archiveArticleAction } from "../actions/archive-article"
import { saveArticleAction } from "../actions/save-article"
import type {
  ArticleActionResult,
  ArticleCategoryOption,
  ArticleSaveIntent,
  OwnedArticleEditorData,
} from "../types/article"

interface ArticleEditorProps {
  initialArticle?: OwnedArticleEditorData
  categories: ArticleCategoryOption[]
}

export function ArticleEditor({
  initialArticle,
  categories,
}: ArticleEditorProps) {
  const router = useRouter()
  const { registerSaveHandler, setIsDirty } = useUnsavedChanges()
  const [isPending, startTransition] = useTransition()
  const [articleId, setArticleId] = useState(initialArticle?.id)
  const [status, setStatus] = useState(initialArticle?.status)
  const [title, setTitle] = useState(initialArticle?.title ?? "")
  const [excerpt, setExcerpt] = useState(initialArticle?.excerpt ?? "")
  const [content, setContent] = useState(initialArticle?.content ?? "")
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
  const [isUploadingBanner, setIsUploadingBanner] = useState(false)
  const [isUploadingContentImage, setIsUploadingContentImage] = useState(false)

  const markDirty = () => setIsDirty(true)

  const actionPayload = useCallback(
    (intent: ArticleSaveIntent) => ({
      id: articleId,
      intent,
      title,
      excerpt,
      content,
      coverImageUrl,
      websiteArticleSectionId,
      tags,
    }),
    [
      articleId,
      content,
      coverImageUrl,
      excerpt,
      tags,
      title,
      websiteArticleSectionId,
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
      router.push("/dashboard/create-article")
      router.refresh()
    })
  }

  const canPost = status === undefined || status === "DRAFT"
  const canArchive = status === "PUBLISHED" && articleId !== undefined
  const isBusy = isPending || isUploadingBanner || isUploadingContentImage

  return (
    <div className="space-y-8 pb-10">
      <div className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/85 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <div className="flex flex-wrap items-center gap-3">
            <h2 className="text-3xl font-bold tracking-tight">
              {initialArticle ? "Edit Artikel" : "Tulis Artikel Baru"}
            </h2>
            {initialArticle ? (
              <span className="rounded-full bg-muted px-2.5 py-1 text-xs font-semibold text-muted-foreground">
                {initialArticle.statusLabel}
              </span>
            ) : null}
          </div>
          <p className="text-muted-foreground">
            Bagikan cerita dan gagasan Anda ke warga Palembang.
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
            {initialArticle ? "Save Artikel" : "Simpan Draf"}
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
        {/* Kolom Kiri: Form Judul, Excerpt & Rich Text Editor */}
        <div className="space-y-6 lg:col-span-3">
          <div className="space-y-4 rounded-xl border bg-background p-5 shadow-sm">
            <Field label="Judul Artikel">
              <Input
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  markDirty()
                }}
                placeholder="Masukkan judul artikel yang menarik..."
                className="text-lg font-semibold"
              />
            </Field>
            <Field label="Ringkasan / Excerpt Singkat">
              <textarea
                value={excerpt}
                onChange={(event) => {
                  setExcerpt(event.target.value)
                  markDirty()
                }}
                className="min-h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm outline-none focus-visible:ring-1 focus-visible:ring-ring"
                placeholder="Tuliskan 1-2 kalimat pengantar artikel yang memikat pembaca..."
              />
            </Field>
          </div>

          <Field label="Konten Lengkap">
            <TiptapEditor
              content={content}
              imageUploadScope="article"
              onUploadingChange={setIsUploadingContentImage}
              onChange={(value) => {
                setContent(value)
                markDirty()
              }}
            />
          </Field>
        </div>

        {/* Kolom Kanan: Banner, Kategori, Tags */}
        <div className="space-y-6 lg:col-span-1">
          <div className="space-y-5 overflow-hidden rounded-xl border bg-background p-5 shadow-sm">
            <Field label="Banner Utama Artikel">
              <ImageUpload
                value={coverImageUrl}
                onChange={(value) => {
                  setCoverImageUrl(value)
                  markDirty()
                }}
                uploadScope="article"
                onUploadingChange={setIsUploadingBanner}
                aspect={16 / 9}
                placeholder="Upload banner/cover..."
              />
            </Field>

            <Field label="Kategori">
              <select
                value={websiteArticleSectionId}
                onChange={(event) => {
                  setWebsiteArticleSectionId(Number(event.target.value))
                  markDirty()
                }}
                className="flex h-10 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-ring"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
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
        title="Konfirmasi Archive Artikel"
        description={`Artikel "${title || "ini"}" akan diarsipkan dan tidak lagi tampil pada halaman publik maupun daftar Artikel aktif.`}
        confirmText="Ya, Archive Artikel"
        variant="destructive"
        onConfirm={handleArchive}
      />
    </div>
  )
}

function Field({
  children,
  label,
}: {
  children: React.ReactNode
  label: string
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}
