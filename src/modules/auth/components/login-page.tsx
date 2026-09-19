"use client"

import Link from "next/link"
import { useActionState, useState } from "react"
import { ArrowRight, Eye, EyeOff, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"

import { loginAction } from "../actions/login"
import { INITIAL_AUTH_ACTION_STATE } from "../types/auth-action-state"
import { AuthPageShell } from "./auth-page-shell"

export function LoginPage({
  passwordResetSuccess = false,
  returnPath = null,
}: {
  passwordResetSuccess?: boolean
  /** Tujuan setelah login berhasil, sudah divalidasi di server. */
  returnPath?: string | null
}) {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [state, formAction, isPending] = useActionState(
    loginAction,
    INITIAL_AUTH_ACTION_STATE,
  )

  return (
    <AuthPageShell asideDescription="Masuk untuk menyimpan cerita dan mengikuti agenda pilihanmu.">
      <h1 className="mt-2 font-display text-2xl sm:text-3xl font-bold tracking-[-0.02em] text-zinc-900">
        Selamat datang kembali.
      </h1>
      <p className="mt-2 text-sm text-zinc-500">
        Masuk ke ruang personalmu di Benah Palembang.
      </p>
      <form action={formAction} className="mt-8 space-y-4" noValidate>
        {returnPath ? (
          <input type="hidden" name="from" value={returnPath} />
        ) : null}
        {passwordResetSuccess && (
          <p
            role="status"
            className="rounded-md border border-emerald-200 bg-emerald-50 px-3 py-2.5 text-xs leading-5 text-emerald-700"
          >
            Password berhasil diperbarui. Silakan login dengan password baru.
          </p>
        )}
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
        <label className="block text-xs font-semibold text-zinc-700">
          Password
          <div className="relative mt-2">
            <input
              name="password"
              type={showPassword ? "text" : "password"}
              required
              autoComplete="current-password"
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
        <div className="flex justify-end">
          <Link
            href="/lupa-password"
            className="text-[11px] font-medium text-palembang-red/80 transition-colors hover:text-palembang-red hover:underline"
          >
            Lupa password?
          </Link>
        </div>
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
          className="mt-2 h-11 w-full bg-palembang-red font-bold text-white hover:bg-palembang-red/90"
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 size-4 animate-spin" />
              Memproses...
            </>
          ) : (
            <>
              Masuk <ArrowRight className="ml-2 size-4" />
            </>
          )}
        </Button>
      </form>
      <p className="mt-8 text-center text-xs text-zinc-500">
        Belum punya akun?{" "}
        <Link
          href={
            returnPath
              ? `/register?from=${encodeURIComponent(returnPath)}`
              : "/register"
          }
          className="font-semibold text-palembang-red hover:underline"
        >
          Daftar sekarang
        </Link>
      </p>
    </AuthPageShell>
  )
}
