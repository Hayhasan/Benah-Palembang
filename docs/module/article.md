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
```

Mapping UI:

| Database | Label UI | Keterangan |
| --- | --- | --- |
| `DRAFT` | Draf | Disimpan author |
| `PENDING_REVIEW` | Request | Diajukan untuk diperiksa |
| `PUBLISHED` | Post atau Posted | Tampil pada halaman publik |
| `REJECTED` | Rejected | Pengajuan ditolak |
| `TAKEN_DOWN` | Takedown | Artikel published diturunkan |

Transisi awal:

```text
DRAFT -> PENDING_REVIEW
REJECTED -> PENDING_REVIEW
PENDING_REVIEW -> PUBLISHED
PENDING_REVIEW -> REJECTED
PUBLISHED -> TAKEN_DOWN
TAKEN_DOWN -> PUBLISHED
```

Tombol publish pada halaman author berarti submit review, bukan langsung
menampilkan Article pada halaman publik.

POV author mengikuti aturan status owner pada Event:

- Article `DRAFT` mempunyai tombol **Post** untuk berpindah ke
  `PENDING_REVIEW`.
- Article `PUBLISHED` mempunyai tombol **Archive** untuk menjalankan soft
  delete.
- Article `PENDING_REVIEW`, `REJECTED`, dan `TAKEN_DOWN` tidak mempunyai tombol
  perubahan status.
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
```

Model `User` dan `WebsiteArticleSection` mendapatkan relation collection yang
sesuai untuk author dan kategori Article.

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

## 6. Soft delete

Archive dari dashboard author selalu menggunakan soft delete dan hanya tersedia
untuk Article `PUBLISHED`.

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

Random author hanya berlaku ketika record dibuat pertama kali. Re-run seeder
tidak mengubah author Article existing.

Aggregate runner menjalankan Article setelah `account-manage`,
`website-content`, dan `event`.

## 9. Integrasi halaman publik

### Landing page `/`

Module `website-content` tetap memiliki konfigurasi section seperti theme,
layout, max items, title, dan background. Module Article menyediakan record yang
ditampilkan pada masing-masing section.

Route melakukan komposisi data server:

- `getLandingPage()` dari module Website Content.
- Query Article published yang dikelompokkan berdasarkan section.

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
- Related Article berasal dari section yang sama.
- Views, likes, dan comments tetap mock/hardcoded pada UI.
- Form dan daftar komentar tetap bersifat presentasional sampai module interaksi
  dikerjakan.

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
    create-article-draft.ts
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

- Landing page mengambil Article `PUBLISHED` dari database, mengelompokkannya
  berdasarkan `sectionKey`, lalu menerapkan `maxItems` dari konfigurasi Website
  Content.
- Category route memvalidasi hero/category melalui Website Content dan mengirim
  DTO Article database ke Client Component untuk search serta show-all.
- Detail route mencari slug exact, hanya menerima Article aktif yang sudah
  published, dan memanggil `notFound()` ketika record tidak tersedia.
- Related stories berasal dari `WebsiteArticleSection` yang sama dengan Article
  detail.
- Nama, avatar, dan bio penulis berasal dari relasi `User`.
- Views, likes, dan comments tetap menggunakan helper/data presentasional dan
  belum mempunyai table database.
- Komponen card serta detail publik berada di `src/modules/article/components`;
  public Article tidak lagi mengimpor dataset `src/data/mockData.ts`.

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
  Archive, dan status lain tidak menampilkan aksi status.
- Archive melepaskan slug canonical (`<originalSlug>-deleted-<YYYYMMDDHHmmss>-<id>`),
  menyimpan `originalSlug`, serta melakukan soft delete pada Article dan seluruh
  ArticleTag aktif dalam satu transaction.
- Tidak ada tombol Takedown atau Restore pada POV author.
- Upload banner Article menggunakan signed upload Cloudinary ke folder
  `benah-palembang/articles`.
- Gambar yang ditambahkan melalui rich-text editor di-upload ke Cloudinary
  terlebih dahulu dengan scope `article`.
- Statistik views, likes, dan comments tetap memakai mock deterministic tanpa
  interaction table dan tanpa participants.

## 13. Kriteria selesai

- Article mempunyai schema dan migration valid.
- Article berelasi ke User dan WebsiteArticleSection.
- `seed:article` memakai random User role `USER` dan aman dijalankan ulang.
- Landing, category, dan detail Article membaca database.
- Public query hanya menampilkan Article published.
- Dashboard hanya mengelola Article milik current user.
- Delete memakai soft delete dan melepaskan slug unique.
- Views, likes, dan comments tetap hardcoded di UI.
- Article tidak mempunyai participants.
- Tidak ada permission system atau hardcoded role access baru pada tahap ini.
