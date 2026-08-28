# Master Backend Architecture & Implementation Plan

Dokumen ini merupakan spesifikasi teknis dan acuan arsitektur backend komprehensif untuk platform **Benah Palembang**. Dokumen ini merangkum seluruh fondasi teknologi, arsitektur data, lapisan keamanan berbasis peran (RBAC), siklus hidup data, strategi session dan caching, hingga integrasi pihak ketiga yang diterapkan di seluruh aplikasi.

---

## 1. Ringkasan & Tech Stack Backend

Platform Benah Palembang dibangun menggunakan arsitektur modern full-stack berbasis Next.js App Router yang dioptimalkan untuk performa tinggi, keamanan berlapis (*defense-in-depth*), dan kompatibilitas serverless:

| Komponen Teknologi | Versi / Library | Peran & Tanggung Jawab |
| :--- | :--- | :--- |
| **Framework Utama** | Next.js `16.3.3` (App Router) | Server Components (SSR/RSC), Server Actions untuk mutasi data, dan dynamic route handlers. |
| **Runtime UI** | React `19.2.8` | Server-First Rendering, Client Component interaktif terisolasi, dan React `useTransition`. |
| **Database ORM** | Prisma ORM `6.12.0` | Schema definition, type-safe query generation, migration, dan database transaction management. |
| **Database Engine** | PostgreSQL (Supabase) | Penyimpanan relasional persisten utama (`DATABASE_URL` untuk pooling aplikasi & `DIRECT_URL` untuk migrasi). |
| **Session & Cache Store**| Upstash Redis (`@upstash/redis`) | Opaque server sessions, session versioning revocation, presence tracking, rate limiting, dan deduplikasi 24 jam view counter. |
| **Media Cloud Storage** | Cloudinary (`cloudinary` v2) | Penyimpanan aset media (avatar, banner artikel, sampul agenda) via secure signed uploads langsung dari browser. |
| **Email Transaksional** | Nodemailer (`nodemailer` v9) | Pengiriman email pemulihan kata sandi (lupa password) via SMTP Gmail menggunakan background task `after()`. |
| **Kriptografi & Auth** | `bcryptjs` (Cost 12) + Node `crypto` | Hashing kata sandi, pembuatan token reset acak, dan SHA-256 session token hashing. |
| **Validasi & Sanitasi** | `zod` v4 + `sanitize-html` | Validasi skema input form/action di sisi server dan sanitasi HTML kaya (rich text TipTap). |

---

## 2. Prinsip Arsitektur Data & Keamanan

### 2.1. Pertahanan Berlapis (*Defense-in-Depth*)
Keamanan dan otorisasi tidak pernah dipercayakan pada UI klien. Akses data dan mutasi diproteksi pada 4 lapisan terpisah:
1. **Route & Layout Boundary:** Server Component memeriksa session dan peran pengguna sebelum merender halaman.
2. **Data Access Layer (DAL):** Setiap fungsi query server-only (`get*`) memvalidasi session/role atau mengunci query ke `actor.id`.
3. **Server Actions (Public Endpoints):** Setiap fungsi Server Action memvalidasi session di baris pertama eksekusi sebelum membaca payload.
4. **UX Client Filtering:** Navigasi Sidebar dan tombol aksi disaring untuk kenyamanan tampilan pengguna.

### 2.2. Server-Only Isolation & Safe DTO
- File yang mengakses database atau rahasia server dilindungi dengan `import "server-only"`.
- Prisma Client atau model mentah database **tidak pernah dikirim ke Client Component**.
- Seluruh data ditransformasikan melalui fungsi *mapper* menjadi serializable Data Transfer Object (DTO) yang hanya memuat atribut yang aman.

### 2.3. Integritas Transaksional Atomik (`prisma.$transaction`)
- Operasi mutasi yang melibatkan relasi induk-anak (misal: Artikel + Tag, Event + Tag, Website Content + Sections) dieksekusi dalam satu transaksi database.
- Pencatatan log audit ke tabel `activity_logs` diikatkan ke transaksi bisnis yang sama agar tidak terjadi *ghost log* atau mutasi tanpa jejak audit.

### 2.4. Soft Delete & Unique Suffix Release
Semua tabel bisnis menerapkan pola *Soft Delete* menggunakan kolom `deletedAt DateTime? @db.Timestamptz(6)`.
- Query reguler secara otomatis memfilter `deletedAt = null`.
- Ketika record yang memiliki unique identifier (seperti `slug` pada Artikel/Event atau `email` pada Akun) di-soft-delete, nilai unik dilepaskan secara transaksional menggunakan format canonical:
  ```text
  <original-slug>-deleted-<YYYYMMDDHHmmss>-<id>
  ```
- Nilai asli disimpan pada kolom `originalSlug` atau `originalEmail` untuk kebutuhan pemulihan (*restore*) atau investigasi audit.

---

## 3. Peta Modul Backend & Rute Canonical

Aplikasi diorganisasikan ke dalam modul domain mandiri di bawah direktori `src/modules/`:

```text
src/
├── app/                               # Routing App Router & Page Composition
│   ├── (public)/                      # Halaman Publik (Landing, Artikel, Agenda, Kolaborasi, Auth)
│   └── dashboard/                     # Halaman Dashboard Terotentikasi & Terproteksi RBAC
└── modules/                           # Domain Logic & Business Backend
    ├── account-manage/                # Manajemen Akun Pengguna & Admin (SuperAdmin)
    ├── activity-log/                  # Jejak Audit & Audit Trail Sentral (SuperAdmin)
    ├── article/                       # Domain Artikel (Publik & Author Dashboard)
    ├── auth/                          # Autentikasi, Redis Session, Activity, & Password Reset
    ├── event/                         # Domain Agenda/Acara (Publik & Owner Dashboard)
    ├── manage-content/                # Moderasi Terpadu Artikel & Event (Admin & SuperAdmin)
    ├── overview/                      # Ringkasan Eksekutif & Metrik Platform (Admin & SuperAdmin)
    ├── profile/                       # Profil Pengguna Aktif & Signed Uploads
    └── website-content/               # CMS Konfigurasi Landing Page, Hero, & Header/Footer
```

### Rangkuman Matriks Hak Akses Modul:

| Modul Domain | Route Canonical | `SUPERADMIN` | `ADMIN` | `USER` | Guard Canonical |
| :--- | :--- | :---: | :---: | :---: | :--- |
| **Overview** | `/dashboard` | ✅ Ya | ✅ Ya | ❌ *Redirect* | `requireRole(["ADMIN", "SUPERADMIN"])` |
| **Manage Website** | `/dashboard/website` | ✅ Ya | ✅ Ya | ❌ *Redirect* | `requireRole(["ADMIN", "SUPERADMIN"])` |
| **Manage Content** | `/dashboard/content` | ✅ Ya | ✅ Ya | ❌ *Redirect* | `requireRole(["ADMIN", "SUPERADMIN"])` |
| **Manage Account** | `/dashboard/account/[role]` | ✅ Ya | ❌ *Redirect* | ❌ *Redirect* | `requireRole(["SUPERADMIN"])` |
| **Log Activities** | `/dashboard/logs` | ✅ Ya | ❌ *Redirect* | ❌ *Redirect* | `requireRole(["SUPERADMIN"])` |
| **Create Article** | `/dashboard/create-article` | ✅ Ya | ✅ Ya | ✅ Ya | `requireCurrentUser()` |
| **Create Event** | `/dashboard/create-event` | ✅ Ya | ✅ Ya | ✅ Ya | `requireCurrentUser()` |
| **Profile** | `/dashboard/profile` | ✅ Ya | ✅ Ya | ✅ Ya | `requireCurrentUser()` |

---

## 4. Skema Database PostgreSQL (Prisma Models)

Database terdiri dari 22 model dan 7 enum yang saling terintegrasi:

```mermaid
erDiagram
    User ||--o{ Article : "authoredArticles"
    User ||--o{ Event : "ownedEvents"
    User ||--o{ ArticleComment : "articleComments"
    User ||--o{ ArticleLike : "articleLikes"
    User ||--o{ EventLike : "eventLikes"
    User ||--o{ EventParticipant : "eventParticipants"
    User ||--o{ ActivityLog : "activityLogs"

    WebsiteContent ||--o{ WebsiteHeroSlide : "heroSlides"
    WebsiteContent ||--o{ WebsiteExploreItem : "exploreItems"
    WebsiteContent ||--o{ WebsiteArticleSection : "articleSections"
    WebsiteContent ||--o{ WebsiteTeamMember : "teamMembers"

    WebsiteArticleSection ||--o{ Article : "articles"
    Article ||--o{ ArticleTag : "tags"
    Article ||--o{ ArticleComment : "comments"
    Article ||--o{ ArticleLike : "likes"

    Event ||--o{ EventTag : "tags"
    Event ||--o{ EventLike : "likes"
    Event ||--o{ EventParticipant : "participants"

    WebsiteCollaborationContent ||--o{ WebsiteCollaborationPartnerLogo : "partnerLogos"
    WebsiteCollaborationContent ||--o{ WebsiteCollaborationPartnerContent : "partnerContents"

    WebsiteHeaderFooterContent ||--o{ WebsiteFooterExploreLink : "footerExploreLinks"
    WebsiteHeaderFooterContent ||--o{ WebsiteFooterConnectLink : "footerConnectLinks"
```

### 4.1. Entitas Inti Platform:
1. **`User` (Tabel `users`):** Model identitas canonical untuk seluruh peran (`USER`, `ADMIN`, `SUPERADMIN`), data profil, kontak WhatsApp terpisah, URL sosial media, dan flag proteksi status ban/soft-delete.
2. **`Article` (Tabel `articles`):** Artikel publikasi yang terikat ke `User` (author) dan `WebsiteArticleSection` (kategori), menyimpan slug unik, reading time, status moderasi, dan views counter.
3. **`Event` (Tabel `events`):** Agenda acara yang terikat ke `User` (owner), menyimpan tanggal pelaksanaan, lokasi, URL pendaftaran, kategori, status moderasi, dan views counter.
4. **`ActivityLog` (Tabel `activity_logs`):** Audit trail sentral yang mencatat peristiwa mutasi data, snapshot `beforeState` dan `afterState` JSONB, IP address, serta user agent.
5. **`WebsiteContent` dkk:** Entitas CMS singleton (`home`, `agenda`, `collaboration`, `header-footer`) yang mengatur elemen dinamis situs publik.

---

## 5. Arsitektur Session & Redis State Store

Platform tidak menggunakan JWT stateless untuk session otentikasi. Sebagai gantinya, digunakan **Opaque Server-Side Session** pada Upstash Redis:

```text
Browser Cookie (__Host-session)
    │ (Raw Opaque Token)
    ▼
Next.js Server Session Guard
    │ SHA-256 Hashing
    ▼
Upstash Redis Lookup
    ├── Session Key:  <PREFIX>:auth:session:<sha256-token> (TTL 14 Hari)
    ├── User Version: <PREFIX>:auth:user-version:<userId>
    ├── Presence:     <PREFIX>:auth:presence:<userId> (TTL 10 Menit)
    └── Activity:     <PREFIX>:auth:last-activity:<userId>
```

### Keunggulan Desain Ini:
- **Instant Session Revocation:** Ketika akun di-ban, di-soft-delete, diubah rolenya, atau kata sandi direset, nilai `user-version` di Redis dinaikkan secara atomic. Seluruh sesi aktif pengguna target di semua perangkat langsung tidak valid pada request berikutnya.
- **Fail-Closed Security:** Kegagalan koneksi Redis pada verifikasi otentikasi secara aman memperlakukan request sebagai unauthenticated.
- **Background Activity Touch via `after()`:** Pembaruan metadata aktivitas dan presence dijadwalkan secara non-blocking menggunakan API `after()` Next.js agar tidak memperlambat latensi respon pengguna.

---

## 6. Siklus Hidup & Alur Kerja Konten (*Content Lifecycle*)

Seluruh konten publikasi (Artikel dan Event) tunduk pada siklus moderasi seragam yang independen dari peran pembuatnya:

```mermaid
stateDiagram-v2
    [*] --> DRAFT : Disimpan Author/Owner
    DRAFT --> PENDING_REVIEW : Diajukan (Tombol "Post")
    REJECTED --> PENDING_REVIEW : Diajukan Ulang setelah Perbaikan

    state Moderasi_Admin {
        PENDING_REVIEW --> PUBLISHED : Disetujui Moderator (ADMIN / SUPERADMIN)
        PENDING_REVIEW --> REJECTED : Ditolak Moderator (ADMIN / SUPERADMIN)
        PUBLISHED --> TAKEN_DOWN : Diturunkan Moderator (ADMIN / SUPERADMIN)
        TAKEN_DOWN --> PUBLISHED : Dipulihkan Moderator (ADMIN / SUPERADMIN)
    }

    PUBLISHED --> SOFT_DELETED : Diarsipkan Author/Owner (Tombol "Archive")
    SOFT_DELETED --> [*]
```

---

## 7. Inventaris Variabel Lingkungan (*Environment Variables*)

Konfigurasi lingkungan server dikelola melalui `.env`:

```bash
# Database PostgreSQL (Supabase)
DATABASE_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:6543/postgres?pgbouncer=true"
DIRECT_URL="postgresql://postgres.[ref]:[password]@aws-0-[region].pooler.supabase.com:5432/postgres"

# Upstash Redis REST
UPSTASH_REDIS_REST_URL="https://[endpoint].upstash.io"
UPSTASH_REDIS_REST_TOKEN="[token]"
REDIS_PREFIX="benah"

# Cloudinary Signed Upload
CLOUDINARY_CLOUD_NAME="[cloud_name]"
CLOUDINARY_API_KEY="[api_key]"
CLOUDINARY_API_SECRET="[api_secret]"

# Email Transaksional (SMTP Gmail & Nodemailer)
APP_URL="http://localhost:3000"
SMTP_HOST="smtp.gmail.com"
SMTP_PORT=465
SMTP_SECURE=true
SMTP_USER="[email]@gmail.com"
SMTP_APP_PASSWORD="[app_password]"
SMTP_FROM_NAME="Benah Palembang"
SMTP_FROM_EMAIL="[email]@gmail.com"

# Seeding Control
ALLOW_PRODUCTION_SEED="false"
```

---

## 8. Standar Validasi & Perintah Operasional

Untuk menjamin stabilitas dan integritas kode sebelum rilis produksi:

```bash
# 1. Validasi integritas skema Prisma
npx prisma validate

# 2. Sinkronisasi skema ke database lokal / staging
npx prisma migrate dev

# 3. Jalankan seeding bootstrap database
npm run seed

# 4. Validasi pemeriksaan tipe TypeScript
npx tsc --noEmit

# 5. Validasi standar linter ESLint
npm run lint

# 6. Validasi build produksi Next.js App Router
npm run build
```