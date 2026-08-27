# Migrasi Benah Palembang: Vite (SPA) → Next.js 16 App Router

> Dokumen ini adalah rencana kerja yang persisten. Update checkbox saat progres berjalan.
>
> - **Sumber (legacy):** `benah-palembang-legacy-vite/`
> - **Target:** root repo (Next.js `16.3.3`, React `19.2.8`, Tailwind v4, TypeScript)
> - **Branch:** `refactor/migrate-to-nextjs`
> - **Prinsip utama:** tampilan **100% identik**. Semua mock data dipindahkan apa adanya.

---

## 1. Hasil audit legacy

| Aspek | Temuan |
|---|---|
| Total file `src/` | 94 file (~8.900 baris di pages/components/data) |
| UI kit | shadcn/ui "new-york", 60 komponen di `src/components/ui/` |
| Styling | Tailwind v4 CSS-first (`@theme inline`) di `src/index.css` (289 baris) |
| Font | Google Fonts via `@import` di CSS (Playfair Display + Inter) |
| Router | `react-router-dom` v7 — 105 `<Link>`, 29 `useNavigate`, 10 `useParams`, 10 `useSearchParams`, 8 `useLocation`, 5 `Outlet`, 2 `Navigate` |
| State auth | `AuthContext` in-memory (tanpa localStorage) — refresh = logout |
| Env vars | Tidak ada `import.meta.env` sama sekali → tidak ada yang perlu di-rename |
| Backend | Tidak ada. Murni frontend + mock data |

### Temuan penting (bug legacy)

1. **`<Toaster />` tidak pernah di-mount.** 15 file memanggil `toast()` dari `sonner`, tapi komponen `Toaster` di `src/components/ui/sonner.tsx` tidak dirender di mana pun → tidak ada toast yang muncul di app legacy. **Keputusan: di-mount di root layout Next.js** (perbaikan cacat; nol dampak layout sampai toast benar-benar dipanggil). Hapus satu baris di `app/layout.tsx` bila ingin paritas ketat.
2. **Route `/dashboard/create-article/edit` & `/dashboard/create-event/edit` tidak terdaftar.** Dipanggil oleh `navigate()` di `ManageContent.tsx`, tapi tidak ada di `App.tsx` → di legacy menghasilkan halaman dashboard kosong. Akan dibuat sebagai route asli di Next.js (reuse editor yang sama) supaya tidak jadi 404.
3. **Tema efektif selalu gelap.** `theme-provider` menambahkan class `light`/`dark` ke `<html>`, tapi `index.css` hanya punya blok `:root` (nilai gelap) dan `.dark` — **tidak ada blok `.light`**. Jadi toggle tema tidak berefek visual. Disalin apa adanya agar tampilan identik.
4. **`src/pages/landing/HomePage.tsx` (617 baris) adalah dead code** — tidak diimpor di mana pun (`App.tsx` memakai `HomePage` dari `PublicSite.tsx`). Tetap dipindahkan agar tidak ada yang hilang, tanpa diberi route.

---

## 2. Peta route: React Router → App Router

### Publik — route group `(public)`, layout = `<Header />`

| Legacy route | File Next.js | Komponen |
|---|---|---|
| `/` | `app/(public)/page.tsx` | `HomePage` |
| `/cerita-warga` | `app/(public)/cerita-warga/page.tsx` | `CategoryPage category="Cerita Warga"` |
| `/gaya-hidup` | `app/(public)/gaya-hidup/page.tsx` | `CategoryPage category="Gaya Hidup"` |
| `/ruang-kota` | `app/(public)/ruang-kota/page.tsx` | `CategoryPage category="Ruang Kota"` |
| `/industri-kreatif` | `app/(public)/industri-kreatif/page.tsx` | `CategoryPage category="Industri Kreatif"` |
| `/kebudayaan` | `app/(public)/kebudayaan/page.tsx` | `CategoryPage category="Kebudayaan"` |
| `/artikel/:slug` | `app/(public)/artikel/[slug]/page.tsx` | `ArticlePage` |
| `/agenda` | `app/(public)/agenda/page.tsx` | `AgendaPage` |
| `/agenda/:id` | `app/(public)/agenda/[id]/page.tsx` | `AgendaDetailPage` |
| `/kolaborasi` | `app/(public)/kolaborasi/page.tsx` | `CollaborationPage` |
| `/login` | `app/(public)/login/page.tsx` | `LoginPage` |
| `/register` | `app/(public)/register/page.tsx` | `RegisterPage` |
| `/lupa-password` | `app/(public)/lupa-password/page.tsx` | `ForgotPasswordPage` |
| `*` | `app/not-found.tsx` | `NotFound` + `<Header />` |

> Kategori dibuat sebagai 5 folder statis (bukan `[category]` dinamis) agar slug tak dikenal tetap jatuh ke 404, persis seperti legacy.

### Dashboard — `app/dashboard/`, layout = `DashboardLayout`

| Legacy route | File Next.js | Komponen |
|---|---|---|
| `/dashboard` | `app/dashboard/page.tsx` | `Overview` |
| `/dashboard/website` | `app/dashboard/website/page.tsx` | `ManageWebsite` |
| `/dashboard/account/user` | `app/dashboard/account/user/page.tsx` | `ManageUser` |
| `/dashboard/account/user/:id` | `app/dashboard/account/user/[id]/page.tsx` | `UserProfile` |
| `/dashboard/account/admin` | `app/dashboard/account/admin/page.tsx` | `ManageAdmin` |
| `/dashboard/account/admin/:id` | `app/dashboard/account/admin/[id]/page.tsx` | `UserProfile` |
| `/dashboard/content` | `app/dashboard/content/page.tsx` | `ManageContent` |
| `/dashboard/create-article` | `app/dashboard/create-article/page.tsx` | `CreateArticle` |
| `/dashboard/create-article/new` | `app/dashboard/create-article/new/page.tsx` | `CreateArticleEditor` |
| `/dashboard/create-article/edit` † | `app/dashboard/create-article/edit/page.tsx` | `CreateArticleEditor` |
| `/dashboard/create-article/preview/:id` | `app/dashboard/create-article/preview/[id]/page.tsx` | `ArticlePreview` |
| `/dashboard/article/preview/:id` | `app/dashboard/article/preview/[id]/page.tsx` | `ArticlePreview` |
| `/dashboard/create-event` | `app/dashboard/create-event/page.tsx` | `CreateEvent` |
| `/dashboard/create-event/new` | `app/dashboard/create-event/new/page.tsx` | `CreateEventEditor` |
| `/dashboard/create-event/edit` † | `app/dashboard/create-event/edit/page.tsx` | `CreateEventEditor` |
| `/dashboard/create-event/preview/:id` | `app/dashboard/create-event/preview/[id]/page.tsx` | `EventPreview` |
| `/dashboard/event/preview/:id` | `app/dashboard/event/preview/[id]/page.tsx` | `EventPreview` |
| `/dashboard/logs` | `app/dashboard/logs/page.tsx` | `LogActivities` |
| `/dashboard/profile` | `app/dashboard/profile/page.tsx` | `Profile` |

† route baru — memperbaiki temuan #2 di atas.

---

## 3. Strategi konversi API router

Dibuat modul kompatibilitas tipis `src/lib/navigation.ts` (client) yang mengimplementasikan API bergaya react-router **di atas `next/navigation` asli**. Tujuannya menekan jumlah edit manual di 20 file page → memaksimalkan kesetiaan tampilan.

| react-router | Pengganti |
|---|---|
| `<Link to="/x">` | `next/link` → `<Link href="/x">` (konversi prop `to` → `href`) |
| `useNavigate()` | `useNavigate()` dari `@/lib/navigation` — bungkus `useRouter()`; dukung `navigate(path)`, `navigate(path, { replace })`, dan `navigate(-1)` → `router.back()` |
| `useLocation()` | `useLocation()` dari `@/lib/navigation` — gabungan `usePathname()` + `useSearchParams()` → `{ pathname, search, hash }` |
| `useParams()` | `useParams()` dari `next/navigation` (sinkron di client component) |
| `useSearchParams()` | `useSearchParams()` dari `@/lib/navigation` — kembalikan tuple `[params, setParams]`; setter memakai `router.replace()` |
| `<Outlet />` | prop `children` di `layout.tsx` |
| `<Navigate to="/login" replace />` | komponen `<Navigate />` di `@/lib/navigation` — `useEffect` + `router.replace()` |
| `<BrowserRouter>` | dihapus — routing berbasis file |

---

## 4. Hal khusus Next.js 16 yang harus ditangani

Diverifikasi terhadap `node_modules/next/dist/docs/`:

1. **`'use client'`** — hampir seluruh app interaktif. Semua `layout.tsx`/`page.tsx` menjadi shell tipis; komponen berat ditandai `'use client'`.
2. **Async Request APIs (breaking di v16)** — `params`/`searchParams` di `page.tsx`/`layout.tsx` kini `Promise`. Dihindari dengan membaca param lewat `useParams()`/`useSearchParams()` di client component.
3. **`useSearchParams` butuh Suspense** saat prerender statis → setiap page yang memakainya dibungkus `<Suspense>`.
4. **SSR-safety `theme-provider`** — `localStorage.getItem()` di inisialisasi `useState` akan crash saat prerender. Diberi guard `typeof window === 'undefined'` + script inline anti-FOUC di root layout.
5. **`middleware` → `proxy`** — tidak relevan (tidak ada middleware).
6. **Turbopack default** — alias `@/*` sudah ada di `tsconfig.json`, tidak perlu konfigurasi tambahan.
7. **`<img>` dipertahankan** (tidak diganti `next/image`) agar layout tidak bergeser sedikit pun. ESLint `no-img-element` dimatikan.
8. **Metadata** — `<title>` dan tag OG dari `index.html` dipindah ke objek `metadata` di root layout.

---

## 5. Langkah eksekusi

- [x] **T1 — Dependencies.** Install semua dependency legacy kecuali `react-router-dom` + toolchain Vite: tiptap (10 paket), `radix-ui`, `recharts`, `sonner`, `react-hook-form`, `@hookform/resolvers`, `zod`, `date-fns`, `lucide-react`, `cmdk`, `embla-carousel-react`, `input-otp`, `react-day-picker`, `react-image-crop`, `react-resizable-panels`, `vaul`, `next-themes`, `class-variance-authority`, `clsx`, `tailwind-merge`, `tw-animate-css`, `@tailwindcss/typography`.
- [x] **T2 — Styling.** `src/index.css` → `src/app/globals.css` **verbatim** (hapus baris `@import "tailwindcss"` duplikat dari scaffold). Salin `components.json` dengan `rsc: true`.
- [x] **T3 — Aset.** Salin `public/logo.png` dan `public/BENAH - ALTERNATE LOGO - 1.png`. Hapus SVG bawaan scaffold Next.
- [x] **T4 — Pindahkan file "netral".** `src/lib/utils.ts`, `src/hooks/use-mobile.ts`, `src/data/mockData.ts` (1.083 baris, verbatim), 60 komponen `src/components/ui/**` (+ `'use client'` sesuai kebutuhan).
- [x] **T5 — Modul navigasi.** Tulis `src/lib/navigation.ts` sesuai tabel di bagian 3.
- [x] **T6 — Contexts.** Port `AuthContext`, `UnsavedChangesContext`, `theme-provider` → client component + SSR-safe. Bungkus dalam `src/app/providers.tsx`.
- [x] **T7 — Root layout.** `src/app/layout.tsx`: `<html>` + metadata + providers + `<Toaster />` + script anti-FOUC.
- [x] **T8 — Komponen dashboard.** Port 9 file `src/components/dashboard/**` (`DashboardLayout` menjadi `layout.tsx`; `Outlet` → `children`).
- [x] **T9 — Halaman publik.** Pecah `PublicSite.tsx` menjadi komponen bersama + 13 file route.
- [x] **T10 — Halaman dashboard.** Port 15 file `src/pages/dashboard/**` ke 19 route.
- [x] **T11 — Dead code.** Pindahkan `pages/landing/HomePage.tsx` ke `src/features/landing/` tanpa route.
- [x] **T12 — Verifikasi.** `npx tsc --noEmit` → `npm run lint` → `npm run build` → `npm run dev` + cek visual tiap route lewat browser.

---

## 6. Definisi selesai — status

| Kriteria | Status |
|---|---|
| `npm run build` sukses | ✅ 33 route ter-generate, tanpa error |
| `npx tsc --noEmit` bersih | ✅ nol error |
| `npm run lint` bebas error | ✅ nol error (sisa peringatan = warisan legacy, lihat bagian 8) |
| Semua route bisa diakses | ✅ seluruh route publik `200`, slug tak dikenal `404` |
| Tidak ada `react-router-dom` tersisa | ✅ hilang dari `package.json` dan dari kode |
| Mock data terbawa utuh | ✅ `mockData.ts` 1.083 baris disalin verbatim |

## 7. Hasil verifikasi visual

Kedua aplikasi dijalankan berdampingan (Next `:3000`, Vite legacy `:5199`) lalu
dibandingkan lewat *DOM signature* — daftar berurut `tag|class` seluruh elemen,
di-hash. Karena setiap class Tailwind ikut terhitung, hash yang sama berarti
struktur dan seluruh style identik.

| Halaman | Elemen | Hash Next | Hash Vite | Hasil |
|---|---|---|---|---|
| `/cerita-warga` | 199 | `d6740d` | `d6740d` | ✅ identik |
| `/dashboard/account/user/USR-001?mode=edit` | 155 | `e6d1a22d` | `e6d1a22d` | ✅ identik |

Pengukuran tipografi pada `/artikel/[slug]` juga sama persis: `font-size` 72px,
`letter-spacing` -3.6px, lebar teks `<h1>` **658,375px** di kedua aplikasi.

Alur yang diuji manual di dashboard: login → sidebar → Manage Content → View
(preview artikel, `useParams`) → Kembali (`navigate(-1)`) → Manage Account →
User → View (`useParams` + `useSearchParams`) → Edit Profil (`setSearchParams`).
Semuanya berperilaku sama dengan versi lama.

> Catatan pengukuran: tab browser yang tidak aktif melaporkan geometri layout
> yang salah (lebar 0, `isMobile` keliru). Hash DOM tidak terpengaruh karena
> tidak bergantung layout, tetapi pengukuran rect/`innerText` harus dilakukan
> saat tab berada di depan.

## 8. Cacat legacy yang ditemukan & keputusan

| # | Temuan | Keputusan |
|---|---|---|
| 1 | `<Toaster />` tidak pernah di-mount, padahal 15 file memanggil `toast()` | **Diperbaiki** — di-mount di `src/app/layout.tsx`. Hapus satu baris itu bila ingin paritas ketat. |
| 2 | Route `create-article/edit` & `create-event/edit` dipanggil tapi tidak terdaftar | **Diperbaiki** — dibuat sebagai route asli. |
| 3 | `CreateArticleEditor` / `CreateEventEditor`: early return `if (isViewMode)` berada **di atas** belasan `useState` | **Diperbaiki** — cabang mode view dipindah ke komponen pembungkus. Pelanggaran Rules of Hooks ini bisa membuat React melempar "rendered more hooks than during the previous render" saat query `mode` berubah tanpa unmount. Tampilan tidak berubah. |
| 4 | `pages/landing/HomePage.tsx` (617 baris) dead code, dan tidak lolos typecheck bahkan di proyek lama | Dipindah ke `src/features/landing/HomePage.tsx`, import mati dibersihkan, tipe `Category` ditambahkan. Tidak diberi route. Aman dihapus. |
| 5 | Tema efektif selalu gelap (tidak ada blok `.light` di CSS) | Disalin apa adanya. |

## 9. Masalah khusus Next.js yang muncul saat migrasi

1. **Google Fonts hilang.** Turbopack membuang `@import url('https://fonts.googleapis.com/...')` dari `globals.css` — CSS hasil build tidak punya satu pun `@font-face`, sehingga Playfair Display jatuh ke Georgia dan seluruh heading melebar ~12%. **Solusi:** `next/font/google` di root layout, dipetakan ke `--font-playfair-family` / `--font-inter-family`. Setelah itu lebar teks kembali sama persis dengan legacy.
2. **`setSearchParams` semantik history.** react-router menambah entri history secara default; implementasi awal memakai `replace`. Sudah diselaraskan agar tombol Back tetap mengembalikan query sebelumnya.
3. **`useLocation` dan Suspense.** `useSearchParams()` bawaan Next mewajibkan boundary `<Suspense>` bagi pemakainya. Karena `useLocation()` dipakai Header dan Sidebar yang membungkus semua halaman, `search`/`hash` dibaca lewat `useSyncExternalStore` dari `window.location`, bukan lewat hook Next.
4. **`scroll-behavior: smooth`.** Sejak Next.js 16 framework tidak lagi menonaktifkan properti ini saat pindah route. `data-scroll-behavior="smooth"` ditambahkan di `<html>` supaya scroll saat navigasi tetap instan.

## 10. Utang teknis yang diwarisi

`npm run lint` bersih dari error, tetapi masih memunculkan peringatan pada kode
yang dipindahkan apa adanya. Proyek Vite lama tidak menjalankan ESLint sama
sekali, jadi semua ini **warisan, bukan regresi migrasi**. Aturan terkait
diturunkan ke `warn` khusus untuk `src/components`, `src/context`,
`src/features`, dan `src/hooks` di `eslint.config.mjs`; kode baru
(`src/app`, `src/lib`) tetap dinilai ketat.

| Jumlah | Aturan | Catatan |
|---|---|---|
| 59 | `@next/next/no-img-element` | **Disengaja.** `<img>` dipertahankan agar layout tidak bergeser. Migrasi ke `next/image` bisa dilakukan bertahap. |
| 11 | `react-hooks/set-state-in-effect` | Pola `setState` di effect pada komponen legacy. |
| 8 | `react/no-unescaped-entities` | Tanda kutip di teks JSX. |
| 6 | `@typescript-eslint/no-explicit-any` | Tiptap dan `LogActivities`. |
| 8 | lain-lain | `static-components`, `exhaustive-deps`, `purity`, `immutability`. |

## 11. Catatan repositori

`.gitignore` baris 43 mengabaikan seluruh folder `benah-palembang-legacy-vite`,
jadi proyek lama **tidak ikut ter-commit**. Sumbernya tetap aman di riwayat git
pada commit `b34cadf` (`git show b34cadf:src/pages/public/PublicSite.tsx`).
Hapus baris tersebut bila folder referensi ingin ikut dilacak.

## 12. Log progres

| Tanggal | Task | Catatan |
|---|---|---|
| 2026-08-27 | Audit + rencana | Dokumen ini dibuat |
| 2026-08-27 | T1–T12 selesai | Build, typecheck, dan lint bersih; paritas visual terverifikasi lewat hash DOM |
