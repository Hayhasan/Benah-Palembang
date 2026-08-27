"use client"

import Link from "next/link"
import { useState } from "react"
import { ArrowRight, Check, Mail } from "lucide-react"

import { Button } from "@/components/ui/button"

import { AuthPageShell } from "./auth-page-shell"

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)

  return (
    <AuthPageShell asideDescription="Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.">
      <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">
        Lupa password?
      </h1>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Masukkan alamat email yang terdaftar dan kami akan mengirimkan tautan
        reset password.
      </p>
      {sent ? (
        <div className="mt-8 rounded-xl border border-palembang-gold/30 bg-palembang-gold/10 p-6">
          <div className="flex items-center gap-3 text-palembang-gold">
            <Check className="size-5" />
            <p className="text-sm font-semibold">Email terkirim!</p>
          </div>
          <p className="mt-2 text-xs leading-5 text-white/60">
            Silakan cek inbox email kamu untuk tautan reset password. Jika
            tidak muncul, periksa folder spam.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-gold hover:underline"
          >
            <ArrowRight className="size-3 rotate-180" /> Kembali ke login
          </Link>
        </div>
      ) : (
        <form
          onSubmit={(event) => {
            event.preventDefault()
            setSent(true)
          }}
          className="mt-8 space-y-4"
        >
          <label className="block text-xs font-semibold text-white/80">
            Email
            <input
              type="email"
              required
              placeholder="nama@email.com"
              className="mt-2 h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-palembang-gold focus:bg-zinc-900 focus:ring-[3px] focus:ring-palembang-gold/30"
            />
          </label>
          <Button
            type="submit"
            className="mt-3 h-11 w-full bg-palembang-gold font-bold text-palembang-charcoal hover:bg-palembang-gold/90"
          >
            <Mail className="size-4" /> Kirim tautan reset
          </Button>
        </form>
      )}
      <p className="mt-8 text-center text-xs text-white/50">
        Sudah ingat?{" "}
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
