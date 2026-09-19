"use client"

import Link from "next/link"
import { useActionState, useEffect, useState } from "react"
import { ArrowRight, Check, Loader2, Mail, RotateCcw } from "lucide-react"

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
      <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-zinc-900">
        Lupa password?
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Masukkan alamat email Anda untuk menerima tautan reset password.
      </p>

      {state.status === "sent" ? (
        <div className="mt-8 rounded-xl border border-palembang-red/30 bg-palembang-red/10 p-6">
          <div className="flex items-center gap-3 text-palembang-red">
            <Check className="size-5" />
            <p className="text-sm font-semibold">Periksa email Anda</p>
          </div>
          <p className="mt-3 text-xs leading-5 text-zinc-600">
            {state.message}
          </p>
          {state.maskedEmail && (
            <p className="mt-2 text-xs font-semibold text-zinc-800">
              Tujuan: {state.maskedEmail}
            </p>
          )}

          <form action={formAction} className="mt-5">
            <input type="hidden" name="email" value={submittedEmail} />
            <Button
              type="submit"
              variant="outline"
              disabled={isPending || remainingSeconds > 0}
              className="w-full border-zinc-200 bg-white text-zinc-700 hover:bg-zinc-50 hover:text-zinc-900"
            >
              <RotateCcw className="size-4 mr-2" />
              {isPending
                ? "Mengirim..."
                : remainingSeconds > 0
                  ? `Kirim ulang dalam ${remainingSeconds} detik`
                  : "Kirim ulang tautan"}
            </Button>
          </form>

          <Link
            href="/login"
            className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-red hover:underline"
          >
            <ArrowRight className="size-3 rotate-180" /> Kembali ke login
          </Link>
        </div>
      ) : (
        <form action={formAction} className="mt-8 space-y-4" noValidate>
          <label className="block text-xs font-semibold text-zinc-700">
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
              className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-palembang-red focus:bg-white focus:ring-[3px] focus:ring-palembang-red/30 transition-shadow"
            />
            {state.fieldErrors?.email?.[0] && (
              <span className="mt-1.5 block text-[11px] font-medium text-red-500">
                {state.fieldErrors.email[0]}
              </span>
            )}
          </label>

          {state.message && (
            <p
              role="alert"
              className="rounded-md border border-red-200 bg-red-50 px-3 py-2.5 text-xs leading-5 text-red-700"
            >
              {state.message}
            </p>
          )}

          <Button
            type="submit"
            disabled={isPending}
            className="mt-3 h-11 w-full bg-palembang-red font-bold text-white hover:bg-palembang-red/90"
          >
            {isPending ? (
              <Loader2 className="mr-2 size-4 animate-spin" />
            ) : (
              <Mail className="mr-2 size-4" />
            )}
            {isPending ? "Memproses..." : "Kirim tautan reset"}
          </Button>
        </form>
      )}

      {state.status !== "sent" && (
        <p className="mt-8 text-center text-xs text-zinc-500">
          Sudah ingat?{" "}
          <Link
            href="/login"
            className="font-semibold text-palembang-red hover:underline"
          >
            Masuk sekarang
          </Link>
        </p>
      )}
    </AuthPageShell>
  )
}
