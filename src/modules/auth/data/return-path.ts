import "server-only"

import { headers } from "next/headers"

import { REQUEST_PATH_HEADER } from "@/lib/constants/request-headers"

/**
 * Route auth tidak boleh menjadi tujuan kembali, karena akan membuat
 * pengguna berputar kembali ke halaman login setelah berhasil masuk.
 */
const BLOCKED_RETURN_PREFIXES = [
  "/login",
  "/register",
  "/lupa-password",
  "/first-time-setup",
]

/**
 * Hanya menerima path internal. Absolute URL dan protocol-relative path
 * (`//evil.com`, `/\evil.com`) ditolak supaya `from` tidak dapat dipakai
 * sebagai open redirect ke domain lain.
 */
export function sanitizeReturnPath(value: string | null | undefined) {
  if (!value) return null
  if (!value.startsWith("/")) return null
  if (value.startsWith("//") || value.startsWith("/\\")) return null

  const path = value.split("?")[0] ?? value
  const isBlocked = BLOCKED_RETURN_PREFIXES.some(
    (prefix) => path === prefix || path.startsWith(`${prefix}/`),
  )
  if (isBlocked) return null

  return value
}

/** Path yang sedang diakses, dibaca dari header yang dipasang proxy. */
export async function currentRequestPath() {
  try {
    const requestHeaders = await headers()
    return sanitizeReturnPath(requestHeaders.get(REQUEST_PATH_HEADER))
  } catch {
    // Di luar request context (misalnya CLI script) tidak ada path tujuan.
    return null
  }
}

export async function loginRedirectUrl(
  reason: "session-required" | "session-invalid",
) {
  const params = new URLSearchParams({ reason })
  const from = await currentRequestPath()
  if (from) params.set("from", from)

  return `/login?${params.toString()}`
}
