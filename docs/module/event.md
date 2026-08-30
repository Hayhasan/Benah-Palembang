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

Pada halaman owner, aksi status yang tersedia sengaja lebih sempit:

- Event `DRAFT` mempunyai tombol **Post** untuk berpindah ke
  `PENDING_REVIEW`.
- Event `PUBLISHED` mempunyai tombol **Archive** untuk menjalankan soft delete.
- Event `PENDING_REVIEW`, `REJECTED`, dan `TAKEN_DOWN` tidak mempunyai tombol
  perubahan status.
- Tombol **Takedown** dan **Restore** tidak tersedia pada POV owner. Kedua aksi
  tersebut merupakan bagian flow moderasi Manage Content yang dikerjakan
  terpisah.

## 4. Database

Schema yang sudah diimplementasikan:

```prisma
model Event {
  id                   Int           @id @default(autoincrement())
  ownerId              String        @db.Uuid
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
  createdAt            DateTime      @default(now()) @db.Timestamptz(6)
  updatedAt            DateTime      @updatedAt @db.Timestamptz(6)
  deletedAt            DateTime?     @db.Timestamptz(6)
  owner                User          @relation("EventOwner", fields: [ownerId], references: [id])
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

Relation Prisma pada `User` dibuat eksplisit sebagai `EventOwner` untuk
menghubungkan Event dengan account pembuatnya.

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
- Actor dan waktu proses review tidak diduplikasi pada Event. Informasi
  `reviewedBy` dan `reviewedAt` nantinya berasal dari central activity log.
- Event tetap menyimpan current status, optional `moderationNote`, serta
  `publishedAt` sebagai state aggregate yang dibutuhkan query aplikasi.

## 5. Soft delete

Archive dari halaman owner selalu menggunakan soft delete dan hanya dapat
dijalankan untuk Event `PUBLISHED`.

Dalam satu transaction:

- Simpan slug aktif ke `originalSlug` jika belum tersedia.
- Lepaskan unique slug dengan format yang mengikuti
  `docs/rules/project-structure.md`.
- Isi `deletedAt` Event.
- Isi `deletedAt` seluruh EventTag aktif.

Takedown bukan archive atau delete. Takedown hanya mengubah status menjadi
`TAKEN_DOWN`, record tetap aktif, dan aksi tersebut tidak tersedia pada halaman
owner.

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

Server Action yang diimplementasikan:

```text
saveEventAction
postEventAction
archiveEventAction
```

`saveEventAction` menangani create dan update aggregate Event. Intent `SAVE`
mempertahankan status saat ini, sedangkan intent `POST` hanya valid untuk Event
baru atau Event `DRAFT` dan menyimpan status `PENDING_REVIEW`.

### Preview Event

Route `/dashboard/create-event/preview/[id]` hanya membaca Event aktif milik
current user. Preview dapat digunakan untuk seluruh status dan menampilkan
konten tersimpan menggunakan tampilan detail Event tanpa mengekspos draft ke
route publik.

Tombol Preview pada editor menyimpan perubahan terlebih dahulu. Dengan demikian,
Event baru memperoleh ID dan halaman preview selalu membaca data terbaru dari
database.

### Aksi status owner

| Status | Aksi status | Hasil |
| --- | --- | --- |
| `DRAFT` | Post | Status menjadi `PENDING_REVIEW` |
| `PUBLISHED` | Archive | Event dan EventTag di-soft-delete |
| `PENDING_REVIEW` | Tidak ada | Menunggu flow moderasi |
| `REJECTED` | Tidak ada | Tidak ada transisi owner pada tahap awal |
| `TAKEN_DOWN` | Tidak ada | Ditangani flow moderasi terpisah |

Tombol Save, Preview, View, dan Edit merupakan aksi pengelolaan konten, bukan
aksi status. Tidak ada tombol Takedown atau Restore pada list, editor, maupun
preview owner.

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
    archive-event.ts
    post-event.ts
    revalidate-event-routes.ts
    save-event.ts
  components/
    event-editor.tsx
    owned-event-list.tsx
    owned-event-preview.tsx
    public-event-detail.tsx
    public-event-list.tsx
  constants/
    default-events.ts
  data/
    event.mapper.ts
    get-owned-event.ts
    get-owned-events.ts
    get-public-event.ts
    get-public-events.ts
    owned-event.mapper.ts
    sanitize-event-content.ts
  schemas/
    event.schema.ts
  types/
    event.ts
    owned-event.ts
```

Nama file dapat disesuaikan berdasarkan use case nyata. Route di `src/app`
tetap tipis dan tidak mengakses Prisma langsung.

## 11. Implementation plan Event

- [x] Finalisasi dokumen Event.
- [x] Tambahkan enum, model, relation User, dan migration Event.
- [x] Buat default Event canonical dan seeder idempotent.
- [x] Jalankan seeder dua kali untuk memverifikasi create lalu skip.
- [x] Implementasikan query dan halaman publik `/agenda`.
- [x] Implementasikan detail publik `/agenda/[id]`.
- [x] Implementasikan list Event milik current user.
- [x] Implementasikan create, edit, preview, dan Server Action ownership.
- [x] Implementasikan aksi owner `Post` dan `Archive` sesuai status.
- [x] Pindahkan komponen Event yang sudah terhubung backend dari `src/features`
  ke `src/modules/event`.
- [x] Hapus dependency Event terhadap mock lama yang sudah digantikan.
- [x] Jalankan validasi frontend, build, dan smoke check setelah integrasi route.

### Status schema dan seeding

- Migration `20260828095033_add_event_module` dan
  `20260828202349_remove_event_review_fields` sudah diterapkan.
- Canonical data berisi 56 Event dari mock publik Agenda dan dashboard Event.
- Distribusi awal terdiri dari 51 `PUBLISHED`, 4 `DRAFT`, dan 1 `TAKEN_DOWN`.
- Seeder memilih owner secara random hanya dari User aktif, tidak banned, dan
  mempunyai role `USER`.
- Eksekusi pertama membuat 56 Event; eksekusi kedua melewati seluruh data tanpa
  duplicate atau overwrite.
- Validasi Prisma dan TypeScript untuk tahap ini sudah berhasil.

### Status halaman publik

- `/agenda` membaca hero dari `website-content` dan Event `PUBLISHED` aktif dari
  database secara paralel pada Server Component.
- Filter This Month, Upcoming, dan Past Event memakai timestamp database dengan
  acuan timezone `Asia/Jakarta`.
- `/agenda/[id]` memvalidasi ID integer positif, hanya membaca Event
  `PUBLISHED` aktif, dan menghasilkan `notFound()` untuk ID invalid atau record
  yang tidak tersedia.
- Related Event berasal dari Event published dengan kategori yang sama.
- CTA pendaftaran hanya menjadi link ketika `registrationUrl` tersedia.
- Views, likes, dan participants ditampilkan dari helper mock deterministic;
  tidak ada interaction table dan tidak ada comments Event.
- Public Agenda sudah tidak membaca `agendaItems` dari `src/data/mockData.ts`.

### Status dashboard owner

- `/dashboard/create-event` membaca maksimal 25 Event aktif milik current user
  per halaman, dengan search title dan description melalui URL.
- `/dashboard/create-event/new` membuat Event baru sebagai `DRAFT` atau langsung
  mengajukannya sebagai `PENDING_REVIEW` melalui tombol Post.
- `/dashboard/create-event/edit?id=<id>` hanya membuka Event aktif yang dimiliki
  current user dan menghasilkan `notFound()` untuk target invalid atau bukan
  milik actor.
- `/dashboard/create-event/preview/[id]` menyediakan preview owner untuk seluruh
  status tanpa mengubah visibility route publik.
- Update Event dan replacement EventTag dijalankan dalam transaction. Rich HTML
  disanitasi pada server sebelum disimpan.
- Event `DRAFT` menampilkan aksi Post, Event `PUBLISHED` menampilkan aksi
  Archive, dan status lain tidak menampilkan aksi status.
- Archive melepaskan slug canonical, menyimpan `originalSlug`, serta melakukan
  soft delete pada Event dan seluruh EventTag aktif dalam satu transaction.
- Tidak ada tombol Takedown atau Restore pada POV owner.
- Upload banner Event menggunakan signed upload Cloudinary ke folder
  `benah-palembang/events`.
- Gambar yang ditambahkan melalui rich-text editor di-upload ke Cloudinary
  terlebih dahulu. HTML hanya menyimpan URL HTTPS hasil upload, bukan URL
  browser sementara berformat `blob:`.
- Statistik views, likes, dan participants tetap memakai mock deterministic.

## 13. Sistem Like Event

Event like diimplementasikan menggunakan table relasional `EventLike`:

- **Model Prisma:** `EventLike` dengan relasi ke `Event` dan `User`, serta constraint `@@unique([eventId, userId])`.
- **Server Action:** `toggleEventLikeAction({ eventId })` yang memvalidasi session user dan melakukan toggle insert/delete row like.
- **Halaman Publik (`/agenda/[id]`):**
  - Tombol like ditempatkan di dalam card *Detail Acara* (berdampingan dengan tombol *Bagikan Acara*).
  - Hanya dapat di-like oleh user authenticated.
  - User guest/unauthenticated akan menerima notifikasi toast ramah untuk login ke `/login?redirect=/agenda/[id]`.
  - State optimis interaktif: icon hati merah menyala saat aktif, teks tombol menyesuaikan (`Disukai` / `Suka`), dan jumlah like pada hero header ter-update instan.
- **Dashboard Synchronization:**
  - `/dashboard/content` menampilkan jumlah like riil database pada kolom statistik tipe Event.
  - `/dashboard/content/[id]/event` menampilkan jumlah like riil pada metadata hero event.
  - `/dashboard/create-event` menampilkan jumlah like riil pada tabel event milik author.
  - `/dashboard/create-event/preview/[id]` menampilkan jumlah like riil pada metadata preview owner.

## 14. Sistem View Event

Sistem view agenda/event mencatat pembacaan riil secara atomic dengan proteksi deduplikasi Redis:

- **Database Column:** `views Int @default(0)` pada model `Event`.
- **Deduplikasi Redis (24 Jam / 86400 Detik):**
  - Menggunakan command Redis atomic `SET key "1" EX 86400 NX`.
  - Key format authenticated user: `<REDIS_PREFIX>:view:event:<eventId>:user:<userId>`.
  - Key format guest / unauthenticated: `<REDIS_PREFIX>:view:event:<eventId>:device:<deviceId>`.
  - `deviceId` digenerate otomatis melalui Next.js Proxy/Middleware dalam bentuk cookie HTTP `benah_device_id` (durasi 1 tahun).
- **Trigger Penambahan View:**
  - Hanya bertambah pada halaman publik detail `/agenda/[id]` (`src/app/(public)/agenda/[id]/page.tsx`).
  - Tidak bertambah pada halaman preview author, dashboard, atau manage content.
- **Sinkronisasi UI:**
  - Halaman detail publik `/agenda/[id]`, dashboard author `/dashboard/create-event`, author preview, dan manage content membaca angka `views` riil dari database.

## 15. Sistem Partisipan Event (CTA Tracking)

Sistem partisipan agenda/event mencatat pengunjung yang mengklik tombol CTA **"Daftar Sekarang"** secara persistent dan unik selamanya di database PostgreSQL:

- **Model Prisma:** `EventParticipant` dengan kolom `eventId`, `userId?`, `deviceId?`, `identifier` (`user:<userId>` atau `device:<deviceId>`), serta constraint unik `@@unique([eventId, identifier])`.
- **Server Action:** `registerEventParticipantAction({ eventId })` yang mencatat pendaftaran jika `identifier` belum pernah terdaftar untuk acara terkait.
- **Halaman Publik (`/agenda/[id]`):**
  - Tombol CTA *"Daftar Sekarang"* membuka tautan pendaftaran eksternal (`registrationUrl`) di tab baru.
  - State optimis langsung menambahkan jumlah partisipan `+1` di hero header dan menandai status terdaftar.
- **Agregasi & Sinkronisasi Dashboard:**
  - Menghitung jumlah partisipan aktif secara riil menggunakan agregasi Prisma `_count: { select: { participants: { where: { deletedAt: null } } } }`.
  - `/dashboard/content` menampilkan jumlah partisipan riil pada kolom statistik event.
  - `/dashboard/create-event` menampilkan jumlah partisipan riil pada tabel event milik author.
  - `/dashboard/create-event/preview/[id]` dan preview Manage Content menampilkan jumlah partisipan riil.

## 16. Penyesuaian UI & Interaksi (Vite to Next Migration)

- **Tombol WhatsApp "Hubungi Kami"**: Pada halaman detail agenda publik (`/agenda/[id]`), ditambahkan tombol WhatsApp *"Hubungi Kami"* berdampingan secara responsif (`grid-cols-2`) dengan tombol *"Bagikan Acara"* tepat di bawah tombol *"Daftar Sekarang"*.
- **Konfirmasi Modal Delete**: Penghapusan event di dashboard author (`/dashboard/create-event`) menggunakan `<ConfirmActionDialog>` dengan feedback toast Sonner 3 detik.
- **Dynamic Theme & Toast Notifications**: Seluruh interaksi simpan, ajukan publikasi, dan copy link dilengkapi feedback Sonner toast dengan durasi 3000ms.
