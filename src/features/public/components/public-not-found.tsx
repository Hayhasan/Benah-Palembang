"use client"

import { ArrowLeft, ArrowRight } from "lucide-react"
import Link from "next/link"

export function PublicNotFound() {
  return (
    <main className="flex-1 flex flex-col items-center justify-center mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 py-16 sm:py-24 text-center w-full">
      {/* Editorial Badge */}
      <span className="inline-block rounded-[3px] bg-black text-white border border-black px-4 py-1.5 text-xs sm:text-[13px] font-bold uppercase tracking-[0.16em]">
        404 / HALAMAN TIDAK DITEMUKAN
      </span>

      {/* Hero Headline */}
      <h1 className="mt-6 font-sans text-6xl sm:text-8xl lg:text-9xl font-black tracking-tighter text-black leading-none select-none">
        404
      </h1>

      {/* Subtitle */}
      <h2 className="mt-4 font-sans text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-black">
        Alamat Halaman Tidak Ditemukan
      </h2>

      {/* Dotted Divider */}
      <div className="my-6 border-b border-dotted border-zinc-300 w-full max-w-md" />

      {/* Editorial Description */}
      <p className="font-serif text-sm sm:text-base text-black/75 max-w-lg leading-relaxed">
        Tautan yang Anda tuju mungkin salah ketik, telah dipindahkan, atau tidak lagi tersedia.
        Silakan kembali ke beranda atau telusuri agenda kota Palembang.
      </p>

      {/* CTA Buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-[3px] bg-black px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-white hover:bg-zinc-800 transition-colors"
        >
          <ArrowLeft className="size-3.5" />
          Kembali ke Beranda
        </Link>
        <Link
          href="/agenda"
          className="inline-flex items-center gap-2 rounded-[3px] border border-black bg-white px-6 py-3 text-xs font-bold uppercase tracking-[0.14em] text-black hover:bg-black hover:text-white transition-colors"
        >
          Lihat Agenda Kota
          <ArrowRight className="size-3.5" />
        </Link>
      </div>
    </main>
  )
}
