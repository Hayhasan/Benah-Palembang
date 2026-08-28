"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { AlertTriangle, ArrowRight, Eye, EyeOff, KeyRound } from "lucide-react"

import { Button } from "@/components/ui/button"

import { resetPasswordAction } from "../actions/reset-password"
import {
  INITIAL_PASSWORD_RESET_FORM_STATE,
  type PasswordResetTokenStatus,
} from "../types/password-reset"
import { AuthPageShell } from "./auth-page-shell"

function invalidStatusCopy(status: PasswordResetTokenStatus["status"]) {
  if (status === "used") {
    return "Tautan reset password ini sudah pernah digunakan."
  }
  if (status === "replaced") {
    return "Tautan ini sudah digantikan oleh permintaan reset password yang lebih baru."
  }
  return "Tautan reset password tidak valid atau sudah kedaluwarsa."
}

export function ResetPasswordPage({
  token,
  tokenStatus,
}: {
  token: string
  tokenStatus: PasswordResetTokenStatus
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [state, formAction, isPending] = useActionState(
    resetPasswordAction,
    INITIAL_PASSWORD_RESET_FORM_STATE,
  )

  return (
    <AuthPageShell asideDescription="Buat password baru untuk mengamankan kembali akun Anda.">
      <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">
        Atur password baru.
      </h1>

      {tokenStatus.status !== "valid" ? (
        <div className="mt-8 rounded-xl border border-red-400/25 bg-red-400/10 p-6">
          <div className="flex items-center gap-3 text-red-300">
            <AlertTriangle className="size-5" />
            <p className="text-sm font-semibold">Tautan tidak dapat digunakan</p>
          </div>
          <p className="mt-3 text-xs leading-5 text-white/65">
            {invalidStatusCopy(tokenStatus.status)} Silakan minta tautan reset
            password baru.
          </p>
          <Button
            asChild
            className="mt-5 bg-palembang-gold font-bold text-palembang-charcoal hover:bg-palembang-gold/90"
          >
            <Link href="/lupa-password">Minta tautan baru</Link>
          </Button>
        </div>
      ) : (
        <>
          <p className="mt-3 text-sm leading-6 text-white/60">
            Masukkan password baru untuk akun {tokenStatus.maskedEmail}.
          </p>
          <form action={formAction} className="mt-8 space-y-4" noValidate>
            <input type="hidden" name="token" value={token} />

            <label className="block text-xs font-semibold text-white/80">
              Password Baru
              <div className="relative mt-2">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-invalid={Boolean(state.fieldErrors?.password)}
                  className="h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 pr-10 text-sm text-white outline-none placeholder:text-white/40 focus:border-palembang-gold focus:ring-[3px] focus:ring-palembang-gold/30"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
                  tabIndex={-1}
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {state.fieldErrors?.password?.[0] && (
                <span className="mt-1.5 block text-[11px] font-medium text-red-300">
                  {state.fieldErrors.password[0]}
                </span>
              )}
            </label>

            <label className="block text-xs font-semibold text-white/80">
              Konfirmasi Password Baru
              <div className="relative mt-2">
                <input
                  name="confirmPassword"
                  type={showConfirmation ? "text" : "password"}
                  required
                  autoComplete="new-password"
                  placeholder="••••••••"
                  aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
                  className="h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 pr-10 text-sm text-white outline-none placeholder:text-white/40 focus:border-palembang-gold focus:ring-[3px] focus:ring-palembang-gold/30"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmation((visible) => !visible)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white"
                  tabIndex={-1}
                  aria-label={showConfirmation ? "Sembunyikan konfirmasi password" : "Tampilkan konfirmasi password"}
                >
                  {showConfirmation ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
              {state.fieldErrors?.confirmPassword?.[0] && (
                <span className="mt-1.5 block text-[11px] font-medium text-red-300">
                  {state.fieldErrors.confirmPassword[0]}
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
              className="h-11 w-full bg-palembang-gold font-bold text-palembang-charcoal hover:bg-palembang-gold/90"
            >
              <KeyRound className="size-4" />
              {isPending ? "Memperbarui..." : "Simpan password baru"}
            </Button>
          </form>
        </>
      )}

      <Link
        href="/login"
        className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-gold hover:underline"
      >
        <ArrowRight className="size-3 rotate-180" /> Kembali ke login
      </Link>
    </AuthPageShell>
  )
}
