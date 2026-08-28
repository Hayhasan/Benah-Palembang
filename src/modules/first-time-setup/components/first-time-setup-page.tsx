"use client"

import { useActionState, useState } from "react"
import { ArrowRight, Eye, EyeOff, ShieldCheck } from "lucide-react"

import { Button } from "@/components/ui/button"
import { AuthPageShell } from "@/modules/auth/components/auth-page-shell"

import { firstTimeSetupAction } from "../actions/first-time-setup"
import { INITIAL_SETUP_ACTION_STATE } from "../types/first-time-setup"

export function FirstTimeSetupPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [state, formAction, isPending] = useActionState(
    firstTimeSetupAction,
    INITIAL_SETUP_ACTION_STATE,
  )

  return (
    <AuthPageShell asideDescription="Inisialisasi awal sistem Benah Palembang. Buat akun SuperAdmin pertama untuk mengelola platform.">
      <div className="mt-12 inline-flex items-center gap-2 rounded-full border border-palembang-gold/30 bg-palembang-gold/10 px-3.5 py-1 text-xs font-semibold text-palembang-gold">
        <ShieldCheck className="size-3.5" />
        Setup Inisialisasi SuperAdmin
      </div>
      <h1 className="mt-4 font-display text-4xl font-bold tracking-[-0.04em]">
        Selamat Datang.
      </h1>
      <p className="mt-2 text-sm leading-6 text-white/60">
        Buat akun Administrator Utama (SuperAdmin) pertama untuk mulai mengelola konten dan pengguna.
      </p>

      <form action={formAction} className="mt-8 space-y-4" noValidate>
        <label className="block text-xs font-semibold text-white/80">
          Nama Lengkap SuperAdmin
          <input
            name="name"
            type="text"
            required
            autoComplete="name"
            placeholder="Nama Lengkap Administrator"
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
          Alamat Email SuperAdmin
          <input
            name="email"
            type="email"
            required
            autoComplete="email"
            placeholder="superadmin@email.com"
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
          {isPending ? "Menginisialisasi Sistem..." : "Buat Akun SuperAdmin & Mulai"}
          {!isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>
    </AuthPageShell>
  )
}
