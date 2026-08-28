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
- **Kolaborasi (`/kolaborasi`):** Informasi kemitraan media, partner logos, dan featured partner contents.
- **Autentikasi (`/login`, `/register`, `/lupa-password`):** Pintu masuk akun, pendaftaran mandiri pengguna baru, dan alur pemulihan kata sandi.

### 2.2. Dashboard Terkelola (`src/app/dashboard`)
- **Overview (`/dashboard`):** Ringkasan metrik eksekutif, grafik performa kunjungan & interaksi, serta pratinjau permohonan moderasi dan log audit (`ADMIN` & `SUPERADMIN`).
- **Manage Website (`/dashboard/website`):** CMS pengelola konfigurasi landing page, hero kategori, agenda, kolaborasi, dan global header/footer (`ADMIN` & `SUPERADMIN`).
- **Manage Content (`/dashboard/content`):** Pusat moderasi artikel dan acara (Approve, Reject, Takedown, Restore) (`ADMIN` & `SUPERADMIN`).
- **Manage Account (`/dashboard/account/[role]`):** Manajemen akun pengguna dan administrator, perubahan peran, ban/unban, dan soft-delete (`SUPERADMIN`).
- **Log Activities (`/dashboard/logs`):** Audit trail sentral yang mencatat rekaman jejak mutasi data dan aktivitas sistem (`SUPERADMIN`).
- **Create Article (`/dashboard/create-article`):** Editor TipTap kaya fitur untuk membuat, mengedit, dan mengajukan artikel (`USER`, `ADMIN`, `SUPERADMIN`).
- **Create Event (`/dashboard/create-event`):** Formulir pembuatan dan pengajuan agenda acara (`USER`, `ADMIN`, `SUPERADMIN`).
- **Profile (`/dashboard/profile`):** Pengelolaan profil personal, avatar/banner Cloudinary, kontak WhatsApp, dan tautan sosial media (`USER`, `ADMIN`, `SUPERADMIN`).

---

## 3. Peta Dokumentasi Proyek

Seluruh dokumentasi teknis dan arsitektural diorganisasikan pada direktori `docs/`:

| Dokumen | Deskripsi & Cakupan |
| :--- | :--- |
| [`docs/BACKEND_PLAN.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/BACKEND_PLAN.md) | Master arsitektur backend, Prisma models, Redis session store, dan RBAC matrix. |
| [`docs/SEEDING_PLAN.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/SEEDING_PLAN.md) | Strategi seeding database, urutan dependensi, dan panduan verifikasi. |
| [`docs/MIGRATION_PLAN.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/MIGRATION_PLAN.md) | Dokumentasi historis migrasi dari Vite SPA ke Next.js 16 App Router. |
| [`docs/rules/`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/rules) | Pedoman umum coding, struktur proyek, aturan otentikasi, dan aturan seeding. |
| [`docs/module/`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/module) | Spesifikasi teknis per modul domain (Auth, Article, Event, Manage Content, Website, Account, Activity Log, Profile, Overview, Permission). |
