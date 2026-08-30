import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Plus, Eye, Edit2, Send, RotateCcw, Heart, Users } from "lucide-react"
import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { useState, useMemo } from "react"
import { useNavigate } from "react-router-dom"
import { toast } from "sonner"

const initialEvents = [
    { id: 1, title: "Pameran Fotografi: Warna Palembang", desc: "Melihat sudut kota melalui lensa fotografer lokal dan pameran visual...", date: "15 Sep 2026, 10:00", views: "2.4K", likes: 580, participants: 140, status: "Post", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 2, title: "Festival Kuliner Malam Ampera", desc: "Nikmati lebih dari 50 jenis makanan tradisional dan fusion khas Sumatera Selatan...", date: "10 Sep 2026, 18:30", views: "5.8K", likes: "1.6K", participants: 420, status: "Post", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 3, title: "Workshop Menenun Songket Tradisional", desc: "Belajar teknik menenun benang emas langsung dari maestro songket Palembang...", date: "05 Sep 2026, 09:00", views: "1.8K", likes: 420, participants: 45, status: "Post", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 4, title: "Lomba Perahu Bidar Tradisional Musi 2026", desc: "Perlombaan dayung perahu naga tercepat menyusuri perairan Sungai Musi...", date: "28 Aug 2026, 07:30", views: "8.2K", likes: "2.4K", participants: 650, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 5, title: "Palembang Jazz & Heritage Night", desc: "Alunan musik jazz modern berpadu dengan keanggunan suasana Benteng Kuto Besak...", date: "25 Aug 2026, 19:30", views: "3.1K", likes: 790, participants: 280, status: "Draf", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 6, title: "Seminar Ekonomi Kreatif & Digitalisasi UMKM", desc: "Panduan strategi ekspansi bisnis lokal menembus pasar nasional dan global...", date: "20 Aug 2026, 13:00", views: "1.5K", likes: 310, participants: 95, status: "Post", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 7, title: "Gowes Santai Keliling Kota Palembang", desc: "Rute asri menyusuri jembatan Musi IV, Kambang Iwak, dan Taman Jakabaring...", date: "18 Aug 2026, 06:00", views: "2.9K", likes: 640, participants: 310, status: "Post", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 8, title: "Pentas Seni Teater Dulmuluk Remaja", desc: "Pertunjukan teater rakyat yang dibawakan oleh generasi muda pecinta seni Palembang...", date: "15 Aug 2026, 19:00", views: "1.2K", likes: 270, participants: 80, status: "Post", banner: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 9, title: "Festival Kopi & Barista Championship", desc: "Adu kepiawaian meracik espresso dan latte art menggunakan biji kopi lokal Sumsel...", date: "12 Aug 2026, 10:00", views: "4.3K", likes: "1.1K", participants: 220, status: "Post", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 10, title: "Workshop Pembuatan Sabun Alami dari Minyak Atsiri", desc: "Pemanfaatan bahan rempah lokal untuk produk ramah lingkungan berdaya jual...", date: "10 Aug 2026, 14:00", views: "920", likes: 180, participants: 35, status: "Draf", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 11, title: "Palembang Creative Hackathon 2026", desc: "Kompetisi pemrograman 48 jam untuk menciptakan solusi smart city bagi kota Palembang...", date: "08 Aug 2026, 08:00", views: "3.7K", likes: 850, participants: 150, status: "Post", banner: "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 12, title: "Pameran Kerajinan Ukir Kayu Tembesu", desc: "Menampilkan mahakarya seni ukir khas Palembang berpadu ornamen keemasan...", date: "05 Aug 2026, 10:30", views: "1.6K", likes: 340, participants: 60, status: "Post", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 13, title: "Aksi Bersih Sungai Musi Bersama Komunitas", desc: "Gerakan peduli kebersihan perairan sungai demi kelestarian ekosistem dan keindahan kota...", date: "02 Aug 2026, 07:00", views: "2.5K", likes: 710, participants: 380, status: "Post", banner: "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 14, title: "Festival Musik Akustik Pinggir Sungai", desc: "Malam minggu syahdu menikmati lantunan musik indie lokal di tepi dermaga...", date: "30 Jul 2026, 19:30", views: "3.3K", likes: 820, participants: 260, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 15, title: "Bincang Santai Literasi Sejarah Sriwijaya", desc: "Diskusi mendalam bersama sejarawan dan arkeolog tentang peradaban maritim kuno...", date: "28 Jul 2026, 15:00", views: "1.1K", likes: 240, participants: 55, status: "Draf", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 16, title: "Pasar Seni & Kriya Akhir Pekan Kambang Iwak", desc: "Bazar karya seni rupa, ilustrasi, pakaian unik, dan kerajinan tangan lokal...", date: "25 Jul 2026, 08:00", views: "4.1K", likes: 960, participants: 500, status: "Post", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 17, title: "Workshop Public Speaking & Storytelling", desc: "Teknik menyampaikan cerita yang memikat audiens dan membangun persona percaya diri...", date: "22 Jul 2026, 13:30", views: "1.7K", likes: 390, participants: 75, status: "Post", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 18, title: "Turnamen Esport Palembang Championship", desc: "Kompetisi game strategi tingkat regional memperebutkan piala bergengsi...", date: "20 Jul 2026, 11:00", views: "6.5K", likes: "1.9K", participants: 410, status: "Post", banner: "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 19, title: "Festival Layang-Layang Hias Jakabaring", desc: "Mewarnai langit Palembang dengan aneka bentuk layang-layang tradisional dan modern...", date: "18 Jul 2026, 14:00", views: "2.8K", likes: 630, participants: 290, status: "Post", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 20, title: "Kelas Memasak Pempek & Celimpungan Autentik", desc: "Praktek langsung cara menguleni adonan ikan segar hingga menghasilkan tekstur sempurna...", date: "15 Jul 2026, 09:30", views: "3.5K", likes: 870, participants: 40, status: "Post", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 21, title: "Pameran Komik & Animasi Lokal Sriwijaya", desc: "Karya komikus dan animator muda bertema cerita rakyat dan superhero nusantara...", date: "12 Jul 2026, 10:00", views: "1.9K", likes: 450, participants: 110, status: "Post", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 22, title: "Night Run Ampera 5K 2026", desc: "Lari malam spektakuler dengan latar gemerlap cahaya Jembatan Ampera...", date: "10 Jul 2026, 20:00", views: "7.1K", likes: "2.1K", participants: 800, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 23, title: "Pelatihan Digital Marketing untuk Karang Taruna", desc: "Membekali pemuda desa dengan keahlian pemasaran konten dan optimasi media sosial...", date: "08 Jul 2026, 13:00", views: "890", likes: 170, participants: 50, status: "Takedown", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 24, title: "Simfoni Musik Tradisional Gambus & Batanghari Sembilan", desc: "Pertunjukan petikan dawai gitar tunggal dan tabuhan gambus yang memukau...", date: "05 Jul 2026, 19:30", views: "2.2K", likes: 510, participants: 180, status: "Post", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 25, title: "Festival Film Pendek Wong Kito 2026", desc: "Penayangan film-film indie sineas muda bertema kehidupan sosial kota Palembang...", date: "01 Jul 2026, 16:00", views: "3.9K", likes: 920, participants: 250, status: "Post", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 26, title: "Pameran Lukisan Pesona Bumi Sriwijaya", desc: "Koleksi lukisan cat minyak dan kanvas dari pelukis legendaris Sumatera Selatan...", date: "28 Jun 2026, 10:00", views: "1.7K", likes: 380, participants: 85, status: "Post", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 27, title: "Piknik Akhir Pekan & Storytelling Anak", desc: "Membaca dongeng cerita rakyat nusantara bersama pegiat literasi di taman kota...", date: "26 Jun 2026, 08:30", views: "2.1K", likes: 520, participants: 120, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 28, title: "Konferensi Arsitektur & Pelestarian Heritage", desc: "Simposium para pakar tata kota mengenai perlindungan cagar budaya bersejarah...", date: "24 Jun 2026, 09:00", views: "1.4K", likes: 290, participants: 90, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 29, title: "Lomba Masak Pindang Patin Antar Kecamatan", desc: "Ajang unjuk kebolehan memasak kuliner khas dengan bumbu autentik turun-temurun...", date: "22 Jun 2026, 10:00", views: "4.8K", likes: "1.2K", participants: 200, status: "Post", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 30, title: "Workshop Kerajinan Anyaman Purun Ramah Lingkungan", desc: "Mempelajari kerajinan tangan tas dan tikar purun dari pengrajin gambut lokal...", date: "20 Jun 2026, 13:00", views: "1.6K", likes: 370, participants: 60, status: "Post", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 31, title: "Musi River Cruise & Sunset Dinner", desc: "Pelayaran eksklusif menikmati pemandangan senja dan santap malam di atas kapal...", date: "18 Jun 2026, 17:00", views: "5.4K", likes: "1.5K", participants: 160, status: "Post", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 32, title: "Festival Tari Nusantara Pelajar Sumatera", desc: "Kompetisi kreasi tari tradisional antar SMA dan perguruan tinggi se-Sumatera...", date: "15 Jun 2026, 09:00", views: "3.2K", likes: 780, participants: 350, status: "Post", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 33, title: "Seminar Investasi Hijau & Energi Terbarukan", desc: "Peluang transisi energi bersih di wilayah perkotaan dan industri Sumatera Selatan...", date: "12 Jun 2026, 13:30", views: "1.3K", likes: 260, participants: 80, status: "Draf", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 34, title: "Palembang Car Free Day Carnival 2026", desc: "Parade kostum kreasi, pertunjukan musik jalanan, dan senam massal di Jl. Sudirman...", date: "10 Jun 2026, 06:00", views: "6.0K", likes: "1.8K", participants: 1200, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 35, title: "Workshop Penulisan Puisi & Cerpen Sriwijaya", desc: "Mengasah kepekaan sastra dan merangkai kata bersama sastrawan senior...", date: "08 Jun 2026, 14:00", views: "980", likes: 210, participants: 45, status: "Post", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 36, title: "Bazar Buku Murah & Pameran Naskah Kuno", desc: "Pameran manuskrip aksara ulu dan ribuan buku bacaan berkualitas dengan diskon spesial...", date: "05 Jun 2026, 10:00", views: "2.7K", likes: 640, participants: 400, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 37, title: "Kompetisi Desain Grafis Ikon Kota Palembang", desc: "Tantangan bagi para desainer grafis muda untuk merefleksikan identitas visual modern kota...", date: "02 Jun 2026, 11:00", views: "2.3K", likes: 530, participants: 110, status: "Post", banner: "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 38, title: "Malam Apresiasi Seni & Budaya Wong Kito", desc: "Pemberian penghargaan kepada para tokoh penggerak kebudayaan dan pegiat komunitas lokal...", date: "30 May 2026, 19:30", views: "3.5K", likes: 890, participants: 220, status: "Post", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 39, title: "Gowes Wisata Sejarah Benteng & Masjid Agung", desc: "Bersepeda santai melewati situs-situs penting peradaban Islam di Palembang...", date: "28 May 2026, 06:30", views: "2.8K", likes: 610, participants: 280, status: "Post", banner: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 40, title: "Workshop Fotografi Landscape & Drone Musi", desc: "Teknik menangkap keindahan bentang alam sungai dan jembatan dari sudut udara...", date: "25 May 2026, 15:30", views: "3.1K", likes: 720, participants: 65, status: "Post", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 41, title: "Pelatihan Wirausaha Olahan Ikan Air Tawar", desc: "Diversifikasi produk makanan berbahan baku ikan patin, gabus, dan lele untuk UMKM...", date: "22 May 2026, 09:30", views: "1.5K", likes: 330, participants: 50, status: "Post", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 42, title: "Simulasi Siaga Bencana Banjir & Mitigasi Kota", desc: "Latihan kesiapsiagaan terpadu relawan SAR, BPBD, dan masyarakat bantaran sungai...", date: "20 May 2026, 08:00", views: "1.9K", likes: 410, participants: 180, status: "Post", banner: "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 43, title: "Festival Musik Tradisional & Kontemporer Sumsel", desc: "Kolaborasi aransemen musik etnik dengan instrumen modern di panggung terbuka...", date: "18 May 2026, 19:00", views: "4.2K", likes: 970, participants: 450, status: "Post", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 44, title: "Eksibisi Seni Patung & Instalasi Ramah Lingkungan", desc: "Karya seni kreatif dari daur ulang limbah plastik dan kayu apung Sungai Musi...", date: "15 May 2026, 10:00", views: "1.8K", likes: 420, participants: 95, status: "Post", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 45, title: "Seminar Transformasi Digital Pemerintahan Daerah", desc: "Peningkatan mutu pelayanan publik berbasis aplikasi terpadu satu pintu...", date: "12 May 2026, 13:00", views: "1.2K", likes: 250, participants: 70, status: "Post", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 46, title: "Palembang Yoga & Wellness Morning di Danau JSC", desc: "Sesi relaksasi yoga bersama instruktur berpengalaman di suasana sejuk tepi danau...", date: "10 May 2026, 06:30", views: "2.6K", likes: 580, participants: 150, status: "Post", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 47, title: "Lomba Desain Motif Batik Modern Khas Palembang", desc: "Eksplorasi motif flora fauna lokal untuk busana kasual masa kini...", date: "08 May 2026, 11:00", views: "2.1K", likes: 470, participants: 85, status: "Post", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 48, title: "Diskusi Publik Transportasi Terintegrasi Palembang", desc: "Menghubungkan LRT, Feeder Angkot, dan Bus Trans Musi secara efektif dan nyaman...", date: "05 May 2026, 14:00", views: "1.7K", likes: 360, participants: 60, status: "Post", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 49, title: "Festival Kuliner Tradisional Ramadhan Palembang", desc: "Pasar takjil kue basah tradisional srikaya, dadar jiwo, dan ragit khas kuto...", date: "02 May 2026, 16:00", views: "6.8K", likes: "2.0K", participants: 900, status: "Post", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 50, title: "Grand Final Duta Wisata Bujang Gadis Palembang 2026", desc: "Malam penobatan generasi muda inspiratif sebagai duta pariwisata dan kebudayaan kota...", date: "01 May 2026, 19:30", views: "9.2K", likes: "2.8K", participants: 1500, status: "Post", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
]

export function CreateEvent() {
    const navigate = useNavigate()
    const [events, setEvents] = useState(initialEvents)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    // Confirmation dialog state
    const [confirmModal, setConfirmModal] = useState<{
        open: boolean
        eventId: number
        eventTitle: string
        action: "takedown" | "restore" | "post"
    }>({
        open: false,
        eventId: 0,
        eventTitle: "",
        action: "takedown",
    })

    const openConfirm = (event: typeof initialEvents[0], action: "takedown" | "restore" | "post") => {
        setConfirmModal({
            open: true,
            eventId: event.id,
            eventTitle: event.title,
            action,
        })
    }

    const handleConfirmAction = () => {
        const { eventId, eventTitle, action } = confirmModal
        if (action === "post") {
            setEvents(events.map(e => e.id === eventId ? { ...e, status: "Post" } : e))
            toast.success(`Event "${eventTitle}" berhasil diposting!`)
        } else if (action === "takedown") {
            setEvents(events.map(e => e.id === eventId ? { ...e, status: "Takedown" } : e))
            toast.error(`Event "${eventTitle}" berhasil di-takedown!`)
        } else if (action === "restore") {
            setEvents(events.map(e => e.id === eventId ? { ...e, status: "Post" } : e))
            toast.success(`Event "${eventTitle}" berhasil dipulihkan!`)
        }
        setConfirmModal(prev => ({ ...prev, open: false }))
    }

    const filteredEvents = useMemo(() => {
        return events.filter(e => 
            e.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
            e.desc.toLowerCase().includes(searchTerm.toLowerCase())
        )
    }, [events, searchTerm])

    // Pagination calculations
    const totalPages = Math.ceil(filteredEvents.length / itemsPerPage)
    const paginatedEvents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredEvents.slice(start, start + itemsPerPage)
    }, [filteredEvents, currentPage, itemsPerPage])

    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Kelola Event</h2>
                    <p className="text-muted-foreground">Publikasikan dan atur agenda kegiatan di Palembang.</p>
                </div>
                <Button onClick={() => navigate('/dashboard/create-event/new')} className="bg-palembang-red text-white hover:bg-palembang-red/90 w-fit">
                    <Plus className="mr-2 size-4" /> Create Event
                </Button>
            </div>

            <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                            placeholder="Cari event..." 
                            className="pl-9" 
                            value={searchTerm}
                            onChange={e => handleSearchChange(e.target.value)}
                        />
                    </div>
                </div>
                <div className="overflow-x-auto no-scrollbar">
                    <table className="w-full text-sm text-left">
                        <thead className="text-xs text-muted-foreground uppercase bg-muted/50 border-b">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Banner & Judul Event</th>
                                <th className="px-6 py-4 font-semibold">Deskripsi Singkat</th>
                                <th className="px-6 py-4 font-semibold">Waktu Pelaksanaan</th>
                                <th className="px-6 py-4 font-semibold">Statistik</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginatedEvents.length > 0 ? paginatedEvents.map((event) => (
                                <tr key={event.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={event.banner || "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"} alt="Banner" className="w-16 h-12 rounded-md object-cover border" />
                                            <span className="font-semibold text-foreground max-w-[200px] line-clamp-2" title={event.title}>{event.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground max-w-[220px] truncate" title={event.desc}>
                                        {event.desc}
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap text-xs">{event.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1 font-medium" title="Views">
                                                <Eye className="size-3.5 text-blue-500" /> {event.views}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium" title="Likes">
                                                <Heart className="size-3.5 text-palembang-red" /> {event.likes}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium" title="Peserta / Registrasi">
                                                <Users className="size-3.5 text-purple-500" /> {event.participants}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            event.status === 'Post' ? 'bg-emerald-50 text-emerald-600' : 
                                            event.status === 'Takedown' ? 'bg-red-50 text-red-600' :
                                            'bg-amber-50 text-amber-600'
                                        }`}>
                                            {event.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 items-center">
                                            {/* View Button: Navigates to public-style preview */}
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => navigate(`/dashboard/event/preview/${event.id}`)}
                                                className="gap-1.5 text-xs text-foreground hover:bg-muted"
                                            >
                                                <Eye className="size-3.5" /> View
                                            </Button>

                                            {/* Action button based on status */}
                                            {event.status === "Draf" && (
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => openConfirm(event, "post")}
                                                    className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1.5 text-xs"
                                                >
                                                    <Send className="size-3.5" /> Post
                                                </Button>
                                            )}

                                            {event.status === "Post" && (
                                                <Button 
                                                    variant="outline"
                                                    size="sm" 
                                                    onClick={() => openConfirm(event, "takedown")}
                                                    className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5 text-xs"
                                                >
                                                    <RotateCcw className="size-3.5" /> Takedown
                                                </Button>
                                            )}

                                            {event.status === "Takedown" && (
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => openConfirm(event, "restore")}
                                                    className="bg-palembang-red text-white hover:bg-palembang-red/90 gap-1.5 text-xs"
                                                >
                                                    <Send className="size-3.5" /> Restore
                                                </Button>
                                            )}

                                            {/* Edit Button */}
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => navigate(`/dashboard/create-event/edit?id=${event.id}&mode=edit`)}
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
                                        Tidak ada event ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredEvents.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            {/* Confirmation Modal */}
            <ConfirmActionDialog
                open={confirmModal.open}
                onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
                title={
                    confirmModal.action === "takedown" ? "Konfirmasi Takedown Event" :
                    confirmModal.action === "restore" ? "Konfirmasi Pemulihan Event" :
                    "Konfirmasi Publikasi Event"
                }
                description={
                    confirmModal.action === "takedown" ? `Apakah Anda yakin ingin melakukan takedown pada event "${confirmModal.eventTitle}"? Event ini tidak akan tampil lagi di website publik.` :
                    confirmModal.action === "restore" ? `Apakah Anda yakin ingin memulihkan event "${confirmModal.eventTitle}" ke status Post? Event akan kembali tampil di website publik.` :
                    `Apakah Anda yakin ingin mempublikasikan event "${confirmModal.eventTitle}"?`
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
