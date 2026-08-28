# Overview Module

Dokumen ini menjadi spesifikasi teknis dan rencana implementasi untuk modul **Dashboard Overview (Ringkasan Eksekutif & Metrik Platform)** pada aplikasi Benah Palembang. Modul ini bertanggung jawab menghitung, mengagregasi, dan menyajikan data metrik utama, grafik performa kunjungan dan interaksi, serta pratinjau status konten dan log aktivitas terkini ke dalam satu halaman ringkasan terpadu.

Route canonical:
```text
/dashboard
```

Aturan otorisasi modul merujuk pada [`docs/module/permission.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/module/permission.md) dan aturan arsitektur data merujuk pada [`docs/rules/project-structure.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/rules/project-structure.md).

---

## 1. Scope & Tujuan Modul

1. **Dashboard Eksekutif Terpusat:** Menampilkan ringkasan menyeluruh mengenai pertumbuhan pengguna, produksi konten (Artikel & Event), pembacaan/kunjungan (*page views*), interaksi pembaca (likes, komentar, klik pendaftaran CTA), serta aktivitas operasional sistem.
2. **Filter Periode Waktu Fleksibel:** Menyediakan kontrol penyaringan data berdasarkan rentang waktu:
   - **Harian (*Daily*):** 24 jam terakhir dengan visualisasi grafik per interval jam (`00:00`, `04:00`, `08:00`, `12:00`, `16:00`, `20:00`).
   - **Mingguan (*Weekly*):** 7 hari terakhir dengan visualisasi grafik per hari (`Senin` s/d `Minggu`).
   - **Bulanan (*Monthly*):** Pilihan bulan dinamis dari tahun berjalan (misal: `Januari 2026` s/d `Desember 2026`) dengan visualisasi grafik per pekan (`Minggu 1` s/d `Minggu 4`).
3. **6 Kartu Ringkasan Metrik (*Executive Metric Cards*):**
   - **Total Users:** Total pengguna terdaftar aktif beserta angka pertumbuhan pada periode aktif.
   - **Total Artikel:** Total artikel aktif terdaftar beserta delta penambahan pada periode aktif.
   - **Total Event:** Total agenda/acara aktif terdaftar beserta delta penambahan pada periode aktif.
   - **Page Views:** Total akumulasi views konten (artikel & event) beserta pertumbuhan relatif.
   - **Klik CTA & Interaksi:** Total partisipan pendaftar acara (CTA *"Daftar Sekarang"*) ditambah total interaksi likes dan komentar.
   - **Aktivitas:** Total baris log audit sistem yang tercatat pada periode aktif.
4. **Grafik Dual-Metric Interaktif (*Performance & Engagement Visualizer*):**
   - Memvisualisasikan perbandingan *Page Views* (bar merah Palembang) dan *Interaksi* (bar arang/emas) sesuai interval waktu.
   - Dilengkapi *hover tooltip* interaktif yang menampilkan rincian angka eksak pada setiap titik waktu.
5. **Widget Status Konten Terkini (*Manage Content Preview*):**
   - Menampilkan 3–5 artikel dan event terbaru yang berstatus non-draft (`PENDING_REVIEW` / Request, `PUBLISHED` / Posted, `TAKEN_DOWN` / Takedown, `REJECTED` / Rejected).
   - Menyediakan tautan cepat ke modul moderasi penuh di `/dashboard/content`.
6. **Widget Log Aktivitas Terkini (*Recent Activity Logs Preview*):**
   - Menampilkan 4 log audit terbaru dari tabel `activity_logs` beserta informasi actor, modul, aksi, dan penanda waktu relatif bahasa Indonesia.
   - Menyediakan tautan cepat ke audit trail lengkap di `/dashboard/logs`.
7. **Kebijakan Tanpa Tabel Tambahan (*No Additional Business Table Policy*):**
   - Modul Overview tidak membuat tabel database baru; seluruh metrik dihitung langsung secara efisien dari tabel canonical yang sudah ada (`users`, `articles`, `events`, `event_participants`, `article_likes`, `event_likes`, `article_comments`, `activity_logs`).

---

## 2. Hak Akses & Matriks Otorisasi (RBAC)

Modul Overview dilindungi secara ketat di lapisan server (*Server Component & DAL Guard*):

| Peran (*Role*) | Izin Akses Halaman (`/dashboard`) | Perilaku Otorisasi |
| :--- | :---: | :--- |
| **`SUPERADMIN`** | ✅ Diizinkan | Mengakses seluruh metrik, grafik, daftar moderasi, dan log aktivitas terkini. |
| **`ADMIN`** | ✅ Diizinkan | Mengakses metrik, grafik, daftar moderasi, dan log aktivitas terkini. |
| **`USER`** | ❌ Ditolak (*Redirect*) | Otomatis dialihkan oleh `requireRole(["ADMIN", "SUPERADMIN"])` ke `/dashboard/create-article`. |

### Penerapan Guard Canonical:
1. **Server Component Route (`src/app/dashboard/page.tsx`):**
   ```tsx
   await requireRole(["ADMIN", "SUPERADMIN"])
   ```
2. **Data Access Layer (`src/modules/overview/data/get-overview-data.ts`):**
   ```ts
   await connection()
   await requireRole(["ADMIN", "SUPERADMIN"])
   ```

---

## 3. Integrasi Sumber Data & Model Prisma

Metrik overview dikalkulasi melalui agregasi paralel pada model database PostgreSQL:

```text
                                  ┌──────────────────────────────┐
                                  │   Prisma Database Queries    │
                                  └──────────────┬───────────────┘
                     ┌───────────────────────────┼───────────────────────────┐
                     ▼                           ▼                           ▼
        ┌────────────────────────┐  ┌────────────────────────┐  ┌────────────────────────┐
        │       model User       │  │ model Article & Event  │  │ model EventParticipant │
        │ ────────────────────── │  │ ────────────────────── │  │ model ArticleLike/Event│
        │ • Total Akun Aktif     │  │ • Total Artikel/Event  │  │ model ArticleComment   │
        │ • Akun Baru di Periode │  │ • Status Non-Draft     │  │ ────────────────────── │
        │                        │  │ • Sum Views Pembaca    │  │ • Klik CTA Pendaftaran │
        │                        │  │                        │  │ • Total Interaksi      │
        └────────────────────────┘  └────────────────────────┘  └────────────────────────┘
                                                 │
                                                 ▼
                                    ┌────────────────────────┐
                                    │    model ActivityLog   │
                                    │ ────────────────────── │
                                    │ • Total Log Periode    │
                                    │ • 4 Log Terkini        │
                                    └────────────────────────┘
```

### Pemetaan Query Agregasi:

| Metrik | Model Prisma | Kondisi Filter & Agregasi |
| :--- | :--- | :--- |
| **Users** | `prisma.user` | `where: { deletedAt: null }`<br>Delta periode: `where: { deletedAt: null, createdAt: { gte: periodStart, lte: periodEnd } }` |
| **Articles** | `prisma.article` | `where: { deletedAt: null }`<br>Delta periode: `where: { deletedAt: null, createdAt: { gte: periodStart, lte: periodEnd } }` |
| **Events** | `prisma.event` | `where: { deletedAt: null }`<br>Delta periode: `where: { deletedAt: null, createdAt: { gte: periodStart, lte: periodEnd } }` |
| **Page Views** | `prisma.article`, `prisma.event` | `prisma.article.aggregate({ _sum: { views: true }, where: { deletedAt: null } })`<br>`+ prisma.event.aggregate({ _sum: { views: true }, where: { deletedAt: null } })` |
| **Klik CTA & Interaksi** | `prisma.eventParticipant`, `prisma.articleLike`, `prisma.eventLike`, `prisma.articleComment` | `EventParticipant.count({ where: { deletedAt: null } })`<br>`+ ArticleLike.count()`<br>`+ EventLike.count()`<br>`+ ArticleComment.count({ where: { deletedAt: null } })` |
| **Logs** | `prisma.activityLog` | `prisma.activityLog.count({ where: { createdAt: { gte: periodStart, lte: periodEnd } } })` |
| **Recent Moderation** | `prisma.article`, `prisma.event` | Top 5 gabungan record non-draft (`where: { deletedAt: null, status: { not: "DRAFT" } }`) diurutkan `submittedAt desc` / `updatedAt desc`. |
| **Recent Logs** | `prisma.activityLog` | Top 4 record terbaru (`orderBy: { createdAt: "desc" }`). |

---

## 4. Logika Filter Waktu & Pembagian Bucket Grafik

Untuk menghasilkan data grafik yang akurat dan responsif, modul membagi rentang waktu (*time range*) menjadi titik-titik bucket interval (*time series buckets*):

### 4.1. Harian (`daily`)
- **Rentang Waktu:** 24 jam terakhir dari waktu saat ini.
- **Interval Titik Grafik (6 Titik):** `00:00`, `04:00`, `08:00`, `12:00`, `16:00`, `20:00`.
- **Label Periode:** `Harian (24 Jam Terakhir)`.

### 4.2. Mingguan (`weekly`)
- **Rentang Waktu:** 7 hari terakhir dari waktu saat ini.
- **Interval Titik Grafik (7 Titik):** `Senin`, `Selasa`, `Rabu`, `Kamis`, `Jumat`, `Sabtu`, `Minggu` (sesuai urutan hari 7 hari terakhir).
- **Label Periode:** `Mingguan (7 Hari Terakhir)`.

### 4.3. Bulanan (`monthly`)
- **Rentang Waktu:** Awal bulan s/d akhir bulan dari bulan yang dipilih (default: bulan saat ini, misal `Agustus 2026`).
- **Interval Titik Grafik (4 Titik):** `Minggu 1` (hari 1–7), `Minggu 2` (hari 8–14), `Minggu 3` (hari 15–21), `Minggu 4` (hari 22–akhir bulan).
- **Label Periode:** `Bulan <Nama Bulan> <Tahun>` (misal: `Bulan Agustus 2026`).

---

## 5. Format Data Transfer Object (DTO)

Untuk menjamin keamanan dan serialisasi data antara Server Component dan Client Component, modul mendefinisikan DTO terstruktur:

```ts
export type OverviewFilterType = "daily" | "weekly" | "monthly"

export interface OverviewMetricItem {
  total: string
  growth: string
}

export interface OverviewChartPoint {
  name: string
  views: number
  interactions: number
}

export interface OverviewRecentContentItem {
  id: number
  type: "Article" | "Event"
  title: string
  status: "Request" | "Posted" | "Rejected" | "Takedown"
  timeAgo: string
}

export interface OverviewRecentLogItem {
  id: number
  user: string
  action: string
  module: string
  timeAgo: string
}

export interface OverviewData {
  periodType: OverviewFilterType
  periodLabel: string
  selectedMonth: string
  availableMonths: string[]
  metrics: {
    users: OverviewMetricItem
    articles: OverviewMetricItem
    events: OverviewMetricItem
    views: OverviewMetricItem
    clicks: OverviewMetricItem
    logs: OverviewMetricItem
  }
  chartData: OverviewChartPoint[]
  recentContents: OverviewRecentContentItem[]
  recentLogs: OverviewRecentLogItem[]
}
```

---

## 6. Komposisi Halaman & Struktur Direktori

### 6.1. Route Entry Point (`src/app/dashboard/page.tsx`)
Route ini beroperasi sebagai Server Component tipis:
1. Memvalidasi hak akses `await requireRole(["ADMIN", "SUPERADMIN"])`.
2. Membaca `searchParams` URL (`period`, `month`).
3. Memanggil data fetcher server-only `getOverviewData({ period, month })`.
4. Merender Client Component `OverviewPage` dengan prop `initialData`.

### 6.2. Struktur Modul (`src/modules/overview/`)
```text
src/modules/overview/
├── components/
│   ├── overview-chart.tsx              # Komponen grafik bar dual-metric & tooltip
│   ├── overview-metric-cards.tsx       # 6 Kartu ringkasan metrik eksekutif
│   ├── overview-page.tsx               # Client Component pembungkus utama & filter bar
│   ├── overview-recent-content.tsx     # Tabel ringkas konten moderasi terkini
│   └── overview-recent-logs.tsx        # Widget daftar log aktivitas terkini
├── data/
│   ├── get-overview-data.ts            # Server-only DAL query data agregasi Prisma
│   └── overview.mapper.ts              # Mapper DTO, format ribuan/K, dan kalkulator growth
├── schemas/
│   └── overview-query.schema.ts        # Zod validation parameter filter URL
└── types/
    └── overview.ts                     # TypeScript DTO & type definitions
```

---

## 7. Migration dari Komponen Legacy

Komponen lama pada `src/features/dashboard/Overview.tsx` yang masih menggunakan data tiruan (*mock static data*) akan digantikan sepenuhnya oleh `src/modules/overview/`.

Langkah transisi:
1. Buat seluruh struktur baru pada `src/modules/overview/`.
2. Hubungkan `src/app/dashboard/page.tsx` ke `OverviewPage` modul baru dan DAL `getOverviewData`.
3. Hapus file legacy `src/features/dashboard/Overview.tsx` untuk menjaga kebersihan codebase.

---

## 8. Implementation Plan & Checklist Validasi

- [ ] **1. DTO & Query Schema:**
  - Buat `src/modules/overview/types/overview.ts`.
  - Buat `src/modules/overview/schemas/overview-query.schema.ts`.
- [ ] **2. Data Access Layer (DAL) & Mapper:**
  - Buat `src/modules/overview/data/overview.mapper.ts` dengan helper format angka (`formatNumber`, `formatCompactNumber`, format relative time).
  - Buat `src/modules/overview/data/get-overview-data.ts` dengan agregasi paralel Prisma (Users, Articles, Events, Views, Interactions, Logs, Recent Moderation, Recent Logs).
- [ ] **3. UI Components Modul Overview:**
  - Buat `src/modules/overview/components/overview-metric-cards.tsx`.
  - Buat `src/modules/overview/components/overview-chart.tsx`.
  - Buat `src/modules/overview/components/overview-recent-content.tsx`.
  - Buat `src/modules/overview/components/overview-recent-logs.tsx`.
  - Buat `src/modules/overview/components/overview-page.tsx`.
- [ ] **4. Route Integration & Cleanup:**
  - Perbarui `src/app/dashboard/page.tsx` untuk membaca data real dari `getOverviewData`.
  - Hapus file legacy `src/features/dashboard/Overview.tsx`.
- [ ] **5. Validasi & Pengujian:**
  - `npx prisma validate`
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm run build`
