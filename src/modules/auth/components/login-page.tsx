"use client"

import Link from "next/link"
import { useState, type FormEvent } from "react"
import { ArrowRight, Eye, EyeOff } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { useAuth } from "@/context/AuthContext"
import { useNavigate } from "@/lib/navigation"

import { AuthPageShell } from "./auth-page-shell"

export function LoginPage() {
  const [showPassword, setShowPassword] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  function handleLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()

    if (login(email, password)) {
      navigate("/dashboard")
      return
    }

    toast.error("Email atau password salah")
  }

  return (
    <AuthPageShell asideDescription="Masuk untuk menyimpan cerita dan mengikuti agenda pilihanmu.">
      <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">
        Selamat datang kembali.
      </h1>
      <p className="mt-3 text-sm leading-6 text-white/60">
        Masuk ke ruang personalmu di Benah Palembang.
      </p>
      <form onSubmit={handleLogin} className="mt-8 space-y-4">
        <label className="block text-xs font-semibold text-white/80">
          Email
          <input
            type="email"
            required
            placeholder="nama@email.com"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
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
              value={password}
              onChange={(event) => setPassword(event.target.value)}
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
        <div className="flex justify-end">
          <Link
            href="/lupa-password"
            className="text-[11px] font-medium text-palembang-gold/80 transition-colors hover:text-palembang-gold hover:underline"
          >
            Lupa password?
          </Link>
        </div>
        <Button
          type="submit"
          className="mt-1 h-11 w-full bg-palembang-gold font-bold text-palembang-charcoal hover:bg-palembang-gold/90"
        >
          Masuk <ArrowRight className="size-4" />
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
