import { Eye, FileText, Heart } from "lucide-react"
import Link from "next/link"

import type { ArticleGalleryData } from "../types/article-gallery"

function statusClass(status: ArticleGalleryData["items"][number]["status"]) {
  if (status === "PUBLISHED") {
    return "border-emerald-200 bg-emerald-50 text-emerald-700 dark:border-emerald-500/30 dark:bg-emerald-500/15 dark:text-emerald-300"
  }
  if (status === "PENDING_REVIEW") {
    return "border-amber-200 bg-amber-50 text-amber-700 dark:border-amber-500/30 dark:bg-amber-500/15 dark:text-amber-300"
  }
  if (status === "REJECTED" || status === "TAKEN_DOWN") {
    return "border-red-200 bg-red-50 text-red-700 dark:border-red-500/30 dark:bg-red-500/15 dark:text-red-300"
  }
  if (status === "ARCHIVED") {
    return "border-slate-200 bg-slate-100 text-slate-700 dark:border-slate-500/30 dark:bg-slate-500/15 dark:text-slate-300"
  }
  return "border-border bg-background/90 text-muted-foreground"
}

export function ArticleGallery({
  data,
  previewMode,
}: {
  data: ArticleGalleryData
  previewMode: "manage" | "owner"
}) {
  return (
    <section>
      <div className="mb-6 flex flex-col gap-1 border-b pb-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h3 className="font-display text-xl font-bold">Galeri Artikel</h3>
          <p className="mt-1 text-xs text-muted-foreground">
            {data.totalItems === 0
              ? "Belum ada artikel yang dibuat."
              : `Menampilkan ${data.items.length} artikel terbaru dari ${data.totalItems} artikel aktif.`}
          </p>
        </div>
        {data.totalItems > 0 ? (
          <span className="text-xs text-muted-foreground">
            Klik artikel untuk melihat pratinjau
          </span>
        ) : null}
      </div>

      {data.items.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {data.items.map((article) => (
            <Link
              key={article.id}
              href={
                previewMode === "manage"
                  ? `/dashboard/content/article/${article.id}`
                  : `/dashboard/create-article/preview/${article.id}`
              }
              className="group overflow-hidden rounded-xl border bg-background text-left shadow-sm transition-all hover:border-palembang-red/40 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden bg-muted">
                {/* Article covers are user-managed HTTPS URLs. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={article.coverImageUrl}
                  alt={article.title}
                  loading="lazy"
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/35 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-palembang-charcoal shadow-md">
                    Lihat Pratinjau
                  </span>
                </div>
                <span
                  className={`absolute left-3 top-3 rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-wider shadow-sm ${statusClass(article.status)}`}
                >
                  {article.statusLabel}
                </span>
              </div>
              <div className="p-4">
                <h4 className="line-clamp-2 font-display text-lg font-bold leading-tight transition-colors group-hover:text-palembang-red">
                  {article.title}
                </h4>
                <p className="mt-2 text-[11px] text-muted-foreground">
                  Diperbarui {article.updatedAtLabel}
                </p>
                <div className="mt-3 flex items-center gap-4 border-t pt-3 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <Eye className="size-3.5" />
                    {article.views.toLocaleString("id-ID")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="size-3.5 text-palembang-red" />
                    {article.likes.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      ) : (
        <div className="flex min-h-48 flex-col items-center justify-center rounded-xl border border-dashed bg-muted/20 px-6 text-center">
          <FileText className="size-9 text-muted-foreground/60" />
          <p className="mt-3 text-sm font-semibold">Belum ada artikel</p>
          <p className="mt-1 text-xs text-muted-foreground">
            Artikel yang dibuat akun ini akan tampil di galeri.
          </p>
        </div>
      )}
    </section>
  )
}
