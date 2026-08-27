import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Eye, Edit2, Send, RotateCcw, Heart, MessageCircle } from "lucide-react"
import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const initialArticles = [
    { id: 1, title: "Menyusuri Jejak Trem di Palembang", desc: "Sejarah transportasi publik yang pernah berjaya di masa Hindia Belanda tempo dulu...", date: "25 Aug 2026, 08:00", views: "1.2K", likes: 340, comments: 24, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 2, title: "Resep Pindang Patin Warisan Karuhun", desc: "Rahasia bumbu rahasia dari dapur nenek moyang wong kito galo yang melegenda...", date: "24 Aug 2026, 15:30", views: "3.4K", likes: 890, comments: 67, status: "Post", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 3, title: "Revitalisasi Kawasan Sekanak Lambidaro", desc: "Potret wajah baru bantaran sungai Palembang yang disulap menjadi destinasi wisata kreatif...", date: "23 Aug 2026, 11:20", views: "2.1K", likes: 450, comments: 38, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 4, title: "Misteri Terowongan Kuno Benteng Kuto Besak", desc: "Eksplorasi lorong-lorong rahasia peninggalan Kesultanan Palembang Darussalam...", date: "22 Aug 2026, 19:45", views: "4.8K", likes: "1.1K", comments: 95, status: "Post", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 5, title: "Geliat Kopi Lokal Sumatera Selatan", desc: "Menelusuri kebun kopi Semendo hingga ke cangkir-cangkir kedai kopi hits di Palembang...", date: "21 Aug 2026, 14:10", views: "980", likes: 210, comments: 16, status: "Draf", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 6, title: "Kain Songket Palembang di Panggung Dunia", desc: "Kisah pengrajin tradisional yang membawa motif lepus berkilau emas ke ajang Paris Fashion Week...", date: "20 Aug 2026, 10:00", views: "3.2K", likes: 720, comments: 49, status: "Post", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 7, title: "Mitos dan Fakta Seputar Pulau Kemaro", desc: "Cerita cinta abadi Tan Bun An dan Siti Fatimah di tengah aliran Sungai Musi...", date: "19 Aug 2026, 16:20", views: "2.7K", likes: 580, comments: 33, status: "Post", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 8, title: "Eksistensi Pempek Kapal Selam Asli Palembang", desc: "Mengupas sejarah teknik pembuatan pempek dengan isian telur utuh yang gurih kenyal...", date: "18 Aug 2026, 09:15", views: "5.1K", likes: "1.4K", comments: 112, status: "Post", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 9, title: "Ragam Motif Rumah Limas Tradisional", desc: "Filosofi tingkatan ruang pada rumah adat Sumatera Selatan yang sarat makna penghormatan...", date: "17 Aug 2026, 13:40", views: "1.5K", likes: 310, comments: 19, status: "Post", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 10, title: "Menjaga Kelestarian Ikan Belida di Sungai Musi", desc: "Upaya konservasi satwa ikonik Sumatera Selatan agar populasinya tetap terjaga di habitat alam...", date: "16 Aug 2026, 08:30", views: "1.8K", likes: 410, comments: 27, status: "Post", banner: "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 11, title: "Komunitas Skateboard Palembang dan Ruang Publik", desc: "Bagaimana para pemuda kota memanfaatkan ruang terbuka untuk berekspresi secara positif...", date: "15 Aug 2026, 17:00", views: "850", likes: 190, comments: 14, status: "Takedown", banner: "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 12, title: "Sensasi Pedas Manis Kue Maksuba Palembang", desc: "Kue lapis legendaris yang biasa disajikan pada perayaan hari besar dan pernikahan adat...", date: "14 Aug 2026, 11:15", views: "2.3K", likes: 520, comments: 41, status: "Post", banner: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 13, title: "Arsitektur Masjid Cheng Ho Jakabaring", desc: "Perpaduan harmonis antara budaya Tionghoa, Melayu, dan Islam di bumi Sriwijaya...", date: "13 Aug 2026, 15:45", views: "3.6K", likes: 810, comments: 55, status: "Post", banner: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 14, title: "Perjalanan Sejarah Jembatan Ampera", desc: "Dari masa pembangunan era Presiden Soekarno hingga menjadi simbol kebanggaan wong kito...", date: "12 Aug 2026, 10:20", views: "6.2K", likes: "1.8K", comments: 140, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 15, title: "Pasar 16 Ilir: Urat Nadi Ekonomi Palembang", desc: "Suasana geliat pedagang dan pembeli kain, rempah, dan kuliner di pusat perdagangan tertua...", date: "11 Aug 2026, 09:00", views: "1.9K", likes: 380, comments: 22, status: "Post", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 16, title: "Pesona Danau Ranau di Akhir Pekan", desc: "Destinasi liburan alam dengan latar Gunung Seminung yang menyegarkan pikiran...", date: "10 Aug 2026, 14:30", views: "2.8K", likes: 640, comments: 37, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 17, title: "Eksplorasi Seni Teater Dulmuluk", desc: "Kesenian teater tradisional khas Palembang yang menggabungkan pantun, tari, dan komedi...", date: "09 Aug 2026, 19:10", views: "1.1K", likes: 250, comments: 18, status: "Draf", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 18, title: "Keunikan Tari Gending Sriwijaya", desc: "Tarian penyambutan tamu agung yang menggambarkan kemegahan dan keramahtamahan Kerajaan Sriwijaya...", date: "08 Aug 2026, 08:40", views: "4.1K", likes: 920, comments: 63, status: "Post", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 19, title: "Strategi UMKM Kriya Palembang Menembus Ekspor", desc: "Wawancara bersama para pegiat kriya ukir dan anyaman purun dalam memasarkan produk global...", date: "07 Aug 2026, 13:00", views: "1.4K", likes: 290, comments: 20, status: "Post", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 20, title: "Menikmati Sunset Romantis di Tepian Sungai Musi", desc: "Rekomendasi spot terbaik untuk menikmati pemandangan matahari tenggelam di Palembang...", date: "06 Aug 2026, 16:50", views: "3.7K", likes: 880, comments: 72, status: "Post", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 21, title: "Evolusi Transportasi LRT Sumatera Selatan", desc: "Dampak positif kereta ringan pertama di Indonesia terhadap mobilitas harian warga kota...", date: "05 Aug 2026, 10:10", views: "2.6K", likes: 510, comments: 35, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 22, title: "Legenda Putri Kemang di Tanah Musi", desc: "Cerita rakyat turun-temurun tentang kecantikan dan kesetiaan seorang putri raja...", date: "04 Aug 2026, 15:20", views: "1.3K", likes: 270, comments: 15, status: "Draf", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 23, title: "Tren Industri Kreatif Digital Anak Muda Palembang", desc: "Perkembangan agensi kreatif, podcaster, dan content creator lokal yang semakin solid...", date: "03 Aug 2026, 11:30", views: "3.0K", likes: 690, comments: 53, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 24, title: "Kelezatan Burgo dan Celimpungan Khas Sarapan Pagi", desc: "Menu sarapan berkuah santan gurih yang wajib dicoba saat berkunjung ke kota Palembang...", date: "02 Aug 2026, 07:30", views: "4.5K", likes: "1.2K", comments: 88, status: "Post", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 25, title: "Semangat Kolaborasi Komunitas Hijau Palembang", desc: "Aksi nyata penanaman pohon dan pembersihan lingkungan demi masa depan kota yang asri...", date: "01 Aug 2026, 09:45", views: "2.0K", likes: 430, comments: 31, status: "Post", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 26, title: "Menemukan Kedamaian di Taman Kambang Iwak", desc: "Aktivitas jogging pagi, komunitas hewan peliharaan, dan suasana teduh di jantung kota...", date: "31 Jul 2026, 06:30", views: "3.1K", likes: 620, comments: 45, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 27, title: "Pesona Arsitektur Kolonial Gedung Jacobson", desc: "Mempelajari sisa kejayaan perdagangan era Hindia Belanda di kawasan Sekanak Ilir...", date: "30 Jul 2026, 14:15", views: "1.7K", likes: 380, comments: 22, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 28, title: "Eksotisme Perahu Ketek Menyeberangi Musi", desc: "Sensasi naik perahu tradisional menghubungkan kawasan Seberang Ulu dan Seberang Ilir...", date: "29 Jul 2026, 17:40", views: "4.2K", likes: 950, comments: 68, status: "Post", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 29, title: "Resep Kue Gandus Tradisional Khas Palembang", desc: "Kudapan gurih dari tepung beras bertabur ebi sangrai, cabai merah, dan bawang goreng...", date: "28 Jul 2026, 10:00", views: "2.4K", likes: 510, comments: 39, status: "Post", banner: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 30, title: "Perjalanan Seniman Kriya Ukir Kayu Palembang", desc: "Keahlian mengukir ornamen emas motif bunga melati dan daun teratai yang legendaris...", date: "27 Jul 2026, 13:20", views: "1.9K", likes: 420, comments: 26, status: "Post", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 31, title: "Kehangatan Teh Tarik di Sudut Pasar Kuto", desc: "Nongkrong malam sambil menikmati teh tarik buatan pedagang turun-temurun...", date: "26 Jul 2026, 21:00", views: "2.8K", likes: 670, comments: 48, status: "Post", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 32, title: "Evolusi Musik Tradisional Batanghari Sembilan", desc: "Petikan gitar tunggal dan irama khas pedalaman Sumatera Selatan yang memikat...", date: "25 Jul 2026, 16:10", views: "1.5K", likes: 310, comments: 19, status: "Draf", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 33, title: "Tips Berburu Batik dan Songket di Pasar 16", desc: "Panduan memilih kain berkualitas dengan harga terbaik langsung dari pusat grosir...", date: "24 Jul 2026, 11:30", views: "5.0K", likes: "1.3K", comments: 104, status: "Post", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 34, title: "Kisah di Balik Kampung Arab Al-Munawar", desc: "Eksplorasi cagar budaya rumah kayu berusia ratusan tahun di tepian sungai...", date: "23 Jul 2026, 09:15", views: "3.7K", likes: 830, comments: 62, status: "Post", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 35, title: "Eksplorasi Kuliner Malam Lorong Basah Night Market", desc: "Aneka ragam jajanan kekinian dan tradisional yang ramai dikunjungi anak muda...", date: "22 Jul 2026, 20:30", views: "4.6K", likes: "1.1K", comments: 87, status: "Post", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 36, title: "Menjaga Tradisi Pantun Bersahut Palembang", desc: "Seni bertutur sastra lisan yang selalu hadir dalam prosesi lamaran adat wong kito...", date: "21 Jul 2026, 15:00", views: "1.2K", likes: 270, comments: 18, status: "Post", banner: "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 37, title: "Potensi Wisata Geopark Merangin & Danau Ranau", desc: "Menghubungkan keindahan alam Sumatera Selatan sebagai magnet pariwisata nasional...", date: "20 Jul 2026, 12:45", views: "2.9K", likes: 590, comments: 44, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 38, title: "Kelezatan Mie Celor 26 Ilir yang Legendaris", desc: "Kuah kaldu udang kental dengan taoge dan telur rebus yang menggugah selera...", date: "19 Jul 2026, 08:20", views: "5.8K", likes: "1.6K", comments: 135, status: "Post", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 39, title: "Sejarah Percetakan Al-Qur'an Tertua di Palembang", desc: "Jejak sejarah mushaf Al-Qur'an cetak batu pertama di Asia Tenggara karya Kemas Haji Muhammad Azhari...", date: "18 Jul 2026, 14:00", views: "2.1K", likes: 490, comments: 33, status: "Post", banner: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 40, title: "Geliat Komunitas Mural dan Street Art Kota", desc: "Mempercantik sudut kota Palembang dengan sentuhan visual bermakna sosial...", date: "17 Jul 2026, 16:50", views: "1.8K", likes: 410, comments: 29, status: "Post", banner: "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 41, title: "Pesona Rumah Rakit di Sepanjang Sungai Musi", desc: "Menilik kearifan lokal warga yang tinggal mengapung di atas sungai sejak ratusan tahun silam...", date: "16 Jul 2026, 10:40", views: "3.3K", likes: 740, comments: 56, status: "Post", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 42, title: "Resep Sambal Tempoyak Durian Khas Wong Kito", desc: "Fermentasi durian berpadu pedasnya cabai rawit yang menjadi pelengkap wajib makan pindang...", date: "15 Jul 2026, 13:10", views: "4.0K", likes: 920, comments: 76, status: "Post", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 43, title: "Eksplorasi Hutan Wisata Punti Kayu", desc: "Oase hijau hutan pinus di tengah hiruk pikuk kota metropolitan Palembang...", date: "14 Jul 2026, 09:30", views: "2.5K", likes: 530, comments: 38, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 44, title: "Inspirasi Wirausaha Muda Olahan Kemplang Panggang", desc: "Kisah sukses anak muda memodernisasi kemasan kemplang panggang untuk oleh-oleh nusantara...", date: "13 Jul 2026, 15:20", views: "2.2K", likes: 480, comments: 34, status: "Post", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 45, title: "Keindahan Sunset di Jembatan Musi IV dan VI", desc: "Dua jembatan modern yang melengkapi panorama Sungai Musi saat senja tiba...", date: "12 Jul 2026, 18:00", views: "3.9K", likes: 860, comments: 64, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 46, title: "Melestarikan Aksara Kaganga Sumatera Selatan", desc: "Upaya generasi muda mengajarkan kembali aksara kuno nusantara di era digital...", date: "11 Jul 2026, 11:00", views: "1.6K", likes: 350, comments: 21, status: "Post", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 47, title: "Sensasi Pedas Gurih Nasi Minyak Khas Palembang", desc: "Hidangan khas beraroma rempah kapulaga dan minyak samin untuk perayaan istimewa...", date: "10 Jul 2026, 12:30", views: "3.5K", likes: 780, comments: 59, status: "Post", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 48, title: "Perjalanan Komunitas Peduli Cagar Budaya", desc: "Mendokumentasikan bangunan bersejarah di Palembang agar tidak lekang oleh waktu...", date: "09 Jul 2026, 14:40", views: "1.9K", likes: 410, comments: 27, status: "Post", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 49, title: "Menjajaki Ruang Terbuka Hijau Jakabaring Sport City", desc: "Kawasan olahraga bertaraf internasional yang menjadi ruang publik favorit warga...", date: "08 Jul 2026, 07:15", views: "4.4K", likes: 980, comments: 79, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 50, title: "Masa Depan Kota Palembang Menuju Smart City", desc: "Inovasi digital dan integrasi layanan publik demi kenyamanan wong kito galo...", date: "07 Jul 2026, 10:00", views: "2.7K", likes: 610, comments: 46, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
]

export function CreateArticle() {
    const navigate = useNavigate()
    const [articles, setArticles] = useState(initialArticles)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    const [confirmModal, setConfirmModal] = useState<{
        open: boolean
        articleId: number
        articleTitle: string
        action: "takedown" | "restore" | "post"
    }>({
        open: false,
        articleId: 0,
        articleTitle: "",
        action: "takedown",
    })

    const openConfirm = (article: typeof initialArticles[0], action: "takedown" | "restore" | "post") => {
        setConfirmModal({
            open: true,
            articleId: article.id,
            articleTitle: article.title,
            action,
        })
    }

    const handleConfirmAction = () => {
        const { articleId, articleTitle, action } = confirmModal
        if (action === "post") {
            setArticles(articles.map(a => a.id === articleId ? { ...a, status: "Post" } : a))
            toast.success(`Artikel "${articleTitle}" berhasil diposting!`)
        } else if (action === "takedown") {
            setArticles(articles.map(a => a.id === articleId ? { ...a, status: "Takedown" } : a))
            toast.error(`Artikel "${articleTitle}" berhasil di-takedown!`)
        } else if (action === "restore") {
            setArticles(articles.map(a => a.id === articleId ? { ...a, status: "Post" } : a))
            toast.success(`Artikel "${articleTitle}" berhasil dipulihkan!`)
        }
        setConfirmModal(prev => ({ ...prev, open: false }))
    }

    const filteredArticles = useMemo(() => {
        return articles.filter(a => 
            a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            a.desc.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [articles, searchTerm])

    const totalPages = Math.ceil(filteredArticles.length / itemsPerPage)
    const paginatedArticles = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredArticles.slice(start, start + itemsPerPage)
    }, [filteredArticles, currentPage, itemsPerPage])

    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Kelola Artikel</h2>
                    <p className="text-muted-foreground">Tulis dan kelola artikel cerita warga Anda.</p>
                </div>
                <Button onClick={() => navigate('/dashboard/create-article/new')} className="bg-palembang-red text-white hover:bg-palembang-red/90 w-fit">
                    <Plus className="mr-2 size-4" /> Create Article
                </Button>
            </div>

            <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari artikel..." 
                            className="pl-9" 
                            value={searchTerm}
                            onChange={e => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Banner & Judul</th>
                                <th className="px-6 py-4 font-semibold">Deskripsi Singkat</th>
                                <th className="px-6 py-4 font-semibold">Date & Time</th>
                                <th className="px-6 py-4 font-semibold">Statistik</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginatedArticles.length > 0 ? paginatedArticles.map((article) => (
                                <tr key={article.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={article.banner || "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"} alt="Banner" className="w-16 h-12 rounded-md object-cover border" />
                                            <span className="font-semibold text-foreground max-w-[200px] line-clamp-2" title={article.title}>{article.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground max-w-[220px] truncate" title={article.desc}>
                                        {article.desc}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap text-xs">{article.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1 font-medium" title="Views">
                                                <Eye className="size-3.5 text-blue-500" /> {article.views}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium" title="Likes">
                                                <Heart className="size-3.5 text-palembang-red" /> {article.likes}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium" title="Comments">
                                                <MessageCircle className="size-3.5 text-emerald-500" /> {article.comments}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            article.status === 'Post' ? 'bg-emerald-50 text-emerald-600' : 
                                            article.status === 'Takedown' ? 'bg-red-50 text-red-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            {article.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 items-center">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => navigate(`/dashboard/article/preview/${article.id}`)}
                                                className="gap-1.5 text-xs text-foreground hover:bg-muted"
                                            >
                                                <Eye className="size-3.5" /> View
                                            </Button>

                                            {article.status === "Draf" && (
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => openConfirm(article, "post")}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs"
                                                >
                                                    <Send className="size-3.5" /> Post
                                                </Button>
                                            )}

                                            {article.status === "Post" && (
                                                <Button 
                                                    variant="outline"
                                                    size="sm" 
                                                    onClick={() => openConfirm(article, "takedown")}
                                                    className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5 text-xs"
                                                >
                                                    <RotateCcw className="size-3.5" /> Takedown
                                                </Button>
                                            )}

                                            {article.status === "Takedown" && (
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => openConfirm(article, "restore")}
                                                    className="bg-palembang-red text-white hover:bg-palembang-red/90 gap-1.5 text-xs"
                                                >
                                                    <Send className="size-3.5" /> Restore
                                                </Button>
                                            )}

                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => navigate(`/dashboard/create-article/edit?id=${article.id}&mode=edit`)}
                                                className="gap-1.5 text-xs text-foreground hover:bg-muted"
                                            >
                                                <Edit2 className="size-3.5" /> Edit
                                            </Button>
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        Tidak ada artikel ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredArticles.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            <ConfirmActionDialog
                open={confirmModal.open}
                onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
                title={
                    confirmModal.action === "takedown" ? "Konfirmasi Takedown Artikel" :
                    confirmModal.action === "restore" ? "Konfirmasi Pemulihan Artikel" :
                    "Konfirmasi Publikasi Artikel"
                }
                description={
                    confirmModal.action === "takedown" ? `Apakah Anda yakin ingin melakukan takedown pada artikel "${confirmModal.articleTitle}"? Artikel ini tidak akan tampil lagi di website publik.` :
                    confirmModal.action === "restore" ? `Apakah Anda yakin ingin memulihkan artikel "${confirmModal.articleTitle}" ke status Post? Artikel akan kembali tampil di website publik.` :
                    `Apakah Anda yakin ingin mempublikasikan artikel "${confirmModal.articleTitle}"?`
                }
                confirmText={
                    confirmModal.action === "takedown" ? "Ya, Takedown" :
                    confirmModal.action === "restore" ? "Ya, Pulihkan" :
                    "Ya, Publikasikan"
                }
                cancelText="Batal"
                variant={confirmModal.action === "takedown" ? "destructive" : "default"}
                onConfirm={handleConfirmAction}
            />
        </div>
    )
}
