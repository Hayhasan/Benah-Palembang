"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { ArrowRight, Eye, EyeOff } from "lucide-react"

import { Button } from "@/components/ui/button"

import { loginAction } from "../actions/login"
import { INITIAL_AUTH_ACTION_STATE } from "../types/auth-action-state"
import { AuthPageShell } from "./auth-page-shell"

export function LoginPage({ passwordResetSuccess = false }: { passwordResetSuccess?: boolean }) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [state, formAction, isPending] = useActionState(
    loginAction,
    INITIAL_AUTH_ACTION_STATE,
  )

  return (
    <AuthPageShell asideDescription="Masuk untuk menyimpan cerita dan mengikuti agenda pilihanmu.">
      <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">
        Selamat datang kembali.
      </h1>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Masuk ke ruang personalmu di Benah Palembang.
      </p>
      <form action={formAction} className="mt-8 space-y-4" noValidate>
        {passwordResetSuccess && (
          <p
            role="status"
            className="rounded-md border border-emerald-400/20 bg-emerald-400/10 px-3 py-2.5 text-xs leading-5 text-emerald-200"
          >
            Password berhasil diperbarui. Silakan login dengan password baru.
          </p>
        )}
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
              autoComplete="current-password"
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
        <div className="flex justify-end">
          <Link
            href="/lupa-password"
            className="text-[11px] font-medium text-palembang-gold/80 transition-colors hover:text-palembang-gold hover:underline"
          >
            Lupa password?
          </Link>
        </div>
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
          className="mt-1 h-11 w-full bg-palembang-gold font-bold text-palembang-charcoal hover:bg-palembang-gold/90"
        >
          {isPending ? "Memproses..." : "Masuk"}{" "}
          {!isPending && <ArrowRight className="size-4" />}
        </Button>
      </form>
      <p className="mt-8 text-center text-xs text-white/50">
        Belum punya akun?{" "}
        <Link
          href="/register"
          className="font-semibold text-palembang-gold hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </AuthPageShell>
  )
}
