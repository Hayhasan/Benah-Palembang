# Auth Module - Future Feature Reference

Module Auth belum diimplementasikan. Dokumen ini menyimpan keputusan awal yang
harus dipakai ketika authentication mulai dikerjakan, khususnya integrasi model
User bersama, password bcryptjs, status account, dan Last Login pada Upstash
Redis.

Schema canonical User berada pada
`docs/module/user-manage.md#database-table`. Auth tidak membuat table identity
User kedua.

## Dependency account

Auth membaca model Prisma `User` yang sama dengan User Manage dan Admin Manage.
Sebelum login berhasil, account harus memenuhi seluruh kondisi berikut:

- `deletedAt = null`.
- `isBanned = false`.
- Email ditemukan setelah normalisasi lowercase.
- Password cocok dengan bcrypt hash pada column `password`.

Role `USER`, `ADMIN`, dan `SUPERADMIN` berasal dari enum `UserRole`. Role dari
request client tidak pernah dipercaya.

## Password dengan bcryptjs

Library `bcryptjs` dan helper password server sudah ditambahkan sebagai bagian
fondasi seeder Account Manage. Login dan session tetap belum diimplementasikan.

Aturan password:

- Column Prisma tetap bernama `password` sesuai keputusan schema.
- Nilai column selalu bcrypt hash, bukan plaintext.
- Create User, Create Admin, register, dan reset password memakai satu helper
  hashing server yang sama.
- Login memakai `bcryptjs.compare()`.
- Salt round didefinisikan pada satu constant server; nilai awal yang disarankan
  adalah 12 dan harus diuji terhadap latency deployment.
- Password dan hash tidak pernah masuk DTO, response action, analytics, atau
  log.
- Konfirmasi password hanya digunakan untuk validasi input dan tidak disimpan.

Struktur helper yang disarankan:

```text
src/modules/auth/
  data/
    password.ts
```

File tersebut mengekspor helper hash serta compare untuk seeder dan future Auth
agar konfigurasi bcryptjs tidak diulang.

Seeder development memakai plaintext input `12345678` untuk menghasilkan hash
seluruh account mock. Nilai plaintext tidak disimpan ke database.

## Last Login dengan Upstash Redis

Kolom Last Login pada User Manage dan Admin Manage tetap difungsikan, tetapi
timestamp tidak disimpan pada PostgreSQL. Auth akan menulis dan membaca Last
Login melalui Upstash Redis.

Environment yang sudah tersedia pada `.env.example`:

```text
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
REDIS_PREFIX=
```

- URL dan token hanya boleh dibaca pada server.
- `REDIS_PREFIX` dipakai untuk namespace agar key antar-environment tidak
  bertabrakan.
- Jangan mengirim credential Upstash ke Client Component.

Format key yang disarankan:

```text
<REDIS_PREFIX>:auth:last-login:<user-uuid>
```

Value cukup berupa timestamp ISO 8601 UTC, misalnya:

```text
2026-08-28T10:15:30.000Z
```

Helper key harus menormalisasi separator agar prefix yang sudah berakhiran `:`
tidak menghasilkan double separator.

### Write flow

Last Login hanya diperbarui setelah email dan password berhasil diverifikasi
serta account dinyatakan aktif.

- Login gagal tidak mengubah Last Login.
- Account banned atau soft-deleted tidak mengubah Last Login.
- Timestamp dibuat di server dalam UTC.
- Kegagalan write metadata Last Login tidak boleh mengubah login valid menjadi
  gagal. Error dicatat secara aman tanpa token atau credential.

### Read flow dashboard

Account list hanya membaca Last Login untuk UUID pada page aktif. Dengan page
size 25, query Redis dilakukan melalui pipeline atau multi-get, bukan 25 request
sequential.

- Result dipetakan berdasarkan UUID ke DTO list account.
- Key tidak ditemukan menghasilkan `lastLoginAt = null`.
- Redis belum dikonfigurasi atau sedang gagal menghasilkan tampilan `-`, bukan
  kegagalan seluruh halaman Account Manage.
- Formatting seperti `2 jam lalu` dilakukan pada mapper/UI, bukan disimpan
  sebagai value Redis.

Detail account membaca satu key Last Login menggunakan helper yang sama.

## Online presence

Label `Online` berbeda dari Last Login. Jika presence dibuat nanti, gunakan key
terpisah dengan TTL, misalnya:

```text
<REDIS_PREFIX>:auth:presence:<user-uuid>
```

Last Login tidak boleh diberi TTL pendek hanya untuk meniru presence. Keputusan
TTL dan heartbeat presence dibuat saat session Auth diimplementasikan.

## Dampak ban dan soft delete

Setelah session tersedia, action berikut perlu berintegrasi dengan Auth:

- Ban mencabut session aktif dan menghapus presence key.
- Soft delete mencabut session aktif serta menghapus presence key.
- Unban tidak otomatis membuat session baru.
- Perubahan role memperbarui atau mencabut session jika role disimpan di dalam
  payload session.

Last Login boleh tetap dipertahankan sebagai metadata audit ringan setelah ban
atau soft delete. Kebijakan expiry dapat ditentukan kemudian.

## Reset password

Tombol reset password pada detail Account Manage belum aktif pada tahap ini.
Future Auth harus menyediakan:

- Token random yang tidak dapat ditebak.
- Penyimpanan hash token, bukan raw token.
- Expiry.
- Single use.
- Rate limit.
- Pengiriman email tanpa pernah mengirim password plaintext.
- Invalidasi session setelah password berhasil diganti.

Table atau key reset password ditentukan saat flow Auth dipilih. Jangan
menambahkan field token reset langsung ke table `users` tanpa rancangan
lifecycle yang jelas.

## Struktur future module

Struktur awal yang disarankan:

```text
src/modules/auth/
  actions/
  components/
  data/
    password.ts
    redis.ts
    last-login.ts
  schemas/
  types/
```

`redis.ts` menginisialisasi Upstash client satu kali pada server.
`last-login.ts` memiliki helper write, single read, dan batch read agar Account
Manage tidak mengetahui detail key Redis.

## Status implementasi

Status implementasi saat ini:

- Belum ada login backend.
- Belum ada session server.
- Belum ada permission.
- Dependency `bcryptjs` dan helper hash/compare sudah tersedia.
- Seeder Account Manage sudah memakai bcryptjs untuk password development.
- Belum ada Upstash client pada source.
- Belum ada write/read Last Login.

Account Manage saat ini hanya menyiapkan schema dan UI boundary agar integrasi
Auth dapat ditambahkan tanpa mengubah table User atau menduplikasi logic.
