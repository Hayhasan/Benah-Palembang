"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { ArrowRight, Check, Mail, RotateCcw } from "lucide-react"

import { Button } from "@/components/ui/button"

import { requestPasswordResetAction } from "../actions/request-password-reset"
import { INITIAL_PASSWORD_RESET_REQUEST_STATE } from "../types/password-reset"
import { AuthPageShell } from "./auth-page-shell"

export function ForgotPasswordPage() {
  const [email, setEmail] = useState("")
  const [now, setNow] = useState(() => Date.now())
  const [state, formAction, isPending] = useActionState(
    requestPasswordResetAction,
    INITIAL_PASSWORD_RESET_REQUEST_STATE,
  )

  useEffect(() => {
    if (state.status !== "sent" || !state.retryAt) return

    const timer = window.setInterval(() => setNow(Date.now()), 1_000)
    return () => window.clearInterval(timer)
  }, [state.retryAt, state.status])

  const remainingSeconds = state.retryAt
    ? Math.max(0, Math.ceil((state.retryAt - now) / 1000))
    : 0
  const submittedEmail = state.email || email

  return (
    <AuthPageShell asideDescription="Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.">
      <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">
        Lupa password?
      </h1>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Masukkan alamat email Anda untuk menerima tautan reset password.
      </p>

      {state.status === "sent" ? (
        <div className="mt-8 rounded-xl border border-palembang-gold/30 bg-palembang-gold/10 p-6">
          <div className="flex items-center gap-3 text-palembang-gold">
            <Check className="size-5" />
            <p className="text-sm font-semibold">Periksa email Anda</p>
          </div>
          <p className="mt-3 text-xs leading-5 text-white/65">
            {state.message}
          </p>
          {state.maskedEmail && (
            <p className="mt-2 text-xs font-semibold text-white/80">
              Tujuan: {state.maskedEmail}
            </p>
          )}

          <form action={formAction} className="mt-5">
            <input type="hidden" name="email" value={submittedEmail} />
            <Button
              type="submit"
              variant="outline"
              disabled={isPending || remainingSeconds > 0}
              className="w-full border-white/20 bg-transparent text-white hover:bg-white/10 hover:text-white"
            >
              <RotateCcw className="size-4" />
              {isPending
                ? "Mengirim..."
                : remainingSeconds > 0
                  ? `Kirim ulang dalam ${remainingSeconds} detik`
                  : "Kirim ulang tautan"}
            </Button>
          </form>

          <Link
            href="/login"
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-gold hover:underline"
          >
            <ArrowRight className="size-3 rotate-180" /> Kembali ke login
          </Link>
        </div>
      ) : (
        <form action={formAction} className="mt-8 space-y-4" noValidate>
          <label className="block text-xs font-semibold text-white/80">
            Email
            <input
              name="email"
              type="email"
              required
              autoComplete="email"
              placeholder="nama@email.com"
              value={email}
              onChange={(event) => setEmail(event.target.value.toLowerCase())}
              aria-invalid={Boolean(state.fieldErrors?.email)}
              className="mt-2 h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-palembang-gold focus:bg-zinc-900 focus:ring-[3px] focus:ring-palembang-gold/30"
            />
            {state.fieldErrors?.email?.[0] && (
              <span className="mt-1.5 block text-[11px] font-medium text-red-300">
                {state.fieldErrors.email[0]}
              </span>
            )}
          </label>

          {state.message && (
            <p
              role="alert"
              className="rounded-md border border-red-400/20 bg-red-400/10 px-3 py-2.5 text-xs leading-5 text-red-200"
            >
              {state.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-3 h-11 w-full bg-palembang-gold font-bold text-palembang-charcoal hover:bg-palembang-gold/90"
          >
            <Mail className="size-4" />
            {isPending ? "Memproses..." : "Kirim tautan reset"}
          </Button>
        </form>
      )}

      {state.status !== "sent" && (
        <p className="mt-8 text-center text-xs text-white/50">
          Sudah ingat?{" "}
          <Link
            href="/login"
            className="font-semibold text-palembang-gold hover:underline"
          >
            Masuk sekarang
          </Link>
        </p>
      )}
    </AuthPageShell>
  )
}
