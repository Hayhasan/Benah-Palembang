# Health Check & Keep-Alive Module

Modul Health Check menyediakan satu endpoint publik-terbatas yang memeriksa
kesehatan seluruh service eksternal yang dipakai platform Benah Palembang, lalu
mengembalikan hasilnya sebagai JSON. Endpoint ini dipanggil otomatis oleh Vercel
Cron sehingga sekaligus berfungsi sebagai *keep-alive* untuk database Supabase
free tier.

Route canonical:

```text
GET /api/ping
```

Struktur module mengikuti [`docs/rules/project-structure.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/rules/project-structure.md).

---

## 1. Tujuan dan Ruang Lingkup

Modul ini memiliki dua tujuan yang dijalankan dalam satu request:

1. **Keep-alive database.** Supabase free tier mem-*pause* project yang tidak
   menerima aktivitas database selama tujuh hari berturut-turut. Health check
   mengeksekusi satu query nyata (`count`) ke table `users` sehingga project
   selalu terhitung aktif.
2. **Monitoring service eksternal.** Satu request memverifikasi empat
   dependency runtime: PostgreSQL (Supabase), Upstash Redis, Cloudinary, dan
   SMTP. Hasilnya dilaporkan per service beserta latensi.

Di luar cakupan (*non-goals*):

- Tidak menyimpan riwayat hasil health check ke database atau Redis.
- Tidak mengirim alert/notifikasi ketika ada service yang gagal.
- Tidak memeriksa halaman publik, session pengguna, atau health per-role.
- Bukan endpoint metrik aplikasi (jumlah artikel, event, atau statistik bisnis).

---

## 2. Struktur File

```text
src/app/api/ping/
  route.ts

src/modules/health/
  constants/health.ts
  data/check-cloudinary.ts
  data/check-database.ts
  data/check-redis.ts
  data/check-smtp.ts
  data/health.mapper.ts
  data/run-health-check.ts
  data/with-timeout.ts
  types/health.ts

vercel.json
```

| File | Tanggung jawab |
| :--- | :--- |
| `src/app/api/ping/route.ts` | Route Handler tipis: verifikasi secret, panggil orchestrator, tentukan HTTP status. |
| `constants/health.ts` | Timeout per service, daftar service kritikal, dan nama service canonical. |
| `data/check-*.ts` | Satu file per dependency; hanya berisi cara memanggil service dan membaca hasilnya. |
| `data/with-timeout.ts` | Helper `Promise.race` agar satu service lambat tidak menahan seluruh response. |
| `data/run-health-check.ts` | Menjalankan seluruh checker secara paralel dan menangkap error tiap checker. |
| `data/health.mapper.ts` | Memetakan hasil checker menjadi DTO response yang serializable. |
| `types/health.ts` | DTO dan union type status yang dipakai route serta mapper. |

Seluruh file di `src/modules/health/data` bersifat server-only karena memakai
Prisma, secret Cloudinary, token Upstash, dan credential SMTP.

---

## 3. Detail Pemeriksaan per Service

| Service | Cara pemeriksaan | Sumber client | Kritikal | Timeout |
| :--- | :--- | :--- | :---: | ---: |
| `database` | `prisma.user.count()` | `src/lib/db/prisma.ts` | Ya | 5.000 ms |
| `redis` | `redis.ping()` | `src/lib/redis/redis.ts` | Ya | 5.000 ms |
| `cloudinary` | `client.api.ping()` (Admin API) | `src/lib/cloudinary/cloudinary.ts` | Tidak | 8.000 ms |
| `smtp` | `transporter.verify()` | `src/modules/auth/data/mailer.ts` | Tidak | 8.000 ms |

Aturan implementasi:

- Checker **wajib memakai client yang sudah ada**. Modul ini dilarang membuat
  Prisma Client, instance Upstash Redis, konfigurasi Cloudinary, atau transporter
  Nodemailer kedua.
- Pemeriksaan SMTP memakai `verifySmtpConnection()` yang diekspor dari
  `src/modules/auth/data/mailer.ts` agar transporter dan validasi environment
  SMTP tetap punya satu sumber canonical.
- `prisma.user.count()` dipilih karena table `users` selalu ada sejak First Time
  Setup dan query-nya murah. Jumlah baris hanya dipakai sebagai bukti bahwa
  query benar-benar dieksekusi, bukan sebagai metrik bisnis.
- Seluruh checker dijalankan paralel dengan `Promise.all` atas pembungkus yang
  sudah menangkap error, sehingga durasi total mendekati service paling lambat
  (± 8 detik), bukan akumulasi keempatnya.
- Setiap checker mengukur latensi sendiri dengan `Date.now()` dan tetap
  melaporkan latensi walaupun statusnya gagal.
- Kegagalan konfigurasi (environment variable kosong) diperlakukan sama dengan
  kegagalan koneksi: service tersebut `unhealthy` dengan pesan error.

### 3.1. Keamanan pesan error

Pesan error dari dependency diteruskan ke response agar berguna saat debugging,
dengan dua pembatasan:

- Pesan dipotong maksimal 200 karakter.
- Nilai environment rahasia (token Upstash, API secret Cloudinary, app password
  SMTP) yang kebetulan muncul di pesan diganti menjadi `***`.

---

## 4. Aturan Status Agregat

Status per service hanya `healthy` atau `unhealthy`. Status keseluruhan
diturunkan dari kombinasi keduanya:

| Kondisi | `status` | `healthy` | HTTP |
| :--- | :--- | :---: | ---: |
| Seluruh service `healthy` | `healthy` | `true` | `200` |
| Hanya service non-kritikal gagal (Cloudinary/SMTP) | `degraded` | `false` | `200` |
| Minimal satu service kritikal gagal (Database/Redis) | `unhealthy` | `false` | `503` |

Alasan pemisahan ini: Database dan Redis membuat aplikasi tidak dapat melayani
request sama sekali (data dan session), sedangkan Cloudinary dan SMTP hanya
melumpuhkan sebagian fitur (upload gambar dan email reset password). Cron job
yang gagal total (`503`) tampil sebagai *failed execution* di dashboard Vercel,
sementara kondisi `degraded` tetap `200` agar riwayat cron tidak dipenuhi
kegagalan untuk gangguan parsial.

Response selalu memakai header `Cache-Control: no-store` dan route
memakai `export const dynamic = "force-dynamic"` supaya hasilnya tidak pernah
di-cache dan query database benar-benar dijalankan setiap cron berjalan.

---

## 5. Kontrak Response

### 5.1. Semua service sehat (`200`)

```json
{
  "status": "healthy",
  "healthy": true,
  "timestamp": "2026-09-04T03:00:04.512Z",
  "durationMs": 842,
  "summary": { "total": 4, "healthy": 4, "unhealthy": 0 },
  "services": {
    "database": {
      "status": "healthy",
      "critical": true,
      "latencyMs": 214,
      "detail": "user count: 27",
      "error": null
    },
    "redis": {
      "status": "healthy",
      "critical": true,
      "latencyMs": 96,
      "detail": "PONG",
      "error": null
    },
    "cloudinary": {
      "status": "healthy",
      "critical": false,
      "latencyMs": 391,
      "detail": "ok",
      "error": null
    },
    "smtp": {
      "status": "healthy",
      "critical": false,
      "latencyMs": 838,
      "detail": "smtp.gmail.com:465",
      "error": null
    }
  }
}
```

### 5.2. Gangguan parsial (`200`, `degraded`)

```json
{
  "status": "degraded",
  "healthy": false,
  "timestamp": "2026-09-04T03:00:09.117Z",
  "durationMs": 8123,
  "summary": { "total": 4, "healthy": 3, "unhealthy": 1 },
  "services": {
    "smtp": {
      "status": "unhealthy",
      "critical": false,
      "latencyMs": 8001,
      "detail": null,
      "error": "smtp timeout setelah 8000 ms."
    }
  }
}
```

### 5.3. Service kritikal gagal (`503`, `unhealthy`)

Struktur JSON identik dengan contoh sebelumnya, dengan `status: "unhealthy"` dan
`database` atau `redis` bernilai `unhealthy`.

### 5.4. Field response

| Field | Tipe | Keterangan |
| :--- | :--- | :--- |
| `status` | `"healthy" \| "degraded" \| "unhealthy"` | Status agregat sesuai bagian 4. |
| `healthy` | `boolean` | `true` hanya bila seluruh service sehat. |
| `timestamp` | ISO 8601 | Waktu response dibuat (UTC). |
| `durationMs` | `number` | Durasi seluruh health check. |
| `summary` | object | Jumlah service total, sehat, dan gagal. |
| `services.<name>.status` | `"healthy" \| "unhealthy"` | Status satu service. |
| `services.<name>.critical` | `boolean` | Menentukan apakah kegagalan menjadi `unhealthy` atau `degraded`. |
| `services.<name>.latencyMs` | `number` | Latensi pemeriksaan service. |
| `services.<name>.detail` | `string \| null` | Bukti hasil pemeriksaan saat sehat. |
| `services.<name>.error` | `string \| null` | Pesan error yang sudah dipotong dan disensor saat gagal. |

---

## 6. Akses Endpoint

`/api/ping` adalah endpoint publik tanpa autentikasi dan tanpa `CRON_SECRET`.
Keputusan ini diambil karena endpoint bersifat murni health/trigger:

- Hanya menerima method `GET`. Method lain otomatis dijawab `405` oleh Next.js
  karena tidak diekspor pada Route Handler.
- Tidak menerima parameter, body, maupun query dari pemanggil, sehingga tidak
  ada input yang perlu divalidasi.
- Seluruh operasi bersifat read-only: `count`, `ping`, dan `verify`. Tidak ada
  satu pun record yang dibuat, diubah, atau dihapus.
- Response hanya berisi status service, latensi, dan jumlah baris `users`.
  Tidak ada data pengguna, konten, maupun nilai environment yang dikembalikan.
- Tidak memakai session dan tidak memerlukan `requireCurrentUser()`. Endpoint
  ini berada di luar cakupan RBAC pada [`docs/module/permission.md`](file:///Users/lanstheprodigy/Data/project/benah-palembang/docs/module/permission.md).
- Pesan error tetap dipotong dan disensor sesuai bagian 3.1 agar detail
  infrastruktur tidak bocor lewat response publik.

Konsekuensi yang diterima: siapa pun yang tahu URL-nya dapat memanggil endpoint
ini dan setiap panggilan memakai satu request Admin API Cloudinary serta satu
autentikasi SMTP. Selama endpoint tidak dipublikasikan dan hanya dipanggil cron
harian, konsumsi kuotanya tidak signifikan. Bila suatu saat endpoint dipanggil
sangat sering di luar kendali, mitigasinya adalah menambahkan cache hasil health
check di Redis dengan TTL pendek atau membatasi checker Cloudinary/SMTP, bukan
menambah secret.

Contoh pemanggilan manual:

```bash
curl -s https://<domain>/api/ping
```

---

## 7. Konfigurasi Vercel Cron (Free/Hobby Tier)

`vercel.json` di root project:

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "crons": [
    {
      "path": "/api/ping",
      "schedule": "0 3 * * *"
    }
  ]
}
```

Batasan Hobby plan yang menjadi dasar konfigurasi di atas:

| Batasan Hobby | Dampak pada desain |
| :--- | :--- |
| Maksimal 2 cron job per project | Cukup satu entry; sisa kuota disimpan untuk kebutuhan lain. |
| Jadwal hanya boleh sekali per hari | Memakai `0 3 * * *`, bukan interval per jam/menit. |
| Waktu eksekusi tidak presisi (dapat bergeser dalam rentang jam tersebut) | Tidak boleh ada logic yang bergantung pada menit eksekusi. |
| Cron hanya berjalan pada deployment production | Preview deployment dan localhost tetap bisa dites manual dengan `curl`. |
| Timeout function terbatas | Route memakai `export const maxDuration = 30` dengan total timeout checker maksimal ± 8 detik. |

Catatan jadwal: `0 3 * * *` adalah 03.00 UTC atau 10.00 WIB. Jadwal harian jauh
di bawah ambang tujuh hari inaktivitas Supabase, sehingga satu cron per hari
sudah cukup menahan project agar tidak ter-*pause* bahkan bila beberapa
eksekusi gagal berturut-turut.

---

## 8. Environment Variable

| Variable | Wajib | Keterangan |
| :--- | :---: | :--- |
| `DATABASE_URL` | Ya | Dipakai checker database melalui Prisma Client. |
| `UPSTASH_REDIS_REST_URL`, `UPSTASH_REDIS_REST_TOKEN` | Ya | Dipakai checker Redis. |
| `CLOUDINARY_CLOUD_NAME`, `CLOUDINARY_API_KEY`, `CLOUDINARY_API_SECRET` | Ya | Dipakai checker Cloudinary. |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_SECURE`, `SMTP_USER`, `SMTP_APP_PASSWORD` | Ya | Dipakai checker SMTP. |

Module ini tidak menambah environment variable baru. Seluruh variable di atas
sudah dipakai module lain, sehingga health check gagal hanya bila konfigurasi
aplikasi memang belum lengkap pada environment tersebut.

---

## 9. Catatan Operasional

- **Kuota Cloudinary Admin API.** `api.ping()` terhitung sebagai request Admin
  API (limit free tier ratusan request per jam). Satu cron harian ditambah
  pengecekan manual sesekali tidak mendekati limit, tetapi endpoint ini tidak
  boleh dipasang pada monitoring yang memanggil tiap menit tanpa mengganti
  strategi checker Cloudinary.
- **Biaya SMTP.** `verify()` membuka koneksi dan melakukan autentikasi SMTP
  tanpa mengirim email, jadi tidak memakan kuota pengiriman Gmail.
- **Upstash.** `ping()` terhitung satu command terhadap kuota harian Upstash
  free tier dan tidak menyentuh key session mana pun.
- **Proxy.** `src/proxy.ts` ikut memproses `/api/ping` dan menetapkan cookie
  `benah_device_id` pada response cron. Efeknya hanya satu header `Set-Cookie`
  yang diabaikan Vercel Cron.
- **Monitoring eksternal.** Bila di kemudian hari dibutuhkan pengecekan lebih
  sering daripada satu kali sehari, gunakan uptime monitor eksternal yang
  memanggil `/api/ping`, bukan menambah cron Vercel yang tidak diizinkan pada
  Hobby plan. Interval monitor sebaiknya tidak lebih rapat dari lima menit agar
  kuota Admin API Cloudinary tetap aman.
- **Pengembangan lanjutan yang mungkin.** Penyimpanan riwayat status,
  filter `?service=`, dan notifikasi ke email/webhook saat status `unhealthy`
  dapat ditambahkan tanpa mengubah kontrak response pada bagian 5.
