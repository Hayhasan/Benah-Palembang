# Website Content Module

Module ini mengelola content presentasional website. Implementasi saat ini
mencakup landing page dengan root canonical `home` dan halaman kolaborasi dengan
root canonical `collaboration`.

## Scope awal

- Hero carousel.
- About section.
- Explore category items.
- Presentation configuration untuk featured/category article sections.
- Team section dan anggota tim.
- CTA section.
- Hero, kontak, dan konfigurasi form halaman kolaborasi.
- Partner logo dan partner content pada halaman kolaborasi.

Data artikel belum menjadi bagian dari module ini. Article card tetap menjadi
tanggung jawab module Article, sedangkan website content hanya menyimpan
konfigurasi tampilan section.

## Database tables

- `website_contents`: root landing page, expected satu active row dengan key
  `home`.
- `website_hero_slides`: ordered hero carousel items.
- `website_explore_items`: ordered explore/category links.
- `website_article_sections`: ordered presentation configuration untuk article
  sections.
- `website_team_members`: ordered team members.
- `website_collaboration_contents`: root halaman kolaborasi, expected satu
  active row dengan key `collaboration`.
- `website_collaboration_partner_logos`: ordered partner logos.
- `website_collaboration_partner_contents`: ordered partner content beserta
  platform, thumbnail, link, dan aspect ratio.

Semua table menggunakan ID `Int`, timestamps, dan soft delete melalui
`deletedAt`.

## Seed

```text
npm run seed:website-content
```

Seeder memakai dummy content yang sama dengan landing page dan halaman
kolaborasi publik saat ini. Aggregate `home` dan `collaboration` diperiksa secara
independen, bersifat create-if-missing, dan tidak menimpa content yang sudah
tersedia.

## Public landing page

- Route `/` membaca root aktif `home` melalui Server Component pada setiap
  request.
- Query hanya mengambil child aktif, lalu mengurutkannya berdasarkan
  `position`.
- Hasil Prisma dipetakan menjadi `LandingPageData` sebelum diberikan ke UI.
- Jika root aktif `home` tidak ditemukan, halaman memakai
  `DEFAULT_LANDING_PAGE`. Error database tetap diteruskan dan tidak dianggap
  sebagai fallback.
- Hero carousel menjadi Client Component tersendiri. Section landing lain tetap
  berupa Server Component agar JavaScript client tidak membesar tanpa kebutuhan.
- Data artikel masih menggunakan mock Article sampai module Article tersedia.

## Public collaboration page

- Route `/kolaborasi` membaca root aktif `collaboration` melalui Server
  Component pada setiap request.
- Logo dan partner content yang diambil hanya record aktif dan visible, lalu
  diurutkan berdasarkan `position`.
- Jika root aktif tidak ditemukan, halaman memakai
  `DEFAULT_COLLABORATION_PAGE`. Error database tetap diteruskan.
- Interaksi menampilkan seluruh partner content berada pada Client Component,
  sedangkan initial data tetap berasal dari SSR.

## Dashboard editor

- Route `/dashboard/website` membaca aggregate aktif `home` pada Server
  Component dan mengirim DTO serializable ke form Client Component.
- Form Home mengelola hero carousel, about, explore, konfigurasi section
  artikel, team, dan CTA. Seluruh field yang ada pada schema Prisma bersifat
  controlled dan berasal dari data database.
- Tab Home dan Collaboration memakai persistence database. Tab Article, Agenda,
  serta Header & Footer tetap dapat dibuka menggunakan UI frontend original dan
  belum mempunyai persistence.
- Perubahan disimpan melalui Server Action dengan validasi Zod dan transaction
  Prisma. Root scalar dan seluruh child collection disimpan sebagai satu
  aggregate.
- ID child yang dikirim form harus merupakan milik root aktif `home`. Record
  tanpa ID dibuat sebagai row baru dan DTO hasil save mengembalikan ID `Int`
  dari database.
- Item aktif yang tidak lagi dikirim form di-soft-delete. Posisi child selalu
  dihitung ulang berdasarkan urutan form dan tidak mempercayai nilai posisi
  mentah dari client.
- Save handler melacak perubahan Home dan Collaboration secara terpisah. Tombol
  Simpan Perubahan maupun save dari guard navigasi menyimpan seluruh module
  nyata yang masih dirty.
- Landing page selalu mempunyai lima article section fixed: Cerita Palembang,
  Gaya Hidup, Ruang Kota, Industri Kreatif, dan Kebudayaan. Admin dapat mengubah
  field presentasinya, tetapi tidak menambah, menghapus, atau mengubah urutannya.
- Image editor melakukan crop di browser, meminta signed upload parameters dari
  server, lalu mengunggah file langsung ke Cloudinary. Database hanya menerima
  `secure_url` hasil Cloudinary dan tidak pernah menyimpan file atau `blob:` URL.
- Form terhubung ke `UnsavedChangesContext`, sehingga navigasi saat dirty dapat
  menjalankan save handler yang sama dengan tombol Simpan Perubahan.

## Batasan autentikasi saat ini

Dashboard masih memakai `AuthContext` client-only dan project belum mempunyai
server session maupun model User. Karena itu, visibilitas route dashboard belum
menjadi authorization boundary yang aman untuk Server Action.

Sebelum feature ini dipakai di production, action update website content wajib
memanggil guard server yang:

- Memastikan session user valid.
- Membatasi role ke `admin` atau `superadmin`.
- Tidak mempercayai role, email, atau user ID yang dikirim oleh client.

TODO tersebut ditempatkan langsung pada awal Server Action agar tidak terlewat
saat module auth backend diimplementasikan.
