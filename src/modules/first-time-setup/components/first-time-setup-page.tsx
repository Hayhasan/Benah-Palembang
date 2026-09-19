"use client"

import { useActionState, useState } from "react"
import { ArrowRight, Eye, EyeOff, Loader2, ShieldCheck } from "lucide-react"

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
      <div className="mt-2 inline-flex items-center gap-2 rounded-full border border-palembang-red/30 bg-palembang-red/10 px-3.5 py-1 text-xs font-semibold text-palembang-red">
        <ShieldCheck className="size-3.5" />
        Setup Inisialisasi SuperAdmin
      </div>
      <h1 className="mt-4 font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-zinc-900">
        Selamat Datang.
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Buat akun Administrator Utama (SuperAdmin) pertama untuk mulai mengelola konten dan pengguna.
      </p>

      <form action={formAction} className="mt-8 space-y-4" noValidate>
        <label className="block text-xs font-semibold text-zinc-700">
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
            className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-palembang-red focus:bg-white focus:ring-[3px] focus:ring-palembang-red/30 transition-shadow"
          />
          {state.fieldErrors?.name?.[0] && (
            <span className="mt-1.5 block text-[11px] font-medium text-red-500">
              {state.fieldErrors.name[0]}
            </span>
          )}
        </label>

        <label className="block text-xs font-semibold text-zinc-700">
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
            className="mt-2 h-11 w-full rounded-md border border-zinc-300 bg-white px-3 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-palembang-red focus:bg-white focus:ring-[3px] focus:ring-palembang-red/30 transition-shadow"
          />
          {state.fieldErrors?.email?.[0] && (
            <span className="mt-1.5 block text-[11px] font-medium text-red-500">
              {state.fieldErrors.email[0]}
            </span>
          )}
        </label>

        <label className="block text-xs font-semibold text-zinc-700">
          Password
          <div className="relative mt-2">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(state.fieldErrors?.password)}
              className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-palembang-red focus:bg-white focus:ring-[3px] focus:ring-palembang-red/30 transition-shadow"
            />
            <button
              type="button"
              onClick={() => setShowPassword((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
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
            <span className="mt-1.5 block text-[11px] font-medium text-red-500">
              {state.fieldErrors.password[0]}
            </span>
          )}
        </label>

        <label className="block text-xs font-semibold text-zinc-700">
          Konfirmasi Password
          <div className="relative mt-2">
            <input
              name="confirmPassword"
              type={showConfirmation ? "text" : "password"}
              required
              autoComplete="new-password"
              placeholder="••••••••"
              aria-invalid={Boolean(state.fieldErrors?.confirmPassword)}
              className="h-11 w-full rounded-md border border-zinc-300 bg-white px-3 pr-10 text-sm text-zinc-900 outline-none placeholder:text-zinc-400 focus:border-palembang-red focus:bg-white focus:ring-[3px] focus:ring-palembang-red/30 transition-shadow"
            />
            <button
              type="button"
              onClick={() => setShowConfirmation((visible) => !visible)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-400 transition-colors hover:text-zinc-600"
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
            <span className="mt-1.5 block text-[11px] font-medium text-red-500">
              {state.fieldErrors.confirmPassword[0]}
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
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Menginisialisasi Sistem...
            </>
          ) : (
            <>
              Buat Akun SuperAdmin & Mulai <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
    </AuthPageShell>
  )
}
