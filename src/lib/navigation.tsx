"use client"

/**
 * Lapisan navigasi bergaya React Router di atas `next/navigation`.
 *
 * Dibuat saat migrasi dari Vite + react-router-dom ke Next.js App Router supaya
 * call site di halaman-halaman lama tidak perlu diubah bentuknya. Semua di
 * bawahnya memakai API Next.js asli (`useRouter`, `usePathname`,
 * `useSearchParams`).
 */

import * as React from "react"
import {
  useParams as useNextParams,
  usePathname,
  useRouter,
  useSearchParams as useNextSearchParams,
} from "next/navigation"

/**
 * Padanan `useParams()` react-router. `useParams()` bawaan Next.js bertipe
 * `string | string[]` karena mendukung catch-all segment; di sini nilainya
 * selalu dinormalkan menjadi satu string seperti react-router.
 */
export function useParams<
  T extends Record<string, string | undefined> = Record<
    string,
    string | undefined
  >,
>(): T {
  const params = useNextParams()

  return React.useMemo(() => {
    const normalized: Record<string, string | undefined> = {}
    for (const [key, value] of Object.entries(params ?? {})) {
      normalized[key] = Array.isArray(value) ? value[0] : value
    }
    return normalized as T
  }, [params])
}

/* -------------------------------------------------------------------------- */
/* Navigation state                                                            */
/* -------------------------------------------------------------------------- */

/**
 * App Router tidak punya padanan `navigate(to, { state })` milik react-router,
 * padahal alur preview artikel/event mengoper draf lewat state. State disimpan
 * di sessionStorage dengan kunci pathname tujuan — sama seperti react-router,
 * state ikut bertahan saat halaman di-reload.
 */
const NAV_STATE_PREFIX = "benah:nav-state:"

function pathnameOf(href: string) {
  return href.split("?")[0].split("#")[0]
}

function writeNavState(href: string, state: unknown) {
  if (typeof window === "undefined") return
  const key = NAV_STATE_PREFIX + pathnameOf(href)
  if (state === undefined) {
    window.sessionStorage.removeItem(key)
    return
  }
  try {
    window.sessionStorage.setItem(key, JSON.stringify(state))
  } catch {
    // kuota penuh / mode privat — abaikan, preview cukup fallback ke data mock
  }
}

function readNavState<T>(pathname: string): T | undefined {
  if (typeof window === "undefined") return undefined
  try {
    const raw = window.sessionStorage.getItem(NAV_STATE_PREFIX + pathname)
    return raw ? (JSON.parse(raw) as T) : undefined
  } catch {
    return undefined
  }
}

/* -------------------------------------------------------------------------- */
/* useNavigate                                                                 */
/* -------------------------------------------------------------------------- */

export interface NavigateOptions {
  replace?: boolean
  state?: unknown
  scroll?: boolean
}

export type NavigateFunction = {
  (to: string, options?: NavigateOptions): void
  (delta: number): void
}

/** Padanan `useNavigate()` react-router. Mendukung `navigate(-1)`. */
export function useNavigate(): NavigateFunction {
  const router = useRouter()

  return React.useCallback(
    (to: string | number, options?: NavigateOptions) => {
      if (typeof to === "number") {
        if (to < 0) {
          for (let i = 0; i < Math.abs(to); i += 1) router.back()
        } else if (to > 0) {
          for (let i = 0; i < to; i += 1) router.forward()
        }
        return
      }

      writeNavState(to, options?.state)

      if (options?.replace) {
        router.replace(to, { scroll: options.scroll })
      } else {
        router.push(to, { scroll: options?.scroll })
      }
    },
    [router]
  ) as NavigateFunction
}

/* -------------------------------------------------------------------------- */
/* useLocation                                                                 */
/* -------------------------------------------------------------------------- */

export interface Location<S = unknown> {
  pathname: string
  search: string
  hash: string
  state: S | undefined
  key: string
}

/**
 * `search` dan `hash` hanya ada di browser. `useSyncExternalStore` memberi
 * snapshot server berupa string kosong sehingga hasil render server dan
 * hidrasi klien tetap cocok, lalu React membaca ulang snapshot-nya di klien.
 */
function subscribeToHistory(onStoreChange: () => void) {
  window.addEventListener("popstate", onStoreChange)
  window.addEventListener("hashchange", onStoreChange)
  return () => {
    window.removeEventListener("popstate", onStoreChange)
    window.removeEventListener("hashchange", onStoreChange)
  }
}

const emptyServerSnapshot = () => ""

/**
 * Padanan `useLocation()` react-router, termasuk `location.state`.
 *
 * Sengaja TIDAK memakai `useSearchParams()` milik Next.js: hook itu memaksa
 * setiap komponen pemakainya berada di dalam boundary `<Suspense>`, sedangkan
 * `useLocation()` di sini dipakai oleh Header dan Sidebar yang membungkus
 * seluruh halaman.
 */
export function useLocation<S = unknown>(): Location<S> {
  const pathname = usePathname()

  const search = React.useSyncExternalStore(
    subscribeToHistory,
    () => window.location.search,
    emptyServerSnapshot
  )
  const hash = React.useSyncExternalStore(
    subscribeToHistory,
    () => window.location.hash,
    emptyServerSnapshot
  )

  // `state` harus dibaca setelah hidrasi, bukan saat render: nilainya hanya
  // ada di sessionStorage milik browser, jadi membacanya saat render akan
  // membuat markup server dan klien berbeda.
  const [state, setState] = React.useState<S | undefined>(undefined)
  React.useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- lihat catatan di atas
    setState(readNavState<S>(pathname))
  }, [pathname])

  return React.useMemo(
    () => ({
      pathname,
      search,
      hash,
      state,
      key: `${pathname}${search}`,
    }),
    [pathname, search, hash, state]
  )
}

/* -------------------------------------------------------------------------- */
/* useSearchParams                                                             */
/* -------------------------------------------------------------------------- */

type SearchParamsInit =
  | string
  | URLSearchParams
  | Record<string, string | string[]>

type SetSearchParams = (
  init: SearchParamsInit,
  options?: { replace?: boolean }
) => void

/**
 * Padanan `useSearchParams()` react-router yang mengembalikan tuple
 * `[params, setParams]`. Versi Next.js hanya read-only.
 */
export function useSearchParams(): [URLSearchParams, SetSearchParams] {
  const router = useRouter()
  const pathname = usePathname()
  const nextSearchParams = useNextSearchParams()

  const params = React.useMemo(
    () => new URLSearchParams(nextSearchParams.toString()),
    [nextSearchParams]
  )

  const setParams = React.useCallback<SetSearchParams>(
    (init, options) => {
      let next: URLSearchParams
      if (typeof init === "string" || init instanceof URLSearchParams) {
        next = new URLSearchParams(init)
      } else {
        next = new URLSearchParams()
        for (const [key, value] of Object.entries(init)) {
          if (Array.isArray(value)) {
            value.forEach((entry) => next.append(key, entry))
          } else {
            next.set(key, value)
          }
        }
      }

      const query = next.toString()
      const href = query ? `${pathname}?${query}` : pathname
      // react-router menambah entri history secara default; `replace: true`
      // baru menggantinya. Perilaku itu dipertahankan agar tombol Back tetap
      // mengembalikan query sebelumnya.
      if (options?.replace) {
        router.replace(href, { scroll: false })
      } else {
        router.push(href, { scroll: false })
      }
    },
    [pathname, router]
  )

  return [params, setParams]
}

/* -------------------------------------------------------------------------- */
/* <Navigate />                                                                */
/* -------------------------------------------------------------------------- */

/** Padanan `<Navigate to="..." replace />` react-router, dengan prop `href`. */
export function Navigate({
  href,
  replace = false,
}: {
  href: string
  replace?: boolean
}) {
  const router = useRouter()

  React.useEffect(() => {
    if (replace) {
      router.replace(href)
    } else {
      router.push(href)
    }
  }, [router, href, replace])

  return null
}
