import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Search, Eye, CheckCircle, RotateCcw, XCircle, Trash2, Heart, MessageCircle } from "lucide-react"
import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { PaginationControls } from "@/components/dashboard/PaginationControls"
import { useState, useMemo, useEffect } from "react"
import { toast } from "sonner"
import { useNavigate, useLocation } from "react-router-dom"

const initialContent = [
    { id: 1, type: "Article", title: "Jejak Sejarah Kesultanan Palembang", author: "Budi Hartono", date: "24 Aug 2026, 14:30", views: "1.2K", likes: 340, comments: 28, status: "Request", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 2, type: "Event", title: "Festival Kuliner Malam Ampera", author: "Dinas Pariwisata", date: "23 Aug 2026, 09:15", views: "4.5K", likes: "1.1K", comments: 95, status: "Posted", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 3, type: "Article", title: "Opini: Ruang Terbuka Hijau di Tengah Kota", author: "Siti Aminah", date: "22 Aug 2026, 16:45", views: "890", likes: 210, comments: 14, status: "Takedown", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 4, type: "Article", title: "Rahasia Kelezatan Pempek Panggang & Lenggang", author: "Rahmat Hidayat", date: "21 Aug 2026, 11:20", views: "2.8K", likes: 670, comments: 45, status: "Posted", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 5, type: "Event", title: "Pameran Fotografi: Sudut Sunyi Palembang", author: "Komunitas Lensa Musi", date: "20 Aug 2026, 15:00", views: "1.6K", likes: 380, comments: 22, status: "Request", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 6, type: "Article", title: "Eksplorasi Rumah Limas Peninggalan Abad 18", author: "Dr. Iskandar Syah", date: "19 Aug 2026, 10:40", views: "3.1K", likes: 740, comments: 53, status: "Posted", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 7, type: "Event", title: "Lomba Dayung Bidar Tradisional 2026", author: "PODSI Sumsel", date: "18 Aug 2026, 08:30", views: "6.2K", likes: "1.8K", comments: 130, status: "Posted", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 8, type: "Article", title: "Menjaga Warisan Tenun Songket Palembang", author: "Nurlela Sari", date: "17 Aug 2026, 13:10", views: "2.1K", likes: 510, comments: 39, status: "Request", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 9, type: "Article", title: "Kritik Tata Kota: Kemacetan Jalur Seberang Ulu", author: "Ahmad Fauzi", date: "16 Aug 2026, 17:25", views: "1.4K", likes: 290, comments: 62, status: "Rejected", banner: "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 10, type: "Event", title: "Palembang Creative Hackathon 2026", author: "Palembang Digital", date: "15 Aug 2026, 09:00", views: "3.4K", likes: 820, comments: 48, status: "Posted", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 11, type: "Article", title: "Kopi Semendo: Emas Hitam dari Tanah Tinggi", author: "Ferry Irawan", date: "14 Aug 2026, 14:00", views: "1.9K", likes: 430, comments: 25, status: "Posted", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 12, type: "Event", title: "Workshop Teater Dulmuluk Remaja", author: "Sanggar Seni Sriwijaya", date: "13 Aug 2026, 16:30", views: "980", likes: 230, comments: 18, status: "Request", banner: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 13, type: "Article", title: "Misteri Prasasti Kedukan Bukit & Asal Usul Sriwijaya", author: "Prof. Hasan Basri", date: "12 Aug 2026, 11:15", views: "4.7K", likes: "1.2K", comments: 84, status: "Posted", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 14, type: "Article", title: "Gaya Hidup Minimalis Anak Muda Kota Palembang", author: "Dina Kirana", date: "11 Aug 2026, 09:40", views: "1.3K", likes: 310, comments: 21, status: "Posted", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 15, type: "Event", title: "Festival Musik Indie Musi Riverside", author: "Kolektif Musik Palembang", date: "10 Aug 2026, 19:00", views: "5.1K", likes: "1.4K", comments: 110, status: "Posted", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 16, type: "Article", title: "Legenda Putri Kemang: Dongeng Rakyat Sumsel", author: "Kartika Sari", date: "09 Aug 2026, 15:20", views: "820", likes: 170, comments: 12, status: "Takedown", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 17, type: "Event", title: "Aksi Bersih Sungai & Penanaman Bakau", author: "Green Palembang", date: "08 Aug 2026, 06:30", views: "2.3K", likes: 620, comments: 37, status: "Posted", banner: "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 18, type: "Article", title: "Menemukan Kelezatan Tersembunyi di Lorong Basah", author: "Bagus Prasetyo", date: "07 Aug 2026, 12:00", views: "3.8K", likes: 890, comments: 64, status: "Posted", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 19, type: "Event", title: "Night Run Ampera 5K 2026", author: "Palembang Runners", date: "06 Aug 2026, 20:00", views: "7.8K", likes: "2.3K", comments: 160, status: "Posted", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 20, type: "Article", title: "Kisah di Balik Megahnya Jembatan Musi IV", author: "Hendra Wijaya", date: "05 Aug 2026, 14:45", views: "2.5K", likes: 560, comments: 33, status: "Request", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 21, type: "Article", title: "Sensasi Legit Kue Maksuba & Lapis Kojo", author: "Yuliana Dewi", date: "04 Aug 2026, 10:10", views: "2.9K", likes: 710, comments: 50, status: "Posted", banner: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 22, type: "Event", title: "Pameran Komik & Animasi Sriwijaya", author: "Komunitas Manga Palembang", date: "03 Aug 2026, 13:00", views: "1.7K", likes: 390, comments: 27, status: "Posted", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 23, type: "Article", title: "Masa Depan Transportasi Terintegrasi LRT Palembang", author: "Rizal Efendi", date: "02 Aug 2026, 08:50", views: "2.2K", likes: 480, comments: 35, status: "Posted", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 24, type: "Event", title: "Workshop Public Speaking & Storytelling", author: "Millennial Talk", date: "01 Aug 2026, 15:30", views: "1.1K", likes: 250, comments: 19, status: "Request", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 25, type: "Article", title: "Keindahan Sunset Pulau Kemaro di Akhir Pekan", author: "Maya Anggraini", date: "31 Jul 2026, 17:15", views: "3.6K", likes: 850, comments: 58, status: "Posted", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 26, type: "Article", title: "Rahasia Kelezatan Celimpungan Buatan Nenek", author: "Indah Permata", date: "30 Jul 2026, 08:30", views: "2.8K", likes: 620, comments: 41, status: "Posted", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 27, type: "Event", title: "Lomba Perahu Bidar Mini Kategori Remaja", author: "Persatuan Dayung Sumsel", date: "29 Jul 2026, 09:00", views: "4.1K", likes: 980, comments: 72, status: "Posted", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 28, type: "Article", title: "Potret Kehidupan Pedagang Apung Pasar 16", author: "Faisal Tanjung", date: "28 Jul 2026, 11:20", views: "1.9K", likes: 430, comments: 28, status: "Posted", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 29, type: "Event", title: "Workshop Penulisan Naskah Drama Teater", author: "Sanggar Seni Wong Kito", date: "27 Jul 2026, 14:00", views: "1.2K", likes: 270, comments: 16, status: "Request", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 30, type: "Article", title: "Menelusuri Peninggalan Arkeologi TPKS", author: "Dr. Bambang S.", date: "26 Jul 2026, 13:45", views: "3.2K", likes: 740, comments: 53, status: "Posted", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 31, type: "Article", title: "Geliat Industri Keramik & Tembikar Lokal", author: "Ratih Sukma", date: "25 Jul 2026, 10:10", views: "1.5K", likes: 310, comments: 22, status: "Posted", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 32, type: "Event", title: "Palembang Coffee Festival 2026", author: "Komunitas Barista Sumsel", date: "24 Jul 2026, 10:00", views: "5.0K", likes: "1.4K", comments: 95, status: "Posted", banner: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 33, type: "Article", title: "Kearifan Lokal Rumah Adat Rakit Tepian Musi", author: "Agus Pratama", date: "23 Jul 2026, 15:00", views: "2.1K", likes: 490, comments: 34, status: "Posted", banner: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 34, type: "Event", title: "Seminar Perlindungan Hak Cipta Kain Tradisional", author: "Dinas Perindustrian", date: "22 Jul 2026, 09:30", views: "1.4K", likes: 290, comments: 18, status: "Posted", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 35, type: "Article", title: "Menikmati Sore Santai di Bantaran Sekanak", author: "Dina Marlina", date: "21 Jul 2026, 16:30", views: "3.7K", likes: 810, comments: 64, status: "Posted", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 36, type: "Event", title: "Pameran Foto Bangunan Kolonial Palembang", author: "Komunitas Lensa Kota", date: "20 Jul 2026, 11:00", views: "2.3K", likes: 520, comments: 39, status: "Posted", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 37, type: "Article", title: "Resep Gurih Pempek Lenggang Panggang Daun Pisang", author: "Siti Rahma", date: "19 Jul 2026, 12:15", views: "4.4K", likes: "1.1K", comments: 83, status: "Posted", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 38, type: "Event", title: "Bincang Komunitas Kreatif & Startup Digital", author: "Palembang Digital", date: "18 Jul 2026, 14:00", views: "1.8K", likes: 410, comments: 26, status: "Request", banner: "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 39, type: "Article", title: "Eksotisme Jembatan Ampera di Malam Hari", author: "Budi Santoso", date: "17 Jul 2026, 20:00", views: "6.1K", likes: "1.7K", comments: 120, status: "Posted", banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 40, type: "Article", title: "Kisah Penenun Songket Generasi Ketiga", author: "Nurul Hidayah", date: "16 Jul 2026, 09:40", views: "2.6K", likes: 590, comments: 45, status: "Posted", banner: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 41, type: "Event", title: "Lomba Senam Massal Wong Kito Bugar", author: "Dispora Palembang", date: "15 Jul 2026, 06:30", views: "3.9K", likes: 880, comments: 67, status: "Posted", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 42, type: "Article", title: "Menjaga Kualitas Lingkungan Sungai Musi", author: "Ir. Hendri Gunawan", date: "14 Jul 2026, 11:30", views: "1.6K", likes: 350, comments: 23, status: "Posted", banner: "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 43, type: "Event", title: "Festival Musik Tradisional Dulmuluk Modern", author: "Dewan Kesenian Sumsel", date: "13 Jul 2026, 19:30", views: "2.9K", likes: 670, comments: 49, status: "Posted", banner: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 44, type: "Article", title: "Pesona Wisata Alam Danau JSC Palembang", author: "Rian Aditya", date: "12 Jul 2026, 15:20", views: "3.4K", likes: 760, comments: 55, status: "Posted", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 45, type: "Event", title: "Workshop Kerajinan Daur Ulang Kreatif", author: "Green Generation", date: "11 Jul 2026, 13:00", views: "1.1K", likes: 230, comments: 15, status: "Posted", banner: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 46, type: "Article", title: "Tradisi Belanja Kain Menjelang Lebaran di Pasar 16", author: "Hj. Rosdiana", date: "10 Jul 2026, 10:00", views: "4.8K", likes: "1.3K", comments: 92, status: "Posted", banner: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 47, type: "Event", title: "Eksibisi Fotografi Satwa Endemik Sumsel", author: "Sahabat Alam Palembang", date: "09 Jul 2026, 10:30", views: "2.0K", likes: 450, comments: 31, status: "Posted", banner: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 48, type: "Article", title: "Evolusi Cita Rasa Pindang Ikan Baung", author: "Chef Lukman Hakim", date: "08 Jul 2026, 12:40", views: "3.8K", likes: 890, comments: 70, status: "Posted", banner: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 49, type: "Event", title: "Turnamen Catur Cepat Terbuka Palembang", author: "Percasi Palembang", date: "07 Jul 2026, 08:30", views: "1.7K", likes: 380, comments: 24, status: "Posted", banner: "https://images.pexels.com/photos/8993561/pexels-photo-8993561.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
    { id: 50, type: "Article", title: "Membangun Ruang Publik Ramah Anak di Palembang", author: "Sari Wulandari", date: "06 Jul 2026, 09:15", views: "2.7K", likes: 610, comments: 46, status: "Posted", banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop" },
]

interface ManageContentProps {
    type?: "Article" | "Event"
}

export function ManageContent({ type }: ManageContentProps = {}) {
    const navigate = useNavigate()
    const location = useLocation()
    const contentType: "Article" | "Event" = type || (location.pathname.includes("/event") ? "Event" : "Article")
    const isEvent = contentType === "Event"

    const [contents, setContents] = useState(initialContent)
    const [searchTerm, setSearchTerm] = useState("")
    const [currentPage, setCurrentPage] = useState(1)
    const itemsPerPage = 25

    // Reset pagination and search when switching sub-menus
    useEffect(() => {
        setSearchTerm("")
        setCurrentPage(1)
    }, [contentType])

    const [confirmModal, setConfirmModal] = useState<{
        open: boolean
        contentId: number
        contentTitle: string
        action: "accept" | "reject" | "takedown" | "restore"
    }>({
        open: false,
        contentId: 0,
        contentTitle: "",
        action: "takedown",
    })

    const openConfirm = (content: typeof initialContent[0], action: "accept" | "reject" | "takedown" | "restore") => {
        setConfirmModal({
            open: true,
            contentId: content.id,
            contentTitle: content.title,
            action,
        })
    }

    const handleConfirmAction = () => {
        const { contentId, contentTitle, action } = confirmModal
        if (action === "accept") {
            setContents(contents.map(c => c.id === contentId ? { ...c, status: "Posted" } : c))
            toast.success(`Konten "${contentTitle}" berhasil disetujui & diposting!`)
        } else if (action === "reject") {
            setContents(contents.map(c => c.id === contentId ? { ...c, status: "Rejected" } : c))
            toast.error(`Konten "${contentTitle}" berhasil ditolak!`)
        } else if (action === "takedown") {
            setContents(contents.map(c => c.id === contentId ? { ...c, status: "Takedown" } : c))
            toast.error(`Konten "${contentTitle}" berhasil di-takedown!`)
        } else if (action === "restore") {
            setContents(contents.map(c => c.id === contentId ? { ...c, status: "Posted" } : c))
            toast.success(`Konten "${contentTitle}" berhasil dipulihkan (Posted)!`)
        }
        setConfirmModal(prev => ({ ...prev, open: false }))
    }

    const filteredContents = useMemo(() => {
        return contents
            .filter(c => c.type === contentType)
            .filter(c => 
                c.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                c.author.toLowerCase().includes(searchTerm.toLowerCase())
            )
    }, [contents, contentType, searchTerm])

    const totalPages = Math.ceil(filteredContents.length / itemsPerPage)
    const paginatedContents = useMemo(() => {
        const start = (currentPage - 1) * itemsPerPage
        return filteredContents.slice(start, start + itemsPerPage)
    }, [filteredContents, currentPage, itemsPerPage])

    const handleSearchChange = (val: string) => {
        setSearchTerm(val)
        setCurrentPage(1)
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        Manage Content: {isEvent ? "Event" : "Article"}
                    </h2>
                    <p className="text-muted-foreground">
                        {isEvent 
                            ? "Moderasi event dan agenda kegiatan yang diajukan oleh pengguna."
                            : "Moderasi artikel dan cerita yang diajukan oleh pengguna."
                        }
                    </p>
                </div>
            </div>

            <div className="rounded-xl border bg-background shadow-sm overflow-hidden">
                <div className="p-4 border-b flex items-center justify-between">
                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
                        <Input 
                            placeholder={isEvent ? "Cari event atau organizer..." : "Cari artikel atau penulis..."} 
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
                                <th className="px-6 py-4 font-semibold">{isEvent ? "Banner & Judul Event" : "Banner & Judul Artikel"}</th>
                                <th className="px-6 py-4 font-semibold">{isEvent ? "Organizer" : "Author"}</th>
                                <th className="px-6 py-4 font-semibold">Date & Time</th>
                                <th className="px-6 py-4 font-semibold">Statistik</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                                <th className="px-6 py-4 font-semibold text-right">Action</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y">
                            {paginatedContents.length > 0 ? paginatedContents.map((content) => (
                                <tr key={content.id} className="hover:bg-muted/30 transition-colors">
                                    <td className="px-6 py-4">
                                        <div className="flex items-center gap-3">
                                            <img src={content.banner || "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop"} alt="Banner" className="w-16 h-12 rounded-md object-cover border" />
                                            <span className="font-semibold text-foreground max-w-[200px] line-clamp-2" title={content.title}>{content.title}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">{content.author}</td>
                                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap text-xs">{content.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1 font-medium" title="Views">
                                                <Eye className="size-3.5 text-blue-500" /> {content.views}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium" title="Likes">
                                                <Heart className="size-3.5 text-red-500" /> {content.likes}
                                            </span>
                                            <span className="flex items-center gap-1 font-medium" title="Comments">
                                                <MessageCircle className="size-3.5 text-emerald-500" /> {content.comments}
                                            </span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                                            content.status === 'Posted' ? 'bg-emerald-50 text-emerald-600' : 
                                            content.status === 'Request' ? 'bg-amber-50 text-amber-600' : 
                                            content.status === 'Rejected' ? 'bg-zinc-100 text-zinc-600' :
                                            'bg-red-50 text-red-600'
                                        }`}>
                                            {content.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-right whitespace-nowrap">
                                        <div className="flex justify-end gap-2 items-center">
                                            <Button 
                                                variant="outline" 
                                                size="sm" 
                                                onClick={() => {
                                                    if (content.type === "Article") {
                                                        navigate(`/dashboard/article/preview/${content.id}`, {
                                                            state: { returnUrl: `/dashboard/content/article` }
                                                        })
                                                    } else {
                                                        navigate(`/dashboard/event/preview/${content.id}`, {
                                                            state: { returnUrl: `/dashboard/content/event` }
                                                        })
                                                    }
                                                }}
                                                className="gap-1.5 text-xs text-foreground hover:bg-muted"
                                            >
                                                <Eye className="size-3.5" /> View
                                            </Button>

                                            {content.status === "Request" && (
                                                <>
                                                    <Button 
                                                        size="sm" 
                                                        onClick={() => openConfirm(content, "accept")}
                                                        className="bg-emerald-600 hover:bg-emerald-700 text-white gap-1 text-xs"
                                                    >
                                                        <CheckCircle className="size-3.5" /> Setujui
                                                    </Button>
                                                    <Button 
                                                        variant="outline" 
                                                        size="sm" 
                                                        onClick={() => openConfirm(content, "reject")}
                                                        className="border-zinc-300 text-zinc-700 hover:bg-zinc-100 gap-1 text-xs"
                                                    >
                                                        <XCircle className="size-3.5" /> Tolak
                                                    </Button>
                                                </>
                                            )}

                                            {content.status === "Posted" && (
                                                <Button 
                                                    variant="outline"
                                                    size="sm" 
                                                    onClick={() => openConfirm(content, "takedown")}
                                                    className="border-red-200 text-red-600 hover:bg-red-50 gap-1.5 text-xs"
                                                >
                                                    <Trash2 className="size-3.5" /> Takedown
                                                </Button>
                                            )}

                                            {content.status === "Takedown" && (
                                                <Button 
                                                    size="sm" 
                                                    onClick={() => openConfirm(content, "restore")}
                                                    className="bg-red-600 text-white hover:bg-red-700 gap-1.5 text-xs"
                                                >
                                                    <RotateCcw className="size-3.5" /> Restore
                                                </Button>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            )) : (
                                <tr>
                                    <td colSpan={6} className="px-6 py-8 text-center text-muted-foreground">
                                        Tidak ada konten {isEvent ? "event" : "artikel"} ditemukan.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>

                <PaginationControls
                    currentPage={currentPage}
                    totalPages={totalPages}
                    totalItems={filteredContents.length}
                    itemsPerPage={itemsPerPage}
                    onPageChange={(page) => setCurrentPage(page)}
                />
            </div>

            <ConfirmActionDialog
                open={confirmModal.open}
                onOpenChange={(open) => setConfirmModal(prev => ({ ...prev, open }))}
                title={
                    confirmModal.action === "accept" ? `Konfirmasi Persetujuan ${isEvent ? 'Event' : 'Artikel'}` :
                    confirmModal.action === "reject" ? `Konfirmasi Penolakan ${isEvent ? 'Event' : 'Artikel'}` :
                    confirmModal.action === "takedown" ? `Konfirmasi Takedown ${isEvent ? 'Event' : 'Artikel'}` :
                    `Konfirmasi Pemulihan ${isEvent ? 'Event' : 'Artikel'}`
                }
                description={
                    confirmModal.action === "accept" ? `Apakah Anda yakin ingin menyetujui dan mempublikasikan ${isEvent ? 'event' : 'artikel'} "${confirmModal.contentTitle}"?` :
                    confirmModal.action === "reject" ? `Apakah Anda yakin ingin menolak pengajuan ${isEvent ? 'event' : 'artikel'} "${confirmModal.contentTitle}"?` :
                    confirmModal.action === "takedown" ? `Apakah Anda yakin ingin men-takedown ${isEvent ? 'event' : 'artikel'} "${confirmModal.contentTitle}" dari penayangan publik?` :
                    `Apakah Anda yakin ingin memulihkan ${isEvent ? 'event' : 'artikel'} "${confirmModal.contentTitle}" ke status Posted?`
                }
                confirmText={
                    confirmModal.action === "accept" ? "Ya, Setujui" :
                    confirmModal.action === "reject" ? "Ya, Tolak" :
                    confirmModal.action === "takedown" ? "Ya, Takedown" :
                    "Ya, Pulihkan"
                }
                cancelText="Batal"
                variant={confirmModal.action === "takedown" || confirmModal.action === "reject" ? "destructive" : "default"}
                onConfirm={handleConfirmAction}
            />
        </div>
    )
}
