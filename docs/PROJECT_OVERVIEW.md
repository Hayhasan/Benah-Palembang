# Project Overview: Benah Palembang

**Benah Palembang** adalah platform jurnalisme warga, kurasi cerita kota, dan agenda kegiatan komunitas digital untuk Kota Palembang. Platform ini memfasilitasi warga dan kreator konten untuk berbagi cerita, mengeksplorasi ruang kota, mempromosikan industri kreatif dan kebudayaan, serta mengelola acara/kegiatan komunitas secara terstruktur.

---

## 1. Arsitektur & Teknologi

Platform dikembangkan dengan tumpukan teknologi modern full-stack:

- **Frontend & Routing:** Next.js `16.3.3` (App Router) & React `19.2.8`.
- **Styling & UI Kit:** Tailwind CSS v4 & shadcn/ui components.
- **Database & ORM:** PostgreSQL (Supabase) & Prisma ORM v6.
- **Session & Caching:** Upstash Redis REST Client (Opaque server-side session, presence, rate limiting, view deduplication).
- **Asset Storage:** Cloudinary signed uploads untuk gambar, avatar, dan banner.
- **Komunikasi Email:** Nodemailer via SMTP Gmail untuk reset kata sandi.

---

## 2. Struktur Ruang Lingkup Platform

Platform terbagi menjadi dua ranah utama:

### 2.1. Situs Publik (`src/app/(public)`)
- **Landing Page (`/`):** Menampilkan hero carousel, tentang kami, kategori eksplorasi, 5 bagian artikel tematik, tim redaksi, dan CTA.
- **Kategori Artikel (`/<categorySlug>`):** Menampilkan artikel tematik untuk 5 kategori:
  1. Cerita Warga (`/cerita-warga`)
  2. Gaya Hidup (`/gaya-hidup`)
  3. Ruang Kota (`/ruang-kota`)
  4. Industri Kreatif (`/industri-kreatif`)
  5. Kebudayaan (`/kebudayaan`)
- **Detail Artikel (`/artikel/[slug]`):** Halaman baca artikel lengkap dengan views counter 24 jam, interaksi like, dan kolom komentar real-time.
- **Agenda Komunitas (`/agenda` & `/agenda/[id]`):** Kalender kegiatan dan detail acara dengan pendaftaran CTA eksternal serta pelacakan partisipan.
- **Kolaborasi (`/kolaborasi`):** Informasi kemitraan, partner logos, dan masonry partner content dengan preview thumbnail/rasio yang diturunkan otomatis dari URL sosial media.

### 2.2. Autentikasi & Inisialisasi (`src/app/(auth)`)
- **Login (`/login`):** Pintu masuk akun terdaftar.
- **Register (`/register`):** Pendaftaran mandiri akun pengguna (`USER`).
- **Lupa Password (`/lupa-password` & `/lupa-password/[token]`):** Alur pemulihan kata sandi via email reset token.
- **First Time Setup (`/first-time-setup`):** Inisialisasi akun SuperAdmin pertama saat database masih kosong.

### 2.3. Dashboard Terkelola (`src/app/dashboard`)
- **Overview (`/dashboard`):** Landing dashboard seluruh role. `USER` melihat
  performa publikasi miliknya, sedangkan `ADMIN` dan `SUPERADMIN` melihat metrik
  platform, grafik performa, serta pratinjau permohonan moderasi.
- **Manage Website (`/dashboard/website`):** CMS pengelola konfigurasi landing page, pin maksimal tiga Article per section homepage, hero kategori, agenda, kolaborasi, dan global header/footer (`ADMIN` & `SUPERADMIN`).
- **Manage Content (`/dashboard/content/article`, `/dashboard/content/event`):** Pusat moderasi artikel dan acara yang dipisahkan per tipe (Approve, Reject, Takedown, Restore) (`ADMIN` & `SUPERADMIN`).
- **Manage Account (`/dashboard/account/[role]`):** Manajemen akun pengguna dan administrator, perubahan peran, ban/unban, dan soft-delete (`SUPERADMIN`).
- **Log Activities (`/dashboard/logs`):** Audit trail sentral yang mencatat rekaman jejak mutasi data dan aktivitas sistem (`SUPERADMIN`).
- **Create Article (`/dashboard/create-article`):** Editor TipTap kaya fitur untuk membuat, mengedit, dan mengajukan artikel (`USER`, `ADMIN`, `SUPERADMIN`).
- **Create Event (`/dashboard/create-event`):** Formulir pembuatan dan pengajuan agenda acara (`USER`, `ADMIN`, `SUPERADMIN`).
- **Profile (`/dashboard/profile`):** Pengelolaan profil personal, avatar/banner Cloudinary, kontak WhatsApp, dan tautan sosial media (`USER`, `ADMIN`, `SUPERADMIN`).
- **Profil Penulis (`/penulis/[username]`):** Profil publik berbasis username
  unique beserta statistik, galeri Article published, dan Event published.

---

## 3. Peta Dokumentasi Proyek

Seluruh dokumentasi teknis dan arsitektural diorganisasikan pada direktori `docs/`:

| Dokumen | Deskripsi & Cakupan |
| :--- | :--- |
| [`docs/BACKEND_PLAN.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/BACKEND_PLAN.md) | Master arsitektur backend, Prisma models, Redis session store, dan RBAC matrix. |
| [`docs/SEEDING_PLAN.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/SEEDING_PLAN.md) | Strategi seeding database, urutan dependensi, dan panduan verifikasi. |
| [`docs/MIGRATION_PLAN.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/MIGRATION_PLAN.md) | Dokumentasi historis migrasi dari Vite SPA ke Next.js 16 App Router. |
| [`docs/rules/`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/rules) | Pedoman umum coding, struktur proyek, aturan otentikasi, dan aturan seeding. |
| [`docs/module/`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/module) | Spesifikasi teknis per modul domain (Auth, Article, Event, Manage Content, Website, Account, Activity Log, Profile, Overview, Permission, Health Check). |
