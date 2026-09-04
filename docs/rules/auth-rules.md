# Authentication And Authorization Rules

Dokumen ini menjadi aturan lintas-module untuk authentication, proteksi route,
authorization role, session client, activity tracking, dan session revocation.
Setiap module baru yang mempunyai halaman dashboard, query terlindungi, Server
Action, Route Handler, atau upload signature wajib mengikuti dokumen ini.

Detail desain dan lifecycle internal Auth tersedia pada
`docs/module/auth.md`. Module lain cukup mereferensikan dokumen rules ini dan
tidak membuat strategi session sendiri.

## 1. Sumber Auth canonical

Project menggunakan implementasi Auth internal berikut:

```text
src/modules/auth/
  actions/
  components/auth-session-provider.tsx
  data/session-dal.ts
  data/session.ts
  hooks/use-current-user.ts
  hooks/use-session.ts
  types/auth-session.ts
```

Aturan utamanya:

- Session menggunakan opaque random token pada cookie `HttpOnly`.
- Redis hanya menyimpan SHA-256 hash token dan payload session minimal.
- Upstash Redis menjadi session store yang sesuai dengan Vercel serverless.
- Project tidak memakai Auth.js/NextAuth, JWT access token, atau refresh token.
- Module lain dilarang membaca, membuat, memverifikasi, atau menghapus cookie
  session secara manual.
- Module lain dilarang membuat table session atau implementasi session kedua.
- Model account canonical tetap Prisma model `User` dengan role `USER`,
  `ADMIN`, dan `SUPERADMIN`.

## 2. API server yang boleh digunakan module lain

Import server guard langsung dari:

```ts
import {
  getCurrentUser,
  getSession,
  requireCurrentUser,
  requireRole,
  requireSession,
} from "@/modules/auth/data/session-dal"
```

Pemilihan API:

| API | Penggunaan |
| --- | --- |
| `getSession()` | Membaca session optional tanpa redirect. Gunakan hanya jika payload session memang cukup. |
| `getCurrentUser()` | Membaca safe current user optional untuk halaman publik atau conditional UI server. |
| `requireSession()` | Memerlukan session valid ketika data account database tidak dibutuhkan. |
| `requireCurrentUser()` | Default guard untuk halaman, query, action, atau handler yang cukup membutuhkan user login. |
| `requireRole(roles)` | Guard untuk resource yang dibatasi berdasarkan role. |

Default untuk module baru adalah `requireCurrentUser()` atau `requireRole()`.
Jangan memakai `getSession()` lalu membuat redirect atau role check manual jika
guard yang sesuai sudah tersedia.

`requireCurrentUser()` memastikan row User:

- Masih tersedia.
- Tidak di-ban.
- Belum di-soft-delete.
- Mempunyai role yang sama dengan snapshot session.

Guard mengembalikan safe DTO berikut:

```text
id
name
email
role
avatarUrl
```

Password, raw session token, token hash, user-version, dan Redis key tidak boleh
dikirim ke client atau ditambahkan ke DTO module lain.

## 3. Proteksi layout dan page

Seluruh `/dashboard` sudah mempunyai authentication boundary pada
`src/app/dashboard/layout.tsx`. Boundary tersebut memberi initial user kepada
`AuthSessionProvider` dan mencegah user tanpa session membuka dashboard.

Proteksi layout tidak cukup sebagai satu-satunya authorization boundary.
Next.js dapat mempertahankan layout ketika client navigation dan Server Action
tetap merupakan endpoint yang dapat dipanggil langsung. Karena itu, module baru
tetap wajib memasang guard dekat data atau operasi yang dilindungi.

Page tanpa pembatasan role tidak perlu mengulang guard jika seluruh data dan
mutation di bawahnya sudah mempunyai guard. Page dengan pembatasan role harus
menjalankan guard pada Server Component:

```tsx
import { requireRole } from "@/modules/auth/data/session-dal"

export default async function Page() {
  await requireRole(["ADMIN", "SUPERADMIN"])

  return <ModulePage />
}
```

Jangan membuat redirect auth melalui `useEffect`, local state, atau komponen
client seperti `<Navigate>`. Redirect authentication dan authorization harus
berasal dari server guard.

## 4. Proteksi data function

Query dashboard atau data sensitif harus berupa server-only data function dan
menjalankan guard sebelum query utama:

```ts
import "server-only"

import { prisma } from "@/lib/db/prisma"
import { requireRole } from "@/modules/auth/data/session-dal"

export async function getModuleEditor() {
  await requireRole(["ADMIN", "SUPERADMIN"])

  return prisma.moduleRecord.findMany({
    where: { deletedAt: null },
  })
}
```

Aturannya:

- Protected data function tidak boleh mengandalkan Sidebar atau page parent.
- Guard dijalankan sebelum membaca data sensitif.
- Actor ID dan actor role selalu berasal dari hasil guard.
- Jangan menerima `actorId`, `currentUserId`, atau `actorRole` dari parameter
  client.
- UUID target dari route atau form boleh diterima, tetapi hanya sebagai target
  operasi dan tetap harus divalidasi.
- Public query tidak perlu auth guard jika datanya memang public dan hanya
  mengambil record aktif.

## 5. Proteksi Server Action

Semua Server Action dianggap public endpoint. Guard harus berada pada awal
action dan tetap dijalankan walaupun tombol action disembunyikan dari UI.

```ts
"use server"

import { requireRole } from "@/modules/auth/data/session-dal"

export async function updateModuleAction(input: unknown) {
  const actor = await requireRole(["ADMIN", "SUPERADMIN"])

  const parsed = moduleSchema.safeParse(input)
  if (!parsed.success) {
    return { success: false, message: "Data tidak valid." }
  }

  // Gunakan actor.id jika mutation membutuhkan createdById/updatedById.
}
```

Ketentuan action:

- Guard dijalankan sebelum validasi dan mutation utama.
- Input client tetap divalidasi dengan Zod setelah authorization berhasil.
- Jangan mempercayai hidden input untuk role atau identitas actor.
- UI role check hanya untuk UX dan tidak menggantikan guard action.
- Action yang menghasilkan signed upload atau mengakses secret juga wajib
  mempunyai guard server.
- Action yang hanya membutuhkan user login memakai `requireCurrentUser()`.
- Action administratif memakai `requireRole()` sesuai matrix module.

## 6. Proteksi Route Handler

Route Handler internal yang membaca atau mengubah protected resource harus
menjalankan guard sebelum memproses request:

```ts
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

export async function POST(request: Request) {
  const actor = await requireCurrentUser()
  const payload = await request.json()

  // Validasi payload dan lakukan operasi menggunakan actor dari server.
}
```

Route Handler tidak boleh menganggap request aman hanya karena URL berada di
bawah `/dashboard` atau dipanggil oleh komponen dashboard.

## 7. Role dan authorization matrix

Role canonical selalu memakai uppercase sesuai Prisma enum:

```text
USER
ADMIN
SUPERADMIN
```

Jangan membuat varian lowercase seperti `user`, `admin`, atau `superadmin`
untuk session dan authorization. Lowercase hanya boleh dipakai sebagai route
segment atau label UI yang dipetakan secara eksplisit.

Matrix awal project:

| Area | Role yang diizinkan |
| --- | --- |
| Dashboard authenticated | `USER`, `ADMIN`, `SUPERADMIN` |
| Overview | `ADMIN`, `SUPERADMIN` |
| Manage Account | `SUPERADMIN` |
| Manage Website | `ADMIN`, `SUPERADMIN` |
| Manage Content | `ADMIN`, `SUPERADMIN` |
| Log Activities | `SUPERADMIN` |
| Create Article/Event | `USER`, `ADMIN`, `SUPERADMIN` |
| Profile sendiri | `USER`, `ADMIN`, `SUPERADMIN` |

Jika module baru membutuhkan aturan berbeda, matrix tersebut ditulis pada docs
module dan diterapkan pada page/data/action. Jangan hanya menambahkan role pada
Sidebar.

Permission granular dapat ditambahkan pada module Permission di masa depan.
Sebelum itu tersedia, module baru tetap menggunakan `requireRole()` dan tidak
membuat format permission ad-hoc pada session.

## 8. Session pada Client Component

Client Component membaca safe user melalui hook:

```tsx
"use client"

import { useCurrentUser } from "@/modules/auth/hooks/use-current-user"

export function ModuleToolbar() {
  const user = useCurrentUser()

  return <span>{user.name}</span>
}
```

Gunakan:

- `useSession()` ketika user bersifat optional atau komponen membutuhkan
  `status`, `logout`, atau `isLoggingOut`.
- `useCurrentUser()` ketika komponen pasti berada di authenticated boundary.

Aturan client:

- Client tidak membaca cookie session.
- Client tidak mengakses Upstash Redis.
- Client tidak memverifikasi role sebagai security boundary.
- Client boleh menyembunyikan tombol atau menu berdasarkan role untuk UX.
- Client tidak boleh menerima token, password, user-version, atau Redis key.
- Jangan membuat provider auth baru pada module. Gunakan
  `AuthSessionProvider` yang sudah dipasang oleh layout terkait.

Public route group memasang provider dengan optional user untuk Header.
Dashboard memasang provider dengan required user. Jika komponen auth dipakai di
boundary baru seperti root `not-found`, boundary tersebut harus memasang
provider dan memberikan safe initial user dari server.

## 9. Last Activity dan Presence

Guard `requireSession()`, `requireCurrentUser()`, dan `requireRole()` sudah
menjadwalkan Last Activity melalui `after()`. Module biasa tidak perlu memanggil
Redis activity helper secara manual.

Aturannya:

- Authenticated read/write yang lolos guard dihitung sebagai activity.
- Request prefetch dan authorization yang ditolak tidak dihitung.
- Activity write di-throttle melalui activity gate Redis.
- Presence aktif selama 10 menit sejak activity terakhir.
- Activity metadata bersifat fail-open dan tidak boleh menggagalkan operasi
  bisnis yang valid.
- Session verification bersifat fail-closed; kegagalan Redis tidak boleh
  dianggap authenticated.
- List banyak account memakai `getAccountActivities(userIds)` secara batch,
  bukan satu request Redis untuk setiap row.

Last Login hanya diperbarui oleh flow Login atau Register berhasil. Module lain
tidak boleh mengubah Last Login.

## 10. Session revocation

Import revocation helper dari:

```ts
import { revokeUserSessions } from "@/modules/auth/data/session"
```

Seluruh session user wajib dicabut setelah perubahan keamanan berikut:

- Account di-ban.
- Account di-soft-delete.
- Role account berubah.
- Password berhasil diubah atau di-reset.
- Administrator menjalankan future logout-all-devices.

Contoh:

```ts
await prisma.user.update({
  where: { id: targetUserId },
  data: { role: "ADMIN" },
})

await revokeUserSessions(targetUserId)
```

Revocation adalah operasi security-critical:

- Wajib di-`await`.
- Jangan dijalankan dengan fire-and-forget atau `after()`.
- Target revocation adalah UUID account yang berubah, bukan actor yang
  menjalankan action.
- Unban tidak membuat session baru; user harus login kembali.
- Last Login dan Last Activity tetap dipertahankan, sedangkan Presence dihapus.

Jika future mutation mengubah password, action tersebut belum dianggap selesai
sebelum `revokeUserSessions()` dipanggil.

## 11. Aturan lupa dan reset password

Module lain tidak boleh membuat flow reset password alternatif. Gunakan route
dan helper milik module Auth:

```text
/lupa-password
/lupa-password/[token]
```

Aturan canonical:

- Response request selalu generik, baik email terdaftar maupun tidak.
- Jangan menampilkan pesan `Email tidak terdaftar`.
- Cooldown pengiriman adalah satu kali per email setiap 60 detik.
- IP mempunyai limit tambahan 10 request per 15 menit.
- Token random berlaku 10 menit dan Redis hanya menyimpan hash token.
- Request baru untuk user yang sama membatalkan token sebelumnya.
- Token hanya boleh digunakan satu kali.
- Account banned atau soft-deleted tidak menerima email dan tidak dapat reset.
- Password baru memakai schema dan helper bcryptjs canonical.
- Reset password wajib memanggil session revocation secara sinkron.
- Redirect berhasil menuju `/login?reset=success`.

Konfigurasi SMTP hanya dibaca pada server. `SMTP_APP_PASSWORD`, credential
Gmail, dan raw reset token tidak boleh masuk client bundle, log, DTO, atau
database PostgreSQL.

Pengiriman email menggunakan Nodemailer melalui `after()`. Module lain tidak
boleh memakai unawaited promise biasa untuk pengiriman email pada Vercel
serverless.

## 12. Aturan account dan credential

Flow yang menerima email wajib melakukan normalisasi server-side:

```text
trim
lowercase
validasi format
max 255 karakter
```

Password:

- Hanya di-hash dan diverifikasi melalui
  `src/modules/auth/data/password.ts`.
- Menggunakan `bcryptjs` dengan cost yang ditentukan helper canonical.
- Tidak boleh disimpan atau dicatat dalam bentuk plain text.
- Tidak boleh masuk log, DTO, action result, analytics, atau session.
- Maksimal 72 karakter mengikuti batas input bcrypt.

Login harus mempertahankan aturan anti-enumeration dari module Auth. Module
lain tidak boleh membuat endpoint login alternatif atau mengembalikan pesan
yang mengungkap status account sebelum password benar.

## 13. Soft delete, ban, dan current user

Protected query harus menganggap account tidak valid jika `deletedAt` terisi
atau `isBanned = true`. Pemeriksaan canonical sudah dilakukan oleh
`getCurrentUser()` dan guard turunannya.

Aturan tambahan:

- Jangan memakai soft-deleted user sebagai actor mutation baru.
- SUPERADMIN tidak dapat di-ban atau di-delete melalui Account Manage.
- Target account tetap dicari ulang dari database sebelum mutation sensitif.
- Jangan mempercayai role target yang dikirim client.
- Jika mutation target bergantung pada role lama, gunakan conditional update
  atau transaction agar race condition tidak mengubah account yang salah.

## 14. Error dan redirect

- User tanpa session diarahkan ke Login oleh server guard, lengkap dengan
  `?from=<path asal>` supaya dapat dikembalikan ke halaman tujuan setelah
  berhasil masuk. Lihat bagian Return path di bawah.
- Session invalid, expired, revoked, banned, atau deleted diperlakukan sebagai
  unauthenticated.
- User yang tidak mempunyai role diarahkan ke fallback dashboard yang sesuai
  oleh `requireRole()`.
- Jangan menangkap redirect Next.js lalu mengubahnya menjadi generic error.
- Letakkan `redirect()` di luar `try/catch` bila action melakukan redirect
  setelah operasi berhasil.
- Error internal tidak boleh mengembalikan secret, Redis key, Prisma payload,
  password hash, atau raw exception kepada client.

### Return path setelah login

Guard `requireSession()`, `requireCurrentUser()`, dan `requireRole()` memakai
`loginRedirectUrl()` pada `src/modules/auth/data/return-path.ts`, bukan string
`/login?reason=...` yang ditulis manual. Helper tersebut membaca path yang
sedang diakses dari header `x-pathname` yang dipasang `src/proxy.ts`, lalu
menambahkannya sebagai `from`.

Halaman Login dan Register meneruskan `from` sebagai hidden input, dan
`loginAction` serta `registerAction` mengarahkan ke path tersebut setelah
berhasil. Ketika pengguna yang sudah login membuka `/login?from=...`, halaman
langsung mengarahkannya ke tujuan tersebut.

Setiap nilai `from` wajib melewati `sanitizeReturnPath()` — baik saat dibaca
dari query string maupun saat dibaca dari form. Aturannya:

- Hanya menerima path internal yang diawali `/`.
- Menolak absolute URL dan protocol-relative path (`//host`, `/\host`) supaya
  `from` tidak dapat dipakai sebagai open redirect ke domain lain.
- Menolak route auth (`/login`, `/register`, `/lupa-password`,
  `/first-time-setup`) supaya pengguna tidak berputar kembali ke halaman login.
- Mengembalikan `null` bila tidak valid, dan pemanggil jatuh ke `/dashboard`.

Nilai `from` tidak pernah dipercaya sebagai penanda otorisasi. Setelah redirect,
halaman tujuan tetap menjalankan guard-nya sendiri, sehingga pengguna tanpa role
yang sesuai tetap dialihkan oleh `requireRole()`.

## 15. Proxy dan middleware

Module baru tidak perlu menambahkan Proxy/middleware untuk memverifikasi opaque
session. Secure verification tetap dilakukan melalui DAL server karena
memerlukan Redis dan pemeriksaan current User.

Proxy hanya boleh ditambahkan nanti untuk optimistic redirect/UX dan tidak
pernah menggantikan guard pada page, data function, Server Action, atau Route
Handler.

`src/proxy.ts` memasang header `x-pathname` berisi pathname beserta query pada
setiap request. Header tersebut hanya dipakai untuk menyusun `from`, bukan untuk
menentukan akses. Konstanta namanya berada pada
`src/lib/constants/request-headers.ts` supaya proxy tidak ikut menarik
`next/headers` maupun modul `server-only` ke dalam bundle-nya.

## 16. Checklist module baru

Sebelum module protected dianggap selesai, pastikan:

- Page role-restricted memanggil `requireRole()`.
- Protected data function memanggil `requireCurrentUser()` atau
  `requireRole()`.
- Setiap Server Action dan Route Handler mempunyai guard sendiri.
- Actor berasal dari guard server, bukan input client.
- Role UI memakai enum uppercase dan sesuai matrix module.
- Client hanya memakai `useSession()` atau `useCurrentUser()`.
- Tidak ada import Prisma, Redis, session DAL, atau secret pada Client
  Component.
- Mutation ban/delete/role/password melakukan session revocation yang di-await.
- Activity tidak ditulis manual jika guard sudah menangani activity touch.
- Soft-delete filter dan status account diterapkan pada query terkait.
- TypeScript, lint, dan production build tetap lulus.

Validasi minimum:

```text
npx tsc --noEmit
npm run lint
npm run build
```

Untuk perubahan Prisma, tambahkan:

```text
npx prisma validate
```
