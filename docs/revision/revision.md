Referensi UI `benah-palembang-revision-project`

1. [SELESAI] dark mode light mode, tambahkan tombol dark mode light mode di halaman public dan dashboard. sesuaikan UI dengan yang ada di halaman public. (jika masih ada yang perlu data lain pending dahulu)
2. [SELESAI] kategori artikel fixed 5 tapi tambah shortcut agenda di halaman root 
3. [SELESAI] dashboard yg 5 section itu, tidak ada jumlah pin tema dan layout, tetapi add sendiri (max 3)
4. [SELESAI] dashboard cta & cta beri background
5. [SELESAI] collab sesuaikan warna, di klik new tab
6. [SELESAI] root page sesuikan saja dengan yang baru
7. [SELESAI] footer, logo & header + deskripsi
8. [SELESAI] eksplore sama (pass)
9. [SELESAI] connect ganti pake enum icon
10. [SELESAI] copyright text 1 saja
11. [SELESAI] Section Heroes — Collaboration, tagline hapus
11A. [SELESAI] collaboration Form Hubungi Kami hapus saja
11B. [SELESAI] database hapus thumbnail dan ratio, sisakan URL + enum socmed;
preview public diturunkan otomatis dari URL

12. [SELESAI] /agenda/[id] hilangkan komunitas, tambah button tanya

13. [SELESAI] tambah wa di table events, tambah cta tanya di halaman public
14. [SELESAI] participats hapus di event
15. [SELESAI] halaman penulis "/penulis/[username]", tambahkan username
16. [SELESAI] Ui like comment sesuaikan di artikel
17. [SELESAI] related article random
18. [SELESAI] related agenda random
19. [SELESAI] sidebar manage content dibuat sub
20. [SELESAI] overview bisa dilihat semua role dan sesuaikan UI dan fungsi

## Laporan Implementasi

### Penyempurnaan Animasi Halaman Public

Status: selesai pada 31 Agustus 2026.

- Menambahkan scroll reveal global khusus layout public untuk route `/`,
  `/agenda`, `/agenda/[id]`, `/kolaborasi`, `/[categorySlug]`,
  `/artikel/[slug]`, dan `/penulis/[username]`.
- Pola animasi mengikuti project referensi: elemen hero muncul bertahap dari
  eyebrow, judul, deskripsi, metadata, hingga CTA; section berikutnya muncul
  ketika memasuki viewport melalui `IntersectionObserver`.
- Menambahkan lima variasi GPU-accelerated: reveal vertikal, fade, scale, slide
  kiri/kanan, dan stagger untuk card/list. Stagger memakai jeda progresif
  30-45 ms per child agar grid terasa hidup tanpa membuat halaman lambat.
- Animasi berjalan satu kali per elemen dan observer dilepas setelah reveal.
  Mutation observer menangkap container reveal baru yang ditambahkan oleh
  rendering client setelah initial render tanpa polling.
- Class `motion-ready` dipasang sebelum content public dipaint untuk mencegah
  elemen berkedip dalam keadaan akhir. Safety timeout 2,5 detik memastikan
  content tetap terlihat apabila JavaScript observer gagal dijalankan.
- `prefers-reduced-motion: reduce` menonaktifkan transform, opacity transition,
  dan delay sehingga aksesibilitas motion tetap terjaga.
- Scope animasi berada pada public layout; dashboard, autentikasi, dan form
  editor tidak ikut berubah. Tidak ada dependency animasi baru, perubahan
  database, Prisma schema, migration, maupun seeder.

File utama yang berubah:

- `src/app/(public)/layout.tsx`
- `src/app/globals.css`
- `src/features/public/components/public-scroll-reveal.tsx`
- `src/features/public/components/SectionHeading.tsx`
- `src/modules/website-content/components/landing-hero.tsx`
- `src/modules/website-content/components/landing-page.tsx`
- `src/modules/event/components/public-event-list.tsx`
- `src/modules/event/components/public-event-detail.tsx`
- `src/modules/website-content/components/collaboration-page.tsx`
- `src/modules/website-content/components/article-category-page.tsx`
- `src/modules/article/components/public-article-detail.tsx`
- `src/modules/profile/components/public-profile-page.tsx`

Verifikasi:

- ESLint terarah, `npx tsc --noEmit`, dan `git diff --check`: lulus.
- Build production webpack dan smoke test seluruh route target: lulus.
- HTML production memuat class motion pada hero, section, dan grid route target
  beserta bootstrap `motion-ready`.
- QA visual Browser dicoba melalui skill Browser, tetapi tidak ada instance
  browser aktif pada sesi pengerjaan. Verifikasi diteruskan melalui build dan
  smoke test HTML produksi seluruh route target.

### Penyempurnaan Galeri Artikel Dashboard

Status: selesai pada 31 Agustus 2026.

- Mengaktifkan section `Galeri Artikel` pada `/dashboard/profile`,
  `/dashboard/account/user/[id]`, dan `/dashboard/account/admin/[id]` dengan
  Article database milik account terkait (`authorId`).
- Menghapus tiga kartu dummy beserta route preview lama. Galeri menampilkan
  maksimal enam Article aktif terbaru berdasarkan `updatedAt`, sementara total
  seluruh Article aktif tetap ditampilkan pada deskripsi section.
- Setiap card menampilkan cover, judul, status workflow, tanggal pembaruan,
  views, dan jumlah like riil. Account tanpa Article memperoleh empty state.
- Klik card pada Profile membuka owner preview
  `/dashboard/create-article/preview/[id]`, sehingga ownership guard tetap
  berlaku. Klik card pada detail Account membuka preview moderasi
  `/dashboard/content/article/[id]`, sehingga SuperAdmin dapat melihat Article
  account target tanpa menyamar sebagai owner.
- Query galeri digabung ke select User pada request Profile/Account Detail dan
  memakai DTO reusable dari module Article. Tidak ada query client, perubahan
  schema Prisma, migration, seeder, maupun duplikasi data pada table User.

File utama yang berubah:

- `src/modules/article/components/article-gallery.tsx`
- `src/modules/article/data/article-gallery.mapper.ts`
- `src/modules/article/types/article-gallery.ts`
- `src/modules/account-manage/components/account-detail.tsx`
- `src/modules/account-manage/data/account-manage.mapper.ts`
- `src/modules/profile/components/profile-page.tsx`
- `src/modules/profile/data/profile.mapper.ts`

Verifikasi:

- ESLint terarah, `npx tsc --noEmit`, dan `git diff --check`: lulus.
- Query database memverifikasi galeri memakai Article milik account terkait,
  urutan terbaru, total aktif, serta agregat like riil.
- `npm run build -- --webpack`: lulus.

### Poin 1 - Dark Mode dan Light Mode

Status: selesai pada 30 Agustus 2026.

- Menambahkan palet light mode dari referensi `benah-palembang-revision-project`
  tanpa mengubah dark mode yang sebelumnya menjadi tampilan default project.
- Menambahkan tombol pergantian tema pada navbar public versi desktop dan
  mobile, sidebar dashboard, serta header dashboard mobile.
- Preferensi tema disimpan pada `localStorage` dengan key `theme`, berlaku
  bersama untuk halaman public, autentikasi, dan dashboard, serta tetap aktif
  setelah refresh atau perpindahan route.
- Menambahkan script tema sebelum first paint untuk mencegah kilatan warna yang
  tidak sesuai sebelum React hydration.
- Menyesuaikan warna logo CMS dan logo dashboard berdasarkan tema. Navbar juga
  mengenali seluruh route dengan hero gelap agar logo, menu, dan tombol tema
  tetap mempunyai kontras yang benar.
- Menyesuaikan autofill browser agar mengikuti tema pada form umum, dengan
  pengecualian untuk form autentikasi yang memang memakai permukaan gelap.
- Tidak ada perubahan database, Prisma schema, migration, seeder, maupun data
  website content untuk revisi ini.

File utama yang berubah:

- `src/app/globals.css`
- `src/app/layout.tsx`
- `src/app/providers.tsx`
- `src/components/theme-provider.tsx`
- `src/components/mode-toggle.tsx`
- `src/components/ui/navbar.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/modules/auth/components/auth-page-shell.tsx`
- `tsconfig.json`
- `eslint.config.mjs`

Catatan verifikasi: folder `benah-palembang-revision-project` dikecualikan dari
TypeScript dan ESLint karena berfungsi sebagai snapshot referensi Vite, sama
seperti `benah-palembang-original-project`, dan bukan bagian dari source aplikasi
Next.js yang dibangun.

Verifikasi:

- `git diff --check`: lulus.
- `npm run lint`: lulus tanpa error; terdapat warning lama pada source existing.
- `npx tsc --noEmit`: lulus.
- `npm run build -- --webpack`: lulus sampai kompilasi, type checking, dan
  generation seluruh route. Build Turbopack default masih terkena panic
  environment ketika memproses CSS `react-image-crop` karena operasi binding
  port ditolak, bukan karena error source revisi.
- Smoke test production route `/`, `/agenda`, dan `/login`: HTTP 200 serta
  memuat script tema dan tombol toggle.
- QA visual Browser tidak dapat dijalankan karena tidak ada instance browser
  yang tersedia pada sesi pengerjaan.

### Poin 2 dan 6 - Shortcut Agenda dan Penyesuaian Root Page

Status: selesai pada 30 Agustus 2026; counter Agenda disempurnakan pada 31
Agustus 2026.

- Lima kategori artikel tetap memakai section dan route kategori yang sudah ada.
  Shortcut `Agenda Kota` ditambahkan sebagai item keenam pada section Jelajahi
  Perspektif dan mengarah ke `/agenda`; item ini bukan kategori artikel baru.
- Shortcut Agenda ditambahkan pada presentasi public sehingga tidak memerlukan
  row kategori, perubahan Prisma schema, migration, maupun seeder.
- Shortcut `06 Agenda Kota` menampilkan jumlah Event `PUBLISHED` aktif secara
  live dengan format `<count> Agenda`. Count memakai filter publik yang sama
  dengan halaman `/agenda`, bukan angka statis Website Content.
- Hero root disesuaikan dengan referensi baru pada tinggi mobile, overlay,
  ukuran tipografi, warna aksen, indikator slide, dan kontrol navigasi.
- Seluruh section artikel pada root tidak lagi dibungkus `sticky`; section kini
  mengikuti alur scroll normal tanpa stacking dan manipulasi `z-index`.
- Background section About, Explore, artikel, Team, dan area CTA mengikuti
  token `background` serta `foreground`, sehingga konsisten pada light dan dark
  mode. Gambar dekoratif section artikel tetap digunakan dengan opacity rendah.
- Section artikel memakai presentasi root baru: maksimal tiga artikel tampil,
  artikel pertama menjadi featured, dan tombol lihat semua memakai aksen merah.
- Team diubah dari section charcoal menjadi card berbasis `card`, `border`, dan
  `muted` agar menyesuaikan kedua mode warna.
- CTA diubah menjadi panel gelap membulat di atas background halaman. Background
  khusus, kontak email, dan detail warna judul kemudian dilengkapi pada poin 4.
- Card artikel featured kini membentang dua kolom pada mobile sesuai komposisi
  root di project referensi.

File utama yang berubah:

- `src/modules/website-content/components/landing-page.tsx`
- `src/modules/website-content/components/landing-hero.tsx`
- `src/modules/article/components/public-article-card.tsx`
- `src/modules/event/data/get-public-event-count.ts`
- `src/app/(public)/page.tsx`

Verifikasi:

- `git diff --check`: lulus.
- `npm run lint`: lulus tanpa error; terdapat warning lama pada source existing.
- `npx tsc --noEmit`: lulus.
- `npm run build -- --webpack`: lulus sampai generation seluruh route.
- Smoke test production `/`: HTTP 200, shortcut `Agenda Kota` beserta count
  Event published aktif ter-render,
  layout enam kolom tersedia, CTA panel ter-render, dan wrapper `sticky top-0`
  tidak ditemukan.
- QA visual Browser belum dapat dijalankan karena sesi tidak menyediakan
  instance browser aktif.

### Poin 3 - Pin Artikel pada Lima Section Homepage

Status: selesai pada 30 Agustus 2026; batas pin dikoreksi menjadi tiga pada 31
Agustus 2026.

- Menghapus input `Tema`, `Layout`, dan `Maks. Artikel` dari lima editor section
  artikel pada tab Home di `/dashboard/website`.
- Menambahkan UI `Pin Postingan Artikel (Maks. 3)` sesuai referensi. Admin dapat
  mencari Article published berdasarkan judul atau slug, menambahkan hasil dari
  kategori section yang sama, melihat urutan pin, dan menghapus pin.
- Menambahkan table ordered `website_article_section_pins` dengan foreign key ke
  section dan Article, unique Article, unique posisi per section, serta check
  constraint posisi 1-3.
- Server Action memvalidasi maksimal tiga ID unik per section, status Article
  harus `PUBLISHED`, Article tidak boleh soft-delete, dan kategori Article harus
  sama dengan section target. Penggantian seluruh pin dilakukan dalam transaction
  yang sama dengan penyimpanan content Home.
- Query homepage kini hanya membaca Article dari table pin dan mempertahankan
  urutan `position`. Article terbaru/featured yang tidak dipin tidak lagi muncul
  otomatis pada `/`.
- Migration awal melakukan backfill maksimal empat Article published per section
  memakai urutan lama (`isFeatured`, `publishedAt`, lalu ID), sehingga deploy
  tidak membuat section homepage mendadak kosong.
- Migration koreksi menghapus pin posisi keempat dari setiap section lalu
  memperketat check constraint database menjadi posisi 1-3. Dengan demikian
  dashboard, validasi server, seeder, database, dan presentasi `/` memakai batas
  yang sama tanpa mengubah migration historis yang sudah diterapkan.
- Article seeder menginisialisasi pin hanya untuk section yang belum memiliki
  pin. Seeder tetap idempotent dan tidak menimpa pilihan pin yang sudah ada.
- Kolom database legacy `theme`, `layout`, dan `maxItems` dipertahankan untuk
  keamanan kompatibilitas migration lama, tetapi sudah dikeluarkan dari DTO,
  validasi, persistence editor, dan mapper public.

File utama yang berubah:

- `prisma/schema.prisma`
- `prisma/migrations/20260831090000_add_landing_article_pins/migration.sql`
- `prisma/migrations/20260831100000_limit_landing_article_pins_to_three/migration.sql`
- `prisma/seeders/article.seeder.ts`
- `src/app/dashboard/website/page.tsx`
- `src/modules/website-content/components/manage-landing-page-form.tsx`
- `src/modules/website-content/actions/update-landing-page.ts`
- `src/modules/website-content/data/get-landing-page-editor.ts`
- `src/modules/article/data/get-landing-articles.ts`
- `src/modules/website-content/components/landing-page.tsx`

Verifikasi:

- `npx prisma format`, `npx prisma validate`, dan `npx prisma generate`: lulus.
- Migration berhasil diterapkan ke database Supabase.
- Verifikasi database: kelima section mempunyai tiga pin berurutan 1-3; seluruh
  pin mengarah ke Article published, aktif, dan kategori yang sesuai.
- `npm run seed:article`: lulus secara idempotent dan tidak menimpa pin existing.
- `npx tsc --noEmit`, ESLint terarah, `git diff --check`, dan
  `npm run build -- --webpack`: lulus tanpa error. Full lint tetap memuat 33
  warning existing.
- Smoke test production `/`: HTTP 200 dan memuat 15 URL Article unik dari lima
  section pin. `/dashboard/website` tanpa session tetap redirect HTTP 307 ke
  login sesuai authorization guard.
- QA visual Browser tidak dapat dijalankan karena tidak ada instance browser
  aktif pada sesi pengerjaan; UI diverifikasi terhadap source referensi.

### Poin 4 - CTA Homepage, Background, dan Kontak Email

Status: selesai pada 30 Agustus 2026.

- Menyesuaikan CTA/contact section pada `/` dengan referensi: baris pertama
  judul berwarna putih dan baris berikutnya memakai warna merah brand.
- Menambahkan tombol kontak kedua dengan ikon email dan URL `mailto:` yang
  dibentuk dari email Website Content.
- Menambahkan field database `ctaBackgroundImageUrl`, `ctaContactLabel`, dan
  `ctaContactEmail` pada aggregate `website_contents`.
- Menambahkan migration
  `20260830140307_add_landing_cta_fields`. Default database memastikan row
  `home` yang sudah ada langsung memperoleh background, label kontak, dan email
  awal tanpa kehilangan content CTA sebelumnya.
- Seeder landing page kini mengisi ketiga field CTA baru ketika aggregate
  `home` belum tersedia.
- Dashboard `/dashboard/website` pada tab Home kini menyediakan upload/crop
  background CTA, textarea judul multiline, label kontak, serta email kontak.
  Email divalidasi pada client payload melalui schema Zod sebelum disimpan.
- Mapper public, mapper editor, Server Action, default fallback, dan tipe DTO
  telah diperbarui agar seluruh field berasal dari satu sumber database yang
  sama.

File utama yang berubah:

- `prisma/schema.prisma`
- `prisma/migrations/20260830140307_add_landing_cta_fields/migration.sql`
- `prisma/seeders/website-content.seeder.ts`
- `src/modules/website-content/actions/update-landing-page.ts`
- `src/modules/website-content/components/landing-page.tsx`
- `src/modules/website-content/components/manage-landing-page-form.tsx`
- `src/modules/website-content/constants/default-landing-page.ts`
- `src/modules/website-content/data/get-landing-page-editor.ts`
- `src/modules/website-content/data/website-content.mapper.ts`
- `src/modules/website-content/schemas/landing-page.schema.ts`
- `src/modules/website-content/types/landing-page.ts`

Verifikasi:

- `npx prisma format`: lulus.
- `npx prisma validate`: lulus.
- Migration diterapkan ke database dan Prisma Client berhasil di-generate ulang.
- ESLint terarah untuk file CTA/Website Content: lulus tanpa error.
- `npx tsc --noEmit`: lulus.
- `npm run lint`: lulus tanpa error; tetap terdapat warning lama pada source
  existing di luar perubahan CTA.
- `npm run build -- --webpack`: lulus.
- Smoke test production `/`: HTTP 200; HTML memuat judul `Kota ini milik`
  dengan class putih, `kita semua.` dengan class merah, background CTA khusus,
  label `Hubungi Kami`, dan `mailto:kolaborasi@benahpalembang.id` dari row
  Website Content.

### Poin 7 dan 10 - Footer, Logo, Deskripsi, dan Copyright

Status: selesai pada 30 Agustus 2026.

- Footer public disesuaikan dengan referensi menjadi layout terpusat dengan
  logo utama, deskripsi website, link Connect, navigasi Explore, background text
  berukuran besar, serta badge logo di bagian bawah.
- Footer mengikuti token `background`, `foreground`, `border`, dan `muted`,
  sehingga satu komponen tetap konsisten pada light mode dan dark mode.
- Logo footer dan badge logo memakai konfigurasi logo global yang sama dengan
  header. Perubahan logo, alt, dan URL redirect dari dashboard berlaku untuk
  header sekaligus footer tanpa field duplikat.
- Menambahkan field database `footerBackgroundText` agar teks dekoratif seperti
  `PALEMBANG` dapat dikelola dari dashboard Website Content.
- Section dashboard `Logo & Header` kini memuat logo, URL redirect, alt,
  background text footer, dan deskripsi website/tagline footer sesuai referensi.
- Footer hanya menampilkan satu `copyrightText`. Field `closingText`, informasi
  Contact footer lama, dan deskripsi Explore yang tidak lagi digunakan telah
  dihapus dari schema, migration, seeder, mapper, action, validasi, dan editor.
- Platform Connect kini disimpan sebagai enum database dan dipilih melalui
  dropdown dashboard; detail implementasinya dicatat pada poin 9.

File utama yang berubah:

- `prisma/schema.prisma`
- `prisma/migrations/20260830152000_simplify_footer_and_collaboration/migration.sql`
- `prisma/migrations/20260830153500_align_footer_default_content/migration.sql`
- `prisma/seeders/website-content.seeder.ts`
- `src/features/public/components/PublicFooter.tsx`
- `src/modules/website-content/components/manage-header-footer-settings.tsx`
- `src/modules/website-content/constants/default-header-footer-content.ts`
- `src/modules/website-content/data/header-footer-content.mapper.ts`
- `src/modules/website-content/data/get-header-footer-content-editor.ts`
- `src/modules/website-content/actions/update-header-footer-content.ts`
- `src/modules/website-content/schemas/header-footer-content.schema.ts`
- `src/modules/website-content/types/header-footer-content.ts`

### Poin 5, 11, 11A, dan 11B - Collaboration

Status: selesai pada 30 Agustus 2026, disempurnakan untuk poin 5/11B pada 31
Agustus 2026.

- Menghapus tagline/eyebrow dari hero Collaboration pada public UI, dashboard,
  tipe data, mapper, action, schema validasi, seeder, dan database.
- Hero `/kolaborasi` disesuaikan dengan referensi: komposisi lebih ringkas,
  gambar berada di sisi kanan, judul dengan aksen merah pada kata Palembang,
  serta email dan WhatsApp berada langsung di area hero.
- Menghapus section dashboard `Form Hubungi Kami` beserta `formTitle` dan
  `formDescription`, karena halaman public tidak memiliki form tersebut.
- Partner Content disederhanakan menjadi dua input: enum platform sosial media
  dan URL konten. Field judul, thumbnail, dan aspect ratio serta enum
  `WebsiteCollaborationAspectRatio` telah dihapus.
- Migration mengisi URL kosong pada record lama menggunakan homepage platform
  terkait sebelum kolom presentasi lama dihapus. Seluruh link konten public
  dibuka pada tab baru dengan `noopener noreferrer`.
- Public `/kolaborasi` kembali memakai masonry card seperti referensi, tetapi
  thumbnail, judul, dan rasio tidak disimpan ke database. Preview diturunkan
  saat render dari enum platform serta URL.
- YouTube memakai video ID untuk fallback thumbnail 16:9 dan oEmbed resmi untuk
  judul. TikTok memakai oEmbed resmi untuk judul serta thumbnail 9:16.
  Instagram Reel memakai shortcode URL untuk endpoint cover dan rasio 9:16.
- Cover Instagram diteruskan melalui endpoint same-origin yang hanya menerima
  shortcode valid. Server mengikuti redirect image Instagram, memvalidasi MIME
  image, lalu memberi cache enam jam agar thumbnail tidak lagi bergantung pada
  redirect/provider header ketika dimuat langsung oleh browser.
- Jika metadata atau thumbnail provider tidak tersedia, card tetap dirender
  memakai fallback gradient per platform, label platform, serta tombol play.
- Search mencakup judul metadata, platform, dan URL. Maksimal 12 card tampil
  pertama kali, lalu pengguna dapat membuka seluruh konten.
- Keempat URL yang diberikan sudah tersimpan di Supabase dan diverifikasi:
  dua YouTube, satu Instagram Reel, dan satu TikTok. Tidak diperlukan migration
  atau perubahan schema untuk revisi preview ini.
- Section logo partner menggunakan background semantic dan presentasi marquee
  yang mengikuti light/dark mode seperti referensi.

File utama yang berubah:

- `prisma/schema.prisma`
- `prisma/migrations/20260830152000_simplify_footer_and_collaboration/migration.sql`
- `prisma/seeders/website-content.seeder.ts`
- `src/modules/website-content/components/collaboration-page.tsx`
- `src/modules/website-content/components/manage-collaboration-settings.tsx`
- `src/modules/website-content/constants/default-collaboration-page.ts`
- `src/modules/website-content/data/collaboration-content.mapper.ts`
- `src/modules/website-content/data/collaboration-content-preview.ts`
- `src/modules/website-content/data/resolve-collaboration-content-preview.ts`
- `src/app/api/collaboration/instagram-thumbnail/[shortcode]/route.ts`
- `src/modules/website-content/data/get-collaboration-page-editor.ts`
- `src/modules/website-content/data/get-collaboration-page.ts`
- `src/modules/website-content/actions/update-collaboration-page.ts`
- `src/modules/website-content/schemas/collaboration-page.schema.ts`
- `src/modules/website-content/types/collaboration-page.ts`

Catatan data:

- Migration `20260830152000_simplify_footer_and_collaboration` sudah diterapkan
  ke database Supabase.
- Migration `20260830153500_align_footer_default_content` memperbarui hanya
  nilai seed lama yang belum dikustom: deskripsi, copyright 2026, link
  Kebudayaan/Kolaborasi, dan URL Connect sesuai referensi.
- Kolom yang dihapus tidak dapat dipulihkan dari database setelah migration
  tanpa backup. Data penting yang tetap dipertahankan adalah platform, URL,
  urutan, visibility, serta relasi setiap Partner Content.
- Preview thumbnail, judul, dan ratio merupakan DTO render sementara dan tidak
  mengembalikan field presentasi tersebut ke Prisma atau dashboard form.

Verifikasi:

- `npx prisma format` dan `npx prisma validate`: lulus.
- Prisma Client berhasil di-generate ulang.
- ESLint terarah dan `npx tsc --noEmit`: lulus.
- `npm run lint`: lulus tanpa error; terdapat warning lama di luar perubahan.
- `npm run build -- --webpack`: lulus.
- Endpoint Instagram cover, TikTok oEmbed, dan YouTube oEmbed diuji menggunakan
  empat URL database; seluruh provider mengembalikan thumbnail yang dapat
  digunakan dan kedua YouTube/TikTok juga mengembalikan judul.
- Proxy cover Instagram diuji untuk shortcode `DZlnmuWoT0B` dan mengembalikan
  response JPEG melalui URL aplikasi tanpa perubahan database.
- Smoke test production `/kolaborasi`: HTTP 200. HTML memuat dua thumbnail
  YouTube 16:9, satu cover Instagram 9:16, satu thumbnail TikTok 9:16, judul
  oEmbed, masonry responsive, dan link `target="_blank"`.
- HTML footer memuat background text `PALEMBANG`, deskripsi baru, tujuh link
  navigasi, Connect URL nyata, dan satu copyright 2026; closing text lama tidak
  ditemukan.
- Prisma tetap hanya menyimpan platform + URL; field database tagline hero,
  Form Hubungi Kami, thumbnail, dan aspect ratio tidak dikembalikan.
- QA visual Browser tidak dapat dijalankan karena sesi tidak menyediakan
  instance browser aktif; verifikasi responsive dilakukan melalui source,
  build production, dan smoke test HTML.

### Poin 9 - Enum dan Ikon Footer Connect

Status: selesai pada 30 Agustus 2026.

- Menambahkan enum database `WebsiteFooterConnectPlatform` dengan pilihan
  Instagram, WhatsApp, YouTube, TikTok, LinkedIn, X, Facebook, Mail, dan Website.
- Migration `20260830162000_add_footer_connect_platform_enum` mengonversi label
  Connect existing menjadi enum sebelum kolom `label` lama dihapus. URL, posisi,
  visibility, ID, dan relasi record tetap dipertahankan.
- Dashboard `/dashboard/website` pada `Footer — Connect` kini memakai dropdown
  platform dengan ikon aktif di sisi kiri, sama seperti referensi.
- Placeholder URL berubah berdasarkan platform, misalnya `https://wa.me/62...`
  untuk WhatsApp dan `mailto:...` untuk Mail.
- Footer public tidak lagi menebak ikon dari teks label. SVG brand yang sama
  dengan referensi dipilih langsung dari enum database.
- Satu komponen ikon bersama digunakan dashboard dan public footer agar bentuk
  ikon tidak berbeda ketika platform diubah.

File utama yang berubah:

- `prisma/schema.prisma`
- `prisma/migrations/20260830162000_add_footer_connect_platform_enum/migration.sql`
- `prisma/seeders/website-content.seeder.ts`
- `src/features/public/components/PublicFooter.tsx`
- `src/modules/website-content/components/footer-connect-icon.tsx`
- `src/modules/website-content/components/manage-header-footer-settings.tsx`
- `src/modules/website-content/constants/default-header-footer-content.ts`
- `src/modules/website-content/data/header-footer-content.mapper.ts`
- `src/modules/website-content/data/get-header-footer-content-editor.ts`
- `src/modules/website-content/actions/update-header-footer-content.ts`
- `src/modules/website-content/schemas/header-footer-content.schema.ts`
- `src/modules/website-content/types/header-footer-content.ts`
- `src/modules/website-content/types/header-footer-content-editor.ts`

Verifikasi:

- `npx prisma format`, `npx prisma validate`, dan Prisma Client generate: lulus.
- Migration enum berhasil diterapkan ke database Supabase.
- ESLint terarah dan `npx tsc --noEmit`: lulus.
- `npm run lint`: lulus tanpa error; terdapat warning lama di luar perubahan.
- `npm run build -- --webpack`: lulus.
- Smoke test production `/`: HTTP 200 dan DTO footer memuat enum Instagram,
  WhatsApp, YouTube, serta Mail. SVG dan URL masing-masing platform ter-render.

### Poin 16 dan 17 - UI Interaksi dan More Stories Artikel

Status: selesai pada 30 Agustus 2026.

- Menyesuaikan halaman `/artikel/[slug]` dengan referensi pada kartu penulis,
  kartu engagement, tombol like, salin tautan, bagikan, form komentar, CTA login,
  card komentar, serta jumlah komentar awal yang tampil.
- Like dan komentar tetap memakai data serta Server Action yang sudah terhubung
  ke database. Setelah komentar dibuat atau dihapus, halaman di-refresh agar
  daftar dan jumlah komentar langsung sinkron dengan data terbaru.
- State like optimistis kini disinkronkan kembali menggunakan `hasLiked` dan
  `likesCount` hasil Server Action, sehingga angka pada metadata hero, sidebar,
  dan kartu engagement konsisten.
- Section More Stories memakai token `background`, `foreground`, `muted`,
  `card`, dan `border`, sehingga mengikuti light mode maupun dark mode tanpa
  background terang yang dipaksakan.
- More Stories hanya menampilkan dua card dalam layout dua kolom, mengecualikan
  artikel aktif, serta tetap mengambil artikel published dari kategori yang
  sama.
- Kandidat related article diacak dengan Fisher-Yates pada server lalu dibatasi
  dua item. `connection()` dipanggil sebelum query dan randomisasi agar route
  diproses ulang pada setiap request dan tidak diprerender statis.
- Tidak ada perubahan Prisma schema, migration, seeder, maupun dashboard pada
  poin ini karena seluruh data interaksi dan artikel yang diperlukan sudah ada.

File utama yang berubah:

- `src/modules/article/components/public-article-detail.tsx`
- `src/modules/article/components/article-comments.tsx`
- `src/modules/article/data/get-public-article.ts`
- `docs/module/article.md`

Verifikasi:

- ESLint terarah untuk tiga file module Article: lulus tanpa error.
- `npx tsc --noEmit`: lulus.
- `git diff --check`: lulus.
- `npm run build -- --webpack`: lulus dan route `/artikel/[slug]` terdeteksi
  sebagai dynamic server-rendered route.
- Lima request production berurutan pada satu slug selalu menghasilkan tepat
  dua related article unik, tidak memuat artikel aktif, dan menghasilkan empat
  kombinasi pasangan berbeda.
- Smoke test HTML memuat kartu `Sukai Artikel Ini`, CTA
  `Masuk untuk Komentar`, section More Stories semantic, dan grid dua kolom.
- QA visual Browser belum dapat dijalankan karena tidak ada instance browser
  aktif; responsive dan light/dark diverifikasi melalui source, build, dan HTML
  production.

Perbaikan lanjutan:

- Menghapus ruang `background` setinggi navbar di atas hero detail artikel.
  Hero kini dimulai dari bagian paling atas halaman dengan padding internal yang
  sama seperti detail Agenda, sehingga navbar transparan bertulisan putih selalu
  berada di atas hero gelap pada light mode maupun dark mode.
- Perbaikan dilakukan pada layout detail artikel, bukan dengan memaksa warna
  navbar menjadi gelap, agar kontras navbar pada seluruh route dengan hero gelap
  tetap konsisten.

### Poin 12, 13, dan 14 - Detail Agenda, CTA Tanya, dan Penghapusan Participants

Status: selesai pada 30 Agustus 2026.

- Menghapus box kategori/komunitas dari `/agenda/[id]`, termasuk teks
  "Acara ini terbuka untuk kolaborasi komunitas dan publik" yang tidak ada pada
  referensi baru.
- Menyesuaikan detail agenda dengan referensi: metadata hero hanya menampilkan
  tanggal, likes, dan views; card penyelenggara diletakkan sebelum card Detail
  Acara; serta aksi utama memakai susunan Daftar Sekarang, Suka, Tanya, dan
  Bagikan sesuai ketersediaan URL pendaftaran.
- Card, border, teks, dan action mengikuti token tema sehingga tampilan public,
  preview owner, dan preview moderasi konsisten pada light mode dan dark mode.
- Menambahkan kolom wajib `Event.whatsappUrl` dan input wajib "Tautan WhatsApp
  Tombol Tanya" pada `/dashboard/create-event/new` serta
  `/dashboard/create-event/edit?id=<id>`. Nilai divalidasi dengan format standar
  `https://wa.me/628xxxxxxxxxx`.
- Tombol Tanya tersedia pada halaman public, preview owner, dan preview Manage
  Content. Link membuka WhatsApp di tab baru dengan pesan pertanyaan yang sudah
  memuat judul, tanggal, dan lokasi acara.
- Migration mengisi Event existing dengan `https://wa.me/628551241878` sebelum
  menjadikan kolom WhatsApp non-null. Seeder Event dan seluruh default Event juga
  sudah menyediakan nilai WhatsApp tersebut.
- Menghapus model/tabel `EventParticipant`, relasi Prisma, Server Action
  registrasi participant, schema CTA tracking, agregasi, DTO, dan seluruh angka
  participant pada UI public maupun dashboard.
- Metrik Overview "Klik CTA & Interaksi" diubah menjadi "Interaksi" dan kini
  hanya menghitung Article Like, Event Like, dan Article Comment. Klik link
  pendaftaran maupun WhatsApp tidak lagi dicatat sebagai participant.

File utama yang berubah:

- `prisma/schema.prisma`
- `prisma/migrations/20260830190000_add_event_whatsapp_remove_participants/migration.sql`
- `prisma/seeders/event.seeder.ts`
- `src/modules/event/actions/save-event.ts`
- `src/modules/event/components/event-editor.tsx`
- `src/modules/event/components/event-organizer-card.tsx`
- `src/modules/event/components/public-event-detail.tsx`
- `src/modules/event/components/owned-event-preview.tsx`
- `src/modules/event/data/event.mapper.ts`
- `src/modules/event/data/owned-event.mapper.ts`
- `src/modules/event/schemas/event.schema.ts`
- `src/modules/manage-content/components/managed-event-preview.tsx`
- `src/modules/overview/data/get-overview-data.ts`

Data yang dihapus:

- Migration menghapus tabel `event_participants` beserta seluruh histori klik
  CTA di dalamnya. Penghapusan ini permanen setelah migration diterapkan dan
  hanya dapat dipulihkan dari backup database.

Verifikasi:

- `npx prisma format`, `npx prisma validate`, dan `npx prisma generate`: lulus.
- Migration `20260830190000_add_event_whatsapp_remove_participants` berhasil
  diterapkan ke database Supabase.
- Verifikasi database: seluruh 58 Event mempunyai URL yang diawali
  `https://wa.me/628`, Event ID 83 memakai URL WhatsApp hasil backfill, dan
  `to_regclass('public.event_participants')` menghasilkan `null`.
- `npm run seed:event`: lulus; seluruh default yang telah tersedia dilewati
  secara idempotent.
- `npm run lint`: lulus tanpa error; terdapat 33 warning existing.
- `npm run build -- --webpack`: lulus dan seluruh route Event berhasil dibangun.
- Smoke test production `/agenda` dan `/agenda/27`: HTTP 200. HTML detail memuat
  Penyelenggara, Detail Acara, URL `https://wa.me/628...`, Tanya, dan Bagikan;
  teks kategori komunitas serta participants tidak ditemukan.
- QA visual Browser belum dapat dijalankan karena tidak ada instance browser
  aktif pada sesi ini; verifikasi UI dilakukan melalui source, build production,
  dan hasil render HTML.
- `npx tsc --noEmit` dan `git diff --check`: lulus.

### Poin 18 - Related Agenda Acak

Status: selesai pada 30 Agustus 2026.

- Section Agenda Lainnya pada `/agenda/[id]` kini hanya menampilkan dua Event
  published selain Event aktif, mengikuti jumlah dan komposisi dua kolom pada
  project referensi.
- Kandidat related Event diambil dari seluruh Event published aktif, diacak
  memakai Fisher-Yates pada server, lalu dibatasi menjadi dua item.
- `connection()` dipanggil sebelum query dan randomisasi sehingga pemilihan
  related Event berlangsung pada request time dan dapat menghasilkan pasangan
  berbeda pada setiap request.
- Background, teks, border image, metadata, dan ikon memakai token `background`,
  `foreground`, `muted`, serta `border`, sehingga section mengikuti light mode
  dan dark mode seperti section More Stories pada detail Artikel.

File utama yang berubah:

- `src/modules/event/data/get-public-event.ts`
- `src/modules/event/components/public-event-detail.tsx`
- `docs/module/event.md`

Verifikasi:

- ESLint terarah, `npx tsc --noEmit`, dan `git diff --check`: lulus.
- `npm run build -- --webpack`: lulus dan `/agenda/[id]` tetap terdeteksi sebagai
  dynamic server-rendered route.
- Enam request production berurutan pada `/agenda/27` masing-masing menampilkan
  tepat dua Event selain Event aktif dan menghasilkan enam pasangan berbeda.
- HTML production memuat background/text semantic serta grid `sm:grid-cols-2`.

### Poin 19 - Pemisahan Manage Content Article dan Event

Status: selesai pada 30 Agustus 2026.

- Sidebar Manage Content kini mempunyai submenu `Article` dan `Event` dengan
  active state yang mengikuti halaman list maupun preview masing-masing.
- Route list dipisahkan menjadi `/dashboard/content/article` dan
  `/dashboard/content/event`. Route `/dashboard/content` tetap tersedia sebagai
  entry point dan mengalihkan moderator ke halaman Article.
- Query `getManagedContent` menerima tipe content dari server route, sehingga
  search, count, urutan, dan pagination 25 item berjalan mandiri pada tabel
  Article atau Event tanpa merge dan slice dataset gabungan.
- Kolom `Tipe` dihapus dari tabel karena identitas content sudah ditentukan oleh
  halaman aktif. Label Author/Owner, statistik komentar, empty state, judul, dan
  placeholder pencarian menyesuaikan tipe halaman.
- Route preview dipindahkan dari `/dashboard/content/[id]/article` dan
  `/dashboard/content/[id]/event` menjadi `/dashboard/content/article/[id]` dan
  `/dashboard/content/event/[id]`. Tombol View serta tombol Kembali sudah memakai
  struktur baru.
- Revalidation Article dan Event diarahkan ke list tipe masing-masing. Widget
  Manage Content pada Overview menyediakan link langsung ke kedua halaman.

File utama yang berubah:

- `src/components/dashboard/Sidebar.tsx`
- `src/app/dashboard/content/page.tsx`
- `src/app/dashboard/content/article/page.tsx`
- `src/app/dashboard/content/article/[id]/page.tsx`
- `src/app/dashboard/content/event/page.tsx`
- `src/app/dashboard/content/event/[id]/page.tsx`
- `src/modules/manage-content/components/manage-content-list.tsx`
- `src/modules/manage-content/data/get-managed-content.ts`
- `src/modules/manage-content/actions/revalidate-managed-content.ts`
- `src/modules/overview/components/overview-recent-content.tsx`
- `docs/module/manage-content.md`

Verifikasi:

- `npx tsc --noEmit` dan `git diff --check`: lulus.
- ESLint terarah dan `npm run lint`: lulus tanpa error; full lint tetap memuat
  33 warning existing.
- `npm run build -- --webpack`: lulus. Manifest route hanya memuat
  `/dashboard/content/article`, `/dashboard/content/article/[id]`,
  `/dashboard/content/event`, dan `/dashboard/content/event/[id]`; pola preview
  lama tidak lagi dihasilkan.
- Smoke test tanpa session pada route parent, kedua list, dan kedua preview
  menghasilkan redirect auth HTTP 307 tanpa server error.
- QA visual Browser belum dapat dijalankan karena tidak ada instance browser
  aktif pada sesi ini.

### Poin 20 - Overview untuk Seluruh Role

Status: selesai pada 30 Agustus 2026.

- Route `/dashboard` kini dapat dibuka oleh `USER`, `ADMIN`, dan `SUPERADMIN`
  melalui `requireCurrentUser()`. Menu Overview juga ditampilkan untuk seluruh
  role pada Sidebar.
- Login, registrasi, dan halaman autentikasi yang menemukan session aktif
  mengarahkan seluruh role ke `/dashboard`. Akses ke halaman terproteksi yang
  tidak sesuai role juga kembali ke `/dashboard`.
- Overview `USER` disesuaikan menjadi dashboard kreator: hanya menampilkan
  `Total Publikasi`, `Total Views`, serta grafik views/interaksi dari Article dan
  Event published milik actor yang sedang login.
- Query `USER` dibatasi server-side melalui `authorId = actor.id` dan
  `ownerId = actor.id`. Data global seperti jumlah akun, seluruh konten, antrean
  moderasi, dan log aktivitas tidak dikirim ke client `USER`.
- Overview `ADMIN` dan `SUPERADMIN` mengikuti referensi dengan empat kartu:
  `Total Users`, `Total Artikel`, `Total Event`, dan `Total Request`, grafik
  performa global, serta tabel lima konten moderasi terbaru.
- Tabel moderasi menampilkan tipe, judul, penulis/pemilik, dan status. Judul
  dapat dibuka langsung ke route preview Article atau Event yang sesuai.
- Widget log aktivitas lama dihapus dari Overview agar komposisi UI sama dengan
  referensi. Modul Log Activities tetap tersedia terpisah untuk `SUPERADMIN`.
- DTO Overview diubah menjadi discriminated union `CREATOR` dan `MANAGEMENT`
  agar pemisahan data role tetap type-safe pada UI.
- Tidak ada perubahan Prisma schema, migration, database, atau seeder untuk
  poin ini karena seluruh metrik memakai tabel dan counter yang sudah tersedia.

File utama yang berubah:

- `src/app/dashboard/page.tsx`
- `src/components/dashboard/Sidebar.tsx`
- `src/modules/auth/data/session-dal.ts`
- `src/modules/overview/types/overview.ts`
- `src/modules/overview/data/get-overview-data.ts`
- `src/modules/overview/data/overview.mapper.ts`
- `src/modules/overview/components/overview-page.tsx`
- `src/modules/overview/components/overview-metric-cards.tsx`
- `src/modules/overview/components/overview-recent-content.tsx`
- `docs/module/overview.md`
- `docs/module/permission.md`

Verifikasi:

- `npx tsc --noEmit`: lulus.
- ESLint terarah dan `npm run lint`: lulus tanpa error. Full lint tetap memuat
  33 warning existing; enam di antaranya berada pada Sidebar existing.
- `git diff --check`: lulus.
- `npm run build -- --webpack`: lulus hingga generation seluruh route;
  `/dashboard` tercatat sebagai dynamic server-rendered route.
- Smoke test `/dashboard` tanpa session menghasilkan redirect HTTP 307 ke
  `/login?reason=session-invalid`, sesuai guard autentikasi.
- QA visual Browser tidak dapat dijalankan karena tidak ada instance browser
  yang tersedia pada sesi pengerjaan. Kesesuaian UI diverifikasi melalui source
  referensi, typecheck, lint, build produksi, dan route smoke test.

### Poin 15 - Username dan Halaman Penulis

Status: selesai pada 30 Agustus 2026.

- Menambahkan field `User.username` dengan panjang maksimal 30 karakter,
  mandatory, unique, dan database check constraint untuk format lowercase.
- Migration menambahkan kolom sebagai nullable terlebih dahulu, melakukan
  backfill seluruh akun existing dari nama dengan format lowercase underscore,
  menyelesaikan username duplicate memakai suffix `_2`, `_3`, dan seterusnya,
  lalu mengubah kolom menjadi `NOT NULL` dan memasang unique index.
- Aturan username mengikuti pola Instagram: hanya huruf `a-z`, angka, titik,
  dan underscore. Titik tidak boleh berada di awal/akhir atau berurutan.
- Form `/dashboard/profile` sekarang menampilkan serta mengizinkan edit
  username. Input dinormalisasi lowercase, divalidasi dengan Zod, dan collision
  unique ditampilkan sebagai field error khusus.
- Registrasi mandiri, First Time Setup, pembuatan akun oleh SuperAdmin, dan
  account seeder sekarang selalu menghasilkan username unik secara otomatis.
- Menambahkan route publik `/penulis/[username]` sesuai referensi: banner dan
  kartu profil gelap, avatar, bio, sosial media, CTA WhatsApp, tombol bagikan,
  statistik Article, galeri masonry, serta Event published milik pengguna.
- Halaman penulis hanya menampilkan akun aktif yang tidak banned/deleted serta
  Article/Event berstatus `PUBLISHED`. Username invalid atau tidak ditemukan
  menghasilkan halaman 404.
- Identitas author pada hero artikel dan seluruh box `Ditulis Oleh` di
  `/artikel/[slug]` sekarang dapat diklik menuju `/penulis/[username]`.
- Navbar mengenali `/penulis/[username]` sebagai route dengan hero gelap agar
  kontras logo, menu, dan tombol tema tetap sesuai.

File utama yang berubah:

- `prisma/schema.prisma`
- `prisma/migrations/20260830230000_add_user_username/migration.sql`
- `prisma/seeders/account-manage.seeder.ts`
- `src/modules/auth/schemas/username.schema.ts`
- `src/modules/auth/data/generate-unique-username.ts`
- `src/modules/auth/actions/register.ts`
- `src/modules/first-time-setup/actions/first-time-setup.ts`
- `src/modules/account-manage/actions/create-account.ts`
- `src/modules/profile/actions/update-profile.ts`
- `src/modules/profile/components/profile-page.tsx`
- `src/modules/profile/components/public-profile-page.tsx`
- `src/modules/profile/data/get-public-profile.ts`
- `src/app/(public)/penulis/[username]/page.tsx`
- `src/modules/article/components/public-article-detail.tsx`
- `src/modules/article/data/article.mapper.ts`

Verifikasi:

- `npx prisma format`, `npx prisma validate`, dan `npx prisma generate`: lulus.
- Migration berhasil diterapkan ke database Supabase.
- Verifikasi 101 row User: 0 username null, 0 duplicate, dan 0 username invalid.
- Unit check aturan username menerima titik/underscore valid dan menolak titik
  di awal, akhir, berurutan, serta karakter strip.
- `npm run seed:account-manage`: lulus secara idempotent.
- `npx tsc --noEmit` dan ESLint terarah: lulus tanpa error; warning yang tampil
  berasal dari Navbar existing.
- `npm run build -- --webpack`: lulus dan route `/penulis/[username]` terdaftar
  sebagai dynamic server-rendered route.
- Smoke test production `/penulis/rahmat_hidayat_2`: HTTP 200 dan memuat username,
  statistik, serta galeri. Username yang tidak tersedia menghasilkan HTTP 404.
- Smoke test Article memastikan hero author dan box `Ditulis Oleh` memuat link
  `/penulis/rahmat_hidayat_2`.
- QA visual Browser tidak dapat dijalankan karena tidak ada instance browser
  aktif; UI diverifikasi dari source referensi, render HTML production, dan build.

### Pemisahan Archive dari Soft Delete pada Konten Owner

Status: selesai pada 4 September 2026.

Laporan QA: pada `/dashboard/create-article` dan `/dashboard/create-event`,
menekan tombol **Archive** membuat data hilang tanpa jejak. Activity Log
mencatatnya sebagai aksi `DELETE` dengan `afterState` berisi `deletedAt`.

Akar masalah: Archive memang diimplementasikan sebagai soft delete. Satu
transaction mengisi `deletedAt`, melepaskan slug canonical menjadi
`<slug>-deleted-<timestamp>-<id>`, dan men-soft-delete seluruh tag. Karena
seluruh query memfilter `deletedAt: null`, record hilang dari daftar owner,
halaman publik, dan Manage Content sekaligus, sementara tidak ada satu pun aksi
unarchive atau restore untuk mengembalikannya. `softDeleteArticleAction` bahkan
hanya alias dari `archiveArticleAction`.

Perubahan:

- Menambahkan `ARCHIVED` pada enum `ContentStatus` dan `ARCHIVE` pada enum
  `ActivityAction`.
- Archive sekarang hanya memindahkan status `PUBLISHED -> ARCHIVED`. `deletedAt`
  tidak disentuh, slug canonical dipertahankan, dan tag tidak ikut dihapus
  sehingga publikasi ulang mengembalikan URL publik yang sama beserta tag,
  views, dan likes.
- Menambahkan aksi **Publikasikan** (`ARCHIVED -> PUBLISHED`) yang melewati
  `PENDING_REVIEW`, karena konten tersebut sudah pernah disetujui admin.
- Memisahkan aksi **Hapus** sebagai soft delete sebenarnya, tersedia hanya untuk
  status `DRAFT`, `REJECTED`, dan `ARCHIVED`. `PENDING_REVIEW` dan `TAKEN_DOWN`
  tidak dapat dihapus owner karena sedang berada pada flow moderasi.
- `TAKEN_DOWN` sengaja tidak dapat diarsipkan agar owner tidak memakai
  archive lalu publikasi ulang sebagai jalan pintas keluar dari takedown.
- Activity Log: Archive memakai action `ARCHIVE`, publikasi ulang memakai
  `RESTORE`, dan `DELETE` kembali berarti penghapusan. Snapshot log memakai
  pasangan `status` pada `beforeState`/`afterState`, menggantikan field sintetis
  `active` yang sebelumnya membingungkan pembaca log.
- Konten `ARCHIVED` dikeluarkan dari antrian moderasi Manage Content dan dari
  metrik Total Request serta feed konten terbaru pada Overview.
- Label status "Arsip" ditambahkan pada daftar owner, galeri artikel, editor,
  dan Overview. Fungsi label status diubah menjadi `switch` exhaustive agar
  penambahan enum berikutnya gagal saat compile, bukan diam-diam jatuh ke label
  "Takedown".

File utama yang berubah:

- `prisma/schema.prisma`
- `prisma/migrations/20260904055723_add_archived_content_status/migration.sql`
- `src/modules/event/actions/archive-event.ts`
- `src/modules/event/actions/republish-event.ts`
- `src/modules/event/actions/soft-delete-event.ts`
- `src/modules/event/constants/event-status.ts`
- `src/modules/article/actions/archive-article.ts`
- `src/modules/article/actions/republish-article.ts`
- `src/modules/article/actions/soft-delete-article.ts`
- `src/modules/article/constants/article-status.ts`
- `src/modules/event/components/owned-event-list.tsx`
- `src/modules/event/components/event-editor.tsx`
- `src/modules/article/components/owned-article-list.tsx`
- `src/modules/article/components/article-editor.tsx`
- `src/modules/article/components/article-gallery.tsx`
- `src/modules/event/data/owned-event.mapper.ts`
- `src/modules/article/data/owned-article.mapper.ts`
- `src/modules/manage-content/data/get-managed-content.ts`
- `src/modules/overview/data/get-overview-data.ts`
- `src/modules/overview/data/overview.mapper.ts`
- `src/modules/overview/types/overview.ts`
- `src/modules/overview/components/overview-recent-content.tsx`
- `src/modules/activity-log/data/activity-log.mapper.ts`
- `src/modules/activity-log/components/activity-log-list.tsx`
- `src/modules/activity-log/types/activity-log.ts`

Verifikasi:

- Migration `20260904055723_add_archived_content_status` berhasil diterapkan ke
  database Supabase; isinya hanya dua `ALTER TYPE ... ADD VALUE` yang additive.
- `npx tsc --noEmit` dan ESLint pada module terdampak: lulus tanpa error.
- `npm run build`: lulus, seluruh route dashboard tetap terdaftar.
- Uji perilaku terhadap database di dalam transaction yang di-rollback
  (Event `test7`): setelah Archive, `status = ARCHIVED`, slug tetap utuh,
  `deletedAt` tetap `null`, dan jumlah tag aktif tidak berubah (2 -> 2).
  Visibilitas terverifikasi: daftar owner 1 row, halaman publik 0 row, antrian
  moderasi 0 row. Setelah publikasi ulang, status kembali `PUBLISHED` dengan
  slug yang sama. Data dikembalikan ke kondisi semula oleh rollback.
- Data lama hasil archive versi sebelumnya tidak dimigrasikan sesuai keputusan,
  karena isinya hanya data testing.

### Jalur Perbaikan Konten Rejected dan Audit Suntingan Konten Tayang

Status: selesai pada 4 September 2026.

Lanjutan dari pemisahan Archive di atas, menutup tiga celah yang muncul saat
menelusuri laporan QA yang sama.

**1. Konten `REJECTED` sebelumnya buntu.** Penulis tidak punya aksi apa pun
selain membiarkannya, padahal transisi `REJECTED -> PENDING_REVIEW` sudah
tertulis di dokumen module sejak awal namun belum diimplementasikan.
`postArticleAction` dan `postEventAction` hanya menerima `DRAFT`. Sekarang
keduanya menerima `DRAFT` dan `REJECTED`, begitu pula `saveArticleAction` dan
`saveEventAction` untuk intent `POST`, sehingga konten yang ditolak dapat
diperbaiki lalu diajukan ulang tanpa menulis dari nol. Moderasi tetap utuh
karena hasil perbaikan wajib melewati `PENDING_REVIEW` lagi.

**2. Alasan penolakan tidak pernah terlihat penulis.** Field `moderationNote`
diisi admin pada aksi Reject dan Takedown, tetapi tidak pernah dibaca di mana
pun dalam aplikasi. Field tersebut kini masuk ke select dan mapper milik owner,
lalu ditampilkan pada daftar konten (di bawah badge status) dan sebagai callout
di editor untuk status `REJECTED` serta `TAKEN_DOWN`. Ketika konten diajukan
ulang, `moderationNote` dikosongkan supaya admin tidak membaca alasan versi
sebelumnya.

**3. Suntingan pada konten tayang tidak terekam isinya.** Konten `PUBLISHED`
memang boleh disunting tanpa review ulang — ini keputusan produk, bukan bug,
karena memaksa review pada setiap perbaikan typo akan menurunkan konten dari
publik setiap kali penulis membetulkan satu kata. Konsekuensinya activity log
menjadi satu-satunya kontrol, dan sebelumnya log itu hanya mencatat
`status: PUBLISHED -> PUBLISHED`, yang tidak memberi tahu admin apa pun. Aksi
`UPDATE` sekarang mencatat field mana saja yang berubah beserta nilai lama dan
barunya. Nilai teks panjang dipotong pada 200 karakter, dan rich content tidak
disimpan utuh ke JsonB melainkan dicatat sebagai penanda panjang
(`HTML 1.234 karakter`) agar kolom log tidak membengkak. Deskripsi log juga
dibedakan menjadi `Menyunting event tayang '...'` supaya admin mengenali
suntingan pada konten publik langsung dari daftar log.

File utama yang berubah:

- `src/modules/event/actions/post-event.ts`
- `src/modules/event/actions/save-event.ts`
- `src/modules/event/constants/event-status.ts`
- `src/modules/event/data/event-change-summary.ts`
- `src/modules/event/data/owned-event.mapper.ts`
- `src/modules/event/types/owned-event.ts`
- `src/modules/event/components/owned-event-list.tsx`
- `src/modules/event/components/event-editor.tsx`
- `src/modules/article/actions/post-article.ts`
- `src/modules/article/actions/save-article.ts`
- `src/modules/article/constants/article-status.ts`
- `src/modules/article/data/article-change-summary.ts`
- `src/modules/article/data/owned-article.mapper.ts`
- `src/modules/article/types/article.ts`
- `src/modules/article/components/owned-article-list.tsx`
- `src/modules/article/components/article-editor.tsx`

Verifikasi:

- `npx tsc --noEmit`: lulus. ESLint pada `src/modules`: 0 error, menyisakan 3
  warning `no-img-element` lama pada module Account Manage yang tidak disentuh.
- `npm run build`: lulus.
- Uji fungsi ringkasan perubahan: mengubah judul, isi, dan tag menghasilkan
  `changedFields: ["title","content","tags"]` dengan `content` tercatat sebagai
  `HTML 15 karakter` -> `HTML 39 karakter`. Field yang tidak berubah
  (deskripsi, banner, kategori, jadwal, lokasi) tidak ikut tercatat.
- Uji guard status untuk `[DRAFT, REJECTED, PUBLISHED, ARCHIVED]`: boleh Post
  ulang `[true, true, false, false]`, boleh Hapus `[true, true, false, true]`.
- Uji terhadap database di dalam transaction yang di-rollback: Event `REJECTED`
  dengan catatan "Banner tidak sesuai." terbaca melalui select milik owner;
  setelah Post ulang status menjadi `PENDING_REVIEW` dan `moderationNote`
  kembali `null`. Data dikembalikan ke kondisi semula oleh rollback.

### Form Alasan Moderasi dan Notifikasi Email Keputusan Admin

Status: selesai pada 4 September 2026.

Dua kekurangan yang dilaporkan setelah alasan moderasi mulai ditampilkan kepada
pemilik konten: admin tidak punya tempat untuk menuliskannya, dan pemilik konten
tidak mengetahui adanya keputusan sampai membuka dashboard.

**1. Form alasan moderasi.** Payload moderasi sebenarnya sudah menerima `note`
sejak awal, tetapi tidak ada satu pun UI yang mengirimkannya, sehingga
`moderationNote` selalu tersimpan `null`. Komponen bersama
`ModerationConfirmDialog` menggantikan `ConfirmActionDialog` pada daftar
`/dashboard/content/[type]` maupun halaman detail `/dashboard/content/[type]/[id]`
untuk Article dan Event. Dialog tersebut menampilkan textarea alasan pada aksi
Reject dan Takedown, membatasi 1.000 karakter, dan menonaktifkan tombol
konfirmasi selama alasan kosong. Guard UI tidak dijadikan satu-satunya
pengaman: `rejectContentAction` dan `takedownContentAction` memvalidasi dengan
`moderationNotePayloadSchema` yang mewajibkan `note` minimal satu karakter
setelah trim. Approve dan Restore tidak memakai form alasan.

Seluruh copy dialog moderasi kini berada pada satu komponen, menggantikan tiga
salinan rantai ternary yang sebelumnya diduplikasi di daftar dan dua halaman
preview.

**2. Notifikasi email.** Transport SMTP dipindahkan dari
`src/modules/auth/data/mailer.ts` ke `src/lib/mail/mailer.ts` supaya dapat
dipakai lintas module; auth mailer sekarang hanya memuat template reset
password, dan Health Check membaca `verifySmtpConnection` dari lokasi baru.
Tidak ada environment variable baru — konfigurasi memakai `SMTP_*` dan
`APP_URL` yang sudah ada.

Keempat aksi moderasi mengirim email ke pemilik konten setelah transaction
commit: Approve dan Restore mengarahkan ke halaman publik konten, sedangkan
Reject dan Takedown memuat alasan admin dan mengarahkan ke editor dashboard
milik owner agar dapat langsung diperbaiki. `notifyContentDecision` sengaja
tidak pernah melempar error; kegagalan SMTP hanya dicatat pada server log dan
keputusan moderasi tetap dilaporkan berhasil karena perubahan status sudah
tersimpan lebih dahulu.

File utama yang berubah:

- `src/lib/mail/mailer.ts`
- `src/modules/auth/data/mailer.ts`
- `src/modules/health/data/check-smtp.ts`
- `src/modules/manage-content/data/moderation-mailer.ts`
- `src/modules/manage-content/components/moderation-confirm-dialog.tsx`
- `src/modules/manage-content/components/manage-content-list.tsx`
- `src/modules/manage-content/components/managed-article-preview.tsx`
- `src/modules/manage-content/components/managed-event-preview.tsx`
- `src/modules/manage-content/schemas/manage-content.schema.ts`
- `src/modules/manage-content/actions/approve-content.ts`
- `src/modules/manage-content/actions/reject-content.ts`
- `src/modules/manage-content/actions/takedown-content.ts`
- `src/modules/manage-content/actions/restore-content.ts`

Verifikasi:

- `npx tsc --noEmit`: lulus. ESLint pada `src/modules` dan `src/lib`: 0 error,
  menyisakan 3 warning `no-img-element` lama pada module Account Manage.
- `npm run build`: lulus.
- Uji `buildContentModerationEmail` untuk 4 keputusan x 2 tipe konten: subjek
  sesuai keputusan, dan tautan CTA tepat — Approve/Restore menuju
  `/artikel/<slug>` atau `/agenda/<id>`, sedangkan Reject/Takedown menuju
  `/dashboard/create-article/edit?id=<id>` atau `/dashboard/create-event/edit?id=<id>`.
- Catatan admin muncul pada versi teks maupun HTML, dan input berbahaya
  (`<script>`, `<b>`) ter-escape pada body HTML.
- Validasi payload: reject/takedown tanpa alasan ditolak dengan pesan
  "Alasan wajib diisi.", dengan alasan diterima, dan approve tanpa alasan tetap
  diterima.
- `verifySmtpConnection()` berhasil terhubung dan terautentikasi ke
  `smtp.gmail.com:465`. Pengiriman email sungguhan belum dijalankan karena
  akan mengirim pesan nyata ke alamat pengguna; jalur pengiriman dapat dicoba
  dengan memoderasi satu konten uji.

### Return Path pada Redirect Auth

Status: selesai pada 4 September 2026.

Tautan CTA pada email notifikasi moderasi mengarah ke editor dashboard. Ketika
penerima membukanya tanpa sesi aktif, guard auth mengarahkannya ke
`/login?reason=session-invalid` tanpa membawa tujuan asal, sehingga setelah
login pengguna selalu mendarat di `/dashboard` dan harus mencari sendiri konten
yang dimaksud email.

Perubahan:

- `src/proxy.ts` memasang header `x-pathname` berisi pathname beserta query pada
  setiap request. Sebelumnya proxy melakukan early return ketika cookie device
  sudah ada sehingga tidak pernah menyentuh request header; alur tersebut
  disusun ulang agar header selalu terpasang, sementara cookie device tetap
  hanya dibuat saat belum ada.
- Helper baru `src/modules/auth/data/return-path.ts` menyediakan
  `sanitizeReturnPath()` dan `loginRedirectUrl()`. Seluruh guard
  (`requireSession`, `requireCurrentUser`, `requireRole`, dan
  `getCurrentProfile`) memakai helper tersebut, menggantikan string
  `/login?reason=...` yang sebelumnya ditulis manual di empat tempat.
- Halaman Login dan Register membaca `from`, meneruskannya sebagai hidden input,
  dan `loginAction` serta `registerAction` mengarahkan ke path tersebut setelah
  berhasil. Pengguna yang sudah login dan membuka `/login?from=...` langsung
  diarahkan ke tujuan. Tautan antar halaman auth ikut membawa `from` supaya
  tujuan tidak hilang saat pengguna berpindah dari Login ke Register.
- Konstanta nama header berada pada `src/lib/constants/request-headers.ts` agar
  proxy tidak ikut menarik `next/headers` maupun modul `server-only`.

Keamanan `from`: nilainya selalu melewati `sanitizeReturnPath()` baik dari query
string maupun dari form. Hanya path internal yang diterima; absolute URL dan
protocol-relative path ditolak supaya tidak menjadi open redirect, dan route
auth ditolak supaya pengguna tidak berputar kembali ke halaman login. Nilai
`from` tidak pernah diperlakukan sebagai penanda otorisasi — halaman tujuan
tetap menjalankan guard-nya sendiri.

File utama yang berubah:

- `src/proxy.ts`
- `src/lib/constants/request-headers.ts`
- `src/modules/auth/data/return-path.ts`
- `src/modules/auth/data/session-dal.ts`
- `src/modules/auth/actions/login.ts`
- `src/modules/auth/actions/register.ts`
- `src/modules/auth/components/login-page.tsx`
- `src/modules/auth/components/register-page.tsx`
- `src/app/(auth)/login/page.tsx`
- `src/app/(auth)/register/page.tsx`
- `src/modules/profile/data/get-current-profile.ts`

Verifikasi:

- `npx tsc --noEmit`: lulus. ESLint pada `src`: 0 error; 19 warning yang tersisa
  seluruhnya berasal dari file lama yang tidak disentuh.
- `npm run build`: lulus.
- Uji `sanitizeReturnPath()` dengan 18 kasus: seluruhnya sesuai. Path dashboard
  beserta query diterima utuh, sedangkan `https://evil.example.com`,
  `//evil.example.com`, `/\evil.example.com`, `http://localhost:3000/dashboard`,
  `dashboard`, `/login`, `/login?reason=session-invalid`, `/register`,
  `/lupa-password/abc`, `/first-time-setup`, dan string kosong ditolak. Path
  yang hanya berawalan mirip route auth seperti `/loginhelp` tetap diterima.
- Uji end-to-end pada dev server melalui browser tanpa sesi: membuka
  `/dashboard/create-event/edit?id=10` menghasilkan
  `/login?reason=session-invalid&from=%2Fdashboard%2Fcreate-event%2Fedit%3Fid%3D10`,
  dan form login memuat hidden input `from` bernilai
  `/dashboard/create-event/edit?id=10`. Membuka `/login?from=//evil.example.com`
  maupun `/login?from=/login` tidak menghasilkan hidden input sama sekali.
- Redirect terakhir setelah login berhasil belum diuji end-to-end karena
  memerlukan kredensial pengguna; jalur tersebut dapat dicoba dengan login
  manual dari tautan email.
