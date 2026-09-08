import { ArrowRight, FileQuestion } from "lucide-react"
import Link from "next/link"

export function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 text-center">
      <div className="flex flex-col items-center">
        <div className="mb-4 flex size-20 items-center justify-center rounded-3xl border border-border/60 bg-muted/30 text-palembang-red shadow-sm">
          <FileQuestion className="size-10 text-palembang-red" />
        </div>
        <p className="font-display text-7xl font-black text-palembang-red">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold">
          Cerita ini belum ditemukan.
        </h1>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-red transition-all hover:underline"
        >
          Kembali ke beranda <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  )
}
