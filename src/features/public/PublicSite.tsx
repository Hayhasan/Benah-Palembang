import { ArrowRight } from "lucide-react"
import Link from "next/link"

export function NotFound() {
  return (
    <main className="flex min-h-svh items-center justify-center px-6 text-center">
      <div>
        <p className="font-display text-7xl font-black text-palembang-red">
          404
        </p>
        <h1 className="mt-4 font-display text-3xl font-bold">
          Cerita ini belum ditemukan.
        </h1>
        <Link
          href="/"
          className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-red"
        >
          Kembali ke beranda <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  )
}
