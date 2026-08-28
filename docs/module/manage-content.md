# Manage Content Module

Manage Content adalah module dashboard untuk melihat dan memoderasi Article dan
Event dalam satu halaman. Module ini tidak memiliki business table atau content
record sendiri. Seluruh data tetap dimiliki module Article dan Event.

Manage Content dikerjakan terakhir setelah implementasi awal Event dan Article
selesai.

## 1. Scope awal

- Menampilkan Article dan Event dalam satu daftar pada `/dashboard/content`.
- Search berdasarkan title, owner/author, dan content type.
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
- Sistem likes, views, comments, atau participants.
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
```

Daftar moderation secara default tidak perlu menampilkan `DRAFT` karena draft
belum diajukan oleh owner. Status yang ditampilkan:

- `PENDING_REVIEW` sebagai Request.
- `PUBLISHED` sebagai Posted.
- `REJECTED` sebagai Rejected.
- `TAKEN_DOWN` sebagai Takedown.

Manage Content tidak menyimpan copy title, owner, banner, status, atau tanggal.
Semua field dibaca langsung dari record pemilik domain.

## 4. Statistik UI sementara

Sistem interaksi dikerjakan setelah implementasi awal content selesai. Statistik
tetap hardcoded atau berasal dari helper mock presentasional.

Statistik per type:

| Content type | Statistik yang ditampilkan |
| --- | --- |
| Article | Views, Likes, Comments |
| Event | Views, Likes, Participants |

Aturan penting:

- Article tidak menampilkan participants.
- Event tidak menampilkan comments.
- Statistik tidak menjadi filter atau sumber keputusan moderation.
- Statistik tidak disimpan ke Article atau Event pada tahap awal.
- Record baru yang tidak mempunyai entry mock dapat menampilkan nilai awal `0`.
- Helper mock dapat menggunakan key `type + id` atau slug agar hasil stabil pada
  setiap render.

UI kolom Statistik menyesuaikan icon ketiga berdasarkan content type:

```text
Article -> MessageCircle
Event   -> Users
```

## 5. DTO gabungan

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

ID Article dan Event dapat mempunyai angka yang sama. Identitas row dan payload
mutation selalu memakai pasangan `type + id`, bukan ID saja.

## 6. Query list

Route `/dashboard/content` tetap tipis dan membaca initial data melalui data
function server-only.

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
- Search title dan nama owner secara case-insensitive.
- Search dapat menerima label `article` atau `event`.
- Urutan default `submittedAt desc`, kemudian `updatedAt desc`.
- Search dan pagination disimpan pada URL.
- DTO harus serializable dan tidak mengirim object Prisma mentah.

Karena Article dan Event berada pada table berbeda, implementasi query dapat
memakai salah satu pendekatan berikut:

1. SQL `UNION ALL` terparameterisasi untuk count dan pagination global.
2. Query summary dari kedua model lalu merge dan slice pada server untuk dataset
   awal yang masih terbatas.

Pendekatan pertama diprioritaskan jika implementasinya tetap jelas dan aman.
Prisma raw query tidak boleh membangun SQL dari string input client.

## 7. Preview

Preview memakai route yang sudah dipisahkan berdasarkan domain:

```text
/dashboard/article/preview/[id]
/dashboard/event/preview/[id]
```

Aturan preview:

- Query protected membaca content berdasarkan `type` route masing-masing.
- Preview dapat menampilkan status non-public seperti Request atau Rejected.
- Record soft-deleted menghasilkan `notFound()`.
- Public preview component menggunakan DTO yang sama dengan public page selama
  memungkinkan agar tampilan tidak berbeda.
- Preview tidak memakai fallback mock record pertama.

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
Manage Content dibangun dari query gabungan.

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
  constants/
    mock-content-statistics.ts
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

1. Finalisasi DTO gabungan Article dan Event.
2. Buat helper statistik hardcoded berdasarkan content type.
3. Implementasikan query search, sort, count, dan pagination server-side.
4. Ubah `/dashboard/content` menjadi route Server Component tipis.
5. Implementasikan preview database untuk Article dan Event.
6. Implementasikan approve dan reject untuk Request.
7. Implementasikan takedown dan restore.
8. Revalidate landing, category, article detail, agenda, dan event detail sesuai
   target mutation.
9. Pindahkan UI dari `src/features/dashboard/ManageContent.tsx` ke module.
10. Hapus `initialContent` setelah query database aktif.
11. Jalankan TypeScript, lint, build, dan smoke check seluruh transition.
12. Serahkan pemasangan role-based permission kepada module Permission.

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
9. Manage Content combined query
10. Manage Content moderation actions
11. Permission integration pada tahap terpisah
12. Interaction modules pada tahap terpisah
```

Interaction modules setelah implementasi awal akan mengganti statistik
hardcoded secara bertahap tanpa mengubah ownership dan status workflow.

## 13. Kriteria selesai

- `/dashboard/content` membaca Article dan Event dari database.
- Tidak ada table atau seeder Manage Content.
- Search dan pagination berjalan dengan pasangan identity `type + id`.
- Preview tidak memakai fallback mock.
- Approve, reject, takedown, dan restore mengikuti status transition.
- Article menampilkan views, likes, comments secara hardcoded.
- Event menampilkan views, likes, participants secara hardcoded.
- Article tidak mempunyai participants dan Event tidak mempunyai comments.
- Role-based permission belum diimplementasikan dan terdokumentasi sebagai scope
  module Permission.
