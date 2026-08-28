# Admin Manage Module

Admin Manage mengelola account dengan role `ADMIN` dan `SUPERADMIN`. Module ini
tidak mempunyai table atau implementation backend terpisah dari User Manage.
Keduanya memakai model Prisma `User`, table `users`, dan shared module
`src/modules/account-manage`.

Schema canonical account dijelaskan pada
`docs/module/user-manage.md#database-table`.

## Route

Route canonical Admin Manage:

```text
/dashboard/account/admin
/dashboard/account/admin/[id]
```

Route tersebut dihasilkan oleh struktur dinamis bersama:

```text
src/app/dashboard/account/[role]/page.tsx
src/app/dashboard/account/[role]/[id]/page.tsx
```

Untuk `[role] = admin`, query memakai filter:

```text
role IN (ADMIN, SUPERADMIN)
deletedAt = null
```

Nilai `[id]` adalah UUID lengkap. Prefix `ADM-*` tidak lagi dibuat atau dipakai
untuk menentukan role.

## Scope awal

- Menampilkan account `ADMIN` dan `SUPERADMIN` pada satu list.
- Search berdasarkan UUID, nama, atau email.
- Pagination server-side 25 item per halaman.
- Membuat account admin.
- Melihat detail account dalam mode read-only.
- Mengubah role `ADMIN` menjadi `USER`.
- Melakukan ban dan unban.
- Melakukan soft delete dengan confirmation dialog.
- Mempertahankan kolom Last Login untuk future Auth dan Upstash Redis.

## Perbedaan dari User Manage

Seluruh table, mapper, pagination, confirmation dialog, dan action dasar dipakai
bersama. Perbedaan hanya berada pada konfigurasi berikut:

| Aspek | User Manage | Admin Manage |
| --- | --- | --- |
| Route role | `user` | `admin` |
| Filter list | `USER` | `ADMIN`, `SUPERADMIN` |
| Create default | `USER` | `ADMIN` atau `SUPERADMIN` |
| Change role | `USER -> ADMIN` | `ADMIN -> USER` |
| SuperAdmin toggle | Tidak tersedia | Tidak tersedia |

## Revisi UI list

Aksi per row untuk account `ADMIN` sama dengan User:

- View.
- Ban atau Unban.
- Delete.

Account `SUPERADMIN` hanya mempunyai aksi View. Tombol Ban, Unban, dan Delete
tidak ditampilkan. Server action juga wajib menolak mutation tersebut meskipun
dipanggil secara langsung dari luar UI.

Aksi Edit dihapus. Delete memakai confirmation dialog dengan informasi nama,
UUID, dan dampak bahwa account tidak lagi dapat ditemukan pada list/detail.
Operation tetap soft delete melalui `deletedAt`.

Table tetap menampilkan:

- UUID.
- Profile dan nama.
- Email.
- Role dan status ban.
- Date Created.
- Last Login.

Last Login belum diimplementasikan pada tahap Account Manage. Kolom sementara
menampilkan `-`, kemudian future Auth akan membaca data secara batch dari
Upstash Redis.

## Create admin

Dialog Create Admin tetap dapat menyediakan pilihan:

- `ADMIN`.
- `SUPERADMIN`.

Input nama, email, password, dan konfirmasi password memakai action
`create-account.ts` yang sama dengan User Manage. Route configuration menentukan
role yang diizinkan. Password di-hash menggunakan `bcryptjs` dan hasil hash
disimpan pada column `users.password`.

Nilai role divalidasi ulang di server. Label atau hidden input dari client tidak
boleh langsung dipercaya.

## Detail admin

Detail `/dashboard/account/admin/[id]` selalu read-only dan tidak mempunyai
halaman edit. Query `?mode=view` lama tidak diperlukan.

Aturan tombol Ubah Role:

- Account `ADMIN` dapat diubah menjadi `USER`.
- Account `SUPERADMIN` tidak dapat diubah melalui tombol ini.
- Pilihan target `SUPERADMIN` tidak pernah ditampilkan pada toggle role.

Setelah `ADMIN -> USER` berhasil, account hilang dari list Admin dan berpindah
ke `/dashboard/account/user`. Detail lama pada route Admin tidak lagi valid
karena role account sudah tidak sesuai dengan filter route.

## Ban, delete, dan relasi content

- Ban mengubah `isBanned` dan `bannedAt`, tanpa mengubah role.
- Delete mengisi `deletedAt` dan melepaskan unique email sesuai strategi pada
  User Manage.
- Account `SUPERADMIN` tidak dapat di-ban, di-unban, maupun di-delete.
- Ban atau delete tidak menghapus Article, Event, Comment, maupun log activity
  yang mereference UUID account.
- Future Auth bertanggung jawab menolak login account banned/deleted dan
  mencabut session aktif.

## Pagination

Admin Manage memakai query `getManagedAccounts` yang sama dengan User Manage.
Filter role diterapkan sebelum count dan pagination. Default page size adalah
25 dan state search/page disimpan pada URL.

Jika perubahan role atau delete mengosongkan halaman aktif, UI mengambil ulang
hasil dan pindah ke page terakhir yang masih valid. Tidak ada pagination khusus
Admin yang diduplikasi.

## Seed

Admin memakai seeder bersama:

```text
npm run seed:account-manage
```

Seeder membuat sample role `ADMIN` dan `SUPERADMIN` bersama sample `USER`,
memakai table `users`, UUID, dan bcryptjs hash yang sama. Tidak dibuat
`admin-manage.seeder.ts` terpisah karena akan menduplikasi lifecycle account.

Account development utama memakai `admin@example.com` dan
`super@example.com`. Keduanya memakai password seed `12345678`, tetapi database
hanya menyimpan hasil bcryptjs hash.

## Batasan permission saat ini

Permission untuk membuat SuperAdmin, ban Admin, atau delete account belum
ditentukan karena module Auth belum tersedia. Dokumen ini hanya menentukan data
dan behavior UI.

Saat permission diimplementasikan, aturan sensitif wajib divalidasi di Server
Action shared Account Manage, bukan hanya dengan menyembunyikan tombol pada UI.

## Validasi implementasi

Smoke check Admin mencakup filter gabungan `ADMIN` dan `SUPERADMIN`, create kedua
role, search, pagination, view, ban, unban, delete, `ADMIN -> USER`, larangan
toggle SuperAdmin, serta UUID atau route role yang tidak valid.
