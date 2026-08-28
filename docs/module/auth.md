# Auth Module

Dokumen ini menjadi implementation plan untuk authentication berbasis email dan
password, server-side session, activity tracking, serta authorization boundary
dashboard. Implementasi awal hanya mencakup login, register yang langsung
membuat session, logout, session server/client, dan integrasi Last Activity.

Aturan penggunaan Auth oleh module lain berada pada
`docs/rules/auth-rules.md`.

Project tidak mempunyai OAuth, mobile client, atau public API yang membutuhkan
access token. Karena itu, implementasi awal tidak memakai Auth.js/NextAuth dan
tidak membuat pasangan access token serta refresh token.

Session memakai opaque random token pada cookie `HttpOnly`, sedangkan state
session disimpan di Upstash Redis. Pendekatan ini dipilih agar ban, soft delete,
perubahan role, dan perubahan password dapat mencabut seluruh session secara
langsung tanpa menunggu JWT kedaluwarsa.

Schema canonical account tetap model Prisma `User` pada
`docs/module/user-manage.md#database-table`. Auth tidak membuat table User atau
table session PostgreSQL kedua.

## Scope implementasi awal

- Login menggunakan email dan password.
- Register account `USER` dan langsung login.
- Logout current session.
- Lupa password melalui email dan reset token satu kali pakai.
- Opaque server-side session pada Upstash Redis.
- Cookie session aman yang hanya dibuat dan dihapus pada server.
- Session guard untuk Server Component, data access, Server Action, dan Route
  Handler.
- Session DTO dan hook client untuk kebutuhan UI.
- Proteksi seluruh route `/dashboard` untuk user yang belum login.
- Integrasi ban, soft delete, dan perubahan role dengan session revocation.
- Last Login, Last Activity, dan Online Presence pada Redis.
- Rate limit dasar untuk login, register, dan lupa password.

Di luar scope awal:

- OAuth atau social login.
- Access token dan refresh token untuk external client.
- Multi-factor authentication.
- Daftar perangkat atau UI logout seluruh perangkat.
- Permission granular di luar role `USER`, `ADMIN`, dan `SUPERADMIN`.

## Keputusan session

### Opaque session

Session token dibuat menggunakan cryptographically secure random bytes. Raw
token hanya berada pada cookie browser. Redis hanya menyimpan SHA-256 hash dari
token sehingga raw token tidak tersimpan pada database, Redis, log, atau DTO.

Session awal memakai absolute expiry 14 hari. Scope awal tidak memakai sliding
expiry agar lifecycle lebih sederhana dan dapat diprediksi. Fitur Remember Me
atau idle expiry dapat ditambahkan setelah flow awal stabil.

Cookie production menggunakan konfigurasi berikut:

- `HttpOnly = true`.
- `Secure = true`.
- `SameSite = lax`.
- `Path = /`.
- Tidak memakai `Domain`, sehingga cookie tetap host-only.
- `Max-Age` sama dengan TTL session Redis.
- Nama production memakai prefix `__Host-` jika environment HTTPS memenuhi
  seluruh persyaratannya.

Cookie tidak pernah dibaca melalui JavaScript client. API `cookies()` Next.js
bersifat async dan perubahan cookie hanya dilakukan melalui Server Action atau
Route Handler sebelum response streaming dimulai.

### Redis session keys

Environment yang sudah tersedia:

```text
UPSTASH_REDIS_REST_URL=
UPSTASH_REDIS_REST_TOKEN=
REDIS_PREFIX=
```

Dependency yang digunakan adalah `@upstash/redis` karena REST client sesuai
dengan lifecycle Vercel serverless dan tidak membutuhkan persistent connection.

Format key:

```text
<REDIS_PREFIX>:auth:session:<sha256-token>
<REDIS_PREFIX>:auth:user-version:<user-uuid>
```

Session value minimal:

```text
userId
role
version
createdAt
expiresAt
```

Password, email, nomor WhatsApp, dan data profil lain tidak disimpan dalam
session. UI memperoleh data user melalui safe DTO tersendiri.

`user-version` merupakan integer tanpa TTL selama account masih ada. Session
menyimpan version saat session dibuat. Session hanya valid jika version pada
session sama dengan current user version di Redis.

Version dinaikkan ketika:

- Account di-ban.
- Account di-soft-delete.
- Role berubah.
- Password berhasil diubah atau di-reset.
- Seluruh session account perlu dicabut secara administratif.

Dengan version tersebut, seluruh session lama langsung tidak valid. Tidak perlu
menyimpan index semua session milik user. Key session lama dibiarkan kedaluwarsa
berdasarkan TTL dan tidak lagi dapat digunakan karena version berbeda.

Redis session lookup dan user-version lookup dilakukan melalui satu pipeline.
Hasil verifikasi dideduplikasi untuk satu render/request menggunakan React
`cache()` agar layout, page, dan data query tidak mengulang request Redis yang
sama.

### Session failure policy

Session dianggap tidak valid jika salah satu kondisi berikut terpenuhi:

- Cookie tidak ada.
- Format token tidak valid.
- Session key tidak ditemukan atau expired.
- User version tidak ditemukan.
- Session version tidak sama dengan current version.
- Payload session tidak lolos schema validation.

Redis yang gagal diakses bersifat fail-closed untuk authentication. Dashboard
dan mutation sensitif tidak boleh dianggap authenticated ketika session tidak
dapat diverifikasi.

## Dependency account

Login dan register memakai model Prisma `User` yang sama dengan User Manage dan
Admin Manage.

Account dapat membuat session hanya jika:

- Password cocok dengan bcrypt hash pada column `password`.
- `isBanned = false`.
- `deletedAt = null`.
- Role database merupakan `USER`, `ADMIN`, atau `SUPERADMIN`.

Role, UUID, status ban, dan session version tidak pernah dipercaya dari input
client. Seluruhnya dibaca dari database atau Redis server-side.

## Normalisasi email

Semua flow yang menerima email wajib menjalankan:

```text
trim
lowercase
validasi format email
max 255 karakter
```

Normalisasi dilakukan pada client untuk UX dan diulang pada server sebagai
canonical validation. Nilai email yang ditulis ke database selalu lowercase.

Constraint `users.email` saat ini berupa unique `VARCHAR`, sehingga konsistensi
lowercase wajib diterapkan pada Register, Create User, Create Admin, login,
restore account, dan future update email. Database-level case-insensitive unique
melalui `citext` atau index `lower(email)` dapat dipertimbangkan terpisah.

## Password dengan bcryptjs

Helper pada `src/modules/auth/data/password.ts` tetap menjadi satu-satunya
tempat konfigurasi bcryptjs.

- Password disimpan sebagai bcrypt hash.
- Salt rounds tetap 12 dan harus diverifikasi terhadap latency Vercel.
- Register, Create User, Create Admin, dan reset password memakai helper hash
  yang sama.
- Login memakai helper compare yang sama.
- Password maksimal 72 karakter mengikuti batas input bcrypt.
- Password dan hash tidak pernah masuk DTO, response action, analytics, atau
  log.
- Konfirmasi password hanya untuk validasi dan tidak disimpan.

### Dummy bcrypt compare

Login selalu menjalankan satu bcrypt compare, termasuk ketika email tidak
ditemukan. Jika tidak ada candidate account, password dibandingkan dengan satu
dummy bcrypt hash yang dibuat sebelumnya menggunakan cost yang sama.

Dummy hash tidak dibuat ulang pada setiap request. Tujuannya mengurangi
perbedaan waktu antara email terdaftar dan email tidak terdaftar sehingga user
enumeration melalui timing menjadi lebih sulit.

## Login

Route tetap berada pada:

```text
src/app/(auth)/login/page.tsx
```

Page route tetap tipis. Form dan state action dimiliki module Auth. Submit login
menggunakan Server Action dan `useActionState`; client validation hanya menjadi
UX, sedangkan server schema tetap canonical.

### Validasi login

- Email wajib, trim, lowercase, format valid, maksimal 255 karakter.
- Password wajib dan maksimal 72 karakter.
- Input tidak boleh menerima UUID atau role dari client.
- Login yang sedang pending menonaktifkan submit untuk mencegah duplicate
  request.

Password login tidak perlu mengulang seluruh complexity rule Register. Login
hanya memverifikasi credential yang sudah tersimpan.

### Urutan login

1. Validasi dan normalisasi input.
2. Terapkan rate limit berdasarkan kombinasi IP dan normalized email.
3. Cari current account menggunakan `users.email` tanpa memfilter status ban.
4. Jika current account tidak ada, cari soft-deleted account memakai
   `originalEmail` untuk menentukan pesan hanya setelah password benar.
5. Jalankan bcrypt compare terhadap candidate hash atau dummy hash.
6. Jika candidate tidak ada atau password salah, kembalikan credential error.
7. Setelah password benar, evaluasi `isBanned` dan `deletedAt`.
8. Buat random session token dan Redis session.
9. Set cookie session melalui Server Action.
10. Tulis Last Login, Last Activity, dan Presence.
11. Redirect seluruh role ke `/dashboard`.

Jika email sudah dipakai kembali oleh account aktif setelah account lama
di-soft-delete, current active email selalu mempunyai prioritas. Password milik
account lama tidak boleh membuka informasi status account lama.

### Pesan login

Pesan dibuat jelas tanpa membuka status account ketika credential belum benar:

| Kondisi | Pesan |
| --- | --- |
| Email tidak ditemukan | `Email atau password salah.` |
| Password salah | `Email atau password salah.` |
| Email milik account banned, password salah | `Email atau password salah.` |
| Email milik account deleted, password salah | `Email atau password salah.` |
| Password benar dan account banned | `Akun Anda telah diblokir. Hubungi administrator.` |
| Password benar dan account deleted | `Akun Anda sudah dihapus dan tidak dapat digunakan.` |
| Rate limit tercapai | `Terlalu banyak percobaan login. Coba lagi beberapa saat.` |
| Redis/database gagal | `Login belum dapat diproses. Silakan coba lagi.` |

Status banned atau deleted hanya boleh dijelaskan setelah password account
tersebut benar. Partial credential yang salah selalu menghasilkan pesan
credential generik.

Login gagal, banned, dan deleted tidak menulis Last Login, Last Activity, atau
Presence.

## Register dan langsung login

Route tetap berada pada:

```text
src/app/(auth)/register/page.tsx
```

Register membuat account baru dengan role yang selalu dipaksa menjadi `USER`.
Role dari hidden input, form payload, atau request client diabaikan dan ditolak.

### Validasi register

- Nama wajib, trim, minimal 2 dan maksimal 160 karakter.
- Email wajib, trim, lowercase, valid, maksimal 255 karakter.
- Password minimal 8 dan maksimal 72 karakter.
- Scope awal tidak memaksakan kombinasi huruf, angka, atau special character.
  Panjang menjadi rule canonical agar passphrase tetap dapat digunakan dan
  password policy tidak menolak credential development yang sudah tersedia.
- Konfirmasi password harus sama.
- Email current account harus unique.
- Submit pending dinonaktifkan untuk mencegah duplicate request.

### Urutan register

1. Validasi serta normalisasi seluruh input.
2. Terapkan rate limit Register berdasarkan IP dan normalized email.
3. Hash password dengan helper bcryptjs.
4. Buat row `users` dalam transaction Prisma dengan role `USER`.
5. Buat user-version awal dan Redis session.
6. Set cookie session.
7. Tulis Last Login, Last Activity, dan Presence.
8. Redirect ke `/dashboard`.

Jika row User berhasil dibuat tetapi Redis session gagal dibuat, account tidak
dirollback melalui destructive query lintas service. Response menjelaskan bahwa
account berhasil dibuat tetapi login otomatis gagal, kemudian user dapat login
ulang dengan credential yang sama.

Register email yang sudah dipakai current account menghasilkan pesan
`Email sudah terdaftar.` Soft-deleted account telah melepaskan unique email dan
tidak menghalangi register baru dengan email tersebut.

## Logout

Logout merupakan Server Action yang:

- Memverifikasi current cookie jika tersedia.
- Menghapus current Redis session key.
- Menghapus cookie session.
- Menghapus Presence current user.
- Mempertahankan Last Login dan Last Activity.
- Logout dashboard redirect ke `/login`, sedangkan logout dari Header publik
  tetap berada pada halaman aktif melalui server refresh.

Logout bersifat idempotent. Cookie atau Redis session yang sudah tidak ada tidak
menghasilkan error kepada user.

## Lupa dan reset password

Request dimulai dari `/lupa-password` dan reset dilakukan pada
`/lupa-password/[token]`. Email dikirim melalui Nodemailer dan SMTP Gmail.

Environment server yang digunakan:

```text
APP_URL=
SMTP_HOST=
SMTP_PORT=
SMTP_SECURE=
SMTP_USER=
SMTP_APP_PASSWORD=
SMTP_FROM_NAME=
SMTP_FROM_EMAIL=
```

Flow request:

- Email divalidasi, di-trim, dan di-lowercase.
- Response selalu generik agar keberadaan account tidak dapat ditebak.
- Email yang tidak terdaftar, account banned, atau account deleted tidak
  menerima email tetapi tetap memperoleh response dan countdown yang sama.
- Cooldown per email adalah satu request setiap 60 detik.
- Rate limit IP adalah 10 request dalam 15 menit.
- Countdown client berasal dari TTL Redis; refresh dan submit email yang sama
  tidak menghapus cooldown.
- Pengiriman email dijadwalkan melalui `after()` agar SMTP tidak memperpanjang
  response form dan mengurangi timing enumeration.

Token reset berupa random 32-byte base64url. Raw token hanya berada pada URL
email, sedangkan Redis menyimpan SHA-256 hash dengan TTL 10 menit. Satu user
hanya mempunyai satu token aktif; request baru langsung menggantikan token
lama.

Submit password baru memvalidasi token sekali lagi, memerlukan account aktif,
memastikan token masih menjadi token terbaru, lalu mengonsumsi token secara
atomic. Password di-hash melalui helper bcryptjs canonical. Seluruh session
account dicabut sebelum password database diperbarui dan user diarahkan ke
`/login?reset=success`.

Token yang sudah digunakan mempunyai marker sementara sehingga UI dapat
membedakannya dari token yang digantikan. Token invalid atau expired tidak
menampilkan form password.

## Session server

Session server berada pada server-only Data Access Layer. API utamanya sebagai
berikut:

- `getSession()`: mengembalikan session DTO atau `null`, tanpa redirect.
- `requireSession()`: mengembalikan session valid atau redirect ke Login.
- `getCurrentUser()`: mengambil safe User DTO berdasarkan verified session dan
  memastikan current row tidak banned atau soft-deleted.
- `requireCurrentUser()`: verified session ditambah pemeriksaan current User
  dari PostgreSQL.
- `requireRole(roles)`: memastikan current database role termasuk role yang
  diizinkan.
- `createSession(user)`: membuat Redis session dan cookie.
- `deleteCurrentSession()`: menghapus Redis session dan cookie.
- `revokeUserSessions(userId)`: menaikkan user-version dan menghapus Presence.

`getSession()` dan `getCurrentUser()` memakai React `cache()` untuk dedupe per
request/render. Cache tersebut bukan cross-request cache dan tidak menggantikan
Redis.

Data query dan Server Action tidak menerima user ID atau role actor dari form.
Actor selalu berasal dari `requireSession()` atau `requireCurrentUser()`.

### Safe session DTO

DTO yang boleh mencapai client dibatasi pada field berikut:

```text
id
name
email
role
avatarUrl
```

Session token, token hash, version internal, password, status key Redis, dan
credential lain tidak pernah diberikan ke Client Component.

## Session client dan hooks

Client tidak memverifikasi cookie atau memanggil Redis. Server layout membaca
verified session dan memberikan safe user DTO sebagai initial value kepada
`AuthSessionProvider`.

Hook yang tersedia:

- `useSession()`: mengembalikan `user`, `status`, dan helper logout.
- `useCurrentUser()`: convenience hook yang mengembalikan safe user atau
  melempar error jika dipakai di boundary authenticated.

Nilai status client:

```text
authenticated
unauthenticated
```

Initial dashboard session berasal dari server sehingga tidak memerlukan loading
flash atau client fetch setelah hydration. Client hook digunakan untuk:

- Menampilkan nama, avatar, dan role.
- Mengatur visibilitas UI berdasarkan role.
- Menjalankan logout.
- Menggantikan mock `AuthContext` yang sekarang dipakai Sidebar, Navbar,
  DashboardLayout, dan Profile.

Client hook bukan security boundary. Menyembunyikan tombol berdasarkan role
tidak menggantikan `requireRole()` pada Server Action atau data query.

Dashboard layout memasang provider dengan required session. Public layout boleh
memasang provider dengan optional session untuk kebutuhan Header. Root app
layout tidak perlu membaca cookie secara langsung; auth-aware boundary ditempatkan
pada route group yang memang membutuhkan user state.

Tidak direncanakan polling session berkala pada scope awal. Jika session dicabut
saat tab masih terbuka, request server berikutnya, navigation, refresh, atau
mutation akan menolak session. UI lama yang masih terlihat tidak memberi akses
ke data atau mutation tanpa server verification.

## Proteksi dashboard

`src/app/dashboard/layout.tsx` diubah menjadi async Server Component yang
memanggil `requireCurrentUser()` sebelum memberikan safe user DTO kepada client
dashboard shell.

Client `DashboardLayout` tidak lagi menentukan authentication melalui state
lokal atau `<Navigate>`. Tanggung jawabnya hanya layout responsif,
`UnsavedChangesProvider`, Sidebar, dan UI client lain.

Proteksi layout memberikan redirect awal yang baik, tetapi bukan satu-satunya
security boundary. Next.js layout dapat dipertahankan pada client navigation dan
tidak menjamin nested route/data tidak dieksekusi. Karena itu:

- Setiap protected data function memanggil `requireSession()` atau
  `requireCurrentUser()`.
- Setiap Server Action dianggap public endpoint dan memanggil auth guard.
- Setiap Route Handler protected memanggil auth guard.
- Role check ditempatkan dekat query atau mutation yang dilindungi.
- Page atau leaf Server Component boleh melakukan role check untuk conditional
  render, tetapi action tetap mengulang check.

Proxy Next.js tidak menjadi dependency wajib pada fase awal. Opaque session
memerlukan Redis untuk secure validation, sedangkan Proxy direkomendasikan hanya
untuk optimistic cookie checks dan juga berjalan pada prefetch. Server layout
serta DAL sudah cukup untuk initial route protection dan mengurangi invocation
tambahan pada Vercel Free. Proxy dapat ditambahkan nanti hanya untuk UX redirect,
bukan sebagai authorization boundary.

Login dan Register page memanggil `getSession()` pada server. User dengan
session valid diarahkan ke `/dashboard` tanpa menampilkan form auth kembali.

## Authorization role

Fase pertama memastikan seluruh `/dashboard` hanya dapat diakses oleh account
authenticated. Role authorization kemudian mengikuti matrix UI yang sudah ada:

| Area | Role awal |
| --- | --- |
| Dashboard umum | `USER`, `ADMIN`, `SUPERADMIN` |
| Manage Account | `SUPERADMIN` |
| Manage Website | `ADMIN`, `SUPERADMIN` |
| Log Activities | `SUPERADMIN` |
| Manage Content | `ADMIN`, `SUPERADMIN` |
| Create Article/Event | `USER`, `ADMIN`, `SUPERADMIN` |

Matrix tersebut harus diterapkan pada Server Component/data/action, bukan hanya
pada Sidebar. Permission granular dapat menggantikan matrix role pada module
terpisah tanpa mengubah format session utama.

## Last Login, Last Activity, dan Presence

Ketiga konsep disimpan terpisah:

```text
<REDIS_PREFIX>:auth:last-login:<user-uuid>
<REDIS_PREFIX>:auth:last-activity:<user-uuid>
<REDIS_PREFIX>:auth:presence:<user-uuid>
<REDIS_PREFIX>:auth:activity-gate:<user-uuid>
```

- Last Login diperbarui hanya setelah login atau register berhasil.
- Last Activity diperbarui setelah authenticated read atau write yang benar-benar
  dilakukan user.
- Presence mempunyai TTL 10 menit.
- Activity gate mempunyai TTL awal 2 menit agar Redis tidak ditulis pada setiap
  request.

Semua timestamp dibuat pada server dalam UTC. Value boleh menggunakan epoch
milliseconds agar perbandingan dan formatting konsisten.

### Activity write

Login/register menulis Last Login, Last Activity, dan Presence secara langsung.
Authenticated request berikutnya mencoba membuat activity-gate menggunakan
`SET NX EX`. Hanya request yang memperoleh gate yang memperbarui Last Activity
dan memperpanjang Presence.

Write activity bersifat metadata dan tidak boleh membuat request valid gagal.
Pekerjaan dijadwalkan dengan `after()` dari Next.js, yang pada Vercel memakai
`waitUntil` untuk memperpanjang lifetime serverless invocation. Jangan memakai
unawaited promise biasa seperti `void redis.set(...)` karena function dapat
dihentikan setelah response selesai.

Request prefetch Next.js, static asset, invalid session, login gagal, dan request
yang ditolak authorization tidak dihitung sebagai activity. Request header yang
menandai prefetch diperiksa sebelum menjadwalkan activity touch.

### Online rule

Account dianggap Online jika Presence masih ada. TTL Presence adalah 10 menit
sehingga user yang tidak mempunyai activity selama lebih dari 10 menit menjadi
offline.

Logout, ban, dan soft delete menghapus Presence segera. Last Login dan Last
Activity tetap disimpan sebagai metadata.

### Dashboard Account Manage

List `/dashboard/account/[role]` mengganti semantic kolom `Last Login` menjadi
`Last Activity`.

- Presence tersedia: tampilkan badge `Online`.
- Presence tidak tersedia dan Last Activity ada: tampilkan relative time.
- Last Activity tidak ditemukan atau Redis gagal: tampilkan `-`.

Page size 25 membaca Last Activity dan Presence seluruh UUID page aktif melalui
pipeline atau multi-get, bukan request Redis sequential per row.

DTO mengirim raw timestamp dan `isOnline` kepada Client Component. Client
menghitung ulang relative time setiap 30-60 detik agar status dapat berubah dari
Online menjadi offline tanpa request server tambahan.

Detail account dapat menampilkan Last Login dan Last Activity sebagai dua field
terpisah agar maknanya tidak tercampur.

## Ban, soft delete, dan perubahan role

Account Manage action diintegrasikan dengan Auth sebagai berikut:

- Ban menaikkan user-version dan menghapus Presence.
- Soft delete menaikkan user-version dan menghapus Presence.
- Perubahan `USER <-> ADMIN` menaikkan user-version agar role snapshot session
  lama tidak digunakan.
- Unban tidak membuat session baru dan tidak menurunkan session version.
- SUPERADMIN tetap tidak dapat di-ban atau di-delete.

Revocation Redis merupakan operasi security-critical dan harus di-`await`, bukan
dijalankan fire-and-forget. Jika role berubah, user harus login kembali untuk
mendapat session dengan role baru.

Sensitive action tetap membaca current actor melalui auth guard. UUID target
account dari form tidak pernah dianggap sebagai actor session.

## Rate limit

Rate limit awal memakai Upstash Redis tanpa persistent process atau cron.

Key dipisahkan berdasarkan use case:

```text
<REDIS_PREFIX>:auth:rate:login:ip:<ip-hash>
<REDIS_PREFIX>:auth:rate:login:email:<email-hash>
<REDIS_PREFIX>:auth:rate:register:ip:<ip-hash>
<REDIS_PREFIX>:auth:rate:register:email:<email-hash>
```

Email dan IP tidak ditulis mentah ke nama key; gunakan deterministic hash. Rate
limit response tidak mengungkap apakah email terdaftar. Nilai limit final diuji
pada development, dengan baseline awal sekitar 5 kegagalan per 15 menit untuk
kombinasi email dan limit IP yang lebih longgar.

Login berhasil dapat menghapus atau mengurangi counter email. Redis rate limit
yang gagal diakses harus mengikuti policy eksplisit; authentication tetap
memerlukan Redis session sehingga kegagalan Redis pada akhirnya menolak login.

## Struktur module

```text
src/modules/auth/
  actions/
    login.ts
    logout.ts
    register.ts
  components/
    auth-page-shell.tsx
    auth-session-provider.tsx
    forgot-password-page.tsx
    login-page.tsx
    register-page.tsx
  data/
    activity.ts
    auth-account.ts
    password.ts
    rate-limit.ts
    redis-key.ts
    redis.ts
    session.ts
    session-dal.ts
  hooks/
    use-current-user.ts
    use-session.ts
  schemas/
    auth.schema.ts
    session.schema.ts
  types/
    auth-action-state.ts
    auth-session.ts
```

Tanggung jawab file utama:

- `redis.ts`: singleton Upstash REST client dan availability validation.
- `redis-key.ts`: normalisasi `REDIS_PREFIX` serta pembentukan seluruh key.
- `session.ts`: token generation, hashing, cookie, Redis create/delete/revoke.
- `session-dal.ts`: `getSession`, `requireSession`, current user, dan role guard.
- `activity.ts`: Last Login, Last Activity, Presence, throttle, dan batch read.
- `auth-account.ts`: query candidate login dan safe auth select Prisma.
- `rate-limit.ts`: counter login/register tanpa raw email atau IP pada key.
- `auth.schema.ts`: validation Login dan Register.
- `session.schema.ts`: runtime validation Redis session payload.

Tidak dibuat barrel `index.ts`. Server-only file tidak boleh diimpor dari Client
Component.

## Implementasi

### Phase 1 - Redis dan session foundation (selesai)

- Tambahkan `@upstash/redis`.
- Buat Redis client, key builder, environment validation, dan session schemas.
- Implementasikan opaque token generation dan SHA-256 hashing.
- Implementasikan create, read, delete, serta user-version revocation.
- Implementasikan cookie options production/development.

### Phase 2 - Login, Register, dan Logout (selesai)

- Buat Zod schema Login dan Register.
- Implementasikan dummy bcrypt compare.
- Implementasikan login messages sesuai status credential/account.
- Implementasikan Register role `USER` dan automatic login.
- Implementasikan logout idempotent.
- Hubungkan form dengan `useActionState` dan field errors.

### Phase 3 - Session DAL dan dashboard boundary (selesai)

- Implementasikan server session guards menggunakan React `cache()`.
- Ubah dashboard layout menjadi server authentication boundary.
- Buat AuthSessionProvider dan client hooks.
- Migrasikan Sidebar, DashboardLayout, Navbar, dan Profile dari mock AuthContext.
- Tambahkan guard pada protected data functions dan Server Actions secara
  bertahap berdasarkan role matrix.

### Phase 4 - Last Activity dan Account Manage (selesai)

- Implementasikan Last Login, Last Activity, Presence, dan activity gate.
- Jadwalkan non-critical activity write melalui `after()`.
- Abaikan Next.js prefetch sebagai activity.
- Integrasikan batch Redis read ke list/detail Account Manage.
- Ganti label list menjadi Last Activity dan tambahkan relative time client.

### Phase 5 - Session revocation (selesai)

- Integrasikan Ban, Soft Delete, dan Change Role dengan user-version.
- Hapus Presence saat Ban, Delete, dan Logout.
- Pastikan revoked session ditolak pada request server berikutnya.
- Pertahankan proteksi SUPERADMIN pada UI dan server action.

## Validasi implementasi

Flow berikut wajib diperiksa setelah code dibuat:

- Login berhasil untuk `user@example.com`, `admin@example.com`, dan
  `super@example.com` memakai password development `12345678`.
- Email login/register selalu tersimpan dan dicari sebagai lowercase.
- Email salah dan password salah menghasilkan pesan yang sama.
- Account banned dengan password salah tetap menghasilkan credential error.
- Account banned dengan password benar menghasilkan banned message.
- Account deleted dengan password benar menghasilkan deleted message.
- Dummy bcrypt compare tetap berjalan ketika email tidak ditemukan.
- Register membuat `USER`, hash bcrypt, session, cookie, dan redirect Dashboard.
- Duplicate register ditolak tanpa membuat row tambahan.
- Logout menghapus current session, cookie, dan Presence.
- Forgot Password memakai response generik dan cooldown 60 detik.
- Token reset expired setelah 10 menit, hanya berlaku satu kali, dan token baru
  membatalkan token lama.
- Reset password mencabut seluruh session dan redirect ke Login.
- Dashboard tanpa session redirect ke Login.
- Fake atau expired cookie tidak membuka protected data.
- Client hook menerima safe DTO tanpa token atau password.
- Ban/Delete/Role Change membuat session lama langsung ditolak.
- SUPERADMIN tidak dapat di-ban atau di-delete.
- Presence aktif menghasilkan Online dan hilang setelah 10 menit tanpa activity.
- Last Activity dibaca batch untuk maksimal 25 account per page.
- Redis error pada metadata activity tidak menggagalkan request valid.
- Redis error pada session verification menolak authentication.

Command validasi project:

```text
npx prisma validate
npx tsc --noEmit
npm run lint
npm run build
```

## Status saat ini

- Login, Register automatic login, dan Logout sudah memakai Server Action.
- Forgot Password, Nodemailer SMTP, reset token Redis, dan reset password sudah
  terintegrasi.
- Opaque session, cookie `HttpOnly`, token hash, dan user-version sudah aktif di
  Upstash Redis.
- Mock `AuthContext` sudah dihapus dan digantikan `AuthSessionProvider`,
  `useSession()`, serta `useCurrentUser()`.
- Dashboard memakai server authentication boundary; Account Manage, Website
  Manage, Log Activities, dan Manage Content mempunyai role guard server.
- Last Login, Last Activity, Presence, activity throttle, dan batch read Account
  Manage sudah terintegrasi.
- Ban, soft delete, dan role change mencabut session target melalui
  user-version; SUPERADMIN tetap tidak dapat di-ban atau di-delete.
- Login seed `super@example.com` dengan password `12345678` sudah diverifikasi
  menghasilkan session cookie dan redirect `/dashboard`.
- `prisma validate`, TypeScript, lint tanpa error, dan production build Webpack
  sudah lulus. Turbopack build pada sandbox pengembangan dapat gagal ketika
  proses PostCSS tidak diizinkan membuka port internal.

Dokumen ini harus diperbarui jika session duration, online threshold, password
policy, atau role matrix berubah.
