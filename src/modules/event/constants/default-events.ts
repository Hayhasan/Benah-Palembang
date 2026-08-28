export type DefaultEventStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "TAKEN_DOWN"

export interface DefaultEvent {
  slug: string
  title: string
  description: string
  content: string
  bannerUrl: string
  category: string
  startsAt: string
  endsAt: string | null
  location: string
  organizer: string
  registrationUrl: string | null
  status: DefaultEventStatus
  tags: string[]
}

type DashboardEventStatus = "Draf" | "Post" | "Takedown"

type DashboardEventMock = readonly [
  title: string,
  description: string,
  date: string,
  status: DashboardEventStatus,
  bannerUrl: string,
]

const DASHBOARD_EVENT_MOCKS = [
  ["Pameran Fotografi: Warna Palembang", "Melihat sudut kota melalui lensa fotografer lokal dan pameran visual...", "15 Sep 2026, 10:00", "Post", "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Festival Kuliner Malam Ampera", "Nikmati lebih dari 50 jenis makanan tradisional dan fusion khas Sumatera Selatan...", "10 Sep 2026, 18:30", "Post", "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Workshop Menenun Songket Tradisional", "Belajar teknik menenun benang emas langsung dari maestro songket Palembang...", "05 Sep 2026, 09:00", "Post", "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Lomba Perahu Bidar Tradisional Musi 2026", "Perlombaan dayung perahu naga tercepat menyusuri perairan Sungai Musi...", "28 Aug 2026, 07:30", "Post", "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Palembang Jazz & Heritage Night", "Alunan musik jazz modern berpadu dengan keanggunan suasana Benteng Kuto Besak...", "25 Aug 2026, 19:30", "Draf", "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Seminar Ekonomi Kreatif & Digitalisasi UMKM", "Panduan strategi ekspansi bisnis lokal menembus pasar nasional dan global...", "20 Aug 2026, 13:00", "Post", "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Gowes Santai Keliling Kota Palembang", "Rute asri menyusuri jembatan Musi IV, Kambang Iwak, dan Taman Jakabaring...", "18 Aug 2026, 06:00", "Post", "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Pentas Seni Teater Dulmuluk Remaja", "Pertunjukan teater rakyat yang dibawakan oleh generasi muda pecinta seni Palembang...", "15 Aug 2026, 19:00", "Post", "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Festival Kopi & Barista Championship", "Adu kepiawaian meracik espresso dan latte art menggunakan biji kopi lokal Sumsel...", "12 Aug 2026, 10:00", "Post", "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Workshop Pembuatan Sabun Alami dari Minyak Atsiri", "Pemanfaatan bahan rempah lokal untuk produk ramah lingkungan berdaya jual...", "10 Aug 2026, 14:00", "Draf", "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Palembang Creative Hackathon 2026", "Kompetisi pemrograman 48 jam untuk menciptakan solusi smart city bagi kota Palembang...", "08 Aug 2026, 08:00", "Post", "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Pameran Kerajinan Ukir Kayu Tembesu", "Menampilkan mahakarya seni ukir khas Palembang berpadu ornamen keemasan...", "05 Aug 2026, 10:30", "Post", "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Aksi Bersih Sungai Musi Bersama Komunitas", "Gerakan peduli kebersihan perairan sungai demi kelestarian ekosistem dan keindahan kota...", "02 Aug 2026, 07:00", "Post", "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Festival Musik Akustik Pinggir Sungai", "Malam minggu syahdu menikmati lantunan musik indie lokal di tepi dermaga...", "30 Jul 2026, 19:30", "Post", "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Bincang Santai Literasi Sejarah Sriwijaya", "Diskusi mendalam bersama sejarawan dan arkeolog tentang peradaban maritim kuno...", "28 Jul 2026, 15:00", "Draf", "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Pasar Seni & Kriya Akhir Pekan Kambang Iwak", "Bazar karya seni rupa, ilustrasi, pakaian unik, dan kerajinan tangan lokal...", "25 Jul 2026, 08:00", "Post", "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Workshop Public Speaking & Storytelling", "Teknik menyampaikan cerita yang memikat audiens dan membangun persona percaya diri...", "22 Jul 2026, 13:30", "Post", "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Turnamen Esport Palembang Championship", "Kompetisi game strategi tingkat regional memperebutkan piala bergengsi...", "20 Jul 2026, 11:00", "Post", "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Festival Layang-Layang Hias Jakabaring", "Mewarnai langit Palembang dengan aneka bentuk layang-layang tradisional dan modern...", "18 Jul 2026, 14:00", "Post", "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Kelas Memasak Pempek & Celimpungan Autentik", "Praktek langsung cara menguleni adonan ikan segar hingga menghasilkan tekstur sempurna...", "15 Jul 2026, 09:30", "Post", "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Pameran Komik & Animasi Lokal Sriwijaya", "Karya komikus dan animator muda bertema cerita rakyat dan superhero nusantara...", "12 Jul 2026, 10:00", "Post", "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Night Run Ampera 5K 2026", "Lari malam spektakuler dengan latar gemerlap cahaya Jembatan Ampera...", "10 Jul 2026, 20:00", "Post", "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Pelatihan Digital Marketing untuk Karang Taruna", "Membekali pemuda desa dengan keahlian pemasaran konten dan optimasi media sosial...", "08 Jul 2026, 13:00", "Takedown", "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Simfoni Musik Tradisional Gambus & Batanghari Sembilan", "Pertunjukan petikan dawai gitar tunggal dan tabuhan gambus yang memukau...", "05 Jul 2026, 19:30", "Post", "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Festival Film Pendek Wong Kito 2026", "Penayangan film-film indie sineas muda bertema kehidupan sosial kota Palembang...", "01 Jul 2026, 16:00", "Post", "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Pameran Lukisan Pesona Bumi Sriwijaya", "Koleksi lukisan cat minyak dan kanvas dari pelukis legendaris Sumatera Selatan...", "28 Jun 2026, 10:00", "Post", "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Piknik Akhir Pekan & Storytelling Anak", "Membaca dongeng cerita rakyat nusantara bersama pegiat literasi di taman kota...", "26 Jun 2026, 08:30", "Post", "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Konferensi Arsitektur & Pelestarian Heritage", "Simposium para pakar tata kota mengenai perlindungan cagar budaya bersejarah...", "24 Jun 2026, 09:00", "Post", "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Lomba Masak Pindang Patin Antar Kecamatan", "Ajang unjuk kebolehan memasak kuliner khas dengan bumbu autentik turun-temurun...", "22 Jun 2026, 10:00", "Post", "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Workshop Kerajinan Anyaman Purun Ramah Lingkungan", "Mempelajari kerajinan tangan tas dan tikar purun dari pengrajin gambut lokal...", "20 Jun 2026, 13:00", "Post", "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Musi River Cruise & Sunset Dinner", "Pelayaran eksklusif menikmati pemandangan senja dan santap malam di atas kapal...", "18 Jun 2026, 17:00", "Post", "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Festival Tari Nusantara Pelajar Sumatera", "Kompetisi kreasi tari tradisional antar SMA dan perguruan tinggi se-Sumatera...", "15 Jun 2026, 09:00", "Post", "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Seminar Investasi Hijau & Energi Terbarukan", "Peluang transisi energi bersih di wilayah perkotaan dan industri Sumatera Selatan...", "12 Jun 2026, 13:30", "Draf", "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Palembang Car Free Day Carnival 2026", "Parade kostum kreasi, pertunjukan musik jalanan, dan senam massal di Jl. Sudirman...", "10 Jun 2026, 06:00", "Post", "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Workshop Penulisan Puisi & Cerpen Sriwijaya", "Mengasah kepekaan sastra dan merangkai kata bersama sastrawan senior...", "08 Jun 2026, 14:00", "Post", "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Bazar Buku Murah & Pameran Naskah Kuno", "Pameran manuskrip aksara ulu dan ribuan buku bacaan berkualitas dengan diskon spesial...", "05 Jun 2026, 10:00", "Post", "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Kompetisi Desain Grafis Ikon Kota Palembang", "Tantangan bagi para desainer grafis muda untuk merefleksikan identitas visual modern kota...", "02 Jun 2026, 11:00", "Post", "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Malam Apresiasi Seni & Budaya Wong Kito", "Pemberian penghargaan kepada para tokoh penggerak kebudayaan dan pegiat komunitas lokal...", "30 May 2026, 19:30", "Post", "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Gowes Wisata Sejarah Benteng & Masjid Agung", "Bersepeda santai melewati situs-situs penting peradaban Islam di Palembang...", "28 May 2026, 06:30", "Post", "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Workshop Fotografi Landscape & Drone Musi", "Teknik menangkap keindahan bentang alam sungai dan jembatan dari sudut udara...", "25 May 2026, 15:30", "Post", "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Pelatihan Wirausaha Olahan Ikan Air Tawar", "Diversifikasi produk makanan berbahan baku ikan patin, gabus, dan lele untuk UMKM...", "22 May 2026, 09:30", "Post", "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Simulasi Siaga Bencana Banjir & Mitigasi Kota", "Latihan kesiapsiagaan terpadu relawan SAR, BPBD, dan masyarakat bantaran sungai...", "20 May 2026, 08:00", "Post", "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Festival Musik Tradisional & Kontemporer Sumsel", "Kolaborasi aransemen musik etnik dengan instrumen modern di panggung terbuka...", "18 May 2026, 19:00", "Post", "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Eksibisi Seni Patung & Instalasi Ramah Lingkungan", "Karya seni kreatif dari daur ulang limbah plastik dan kayu apung Sungai Musi...", "15 May 2026, 10:00", "Post", "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Seminar Transformasi Digital Pemerintahan Daerah", "Peningkatan mutu pelayanan publik berbasis aplikasi terpadu satu pintu...", "12 May 2026, 13:00", "Post", "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Palembang Yoga & Wellness Morning di Danau JSC", "Sesi relaksasi yoga bersama instruktur berpengalaman di suasana sejuk tepi danau...", "10 May 2026, 06:30", "Post", "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Lomba Desain Motif Batik Modern Khas Palembang", "Eksplorasi motif flora fauna lokal untuk busana kasual masa kini...", "08 May 2026, 11:00", "Post", "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Diskusi Publik Transportasi Terintegrasi Palembang", "Menghubungkan LRT, Feeder Angkot, dan Bus Trans Musi secara efektif dan nyaman...", "05 May 2026, 14:00", "Post", "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Festival Kuliner Tradisional Ramadhan Palembang", "Pasar takjil kue basah tradisional srikaya, dadar jiwo, dan ragit khas kuto...", "02 May 2026, 16:00", "Post", "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
  ["Grand Final Duta Wisata Bujang Gadis Palembang 2026", "Malam penobatan generasi muda inspiratif sebagai duta pariwisata dan kebudayaan kota...", "01 May 2026, 19:30", "Post", "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop"],
] as const satisfies readonly DashboardEventMock[]

const MONTH_INDEXES: Record<string, number> = {
  Jan: 1,
  Feb: 2,
  Mar: 3,
  Apr: 4,
  May: 5,
  Jun: 6,
  Jul: 7,
  Aug: 8,
  Sep: 9,
  Oct: 10,
  Nov: 11,
  Dec: 12,
}

const STATUS_TO_DATABASE: Record<DashboardEventStatus, DefaultEventStatus> = {
  Draf: "DRAFT",
  Post: "PUBLISHED",
  Takedown: "TAKEN_DOWN",
}

function slugify(value: string) {
  return value
    .toLowerCase()
    .replace(/&/g, " dan ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
}

function parseDashboardDate(value: string) {
  const match = value.match(
    /^(\d{2}) ([A-Z][a-z]{2}) (\d{4}), (\d{2}):(\d{2})$/,
  )

  if (!match) throw new Error(`Invalid dashboard event date: ${value}`)

  const [, day, monthName, year, hour, minute] = match
  const month = MONTH_INDEXES[monthName]
  if (!month) throw new Error(`Invalid dashboard event month: ${monthName}`)

  return `${year}-${String(month).padStart(2, "0")}-${day}T${hour}:${minute}:00+07:00`
}

function inferCategory(title: string) {
  const normalized = title.toLowerCase()

  if (normalized.includes("workshop") || normalized.includes("kelas")) {
    return "Workshop"
  }
  if (normalized.includes("festival") || normalized.includes("carnival")) {
    return "Festival"
  }
  if (normalized.includes("pameran") || normalized.includes("eksibisi")) {
    return "Pameran"
  }
  if (
    normalized.includes("diskusi") ||
    normalized.includes("bincang") ||
    normalized.includes("seminar") ||
    normalized.includes("konferensi")
  ) {
    return "Diskusi"
  }
  if (
    normalized.includes("pentas") ||
    normalized.includes("musik") ||
    normalized.includes("simfoni") ||
    normalized.includes("malam apresiasi")
  ) {
    return "Pertunjukan"
  }
  if (
    normalized.includes("run") ||
    normalized.includes("gowes") ||
    normalized.includes("yoga") ||
    normalized.includes("turnamen") ||
    normalized.includes("lomba")
  ) {
    return "Olahraga & Kompetisi"
  }
  if (normalized.includes("pelatihan")) return "Pelatihan"

  return "Komunitas"
}

function normalizeDescription(value: string) {
  return value.replace(/\.\.\.$/, ".")
}

function dashboardEventToDefault(
  event: DashboardEventMock,
): DefaultEvent {
  const [title, rawDescription, date, status, bannerUrl] = event
  const description = normalizeDescription(rawDescription)
  const category = inferCategory(title)

  return {
    slug: slugify(title),
    title,
    description,
    content: `<p>${description}</p><p>Acara ini menjadi ruang pertemuan warga, komunitas, dan pelaku kreatif untuk berbagi pengalaman serta membangun kolaborasi di Palembang.</p>`,
    bannerUrl,
    category,
    startsAt: parseDashboardDate(date),
    endsAt: null,
    location: "Palembang, Sumatera Selatan",
    organizer: "Benah Palembang",
    registrationUrl: null,
    status: STATUS_TO_DATABASE[status],
    tags: [category, "Palembang", "Agenda"],
  }
}

const PUBLIC_AGENDA_EVENTS = [
  {
    slug: "diskusi-publik-masa-depan-ruang-terbuka-palembang",
    title: "Diskusi Publik: Masa Depan Ruang Terbuka Palembang",
    description:
      "Forum terbuka membahas pentingnya ruang publik yang inklusif di tengah pembangunan kota yang pesat.",
    content:
      "<p>Forum terbuka membahas pentingnya ruang publik yang inklusif di tengah pembangunan kota yang pesat.</p>",
    bannerUrl:
      "https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    category: "Diskusi",
    startsAt: "2025-09-15T14:00:00+07:00",
    endsAt: "2025-09-15T17:00:00+07:00",
    location: "Benteng Kuto Besak, Palembang",
    organizer: "Benah Palembang x Komunitas Kota Kita",
    registrationUrl: null,
    status: "PUBLISHED",
    tags: ["Diskusi", "Ruang Publik", "Palembang"],
  },
  {
    slug: "workshop-tenun-songket-untuk-pemula",
    title: "Workshop Tenun Songket untuk Pemula",
    description:
      "Belajar dasar-dasar tenun songket langsung dari pengrajin berpengalaman. Terbuka untuk umum, kapasitas terbatas.",
    content:
      "<p>Belajar dasar-dasar tenun songket langsung dari pengrajin berpengalaman. Terbuka untuk umum, kapasitas terbatas.</p>",
    bannerUrl:
      "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    category: "Workshop",
    startsAt: "2025-09-22T09:00:00+07:00",
    endsAt: "2025-09-22T12:00:00+07:00",
    location: "Rumah Songket Zainal, Kawasan 30 Ilir",
    organizer: "Benah Palembang x Rumah Songket Zainal",
    registrationUrl: null,
    status: "PUBLISHED",
    tags: ["Workshop", "Songket", "Kebudayaan"],
  },
  {
    slug: "pameran-foto-wajah-wajah-sungai-musi",
    title: "Pameran Foto: Wajah-Wajah Sungai Musi",
    description:
      "Koleksi foto dokumenter dari 12 fotografer Palembang yang merekam kehidupan di sekitar Sungai Musi.",
    content:
      "<p>Koleksi foto dokumenter dari 12 fotografer Palembang yang merekam kehidupan di sekitar Sungai Musi.</p>",
    bannerUrl:
      "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    category: "Pameran",
    startsAt: "2025-10-01T10:00:00+07:00",
    endsAt: "2025-10-15T20:00:00+07:00",
    location: "Galeri Sriwijaya, Jl. Sudirman",
    organizer: "Benah Palembang x Palembang Photography Club",
    registrationUrl: null,
    status: "PUBLISHED",
    tags: ["Pameran", "Fotografi", "Sungai Musi"],
  },
  {
    slug: "kuliah-umum-arsitektur-vernakular-sumatera-selatan",
    title: "Kuliah Umum: Arsitektur Vernakular Sumatera Selatan",
    description:
      "Bersama arsitek dan sejarawan lokal, membahas kekayaan arsitektur vernakular yang perlu dipelajari dan dilestarikan.",
    content:
      "<p>Bersama arsitek dan sejarawan lokal, membahas kekayaan arsitektur vernakular yang perlu dipelajari dan dilestarikan.</p>",
    bannerUrl:
      "https://images.pexels.com/photos/10682942/pexels-photo-10682942.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    category: "Kuliah Umum",
    startsAt: "2025-10-08T13:00:00+07:00",
    endsAt: "2025-10-08T16:00:00+07:00",
    location: "Universitas Sriwijaya, Aula Utama",
    organizer: "Benah Palembang x Universitas Sriwijaya",
    registrationUrl: null,
    status: "PUBLISHED",
    tags: ["Kuliah Umum", "Arsitektur", "Warisan"],
  },
  {
    slug: "festival-kuliner-rasa-palembang",
    title: "Festival Kuliner: Rasa Palembang",
    description:
      "Merayakan kekayaan kuliner Palembang dari pempek klasik hingga inovasi kuliner anak muda yang menggugah selera.",
    content:
      "<p>Merayakan kekayaan kuliner Palembang dari pempek klasik hingga inovasi kuliner anak muda yang menggugah selera.</p>",
    bannerUrl:
      "https://images.pexels.com/photos/37234075/pexels-photo-37234075.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    category: "Festival",
    startsAt: "2025-10-18T16:00:00+07:00",
    endsAt: "2025-10-20T22:00:00+07:00",
    location: "Lapangan Merdeka Palembang",
    organizer: "Benah Palembang x Dinas Pariwisata Palembang",
    registrationUrl: null,
    status: "PUBLISHED",
    tags: ["Festival", "Kuliner", "Palembang"],
  },
  {
    slug: "creative-networking-night",
    title: "Creative Networking Night",
    description:
      "Mempertemukan pelaku industri kreatif, jurnalis, desainer, dan pengusaha lokal dalam suasana santai dan inspiratif.",
    content:
      "<p>Mempertemukan pelaku industri kreatif, jurnalis, desainer, dan pengusaha lokal dalam suasana santai dan inspiratif.</p>",
    bannerUrl:
      "https://images.pexels.com/photos/36748274/pexels-photo-36748274.jpeg?auto=compress&cs=tinysrgb&w=800&h=500&fit=crop",
    category: "Networking",
    startsAt: "2025-10-25T18:00:00+07:00",
    endsAt: "2025-10-25T21:00:00+07:00",
    location: "Coworking Space Musi, Jl. Angkatan 45",
    organizer: "Benah Palembang",
    registrationUrl: null,
    status: "PUBLISHED",
    tags: ["Networking", "Industri Kreatif", "Palembang"],
  },
] as const satisfies readonly DefaultEvent[]

export const DEFAULT_EVENTS: readonly DefaultEvent[] = [
  ...PUBLIC_AGENDA_EVENTS,
  ...DASHBOARD_EVENT_MOCKS.map(dashboardEventToDefault),
]
