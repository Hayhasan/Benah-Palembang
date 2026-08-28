export type DefaultArticleStatus =
  | "DRAFT"
  | "PENDING_REVIEW"
  | "PUBLISHED"
  | "REJECTED"
  | "TAKEN_DOWN"

export interface DefaultArticle {
  slug: string
  title: string
  excerpt: string
  content: string
  coverImageUrl: string
  categorySlug: string
  readingTime: number
  isFeatured: boolean
  status: DefaultArticleStatus
  createdAt: string
  submittedAt: string | null
  publishedAt: string | null
  tags: string[]
}

export const DEFAULT_ARTICLES = [
  {
    "slug": "jembatan-ampera-lebih-dari-sekedar-ikon",
    "title": "Jembatan Ampera: Lebih dari Sekadar Ikon",
    "excerpt": "Di balik kemegahannya, Ampera menyimpan cerita tentang identitas, kerinduan, dan harapan warga Palembang yang terus berubah.",
    "content": "<p>Setiap hari ribuan orang melintas di atasnya. Sebagian terburu-buru menuju kerja, sebagian lagi sekadar menikmati angin Sungai Musi yang mengalir deras di bawahnya. Jembatan Ampera bukan hanya penghubung dua sisi kota—ia adalah napas Palembang itu sendiri.</p><h2>Sejarah yang Terpatri</h2><p>Dibangun antara tahun 1962 hingga 1965, Ampera hadir sebagai simbol kemerdekaan dan modernitas.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 6,
    "isFeatured": true,
    "status": "PUBLISHED",
    "createdAt": "2025-08-10T02:00:00.000Z",
    "submittedAt": "2025-08-11T02:00:00.000Z",
    "publishedAt": "2025-08-12T02:00:00.000Z",
    "tags": [
      "Ampera",
      "Sejarah",
      "Palembang",
      "Sungai Musi"
    ]
  },
  {
    "slug": "kampung-arab-di-tepi-musi",
    "title": "Kampung Arab di Tepi Musi: Jejak Akulturasi Al-Munawwar",
    "excerpt": "Di balik gang-gang sempit kawasan Al-Munawwar, tersimpan cerita tentang akulturasi budaya yang sudah berlangsung berabad-abad.",
    "content": "<p>Untuk menemukan salah satu tempat paling autentik di Palembang, kamu tidak perlu pergi jauh. Kawasan Al-Munawwar di tepi Sungai Musi menyimpan lapisan sejarah yang penting bagi keberagaman kota.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/38885810/pexels-photo-38885810.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 7,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-07-06T02:00:00.000Z",
    "submittedAt": "2025-07-07T02:00:00.000Z",
    "publishedAt": "2025-07-08T02:00:00.000Z",
    "tags": [
      "Sejarah",
      "Budaya",
      "Komunitas",
      "Warisan"
    ]
  },
  {
    "slug": "pengemudi-ketek-dan-napas-sungai",
    "title": "Pengemudi Perahu Ketek yang Menolak Menyerah pada Zaman",
    "excerpt": "Di tengah modernisasi jembatan dan tol, deru mesin perahu ketek tetap setia menghubungkan nadi kehidupan Seberang Ulu dan Ilir.",
    "content": "<p>Pak Rusdi telah menarik tuas perahu ketek selama lebih dari 30 tahun. Baginya, Sungai Musi bukan sekadar air mengalir, melainkan jalan hidup yang menghidupi keluarganya.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/32844866/pexels-photo-32844866.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-06-16T02:00:00.000Z",
    "submittedAt": "2025-06-17T02:00:00.000Z",
    "publishedAt": "2025-06-18T02:00:00.000Z",
    "tags": [
      "Perahu Ketek",
      "Sungai Musi",
      "Warga",
      "Keseharian"
    ]
  },
  {
    "slug": "penjaga-malam-pasar-16-ilir",
    "title": "Menatap Fajar dari Lorong Pasar 16 Ilir",
    "excerpt": "Kisah para kuli panggul dan pedagang malam yang menyalakan denyut ekonomi Palembang saat kota terlelap.",
    "content": "<p>Saat jarum jam menunjukkan pukul dua pagi, Pasar 16 Ilir justru sedang memulai pertunjukannya. Karung-karung hasil bumi diturunkan dari perahu jukung di tepian dermaga.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/29995581/pexels-photo-29995581.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-31T02:00:00.000Z",
    "submittedAt": "2025-06-01T02:00:00.000Z",
    "publishedAt": "2025-06-02T02:00:00.000Z",
    "tags": [
      "Pasar 16 Ilir",
      "Kisah Nyata",
      "Ekonomi",
      "Kerja Keras"
    ]
  },
  {
    "slug": "komunitas-membaca-di-tebing-sungai",
    "title": "Lapak Buku Terapung untuk Anak-Anak Pesisir",
    "excerpt": "Gerakan literasi mandiri yang membawa ribuan buku cerita ke pemukiman bantaran Sungai Musi.",
    "content": "<p>Dengan perahu kayu sederhana, sekelompok relawan muda menyambangi desa-desa di muara sungai untuk menyalakan impian literasi anak-anak.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/31409070/pexels-photo-31409070.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-22T02:00:00.000Z",
    "submittedAt": "2025-05-23T02:00:00.000Z",
    "publishedAt": "2025-05-24T02:00:00.000Z",
    "tags": [
      "Literasi",
      "Pendidikan",
      "Komunitas",
      "Relawan"
    ]
  },
  {
    "slug": "harmoni-kampung-kapitan",
    "title": "Kisah Kampung Kapitan: Harmoni Tionghoa di Tanah Sriwijaya",
    "excerpt": "Melihat lebih dekat bagaimana keluarga Kapitan menjaga rumah warisan mereka tetap berdiri tegak di Seberang Ulu.",
    "content": "<p>Rumah panggung berarsitektur paduan Tionghoa dan Melayu ini menjadi saksi hidup bagaimana keberagaman telah mendarah daging di Palembang sejak era kesultanan.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/34373985/pexels-photo-34373985.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 7,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-13T02:00:00.000Z",
    "submittedAt": "2025-05-14T02:00:00.000Z",
    "publishedAt": "2025-05-15T02:00:00.000Z",
    "tags": [
      "Kampung Kapitan",
      "Sejarah",
      "Harmoni",
      "Palembang"
    ]
  },
  {
    "slug": "suara-dari-pulau-kemaro",
    "title": "Pulau Kemaro: Cinta, Mitos, dan Kehidupan Warganya Hari Ini",
    "excerpt": "Menyibak kehidupan warga lokal yang merawat pagoda dan legenda cinta Tan Bun An & Siti Fatimah.",
    "content": "<p>Di tengah tenangnya aliran air yang membelah delta Sungai Musi, Pulau Kemaro tidak hanya ramai saat Cap Go Meh, tetapi juga hidup dari keramahan warga penghuninya.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/10682942/pexels-photo-10682942.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-01T02:00:00.000Z",
    "submittedAt": "2025-05-02T02:00:00.000Z",
    "publishedAt": "2025-05-03T02:00:00.000Z",
    "tags": [
      "Pulau Kemaro",
      "Legenda",
      "Tradisi",
      "Pariwisata"
    ]
  },
  {
    "slug": "tukang-patri-dan-alat-kuningan-35-ilir",
    "title": "Sentuhan Terakhir Para Pengrajin Kuningan 35 Ilir",
    "excerpt": "Kisah para pandai logam tua yang mempertahankan keterampilan warisan nenek moyang di tengah gempuran barang pabrik.",
    "content": "<p>Dentang palu di atas cetakan tembaga masih bergaung di gang-gang sempit 35 Ilir. Pekerjaan yang membutuhkan ketelitian tinggi ini menolak punah.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14795560/pexels-photo-14795560.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-20T02:00:00.000Z",
    "submittedAt": "2025-04-21T02:00:00.000Z",
    "publishedAt": "2025-04-22T02:00:00.000Z",
    "tags": [
      "Pengrajin",
      "Kuningan",
      "Warisan",
      "Kearifan Lokal"
    ]
  },
  {
    "slug": "sepeda-ontel-komunitas-palembang",
    "title": "Gowes Senja: Menyusuri Lorong Sejarah Bersama Ontelis Palembang",
    "excerpt": "Kolektor sepeda tua yang menghidupkan kembali romantisme kota melalui rute-rute bersejarah setiap akhir pekan.",
    "content": "<p>Deretan sepeda ontel keluaran Belanda dan Inggris melaju santai melintasi Jalan Merdeka hingga kawasan Benteng Kuto Besak di bawah cahaya keemasan senja.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/10682943/pexels-photo-10682943.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-08T02:00:00.000Z",
    "submittedAt": "2025-04-09T02:00:00.000Z",
    "publishedAt": "2025-04-10T02:00:00.000Z",
    "tags": [
      "Sepeda Ontel",
      "Komunitas",
      "Gaya Hidup",
      "Nostalgia"
    ]
  },
  {
    "slug": "penjual-kemplang-panggang-pipit",
    "title": "Aroma Asap Batok Kelapa dari Sentra Kemplang Pipit",
    "excerpt": "Perempuan-perempuan tangguh yang membalik kemplang di atas bara demi aroma khas yang tak tergantikan.",
    "content": "<p>Sejak fajar menyingsing, kepulan asap beraroma gurih telah membubung dari pekarangan rumah-rumah warga di kawasan sentra kerupuk kemplang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/16204518/pexels-photo-16204518.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-26T02:00:00.000Z",
    "submittedAt": "2025-03-27T02:00:00.000Z",
    "publishedAt": "2025-03-28T02:00:00.000Z",
    "tags": [
      "Kuliner",
      "Kemplang",
      "UMKM",
      "Perempuan Hebat"
    ]
  },
  {
    "slug": "pempek-dan-identitas-kuliner-kota",
    "title": "Pempek dan Identitas Kuliner Kota",
    "excerpt": "Pempek bukan sekadar makanan. Ia adalah bahasa yang dimengerti semua orang Palembang—di mana pun mereka berada.",
    "content": "<p>Ada yang mengatakan bahwa mengenal sebuah kota adalah melalui perutnya. Jika benar demikian, maka Palembang menawarkan perkenalan yang tidak akan mudah dilupakan.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/37234075/pexels-photo-37234075.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 5,
    "isFeatured": true,
    "status": "PUBLISHED",
    "createdAt": "2025-08-03T02:00:00.000Z",
    "submittedAt": "2025-08-04T02:00:00.000Z",
    "publishedAt": "2025-08-05T02:00:00.000Z",
    "tags": [
      "Kuliner",
      "Pempek",
      "Budaya",
      "Identitas"
    ]
  },
  {
    "slug": "kedai-kopi-third-wave-palembang",
    "title": "Gelombang Ketiga Kopi di Palembang",
    "excerpt": "Kafe-kafe baru bermunculan, masing-masing membawa kisah tersendiri tentang bagaimana anak muda Palembang memandang diri dan kotanya.",
    "content": "<p>Palembang punya tradisi ngopi yang panjang. Tapi dalam beberapa tahun terakhir, tradisi itu bertransformasi dengan cara yang tidak terduga.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/37433831/pexels-photo-37433831.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-06-29T02:00:00.000Z",
    "submittedAt": "2025-06-30T02:00:00.000Z",
    "publishedAt": "2025-07-01T02:00:00.000Z",
    "tags": [
      "Kopi",
      "Gaya Hidup",
      "Kafe",
      "Anak Muda"
    ]
  },
  {
    "slug": "ritual-sarapan-burgo-dan-lakso",
    "title": "Ritual Pagi: Mengapa Burgo dan Lakso Selalu Dicari?",
    "excerpt": "Menelusuri kehangatan kuah santan gurih berpadu rempah ikan yang jadi pembuka hari sempurna wong kito.",
    "content": "<p>Sebelum kesibukan kota dimulai, kedai-kedai sarapan tradisional telah dipadati warga dari berbagai kalangan yang memesan sepiring burgo hangat.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-06-17T02:00:00.000Z",
    "submittedAt": "2025-06-18T02:00:00.000Z",
    "publishedAt": "2025-06-19T02:00:00.000Z",
    "tags": [
      "Sarapan",
      "Burgo",
      "Lakso",
      "Kuliner Tradisional"
    ]
  },
  {
    "slug": "martabak-har-dan-kuah-kari-legendaris",
    "title": "Martabak HAR: Dari Haji Abdul Rozak ke Meja Makan Generasi Kini",
    "excerpt": "Kisah di balik martabak telur kuah kari kental dengan kentang lembut yang telah memikat lidah sejak tahun 1947.",
    "content": "<p>Kelezatan Martabak HAR tak lekang oleh waktu. Cara makannya yang khas dicampur cuka cabai rawit menjadikannya ikon kuliner yang tak tergantikan.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2067396/pexels-photo-2067396.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-06-09T02:00:00.000Z",
    "submittedAt": "2025-06-10T02:00:00.000Z",
    "publishedAt": "2025-06-11T02:00:00.000Z",
    "tags": [
      "Martabak HAR",
      "Kuliner Legendaris",
      "Kari",
      "Palembang"
    ]
  },
  {
    "slug": "jogging-pagi-di-kambang-iwak",
    "title": "Kambang Iwak: Tempat Bertemunya Kebugaran dan Interaksi Sosial",
    "excerpt": "Taman peninggalan kolonial yang kini bertransformasi menjadi pusat gaya hidup sehat dan komunitas urban.",
    "content": "<p>Pohon-pohon trembesi rindang menaungi lintasan lari di sekeliling danau air mancur Kambang Iwak yang selalu semarak setiap akhir pekan.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2225439/pexels-photo-2225439.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-27T02:00:00.000Z",
    "submittedAt": "2025-05-28T02:00:00.000Z",
    "publishedAt": "2025-05-29T02:00:00.000Z",
    "tags": [
      "Kambang Iwak",
      "Olahraga",
      "Taman Kota",
      "Komunitas"
    ]
  },
  {
    "slug": "sensasi-makan-di-warung-terapung",
    "title": "Merasakan Goyangan Perahu Sambil Menyantap Pindang Patin",
    "excerpt": "Eksplorasi makan siang di atas warung terapung Sungai Musi dengan pemandangan lalu lalang kapal tongkang.",
    "content": "<p>Kuah pindang yang asam segar dan pedas berpadu dengan nasi hangat serta terasi cempedak memberikan pengalaman kuliner sungai yang magis.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1850595/pexels-photo-1850595.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-15T02:00:00.000Z",
    "submittedAt": "2025-05-16T02:00:00.000Z",
    "publishedAt": "2025-05-17T02:00:00.000Z",
    "tags": [
      "Pindang Patin",
      "Warung Terapung",
      "Kuliner Sungai",
      "Musi"
    ]
  },
  {
    "slug": "tren-thrift-dan-fashion-vintage",
    "title": "Perburuan Harta Karun Vintage di Pasar Cinde dan Sekitarnya",
    "excerpt": "Geliat anak muda Palembang menyusun gaya personal melalui fashion secondhand yang berkelanjutan.",
    "content": "<p>Thrifting telah berevolusi dari sekadar berburu pakaian murah menjadi pernyataan gaya dan kesadaran lingkungan bagi generasi muda kota.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/958545/pexels-photo-958545.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-02T02:00:00.000Z",
    "submittedAt": "2025-05-03T02:00:00.000Z",
    "publishedAt": "2025-05-04T02:00:00.000Z",
    "tags": [
      "Thrifting",
      "Fashion",
      "Vintage",
      "Anak Muda"
    ]
  },
  {
    "slug": "ngopi-sore-di-pinggir-musi",
    "title": "Menikmati Senja Palembang: Secangkir Kopi di Tepian Benteng",
    "excerpt": "Melihat bagaimana kafe-kafe tepi sungai menciptakan ruang santai baru untuk melepas penat setelah seharian bekerja.",
    "content": "<p>Ketika lampu-lampu Jembatan Ampera mulai menyala kemerahan, deretan kafe tepi sungai menawarkan latar paling sinematik di kota ini.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/312418/pexels-photo-312418.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-18T02:00:00.000Z",
    "submittedAt": "2025-04-19T02:00:00.000Z",
    "publishedAt": "2025-04-20T02:00:00.000Z",
    "tags": [
      "Kopi Senja",
      "Ampera",
      "Chill",
      "Lifestyle"
    ]
  },
  {
    "slug": "es-kacang-merah-dan-manisnya-siang",
    "title": "Es Kacang Merah: Penawar Terik Siang Hari di Bumi Sriwijaya",
    "excerpt": "Kelezatan kacang merah empuk berselimut es serut, sirup merah, dan susu kental manis yang melegenda.",
    "content": "<p>Di tengah teriknya cuaca khatulistiwa Palembang, semangkuk es kacang merah selalu berhasil mengembalikan kesegaran tubuh dan pikiran.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1267320/pexels-photo-1267320.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-06T02:00:00.000Z",
    "submittedAt": "2025-04-07T02:00:00.000Z",
    "publishedAt": "2025-04-08T02:00:00.000Z",
    "tags": [
      "Es Kacang Merah",
      "Dessert",
      "Kuliner Tradisional",
      "Segar"
    ]
  },
  {
    "slug": "komunitas-urban-farming-atap-ruko",
    "title": "Kebun Hijau di Atap Ruko: Oase Urban Warga Palembang",
    "excerpt": "Inisiatif warga menanam sayuran hidroponik dan tanaman herbal di rooftop ruko-ruko padat perkotaan.",
    "content": "<p>Keterbatasan lahan tak menghalangi warga untuk memproduksi bahan pangan organik segar secara mandiri di atap-atap rumah mereka.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-23T02:00:00.000Z",
    "submittedAt": "2025-03-24T02:00:00.000Z",
    "publishedAt": "2025-03-25T02:00:00.000Z",
    "tags": [
      "Urban Farming",
      "Berkebun",
      "Keberlanjutan",
      "Eco Living"
    ]
  },
  {
    "slug": "ruang-publik-yang-hilang-dan-dicari",
    "title": "Ruang Publik yang Hilang dan Dicari",
    "excerpt": "Palembang berkembang pesat, namun ada yang dikorbankan dalam prosesnya: ruang-ruang bertemu yang membuat kota tetap manusiawi.",
    "content": "<p>Urbanisasi membawa banyak hal baik—infrastruktur modern, peluang ekonomi, konektivitas yang lebih baik. Tapi ia juga membawa kehilangan yang pelan-pelan baru terasa.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 7,
    "isFeatured": true,
    "status": "PUBLISHED",
    "createdAt": "2025-07-26T02:00:00.000Z",
    "submittedAt": "2025-07-27T02:00:00.000Z",
    "publishedAt": "2025-07-28T02:00:00.000Z",
    "tags": [
      "Urbanisme",
      "Ruang Publik",
      "Kota",
      "Komunitas"
    ]
  },
  {
    "slug": "transit-oriented-development-palembang",
    "title": "Palembang Menuju Kota Transit: Refleksi Jalur LRT",
    "excerpt": "LRT hadir dan mengubah cara warga bergerak. Namun apakah infrastruktur kota sudah benar-benar siap untuk integrasi penuh?",
    "content": "<p>Ketika LRT Palembang diresmikan pada 2018 untuk Asian Games, banyak yang menyambutnya dengan antusias. Akhirnya Palembang punya transportasi massal modern.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/13401703/pexels-photo-13401703.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 8,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-06-08T02:00:00.000Z",
    "submittedAt": "2025-06-09T02:00:00.000Z",
    "publishedAt": "2025-06-10T02:00:00.000Z",
    "tags": [
      "Transportasi",
      "LRT",
      "Kota",
      "Infrastruktur"
    ]
  },
  {
    "slug": "pasar-cinde-dan-kota-yang-melupakan",
    "title": "Pasar Cinde dan Jejak Arsitektur Cendawan yang Dirindukan",
    "excerpt": "Salah satu pasar paling bersejarah di Sumatera ini kini tinggal kenangan. Sebuah catatan tentang pengembangan kota yang terburu-buru.",
    "content": "<p>Pasar Cinde karya arsitek legendaris Herman Thomas Karsten kini tinggal arsip dokumentasi berharga bagi para pemerhati tata kota.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/16204518/pexels-photo-16204518.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-23T02:00:00.000Z",
    "submittedAt": "2025-05-24T02:00:00.000Z",
    "publishedAt": "2025-05-25T02:00:00.000Z",
    "tags": [
      "Pasar",
      "Sejarah",
      "Kota",
      "Warisan"
    ]
  },
  {
    "slug": "trotoar-ramah-pejalan-kaki-sudirman",
    "title": "Menata Trotoar Sudirman: Impian Kota yang Nyaman Dilewati Kaki",
    "excerpt": "Meninjau kembali revitalisasi jalur pedestrian pusat kota dan tantangan menjaga hak pejalan kaki di era kendaraan bermotor.",
    "content": "<p>Sebuah kota yang ramah dan inklusif diukur dari kemudahan warganya berjalan kaki tanpa rasa takut dan terhalang hambatan fisik.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/378570/pexels-photo-378570.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-12T02:00:00.000Z",
    "submittedAt": "2025-05-13T02:00:00.000Z",
    "publishedAt": "2025-05-14T02:00:00.000Z",
    "tags": [
      "Pedestrian",
      "Trotoar",
      "Mobilitas",
      "Tata Kota"
    ]
  },
  {
    "slug": "musi-iv-dan-konektivitas-seberang-ulu",
    "title": "Jembatan Musi IV dan Dinamika Baru Kawasan Seberang Ulu",
    "excerpt": "Bagaimana jembatan kabel pancang baru membuka simpul ekonomi dan interaksi sosial masyarakat pinggiran sungai.",
    "content": "<p>Kehadiran Jembatan Musi IV tidak hanya memangkas waktu tempuh, tetapi juga mengubah tata guna lahan dan wajah perumahan di sekitarnya.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/258447/pexels-photo-258447.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-30T02:00:00.000Z",
    "submittedAt": "2025-05-01T02:00:00.000Z",
    "publishedAt": "2025-05-02T02:00:00.000Z",
    "tags": [
      "Musi IV",
      "Jembatan",
      "Infrastruktur",
      "Seberang Ulu"
    ]
  },
  {
    "slug": "jakabaring-setelah-pesta-olahraga",
    "title": "Jakabaring Sport City: Merawat Kawasan Olahraga Kelas Dunia",
    "excerpt": "Melihat pemanfaatan kompleks olahraga terpadu seluas 325 hektar sebagai ruang publik hijau dan arena rekreasi warga.",
    "content": "<p>Tantangan terbesar pasca penyelenggaraan pesta olahraga akbar adalah memastikan seluruh arena tetap terawat, produktif, dan terbuka bagi publik.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 7,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-19T02:00:00.000Z",
    "submittedAt": "2025-04-20T02:00:00.000Z",
    "publishedAt": "2025-04-21T02:00:00.000Z",
    "tags": [
      "Jakabaring",
      "Ruang Terbuka Hijau",
      "Olahraga",
      "Urban"
    ]
  },
  {
    "slug": "revitalisasi-benteng-kuto-besak",
    "title": "Benteng Kuto Besak: Menjaga Plaza Publik Terbuka Menghadap Sungai",
    "excerpt": "Plaza bersejarah yang menjadi magnet berkumpulnya berbagai lapisan warga kota dari sore hingga larut malam.",
    "content": "<p>Kawasan BKB adalah ruang demokratis di mana semua orang bisa duduk bersama menikmati hembusan angin Musi tanpa harus membayar mahal.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-07T02:00:00.000Z",
    "submittedAt": "2025-04-08T02:00:00.000Z",
    "publishedAt": "2025-04-09T02:00:00.000Z",
    "tags": [
      "BKB",
      "Ruang Publik",
      "Plaza",
      "Pusat Kota"
    ]
  },
  {
    "slug": "kantong-resapan-air-dan-banjir-musiman",
    "title": "Menyelamatkan Rawa Terakhir: Benteng Alami Banjir Palembang",
    "excerpt": "Mengapa konservasi lahan basah dan danau retensi menjadi kunci kelangsungan hidup Palembang di masa depan.",
    "content": "<p>Sebagai kota air, Palembang memerlukan strategi berbasis alam untuk mengelola limpasan air hujan dan pasang surut Sungai Musi secara berkelanjutan.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1034662/pexels-photo-1034662.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-27T02:00:00.000Z",
    "submittedAt": "2025-03-28T02:00:00.000Z",
    "publishedAt": "2025-03-29T02:00:00.000Z",
    "tags": [
      "Ekologi",
      "Rawa",
      "Danau Retensi",
      "Lingkungan"
    ]
  },
  {
    "slug": "taman-taman-tematik-di-sudut-kampung",
    "title": "Taman Tematik Komunitas: Inisiatif Hijau dari Tingkat RT",
    "excerpt": "Bagaimana warga menyulap lahan terbengkalai menjadi taman baca dan ruang bermain ramah anak.",
    "content": "<p>Perubahan tata ruang tidak selalu harus berskala besar. Gerakan swadaya tingkat rukun tetangga justru sering kali memberikan dampak langsung paling nyata.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/280221/pexels-photo-280221.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-14T02:00:00.000Z",
    "submittedAt": "2025-03-15T02:00:00.000Z",
    "publishedAt": "2025-03-16T02:00:00.000Z",
    "tags": [
      "Taman Komunitas",
      "Swadaya",
      "Hijau",
      "Keluarga"
    ]
  },
  {
    "slug": "integrasi-feeder-angkot-modern",
    "title": "Angkot Feeder LRT: Jembatan Menuju Mobilitas Terintegrasi",
    "excerpt": "Ulasan tentang armada mikrobus ber-AC yang menjemput warga dari permukiman menuju stasiun kereta ringan.",
    "content": "<p>Membangun kebiasaan menggunakan transportasi umum membutuhkan kemudahan akses dari pintu rumah hingga tujuan akhir (first-mile and last-mile connectivity).</p>",
    "coverImageUrl": "https://images.pexels.com/photos/13401703/pexels-photo-13401703.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-03T02:00:00.000Z",
    "submittedAt": "2025-03-04T02:00:00.000Z",
    "publishedAt": "2025-03-05T02:00:00.000Z",
    "tags": [
      "Feeder LRT",
      "Angkot Modern",
      "Mobilitas",
      "Kota Pintar"
    ]
  },
  {
    "slug": "startup-lokal-mengubah-ekonomi-kota",
    "title": "Startup Lokal yang Perlahan Mengubah Wajah Ekonomi Kota",
    "excerpt": "Dari coworking space sederhana di ruko tua, ekosistem startup Palembang mulai tumbuh dengan caranya sendiri.",
    "content": "<p>Lima tahun lalu, kata 'startup' terdengar asing di Palembang. Sekarang tidak lagi. Bermunculan komunitas-komunitas kreatif dan inkubator bisnis anak muda.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/37433831/pexels-photo-37433831.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 6,
    "isFeatured": true,
    "status": "PUBLISHED",
    "createdAt": "2025-07-13T02:00:00.000Z",
    "submittedAt": "2025-07-14T02:00:00.000Z",
    "publishedAt": "2025-07-15T02:00:00.000Z",
    "tags": [
      "Startup",
      "Ekonomi",
      "Inovasi",
      "Anak Muda"
    ]
  },
  {
    "slug": "mural-dan-wajah-baru-kota",
    "title": "Mural dan Wajah Baru Kota: Dari Tembok Kusam ke Galeri Terbuka",
    "excerpt": "Tembok-tembok kota Palembang perlahan berubah menjadi kanvas. Di balik setiap mural ada seniman yang ingin bersuara.",
    "content": "<p>Kota yang hidup adalah kota yang berbicara. Dan Palembang mulai berbicara semakin keras melalui dinding-dindingnya melalui goresan seni mural artistik.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/36748274/pexels-photo-36748274.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-06-22T02:00:00.000Z",
    "submittedAt": "2025-06-23T02:00:00.000Z",
    "publishedAt": "2025-06-24T02:00:00.000Z",
    "tags": [
      "Seni",
      "Mural",
      "Kreatif",
      "Kota"
    ]
  },
  {
    "slug": "geliat-musisi-indie-palembang",
    "title": "Nada-Nada Segar dari Skena Musik Indie Palembang",
    "excerpt": "Eksplorasi band-band lokal yang memadukan lirik puitis berbahasa daerah dengan aransemen modern bernuansa dream pop dan indie rock.",
    "content": "<p>Studio-studio rekaman mandiri di seputaran Plaju dan Sukarami menjadi kawah candradimuka bagi karya-karya musik yang mulai menembus tangga lagu nasional.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3184325/pexels-photo-3184325.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-06-10T02:00:00.000Z",
    "submittedAt": "2025-06-11T02:00:00.000Z",
    "publishedAt": "2025-06-12T02:00:00.000Z",
    "tags": [
      "Musik Indie",
      "Skena Musik",
      "Band Lokal",
      "Kreativitas"
    ]
  },
  {
    "slug": "desainer-grafis-dan-tipografi-lokal",
    "title": "Mendesain Ulang Palembang: Eksplorasi Tipografi dan Visual Brand",
    "excerpt": "Desainer muda yang mengangkat motif ukiran dan aksara kuno menjadi identitas visual modern bagi produk-produk lokal.",
    "content": "<p>Mengawinkan estetika klasik Sriwijaya dengan kaidah desain grafis kontemporer menciptakan identitas produk yang berkarakter kuat dan berdaya saing global.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3184291/pexels-photo-3184291.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-28T02:00:00.000Z",
    "submittedAt": "2025-05-29T02:00:00.000Z",
    "publishedAt": "2025-05-30T02:00:00.000Z",
    "tags": [
      "Desain Grafis",
      "Branding",
      "Tipografi",
      "Desain"
    ]
  },
  {
    "slug": "pembuat-film-dokumenter-independen",
    "title": "Merekam Ingatan: Sineas Palembang dan Sinema Dokumenter",
    "excerpt": "Kisah di balik layar para pembuat film muda yang mendokumentasikan kearifan lokal sebelum tergerus arus zaman.",
    "content": "<p>Melalui festival film independen dan pemutaran layar tancap alternatif, sineas Palembang membangun dialog kritis mengenai perubahan sosial kota.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3184357/pexels-photo-3184357.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-16T02:00:00.000Z",
    "submittedAt": "2025-05-17T02:00:00.000Z",
    "publishedAt": "2025-05-18T02:00:00.000Z",
    "tags": [
      "Film Pendek",
      "Dokumenter",
      "Sinema",
      "Karya"
    ]
  },
  {
    "slug": "brand-apparel-streetwear-lokal",
    "title": "Streetwear Berjiwa Sriwijaya: Ketika Warisan Jadi Tren Fashion",
    "excerpt": "Label pakaian lokal yang memadukan kultur jalanan dengan filosofi kearifan lokal Palembang.",
    "content": "<p>Kaos grafis, hoodie, dan jaket dengan aksen motif songket kontemporer menjadi kebanggaan baru anak muda Palembang dalam bergaya.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3184339/pexels-photo-3184339.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-04T02:00:00.000Z",
    "submittedAt": "2025-05-05T02:00:00.000Z",
    "publishedAt": "2025-05-06T02:00:00.000Z",
    "tags": [
      "Streetwear",
      "Fashion Lokal",
      "Brand",
      "Kreatif"
    ]
  },
  {
    "slug": "fotografi-arsitektur-dan-arsip-kota",
    "title": "Membekukan Waktu: Lensa Fotografer yang Memotret Rumah Panggung",
    "excerpt": "Proyek dokumentasi visual mandiri yang memetakan rumah-rumah kayu bersejarah di 100 kelurahan Palembang.",
    "content": "<p>Foto-foto beresolusi tinggi ini bukan sekadar karya seni estetis, melainkan data sejarah arsitektur yang tak ternilai harganya bagi generasi mendatang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3184360/pexels-photo-3184360.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-21T02:00:00.000Z",
    "submittedAt": "2025-04-22T02:00:00.000Z",
    "publishedAt": "2025-04-23T02:00:00.000Z",
    "tags": [
      "Fotografi",
      "Arsitektur",
      "Arsip",
      "Dokumentasi"
    ]
  },
  {
    "slug": "studio-keramik-dan-kriya-modern",
    "title": "Sentuhan Tanah Liat: Studio Keramik Kontemporer Palembang",
    "excerpt": "Melihat bagaimana kelas tembikar dan kerajinan keramik menjadi ruang rekreasi kreatif baru bagi warga kota.",
    "content": "<p>Membentuk lempung di atas meja putar memberikan ketenangan terapeutik sekaligus menghasilkan benda-benda fungsional yang bernilai estetika tinggi.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3184306/pexels-photo-3184306.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-09T02:00:00.000Z",
    "submittedAt": "2025-04-10T02:00:00.000Z",
    "publishedAt": "2025-04-11T02:00:00.000Z",
    "tags": [
      "Keramik",
      "Kriya",
      "Workshop",
      "Seni Rupa"
    ]
  },
  {
    "slug": "agensi-digital-kreatif-anak-daerah",
    "title": "Menembus Pasar Global dari Kamar Tidur: Cerita Agensi Digital Lokal",
    "excerpt": "Anak-anak muda Palembang yang melayani klien internasional untuk kebutuhan animasi, UI/UX, dan periklanan digital.",
    "content": "<p>Bermodalkan koneksi internet stabil dan kemampuan teknis kelas dunia, talenta digital Palembang membuktikan bahwa batas geografis tak lagi menjadi halangan.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3184418/pexels-photo-3184418.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-25T02:00:00.000Z",
    "submittedAt": "2025-03-26T02:00:00.000Z",
    "publishedAt": "2025-03-27T02:00:00.000Z",
    "tags": [
      "Digital Agency",
      "Animasi",
      "UI/UX",
      "Talenta Lokal"
    ]
  },
  {
    "slug": "kolektif-kreator-konten-edukatif",
    "title": "Menceritakan Palembang: Kreator Konten yang Mengangkat Bahasa Daerah",
    "excerpt": "Geliat pembuat konten TikTok dan Instagram yang mempopulerkan kosakata bahasa Palembang halus dan sejarah lokal.",
    "content": "<p>Dengan pendekatan humor segar dan narasi yang ramah, generasi muda diajak untuk kembali bangga menggunakan bahasa ibu mereka dalam percakapan sehari-hari.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3183150/pexels-photo-3183150.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-13T02:00:00.000Z",
    "submittedAt": "2025-03-14T02:00:00.000Z",
    "publishedAt": "2025-03-15T02:00:00.000Z",
    "tags": [
      "Kreator Konten",
      "Bahasa Daerah",
      "Edukasi",
      "Sosial Media"
    ]
  },
  {
    "slug": "tenun-songket-generasi-baru",
    "title": "Tenun Songket dan Generasi Baru Penenunnya",
    "excerpt": "Anak-anak muda Palembang mulai kembali ke alat tenun, menemukan bahwa warisan bisa menjadi karir yang bermartabat dan berkelanjutan.",
    "content": "<p>Di sebuah workshop kecil di kawasan Kuto Besak, suara derik alat tenun berpadu dengan playlist Spotify. Inilah gambaran Palembang masa kini.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 8,
    "isFeatured": true,
    "status": "PUBLISHED",
    "createdAt": "2025-07-18T02:00:00.000Z",
    "submittedAt": "2025-07-19T02:00:00.000Z",
    "publishedAt": "2025-07-20T02:00:00.000Z",
    "tags": [
      "Songket",
      "Kebudayaan",
      "Tradisi",
      "Anak Muda"
    ]
  },
  {
    "slug": "rumah-limas-warisan-arsitektur",
    "title": "Rumah Limas: Warisan Arsitektur yang Butuh Dirawat",
    "excerpt": "Rumah tradisional Palembang yang ikonik ini menghadapi ancaman kepunahan ketika modernitas lebih mendominasi.",
    "content": "<p>Rumah Limas adalah salah satu ikon arsitektur terkuat yang dimiliki Palembang dengan tingkatan lantai (kekijing) yang sarat makna filosofis kesopanan adat.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/10682942/pexels-photo-10682942.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-06-16T02:00:00.000Z",
    "submittedAt": "2025-06-17T02:00:00.000Z",
    "publishedAt": "2025-06-18T02:00:00.000Z",
    "tags": [
      "Arsitektur",
      "Warisan",
      "Rumah Limas",
      "Budaya"
    ]
  },
  {
    "slug": "festival-sriwijaya-lebih-dari-parade",
    "title": "Festival Sriwijaya: Menggali Kembali Kejayaan Maritim Nusantara",
    "excerpt": "Di balik keramaian perayaan tahunan ini, ada upaya serius untuk menghidupkan kembali kejayaan peradaban maritim kuno.",
    "content": "<p>Setiap Juni, Palembang bersolek memperingati masa lalu gemilang kerajaan maritim Sriwijaya yang menghubungkan perdagangan Asia abad ke-7.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/10682943/pexels-photo-10682943.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 7,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-31T02:00:00.000Z",
    "submittedAt": "2025-06-01T02:00:00.000Z",
    "publishedAt": "2025-06-02T02:00:00.000Z",
    "tags": [
      "Festival",
      "Sriwijaya",
      "Sejarah",
      "Kebudayaan"
    ]
  },
  {
    "slug": "gending-sriwijaya-tarian-penyambut-tamu",
    "title": "Gending Sriwijaya: Keagungan Gerak dan Musik Penyambut Tamu Agung",
    "excerpt": "Menyelami makna gerak gemulai tangan berkuku tanggai emas dan alunan musik gamelan khas Palembang.",
    "content": "<p>Tari Gending Sriwijaya bukan sekadar hiburan visual, melainkan simbol keramahan tertinggi wong kito dalam menyambut para tamu kehormatan.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/38885810/pexels-photo-38885810.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-19T02:00:00.000Z",
    "submittedAt": "2025-05-20T02:00:00.000Z",
    "publishedAt": "2025-05-21T02:00:00.000Z",
    "tags": [
      "Gending Sriwijaya",
      "Tari Tradisional",
      "Seni Pertunjukan",
      "Adat"
    ]
  },
  {
    "slug": "aksara-kaganga-jejak-tulisan-leluhur",
    "title": "Aksara Kaganga: Menyelamatkan Tulisan Kuno Sumatera Selatan",
    "excerpt": "Upaya para filolog muda membaca naskah kulit kayu tanduk kerbau dan memperkenalkannya ke kurikulum sekolah.",
    "content": "<p>Sebelum mengenal huruf alfabet latin dan Arab Melayu, leluhur Sumatera Selatan telah memiliki sistem aksara Kaganga (Surat Ulu) yang anggun dan sarat pesan moral.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/34373985/pexels-photo-34373985.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-05-07T02:00:00.000Z",
    "submittedAt": "2025-05-08T02:00:00.000Z",
    "publishedAt": "2025-05-09T02:00:00.000Z",
    "tags": [
      "Aksara Kaganga",
      "Filologi",
      "Naskah Kuno",
      "Pendidikan"
    ]
  },
  {
    "slug": "tanjak-palembang-dan-mahkota-lelaki",
    "title": "Tanjak Palembang: Mahkota Kain dan Makna Wibawa Kaum Pria",
    "excerpt": "Mengenal berbagai lipatan penutup kepala tradisional seperti Tanjak Kepudang dan Meler yang kini kembali digemari.",
    "content": "<p>Tanjak kini bukan hanya dikenakan saat akad nikah, melainkan telah menjadi simbol kebanggaan identitas budaya dalam berbagai acara resmi dan kasual.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14795560/pexels-photo-14795560.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-24T02:00:00.000Z",
    "submittedAt": "2025-04-25T02:00:00.000Z",
    "publishedAt": "2025-04-26T02:00:00.000Z",
    "tags": [
      "Tanjak",
      "Pakaian Adat",
      "Identitas",
      "Budaya"
    ]
  },
  {
    "slug": "tradisi-ngidang-dan-makan-bersama",
    "title": "Tradisi Ngidang: Duduk Bersila dalam Kehangatan Jamuan Adat",
    "excerpt": "Filosofi kesetaraan dan kebersamaan di mana satu dulang makanan dinikmati bersama oleh delapan orang tanpa sekat kasta.",
    "content": "<p>Tradisi ngidang (ngobeng) pada pesta perkawinan adat mengajarkan rasa saling menghargai, gotong royong, dan keakraban sosial antarwarga.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/29995581/pexels-photo-29995581.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-04-12T02:00:00.000Z",
    "submittedAt": "2025-04-13T02:00:00.000Z",
    "publishedAt": "2025-04-14T02:00:00.000Z",
    "tags": [
      "Ngidang",
      "Tradisi",
      "Adat Istiadat",
      "Kebersamaan"
    ]
  },
  {
    "slug": "seni-pantun-melayu-palembang",
    "title": "Kelakar Betunggang: Humor Cerdas dalam Sastra Tutur Palembang",
    "excerpt": "Menyelami tradisi pantun bersahut dan kelakar jenaka yang menjadi perekat komunikasi akrab masyarakat akar rumput.",
    "content": "<p>Bahasa Palembang yang kaya rima dan intonasi ekspresif membuat tradisi lisan ini selalu sukses menghidupkan suasana di setiap perkumpulan.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/31409070/pexels-photo-31409070.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 4,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-30T02:00:00.000Z",
    "submittedAt": "2025-03-31T02:00:00.000Z",
    "publishedAt": "2025-04-01T02:00:00.000Z",
    "tags": [
      "Pantun",
      "Sastra Lisan",
      "Kelakar",
      "Bahasa"
    ]
  },
  {
    "slug": "lomba-perahu-bidar-tradisional",
    "title": "Lomba Perahu Bidar: Deburan Dayung yang Membakar Semangat Musi",
    "excerpt": "Tradisi adu cepat perahu naga khas Palembang sepanjang 29 meter yang telah digelar sejak zaman Kesultanan.",
    "content": "<p>Sorak-sorai ratusan ribu penonton di kedua sisi Sungai Musi menyemangati para pendayung yang berpeluh membelah arus sungai demi kehormatan kampungnya.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/32844866/pexels-photo-32844866.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 6,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-17T02:00:00.000Z",
    "submittedAt": "2025-03-18T02:00:00.000Z",
    "publishedAt": "2025-03-19T02:00:00.000Z",
    "tags": [
      "Perahu Bidar",
      "Lomba Dayung",
      "Tradisi Musi",
      "Pesta Rakyat"
    ]
  },
  {
    "slug": "ukiran-kayu-motif-tumbuhan-palembang",
    "title": "Keahlian Ukir Kayu Palembang: Filosofi Tumbuhan Berbalut Emas",
    "excerpt": "Menengok ketelitian para pemahat ornamen bunga melati dan teratai bersepuh perada emas murni pada lemari dan pelaminan.",
    "content": "<p>Setiap lekuk ukiran kayu tembesu khas Palembang menyimpan doa tentang keharmonisan rumah tangga, kemakmuran, dan kedamaian hidup.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 5,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2025-03-05T02:00:00.000Z",
    "submittedAt": "2025-03-06T02:00:00.000Z",
    "publishedAt": "2025-03-07T02:00:00.000Z",
    "tags": [
      "Ukiran Kayu",
      "Seni Kriya",
      "Emas Perada",
      "Warisan"
    ]
  },
  {
    "slug": "menyusuri-jejak-trem-di-palembang",
    "title": "Menyusuri Jejak Trem di Palembang",
    "excerpt": "Sejarah transportasi publik yang pernah berjaya di masa Hindia Belanda dan bagaimana jejaknya membentuk tata kota saat ini.",
    "content": "<p>Palembang pernah memiliki sistem transportasi trem uap yang melintasi pusat kota pada era Hindia Belanda. Menghubungkan pelabuhan Boom Baru hingga ke area pemukiman warga di seberang Ilir.</p><p>Jejak-jejak peninggalan ini kini menjadi bagian dari cagar budaya kota yang menarik untuk ditelusuri kembali.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-23T01:00:00.000Z",
    "submittedAt": "2026-08-24T01:00:00.000Z",
    "publishedAt": "2026-08-25T01:00:00.000Z",
    "tags": [
      "sejarah",
      "transportasi",
      "palembang",
      "heritage"
    ]
  },
  {
    "slug": "resep-pindang-patin-warisan-karuhun",
    "title": "Resep Pindang Patin Warisan Karuhun",
    "excerpt": "Rahasia bumbu rahasia dari dapur nenek moyang wong kito galo yang telah diwariskan turun-temurun lintas generasi.",
    "content": "<p>Pindang patin adalah salah satu ikon kuliner Palembang yang tak pernah lekang oleh waktu. Kuahnya yang segar dengan perpaduan rasa asam nanas, pedas cabai burung, dan aroma kemangi menjadikannya primadona meja makan keluarga.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-22T08:30:00.000Z",
    "submittedAt": "2026-08-23T08:30:00.000Z",
    "publishedAt": "2026-08-24T08:30:00.000Z",
    "tags": [
      "kuliner",
      "pindang",
      "tradisional",
      "resep"
    ]
  },
  {
    "slug": "revitalisasi-kawasan-sekanak-lambidaro",
    "title": "Revitalisasi Kawasan Sekanak Lambidaro",
    "excerpt": "Potret wajah baru bantaran sungai Palembang yang disulap menjadi destinasi wisata kreatif.",
    "content": "<p>Potret wajah baru bantaran sungai Palembang yang disulap menjadi destinasi wisata kreatif.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-21T04:20:00.000Z",
    "submittedAt": "2026-08-22T04:20:00.000Z",
    "publishedAt": "2026-08-23T04:20:00.000Z",
    "tags": [
      "Ruang Kota",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "misteri-terowongan-kuno-benteng-kuto-besak",
    "title": "Misteri Terowongan Kuno Benteng Kuto Besak",
    "excerpt": "Eksplorasi lorong-lorong rahasia peninggalan Kesultanan Palembang Darussalam.",
    "content": "<p>Eksplorasi lorong-lorong rahasia peninggalan Kesultanan Palembang Darussalam.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-20T12:45:00.000Z",
    "submittedAt": "2026-08-21T12:45:00.000Z",
    "publishedAt": "2026-08-22T12:45:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "geliat-kopi-lokal-sumatera-selatan",
    "title": "Geliat Kopi Lokal Sumatera Selatan",
    "excerpt": "Menelusuri kebun kopi Semendo hingga ke cangkir-cangkir kedai kopi hits di Palembang.",
    "content": "<p>Menelusuri kebun kopi Semendo hingga ke cangkir-cangkir kedai kopi hits di Palembang.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "DRAFT",
    "createdAt": "2026-08-21T07:10:00.000Z",
    "submittedAt": null,
    "publishedAt": null,
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "kain-songket-palembang-di-panggung-dunia",
    "title": "Kain Songket Palembang di Panggung Dunia",
    "excerpt": "Kisah pengrajin tradisional yang membawa motif lepus berkilau emas ke ajang Paris Fashion Week.",
    "content": "<p>Kisah pengrajin tradisional yang membawa motif lepus berkilau emas ke ajang Paris Fashion Week.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-18T03:00:00.000Z",
    "submittedAt": "2026-08-19T03:00:00.000Z",
    "publishedAt": "2026-08-20T03:00:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "mitos-dan-fakta-seputar-pulau-kemaro",
    "title": "Mitos dan Fakta Seputar Pulau Kemaro",
    "excerpt": "Cerita cinta abadi Tan Bun An dan Siti Fatimah di tengah aliran Sungai Musi.",
    "content": "<p>Cerita cinta abadi Tan Bun An dan Siti Fatimah di tengah aliran Sungai Musi.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-17T09:20:00.000Z",
    "submittedAt": "2026-08-18T09:20:00.000Z",
    "publishedAt": "2026-08-19T09:20:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "eksistensi-pempek-kapal-selam-asli-palembang",
    "title": "Eksistensi Pempek Kapal Selam Asli Palembang",
    "excerpt": "Mengupas sejarah teknik pembuatan pempek dengan isian telur utuh yang gurih kenyal.",
    "content": "<p>Mengupas sejarah teknik pembuatan pempek dengan isian telur utuh yang gurih kenyal.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-16T02:15:00.000Z",
    "submittedAt": "2026-08-17T02:15:00.000Z",
    "publishedAt": "2026-08-18T02:15:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "ragam-motif-rumah-limas-tradisional",
    "title": "Ragam Motif Rumah Limas Tradisional",
    "excerpt": "Filosofi tingkatan ruang pada rumah adat Sumatera Selatan yang sarat makna penghormatan.",
    "content": "<p>Filosofi tingkatan ruang pada rumah adat Sumatera Selatan yang sarat makna penghormatan.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-15T06:40:00.000Z",
    "submittedAt": "2026-08-16T06:40:00.000Z",
    "publishedAt": "2026-08-17T06:40:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "menjaga-kelestarian-ikan-belida-di-sungai-musi",
    "title": "Menjaga Kelestarian Ikan Belida di Sungai Musi",
    "excerpt": "Upaya konservasi satwa ikonik Sumatera Selatan agar populasinya tetap terjaga di habitat alam.",
    "content": "<p>Upaya konservasi satwa ikonik Sumatera Selatan agar populasinya tetap terjaga di habitat alam.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-14T01:30:00.000Z",
    "submittedAt": "2026-08-15T01:30:00.000Z",
    "publishedAt": "2026-08-16T01:30:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "komunitas-skateboard-palembang-dan-ruang-publik",
    "title": "Komunitas Skateboard Palembang dan Ruang Publik",
    "excerpt": "Bagaimana para pemuda kota memanfaatkan ruang terbuka untuk berekspresi secara positif.",
    "content": "<p>Bagaimana para pemuda kota memanfaatkan ruang terbuka untuk berekspresi secara positif.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 3,
    "isFeatured": false,
    "status": "TAKEN_DOWN",
    "createdAt": "2026-08-13T10:00:00.000Z",
    "submittedAt": "2026-08-14T10:00:00.000Z",
    "publishedAt": "2026-08-15T10:00:00.000Z",
    "tags": [
      "Ruang Kota",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "sensasi-pedas-manis-kue-maksuba-palembang",
    "title": "Sensasi Pedas Manis Kue Maksuba Palembang",
    "excerpt": "Kue lapis legendaris yang biasa disajikan pada perayaan hari besar dan pernikahan adat.",
    "content": "<p>Kue lapis legendaris yang biasa disajikan pada perayaan hari besar dan pernikahan adat.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-12T04:15:00.000Z",
    "submittedAt": "2026-08-13T04:15:00.000Z",
    "publishedAt": "2026-08-14T04:15:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "arsitektur-masjid-cheng-ho-jakabaring",
    "title": "Arsitektur Masjid Cheng Ho Jakabaring",
    "excerpt": "Perpaduan harmonis antara budaya Tionghoa, Melayu, dan Islam di bumi Sriwijaya.",
    "content": "<p>Perpaduan harmonis antara budaya Tionghoa, Melayu, dan Islam di bumi Sriwijaya.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-11T08:45:00.000Z",
    "submittedAt": "2026-08-12T08:45:00.000Z",
    "publishedAt": "2026-08-13T08:45:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "perjalanan-sejarah-jembatan-ampera",
    "title": "Perjalanan Sejarah Jembatan Ampera",
    "excerpt": "Dari masa pembangunan era Presiden Soekarno hingga menjadi simbol kebanggaan wong kito.",
    "content": "<p>Dari masa pembangunan era Presiden Soekarno hingga menjadi simbol kebanggaan wong kito.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-10T03:20:00.000Z",
    "submittedAt": "2026-08-11T03:20:00.000Z",
    "publishedAt": "2026-08-12T03:20:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "pasar-16-ilir-urat-nadi-ekonomi-palembang",
    "title": "Pasar 16 Ilir: Urat Nadi Ekonomi Palembang",
    "excerpt": "Suasana geliat pedagang dan pembeli kain, rempah, dan kuliner di pusat perdagangan tertua.",
    "content": "<p>Suasana geliat pedagang dan pembeli kain, rempah, dan kuliner di pusat perdagangan tertua.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-09T02:00:00.000Z",
    "submittedAt": "2026-08-10T02:00:00.000Z",
    "publishedAt": "2026-08-11T02:00:00.000Z",
    "tags": [
      "Ruang Kota",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "pesona-danau-ranau-di-akhir-pekan",
    "title": "Pesona Danau Ranau di Akhir Pekan",
    "excerpt": "Destinasi liburan alam dengan latar Gunung Seminung yang menyegarkan pikiran.",
    "content": "<p>Destinasi liburan alam dengan latar Gunung Seminung yang menyegarkan pikiran.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-08T07:30:00.000Z",
    "submittedAt": "2026-08-09T07:30:00.000Z",
    "publishedAt": "2026-08-10T07:30:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "eksplorasi-seni-teater-dulmuluk",
    "title": "Eksplorasi Seni Teater Dulmuluk",
    "excerpt": "Kesenian teater tradisional khas Palembang yang menggabungkan pantun, tari, dan komedi.",
    "content": "<p>Kesenian teater tradisional khas Palembang yang menggabungkan pantun, tari, dan komedi.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "DRAFT",
    "createdAt": "2026-08-09T12:10:00.000Z",
    "submittedAt": null,
    "publishedAt": null,
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "keunikan-tari-gending-sriwijaya",
    "title": "Keunikan Tari Gending Sriwijaya",
    "excerpt": "Tarian penyambutan tamu agung yang menggambarkan kemegahan dan keramahtamahan Kerajaan Sriwijaya.",
    "content": "<p>Tarian penyambutan tamu agung yang menggambarkan kemegahan dan keramahtamahan Kerajaan Sriwijaya.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-06T01:40:00.000Z",
    "submittedAt": "2026-08-07T01:40:00.000Z",
    "publishedAt": "2026-08-08T01:40:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "strategi-umkm-kriya-palembang-menembus-ekspor",
    "title": "Strategi UMKM Kriya Palembang Menembus Ekspor",
    "excerpt": "Wawancara bersama para pegiat kriya ukir dan anyaman purun dalam memasarkan produk global.",
    "content": "<p>Wawancara bersama para pegiat kriya ukir dan anyaman purun dalam memasarkan produk global.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-05T06:00:00.000Z",
    "submittedAt": "2026-08-06T06:00:00.000Z",
    "publishedAt": "2026-08-07T06:00:00.000Z",
    "tags": [
      "Industri Kreatif",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "menikmati-sunset-romantis-di-tepian-sungai-musi",
    "title": "Menikmati Sunset Romantis di Tepian Sungai Musi",
    "excerpt": "Rekomendasi spot terbaik untuk menikmati pemandangan matahari tenggelam di Palembang.",
    "content": "<p>Rekomendasi spot terbaik untuk menikmati pemandangan matahari tenggelam di Palembang.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-04T09:50:00.000Z",
    "submittedAt": "2026-08-05T09:50:00.000Z",
    "publishedAt": "2026-08-06T09:50:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "evolusi-transportasi-lrt-sumatera-selatan",
    "title": "Evolusi Transportasi LRT Sumatera Selatan",
    "excerpt": "Dampak positif kereta ringan pertama di Indonesia terhadap mobilitas harian warga kota.",
    "content": "<p>Dampak positif kereta ringan pertama di Indonesia terhadap mobilitas harian warga kota.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-03T03:10:00.000Z",
    "submittedAt": "2026-08-04T03:10:00.000Z",
    "publishedAt": "2026-08-05T03:10:00.000Z",
    "tags": [
      "Ruang Kota",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "legenda-putri-kemang-di-tanah-musi",
    "title": "Legenda Putri Kemang di Tanah Musi",
    "excerpt": "Cerita rakyat turun-temurun tentang kecantikan dan kesetiaan seorang putri raja.",
    "content": "<p>Cerita rakyat turun-temurun tentang kecantikan dan kesetiaan seorang putri raja.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "DRAFT",
    "createdAt": "2026-08-04T08:20:00.000Z",
    "submittedAt": null,
    "publishedAt": null,
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "tren-industri-kreatif-digital-anak-muda-palembang",
    "title": "Tren Industri Kreatif Digital Anak Muda Palembang",
    "excerpt": "Perkembangan agensi kreatif, podcaster, dan content creator lokal yang semakin solid.",
    "content": "<p>Perkembangan agensi kreatif, podcaster, dan content creator lokal yang semakin solid.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-08-01T04:30:00.000Z",
    "submittedAt": "2026-08-02T04:30:00.000Z",
    "publishedAt": "2026-08-03T04:30:00.000Z",
    "tags": [
      "Industri Kreatif",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "kelezatan-burgo-dan-celimpungan-khas-sarapan-pagi",
    "title": "Kelezatan Burgo dan Celimpungan Khas Sarapan Pagi",
    "excerpt": "Menu sarapan berkuah santan gurih yang wajib dicoba saat berkunjung ke kota Palembang.",
    "content": "<p>Menu sarapan berkuah santan gurih yang wajib dicoba saat berkunjung ke kota Palembang.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-31T00:30:00.000Z",
    "submittedAt": "2026-08-01T00:30:00.000Z",
    "publishedAt": "2026-08-02T00:30:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "semangat-kolaborasi-komunitas-hijau-palembang",
    "title": "Semangat Kolaborasi Komunitas Hijau Palembang",
    "excerpt": "Aksi nyata penanaman pohon dan pembersihan lingkungan demi masa depan kota yang asri.",
    "content": "<p>Aksi nyata penanaman pohon dan pembersihan lingkungan demi masa depan kota yang asri.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-30T02:45:00.000Z",
    "submittedAt": "2026-07-31T02:45:00.000Z",
    "publishedAt": "2026-08-01T02:45:00.000Z",
    "tags": [
      "Industri Kreatif",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "menemukan-kedamaian-di-taman-kambang-iwak",
    "title": "Menemukan Kedamaian di Taman Kambang Iwak",
    "excerpt": "Aktivitas jogging pagi, komunitas hewan peliharaan, dan suasana teduh di jantung kota.",
    "content": "<p>Aktivitas jogging pagi, komunitas hewan peliharaan, dan suasana teduh di jantung kota.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-28T23:30:00.000Z",
    "submittedAt": "2026-07-29T23:30:00.000Z",
    "publishedAt": "2026-07-30T23:30:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "pesona-arsitektur-kolonial-gedung-jacobson",
    "title": "Pesona Arsitektur Kolonial Gedung Jacobson",
    "excerpt": "Mempelajari sisa kejayaan perdagangan era Hindia Belanda di kawasan Sekanak Ilir.",
    "content": "<p>Mempelajari sisa kejayaan perdagangan era Hindia Belanda di kawasan Sekanak Ilir.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-28T07:15:00.000Z",
    "submittedAt": "2026-07-29T07:15:00.000Z",
    "publishedAt": "2026-07-30T07:15:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "eksotisme-perahu-ketek-menyeberangi-musi",
    "title": "Eksotisme Perahu Ketek Menyeberangi Musi",
    "excerpt": "Sensasi naik perahu tradisional menghubungkan kawasan Seberang Ulu dan Seberang Ilir.",
    "content": "<p>Sensasi naik perahu tradisional menghubungkan kawasan Seberang Ulu dan Seberang Ilir.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-27T10:40:00.000Z",
    "submittedAt": "2026-07-28T10:40:00.000Z",
    "publishedAt": "2026-07-29T10:40:00.000Z",
    "tags": [
      "Cerita Warga",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "resep-kue-gandus-tradisional-khas-palembang",
    "title": "Resep Kue Gandus Tradisional Khas Palembang",
    "excerpt": "Kudapan gurih dari tepung beras bertabur ebi sangrai, cabai merah, dan bawang goreng.",
    "content": "<p>Kudapan gurih dari tepung beras bertabur ebi sangrai, cabai merah, dan bawang goreng.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-26T03:00:00.000Z",
    "submittedAt": "2026-07-27T03:00:00.000Z",
    "publishedAt": "2026-07-28T03:00:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "perjalanan-seniman-kriya-ukir-kayu-palembang",
    "title": "Perjalanan Seniman Kriya Ukir Kayu Palembang",
    "excerpt": "Keahlian mengukir ornamen emas motif bunga melati dan daun teratai yang legendaris.",
    "content": "<p>Keahlian mengukir ornamen emas motif bunga melati dan daun teratai yang legendaris.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-25T06:20:00.000Z",
    "submittedAt": "2026-07-26T06:20:00.000Z",
    "publishedAt": "2026-07-27T06:20:00.000Z",
    "tags": [
      "Industri Kreatif",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "kehangatan-teh-tarik-di-sudut-pasar-kuto",
    "title": "Kehangatan Teh Tarik di Sudut Pasar Kuto",
    "excerpt": "Nongkrong malam sambil menikmati teh tarik buatan pedagang turun-temurun.",
    "content": "<p>Nongkrong malam sambil menikmati teh tarik buatan pedagang turun-temurun.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-24T14:00:00.000Z",
    "submittedAt": "2026-07-25T14:00:00.000Z",
    "publishedAt": "2026-07-26T14:00:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "evolusi-musik-tradisional-batanghari-sembilan",
    "title": "Evolusi Musik Tradisional Batanghari Sembilan",
    "excerpt": "Petikan gitar tunggal dan irama khas pedalaman Sumatera Selatan yang memikat.",
    "content": "<p>Petikan gitar tunggal dan irama khas pedalaman Sumatera Selatan yang memikat.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "DRAFT",
    "createdAt": "2026-07-25T09:10:00.000Z",
    "submittedAt": null,
    "publishedAt": null,
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "tips-berburu-batik-dan-songket-di-pasar-16",
    "title": "Tips Berburu Batik dan Songket di Pasar 16",
    "excerpt": "Panduan memilih kain berkualitas dengan harga terbaik langsung dari pusat grosir.",
    "content": "<p>Panduan memilih kain berkualitas dengan harga terbaik langsung dari pusat grosir.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-22T04:30:00.000Z",
    "submittedAt": "2026-07-23T04:30:00.000Z",
    "publishedAt": "2026-07-24T04:30:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "kisah-di-balik-kampung-arab-al-munawar",
    "title": "Kisah di Balik Kampung Arab Al-Munawar",
    "excerpt": "Eksplorasi cagar budaya rumah kayu berusia ratusan tahun di tepian sungai.",
    "content": "<p>Eksplorasi cagar budaya rumah kayu berusia ratusan tahun di tepian sungai.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "cerita-warga",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-21T02:15:00.000Z",
    "submittedAt": "2026-07-22T02:15:00.000Z",
    "publishedAt": "2026-07-23T02:15:00.000Z",
    "tags": [
      "Cerita Warga",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "eksplorasi-kuliner-malam-lorong-basah-night-market",
    "title": "Eksplorasi Kuliner Malam Lorong Basah Night Market",
    "excerpt": "Aneka ragam jajanan kekinian dan tradisional yang ramai dikunjungi anak muda.",
    "content": "<p>Aneka ragam jajanan kekinian dan tradisional yang ramai dikunjungi anak muda.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-20T13:30:00.000Z",
    "submittedAt": "2026-07-21T13:30:00.000Z",
    "publishedAt": "2026-07-22T13:30:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "menjaga-tradisi-pantun-bersahut-palembang",
    "title": "Menjaga Tradisi Pantun Bersahut Palembang",
    "excerpt": "Seni bertutur sastra lisan yang selalu hadir dalam prosesi lamaran adat wong kito.",
    "content": "<p>Seni bertutur sastra lisan yang selalu hadir dalam prosesi lamaran adat wong kito.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-19T08:00:00.000Z",
    "submittedAt": "2026-07-20T08:00:00.000Z",
    "publishedAt": "2026-07-21T08:00:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "potensi-wisata-geopark-merangin-dan-danau-ranau",
    "title": "Potensi Wisata Geopark Merangin & Danau Ranau",
    "excerpt": "Menghubungkan keindahan alam Sumatera Selatan sebagai magnet pariwisata nasional.",
    "content": "<p>Menghubungkan keindahan alam Sumatera Selatan sebagai magnet pariwisata nasional.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-18T05:45:00.000Z",
    "submittedAt": "2026-07-19T05:45:00.000Z",
    "publishedAt": "2026-07-20T05:45:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "kelezatan-mie-celor-26-ilir-yang-legendaris",
    "title": "Kelezatan Mie Celor 26 Ilir yang Legendaris",
    "excerpt": "Kuah kaldu udang kental dengan taoge dan telur rebus yang menggugah selera.",
    "content": "<p>Kuah kaldu udang kental dengan taoge dan telur rebus yang menggugah selera.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-17T01:20:00.000Z",
    "submittedAt": "2026-07-18T01:20:00.000Z",
    "publishedAt": "2026-07-19T01:20:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "sejarah-percetakan-al-qur-an-tertua-di-palembang",
    "title": "Sejarah Percetakan Al-Qur'an Tertua di Palembang",
    "excerpt": "Jejak sejarah mushaf Al-Qur'an cetak batu pertama di Asia Tenggara karya Kemas Haji Muhammad Azhari.",
    "content": "<p>Jejak sejarah mushaf Al-Qur'an cetak batu pertama di Asia Tenggara karya Kemas Haji Muhammad Azhari.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-16T07:00:00.000Z",
    "submittedAt": "2026-07-17T07:00:00.000Z",
    "publishedAt": "2026-07-18T07:00:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "geliat-komunitas-mural-dan-street-art-kota",
    "title": "Geliat Komunitas Mural dan Street Art Kota",
    "excerpt": "Mempercantik sudut kota Palembang dengan sentuhan visual bermakna sosial.",
    "content": "<p>Mempercantik sudut kota Palembang dengan sentuhan visual bermakna sosial.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-15T09:50:00.000Z",
    "submittedAt": "2026-07-16T09:50:00.000Z",
    "publishedAt": "2026-07-17T09:50:00.000Z",
    "tags": [
      "Industri Kreatif",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "pesona-rumah-rakit-di-sepanjang-sungai-musi",
    "title": "Pesona Rumah Rakit di Sepanjang Sungai Musi",
    "excerpt": "Menilik kearifan lokal warga yang tinggal mengapung di atas sungai sejak ratusan tahun silam.",
    "content": "<p>Menilik kearifan lokal warga yang tinggal mengapung di atas sungai sejak ratusan tahun silam.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-14T03:40:00.000Z",
    "submittedAt": "2026-07-15T03:40:00.000Z",
    "publishedAt": "2026-07-16T03:40:00.000Z",
    "tags": [
      "Ruang Kota",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "resep-sambal-tempoyak-durian-khas-wong-kito",
    "title": "Resep Sambal Tempoyak Durian Khas Wong Kito",
    "excerpt": "Fermentasi durian berpadu pedasnya cabai rawit yang menjadi pelengkap wajib makan pindang.",
    "content": "<p>Fermentasi durian berpadu pedasnya cabai rawit yang menjadi pelengkap wajib makan pindang.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-13T06:10:00.000Z",
    "submittedAt": "2026-07-14T06:10:00.000Z",
    "publishedAt": "2026-07-15T06:10:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "eksplorasi-hutan-wisata-punti-kayu",
    "title": "Eksplorasi Hutan Wisata Punti Kayu",
    "excerpt": "Oase hijau hutan pinus di tengah hiruk pikuk kota metropolitan Palembang.",
    "content": "<p>Oase hijau hutan pinus di tengah hiruk pikuk kota metropolitan Palembang.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-12T02:30:00.000Z",
    "submittedAt": "2026-07-13T02:30:00.000Z",
    "publishedAt": "2026-07-14T02:30:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "inspirasi-wirausaha-muda-olahan-kemplang-panggang",
    "title": "Inspirasi Wirausaha Muda Olahan Kemplang Panggang",
    "excerpt": "Kisah sukses anak muda memodernisasi kemasan kemplang panggang untuk oleh-oleh nusantara.",
    "content": "<p>Kisah sukses anak muda memodernisasi kemasan kemplang panggang untuk oleh-oleh nusantara.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "industri-kreatif",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-11T08:20:00.000Z",
    "submittedAt": "2026-07-12T08:20:00.000Z",
    "publishedAt": "2026-07-13T08:20:00.000Z",
    "tags": [
      "Industri Kreatif",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "keindahan-sunset-di-jembatan-musi-iv-dan-vi",
    "title": "Keindahan Sunset di Jembatan Musi IV dan VI",
    "excerpt": "Dua jembatan modern yang melengkapi panorama Sungai Musi saat senja tiba.",
    "content": "<p>Dua jembatan modern yang melengkapi panorama Sungai Musi saat senja tiba.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-10T11:00:00.000Z",
    "submittedAt": "2026-07-11T11:00:00.000Z",
    "publishedAt": "2026-07-12T11:00:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "melestarikan-aksara-kaganga-sumatera-selatan",
    "title": "Melestarikan Aksara Kaganga Sumatera Selatan",
    "excerpt": "Upaya generasi muda mengajarkan kembali aksara kuno nusantara di era digital.",
    "content": "<p>Upaya generasi muda mengajarkan kembali aksara kuno nusantara di era digital.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-09T04:00:00.000Z",
    "submittedAt": "2026-07-10T04:00:00.000Z",
    "publishedAt": "2026-07-11T04:00:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "sensasi-pedas-gurih-nasi-minyak-khas-palembang",
    "title": "Sensasi Pedas Gurih Nasi Minyak Khas Palembang",
    "excerpt": "Hidangan khas beraroma rempah kapulaga dan minyak samin untuk perayaan istimewa.",
    "content": "<p>Hidangan khas beraroma rempah kapulaga dan minyak samin untuk perayaan istimewa.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "gaya-hidup",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-08T05:30:00.000Z",
    "submittedAt": "2026-07-09T05:30:00.000Z",
    "publishedAt": "2026-07-10T05:30:00.000Z",
    "tags": [
      "Gaya Hidup",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "perjalanan-komunitas-peduli-cagar-budaya",
    "title": "Perjalanan Komunitas Peduli Cagar Budaya",
    "excerpt": "Mendokumentasikan bangunan bersejarah di Palembang agar tidak lekang oleh waktu.",
    "content": "<p>Mendokumentasikan bangunan bersejarah di Palembang agar tidak lekang oleh waktu.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "kebudayaan",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-07T07:40:00.000Z",
    "submittedAt": "2026-07-08T07:40:00.000Z",
    "publishedAt": "2026-07-09T07:40:00.000Z",
    "tags": [
      "Kebudayaan",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "menjajaki-ruang-terbuka-hijau-jakabaring-sport-city",
    "title": "Menjajaki Ruang Terbuka Hijau Jakabaring Sport City",
    "excerpt": "Kawasan olahraga bertaraf internasional yang menjadi ruang publik favorit warga.",
    "content": "<p>Kawasan olahraga bertaraf internasional yang menjadi ruang publik favorit warga.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-06T00:15:00.000Z",
    "submittedAt": "2026-07-07T00:15:00.000Z",
    "publishedAt": "2026-07-08T00:15:00.000Z",
    "tags": [
      "Ruang Kota",
      "Palembang",
      "Artikel"
    ]
  },
  {
    "slug": "masa-depan-kota-palembang-menuju-smart-city",
    "title": "Masa Depan Kota Palembang Menuju Smart City",
    "excerpt": "Inovasi digital dan integrasi layanan publik demi kenyamanan wong kito galo.",
    "content": "<p>Inovasi digital dan integrasi layanan publik demi kenyamanan wong kito galo.</p><p>Artikel ini merekam cerita, pengetahuan, dan perubahan yang tumbuh bersama warga Palembang.</p>",
    "coverImageUrl": "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    "categorySlug": "ruang-kota",
    "readingTime": 3,
    "isFeatured": false,
    "status": "PUBLISHED",
    "createdAt": "2026-07-05T03:00:00.000Z",
    "submittedAt": "2026-07-06T03:00:00.000Z",
    "publishedAt": "2026-07-07T03:00:00.000Z",
    "tags": [
      "Ruang Kota",
      "Palembang",
      "Artikel"
    ]
  }
] as const satisfies readonly DefaultArticle[]
