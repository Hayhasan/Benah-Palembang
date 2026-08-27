"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"

import { AuthPageShell } from "./auth-page-shell"

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)

  return (
    <AuthPageShell asideDescription="Daftar untuk menyimpan cerita dan mengikuti agenda pilihanmu.">
      <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">
        Bergabung bersama.
      </h1>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Buat ruang personalmu di Benah Palembang.
      </p>
      <form
        onSubmit={(event) => event.preventDefault()}
        className="mt-8 space-y-4"
      >
        <label className="block text-xs font-semibold text-white/80">
          Nama Lengkap
          <input
            type="text"
            required
            placeholder="Nama Anda"
            className="mt-2 h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-palembang-gold focus:bg-zinc-900 focus:ring-[3px] focus:ring-palembang-gold/30"
          />
        </label>
        <label className="block text-xs font-semibold text-white/80">
          Email
          <input
            type="email"
            required
            placeholder="nama@email.com"
            className="mt-2 h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-palembang-gold focus:bg-zinc-900 focus:ring-[3px] focus:ring-palembang-gold/30"
          />
        </label>
        <label className="block text-xs font-semibold text-white/80">
          Password
          <div className="relative mt-2">
            <input
              type={showPassword ? "text" : "password"}
              required
              placeholder="••••••••"
              className="h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 pr-10 text-sm text-white outline-none placeholder:text-white/40 focus:border-palembang-gold focus:bg-zinc-900 focus:ring-[3px] focus:ring-palembang-gold/30"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
              tabIndex={-1}
            >
              {showPassword ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </label>
        <label className="block text-xs font-semibold text-white/80">
          Konfirmasi Password
          <div className="relative mt-2">
            <input
              type={showConfirmation ? "text" : "password"}
              required
              placeholder="••••••••"
              className="h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 pr-10 text-sm text-white outline-none placeholder:text-white/40 focus:border-palembang-gold focus:bg-zinc-900 focus:ring-[3px] focus:ring-palembang-gold/30"
            />
            <button
              type="button"
              onClick={() => setShowConfirmation((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
              tabIndex={-1}
            >
              {showConfirmation ? (
                <EyeOff className="size-4" />
              ) : (
                <Eye className="size-4" />
              )}
            </button>
          </div>
        </label>
        <Button
          type="submit"
          className="mt-3 h-11 w-full bg-palembang-gold font-bold text-palembang-charcoal hover:bg-palembang-gold/90"
        >
          Daftar <ArrowRight className="size-4" />
        </Button>
      </form>
      <p className="mt-8 text-center text-xs text-white/50">
        Sudah punya akun?{" "}
        <Link
          href="/login"
          className="font-semibold text-palembang-gold hover:underline"
        >
          Masuk sekarang
        </Link>
      </p>
    </AuthPageShell>
  )
}
