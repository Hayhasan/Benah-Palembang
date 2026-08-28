# Activity Log Module

Dokumen ini menjadi spesifikasi teknis dan rencana implementasi untuk modul **Activity Log (Log Aktivitas & Audit Trail)** pada platform Benah Palembang. Modul ini bertanggung jawab mencatat dan menampilkan rekaman jejak audit (*audit trail*) dari setiap peristiwa perubahan data dan aktivitas penting yang terjadi di seluruh sistem.

Aturan otorisasi modul merujuk pada [`docs/module/permission.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/module/permission.md) dan aturan arsitektur data merujuk pada [`docs/rules/project-structure.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/rules/project-structure.md).

---

## 1. Scope & Tujuan Modul

1. **Pencatatan Audit Trail Sentral:** Merekam mutasi data kritis lintas modul (Auth, Account Manage, Website Content, Article, Event, Manage Content, Profile) ke dalam PostgreSQL.
2. **Pencatatan Transaksional Atomik:** Memanfaatkan Prisma database transaction (`prisma.$transaction`) pada operasi mutasi bisnis, sehingga rekaman log dan mutasi data berhasil atau gagal bersamaan secara atomik tanpa menghasilkan *ghost/false log*.
3. **Snapshot State Perubahan (*Before* & *After*):** Menyimpan snapshot keadaan data sebelum (*beforeState*) dan sesudah (*afterState*) mutasi dalam format JSON terstruktur untuk kebutuhan transparansi dan investigasi audit.
4. **Halaman Dashboard Eksklusif:** Menampilkan daftar log aktivitas pada route canonical `/dashboard/logs` yang diproteksi khusus untuk peran **`SUPERADMIN`**.
5. **Fitur Dashboard:**
   - Tabel riwayat log dengan informasi identitas actor (*User* & *Role*), *Aksi*, *Modul*, *Deskripsi Ringkas*, *Waktu*, dan *Tombol Detail*.
   - Dialog modal inspeksi mendalam yang menampilkan perbandingan diff snapshot *Before* vs *After*.
   - Pencarian berbasis server (`q`) untuk mencocokkan nama user, deskripsi, modul, atau aksi.
   - Paginasi berbasis server (`page`) dengan ukuran 25 baris per halaman.
6. **Kebijakan Tanpa Seeder (*No Seeding Policy*):** Modul ini tidak menggunakan data tiruan (seeder); tabel `activity_logs` dimulai dalam kondisi bersih dan terisi murni dari aksi nyata pengguna di sistem.

---

## 2. Database Schema (Prisma)

Model `ActivityLog` ditempatkan pada PostgreSQL melalui Prisma Client.

```prisma
enum ActivityAction {
  CREATE
  UPDATE
  DELETE
  LOGIN
  LOGOUT
  APPROVE
  REJECT
  TAKEDOWN
  RESTORE
  BAN
  UNBAN
  CHANGE_ROLE
}

enum ActivityModule {
  AUTH
  PROFILE
  ACCOUNT
  WEBSITE
  ARTICLE
  EVENT
  CONTENT
}

model ActivityLog {
  id          Int            @id @default(autoincrement())
  userId      String?        @db.Uuid
  userName    String         @db.VarChar(160)
  userRole    UserRole       @default(USER)
  action      ActivityAction
  module      ActivityModule
  description String         @db.Text
  beforeState Json?          @db.JsonB
  afterState  Json?          @db.JsonB
  ipAddress   String?        @db.VarChar(64)
  userAgent   String?        @db.Text
  createdAt   DateTime       @default(now()) @db.Timestamptz(6)
  user        User?          @relation("UserActivityLogs", fields: [userId], references: [id], onDelete: SetNull)

  @@index([userId, createdAt])
  @@index([module, createdAt])
  @@index([action, createdAt])
  @@index([createdAt(sort: Desc)])
  @@map("activity_logs")
}
```

### Keputusan Desain Database:
1. **Primary Key `Int`:** Mengikuti standar tabel bisnis platform `Int @id @default(autoincrement())`.
2. **Snapshot Immutability (`userName` & `userRole`):** Menyimpan snapshot nama dan peran actor pada saat transaksi terjadi. Jika akun target di kemudian hari berganti peran, diubah namanya, atau di-soft-delete, rekaman riwayat audit masa lalu tidak akan terdistorsi.
3. **JSONB State (`beforeState` & `afterState`):** Menggunakan tipe `Json? @db.JsonB` agar efisien dalam penyimpanan dan mudah diekstrak pada modal dialog detail.
4. **Relasi Opsional & Protektif (`onDelete: SetNull`):** Foreign key `userId` bersifat nullable dengan relasi `onDelete: SetNull` agar penghapusan akun tidak merusak integritas tabel riwayat audit.
5. **Index Optimal:** Disediakan index gabungan pada `userId`, `module`, `action`, serta index urutan `createdAt DESC` untuk menjamin performa pencarian dan paginasi.

---

## 3. Kebijakan Tanpa Seeder (*No Seeding Policy*)

- Log aktivitas adalah rekaman historis operasional sistem, bukan master data statis atau konfigurasi awal aplikasi.
- **Tidak dibuat seeder `activity-log.seeder.ts`** dan tidak ada command `npm run seed:activity-log`.
- Tabel `activity_logs` akan dimulai dalam kondisi kosong pada database baru dan bertambah secara organik seiring aktivitas nyata pengguna.
- Komponen UI `/dashboard/logs` wajib menangani kondisi tabel kosong (*empty state*) secara elegan dengan pesan informatif (*"Belum ada aktivitas yang tercatat"*).

---

## 4. Helper Pencatatan Transaksional (`recordActivityLog`)

Helper pencatatan log ditempatkan di `src/modules/activity-log/data/record-activity-log.ts` dan dirancang agar mendukung eksekusi mandiri maupun eksekusi di dalam Prisma Transaction:

```ts
import "server-only"

import { Prisma } from "@prisma/client"
import { prisma } from "@/lib/db/prisma"
import type { ActivityAction, ActivityModule, UserRole } from "@prisma/client"

export interface RecordActivityLogParams {
  userId?: string | null
  userName: string
  userRole?: UserRole
  action: ActivityAction
  module: ActivityModule
  description: string
  beforeState?: Record<string, unknown> | null
  afterState?: Record<string, unknown> | null
  ipAddress?: string | null
  userAgent?: string | null
}

export async function recordActivityLog(
  params: RecordActivityLogParams,
  tx?: Prisma.TransactionClient,
) {
  const db = tx ?? prisma

  return db.activityLog.create({
    data: {
      userId: params.userId ?? null,
      userName: params.userName,
      userRole: params.userRole ?? "USER",
      action: params.action,
      module: params.module,
      description: params.description,
      beforeState: (params.beforeState as Prisma.InputJsonValue) ?? Prisma.DbNull,
      afterState: (params.afterState as Prisma.InputJsonValue) ?? Prisma.DbNull,
      ipAddress: params.ipAddress ?? null,
      userAgent: params.userAgent ?? null,
    },
  })
}
```

### Pola Integrasi:
1. **Di Dalam Database Transaction:**
   ```ts
   await prisma.$transaction(async (tx) => {
     // 1. Mutasi data utama
     const updated = await tx.article.update({ ... })
     
     // 2. Catat audit log dalam transaksi yang sama
     await recordActivityLog({
       userId: actor.id,
       userName: actor.name,
       userRole: actor.role,
       action: "APPROVE",
       module: "CONTENT",
       description: `Menyetujui artikel "${updated.title}"`,
       beforeState: { status: "PENDING_REVIEW" },
       afterState: { status: "PUBLISHED" },
     }, tx)
   })
   ```
2. **Aksi Non-Database Transaction (misal Login/Logout Auth):**
   ```ts
   await recordActivityLog({
     userId: user.id,
     userName: user.name,
     userRole: user.role,
     action: "LOGIN",
     module: "AUTH",
     description: "Pengguna berhasil login ke dashboard",
     afterState: { ip: clientIp, userAgent: clientUa },
     ipAddress: clientIp,
     userAgent: clientUa,
   })
   ```

---

## 5. Pemetaan Titik Pencatatan Event Lintas Modul

| Modul Domain | Aksi (`ActivityAction`) | Peristiwa yang Dicatat | Snapshot `beforeState` / `afterState` |
| :--- | :--- | :--- | :--- |
| **Auth** | `LOGIN` | Berhasil login ke dashboard | `afterState: { ip, device }` |
| | `LOGOUT` | Berhasil logout dari sistem | `beforeState: { session: "ACTIVE" }` |
| **Profile** | `UPDATE` | Memperbarui profil personal/kontak/avatar | `beforeState` vs `afterState` (bio, nama, whatsapp, foto) |
| **Account Manage** | `CREATE` | Membuat akun User / Admin baru | `afterState: { email, role, name }` |
| | `BAN` / `UNBAN` | Mengubah status blokir akun | `beforeState: { isBanned }` vs `afterState: { isBanned, reason }` |
| | `CHANGE_ROLE` | Mengubah peran akun (`USER <-> ADMIN`) | `beforeState: { role: "USER" }` vs `afterState: { role: "ADMIN" }` |
| | `DELETE` | Soft-delete akun pengguna | `beforeState: { deletedAt: null }` vs `afterState: { deletedAt }` |
| **Website Content** | `UPDATE` | Menyimpan perubahan konfigurasi konten web | `beforeState` vs `afterState` konfigurasi section terkait |
| **Article** | `CREATE` | Membuat draft / mengajukan review artikel | `afterState: { title, status, category }` |
| | `UPDATE` | Mengedit artikel milik sendiri | `beforeState` vs `afterState` data artikel |
| | `DELETE` | Mengarsipkan artikel (*Archive*) | `beforeState: { status: "PUBLISHED" }` vs `afterState: { deletedAt }` |
| **Event** | `CREATE` | Membuat draft / mengajukan review event | `afterState: { title, status, category, startsAt }` |
| | `UPDATE` | Mengedit event milik sendiri | `beforeState` vs `afterState` data event |
| | `DELETE` | Mengarsipkan event (*Archive*) | `beforeState: { status: "PUBLISHED" }` vs `afterState: { deletedAt }` |
| **Manage Content** | `APPROVE` | Menyetujui posting artikel atau event | `beforeState: { status: "PENDING_REVIEW" }` $\rightarrow$ `afterState: { status: "PUBLISHED" }` |
| | `REJECT` | Menolak pengajuan artikel atau event | `beforeState: { status: "PENDING_REVIEW" }` $\rightarrow$ `afterState: { status: "REJECTED", note }` |
| | `TAKEDOWN` | Menurunkan konten yang sudah tayang | `beforeState: { status: "PUBLISHED" }` $\rightarrow$ `afterState: { status: "TAKEN_DOWN", note }` |
| | `RESTORE` | Memulihkan konten yang di-takedown/reject | `beforeState: { status: "TAKEN_DOWN" }` $\rightarrow$ `afterState: { status: "PUBLISHED" }` |

---

## 6. Query Data Access Layer (DAL), Search & Paginasi

Fungsi query server-only `getActivityLogs` berada pada `src/modules/activity-log/data/get-activity-logs.ts`:

### Aturan Query:
- **Proteksi Akses:** Wajib memanggil `await requireRole(["SUPERADMIN"])`.
- **Paginasi Server:** Ukuran standar `pageSize = 25`, `page` minimal 1.
- **Pencarian Case-Insensitive (`q`):**
  Mencocokkan keyword pencarian terhadap:
  - `userName`
  - `description`
  - `action` (string match)
  - `module` (string match)
- **Sorting Default:** `createdAt DESC` (aktivitas terbaru tampil paling atas), diikuti `id DESC`.
- **Serialisasi DTO:** Waktu diformat menggunakan locale bahasa Indonesia dan timezone `Asia/Jakarta`, serta memetakan badge warna dan ikon presentasional yang aman dikirim ke Client Component.

---

## 7. Komposisi Halaman & Komponen UI

### 7.1. Route Server Component (`src/app/dashboard/logs/page.tsx`)
```tsx
import { requireRole } from "@/modules/auth/data/session-dal"
import { ActivityLogList } from "@/modules/activity-log/components/activity-log-list"
import { getActivityLogs } from "@/modules/activity-log/data/get-activity-logs"

interface PageProps {
  searchParams: Promise<{
    page?: string | string[]
    q?: string | string[]
  }>
}

export default async function Page({ searchParams }: PageProps) {
  await requireRole(["SUPERADMIN"])

  const params = await searchParams
  const data = await getActivityLogs({
    page: Array.isArray(params.page) ? params.page[0] : params.page,
    q: Array.isArray(params.q) ? params.q[0] : params.q,
  })

  return <ActivityLogList data={data} />
}
```

### 7.2. Komponen Client (`ActivityLogList` & `ActivityLogDetailDialog`)
- Memindahkan logic presentasi dari `src/features/dashboard/LogActivities.tsx` ke modul canonical `src/modules/activity-log/components/`.
- Menyediakan input pencarian dengan debounce atau URL sync (`router.push`).
- Menyediakan tabel responsif dan kontrol paginasi menggunakan komponen reusable `PaginationControls`.
- Dialog modal menampilkan:
  - Header: Identitas actor, role, modul, waktu, dan deskripsi aktivitas.
  - Kolom Kiri: Box merah *Sebelum (Before)* menampilkan JSON `beforeState` (atau label *"Tidak ada data sebelumnya / Record baru"* jika null).
  - Kolom Kanan: Box hijau *Sesudah (After)* menampilkan JSON `afterState` (atau label *"Record dihapus"* jika null).

---

## 8. Keamanan & Otorisasi

1. **Role Enforcement:** Sesuai matriks RBAC platform, hanya akun dengan peran **`SUPERADMIN`** yang diizinkan mengakses halaman `/dashboard/logs` dan query `getActivityLogs`.
2. **Redirect Otomatis:**
   - Peran `USER` yang mencoba mengakses `/dashboard/logs` dialihkan otomatis ke `/dashboard/create-article`.
   - Peran `ADMIN` yang mencoba mengakses `/dashboard/logs` dialihkan otomatis ke `/dashboard`.
3. **Data Sanitization:** Data sensitif seperti password plaintext atau password hash bcrypt **tidak pernah** dimasukkan ke dalam `beforeState` maupun `afterState`.

---

## 9. Struktur Direktori Modul

```text
src/modules/activity-log/
├── components/
│   ├── activity-log-detail-dialog.tsx  # Dialog modal inspeksi Before vs After
│   └── activity-log-list.tsx           # Client Component utama tabel log & search
├── data/
│   ├── activity-log.mapper.ts          # Mapper Prisma row ke DTO presentasional
│   ├── get-activity-logs.ts            # Server-only DAL query (search & pagination)
│   └── record-activity-log.ts          # Server helper transaksional untuk mencatat log
├── schemas/
│   └── activity-log-query.schema.ts    # Zod schema validasi parameter URL query
└── types/
    └── activity-log.ts                 # TypeScript DTO & interface definitions
```

---

## 10. Implementation Plan & Checklist Validasi

- [x] **1. Schema Prisma & Database Migration:**
  - Tambahkan enum `ActivityAction`, `ActivityModule`, dan model `ActivityLog` pada `prisma/schema.prisma`.
  - Tambahkan relasi `activityLogs ActivityLog[]` pada model `User`.
  - Jalankan `npx prisma format` dan terapkan migrasi database PostgreSQL (`20260828201447_add_activity_log_module`).
- [x] **2. Data Access Layer & Logger Helper:**
  - Buat `record-activity-log.ts` yang menerima parameter transaksi opsional (`tx?: Prisma.TransactionClient`).
  - Buat schema query Zod `activity-log-query.schema.ts`.
  - Buat mapper DTO `activity-log.mapper.ts`.
  - Buat DAL query `get-activity-logs.ts` dengan guard `requireRole(["SUPERADMIN"])`.
- [x] **3. UI Components & Route Integration:**
  - Buat `activity-log-detail-dialog.tsx` dan `activity-log-list.tsx`.
  - Hubungkan `src/app/dashboard/logs/page.tsx` ke query database real.
  - Hapus mock data lama di `src/features/dashboard/LogActivities.tsx`.
- [x] **4. Integrasi Logging Transaksional pada Modul Utama:**
  - Pasang pencatatan log pada mutasi **Manage Content** (`approve`, `reject`, `takedown`, `restore`).
  - Pasang pencatatan log pada mutasi **Account Manage** (`create`, `ban`, `unban`, `change-role`, `delete`).
  - Pasang pencatatan log pada mutasi **Profile** (`update-profile`).
  - Pasang pencatatan log pada mutasi **Website Content** (`update-landing-page`, `update-agenda-page`, `update-article-category-pages`, `update-collaboration-page`, `update-header-footer-content`).
  - Pasang pencatatan log pada mutasi **Article & Event** (`save`, `post`, `archive`).
  - Pasang pencatatan log pada mutasi **Auth** (`login`, `logout`).
- [x] **5. Validasi & Pengujian:**
  - `npx prisma validate`
  - `npx tsc --noEmit`
  - `npm run lint`
  - `npm run build`

