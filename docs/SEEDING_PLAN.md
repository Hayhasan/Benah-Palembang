# Master Seeding Plan & Strategy

Dokumen ini menjadi spesifikasi teknis dan panduan operasional proses **Database Seeding** pada aplikasi Benah Palembang. Dokumen ini mengatur prinsip idempotensi, urutan dependensi data, spesifikasi data awal per modul, hingga perintah eksekusi dan prosedur verifikasi.

Aturan umum seeding merujuk pada [`docs/rules/seeding.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/rules/seeding.md).

---

## 1. Prinsip & Kebijakan Seeding

1. **Idempotensi Penuh (*Create-if-Missing*):**
   - Seluruh seeder wajib aman dijalankan berulang kali tanpa membuat data duplikat dan tanpa menimpa data yang telah dimodifikasi oleh administrator.
2. **Kebijakan Non-Destruktif (*Non-Destructive Policy*):**
   - Seeder bootstrap **dilarang menggunakan perintah `deleteMany`** atau mereset tabel bisnis secara destruktif.
3. **Perlindungan Lingkungan Produksi (*Production Guard*):**
   - Seeder memverifikasi flag `ALLOW_PRODUCTION_SEED="true"` jika dijalankan pada `NODE_ENV=production`. Secara default, eksekusi pada lingkungan produksi akan ditolak untuk mencegah kesalahan operasional.
4. **Integritas Relasional Transaksional:**
   - Setiap entitas induk bersama koleksi anaknya (misal: Website Content + Slides, Artikel + Tags, Event + Tags) disimpan dalam satu transaksi database (`prisma.$transaction`).
5. **Keamanan Kredensial:**
   - Seluruh kata sandi akun di-hash menggunakan helper canonical `bcryptjs` (cost 12). Kata sandi plaintext tidak pernah disimpan atau dicetak ke terminal log.

---

## 2. Peta Rantai Dependensi (*Dependency Chain*)

Seeder memiliki ketergantungan relasional yang ketat antar-modul dan harus dieksekusi dengan urutan berikut:

```text
┌──────────────────────────────────────────────────────────┐
│  1. Account Manage Seeder (account-manage.seeder.ts)     │
│  • Membuat akun SUPERADMIN, ADMIN, dan USER              │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│  2. Website Content Seeder (website-content.seeder.ts)   │
│  • Membuat root home, 5 article sections, agenda,        │
│    kolaborasi, dan header-footer                         │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│  3. Event Seeder (event.seeder.ts)                       │
│  • Membuat 56 agenda acara terikat ke random active USER │
└────────────────────────────┬─────────────────────────────┘
                             │
                             ▼
┌──────────────────────────────────────────────────────────┐
│  4. Article Seeder (article.seeder.ts)                   │
│  • Membuat 100 artikel terikat ke 5 section & active USER│
└──────────────────────────────────────────────────────────┘
```

---

## 3. Spesifikasi Seeder per Modul

### 3.1. Account Manage (`prisma/seeders/account-manage.seeder.ts`)
- **Tabel Sasaran:** `users`
- **Tanggung Jawab:** Menyediakan akun pengembangan utama dan akun mock untuk seluruh level hak akses.
- **Akun Kunci Pengembangan:**
  | Peran (*Role*) | Email Canonical | Kata Sandi Development |
  | :--- | :--- | :--- |
  | `SUPERADMIN` | `super@example.com` | `12345678` |
  | `ADMIN` | `admin@example.com` | `12345678` |
  | `USER` | `user@example.com` | `12345678` |
- **Karakteristik Data:**
  - Menghasilkan UUID canonical untuk setiap akun.
  - Memisahkan nomor telepon ke dalam `whatsappCountryCode` (`62`) dan `whatsappNumber` (e.g. `8123456789`).
  - Menyediakan profil sosial media (Instagram, X/Twitter, LinkedIn).
  - Pengecekan berbasis `email` lowercase (create-if-missing).

---

### 3.2. Website Content (`prisma/seeders/website-content.seeder.ts`)
- **Tabel Sasaran:** `website_contents`, `website_hero_slides`, `website_explore_items`, `website_article_sections`, `website_team_members`, `website_agenda_contents`, `website_collaboration_contents`, `website_collaboration_partner_logos`, `website_collaboration_partner_contents`, `website_header_footer_contents`, `website_footer_explore_links`, `website_footer_connect_links`.
- **4 Aggregate Root Singleton:**
  1. **`home`:** Menampung hero slides carousel, explore items, 5 bagian artikel tetap, dan profil anggota tim.
  2. **`agenda`:** Menampung konfigurasi hero background, judul, dan deskripsi halaman publik agenda.
  3. **`collaboration`:** Menampung hero, informasi kontak kerjasama, partner logos, dan partner content.
  4. **`header-footer`:** Menampung logo situs, deskripsi footer, alamat kontak, copyright, dan tautan navigasi.
- **5 Bagian Artikel Tetap (*Fixed Article Sections*):**
  - `cerita-warga` (Cerita Warga)
  - `gaya-hidup` (Gaya Hidup)
  - `ruang-kota` (Ruang Kota)
  - `industri-kreatif` (Industri Kreatif)
  - `kebudayaan` (Kebudayaan)

---

### 3.3. Event / Agenda (`prisma/seeders/event.seeder.ts`)
- **Tabel Sasaran:** `events`, `event_tags`
- **Total Dataset:** 56 agenda acara.
- **Distribusi Status Awal:**
  - 51 `PUBLISHED`
  - 4 `DRAFT`
  - 1 `TAKEN_DOWN`
- **Relasi Kepemilikan:**
  - Untuk setiap event baru, memilih satu akun pengguna secara acak dari akun aktif berstatus `role = USER` (`deletedAt = null` dan `isBanned = false`).
  - Slug canonical unik dijaga untuk idempotensi.

---

### 3.4. Article (`prisma/seeders/article.seeder.ts`)
- **Tabel Sasaran:** `articles`, `article_tags`
- **Total Dataset:** 100 artikel cerita (50 dataset publik + 50 dataset dashboard).
- **Distribusi Status Awal:**
  - 95 `PUBLISHED`
  - 4 `DRAFT`
  - 1 `TAKEN_DOWN`
- **Distribusi 5 Kategori:**
  - `cerita-warga`: 12 artikel
  - `gaya-hidup`: 24 artikel
  - `ruang-kota`: 18 artikel
  - `industri-kreatif`: 16 artikel
  - `kebudayaan`: 30 artikel
- **Relasi Kepemilikan & Kategori:**
  - Menghubungkan `websiteArticleSectionId` ke row aktif `WebsiteArticleSection`.
  - Mengikat `authorId` ke pengguna acak dengan `role = USER`.

---

## 4. Kebijakan Tanpa Seeder (*No Seeding Policy*)

Beberapa modul sengaja **tidak memiliki seeder**:

1. **`activity_logs` (Modul Log Aktivitas):**
   - Log audit merekam peristiwa operasional nyata. Tabel dimulai dalam kondisi kosong dan bertambah organik seiring aktivitas otentikasi, moderasi, atau mutasi data pengguna.
2. **`manage-content` (Modul Moderasi Konten):**
   - Modul moderasi tidak memiliki tabel bisnis sendiri; query membaca langsung model `Article` dan `Event`.
3. **`overview` (Modul Overview Dashboard):**
   - Menghitung agregasi dinamis langsung dari tabel bisnis yang ada.

---

## 5. Daftar Perintah CLI Seeding

Perintah seeding dijalankan melalui skrip npm yang terkonfigurasi di `package.json`:

```bash
# 1. Menjalankan seluruh seeder aplikasi (Urutan: Account -> Website -> Event -> Article)
npm run seed

# 2. Menjalankan seeder per modul domain tertentu
npm run seed:account-manage
npm run seed:website-content
npm run seed:event
npm run seed:article
```

---

## 6. Prosedur Validasi & Smoke Testing Seeding

Untuk memastikan integritas seeding pada lingkungan baru:

```bash
# 1. Pastikan skema database tervalidasi
npx prisma validate

# 2. Jalankan seeder master
npm run seed

# 3. Jalankan ulang seeder untuk memastikan sifat IDEMPOTEN (seluruh entitas harus dilewati/skipped)
npm run seed

# 4. Verifikasi jumlah data database melalui Prisma CLI / Node Script:
# - User >= 33 record
# - WebsiteContent = 1 record (home)
# - WebsiteAgendaContent = 1 record (agenda)
# - WebsiteCollaborationContent = 1 record (collaboration)
# - WebsiteHeaderFooterContent = 1 record (header-footer)
# - WebsiteArticleSection = 5 record
# - Event = 56 record
# - Article = 100 record
```

---

## 7. Status & Riwayat Eksekusi

| Modul Seeder | File Seeder | Status | Keterangan |
| :--- | :--- | :---: | :--- |
| **Account Manage** | `prisma/seeders/account-manage.seeder.ts` | ✅ Aktif | SuperAdmin, Admin, dan User terdaftar dengan bcrypt password. |
| **Website Content** | `prisma/seeders/website-content.seeder.ts` | ✅ Aktif | 4 singleton aggregate + 5 fixed article sections. |
| **Event** | `prisma/seeders/event.seeder.ts` | ✅ Aktif | 56 acara terhubung ke relasi owner User. |
| **Article** | `prisma/seeders/article.seeder.ts` | ✅ Aktif | 100 artikel terdistribusi ke 5 kategori dan author User. |
