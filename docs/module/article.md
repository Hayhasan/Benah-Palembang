# Article Module

Module Article mengelola cerita atau artikel yang dibuat oleh account dashboard,
ditampilkan pada landing page, halaman kategori root, dan halaman detail
artikel. Setiap Article mempunyai author melalui relasi ke `User` dan kategori
melalui relasi ke `WebsiteArticleSection`.

Article dikerjakan setelah implementasi awal Event selesai dengan urutan:

```text
schema dan migration -> seeding -> halaman publik -> dashboard pemilik
```

## 1. Scope awal

- Menyimpan Article pada PostgreSQL melalui Prisma.
- Menghubungkan setiap Article ke satu `User` sebagai author atau owner.
- Menghubungkan Article ke row aktif `website_article_sections`.
- Menyediakan seeder dari mock Article yang sudah ada.
- Mengganti data mock Article pada landing page.
- Mengganti data mock pada `/<categorySlug>`.
- Mengganti data mock pada `/artikel/[slug]`.
- Menampilkan daftar Article milik current user pada
  `/dashboard/create-article`.
- Membuat, mengubah, preview, mengajukan publikasi, dan soft delete Article
  milik sendiri.
- Menyediakan status untuk integrasi Manage Content.

Sistem interaksi belum termasuk scope awal. Nilai berikut tetap berupa mock atau
hardcoded pada UI dan belum disimpan ke database:

- Views.
- Likes.
- Comments.

Article tidak mempunyai statistik participants. Implementasi awal tidak membuat
model ArticleLike, ArticleView, ArticleComment, atau Participant.

## 2. Batasan permission sementara

Role-based permission dikerjakan oleh module Permission pada tahap lain. Module
Article tidak membuat permission system atau hardcoded role matrix baru.

Aturan sementara:

- Dashboard memakai authenticated boundary project yang sudah ada.
- Author ID selalu berasal dari current authenticated user.
- Client tidak boleh mengirim `authorId` sebagai sumber identitas mutation.
- Query dan mutation owner tetap memverifikasi ownership di server.
- Akses administratif dan role guard ditambahkan oleh module Permission nanti.

Penundaan permission hanya berlaku pada keputusan role. Ownership Article tetap
wajib diterapkan sejak implementasi awal.

## 3. Relasi dengan Website Article Section

Category Article tidak dibuat sebagai enum atau table category kedua. Sumber
category canonical adalah model `WebsiteArticleSection` milik module
`website-content`.

Lima logical row yang tersedia saat ini:

| Section key | Category slug | Label awal |
| --- | --- | --- |
| `featured` | `cerita-warga` | Cerita Warga |
| `gaya-hidup` | `gaya-hidup` | Gaya Hidup |
| `ruang-kota` | `ruang-kota` | Ruang Kota |
| `industri-kreatif` | `industri-kreatif` | Industri Kreatif |
| `kebudayaan` | `kebudayaan` | Kebudayaan |

Keputusan relasi:

- Article menyimpan `websiteArticleSectionId` sebagai foreign key `Int`.
- Editor mengambil pilihan category dari row section aktif.
- Public category route mencari section melalui `articleCategorySlug`, lalu
  mengambil Article yang berelasi ke section tersebut.
- Perubahan label atau slug presentasi pada Website Content tidak membuat table
  category Article baru.
- Article seeder membutuhkan aggregate `website-content` sudah tersedia.

## 4. Status Article

Article menggunakan enum `ContentStatus` yang sama dengan Event:

```text
DRAFT
PENDING_REVIEW
PUBLISHED
REJECTED
TAKEN_DOWN
ARCHIVED
```

Mapping UI:

| Database | Label UI | Keterangan |
| --- | --- | --- |
| `DRAFT` | Draf | Disimpan author |
| `PENDING_REVIEW` | Request | Diajukan untuk diperiksa |
| `PUBLISHED` | Post atau Posted | Tampil pada halaman publik |
| `REJECTED` | Rejected | Pengajuan ditolak |
| `TAKEN_DOWN` | Takedown | Artikel published diturunkan |
| `ARCHIVED` | Arsip | Diturunkan sendiri oleh author dari halaman publik |

Transisi awal:

```text
DRAFT -> PENDING_REVIEW
REJECTED -> PENDING_REVIEW
PENDING_REVIEW -> PUBLISHED
PENDING_REVIEW -> REJECTED
PUBLISHED -> TAKEN_DOWN
TAKEN_DOWN -> PUBLISHED
PUBLISHED -> ARCHIVED
ARCHIVED -> PUBLISHED
```

`ARCHIVED` hanya dapat dicapai dari `PUBLISHED`. `TAKEN_DOWN` sengaja tidak
boleh diarsipkan supaya author tidak dapat memakai archive lalu publikasi ulang
sebagai jalan pintas keluar dari keputusan takedown.

Tombol publish pada halaman author berarti submit review, bukan langsung
menampilkan Article pada halaman publik.

Review berlaku pada publikasi pertama, bukan pada setiap penyuntingan. Article
`PUBLISHED` boleh disunting author dan perubahannya langsung tayang tanpa
kembali ke `PENDING_REVIEW`, sama seperti publikasi ulang dari `ARCHIVED`.
Kontrol atas perubahan tersebut berada pada activity log — setiap penyimpanan
mencatat field mana yang berubah — dan pada aksi Takedown milik admin.

Setiap keputusan moderasi admin (Approve, Reject, Takedown, Restore) atas
artikel mengirim email notifikasi ke pemilik konten. Detail template dan
aturan pengirimannya berada pada `docs/module/manage-content.md`.

POV author mengikuti aturan status owner pada Event:

- Article `DRAFT` mempunyai tombol **Post** untuk berpindah ke
  `PENDING_REVIEW`.
- Article `PUBLISHED` mempunyai tombol **Archive** untuk berpindah ke
  `ARCHIVED`.
- Article `ARCHIVED` mempunyai tombol **Publikasikan** untuk kembali ke
  `PUBLISHED` tanpa review ulang, karena Article tersebut sudah pernah
  disetujui admin.
- Article `REJECTED` mempunyai tombol **Post** untuk diperbaiki lalu diajukan
  ulang ke `PENDING_REVIEW`. Alasan penolakan dari admin (`moderationNote`)
  ditampilkan pada daftar dan editor author supaya perbaikannya terarah.
- Article `DRAFT`, `REJECTED`, dan `ARCHIVED` mempunyai tombol **Hapus** yang
  menjalankan soft delete.
- Article `PENDING_REVIEW` dan `TAKEN_DOWN` tidak mempunyai tombol perubahan
  status maupun tombol Hapus karena sedang berada pada flow moderasi. Alasan
  takedown tetap ditampilkan kepada author.
- Tombol **Takedown** dan **Restore** hanya menjadi bagian flow moderasi Manage
  Content dan tidak tersedia pada halaman author.

## 5. Database

Schema yang sudah diimplementasikan:

```prisma
model Article {
  id                      Int                   @id @default(autoincrement())
  authorId                String                @db.Uuid
  websiteArticleSectionId Int
  slug                    String                @unique @db.VarChar(180)
  originalSlug            String?               @db.VarChar(180)
  title                   String                @db.VarChar(255)
  excerpt                 String                @db.Text
  content                 String                @db.Text
  coverImageUrl           String                @db.Text
  readingTime             Int
  isFeatured              Boolean               @default(false)
  status                  ContentStatus         @default(DRAFT)
  moderationNote          String?               @db.Text
  submittedAt             DateTime?             @db.Timestamptz(6)
  publishedAt             DateTime?             @db.Timestamptz(6)
  createdAt               DateTime              @default(now()) @db.Timestamptz(6)
  updatedAt               DateTime              @updatedAt @db.Timestamptz(6)
  deletedAt               DateTime?             @db.Timestamptz(6)
  author                  User                  @relation("ArticleAuthor", fields: [authorId], references: [id])
  websiteArticleSection   WebsiteArticleSection @relation(fields: [websiteArticleSectionId], references: [id])
  tags                    ArticleTag[]
  comments                ArticleComment[]
  landingPins             WebsiteArticleSectionPin[]

  @@index([authorId, deletedAt, updatedAt])
  @@index([websiteArticleSectionId, status, deletedAt, publishedAt])
  @@map("articles")
}

model ArticleTag {
  id        Int       @id @default(autoincrement())
  articleId Int
  label     String    @db.VarChar(80)
  position  Int
  createdAt DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt DateTime  @updatedAt @db.Timestamptz(6)
  deletedAt DateTime? @db.Timestamptz(6)
  article   Article   @relation(fields: [articleId], references: [id])

  @@index([articleId, deletedAt, position])
  @@map("article_tags")
}

model ArticleComment {
  id        Int       @id @default(autoincrement())
  articleId Int
  userId    String    @db.Uuid
  content   String    @db.Text
  createdAt DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt DateTime  @updatedAt @db.Timestamptz(6)
  deletedAt DateTime? @db.Timestamptz(6)
  article   Article   @relation(fields: [articleId], references: [id])
  user      User      @relation("ArticleCommentUser", fields: [userId], references: [id])

  @@index([articleId, deletedAt, createdAt])
  @@index([userId, deletedAt])
  @@map("article_comments")
}
```

Model `User` dan `WebsiteArticleSection` mendapatkan relation collection yang
sesuai untuk author, kategori, dan komentar Article.

### Keputusan schema

- ID Article memakai `Int` auto-increment.
- Foreign key author memakai UUID.
- Foreign key category memakai ID `WebsiteArticleSection`.
- Slug dibuat dan dijaga unique di server.
- Slug tidak otomatis berubah ketika title diedit agar URL published stabil.
- `readingTime` adalah metadata Article dan tetap disimpan di database.
- `isFeatured` adalah metadata editorial, bukan statistik interaksi.
- Rich content disanitasi pada server sebelum disimpan atau dirender.
- Views, likes, dan comments tidak menjadi column pada implementasi awal.
- Participants tidak menjadi bagian domain Article.
- Actor dan waktu moderation tidak disimpan ulang pada Article. Informasi
  reviewer dan `reviewedAt` nantinya berasal dari central activity log.

## 6. Archive dan soft delete

Archive dan delete adalah dua aksi berbeda. Archive **tidak** menyentuh
`deletedAt`.

### Archive

Hanya tersedia untuk Article `PUBLISHED` dan hanya mengubah `status` menjadi
`ARCHIVED`. Slug canonical, `originalSlug`, ArticleTag, views, likes, dan
comments sengaja dipertahankan apa adanya supaya publikasi ulang mengembalikan
Article ke URL publik yang sama tanpa kehilangan tag maupun statistik.

Article `ARCHIVED` tetap tampil pada daftar author, hilang dari halaman publik
termasuk pin landing section, dan tidak masuk antrian moderasi Manage Content.

### Publikasi ulang

Article `ARCHIVED` dapat dikembalikan ke `PUBLISHED` oleh author tanpa melewati
`PENDING_REVIEW`. `publishedAt` yang lama dipertahankan bila sudah terisi.

### Soft delete

Soft delete dijalankan oleh tombol **Hapus** dan hanya tersedia untuk Article
`DRAFT`, `REJECTED`, atau `ARCHIVED`.

Dalam satu transaction:

- Simpan slug aktif ke `originalSlug` jika belum tersedia.
- Ganti slug menggunakan suffix soft-delete canonical.
- Isi `deletedAt` Article.
- Isi `deletedAt` seluruh ArticleTag aktif.

Takedown hanya mengubah status menjadi `TAKEN_DOWN`. Record tidak dihapus dan
aksi tersebut tidak tersedia pada POV author.

## 7. Sumber mock canonical

Mock Article saat ini tersebar di:

```text
src/data/mockData.ts
src/features/dashboard/CreateArticle.tsx
src/features/dashboard/CreateArticleEditor.tsx
src/features/dashboard/ArticlePreview.tsx
src/features/dashboard/ManageContent.tsx
```

Normalisasi:

- Mock publik pada `src/data/mockData.ts` menjadi sumber utama karena sudah
  mempunyai slug, content, category, tags, reading time, dan tanggal publish.
- Mock dashboard yang mewakili record unik dinormalisasi ke bentuk Article
  lengkap.
- Record yang sama pada beberapa halaman tidak dibuat berulang.
- Category label dipetakan ke `articleCategorySlug`, kemudian ke ID
  `WebsiteArticleSection` aktif.
- Mock Manage Content tidak menjadi dataset Article terpisah; Manage Content
  membaca Article yang sudah ada.
- Nilai views, likes, dan comments tetap berada pada helper mock UI dan tidak
  ikut disimpan oleh seeder.

Target file canonical:

```text
src/modules/article/constants/default-articles.ts
```

Constant tersebut tidak boleh bergantung pada React, Next.js API, atau Prisma
Client agar aman digunakan oleh public fallback sementara dan seeder.

## 8. Seeder Article

File dan command:

```text
prisma/seeders/article.seeder.ts
npm run seed:article
```

Dependency:

- User role `USER` sudah tersedia.
- Aggregate website content `home` sudah tersedia.
- Lima `WebsiteArticleSection` aktif sudah tersedia.

Alur seeder:

1. Query User dengan `role = USER` dan `deletedAt = null`. User banned sebaiknya
   tidak dipilih untuk mock Article baru.
2. Query section aktif dan buat mapping berdasarkan `articleCategorySlug`.
3. Gagal dengan error jelas jika User atau category section yang dibutuhkan
   tidak tersedia.
4. Untuk setiap Article baru, pilih satu User secara random sebagai `authorId`.
5. Resolve `websiteArticleSectionId` dari category slug mock.
6. Buat Article dan tags dalam transaction.
7. Lewati Article yang slug canonical-nya sudah tersedia.
8. Jangan menimpa content, author, status, atau category Article yang sudah ada.
9. Isi maksimal tiga pin awal hanya untuk section yang belum memiliki pin.

Random author hanya berlaku ketika record dibuat pertama kali. Re-run seeder
tidak mengubah author Article existing.

### Galeri Article pada dashboard account/profile

Module Article menyediakan DTO dan komponen `ArticleGallery` reusable untuk
`/dashboard/profile` serta detail Manage Account. Query mengambil maksimal enam
Article aktif terbaru berdasarkan author, menghitung total Article aktif, dan
menampilkan status, update terakhir, views, serta likes riil. Owner diarahkan ke
preview author, sedangkan SuperAdmin diarahkan ke preview moderasi agar masing-
masing route tetap memakai guard yang tepat.

Aggregate runner menjalankan Article setelah `account-manage`,
`website-content`, dan `event`.

## 9. Integrasi halaman publik

### Landing page `/`

Module `website-content` menyimpan content section dan ordered pin maksimal
tiga Article. Module Article menyediakan record lengkap yang ditampilkan pada
masing-masing section.

Route melakukan komposisi data server:

- `getLandingPage()` dari module Website Content.
- Query pin ordered beserta Article published yang dikelompokkan berdasarkan
  section.

Komponen Landing Page tidak lagi mengimpor `articles` dari mock data.

### Category route `/<categorySlug>`

- `params` di-await sesuai Next.js 16.
- Website Content memvalidasi category slug dan menyediakan hero.
- Article query mengambil record dengan section terkait, status `PUBLISHED`, dan
  `deletedAt = null`.
- Search dan tombol show-all tetap Client Component dengan initial DTO dari
  server.
- Slug category tidak valid menghasilkan `notFound()`.

### Detail `/artikel/[slug]`

- Query berdasarkan slug, status `PUBLISHED`, dan `deletedAt = null`.
- Record tidak ditemukan menghasilkan `notFound()` dan tidak fallback ke artikel
  pertama.
- Author name, avatar, dan bio berasal dari relasi User.
- Views dan likes tetap menggunakan helper/data presentasional mock.
- Komentar artikel disimpan dan dibaca secara real-time dari database PostgreSQL
  melalui model `ArticleComment`.
- Komentar dapat dibaca publik oleh authenticated maupun unauthenticated user.
- Komentar hanya dapat dikirim oleh authenticated user; unauthenticated user
  diberikan CTA ramah untuk login terlebih dahulu.
- Komentar milik sendiri dapat dihapus (soft delete) dan tidak dapat diedit.
- Penanda waktu komentar menggunakan format relatif bahasa Indonesia, dan terdapat
  badge khusus `Penulis` jika komentar berasal dari author artikel tersebut.

## 10. Dashboard author

### List Article

Route `/dashboard/create-article` membaca initial data melalui Server Component.

- Filter `authorId = currentUser.id` dan `deletedAt = null`.
- Search berdasarkan title dan excerpt.
- Pagination sebanyak 25 item per halaman.
- Search dan page disimpan pada URL.
- Seluruh status milik author dapat tampil.
- Statistik views, likes, dan comments menggunakan helper mock UI.
- Participants tidak ditampilkan untuk Article.

### Editor Article

Field editor:

- Title.
- Excerpt.
- Rich content.
- Cover image URL.
- Website article section/category.
- Tags.

Server Action yang direncanakan:

```text
createArticleDraftAction
updateArticleAction
submitArticleForReviewAction
archiveArticleAction
republishArticleAction
softDeleteArticleAction
```

Semua action:

- Membaca actor dari authenticated server session.
- Memastikan Article target adalah milik actor.
- Memvalidasi input dengan Zod.
- Memvalidasi bahwa section ID merupakan row aktif yang diizinkan.
- Membuat slug server-side saat create.
- Menyimpan Article dan tags dalam transaction.
- Merevalidasi landing, category, detail, dan dashboard yang relevan.

## 11. Struktur module

```text
src/modules/article/
  actions/
    archive-article.ts
    create-article-draft.ts
    republish-article.ts
    soft-delete-article.ts
    submit-article-for-review.ts
    update-article.ts
  components/
    article-editor.tsx
    article-list.tsx
    article-preview.tsx
    public-article-card.tsx
    public-article-detail.tsx
  constants/
    default-articles.ts
    public-article-stats.ts
  data/
    article.mapper.ts
    get-article-category-options.ts
    get-article-editor.ts
    get-landing-articles.ts
    get-owned-article.ts
    get-owned-articles.ts
    get-public-article.ts
    get-public-articles-by-category.ts
  schemas/
    article.schema.ts
  types/
    article.ts
    public-article.ts
```

Query category option dapat menggunakan query publik yang diekspos module
`website-content` agar dependency antar-module tetap jelas.

## 12. Implementation plan Article

- [x] Finalisasi dokumen Article setelah Event foundation tersedia.
- [x] Tambahkan model, relation User, relation WebsiteArticleSection, dan
  migration.
- [x] Buat default Article canonical dan seeder idempotent.
- [x] Jalankan seeder dua kali untuk memastikan create lalu skip.
- [x] Integrasikan Article database ke landing page.
- [x] Integrasikan Article database ke `/<categorySlug>`.
- [x] Implementasikan detail `/artikel/[slug]` dengan `notFound()`.
- [x] Implementasikan list Article milik current user.
- [x] Implementasikan editor dan Server Action ownership.
- [x] Pindahkan komponen Article yang sudah terhubung backend ke module Article.
- [x] Hapus dependency Article publik terhadap mock lama yang sudah digantikan.
- [x] Jalankan validasi frontend, build, dan smoke check setelah integrasi
  route.

### Status schema dan seeding

- Migration `20260828141609_add_article_module` sudah dibuat dan diterapkan.
- Model `Article` berelasi ke `User` melalui relation `ArticleAuthor` dan ke
  `WebsiteArticleSection` melalui `websiteArticleSectionId`.
- Actor dan waktu review tidak disimpan pada Article karena nantinya berasal
  dari central activity log.
- Canonical data berisi 100 Article: 50 mock public dan 50 mock dashboard owner.
- Distribusi awal terdiri dari 95 `PUBLISHED`, 4 `DRAFT`, dan 1 `TAKEN_DOWN`.
- Seluruh lima category section terisi: 12 `cerita-warga`, 24 `gaya-hidup`, 18
  `ruang-kota`, 16 `industri-kreatif`, dan 30 `kebudayaan`.
- Seeder memilih author secara random hanya dari User aktif, tidak banned, dan
  mempunyai role `USER`.
- Eksekusi pertama membuat 100 Article; eksekusi kedua melewati seluruh data
  tanpa duplicate atau overwrite.
- Query verifikasi menemukan 0 Article dengan author yang tidak memenuhi aturan
  active `USER`.

### Status integrasi halaman publik

- Landing page mengambil maksimal tiga Article `PUBLISHED` yang dipin dari
  `website_article_section_pins`, mengelompokkannya berdasarkan `sectionKey`,
  dan mempertahankan urutan pin. Article yang tidak dipin tidak ikut tampil.
- Category route memvalidasi hero/category melalui Website Content dan mengirim
  DTO Article database ke Client Component untuk search serta show-all.
- Detail route mencari slug exact, hanya menerima Article aktif yang sudah
  published, dan memanggil `notFound()` ketika record tidak tersedia.
- Related stories berasal dari `WebsiteArticleSection` yang sama dengan Article
  detail, dipilih random pada setiap request, dan dibatasi dua item.
- Nama, username, avatar, dan bio penulis berasal dari relasi `User`.
- Identitas penulis pada hero serta box `Ditulis Oleh` dapat diklik dan mengarah
  ke `/penulis/[username]`.
- Views membaca column `Article.views`, sedangkan likes dan comments membaca
  relasi database `ArticleLike` dan `ArticleComment`.
- Komponen card serta detail publik berada di `src/modules/article/components`;
  public Article tidak lagi mengimpor dataset `src/data/mockData.ts`.
- Route kategori memakai staged hero dan stagger masonry cards. Detail Article
  memakai staged hero, reveal body/author/engagement/comments, fade pada action
  rail, serta stagger untuk dua More Stories.

### Status dashboard author

- `/dashboard/create-article` membaca maksimal 25 Article aktif milik current user
  per halaman, dengan search title dan excerpt melalui URL.
- `/dashboard/create-article/new` membuat Article baru sebagai `DRAFT` atau langsung
  mengajukannya sebagai `PENDING_REVIEW` melalui tombol Post. Pilihan kategori
  diambil dari row aktif `WebsiteArticleSection`.
- `/dashboard/create-article/edit?id=<id>` hanya membuka Article aktif yang dimiliki
  current user dan menghasilkan `notFound()` untuk target invalid atau bukan
  milik actor.
- `/dashboard/create-article/preview/[id]` menyediakan preview author untuk seluruh
  status tanpa mengubah visibility route publik.
- Update Article dan replacement ArticleTag dijalankan dalam transaction. Rich HTML
  disanitasi pada server sebelum disimpan, dan `readingTime` dihitung otomatis
  berdasarkan kata konten.
- Article `DRAFT` menampilkan aksi Post, Article `PUBLISHED` menampilkan aksi
  Archive, Article `ARCHIVED` menampilkan aksi Publikasikan, dan Article
  `DRAFT`, `REJECTED`, maupun `ARCHIVED` menampilkan aksi Hapus.
- Archive hanya memindahkan status ke `ARCHIVED` tanpa menyentuh `deletedAt`,
  slug, maupun ArticleTag sehingga publikasi ulang mengembalikan URL yang sama.
- Hapus melepaskan slug canonical (`<originalSlug>-deleted-<YYYYMMDDHHmmss>-<id>`),
  menyimpan `originalSlug`, serta melakukan soft delete pada Article dan seluruh
  ArticleTag aktif dalam satu transaction.
- Tidak ada tombol Takedown atau Restore pada POV author.
- Upload banner Article menggunakan signed upload Cloudinary ke folder
  `benah-palembang/articles`.
- Gambar yang ditambahkan melalui rich-text editor di-upload ke Cloudinary
  terlebih dahulu dengan scope `article`.
- Statistik views, likes, dan comments tetap memakai mock deterministic tanpa
  interaction table dan tanpa participants.

## 14. Sistem Like Artikel

Article like diimplementasikan menggunakan table relasional `ArticleLike`:

- **Model Prisma:** `ArticleLike` dengan relasi ke `Article` dan `User`, serta constraint `@@unique([articleId, userId])`.
- **Server Action:** `toggleArticleLikeAction({ articleId })` yang memvalidasi session user dan melakukan toggle insert/delete row like.
- **Halaman Publik (`/artikel/[slug]`):**
  - Hanya dapat di-like oleh user authenticated.
  - User guest/unauthenticated akan menerima notifikasi toast ramah untuk login ke `/login?redirect=/artikel/[slug]`.
  - State optimis interaktif: icon hati merah menyala saat aktif, dan jumlah like ter-update instan.
- **Dashboard Synchronization:**
  - `/dashboard/content/article` menampilkan jumlah like riil database pada kolom statistik artikel.
  - `/dashboard/content/article/[id]` menampilkan jumlah like riil pada metadata hero artikel.
  - `/dashboard/create-article` menampilkan jumlah like riil pada tabel artikel author.
  - `/dashboard/create-article/preview/[id]` menampilkan jumlah like riil pada metadata preview author.

## 15. Sistem View Artikel

Sistem view artikel mencatat pembacaan riil secara atomic dengan proteksi deduplikasi Redis:

- **Database Column:** `views Int @default(0)` pada model `Article`.
- **Deduplikasi Redis (24 Jam / 86400 Detik):**
  - Menggunakan command Redis atomic `SET key "1" EX 86400 NX`.
  - Key format authenticated user: `<REDIS_PREFIX>:view:article:<articleId>:user:<userId>`.
  - Key format guest / unauthenticated: `<REDIS_PREFIX>:view:article:<articleId>:device:<deviceId>`.
  - `deviceId` digenerate otomatis melalui Next.js Middleware dalam bentuk cookie HTTP `benah_device_id` (durasi 1 tahun).
- **Trigger Penambahan View:**
  - Hanya bertambah pada halaman publik detail `/artikel/[slug]` (`src/app/(public)/artikel/[slug]/page.tsx`).
  - Tidak bertambah pada halaman preview author, dashboard, atau manage content.
- **Sinkronisasi UI:**
  - Halaman detail publik `/artikel/[slug]`, dashboard author `/dashboard/create-article`, author preview, dan manage content membaca angka `views` riil dari database.

## 16. Revisi Detail Artikel dan Related Stories

Halaman `/artikel/[slug]` mengikuti presentasi revisi dengan tetap mempertahankan
interaksi database existing:

- Kartu engagement menyediakan aksi like, salin tautan, dan bagikan dalam satu
  panel responsif di atas komentar.
- Form komentar authenticated memakai input ringkas dengan avatar dan tombol
  kirim. Guest melihat CTA login yang mempertahankan redirect ke artikel dan
  anchor komentar.
- Empat komentar terbaru tampil pertama kali. Komentar berikutnya dibuka melalui
  tombol show more dengan gradient berbasis token `background`.
- Pembuatan dan soft delete komentar memanggil `router.refresh()` setelah Server
  Action sukses agar data komentar terbaru langsung masuk ke Client Component.
- More Stories memakai grid dua kolom dan semantic color tokens supaya konsisten
  pada light mode serta dark mode.
- Hero detail dimulai dari top viewport dan menyediakan padding untuk navbar.
  Dengan demikian navbar transparan tidak berada di atas ruang background terang
  ketika halaman memakai light mode.

Pemilihan More Stories dilakukan di server:

1. `connection()` menghentikan prerender sebelum pembacaan user, query artikel,
   dan pemanggilan `Math.random()`.
2. Query mengambil seluruh artikel published aktif dari section yang sama,
   dengan artikel detail dikecualikan berdasarkan ID.
3. Kandidat diacak menggunakan Fisher-Yates dan diambil maksimal dua item.

Dengan alur tersebut, setiap HTTP request melakukan pemilihan ulang. Pasangan
yang sama tetap mungkin muncul pada dua request berbeda karena sifat random,
tetapi hasil tidak berasal dari urutan statis atau cache prerender.

## 17. Integrasi Halaman Penulis

DTO detail Article memuat `author.username`. Kartu author pada hero dan box
`Ditulis Oleh` menggunakan `next/link` menuju `/penulis/[username]`. Route
tersebut hanya menampilkan Article berstatus `PUBLISHED`, mempunyai
`publishedAt`, belum dihapus, dan masih berada pada Website Content aktif.
