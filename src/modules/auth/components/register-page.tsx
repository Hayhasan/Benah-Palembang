"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { ArrowRight, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"

import { registerAction } from "../actions/register"
import { INITIAL_AUTH_ACTION_STATE } from "../types/auth-action-state"
import { AuthPageShell } from "./auth-page-shell"

export function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [state, formAction, isPending] = useActionState(
    registerAction,
    INITIAL_AUTH_ACTION_STATE,
  )

  return (
    <AuthPageShell asideDescription="Daftar untuk menyimpan cerita dan mengikuti agenda pilihanmu.">
      <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">
        Bergabung bersama.
      </h1>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Buat ruang personalmu di Benah Palembang.
      </p>
      <form action={formAction} className="mt-8 space-y-4" noValidate>
        <label className="block text-xs font-semibold text-white/80">
          Nama Lengkap
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Nama Anda"
            value={name}
            onChange={(event) => setName(event.target.value)}
            aria-invalid={Boolean(state.fieldErrors?.name)}
            className="mt-2 h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 text-sm text-white outline-none placeholder:text-white/40 focus:border-palembang-gold focus:bg-zinc-900 focus:ring-[3px] focus:ring-palembang-gold/30"
          />
          {state.fieldErrors?.name?.[0] && (
            <span className="mt-1.5 block text-[11px] font-medium text-red-300">
              {state.fieldErrors.name[0]}
            </span>
          )}
        </label>
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
        <label className="block text-xs font-semibold text-white/80">
          Password
          <div className="relative mt-2">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(state.fieldErrors?.password)}
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
          {state.fieldErrors?.password?.[0] && (
            <span className="mt-1.5 block text-[11px] font-medium text-red-300">
              {state.fieldErrors.password[0]}
            </span>
          )}
        </label>
        <label className="block text-xs font-semibold text-white/80">
          Konfirmasi Password
          <div className="relative mt-2">
            <input
              name="confirmPassword"
              type={showConfirmation ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
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
          {state.fieldErrors?.confirmPassword?.[0] && (
            <span className="mt-1.5 block text-[11px] font-medium text-red-300">
              {state.fieldErrors.confirmPassword[0]}
            </span>
          )}
        </label>
        {state.message && (
          <p
            role={state.accountCreated ? "status" : "alert"}
            className={`rounded-md border px-3 py-2.5 text-xs leading-5 ${
              state.accountCreated
                ? "border-emerald-400/20 bg-emerald-400/10 text-emerald-200"
                : "border-red-400/20 bg-red-400/10 text-red-200"
            }`}
          >
            {state.message}{" "}
            {state.accountCreated && (
              <Link href="/login" className="font-bold underline">
                Buka halaman login.
              </Link>
            )}
          </p>
        )}
        <Button
          type="submit"
          disabled={isPending || state.accountCreated}
          className="mt-3 h-11 w-full bg-palembang-gold font-bold text-palembang-charcoal hover:bg-palembang-gold/90"
        >
          {isPending ? "Memproses..." : "Daftar"}{" "}
          {!isPending && <ArrowRight className="size-4" />}
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
