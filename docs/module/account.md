# Account Module

Module ini mengelola akun dan profil personal milik pengguna yang sedang login dari dashboard pada route `/dashboard/profile`. Account Module tidak membuat table profil terpisah di database; seluruh data profil menggunakan row canonical pada model Prisma `User` (table `users`) yang juga digunakan bersama oleh module Auth, User Manage, dan Admin Manage.

Route canonical:

```text
/dashboard/profile
```

## 1. Scope

- Menampilkan informasi profil dan akun pengguna aktif pada `/dashboard/profile`.
- Mengubah data personal: nama lengkap, bio/deskripsi singkat, nomor WhatsApp, dan tautan media sosial (Instagram, X/Twitter, LinkedIn).
- Mengunggah dan memperbarui foto profil (avatar) dan foto sampul (banner) via signed upload Cloudinary.
- Menampilkan email terdaftar dan role pengguna sebagai informasi read-only.
- Mengirim email reset password ke email terdaftar akun yang sedang login melalui integrasi module Auth.
- Melacak perubahan form yang belum disimpan (*dirty state tracking*) dan memproteksi navigasi dengan konfirmasi (*unsaved changes guard*).
- Menampilkan tautan langsung kontak WhatsApp (`wa.me`) pada tampilan profil read-only.
- Menampilkan Galeri Artikel milik pengguna sebagai pratinjau yang terhubung ke route preview artikel dashboard.

Seluruh role (`USER`, `ADMIN`, `SUPERADMIN`) memiliki hak akses yang sama untuk melihat dan memperbarui profil personal mereka sendiri. Module ini tidak mengizinkan pengubahan email, role, password secara langsung, status ban, maupun status soft delete.

---

## 2. Shared User Data Model

Profil pengguna menyatu langsung dengan model Prisma `User` pada table `users`. Tidak dibuat table `profiles` terpisah agar lifecycle identitas, autentikasi, dan metadata akun tetap berada dalam satu entitas canonical.

```prisma
enum UserRole {
  USER
  ADMIN
  SUPERADMIN
}

model User {
  id                  String    @id @default(uuid()) @db.Uuid
  name                String    @db.VarChar(160)
  email               String    @unique @db.VarChar(255)
  originalEmail       String?   @db.VarChar(255)
  password            String    @db.Text
  role                UserRole  @default(USER)
  avatarUrl           String?   @db.Text
  bannerUrl           String?   @db.Text
  bio                 String?   @db.Text
  whatsappCountryCode String?   @db.VarChar(8)
  whatsappNumber      String?   @db.VarChar(32)
  instagramUrl        String?   @db.Text
  xUrl                String?   @db.Text
  linkedinUrl         String?   @db.Text
  isBanned            Boolean   @default(false)
  bannedAt            DateTime? @db.Timestamptz(6)
  createdAt           DateTime  @default(now()) @db.Timestamptz(6)
  updatedAt           DateTime  @updatedAt @db.Timestamptz(6)
  deletedAt           DateTime? @db.Timestamptz(6)

  @@index([role, deletedAt, createdAt])
  @@index([isBanned, deletedAt])
  @@map("users")
}
```

### Pemetaan Field pada Account / Profile

| Field | Tipe | Akses Profile | Perilaku & Keterangan |
| --- | --- | --- | --- |
| `id` | `String (UUID)` | Read-only | Diambil dari server session actor (`requireCurrentUser`), tidak dipercaya dari input client. |
| `name` | `String` | Editable | Wajib diisi, panjang 2–160 karakter setelah di-trim. |
| `email` | `String` | Read-only | Ditampilkan di UI tetapi tidak dapat diubah melalui form profil. |
| `role` | `UserRole` | Read-only | Label tampilan (`User`, `Admin`, `SuperAdmin`), tidak dapat diubah mandiri. |
| `avatarUrl` | `String?` | Editable | URL gambar HTTPS permanen dari Cloudinary (rasio 1:1), nullable. |
| `bannerUrl` | `String?` | Editable | URL gambar HTTPS permanen dari Cloudinary (rasio 16:5), nullable. |
| `bio` | `String?` | Editable | Deskripsi personal teks bebas, maksimal 2.000 karakter, nullable. |
| `whatsappCountryCode` | `String?` | Editable | Digit kode negara telepon (1–7 digit, e.g. `62` tanpa tanda `+`), nullable. |
| `whatsappNumber` | `String?` | Editable | Digit nomor telepon lokal (5–32 digit tanpa awalan `0`), nullable. |
| `instagramUrl` | `String?` | Editable | Tautan profil Instagram valid (`https://...`), maksimal 2.048 karakter, nullable. |
| `xUrl` | `String?` | Editable | Tautan profil X/Twitter valid (`https://...`), maksimal 2.048 karakter, nullable. |
| `linkedinUrl` | `String?` | Editable | Tautan profil LinkedIn valid (`https://...`), maksimal 2.048 karakter, nullable. |
| `password` | `String` | Unexposed | Hash bcryptjs, tidak pernah di-query ke DTO profil dan tidak dimutasi langsung di halaman ini. |
| `isBanned`, `deletedAt` | `Boolean`, `DateTime?` | Guard only | Akun yang di-ban atau di-soft-delete otomatis ditolak saat memuat halaman atau menjalankan action. |

---

## 3. Route dan Rendering Architecture

### Server Component Route

File route canonical:

```text
src/app/dashboard/profile/page.tsx
```

Route ini beroperasi sebagai Server Component tipis:

1. Memanggil data fetcher server-only `getCurrentProfile()`.
2. `getCurrentProfile()` memanggil guard session `requireCurrentUser()`. Jika session tidak ada atau tidak valid, user diarahkan ke `/login?reason=session-invalid`.
3. Membaca data profil pengguna dari database menggunakan `profileSelect` yang aman.
4. Mengonversi record Prisma menjadi DTO serializable `ProfileData`.
5. Mengirimkan `ProfileData` sebagai prop `initialProfile` ke Client Component `ProfilePage`.

Komponen client tidak pernah mengimpor Prisma Client atau dependensi server rahasia.

---

## 4. Query Data Profile

Data access berada pada `src/modules/profile/data/`:

- `get-current-profile.ts`: Fungsi utama pengambilan data profil pengguna yang login.
- `profile.mapper.ts`: Mapper dan object Prisma select untuk memastikan keamanan field.

```ts
export const profileSelect = {
  id: true,
  name: true,
  email: true,
  role: true,
  avatarUrl: true,
  bannerUrl: true,
  bio: true,
  whatsappCountryCode: true,
  whatsappNumber: true,
  instagramUrl: true,
  xUrl: true,
  linkedinUrl: true,
} satisfies Prisma.UserSelect
```

### Aturan Query

- Wajib mengeksekusi `requireCurrentUser()` terlebih dahulu untuk mendapatkan ID pengguna dari session server yang tervalidasi.
- Query menerapkan filter integritas:
  ```ts
  where: {
    id: actor.id,
    isBanned: false,
    deletedAt: null,
  }
  ```
- Field sensitif seperti `password`, `originalEmail`, `bannedAt`, dan Redis session token tidak dimasukkan ke dalam `profileSelect`.

---

## 5. Validasi dan Normalisasi Input (Zod Schema)

Validasi form dan Server Action diatur dalam `src/modules/profile/schemas/profile.schema.ts` menggunakan Zod.

### Aturan Normalisasi & Validasi

1. **Empty String to Null**:
   Input string opsional yang kosong atau hanya berisi spasi dinormalisasi menjadi `null` sebelum divalidasi.
2. **Nama Lengkap (`name`)**:
   - Di-trim secara otomatis.
   - Minimal 2 karakter, maksimal 160 karakter.
3. **Bio (`bio`)**:
   - Teks opsional, maksimal 2.000 karakter.
4. **URL Media Sosial & Asset (`avatarUrl`, `bannerUrl`, `instagramUrl`, `xUrl`, `linkedinUrl`)**:
   - Wajib berupa URL valid dengan protokol `https://`.
   - Panjang maksimal 2.048 karakter.
   - Browser `blob:` URL atau data base64 ditolak oleh schema.
5. **Nomor WhatsApp (`whatsappCountryCode` & `whatsappNumber`)**:
   - `whatsappCountryCode`: Berisi 1–7 digit angka tanpa karakter khusus atau tanda `+`.
   - `whatsappNumber`: Berisi 5–32 digit angka tanpa kode negara dan tanpa awalan angka `0`.
   - **SuperRefine Mutual Dependency**: `whatsappCountryCode` dan `whatsappNumber` harus sama-sama diisi atau sama-sama `null`. Pengisian salah satu saja akan menghasilkan error validasi form.
6. **Field Terproteksi**:
   Schema mutasi profil tidak menerima field `id`, `email`, `role`, atau `password`.

---

## 6. Server Action dan Mutasi Profile

### Update Profile (`updateProfileAction`)

File implementasi:

```text
src/modules/profile/actions/update-profile.ts
```

Alur eksekusi mutasi:

1. **Authentication Guard**: Memanggil `requireCurrentUser()`. Jika session tidak valid, fungsi akan melempar exception atau redirect.
2. **Payload Parsing**: Memvalidasi input mentah menggunakan `updateProfileSchema.safeParse(input)`. Jika tidak valid, mengembalikan status gagal beserta `fieldErrors`.
3. **Database Transaction**:
   - Menjalankan `prisma.$transaction`.
   - Melakukan `transaction.user.updateMany` dengan kondisi `id = actor.id`, `isBanned = false`, dan `deletedAt = null`.
   - Mengambil kembali record terbaru dengan `profileSelect`.
4. **Cache Invalidation**:
   - Memanggil `revalidatePath("/dashboard/profile")` untuk membersihkan cache rendering server.
5. **Client Synchronization**:
   - Mengembalikan `ProfileActionResult` sukses beserta DTO profil teranyar.
   - Client Component memanggil `router.refresh()`, yang memicu layout dashboard mengevaluasi kembali user session sehingga komponen global seperti `Sidebar` langsung menampilkan nama dan avatar baru tanpa perlu logout.

---

## 7. Upload Asset Media (Avatar & Banner via Cloudinary)

Pengunggahan avatar dan banner dilakukan secara langsung dari browser ke Cloudinary menggunakan mekanisme signed upload yang aman.

### Flow Upload

1. **Permintaan Signature**:
   - Komponen `ImageUpload` memanggil Server Action `createImageUploadSignature("profile")`.
   - Server memvalidasi bahwa pemanggil memiliki session login aktif (`requireCurrentUser()`).
   - Server menetapkan folder tujuan secara tetap: `benah-palembang/profiles`.
   - Server membuat signature kriptografis menggunakan `CLOUDINARY_API_SECRET`.
2. **Client-side Crop**:
   - Pengguna memilih file lokal.
   - Dialog pemotong gambar (*crop modal*) membatasi rasio aspek sesuai peruntukan:
     - **Avatar**: Rasio `1:1` (kotak).
     - **Banner**: Rasio `16:5` (persegi panjang lebar).
3. **Direct Upload**:
   - Browser mengunggah file hasil crop langsung ke endpoint REST Cloudinary bersama parameter signed payload.
   - Cloudinary mengembalikan URL HTTPS permanen (`secure_url`).
4. **Penyimpanan Database**:
   - `secure_url` dimasukkan ke dalam state form profil dan disimpan ke PostgreSQL saat user menekan tombol "Simpan Profil".
   - Database tidak pernah menyimpan binary file atau URL lokal sementara.

---

## 8. Reset Password Flow

Pengguna dapat meminta pengiriman email pemulihan kata sandi langsung dari halaman profil melalui tombol **Kirim Email Reset Password**.

File implementasi:

```text
src/modules/profile/actions/request-profile-password-reset.ts
```

### Mekanisme Keamanan

- **Identitas Target Terverifikasi**: Alamat email penerima diambil langsung dari `actor.email` di session server terotentikasi, bukan dari form input client.
- **Integrasi Auth Module**: Memanfaatkan fungsi internal `requestPasswordReset(email)` milik module Auth:
  - Membuat token reset *opaque* acak.
  - Menyimpan hash SHA-256 token di Upstash Redis dengan masa berlaku (TTL) 10 menit.
  - Menerapkan *rate limiting* berbasis IP dan *cooldown* 60 detik per email.
  - Menjadwalkan pengiriman email via Nodemailer menggunakan fungsi `after()` Next.js agar tidak memblokir respon serverless.
- **Penanganan Feedback UI**:
  - Memberikan indikator loading saat proses berlangsung.
  - Menampilkan toast notifikasi berhasil atau pesan error sisa waktu *cooldown* secara informatif.

---

## 9. State Management dan Unsaved Changes

Halaman profil terintegrasi dengan `UnsavedChangesContext` untuk mencegah kehilangan data akibat navigasi yang tidak disengaja:

- **Dirty State Tracking**: Setiap perubahan pada input teks, nomor telepon, tautan media sosial, atau asset gambar akan memicu `setIsDirty(true)`.
- **Navigation Interception**: Jika pengguna berpindah menu sidebar atau menekan tombol navigasi saat form dalam keadaan *dirty*, modal konfirmasi akan muncul.
- **Save Handler Registration**: Fungsi `saveProfile` didaftarkan ke context (`registerSaveHandler`) sehingga aksi "Simpan Sekarang" dari dialog konfirmasi navigasi dapat mengeksekusi penyimpanan data yang sama dengan tombol utama.
- **Batal Edit (`cancelEdit`)**: Mengembalikan form draft ke salinan data snapshot database terakhir (`initialProfile` / state `profile` saat ini) serta menghapus error validasi.

---

## 10. Galeri Artikel (Integrasi Lintas Modul)

Pada bagian bawah halaman profil, terdapat bagian **Galeri Artikel** yang menampilkan karya artikel milik akun yang sedang login:

- **Presentasi Saat Ini**: Menggunakan kumpulan kartu artikel pratinjau (`DUMMY_ARTICLES`) yang menampilkan thumbnail, judul, jumlah *views*, dan *likes*.
- **Navigasi Pratinjau**: Setiap kartu dapat diklik untuk membuka halaman pratinjau publik artikel pada `/dashboard/article/preview/[id]`.
- **Integrasi Module Article**:
  - Ketika module Article aktif penuh, galeri ini akan memuat daftar artikel yang berelasi dengan `authorId = user.id`.
  - Views, likes, dan status publikasi dihitung secara dinamis dari tabel `articles` tanpa perlu menambahkan field artikel ke tabel `users`.

---

## 11. Struktur Direktori dan File

```text
src/
├── app/
│   └── dashboard/
│       └── profile/
│           └── page.tsx                    # Server Component route entry point
└── modules/
    └── profile/
        ├── actions/
        │   ├── request-profile-password-reset.ts  # Server Action kirim reset password
        │   └── update-profile.ts                  # Server Action mutasi update profil
        ├── components/
        │   └── profile-page.tsx                   # Client Component utama profil & form
        ├── data/
        │   ├── get-current-profile.ts             # Server-only query profil user aktif
        │   └── profile.mapper.ts                  # Prisma select & DTO mapper
        ├── schemas/
        │   └── profile.schema.ts                  # Zod validation & input normalizers
        └── types/
            └── profile.ts                         # TypeScript interfaces & DTO definitions
```

---

## 12. Keamanan dan Otorisasi

1. **Server-Side Session Boundary**: Seluruh query dan mutation memvalidasi session aktif melalui `requireCurrentUser()`.
2. **Strict Actor Scoping**: Setiap pembaruan data dibatasi secara ketat hanya untuk record dengan `id = actor.id`. Tidak ada parameter ID yang diterima dari URL atau body request client.
3. **Immutability of Critical Fields**: Field `email`, `role`, `password`, dan flag status akun (`isBanned`, `deletedAt`) tidak dapat diubah melalui endpoint profil.
4. **Session Revocation Compliance**: Jika akun pengguna di-ban atau di-soft-delete oleh administrator saat pengguna sedang aktif, query dan mutation profil akan langsung menolak akses.

---

## 13. Validasi dan Verifikasi Implementasi

Untuk memastikan integritas tipe dan fungsionalitas module, jalankan perintah verifikasi project:

```bash
# Validasi schema database
npx prisma validate

# Pemeriksaan type safety TypeScript
npx tsc --noEmit

# Linting kode
npm run lint

# Build verifikasi Next.js App Router
npm run build
```

### Skenario Smoke Check Manual

- [x] Akses `/dashboard/profile` dengan user terautentikasi (memastikan data SSR tampil sempurna).
- [x] Mengubah nama lengkap, bio, dan tautan media sosial, lalu menyimpan perubahan.
- [x] Memasukkan nomor WhatsApp lokal dengan format dial code internasional dan memastikan nilai terpisah dengan benar di database.
- [x] Mengunggah foto profil (rasio 1:1) dan banner (rasio 16:5) melalui Cloudinary widget.
- [x] Memastikan nama dan avatar pada `Sidebar` terbarui secara otomatis setelah profil disimpan.
- [x] Mencoba berpindah halaman saat form diedit untuk memastikan dialog *Unsaved Changes* muncul.
- [x] Menekan tombol *Kirim Email Reset Password* dan memastikan notifikasi toast cooldown/sukses muncul.
- [x] Memastikan email dan role tetap berstatus read-only dan tidak dapat dimanipulasi dari browser.
