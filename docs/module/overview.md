# Overview Module

Modul Overview menyediakan halaman awal dashboard untuk seluruh pengguna yang
telah login. Presentasi dan cakupan datanya dibedakan berdasarkan role agar
setiap pengguna hanya melihat informasi yang relevan dan diizinkan.

Route canonical:

```text
/dashboard
```

## 1. Hak Akses dan Landing Setelah Login

| Role | Akses `/dashboard` | Tampilan |
| :--- | :---: | :--- |
| `USER` | Ya | Ringkasan performa konten milik sendiri. |
| `ADMIN` | Ya | Ringkasan platform dan antrean moderasi. |
| `SUPERADMIN` | Ya | Ringkasan platform dan antrean moderasi. |

- Route dan DAL memakai `requireCurrentUser()` karena seluruh role boleh
  membuka Overview.
- Login, registrasi, dan kunjungan halaman autentikasi dengan session aktif
  mengarahkan semua role ke `/dashboard`.
- Menu `Overview` pada Sidebar tersedia untuk `USER`, `ADMIN`, dan
  `SUPERADMIN`.
- Ketika pengguna membuka halaman dashboard yang tidak sesuai role,
  `requireRole()` mengarahkannya kembali ke `/dashboard`.

## 2. Variasi Tampilan Berdasarkan Role

### 2.1. Creator Overview (`USER`)

Overview `USER` tidak memuat data global platform. Data selalu dibatasi dengan
`actor.id` dari session server:

- `Total Publikasi`: jumlah Article berstatus `PUBLISHED` dengan
  `authorId = actor.id` ditambah Event berstatus `PUBLISHED` dengan
  `ownerId = actor.id`.
- `Total Views`: akumulasi `views` dari Article dan Event published milik actor.
- Grafik Views dan Interaksi: menggunakan data dari konten published milik
  actor. Interaksi terdiri dari Article Like, Event Like, dan Article Comment.
- Tidak menampilkan jumlah pengguna global, total konten platform, antrean
  moderasi, atau log aktivitas.

### 2.2. Management Overview (`ADMIN` dan `SUPERADMIN`)

Overview pengelola menampilkan data agregat platform:

- `Total Users`: seluruh akun aktif dan jumlah akun baru pada periode aktif.
- `Total Artikel`: seluruh Article aktif dan jumlah Article baru pada periode.
- `Total Event`: seluruh Event aktif dan jumlah Event baru pada periode.
- `Total Request`: jumlah Article dan Event non-draft; subteks menunjukkan
  jumlah konten berstatus `PENDING_REVIEW`.
- Grafik performa global dari views serta interaksi Article/Event.
- Lima konten non-draft terbaru beserta tipe, judul, penulis/pemilik, status,
  dan link langsung ke preview moderasi Article atau Event.

Widget log aktivitas tidak ditampilkan pada Overview. Audit trail lengkap tetap
tersedia secara eksklusif untuk `SUPERADMIN` di `/dashboard/logs`.

## 3. Filter Periode

Filter disimpan pada URL melalui parameter `period` dan `month`:

| Filter | Rentang | Bucket Grafik |
| :--- | :--- | :--- |
| `daily` | 24 jam terakhir | 6 interval jam |
| `weekly` | 7 hari terakhir | Senin-Minggu |
| `monthly` | Awal hingga akhir bulan terpilih | Minggu 1-4 |

Delta record baru memakai timestamp database di dalam periode aktif. Database
saat ini hanya menyimpan views sebagai counter agregat tanpa histori timestamp;
karena itu grafik membagi total counter ke bucket proporsional untuk kebutuhan
visualisasi. Angka total pada kartu tetap berasal dari database.

## 4. Data Access Layer

Entry point data adalah
`src/modules/overview/data/get-overview-data.ts`:

```ts
await connection()
const actor = await requireCurrentUser()

if (actor.role === "USER") {
  // Query hanya Article/Event published milik actor.
}

// ADMIN dan SUPERADMIN menerima agregat platform dan antrean moderasi.
```

Seluruh query agregasi dijalankan paralel melalui Prisma. Tidak ada role,
`authorId`, atau `ownerId` dari client yang dipercaya sebagai sumber scope.

## 5. DTO Role-Aware

Data memakai discriminated union agar Client Component wajib menangani audience
secara eksplisit:

```ts
export type OverviewData = ManagementOverviewData | CreatorOverviewData

export interface CreatorOverviewData {
  audience: "CREATOR"
  metrics: {
    publications: OverviewMetricItem
    views: OverviewMetricItem
  }
  chartData: OverviewChartPoint[]
}

export interface ManagementOverviewData {
  audience: "MANAGEMENT"
  metrics: {
    users: OverviewMetricItem
    articles: OverviewMetricItem
    events: OverviewMetricItem
    requests: OverviewMetricItem
  }
  chartData: OverviewChartPoint[]
  recentContents: OverviewRecentContentItem[]
}
```

## 6. Struktur Modul

```text
src/modules/overview/
├── components/
│   ├── overview-chart.tsx
│   ├── overview-metric-cards.tsx
│   ├── overview-page.tsx
│   └── overview-recent-content.tsx
├── data/
│   ├── get-overview-data.ts
│   └── overview.mapper.ts
├── schemas/
│   └── overview-query.schema.ts
└── types/
    └── overview.ts
```

## 7. Validasi Fungsional

- [x] Seluruh role yang memiliki session valid dapat membuka `/dashboard`.
- [x] Seluruh alur login dan registrasi berakhir di `/dashboard`.
- [x] Sidebar menampilkan menu Overview untuk seluruh role.
- [x] `USER` hanya menerima metrik Article/Event published miliknya sendiri.
- [x] `USER` tidak menerima antrean moderasi atau data akun global.
- [x] `ADMIN` dan `SUPERADMIN` menerima empat kartu platform dan tabel moderasi.
- [x] Link tabel moderasi memakai route
  `/dashboard/content/article/[id]` dan `/dashboard/content/event/[id]`.
- [x] Tidak diperlukan perubahan schema, migration, atau seeder.

Revisi role-aware ini diimplementasikan pada poin 20, 30 Agustus 2026.
