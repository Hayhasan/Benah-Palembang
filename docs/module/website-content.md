# Website Content Module

Module ini mengelola content presentasional website. Implementasi saat ini
mencakup landing page dan lima halaman kategori artikel dengan root canonical
`home`, hero halaman agenda dengan root canonical `agenda`, halaman kolaborasi
dengan root canonical `collaboration`, serta konfigurasi global dengan root
canonical `header-footer`.

## Scope awal

- Hero carousel.
- About section.
- Explore category items.
- Content dan pin Article untuk featured/category article sections.
- Hero untuk lima halaman kategori artikel.
- Team section dan anggota tim.
- CTA section.
- Hero halaman agenda.
- Hero dan kontak halaman kolaborasi.
- Partner logo dan partner content pada halaman kolaborasi.
- Logo global header/footer, background text footer, link footer, deskripsi, dan
  copyright.

Record dan card Article tetap menjadi tanggung jawab module Article. Website
Content menyimpan content section serta pilihan Article yang dipin untuk
homepage, bukan salinan data Article.

## Database tables

- `website_contents`: root landing page, expected satu active row dengan key
  `home`. Field scalar mencakup content About, Explore, Team, serta CTA termasuk
  background khusus, label kontak, dan email kontak.
- `website_hero_slides`: ordered hero carousel items.
- `website_explore_items`: ordered explore/category links.
- `website_article_sections`: lima row fixed yang menyimpan presentasi section
  Home, slug kategori, dan hero halaman kategori terkait.
- `website_article_section_pins`: maksimal tiga relasi Article ordered untuk
  setiap section homepage. Article hanya dapat mempunyai satu row pin dan posisi
  wajib berada pada rentang 1-4.
- `website_team_members`: ordered team members.
- `website_agenda_contents`: root hero halaman agenda, expected satu active row
  dengan key `agenda`.
- `website_collaboration_contents`: root halaman kolaborasi, expected satu
  active row dengan key `collaboration`.
- `website_collaboration_partner_logos`: ordered partner logos.
- `website_collaboration_partner_contents`: ordered partner content beserta
  enum platform dan URL konten.
- `website_header_footer_contents`: root konfigurasi global, expected satu
  active row dengan key `header-footer`; menyimpan logo global, background text
  footer, deskripsi website, dan satu copyright text.
- `website_footer_explore_links`: ordered link pada kolom Explore.
- `website_footer_connect_links`: ordered link pada kolom Connect; platform
  disimpan sebagai enum `WebsiteFooterConnectPlatform`, bukan label bebas.

Seluruh content table memakai ID `Int` dan timestamps. Content editable memakai
soft delete melalui `deletedAt`, sedangkan table pin diganti secara transaksional
dan tidak memakai soft delete.

## Seed

```text
npm run seed:website-content
npm run seed:article
```

Seeder memakai dummy content yang sama dengan landing page, halaman kategori
artikel, hero agenda, halaman kolaborasi, header, dan footer publik saat ini.
Aggregate `home`, `agenda`, `collaboration`, dan `header-footer` diperiksa secara
independen, bersifat create-if-missing, dan tidak menimpa content yang sudah
tersedia. CTA landing page memiliki default background, label `Hubungi Kami`,
dan email kontak yang sama pada konstanta fallback, Prisma schema, dan seeder.
Migration data footer hanya menyelaraskan nilai legacy yang masih sama persis
dengan seed lama; content admin yang sudah dikustom tidak ditimpa.
Article seeder mengisi maksimal tiga pin awal hanya saat suatu section belum
memiliki pin, sehingga eksekusi ulang tidak menimpa pilihan admin.

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
- Lima shortcut kategori tetap berasal dari ordered Explore content. UI root
  menambahkan shortcut presentasional keenam `Agenda Kota` ke `/agenda`; shortcut
  tersebut bukan kategori artikel dan tidak disimpan sebagai article section.
  Label bawahnya memakai count Event `PUBLISHED` aktif dari module Event dengan
  format `<count> Agenda`.
- Section artikel tidak memakai sticky stacking. Seluruh section berada pada
  document flow biasa dan menggunakan background/foreground semantic agar
  mengikuti light atau dark mode.
- Presentasi root menampilkan maksimal tiga artikel yang dipin per section
  dengan artikel pertama sebagai featured. Urutan berasal dari `position` pada
  table pin; Article yang tidak dipin tidak muncul otomatis.
- Field legacy `theme`, `layout`, dan `maxItems` masih tersedia pada table lama
  untuk kompatibilitas migration, tetapi tidak lagi masuk DTO public/editor dan
  tidak menentukan presentasi root.
- Team memakai card semantic (`card`, `border`, dan `muted`) alih-alih background
  charcoal penuh.
- CTA ditampilkan sebagai panel gelap di atas background halaman dan memakai
  `ctaBackgroundImageUrl` sebagai gambar dekoratif tersendiri. Judul mendukung
  beberapa baris: baris pertama putih dan baris berikutnya merah. Tombol kontak
  menggunakan `mailto:` dari `ctaContactEmail` serta label dari
  `ctaContactLabel`.
- Data artikel dibaca dari ordered pin, kemudian dipetakan oleh module Article
  dan dikelompokkan berdasarkan `websiteArticleSection` masing-masing.
- Hero memakai staged reveal untuk eyebrow, judul, deskripsi, CTA, dan kontrol
  slider. About, Explore, lima section Article, Team, serta CTA memakai reveal
  viewport; grid shortcut, Article, dan Team memakai stagger per card.
- URL “Lihat semua” diturunkan dari `articleCategorySlug`; table tidak menyimpan
  `linkUrl` terpisah untuk article section.

## Public article category pages

- Lima URL kategori ditangani satu dynamic route
  `src/app/(public)/[categorySlug]/page.tsx`, bukan lima file route statis.
- Dynamic route mencari `website_article_sections.articleCategorySlug` pada root
  aktif `home`; slug yang tidak ditemukan menghasilkan `notFound()`.
- Hero kategori membaca background, alt, judul, dan deskripsi dari row section
  terkait. Daftar artikel dan pencarian masih memakai mock Article sampai module
  Article tersedia.
- Jika root `home` belum ada, route menggunakan
  `DEFAULT_ARTICLE_CATEGORY_PAGES`. Jika root tersedia tetapi slug tidak cocok,
  request tetap dianggap tidak ditemukan.
- Route statis seperti `/agenda`, `/artikel`, `/kolaborasi`, `/login`, dan
  `/dashboard` mempunyai prioritas dan tidak boleh digunakan sebagai slug
  kategori.

## Public collaboration page

- Route `/kolaborasi` membaca root aktif `collaboration` melalui Server
  Component pada setiap request.
- Logo dan partner content yang diambil hanya record aktif dan visible, lalu
  diurutkan berdasarkan `position`.
- Jika root aktif tidak ditemukan, halaman memakai
  `DEFAULT_COLLABORATION_PAGE`. Error database tetap diteruskan.
- Interaksi menampilkan seluruh partner content berada pada Client Component,
  sedangkan initial data tetap berasal dari SSR.
- Hero tidak memiliki eyebrow/tagline terpisah. Judul, deskripsi, background,
  email, WhatsApp, dan URL aksinya berasal dari root `collaboration`.
- Halaman tidak mempunyai section Form Hubungi Kami. Kontak ditampilkan
  langsung di hero.
- Partner Content hanya menyimpan enum platform dan URL. Public UI menampilkan
  masonry card dan membuka URL eksternal pada tab baru; thumbnail, judul, serta
  aspect ratio diturunkan saat render dan tidak menjadi bagian model database.
- YouTube dan TikTok memakai metadata oEmbed resmi yang di-cache selama enam
  jam. Instagram Reel memakai shortcode URL untuk endpoint cover publik yang
  diproxy melalui route same-origin, memvalidasi response image, dan di-cache
  selama enam jam.
- Hero, partner marquee, header Partner Contents, masonry content, empty state,
  dan tombol show-more memakai reveal viewport yang sama dengan halaman public
  lain. Masonry cards memakai stagger progresif.
  Kegagalan provider tidak menggagalkan halaman karena setiap platform memiliki
  fallback rasio, judul, dan background gradient.

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
- Logo, deskripsi, background text footer, satu copyright, dan ordered link
  berasal dari Prisma.
- Jika root aktif tidak ditemukan, layout memakai
  `DEFAULT_HEADER_FOOTER_CONTENT`. Error database tetap diteruskan.
- Header navigasi Home, Article, Agenda, Collaboration, dan tombol auth tetap
  hardcoded karena belum menjadi field pada editor original.
- Footer memakai layout terpusat dengan logo, deskripsi, Connect, Explore,
  background text dekoratif, badge logo, dan satu copyright. Logo header dan
  footer memakai field global yang sama.
- Field Contact footer, deskripsi Explore, dan closing text lama sudah dihapus
  karena tidak dipakai oleh UI referensi.
- Ikon Connect berasal dari enum platform database. Public footer dan dashboard
  memakai komponen SVG brand yang sama sehingga ikon selalu konsisten.

## Tema tampilan public dan dashboard

- Website menyediakan light mode dan dark mode melalui satu theme provider pada
  root layout. Dark mode menjadi default agar tampilan existing tetap konsisten.
- Tombol tema tersedia pada navbar public desktop/mobile serta sidebar dan
  header mobile dashboard. Pilihan pengguna disimpan di browser dengan key
  `theme`, sehingga public, autentikasi, dan dashboard memakai preferensi yang
  sama tanpa browser fetch tambahan.
- Palet light mode mengikuti referensi revisi dengan background off-white,
  foreground charcoal, aksen sage, dan warna brand merah Palembang. Dark mode
  mempertahankan palet charcoal project sebelumnya.
- Script tema dijalankan sebelum first paint agar class tema sudah diterapkan
  sebelum hydration. Perubahan tema selanjutnya tetap dikelola Client Component.
- Logo header tetap membaca URL dan alt dari Website Content. Tampilan monokrom
  terang atau gelap dihasilkan melalui styling berdasarkan tema dan posisi
  navbar, sehingga tidak membutuhkan field atau asset logo kedua di database.
- Tema merupakan preferensi presentasional browser dan bukan website content
  yang dikelola admin. Fitur ini tidak menambah table, migration, atau seeder.

## Dashboard editor

- Route `/dashboard/website` membaca aggregate aktif `home` beserta editor
  kategori Article, `agenda`, `collaboration`, dan `header-footer` pada Server
  Component dan mengirim DTO serializable ke form Client Component.
- Form Home mengelola hero carousel, about, explore, content dan pin section
  artikel, team, dan CTA. Editor CTA mencakup background image, judul multiline,
  deskripsi, tombol kolaborasi, label kontak, dan email kontak. Seluruh field
  yang ada pada schema Prisma bersifat controlled dan berasal dari data
  database.
- Tab Home, Article, Agenda, Collaboration, dan Header & Footer memakai
  persistence database. Tab Home mengubah field landing section, sedangkan tab
  Article hanya mengubah field hero kategori pada row yang sama.
- Editor Collaboration tidak menyediakan tagline hero atau Form Hubungi Kami.
  Partner Content hanya meminta platform enum dan URL; preview presentasional
  dibentuk pada public server render dan tidak dikirim kembali sebagai input.
- Editor Header & Footer mengelola logo global, URL redirect, alt logo,
  background text, deskripsi website, ordered link Explore/Connect, dan satu
  copyright text.
- Setiap Connect link dipilih melalui dropdown platform berikon, kemudian admin
  hanya mengisi URL. Label platform tidak menjadi input bebas.
- Perubahan disimpan melalui Server Action dengan validasi Zod dan transaction
  Prisma. Root scalar dan seluruh child collection disimpan sebagai satu
  aggregate.
- ID child yang dikirim form harus merupakan milik aggregate aktif terkait.
  Record tanpa ID dibuat sebagai row baru dan DTO hasil save mengembalikan ID
  `Int` dari database.
- Item aktif yang tidak lagi dikirim form di-soft-delete. Posisi child selalu
  dihitung ulang berdasarkan urutan form dan tidak mempercayai nilai posisi
  mentah dari client.
- Save handler melacak perubahan Home, Article, Agenda, Collaboration, serta
  Header & Footer secara terpisah. Tombol Simpan Perubahan maupun save dari guard
  navigasi menyimpan seluruh module nyata yang masih dirty.
- Landing page selalu mempunyai lima article section fixed: Cerita Palembang,
  Gaya Hidup, Ruang Kota, Industri Kreatif, dan Kebudayaan. Admin dapat mengubah
  field presentasinya, tetapi tidak menambah, menghapus, atau mengubah urutannya.
- Setiap section menyediakan pencarian Article published dari kategori yang
  sama dan maksimal tiga pin ordered. Input Tema, Layout, serta Maks. Artikel
  tidak lagi tersedia.
- Save pin memverifikasi ID, status published, soft delete, kategori, duplikasi,
  dan batas tiga item pada server sebelum mengganti relasi dalam transaction.
- Slug kategori wajib berupa kebab-case, unik di dalam root `home`, dan tidak
  boleh memakai route statis yang dicadangkan. Pelanggaran ditolak Server Action
  dan ditampilkan sebagai toast dashboard.
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
