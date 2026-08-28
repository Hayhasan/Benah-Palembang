# Project Structure Rules

Dokumen ini menjadi aturan struktur project saat frontend mulai terhubung ke
backend. Struktur dibuat berdasarkan domain/module agar penambahan backend tidak
menumpuk di route Next.js atau komponen UI.

## 1. Prinsip utama

- `src/app` hanya bertanggung jawab atas routing, layout, metadata, loading,
  error boundary, dan komposisi halaman.
- Business logic ditempatkan berdasarkan module di `src/modules`.
- Akses database, validasi input, dan otorisasi tidak ditulis langsung di
  komponen presentasional.
- Kode yang memakai Prisma, Cloudinary secret, session server, atau environment
  variable rahasia harus berada pada server boundary.
- Proteksi page, data function, Server Action, Route Handler, client session,
  role guard, dan session revocation mengikuti `docs/rules/auth-rules.md`.
- Data yang dikirim dari Server Component ke Client Component harus berupa DTO
  serializable, bukan object Prisma mentah.
- Semua business record menggunakan soft delete dan tidak dihapus permanen dari
  flow aplikasi normal.
- `src/components/ui` hanya berisi komponen generik yang tidak mengetahui
  business rule suatu module.
- Struktur lama di `src/features` dipindahkan secara bertahap. Tidak perlu
  melakukan refactor seluruh frontend sekaligus.

## 2. Struktur tingkat atas

```text
prisma/
  schema.prisma
  migrations/
  seed.ts
  seeders/

src/
  app/
  components/
    ui/
    dashboard/
  modules/
  lib/
    db/
    cloudinary/
  hooks/
  context/
```

Tanggung jawab masing-masing folder:

| Folder | Tanggung jawab |
| --- | --- |
| `prisma/` | Schema Prisma, migration, runner seed, dan seeder per module |
| `src/app/` | Route App Router dan boundary bawaan Next.js |
| `src/modules/` | Logic, data access, schema validasi, type, dan UI per domain |
| `src/lib/db/` | Inisialisasi Prisma Client dan utility database lintas module |
| `src/lib/cloudinary/` | Konfigurasi dan helper Cloudinary yang bersifat server-only |
| `src/components/ui/` | Komponen UI generik dan reusable |
| `src/features/` | Kode frontend lama selama masa transisi ke struktur module |

## 3. Struktur sebuah module

Folder hanya dibuat jika benar-benar dibutuhkan. Struktur standar yang dapat
digunakan adalah:

```text
src/modules/<module-name>/
  actions/
  components/
  data/
  schemas/
  types/
  constants/
```

| Bagian | Isi |
| --- | --- |
| `actions/` | Server Action untuk mutation dari aplikasi Next.js |
| `components/` | Komponen public dan dashboard milik module |
| `data/` | Query, repository, mapper Prisma ke DTO, dan cache data |
| `schemas/` | Schema Zod untuk input form, action, dan payload |
| `types/` | DTO dan type domain yang dapat dibagikan secara aman |
| `constants/` | Default/fallback content dan konstanta domain |

Jangan membuat barrel file `index.ts` jika hanya menyembunyikan asal import atau
menimbulkan circular dependency. Import langsung dari file pemiliknya lebih
diutamakan.

## 4. Module website content

Landing page menjadi bagian pertama dari module `website-content`, bukan module
terpisah bernama `landing-page`. Module ini nantinya juga dapat memiliki content
untuk halaman article, agenda, collaboration, header, dan footer.

Struktur awal yang disarankan:

```text
src/modules/website-content/
  actions/
    update-agenda-page.ts
    update-article-category-pages.ts
    update-collaboration-page.ts
    update-header-footer-content.ts
    update-landing-page.ts
  components/
    agenda-page.tsx
    article-category-page.tsx
    collaboration-page.tsx
    header-footer-content-provider.tsx
    landing-page.tsx
    manage-agenda-settings.tsx
    manage-article-category-settings.tsx
    manage-collaboration-settings.tsx
    manage-header-footer-settings.tsx
    manage-landing-page-form.tsx
  constants/
    default-agenda-page.ts
    default-article-category-pages.ts
    default-collaboration-page.ts
    default-header-footer-content.ts
    default-landing-page.ts
  data/
    get-agenda-page.ts
    get-article-category-page.ts
    get-collaboration-page.ts
    get-header-footer-content.ts
    get-landing-page.ts
    website-content.mapper.ts
  schemas/
    agenda-page.schema.ts
    article-category-page.schema.ts
    collaboration-page.schema.ts
    header-footer-content.schema.ts
    landing-page.schema.ts
  types/
    agenda-page.ts
    article-category-page.ts
    collaboration-page.ts
    header-footer-content.ts
    landing-page.ts
```

Nama file mengikuti use case. Nama model/table mengikuti data yang disimpan.
Satu module boleh memiliki beberapa table selama masih berada dalam satu domain.

## 5. Aturan route dan component

- File `page.tsx` harus tetap tipis: membaca data server, menangani fallback,
  lalu memberikan props kepada komponen module.
- Halaman publik membaca database melalui Server Component. Jangan melakukan
  client fetch untuk data awal landing page.
- Client Component hanya digunakan pada bagian yang membutuhkan state, event,
  carousel, editor, crop image, atau browser API.
- Halaman kategori artikel pada root URL menggunakan satu dynamic segment
  `[categorySlug]`. Route statis tetap memiliki prioritas, sedangkan slug yang
  tidak terdaftar wajib menghasilkan `notFound()`.
- Dashboard `page.tsx` membaca initial data di server dan memberikannya kepada
  form Client Component.
- Jangan mengimpor Prisma Client ke file yang memakai `"use client"`.
- Route Handler digunakan untuk kebutuhan HTTP endpoint, integrasi eksternal,
  atau signed upload. Query internal aplikasi tidak perlu diputar melalui API
  Route jika dapat dipanggil langsung dari Server Component.

## 6. Data access dan Prisma

- Gunakan Prisma versi 6 sesuai `docs/BACKEND_PLAN.md`.
- PostgreSQL menggunakan `DATABASE_URL` untuk koneksi aplikasi dan `DIRECT_URL`
  untuk koneksi langsung yang dibutuhkan migration/deployment.
- Prisma Client hanya diinisialisasi sekali melalui `src/lib/db/prisma.ts` agar
  development hot reload tidak membuat terlalu banyak connection.
- File repository/query yang mengakses database harus server-only.
- Query Prisma tidak ditulis langsung di komponen dashboard atau public UI.
- Mutation yang menyimpan satu aggregate dengan beberapa child table dilakukan
  dalam transaction.
- Semua model bisnis yang mempunyai primary key `id` menggunakan pola Prisma
  `Int @id @default(autoincrement())`.
- Model `User` menjadi pengecualian dan menggunakan UUID, misalnya
  `String @id @default(uuid()) @db.Uuid` pada PostgreSQL.
- Foreign key harus mengikuti tipe primary key yang dirujuk. Relasi ke `User`
  menggunakan UUID, sedangkan relasi ke model bisnis lain menggunakan `Int`.
- Nama Prisma model menggunakan singular PascalCase. Nama table database dapat
  dipetakan ke snake_case dengan `@@map` dan nama column dengan `@map` bila
  diperlukan.
- Setiap child collection yang dapat diurutkan wajib mempunyai field `position`.
- Setiap business table minimal mempunyai `createdAt`, `updatedAt`, dan
  `deletedAt`. Nilai `deletedAt = null` berarti record masih aktif.
- Jangan menggunakan database cascade delete untuk flow aplikasi normal. Soft
  delete parent dan child dilakukan secara eksplisit dalam satu transaction.

## 7. Singleton website page dan fallback

- Table root landing page mempunyai satu logical row dengan key tetap `home`.
- Seeder, query, dan mutation selalu menargetkan key canonical tersebut.
- Collection seperti hero slide, explore item, article section, dan team member
  disimpan pada child table terkait.
- `website_article_sections` selalu berisi lima logical row dengan section key
  fixed. Field landing dan field hero kategori berada pada row yang sama, tetapi
  disimpan melalui DTO dan Server Action terpisah agar tidak saling menimpa.
- Link halaman kategori diturunkan dari `articleCategorySlug`; jangan menyimpan
  URL duplikat jika seluruh target selalu mengikuti pola `/<slug>`.
- Slug kategori wajib unik per root, kebab-case, dan tidak boleh bertabrakan
  dengan route statis seperti `agenda`, `artikel`, `kolaborasi`, atau route auth.
- Jika root row `home` belum ada, public page menggunakan
  `default-landing-page.ts` sebagai fallback.
- Fallback hanya digunakan ketika record tidak ditemukan. Error koneksi,
  migration, atau schema database tidak boleh diam-diam dianggap sebagai data
  kosong.
- Default content yang sama dipakai sebagai sumber seed dan fallback agar tidak
  ada duplikasi nilai antara public page, dashboard, dan seeder.
- Halaman kolaborasi memakai root terpisah dengan key tetap `collaboration`,
  child partner logo, dan child partner content.
- Jika root `collaboration` belum ada, route `/kolaborasi` menggunakan
  `default-collaboration-page.ts` sebagai fallback dengan aturan error yang sama
  seperti landing page.
- Halaman agenda memakai root terpisah dengan key tetap `agenda`. Root hanya
  menyimpan konfigurasi hero; daftar dan detail acara tetap menjadi tanggung
  jawab module Agenda/Event.
- Jika root `agenda` belum ada, route `/agenda` menggunakan
  `default-agenda-page.ts` sebagai fallback dengan aturan error yang sama.
- Header dan footer global memakai root `header-footer`. Public layout membaca
  root tersebut di server lalu membagikan DTO melalui provider client kepada
  Header dan Footer tanpa browser fetch.
- Jika root `header-footer` belum ada, public layout menggunakan
  `default-header-footer-content.ts` sebagai fallback.
- Artikel yang tampil pada landing page tetap menjadi tanggung jawab module
  `article`. Relasi pin artikel dibuat setelah model Article tersedia; jangan
  menyimpan judul artikel sebagai pengganti foreign key permanen.

## 8. Soft delete

- Semua business table, termasuk child dan join table yang menyimpan relasi
  bisnis, menggunakan field nullable `deletedAt` sebagai penanda soft delete.
- Hard delete tidak tersedia melalui flow aplikasi normal. Hard delete hanya
  boleh digunakan untuk maintenance khusus yang diminta secara eksplisit.
- Query list, detail, pencarian, dan relasi secara default hanya mengambil record
  dengan `deletedAt = null`.
- Repository bertanggung jawab menerapkan filter soft delete secara konsisten;
  komponen UI tidak boleh mengatur filter tersebut sendiri.
- Soft delete aggregate dilakukan dalam transaction. Jika parent dihapus, child
  yang lifecycle-nya mengikuti parent juga diberi `deletedAt` pada transaction
  yang sama.
- Record yang melakukan reference ke `User` dapat menyimpan `deletedById` UUID
  jika audit pelaku penghapusan dibutuhkan oleh use case.
- Restore harus menjadi operasi eksplisit. Restore parent tidak otomatis
  mengaktifkan child jika child sebelumnya sudah dihapus secara terpisah.
- Jika join table mempunyai composite unique dan relasi yang sama ditambahkan
  kembali, aktifkan kembali row lama dengan `deletedAt = null`; jangan membuat
  duplicate row baru.

## 9. Unique field pada soft delete

Constraint unique tetap dipertahankan pada field seperti `slug`, `code`, atau
identifier bisnis lain. Ketika record di-soft-delete, nilai unique dilepaskan
dengan mengganti nilainya dalam transaction yang sama.

Format standar untuk slug:

```text
<original-slug>-deleted-<YYYYMMDDHHmmss>-<id>
```

Contoh:

```text
ini-slug-abc-deleted-20260212220145-123
```

Aturan penerapannya:

- Gunakan timestamp UTC sampai detik dan ID record. Timestamp sampai menit saja
  tidak cukup aman karena dua operasi dapat terjadi pada menit yang sama.
- Simpan nilai asli pada field seperti `originalSlug` atau `slugBeforeDelete`
  agar proses audit dan restore tidak bergantung pada parsing suffix.
- Update unique field dan `deletedAt` harus dilakukan dalam satu transaction.
- Perhatikan batas panjang column. Potong bagian original secara deterministic
  sebelum suffix ditambahkan jika hasilnya melebihi batas.
- Record baru boleh memakai kembali slug asli setelah record lama berhasil
  di-soft-delete.
- Saat restore, cek kembali ketersediaan slug asli. Jika sudah dipakai record
  aktif lain, restore harus meminta slug baru atau gagal dengan pesan conflict.
- Field berformat khusus seperti email dan nomor telepon tidak boleh sekadar
  diberi suffix yang membuat formatnya invalid. Gunakan strategi release atau
  anonymization khusus dan tetap simpan nilai asli jika kebijakan data
  mengizinkan.

## 10. Validation dan mutation

- Semua input dari dashboard divalidasi dengan Zod di server sebelum masuk ke
  repository.
- Validasi client hanya untuk membantu UX dan tidak menggantikan validasi server.
- Server Action dan Route Handler wajib melakukan authentication dan
  authorization di dalam fungsi server.
- Auth client-side atau state React tidak boleh dipercaya untuk melindungi
  mutation.
- Server Action dianggap sebagai endpoint yang dapat dipanggil secara langsung.
- Setelah mutation berhasil, route publik terkait dan dashboard website harus
  diinvalidasi agar membaca data terbaru.

## 11. SSR dan cache Next.js 16

- Halaman publik menggunakan Server Component untuk membaca data awal.
- Project saat ini belum mengaktifkan `cacheComponents`, sehingga jangan memakai
  directive `"use cache"` tanpa keputusan perubahan konfigurasi terlebih dahulu.
- Untuk cache query Prisma pada konfigurasi sekarang, gunakan mekanisme cache
  non-`fetch` yang didukung Next.js dan tag yang spesifik terhadap module.
- Mutation website content harus menginvalidasi tag website content terkait.
- Jangan memakai `force-dynamic` atau menonaktifkan cache secara global tanpa
  kebutuhan yang jelas.

## 12. Image dan Cloudinary

- Database hanya menyimpan URL image pada field table terkait, bukan binary,
  base64, atau browser `blob:` URL.
- `CLOUDINARY_API_SECRET` hanya boleh digunakan pada server.
- Hasil crop client harus di-upload terlebih dahulu ke Cloudinary. URL permanen
  dari Cloudinary baru dimasukkan ke form dan disimpan ke database.
- Image publik dilayani dengan `next/image`.
- Host Cloudinary dan host fallback dummy image harus didaftarkan secara spesifik
  melalui `images.remotePatterns` di `next.config.ts`.
- Remote image memakai ukuran eksplisit atau `fill` di dalam container yang
  mempunyai aspect ratio untuk mencegah layout shift.

## 13. Dependency antar-module

- Module boleh membaca public type atau query yang memang diekspos module lain.
- Module tidak boleh mengakses internal repository module lain secara acak.
- `website-content` memiliki konfigurasi tampilan landing page dan halaman
  kategori, sedangkan `article` memiliki record artikel serta relasi domain
  kategorinya ketika module tersebut diimplementasikan.
- `auth` menjadi dependency wajib sebelum mutation dashboard atau upload image
  dapat dianggap aman untuk production.
- Hindari circular dependency. Jika dua module membutuhkan helper yang sama dan
  helper tersebut tidak memiliki business ownership, pindahkan ke `src/lib`.

## 14. Migration bertahap

- Jangan menghapus mock data yang masih digunakan module lain.
- Landing page, hero kategori Article, Agenda, dan Collaboration dapat berpindah
  ke database sementara record Article dan Event masih menggunakan mock data.
- Setelah suatu data resmi dimiliki database, hapus duplikasi default dari
  komponen dan gunakan DTO/default canonical milik module.
- Perubahan struktur tidak boleh mengubah tampilan frontend kecuali memang
  diminta sebagai bagian dari task.

## 15. Validasi project dan test case

- Pengembangan feature di project ini tidak mewajibkan pembuatan automated test
  case baru.
- Jangan menambahkan test framework, unit test, integration test, atau end-to-end
  test kecuali diminta secara eksplisit.
- Validasi dilakukan secara proporsional menggunakan command project dan smoke
  check pada flow yang berubah.
- Untuk perubahan Prisma, gunakan `npx prisma format` dan
  `npx prisma validate`.
- Untuk perubahan TypeScript, gunakan `npx tsc --noEmit` bila diperlukan.
- Gunakan `npm run lint` untuk validasi lint dan `npm run build` sebagai validasi
  akhir untuk perubahan yang memengaruhi render atau integrasi Next.js.
- Tidak semua command wajib dijalankan untuk perubahan dokumentasi atau perubahan
  kecil. Pilih validasi yang benar-benar relevan dan laporkan command yang tidak
  dapat dijalankan.
- Smoke check manual dapat digunakan untuk memastikan query, mutation, soft
  delete, restore, upload, serta fallback bekerja sesuai use case.
