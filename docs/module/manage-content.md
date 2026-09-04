# Manage Content Module

Manage Content adalah module dashboard untuk melihat dan memoderasi Article dan
Event melalui dua halaman terpisah. Module ini tidak memiliki business table
atau content record sendiri. Seluruh data tetap dimiliki module Article dan
Event.

Manage Content dikerjakan terakhir setelah implementasi awal Event dan Article
selesai.

## 1. Scope awal

- Menampilkan Article pada `/dashboard/content/article`.
- Menampilkan Event pada `/dashboard/content/event`.
- Search berdasarkan title dan owner/author pada halaman aktif.
- Pagination sebanyak 25 item per halaman.
- Membuka preview Article atau Event.
- Menyetujui content yang berstatus `PENDING_REVIEW`.
- Menolak content yang berstatus `PENDING_REVIEW`.
- Melakukan takedown content published.
- Memulihkan content yang sudah ditakedown.
- Menampilkan status moderation yang tersimpan pada Article atau Event.

Manage Content tidak membuat:

- Table `contents` atau model polymorphic baru.
- Seeder khusus Manage Content.
- Duplicate Article atau Event hanya untuk kebutuhan list admin.
- Sistem likes, views, atau comments.
- Permission system atau role matrix pada tahap awal.

## 2. Batasan permission sementara

Aturan akses berbasis role seperti hanya `ADMIN` dan `SUPERADMIN` ditunda karena
akan dimiliki module Permission. Implementasi awal Manage Content tidak membuat
permission logic kedua dan tidak menanam role matrix langsung pada module.

Aturan sementara:

- Halaman tetap berada pada authenticated dashboard boundary.
- Actor moderation berasal dari current authenticated user.
- Client tidak boleh mengirim actor ID atau actor role sebagai sumber otorisasi.
- Module mengirim actor moderation ke central activity log untuk audit, tetapi
  keputusan apakah actor boleh melakukan moderation akan dipasang oleh module
  Permission nanti.
- Existing hardcoded role guard pada route tidak dianggap bagian dari scope
  implementasi module ini dan tidak diperluas.

Ketika module Permission tersedia, guard dipasang pada page, data function, dan
setiap moderation action tanpa mengubah kontrak data Manage Content.

## 3. Sumber data

Manage Content membaca dua model:

```text
Article
Event
```

Keduanya menggunakan `ContentStatus` yang sama:

```text
DRAFT
PENDING_REVIEW
PUBLISHED
REJECTED
TAKEN_DOWN
ARCHIVED
```

Daftar moderation tidak menampilkan `DRAFT` karena draft belum diajukan oleh
owner, dan tidak menampilkan `ARCHIVED` karena konten arsip sudah diturunkan
sendiri oleh owner sehingga tidak menunggu keputusan admin. Jejaknya tetap
terekam pada Activity Log melalui action `ARCHIVE`, dan konten kembali muncul
pada daftar moderation begitu owner mempublikasikannya ulang. Status yang
ditampilkan:

- `PENDING_REVIEW` sebagai Request.
- `PUBLISHED` sebagai Posted.
- `REJECTED` sebagai Rejected.
- `TAKEN_DOWN` sebagai Takedown.

Manage Content tidak menyimpan copy title, owner, banner, status, atau tanggal.
Semua field dibaca langsung dari record pemilik domain.

## 4. Statistik UI

Statistik dibaca dari model canonical Article dan Event melalui query agregasi
Prisma. Manage Content tidak menyimpan salinan statistik sendiri.

Statistik per type:

| Content type | Statistik yang ditampilkan |
| --- | --- |
| Article | Views, Likes, Comments |
| Event | Views, Likes |

Aturan penting:

- Event tidak menampilkan comments.
- Statistik tidak menjadi filter atau sumber keputusan moderation.
- Views berasal dari counter masing-masing content; likes dan comments berasal
  dari count relasi database.
- Record baru tanpa interaksi menampilkan nilai awal `0`.

UI kolom Statistik menyesuaikan icon ketiga berdasarkan content type:

```text
Article -> MessageCircle
Event   -> Tidak ada statistik ketiga
```

## 5. DTO bersama

Manage Content memetakan Article dan Event ke DTO list yang sama:

```ts
type ManagedContentType = "ARTICLE" | "EVENT"

interface ManagedContentListItem {
  id: number
  type: ManagedContentType
  title: string
  description: string
  bannerUrl: string
  owner: {
    id: string
    name: string
    avatarUrl: string | null
  }
  status:
    | "PENDING_REVIEW"
    | "PUBLISHED"
    | "REJECTED"
    | "TAKEN_DOWN"
  submittedAt: string | null
  publishedAt: string | null
  updatedAt: string
}
```

ID Article dan Event dapat mempunyai angka yang sama. Tipe list ditentukan oleh
route server, sedangkan payload mutation tetap memakai pasangan `type + id`.
Kolom Type tidak perlu ditampilkan pada tabel karena satu halaman hanya memuat
satu tipe content.

## 6. Query list

Route `/dashboard/content/article` dan `/dashboard/content/event` tetap tipis
dan membaca initial data melalui data function server-only. Route parent
`/dashboard/content` mengalihkan moderator ke halaman Article.

Query menerima:

```text
q
page
```

Aturan query:

- Default page size 25.
- Page minimal 1.
- Exclude record `deletedAt != null`.
- Exclude status `DRAFT`.
- Search title, deskripsi/excerpt, dan nama owner/author secara case-insensitive.
- Urutan default `submittedAt desc`, kemudian `updatedAt desc`.
- Search dan pagination disimpan pada URL.
- DTO harus serializable dan tidak mengirim object Prisma mentah.
- Count dan pagination dijalankan langsung pada model yang sesuai dengan route;
  data Article dan Event tidak digabung atau di-slice setelah query.

## 7. Preview Admin (Moderasi)

Preview dari POV admin memakai route khusus Manage Content:

```text
/dashboard/content/article/[id]
/dashboard/content/event/[id]
```

Aturan preview admin:

- Terproteksi peran `ADMIN` dan `SUPERADMIN`.
- Tidak menampilkan tombol "Edit" karena admin bertindak sebagai peninjau/moderator.
- Menyediakan tombol aksi moderasi langsung pada action bar (Setujui, Tolak, Takedown, Pulihkan/Restore) sesuai status konten.
- Preview dapat menampilkan status non-public seperti Request, Rejected, atau Takedown.
- Record soft-deleted menghasilkan `notFound()`.
- Public preview component menggunakan layout dan tampilan yang konsisten dengan halaman detail publik.

## 8. Moderation actions

Server Action yang direncanakan:

```text
approveContentAction
rejectContentAction
takedownContentAction
restoreContentAction
```

Payload minimum:

```ts
{
  type: "ARTICLE" | "EVENT"
  id: number
  note?: string
}
```

Action melakukan:

1. Membaca actor dari authenticated server session.
2. Memvalidasi payload dengan Zod.
3. Memilih model berdasarkan `type` yang sudah divalidasi.
4. Melakukan conditional update berdasarkan status sebelumnya.
5. Menyimpan actor, action, dan waktu review ke central activity log serta
   optional `moderationNote` pada content aggregate.
6. Mengisi `publishedAt` ketika content pertama kali disetujui.
7. Merevalidasi dashboard dan seluruh public route yang memakai content.

Conditional transition:

| Action | Status awal | Status hasil |
| --- | --- | --- |
| Approve | `PENDING_REVIEW` | `PUBLISHED` |
| Reject | `PENDING_REVIEW` | `REJECTED` |
| Takedown | `PUBLISHED` | `TAKEN_DOWN` |
| Restore | `TAKEN_DOWN` | `PUBLISHED` |

Action harus idempotent atau mengembalikan conflict yang jelas jika status
record sudah berubah oleh request lain.

`moderationNote` yang diisi saat Reject dan Takedown ditampilkan kepada owner
pada daftar dan editor miliknya. Catatan tersebut dikosongkan otomatis ketika
owner mengajukan ulang konten `REJECTED` ke `PENDING_REVIEW`, sehingga admin
tidak membaca alasan penolakan versi sebelumnya.

### Form alasan moderasi

Reject dan Takedown **wajib** menyertakan alasan. Dialog konfirmasi pada daftar
maupun halaman detail moderasi memakai komponen bersama
`ModerationConfirmDialog` yang menampilkan textarea alasan (maksimal 1.000
karakter) dan menonaktifkan tombol konfirmasi selama alasan masih kosong.
Server tidak bergantung pada guard UI tersebut: `rejectContentAction` dan
`takedownContentAction` memvalidasi payload dengan
`moderationNotePayloadSchema` yang mewajibkan `note` minimal satu karakter
setelah trim.

Approve dan Restore tidak memakai form alasan. Approve tetap menerima `note`
opsional pada payload, sedangkan Restore selalu mengosongkan `moderationNote`.

### Notifikasi email

Setiap keputusan moderasi mengirim email ke pemilik konten:

| Aksi | Isi email | Tautan tujuan |
| --- | --- | --- |
| Approve | Konten disetujui dan sudah tayang | Halaman publik konten |
| Reject | Konten belum disetujui beserta alasan admin | Editor dashboard milik owner |
| Takedown | Konten diturunkan beserta alasan admin | Editor dashboard milik owner |
| Restore | Konten dipulihkan dan tayang kembali | Halaman publik konten |

Aturan implementasi:

- Transport SMTP berada pada `src/lib/mail/mailer.ts` dan dipakai bersama oleh
  email reset password serta notifikasi moderasi. Tidak ada environment
  variable baru; konfigurasi memakai `SMTP_*` dan `APP_URL` yang sudah ada.
- Template dan copy berada pada
  `src/modules/manage-content/data/moderation-mailer.ts`.
  `buildContentModerationEmail` menyusun isi email sebagai fungsi murni agar
  dapat diperiksa tanpa koneksi SMTP.
- Email dikirim **setelah** transaction commit dan setelah revalidate, bukan di
  dalam transaction, sehingga tidak ada email terkirim untuk perubahan yang
  gagal disimpan.
- `notifyContentDecision` tidak pernah melempar error. Kegagalan SMTP dicatat
  pada server log dan keputusan moderasi tetap dilaporkan berhasil, karena
  perubahan status sudah tersimpan sebelum email dikirim.
- Seluruh nilai dinamis pada body HTML di-escape.

Role permission tidak ditentukan dalam action versi awal. Module Permission
nantinya menambahkan guard sebelum mutation tanpa menerima role dari client.

## 9. Seeder

Manage Content tidak mempunyai seeder.

Data yang tampil berasal dari:

```text
npm run seed:event
npm run seed:article
```

Mock `initialContent` pada frontend lama hanya menjadi referensi tampilan,
status, dan variasi statistik. Mock tersebut tidak dibuat sebagai aggregate
ketiga karena akan menghasilkan duplicate data yang tidak mempunyai ownership
domain yang jelas.

Setelah Event dan Article terhubung database, `initialContent` dihapus dan list
Manage Content dibangun dari query terpisah per model.

## 10. Struktur module

```text
src/modules/manage-content/
  actions/
    approve-content.ts
    reject-content.ts
    restore-content.ts
    takedown-content.ts
  components/
    manage-content-list.tsx
    moderation-dialog.tsx
  data/
    get-managed-content.ts
    managed-content.mapper.ts
  schemas/
    manage-content.schema.ts
  types/
    managed-content.ts
```

Module boleh memakai public DTO/query yang diekspos Article dan Event. Hindari
import repository internal secara acak atau circular dependency.

## 11. Implementation plan Manage Content

Manage Content dikerjakan setelah Event dan Article selesai:

- [x] 1. Finalisasi DTO gabungan Article dan Event.
- [x] 2. Petakan statistik database berdasarkan content type (Article: Comments; Event: Views dan Likes).
- [x] 3. Implementasikan query search, sort, count, dan pagination server-side.
- [x] 4. Buat route Server Component terpisah untuk Article dan Event.
- [x] 5. Implementasikan preview database untuk Article dan Event.
- [x] 6. Implementasikan approve dan reject untuk Request (`PENDING_REVIEW`).
- [x] 7. Implementasikan takedown dan restore (`PUBLISHED` <-> `TAKEN_DOWN`).
- [x] 8. Revalidate landing, category, article detail, agenda, dan event detail sesuai
   target mutation.
- [x] 9. Pindahkan UI dari `src/features/dashboard/ManageContent.tsx` ke module (`src/modules/manage-content/components/manage-content-list.tsx`).
- [x] 10. Hapus `initialContent` setelah query database aktif.
- [x] 11. Jalankan TypeScript, lint, build, dan smoke check seluruh transition.
- [x] 12. Serahkan pemasangan role-based permission kepada module Permission.

### Status implementasi Manage Content

- `/dashboard/content/article` membaca Article non-draft dan
  `/dashboard/content/event` membaca Event non-draft langsung dari PostgreSQL
  melalui DAL server-only `getManagedContent`.
- Query mendukung pencarian case-insensitive berdasarkan judul, deskripsi, serta
  nama author/owner pada tipe aktif.
- Pagination berukuran 25 item per halaman dan independen untuk setiap tipe,
  dengan URL state synchronization (`page`, `q`).
- Sidebar menyediakan submenu Article dan Event; kolom Type di tabel dihapus.
- Kolom Statistik menampilkan Views dan Likes untuk kedua tipe, serta
  `MessageCircle` (Comments) khusus untuk Article.
- Aksi moderasi (`Approve`, `Reject`, `Takedown`, `Restore`) ditangani oleh Server Actions
  terisolasi dengan validasi Zod dan revalidasi rute otomatis.
- Tombol View membuka preview moderasi
  `/dashboard/content/article/[id]` atau `/dashboard/content/event/[id]`.

## 12. Urutan implementasi lintas module

Urutan lengkap yang menjadi acuan project:

```text
1. Event schema dan migration
2. Event seeding
3. Event public pages
4. Event owner dashboard
5. Article schema dan migration
6. Article seeding
7. Article public pages dan landing integration
8. Article owner dashboard
9. Manage Content query per content type
10. Manage Content moderation actions
11. Permission integration pada tahap terpisah
12. Interaction modules pada tahap terpisah
```

Statistik interaksi membaca model canonical tanpa mengubah ownership dan status
workflow content.

## 13. Kriteria selesai

- `/dashboard/content/article` dan `/dashboard/content/event` membaca tipe
  masing-masing dari database.
- Tidak ada table atau seeder Manage Content.
- Search dan pagination berjalan independen pada tiap halaman.
- Preview tidak memakai fallback mock.
- Approve, reject, takedown, dan restore mengikuti status transition.
- Article menampilkan views, likes, dan comments dari database.
- Event menampilkan views dan likes dari database.
- Event tidak mempunyai participants maupun comments.
- Role-based permission belum diimplementasikan dan terdokumentasi sebagai scope
  module Permission.
