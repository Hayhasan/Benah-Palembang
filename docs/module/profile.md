# Profile Module

Module ini mengelola profil milik account yang sedang login. Profile tidak
mempunyai table terpisah; seluruh data tetap memakai row canonical pada Prisma
model `User` yang juga digunakan module User Manage, Admin Manage, dan Auth.

## Scope

- Menampilkan profil account yang sedang login pada `/dashboard/profile`.
- Mengubah nama, username, foto profil, banner, bio, WhatsApp, dan link media sosial.
- Menyediakan halaman publik `/penulis/[username]` yang menampilkan profil,
  statistik, artikel published, dan Event published milik pengguna.
- Menampilkan email dan role sebagai informasi read-only.
- Mengirim email reset password ke email account yang sedang login.
- Mempertahankan Galeri Artikel sebagai fixed dummy sampai module Article
  menyediakan data article milik user.

Semua role `USER`, `ADMIN`, dan `SUPERADMIN` dapat mengakses serta mengubah
profilnya sendiri. Module Profile tidak mengubah email, role, password, status
ban, atau status soft delete.

## Route dan struktur

Route dashboard tetap tipis:

```text
src/app/dashboard/profile/page.tsx
```

Business logic ditempatkan pada:

```text
src/modules/profile/
  actions/
    request-profile-password-reset.ts
    update-profile.ts
  components/
    profile-page.tsx
    public-profile-page.tsx
  data/
    get-current-profile.ts
    get-public-profile.ts
    profile.mapper.ts
  schemas/
    profile.schema.ts
  types/
    profile.ts
    public-profile.ts
```

Page membaca initial profile melalui Server Component dan hanya memberikan DTO
serializable kepada Client Component. Prisma tidak boleh diimpor oleh komponen
client.

## Database

Profile mereference table `users` melalui Prisma model `User`. Field yang
digunakan adalah:

| Field | Perilaku Profile |
| --- | --- |
| `id` | UUID read-only; target selalu berasal dari session server |
| `name` | Editable |
| `username` | Editable, mandatory, unique, lowercase, maksimal 30 karakter |
| `email` | Read-only dan tidak pernah diterima sebagai input update |
| `role` | Read-only |
| `avatarUrl` | Editable, nullable |
| `bannerUrl` | Editable, nullable |
| `bio` | Editable, nullable |
| `whatsappCountryCode` | Editable, digit tanpa tanda `+`, nullable |
| `whatsappNumber` | Editable, nomor lokal tanpa country code, nullable |
| `instagramUrl` | Editable, HTTPS URL atau null |
| `xUrl` | Editable, HTTPS URL atau null |
| `linkedinUrl` | Editable, HTTPS URL atau null |
| `password` | Tidak diedit langsung; reset memakai module Auth |
| `isBanned`, `deletedAt` | Dipakai auth guard dan tidak dapat diubah di Profile |
| `createdAt`, `updatedAt` | Dikelola Prisma; `updatedAt` berubah saat save |

Migration `20260830230000_add_user_username` menambahkan `username` sebagai
nullable, melakukan backfill dari nama dalam format lowercase underscore,
menyelesaikan collision dengan suffix `_2`, `_3`, dan seterusnya, lalu memasang
`NOT NULL`, unique index, dan database check constraint.

## Query profile

- Query wajib memanggil `requireCurrentUser()` sebelum membaca data Profile.
- ID account berasal dari hasil guard, bukan route param, hidden input, atau
  payload client.
- Query hanya menerima row yang belum di-ban dan belum di-soft-delete.
- Hasil Prisma dipetakan ke `ProfileData`; object Prisma mentah tidak dikirim ke
  browser.
- Email dan role ikut dikirim sebagai data tampilan, tetapi tidak menjadi field
  mutation.

## Update profile

Server Action update mengikuti `docs/rules/auth-rules.md`:

1. Memanggil `requireCurrentUser()` pada awal action.
2. Memvalidasi input dengan Zod.
3. Memperbarui hanya row dengan ID dari session yang masih aktif.
4. Mengembalikan DTO Profile terbaru kepada client.
5. Merevalidasi route Profile, lalu client menjalankan refresh agar seluruh UI
   berbasis `AuthSessionProvider` membaca nama dan avatar terbaru.

Validasi dan normalisasi:

- Nama di-trim, minimal 2 dan maksimal 160 karakter.
- Username dinormalisasi lowercase, mandatory, maksimal 30 karakter, serta hanya
  menerima huruf `a-z`, angka, titik, dan underscore.
- Titik tidak boleh berada di awal/akhir atau digunakan berurutan. Username
  diperiksa unique oleh database; collision menghasilkan field error khusus.
- String opsional di-trim; string kosong disimpan sebagai `null`.
- Bio maksimal 2.000 karakter.
- URL avatar, banner, dan media sosial maksimal 2.048 karakter dan wajib HTTPS.
- Country code WhatsApp berisi 1-7 digit tanpa `+`.
- Nomor WhatsApp berisi 5-32 digit tanpa country code dan tanpa awalan `0`.
- Country code dan nomor WhatsApp harus sama-sama diisi atau sama-sama kosong.
- Email, role, password, dan actor ID tidak diterima oleh schema update.

Form terhubung ke `UnsavedChangesContext`. Tombol Simpan Profil dan aksi
"Simpan Sekarang" dari confirmation navigasi memakai fungsi save yang sama.
Cancel mengembalikan draft ke data terakhir yang berhasil disimpan.

## Galeri Article dashboard

- `/dashboard/profile` mengambil maksimal enam Article aktif terbaru milik
  actor melalui relasi `authoredArticles` pada query User yang sama.
- Total Article aktif dihitung melalui filtered relation count; card menampilkan
  status, update terakhir, views, dan likes dari database.
- Klik card membuka `/dashboard/create-article/preview/[id]`, sehingga Article
  draft, pending, rejected, published, dan taken down tetap dapat dipreview oleh
  owner sesuai ownership guard.
- Presentasi memakai komponen reusable module Article yang juga dipakai detail
  Manage Account. Tidak ada dummy article atau data statistik hard-coded.

## Animasi profil public

Halaman `/penulis/[username]` memakai scale reveal pada banner, reveal bertahap
pada card identitas dan statistik, stagger pada masonry Article, serta stagger
pada Event terkait. Seluruh animasi mengikuti primitive global public, berjalan
satu kali ketika masuk viewport, dan dinonaktifkan saat reduced motion aktif.

## Upload avatar dan banner

- Upload memakai signed Cloudinary upload yang sudah tersedia.
- Signature selalu dibuat setelah `requireCurrentUser()` dan folder ditentukan
  server secara fixed sebagai `benah-palembang/profiles`.
- Client hanya boleh memilih scope upload yang sudah di-whitelist; client tidak
  boleh mengirim arbitrary folder Cloudinary.
- Crop dilakukan di browser, kemudian browser mengunggah langsung ke
  Cloudinary dan hanya `secure_url` yang disimpan ke database.
- Avatar menggunakan rasio 1:1 dan banner menggunakan rasio 16:5.
- Form tidak boleh menyimpan `blob:` URL atau file binary ke database.

## Kirim email reset password

Tombol `Kirim Email Reset Password` memakai lifecycle reset password milik
module Auth, bukan implementasi token kedua.

- Action Profile wajib memanggil `requireCurrentUser()`.
- Alamat tujuan berasal dari email hasil guard/database dan tidak pernah
  diterima dari client.
- Token opaque disimpan dalam bentuk hash di Upstash Redis, berlaku 10 menit,
  hanya dapat digunakan satu kali, dan request terbaru menggantikan token lama.
- Email dikirim melalui Nodemailer menggunakan SMTP yang sama dengan halaman
  `/lupa-password`.
- Cooldown email 60 detik dan rate limit IP tetap memakai helper Auth yang sama.
- Pengiriman email dijadwalkan dengan `after()` agar cocok dengan Vercel
  serverless dan tidak menahan response lebih lama dari yang diperlukan.

## Session dan UI dashboard

Session Redis hanya menyimpan user ID, role snapshot, version, dan metadata
session. Nama serta avatar tidak disalin ke payload Redis.

Setelah Profile berhasil disimpan, route dashboard di-refresh. Layout dashboard
menjalankan kembali `requireCurrentUser()`, memberikan `AuthUser` terbaru kepada
`AuthSessionProvider`, lalu komponen yang memakai `useCurrentUser()` seperti
Sidebar otomatis menampilkan nama dan foto profil baru tanpa login ulang.

## Galeri Artikel

Galeri Artikel pada halaman Profile tetap menggunakan tiga fixed dummy article
yang sudah tersedia pada UI saat ini. Judul, gambar, views, likes, dan target
preview tidak diubah oleh module Profile. Integrasi database dilakukan nanti
oleh module Article tanpa menambahkan field article ke table `users`.

## Checklist implementasi

- [x] Memakai model `User` yang sama tanpa table Profile baru.
- [x] Email dan role read-only.
- [x] Update hanya untuk account dari session server.
- [x] Validasi serta normalisasi field Profile.
- [x] Avatar dan banner melalui signed Cloudinary upload.
- [x] Tombol reset password memakai token, Redis, rate limit, dan mailer Auth.
- [x] Nama/avatar Sidebar diperbarui setelah save.
- [x] Galeri Artikel dummy dipertahankan.
- [x] Username mandatory dan unique dengan backfill aman untuk account existing.
- [x] Halaman `/penulis/[username]` membaca profil dan karya published dari database.

## Halaman Penulis Publik

Route `/penulis/[username]` hanya menerima username valid dan mencari User yang
aktif, tidak banned, serta tidak soft-deleted. Username yang invalid atau tidak
ditemukan menghasilkan `notFound()`.

Halaman mengikuti UI referensi dengan banner gelap, kartu profil transparan,
avatar, bio, sosial media, CTA WhatsApp, tombol bagikan, statistik Article,
galeri masonry, dan Event published terkait. Statistik views dan likes dihitung
dari Article published milik penulis; tidak ada data draft atau moderasi yang
dikirim ke halaman publik.
