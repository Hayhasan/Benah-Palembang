# Event Module

Module Event mengelola agenda atau acara yang dibuat oleh account dashboard dan
ditampilkan pada halaman publik Agenda. Setiap Event selalu mempunyai pemilik
melalui relasi ke model `User`.

Dokumen ini menjadi spesifikasi dan implementation plan awal. Implementasi
dikerjakan sebelum Article dan Manage Content dengan urutan:

```text
schema dan migration -> seeding -> halaman publik -> dashboard pemilik
```

## 1. Scope awal

- Menyimpan Event pada PostgreSQL melalui Prisma.
- Menghubungkan setiap Event ke satu `User` sebagai owner.
- Menyediakan seeder dari mock Event yang sudah ada.
- Menampilkan daftar Event published pada `/agenda`.
- Menampilkan detail Event published pada `/agenda/[id]`.
- Menampilkan daftar Event milik current user pada `/dashboard/create-event`.
- Membuat, mengubah, preview, mengajukan publikasi, dan soft delete Event milik
  sendiri.
- Menyediakan status yang nantinya dapat dimoderasi melalui Manage Content.

Sistem interaksi belum termasuk scope awal. Nilai berikut tetap berupa mock atau
hardcoded pada UI dan belum disimpan ke database:

- Views.
- Likes.
- Participants atau jumlah pendaftar.

Event tidak mempunyai statistik comments. Implementasi Event tidak membuat
model Like, View, Participant, Registration, atau Comment.

## 2. Batasan permission sementara

Role-based permission belum dikerjakan pada tahap ini. Module Event tidak
membuat permission system sendiri dan tidak menambahkan keputusan akses tetap
seperti `ADMIN` atau `SUPERADMIN`.

Aturan sementara:

- Dashboard tetap berada di authenticated boundary project yang sudah ada.
- Identitas owner mutation selalu berasal dari current authenticated user.
- Client tidak boleh mengirim atau menentukan `ownerId`.
- Query dan mutation milik user tetap memverifikasi ownership di server.
- Role guard untuk akses administratif akan dipasang oleh module Permission pada
  tahap terpisah.

Permission yang ditunda tidak berarti ownership boleh dipercaya dari UI. User
tetap tidak boleh mengubah atau menghapus Event milik user lain.

## 3. Status Event

Event memakai enum status bersama yang nantinya juga dipakai Article:

```prisma
enum ContentStatus {
  DRAFT
  PENDING_REVIEW
  PUBLISHED
  REJECTED
  TAKEN_DOWN
}
```

Mapping UI:

| Database | Label UI | Keterangan |
| --- | --- | --- |
| `DRAFT` | Draf | Disimpan owner dan belum diajukan |
| `PENDING_REVIEW` | Request | Diajukan owner untuk diperiksa |
| `PUBLISHED` | Post atau Posted | Tampil pada halaman publik |
| `REJECTED` | Rejected | Pengajuan ditolak |
| `TAKEN_DOWN` | Takedown | Konten published diturunkan |

Transisi awal:

```text
DRAFT -> PENDING_REVIEW
REJECTED -> PENDING_REVIEW
PENDING_REVIEW -> PUBLISHED
PENDING_REVIEW -> REJECTED
PUBLISHED -> TAKEN_DOWN
TAKEN_DOWN -> PUBLISHED
```

Owner tidak mempublikasikan langsung ke halaman publik. Tombol publikasi pada
editor secara domain berarti mengajukan Event menjadi `PENDING_REVIEW`.

## 4. Database

Schema yang direncanakan:

```prisma
model Event {
  id                   Int           @id @default(autoincrement())
  ownerId              String        @db.Uuid
  reviewedById         String?       @db.Uuid
  slug                 String        @unique @db.VarChar(180)
  originalSlug         String?       @db.VarChar(180)
  title                String        @db.VarChar(255)
  description          String        @db.Text
  content              String        @db.Text
  bannerUrl            String        @db.Text
  category             String        @db.VarChar(100)
  startsAt             DateTime      @db.Timestamptz(6)
  endsAt               DateTime?     @db.Timestamptz(6)
  location             String        @db.VarChar(255)
  organizer            String        @db.VarChar(255)
  registrationUrl      String?       @db.Text
  status               ContentStatus @default(DRAFT)
  moderationNote       String?       @db.Text
  submittedAt          DateTime?     @db.Timestamptz(6)
  publishedAt          DateTime?     @db.Timestamptz(6)
  reviewedAt           DateTime?     @db.Timestamptz(6)
  createdAt            DateTime      @default(now()) @db.Timestamptz(6)
  updatedAt            DateTime      @updatedAt @db.Timestamptz(6)
  deletedAt            DateTime?     @db.Timestamptz(6)
  owner                User          @relation("EventOwner", fields: [ownerId], references: [id])
  reviewedBy           User?         @relation("EventReviewer", fields: [reviewedById], references: [id])
  tags                 EventTag[]

  @@index([ownerId, deletedAt, updatedAt])
  @@index([status, deletedAt, startsAt])
  @@map("events")
}

model EventTag {
  id        Int       @id @default(autoincrement())
  eventId   Int
  label     String    @db.VarChar(80)
  position  Int
  createdAt DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt DateTime  @updatedAt @db.Timestamptz(6)
  deletedAt DateTime? @db.Timestamptz(6)
  event     Event     @relation(fields: [eventId], references: [id])

  @@index([eventId, deletedAt, position])
  @@map("event_tags")
}
```

Nama relation Prisma dapat disesuaikan saat migration selama tetap eksplisit
karena `User` mempunyai relasi sebagai owner dan reviewer.

### Keputusan schema

- Primary key Event memakai `Int` auto-increment.
- Foreign key ke User memakai UUID.
- Route publik tetap memakai `/agenda/[id]`; slug dipakai untuk identifier
  canonical, idempotency seed, dan kemungkinan URL SEO di masa depan.
- Category disimpan sebagai string karena mock mempunyai kategori yang lebih
  luas daripada pilihan editor saat ini.
- `startsAt` dan `endsAt` dapat merepresentasikan Event satu hari maupun rentang
  waktu.
- DateTime disimpan sebagai timestamp dan ditampilkan memakai timezone
  `Asia/Jakarta`.
- Rich content disanitasi di server sebelum disimpan atau dirender.
- Statistik interaksi tidak menjadi column pada tahap awal.

## 5. Soft delete

Delete dari halaman owner selalu soft delete.

Dalam satu transaction:

- Simpan slug aktif ke `originalSlug` jika belum tersedia.
- Lepaskan unique slug dengan format yang mengikuti
  `docs/rules/project-structure.md`.
- Isi `deletedAt` Event.
- Isi `deletedAt` seluruh EventTag aktif.

Takedown bukan delete. Takedown hanya mengubah status menjadi `TAKEN_DOWN` dan
record tetap dapat dipulihkan.

## 6. Sumber mock canonical

Mock Event saat ini tersebar di:

```text
src/data/mockData.ts
src/features/dashboard/CreateEvent.tsx
src/features/dashboard/CreateEventEditor.tsx
src/features/dashboard/EventPreview.tsx
src/features/dashboard/ManageContent.tsx
```

Normalisasi dilakukan sebagai berikut:

- Mock publik Agenda dan mock dashboard pemilik dipindahkan ke constant murni
  pada module Event.
- Record yang mewakili Event sama disatukan berdasarkan slug atau kombinasi
  judul dan waktu.
- Field yang tidak tersedia pada mock ringkas diisi secara deterministic dari
  data yang tersedia, bukan dari state komponen.
- Mock Manage Content bukan aggregate baru. Baris Event pada Manage Content
  nantinya berasal dari query Event yang sama.
- Nilai views, likes, dan participants tetap berada pada helper mock UI dan tidak
  ikut menjadi data bisnis hasil seed.

Target file:

```text
src/modules/event/constants/default-events.ts
```

File tersebut hanya berisi data dan type murni sehingga aman dipakai seeder.

## 7. Seeder Event

File dan command:

```text
prisma/seeders/event.seeder.ts
npm run seed:event
```

Alur seeder:

1. Query seluruh User dengan `role = USER` dan `deletedAt = null`. User banned
   sebaiknya tidak dipakai sebagai owner mock baru.
2. Gagal dengan error yang jelas jika tidak ada User yang dapat dipakai.
3. Normalisasi seluruh default Event.
4. Untuk setiap Event yang belum ada, pilih satu User secara random sebagai
   `ownerId`.
5. Buat Event dan seluruh EventTag dalam transaction.
6. Lewati Event yang slug canonical-nya sudah tersedia.
7. Jangan menimpa owner, status, atau content Event yang sudah ada.

Random owner hanya dipilih saat record baru dibuat. Menjalankan ulang seeder
tidak mengacak ulang relasi Event yang sudah tersimpan.

Urutan aggregate runner:

```text
account-manage -> website-content -> event -> article
```

Seeder Event standalone mengasumsikan User sudah tersedia. Seeder tidak membuat
User sementara dan tidak menjalankan reset data.

## 8. Public query dan route

### `/agenda`

Route Server Component membaca:

- Hero page dari module `website-content`.
- Event dengan `status = PUBLISHED` dan `deletedAt = null` dari module Event.

DTO diberikan kepada Client Component hanya untuk filter dan interaksi UI.
Filter yang harus berfungsi dari tanggal database:

- This Month.
- Upcoming.
- Past Event.

Urutan default adalah `startsAt asc` untuk Event yang akan datang dan urutan
tanggal yang sesuai untuk Event lampau.

### `/agenda/[id]`

- `params` di-await sesuai Next.js 16.
- ID divalidasi sebagai integer positif.
- Query hanya mengambil Event published yang belum soft-deleted.
- Record tidak ditemukan menghasilkan `notFound()`.
- Related Event berasal dari database dan tidak memakai fallback record pertama.
- Share button tetap Client Component karena memakai browser API.
- Tombol registrasi memakai `registrationUrl`; jika kosong, UI menampilkan
  fallback informasi tanpa membuat URL pendaftaran palsu.

## 9. Dashboard owner

### List Event

Route `/dashboard/create-event` membaca initial data di server.

- Filter wajib `ownerId = currentUser.id` dan `deletedAt = null`.
- Search berdasarkan title dan description.
- Pagination sebanyak 25 item per halaman.
- Search dan page disimpan pada URL.
- Seluruh status milik owner dapat tampil.
- Statistik views, likes, dan participants memakai nilai mock UI.

### Editor Event

Input editor:

- Title.
- Description.
- Date dan time.
- Optional end date/time jika UI diperluas untuk data rentang.
- Location.
- Organizer.
- Registration URL.
- Rich content.
- Banner URL.
- Category.
- Tags.

Server Action yang direncanakan:

```text
createEventDraftAction
updateEventAction
submitEventForReviewAction
softDeleteEventAction
```

Semua mutation:

- Membaca actor dari authenticated server session.
- Memvalidasi input dengan Zod.
- Tidak menerima owner ID dari client.
- Memastikan target Event adalah milik actor.
- Menyimpan Event dan tags dalam transaction.
- Merevalidasi route dashboard dan public yang relevan.

## 10. Struktur module

```text
src/modules/event/
  actions/
    create-event-draft.ts
    soft-delete-event.ts
    submit-event-for-review.ts
    update-event.ts
  components/
    event-editor.tsx
    event-list.tsx
    event-preview.tsx
    public-event-detail.tsx
    public-event-list.tsx
  constants/
    default-events.ts
  data/
    event.mapper.ts
    get-event-editor.ts
    get-owned-event.ts
    get-owned-events.ts
    get-public-event.ts
    get-public-events.ts
  schemas/
    event.schema.ts
  types/
    event.ts
```

Nama file dapat disesuaikan berdasarkan use case nyata. Route di `src/app`
tetap tipis dan tidak mengakses Prisma langsung.

## 11. Implementation plan Event

1. Finalisasi dokumen Event.
2. Tambahkan enum, model, relation User, dan migration Event.
3. Buat default Event canonical dan seeder idempotent.
4. Jalankan seeder dua kali untuk memverifikasi create lalu skip.
5. Implementasikan query dan halaman publik `/agenda`.
6. Implementasikan detail publik `/agenda/[id]`.
7. Implementasikan list Event milik current user.
8. Implementasikan editor dan Server Action ownership.
9. Pindahkan komponen Event yang sudah terhubung backend dari `src/features` ke
   `src/modules/event`.
10. Hapus dependency Event terhadap mock lama yang sudah digantikan.
11. Jalankan validasi Prisma, TypeScript, lint, build, dan smoke check.

## 12. Kriteria selesai

- Event mempunyai schema dan migration valid.
- `seed:event` tersedia, random owner menggunakan User role `USER`, dan aman
  dijalankan ulang.
- `/agenda` dan `/agenda/[id]` membaca database.
- Public route hanya menampilkan Event published.
- Dashboard hanya membaca dan mengubah Event milik current user.
- Delete memakai soft delete.
- Status moderation tersimpan untuk integrasi Manage Content.
- Views, likes, dan participants tetap hardcoded di UI.
- Event tidak mempunyai comments.
- Tidak ada permission system atau hardcoded role access baru pada tahap ini.
