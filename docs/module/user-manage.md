# User Manage Module

Module ini mengelola akun reguler dengan role `USER` dari dashboard. User
Manage dan Admin Manage memakai table, query dasar, mutation, serta komponen
yang sama. Perbedaannya hanya filter role dan konfigurasi tampilan route.

Route canonical yang direncanakan:

```text
/dashboard/account/[role]
/dashboard/account/[role]/[id]
```

Nilai `[role]` yang valid hanya `user` dan `admin`. Nilai `[id]` selalu UUID
User dari database, bukan code seperti `USR-001` atau `ADM-001`.

## Scope awal

- Menampilkan daftar akun dengan role `USER`.
- Pencarian berdasarkan UUID, nama, atau email.
- Pagination server-side sebanyak 25 item per halaman.
- Membuat akun user baru.
- Melihat detail user dalam mode read-only.
- Mengubah role dari `USER` menjadi `ADMIN`.
- Melakukan ban dan unban akun.
- Melakukan soft delete melalui confirmation dialog.
- Mempertahankan kolom Last Login sebagai future integration module Auth.
- Menampilkan artikel milik user setelah module Article tersedia.

Halaman edit user tidak termasuk scope. Data profil ditampilkan pada detail,
tetapi perubahan profil nantinya menjadi tanggung jawab halaman Profile atau
flow khusus lain.

## Shared account management

User reguler, admin, dan superadmin menggunakan satu model Prisma `User` dan
satu table database `users`. Jangan membuat table `admins` atau
`superadmins`.

Mapping route terhadap role database:

| Route role | Filter Prisma |
| --- | --- |
| `user` | `role = USER` |
| `admin` | `role IN (ADMIN, SUPERADMIN)` |

Implementasi bersama sebaiknya dimiliki module `account-manage`, bukan membuat
logic User dan Admin secara terpisah. Dokumen `user-manage.md` dan
`admin-manage.md` tetap dipisahkan untuk menjelaskan perbedaan use case dan UI.

## Hasil analisis frontend

### Daftar account

Frontend saat ini mempunyai dua komponen terpisah, `ManageUser` dan
`ManageAdmin`, tetapi struktur dan logic keduanya hampir sama:

- Search.
- Pagination 25 item.
- Create account.
- Table ID, profile, email, role/status, created date, dan Last Login.
- View account.
- Ban atau unban.
- Edit account.

Revisi yang harus diterapkan:

- Komponen list dibuat satu dan menerima konfigurasi berdasarkan `[role]`.
- Aksi Edit dihapus.
- Aksi per row menjadi View, Ban/Unban, dan Delete.
- Delete memakai confirmation dialog seperti aksi ban.
- ID table dan URL detail memakai UUID asli.
- Tidak ada lagi keputusan role berdasarkan prefix ID.

Mock data tidak boleh dipindahkan ke seeder tanpa normalisasi. Mock User saat
ini mempunyai email `mega.utami@gmail.com` pada lebih dari satu record,
sedangkan email pada table `users` harus unique.

### Detail account

Detail account juga dibuat satu untuk route `/dashboard/account/[role]/[id]`.
Halaman selalu read-only dan tidak mempunyai mode edit.

Query `?mode=view` dari frontend lama tidak lagi diperlukan. Selama masa
transisi query tersebut boleh diabaikan, tetapi URL canonical cukup memakai
route detail tanpa query mode.

Detail menampilkan data berikut:

- UUID.
- Nama lengkap.
- Email.
- Role.
- Avatar dan banner.
- Bio.
- Nomor WhatsApp.
- URL Instagram, X/Twitter, dan LinkedIn.
- Status ban.
- Tanggal dibuat dan diperbarui.
- Last Login jika integrasi Auth dan Redis sudah tersedia.
- Galeri artikel beserta view dan like setelah module Article tersedia.

Tombol `Ubah Role` pada detail hanya mendukung transisi berikut:

```text
USER -> ADMIN
ADMIN -> USER
```

`SUPERADMIN` tidak tersedia sebagai pilihan pada aksi Ubah Role. Jika account
yang sedang dilihat mempunyai role `SUPERADMIN`, tombol Ubah Role disembunyikan
atau disabled. Pembuatan atau pengelolaan khusus superadmin dibahas pada Admin
Manage, bukan melalui toggle role ini.

## Database table

Schema berikut menjadi schema bersama untuk User Manage, Admin Manage, Profile,
dan future Auth:

```prisma
enum UserRole {
  USER
  ADMIN
  SUPERADMIN
}

model User {
  id                      String    @id @default(uuid()) @db.Uuid
  name                    String    @db.VarChar(160)
  email                   String    @unique @db.VarChar(255)
  originalEmail           String?   @db.VarChar(255)
  password                String    @db.Text
  role                    UserRole  @default(USER)
  avatarUrl               String?   @db.Text
  bannerUrl               String?   @db.Text
  bio                     String?   @db.Text
  whatsappCountryCode     String?   @db.VarChar(8)
  whatsappNumber          String?   @db.VarChar(32)
  instagramUrl            String?   @db.Text
  xUrl                    String?   @db.Text
  linkedinUrl             String?   @db.Text
  isBanned                Boolean   @default(false)
  bannedAt                DateTime? @db.Timestamptz(6)
  createdAt               DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt               DateTime  @updatedAt @db.Timestamptz(6)
  deletedAt               DateTime? @db.Timestamptz(6)

  @@index([role, deletedAt, createdAt])
  @@index([isBanned, deletedAt])
  @@map("users")
}
```

### Keputusan schema

- `id` memakai UUID dan menjadi satu-satunya identifier account. UI boleh
  memotong UUID secara visual, tetapi value lengkap tetap tersedia dan URL
  detail memakai UUID lengkap.
- `role` menjadi satu-satunya pembeda User, Admin, dan SuperAdmin.
- Hanya enum `UserRole` yang diperlukan untuk pembagian jenis account. Status
  ban cukup memakai `isBanned` dan `bannedAt`.
- Kolom `password` menyimpan hasil hash `bcryptjs`, bukan password plaintext.
- `password` tidak pernah dipilih pada query list/detail dan tidak pernah masuk
  ke DTO Client Component.
- Field profil tetap berada pada `users` karena mengikuti lifecycle identity
  yang sama. Halaman Account Manage hanya membaca field tersebut.
- Nomor WhatsApp dipisahkan menjadi `whatsappCountryCode` dan
  `whatsappNumber` agar sesuai dengan UI country selector. Country code
  menyimpan `62`, sedangkan nomor hanya menyimpan bagian lokal seperti
  `8123456789`.
- `deletedAt` menandai soft delete. Semua query normal wajib memakai
  `deletedAt = null`.
- `lastLoginAt` tidak dibuat pada PostgreSQL karena Last Login akan disimpan di
  Upstash Redis oleh module Auth.

Foreign key dari Article, Event, Comment, atau business table lain ke User harus
bertipe `String @db.Uuid` agar sesuai dengan primary key User.

## Normalisasi data

- Email di-trim dan diubah ke lowercase sebelum validasi unique.
- Nama di-trim dan divalidasi dengan Zod.
- `whatsappCountryCode` menyimpan digit kode negara tanpa tanda `+`, misalnya
  `62`.
- `whatsappNumber` tidak mengulang country code, misalnya `8123456789`.
- URL social harus berupa URL `https` atau `null`.
- Enum Prisma memakai uppercase dan mapper mengubahnya menjadi label UI.
- DateTime diberikan ke Client Component melalui DTO serializable.
- Password dan hash password tidak pernah dicetak pada log.

## Route dan rendering

### List route

File route yang disarankan:

```text
src/app/dashboard/account/[role]/page.tsx
```

Pada Next.js 16, `params` dan `searchParams` merupakan Promise. Route melakukan
langkah berikut:

1. `await params` dan validasi `[role]` sebagai `user` atau `admin`.
2. `await searchParams` untuk membaca `q` dan `page`.
3. Memanggil query bersama `getManagedAccounts` dengan filter role.
4. Memberikan DTO serializable ke Client Component.
5. Memanggil `notFound()` untuk role yang tidak valid.

### Detail route

File route yang disarankan:

```text
src/app/dashboard/account/[role]/[id]/page.tsx
```

Route memvalidasi format UUID dan memastikan account yang ditemukan termasuk
dalam kelompok route:

- Route `user` hanya menerima account `USER`.
- Route `admin` hanya menerima account `ADMIN` atau `SUPERADMIN`.
- UUID invalid, account soft-deleted, atau role tidak sesuai menghasilkan
  `notFound()`.

Data awal dibaca pada Server Component. Detail interaktif seperti confirmation
dan tombol perubahan role tetap berada pada Client Component.

## Pagination dan search

Pagination harus dilakukan di database, bukan memuat seluruh user ke browser.

Aturan query:

- Default `pageSize` adalah 25.
- `page` minimal 1.
- Filter `deletedAt = null` selalu diterapkan.
- Route `user` menambahkan filter `role = USER`.
- Search mencocokkan UUID, nama, atau email.
- Nama dan email dicari secara case-insensitive.
- Urutan default `createdAt desc`, lalu `id desc`.
- Count dan list memakai filter yang sama.
- Hasil mengembalikan `items`, `page`, `pageSize`, `totalItems`, dan
  `totalPages`.

Jika delete atau perubahan role membuat halaman aktif kosong, route harus
mengambil ulang data dan mengarahkan pagination ke halaman terakhir yang masih
valid. Search dan page disimpan pada URL supaya refresh serta tombol Back tidak
menghilangkan state.

Kolom Last Login tetap dirender. Sampai Auth dan Redis tersedia, nilainya
ditampilkan sebagai `-` atau state unavailable. Setelah tersedia, hanya 25 UUID
pada halaman aktif yang dibaca secara batch dari Redis.

## Mutation dashboard

### Create user

Input mengikuti dialog Create User:

- Nama lengkap.
- Email.
- Password.
- Konfirmasi password untuk validasi form.

Action create User selalu memaksa `role = USER`. Password di-hash pada server
dengan `bcryptjs` sebelum disimpan ke kolom `password`. Konfirmasi password
tidak disimpan.

### Ban dan unban

- Ban mengubah `isBanned = true` dan mengisi `bannedAt`.
- Unban mengubah `isBanned = false` dan mengosongkan `bannedAt`.
- Action bersifat idempotent.
- Ban tidak mengubah role dan tidak melakukan soft delete.
- Article atau content milik account tidak dihapus.

Future Auth harus menolak login account banned dan mencabut session aktif jika
mekanisme session sudah tersedia.

### Change role

Action menerima UUID dan target role, tetapi schema validasi hanya mengizinkan:

- Account `USER` dengan target `ADMIN`.
- Account `ADMIN` dengan target `USER`.

Action menolak target `SUPERADMIN`, menolak perubahan account `SUPERADMIN`, dan
tidak mempercayai route role atau label dari client sebagai state database.
Setelah berhasil, account berpindah ke list route yang sesuai dengan role baru.

### Delete account

Delete dari dashboard selalu soft delete dan wajib memakai confirmation dialog.

Dalam satu transaction:

- Simpan email aktif ke `originalEmail` jika belum tersedia.
- Ganti `email` dengan alamat anonymized valid dan unique, misalnya
  `<uuid>@deleted.invalid`.
- Isi `deletedAt` dengan timestamp saat ini.

Password hash, relasi Article, dan data audit tidak di-hard-delete. Setelah
delete, row tidak lagi muncul pada list/detail karena seluruh query memakai
`deletedAt = null`.

Restore belum mempunyai UI. Jika dibuat nanti, restore harus memastikan
`originalEmail` belum dipakai account aktif lain sebelum mengembalikan email.

### Reset password

Tombol reset password pada detail hanya menjadi future integration. Token,
expiry, rate limit, dan pengiriman email dimiliki module Auth. Account Manage
tidak membuat atau mengirim password baru secara langsung.

## Data turunan lintas module

- Last Login disimpan di Upstash Redis oleh future Auth, bukan pada table
  `users`.
- Status `Online` nantinya berasal dari presence/session dengan TTL, bukan dari
  string database.
- Galeri artikel berasal dari relasi author milik module Article.
- View dan like artikel juga dihitung oleh module Article.
- Avatar dan banner disimpan sebagai URL permanen Cloudinary. Browser `blob:`
  URL tidak boleh masuk database.

## Struktur implementation bersama

```text
src/modules/account-manage/
  actions/
    create-account.ts
    change-account-role.ts
    set-account-ban-status.ts
    soft-delete-account.ts
  components/
    account-detail.tsx
    account-list.tsx
    account-table.tsx
    create-account-dialog.tsx
  constants/
    account-route-role.ts
  data/
    get-managed-account.ts
    get-managed-accounts.ts
    account-manage.mapper.ts
  schemas/
    account-list-query.schema.ts
    change-account-role.schema.ts
    create-account.schema.ts
  types/
    managed-account.ts
    managed-account-list.ts
```

`account-list.tsx` dan `account-detail.tsx` menerima route role sebagai
konfigurasi. Prisma, bcryptjs, dan mutation tetap berada pada server boundary.

## Seed

Karena User dan Admin memakai table serta implementation yang sama, seeder juga
dibuat satu:

```text
npm run seed:account-manage
```

Seeder `prisma/seeders/account-manage.seeder.ts` membuat seluruh sample `USER`,
`ADMIN`, dan `SUPERADMIN` dari mock dashboard. Seeder create-if-missing
berdasarkan email, memakai UUID database, meng-hash password dengan helper
`bcryptjs` yang sama, dan tidak menimpa account yang sudah ada.

Seluruh account seed memakai password development `12345678`. Tiga account
utama untuk login development adalah:

| Role | Email |
| --- | --- |
| `USER` | `user@example.com` |
| `ADMIN` | `admin@example.com` |
| `SUPERADMIN` | `super@example.com` |

Password plaintext tersebut hanya menjadi input seeder development. Database
tetap menerima bcrypt hash dan seeder production tetap mengikuti guard
`ALLOW_PRODUCTION_SEED`.

Dataset mock wajib dibersihkan dari email duplicate. Seeder aman dijalankan
ulang dan tidak melakukan `deleteMany` atau reset data.

## Batasan auth saat ini

Auth dan permission belum diimplementasikan. Role pada tahap ini merupakan data
domain, bukan security boundary. Referensi future Auth, password bcryptjs, dan
Last Login Upstash dijelaskan pada `docs/module/auth.md`.

Saat Auth tersedia, seluruh Server Action Account Manage harus memvalidasi
session dan permission di server. Role atau identity pelaku dari client tidak
boleh dipercaya.

## Validasi implementasi

```text
npx prisma format
npx prisma validate
npm run seed:account-manage
npx tsc --noEmit
npm run lint
npm run build
```

Smoke check minimal mencakup route `user` dan `admin`, invalid route role,
search, pagination lebih dari satu halaman, create, view, ban, unban, perubahan
role dua arah, soft delete, confirmation dialog, UUID invalid, dan state Last
Login sebelum Redis tersedia.
