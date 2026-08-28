# Seeding Rules

Dokumen ini mengatur penamaan, struktur, keamanan, dan validasi seeding Prisma.
Seed digunakan untuk bootstrap dummy content yang dibutuhkan aplikasi, bukan
sebagai mekanisme migration atau reset data rutin.

## 1. Konvensi command

Command seed mengikuti nama module/use case yang memiliki data, bukan nama route
atau nama halaman frontend.

```text
npm run seed
npm run seed:website-content
```

- `npm run seed` menjalankan seluruh seeder aplikasi melalui runner utama.
- `npm run seed:website-content` hanya menjalankan seeder module website
  content, termasuk aggregate `home`, `agenda`, `collaboration`,
  `header-footer`, dan seluruh child table terkait.
- Seeder berikutnya mengikuti pola `npm run seed:<module-name>`, misalnya
  `seed:article` atau `seed:event`.
- Jangan membuat command terpisah untuk setiap child table jika table-table
  tersebut merupakan satu aggregate/use case yang sama.

## 2. Struktur file

```text
prisma/
  seed.ts
  seeders/
    website-content.seeder.ts
```

- `prisma/seed.ts` adalah aggregate runner untuk seluruh module.
- File di `prisma/seeders/` memiliki satu export utama per module.
- Seeder boleh memakai default data dari module aplikasi selama file tersebut
  berupa data/type murni dan tidak bergantung pada React atau API Next.js.
- Jangan menaruh seluruh dummy data dan logic seeding dalam satu file besar.

## 3. Sumber data canonical

- Seed website content menggunakan default content yang sama dengan fallback
  landing page, halaman kategori artikel, halaman agenda, halaman kolaborasi,
  header, dan footer.
- Nilai awal mengikuti tampilan public landing page yang aktif, bukan nilai form
  dashboard yang berbeda atau sudah tertinggal.
- Default content tidak boleh diduplikasi di public component, dashboard form,
  dan seeder.
- Image seed disimpan sebagai URL string. Jangan menyimpan file, base64, atau
  browser `blob:` URL ke database.
- Semua record hasil seed dibuat sebagai record aktif dengan `deletedAt = null`.

## 4. Idempotency

- Semua seeder wajib aman dijalankan lebih dari sekali.
- Seeder website content mencari root row dengan key canonical `home`,
  `agenda`, `collaboration`, dan `header-footer` secara independen.
- Jika salah satu aggregate sudah aktif, seeder melewati aggregate tersebut
  tanpa menghalangi pembuatan aggregate lain yang belum ada.
- Seeder tidak menimpa perubahan yang dibuat admin pada aggregate yang sudah
  tersedia.
- Seed default menggunakan pola create-if-missing, bukan update seluruh content
  setiap kali command dijalankan.
- Seeder tidak boleh memakai ID sementara seperti `Date.now()` untuk data yang
  membutuhkan identifier deterministic.
- ID model bisnis menggunakan `Int` auto-increment dari database. Seeder tidak
  perlu menentukan ID secara manual kecuali ada alasan relasi yang eksplisit.
- Seed `User` mengikuti aturan UUID dan tidak menggunakan `Int`.
- Jika suatu module membutuhkan update data seed yang sudah ada, perubahan itu
  harus dibuat eksplisit dan didokumentasikan; jangan menyelipkannya ke seed
  bootstrap biasa.
- Penambahan field wajib pada lima article section yang sudah ada dilakukan lewat
  migration backfill. Seeder tetap create-if-missing dan tidak mengubah konten
  admin yang sudah tersimpan.

## 5. Transaction dan urutan data

- Setiap root website content dan seluruh child miliknya dibuat dalam satu
  transaction per aggregate.
- Jika satu child gagal dibuat, seluruh aggregate harus rollback.
- Child collection menyimpan `position` secara eksplisit agar urutan tidak
  bergantung pada ID atau waktu pembuatan.
- Seeder aggregate dijalankan sesuai dependency. Contohnya, pin artikel baru
  dapat dibuat setelah Article dan artikel dummy tersedia.
- Jangan membuat relasi sementara menggunakan judul/nama jika nantinya relasi
  tersebut harus menggunakan foreign key.

## 6. Batas perubahan data

- Seeder bootstrap tidak boleh menghapus atau mereset data yang sudah ada.
- Jangan memakai `deleteMany` pada table bisnis sebagai bagian dari seed normal.
- Reset atau destructive seed harus menjadi command berbeda, diberi nama jelas,
  dan hanya dibuat jika memang diminta.
- Menjalankan migration tidak boleh secara otomatis menimpa website content.
- Seed production tidak dijalankan otomatis bersama deployment kecuali sudah
  ada keputusan dan guard khusus.

## 7. Environment dan keamanan

- Seeder memvalidasi keberadaan `DATABASE_URL` sebelum mulai.
- Gunakan koneksi Prisma yang sama dengan aplikasi dan selalu disconnect melalui
  blok `finally`.
- Seeder mengembalikan exit code non-zero ketika gagal.
- Jangan mencetak connection string, credential, API key, atau secret ke log.
- Seed pada environment production harus ditolak secara default atau memerlukan
  flag persetujuan yang eksplisit.

## 8. Logging

Log seeder harus ringkas dan menjelaskan hasil yang penting:

```text
[website-content:home] creating default content
[website-content:home] created
[website-content:collaboration] skipped: canonical content already exists
[website-content:header-footer] skipped: canonical content already exists
[website-content:agenda] skipped: canonical content already exists
```

- Jangan mencetak seluruh content atau payload yang panjang.
- Bedakan hasil `created`, `skipped`, dan `failed`.
- Runner utama menampilkan module mana yang sedang diproses.

## 9. Validasi hasil

Sesuai aturan project, pengembangan feature termasuk seeding tidak mewajibkan
pembuatan test case atau penambahan test framework. Validasi dilakukan dengan
command dan pemeriksaan runtime yang proporsional.

Setelah implementasi Prisma atau seeder, lakukan kombinasi validasi yang relevan:

```text
npx prisma format
npx prisma validate
npm run seed:website-content
npx tsc --noEmit
npm run lint
npm run build
```

Ketentuan validasi:

- Jalankan `seed:website-content` pada database yang belum mempunyai root
  website content dan pastikan aggregate berhasil dibuat.
- Jalankan command yang sama untuk kedua kali dan pastikan hasilnya `skipped`,
  bukan membuat duplicate atau menimpa data.
- Pastikan hanya terdapat satu root row aktif untuk key `home`, `agenda`,
  `collaboration`, dan `header-footer`.
- Pastikan child collection terbaca sesuai `position`.
- Pastikan public landing page, dynamic route kategori artikel, `/agenda`,
  `/kolaborasi`, serta public layout Header/Footer dapat membaca hasil seed
  melalui Server Component.
- Pastikan fallback masing-masing halaman tetap tampil ketika root row terkait
  tidak ditemukan.
- Minimal jalankan typecheck/lint atau build sesuai luas perubahan. Untuk
  perubahan backend yang memengaruhi render Next.js, `npm run build` menjadi
  validasi akhir yang diutamakan.

## 10. Kriteria selesai

Seeding suatu module dianggap selesai jika:

- Command module tersedia dan berhasil dijalankan.
- Data dibuat dalam transaction dan sesuai schema.
- Command aman dijalankan ulang tanpa duplicate atau overwrite.
- Error menghasilkan exit code non-zero dan Prisma Client selalu disconnect.
- Public/server query dapat membaca data yang dibuat.
- Validasi Prisma dan validasi project yang relevan berhasil.
- Tidak ada test case baru yang diwajibkan, kecuali diminta secara eksplisit.
