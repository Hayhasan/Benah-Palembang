# Website Content Module

Module ini mengelola content presentasional website. Implementasi saat ini
mencakup landing page dengan root canonical `home`, hero halaman agenda dengan
root canonical `agenda`, halaman kolaborasi dengan root canonical
`collaboration`, serta konfigurasi global dengan root canonical `header-footer`.

## Scope awal

- Hero carousel.
- About section.
- Explore category items.
- Presentation configuration untuk featured/category article sections.
- Team section dan anggota tim.
- CTA section.
- Hero halaman agenda.
- Hero, kontak, dan konfigurasi form halaman kolaborasi.
- Partner logo dan partner content pada halaman kolaborasi.
- Logo global header, link footer, kontak, dan copyright.

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
- `website_agenda_contents`: root hero halaman agenda, expected satu active row
  dengan key `agenda`.
- `website_collaboration_contents`: root halaman kolaborasi, expected satu
  active row dengan key `collaboration`.
- `website_collaboration_partner_logos`: ordered partner logos.
- `website_collaboration_partner_contents`: ordered partner content beserta
  platform, thumbnail, link, dan aspect ratio.
- `website_header_footer_contents`: root konfigurasi global, expected satu
  active row dengan key `header-footer`.
- `website_footer_explore_links`: ordered link pada kolom Explore.
- `website_footer_connect_links`: ordered link pada kolom Connect.

Semua table menggunakan ID `Int`, timestamps, dan soft delete melalui
`deletedAt`.

## Seed

```text
npm run seed:website-content
```

Seeder memakai dummy content yang sama dengan landing page, hero agenda, halaman
kolaborasi, header, dan footer publik saat ini. Aggregate `home`, `agenda`,
`collaboration`, dan `header-footer` diperiksa secara independen, bersifat
create-if-missing, dan tidak menimpa content yang sudah tersedia.

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

## Public agenda page

- Route `/agenda` membaca root aktif `agenda` melalui Server Component pada
  setiap request.
- Prisma hanya menyediakan konfigurasi hero: background, alt, eyebrow, judul,
  dan deskripsi. Daftar acara tetap memakai mock data sampai module Agenda/Event
  tersedia.
- Jika root aktif tidak ditemukan, halaman memakai `DEFAULT_AGENDA_PAGE`. Error
  database tetap diteruskan dan tidak dianggap sebagai fallback.
- Filter dan aksi tampilkan seluruh agenda tetap berada pada Client Component,
  sedangkan initial hero berasal dari SSR.

## Public header dan footer

- Public layout membaca root aktif `header-footer` sekali pada server untuk
  setiap request.
- DTO serializable diberikan melalui provider Client Component agar Header pada
  layout dan Footer yang dirender oleh berbagai halaman memakai sumber data yang
  sama tanpa browser fetch tambahan.
- Logo, deskripsi, kontak, copyright, dan ordered link berasal dari Prisma.
- Jika root aktif tidak ditemukan, layout memakai
  `DEFAULT_HEADER_FOOTER_CONTENT`. Error database tetap diteruskan.
- Header navigasi Home, Article, Agenda, Collaboration, dan tombol auth tetap
  hardcoded karena belum menjadi field pada editor original.

## Dashboard editor

- Route `/dashboard/website` membaca aggregate aktif `home`, `agenda`,
  `collaboration`, dan `header-footer` pada Server Component dan mengirim DTO
  serializable ke form Client Component.
- Form Home mengelola hero carousel, about, explore, konfigurasi section
  artikel, team, dan CTA. Seluruh field yang ada pada schema Prisma bersifat
  controlled dan berasal dari data database.
- Tab Home, Agenda, Collaboration, dan Header & Footer memakai persistence
  database. Tab Article tetap dapat dibuka menggunakan UI frontend original dan
  belum mempunyai persistence.
- Perubahan disimpan melalui Server Action dengan validasi Zod dan transaction
  Prisma. Root scalar dan seluruh child collection disimpan sebagai satu
  aggregate.
- ID child yang dikirim form harus merupakan milik aggregate aktif terkait.
  Record tanpa ID dibuat sebagai row baru dan DTO hasil save mengembalikan ID
  `Int` dari database.
- Item aktif yang tidak lagi dikirim form di-soft-delete. Posisi child selalu
  dihitung ulang berdasarkan urutan form dan tidak mempercayai nilai posisi
  mentah dari client.
- Save handler melacak perubahan Home, Agenda, Collaboration, serta Header &
  Footer secara terpisah. Tombol Simpan Perubahan maupun save dari guard
  navigasi menyimpan seluruh module nyata yang masih dirty.
- Landing page selalu mempunyai lima article section fixed: Cerita Palembang,
  Gaya Hidup, Ruang Kota, Industri Kreatif, dan Kebudayaan. Admin dapat mengubah
  field presentasinya, tetapi tidak menambah, menghapus, atau mengubah urutannya.
- Image editor melakukan crop di browser, meminta signed upload parameters dari
  server, lalu mengunggah file langsung ke Cloudinary. Upload admin disimpan
  sebagai `secure_url`; canonical seed masih boleh menunjuk asset public internal
  seperti `/logo.png`. Database tidak pernah menyimpan file atau `blob:` URL.
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
