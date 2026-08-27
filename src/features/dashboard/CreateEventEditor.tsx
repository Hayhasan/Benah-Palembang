"use client"

import { useNavigate, useSearchParams } from "@/lib/navigation"
import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TiptapEditor } from "@/components/dashboard/TiptapEditor"
import { TagInput } from "@/components/dashboard/TagInput"
import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"
import { EventPreview } from "@/features/dashboard/EventPreview"
import { toast } from "sonner"
import { Save, Send, Trash2, MapPin, Calendar, Clock, Building, Link2, Eye } from "lucide-react"

const mockEventDatabase: Record<string, {
    title: string
    description: string
    date: string
    time: string
    location: string
    organizer: string
    registrationLink: string
    category: string
    tags: string[]
    bannerUrl: string
    content: string
}> = {
    "1": {
        title: "Pameran Fotografi: Warna Palembang",
        description: "Melihat sudut kota melalui lensa fotografer lokal Palembang dalam mengekspresikan dinamika kehidupan kota.",
        date: "2026-09-15",
        time: "10:00",
        location: "Gedung Kesenian Palembang, Jl. Merdeka",
        organizer: "Komunitas Lensa Wong Kito",
        registrationLink: "https://bit.ly/pameran-foto-plg",
        category: "Pameran",
        tags: ["fotografi", "seni", "pameran", "budaya"],
        bannerUrl: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
        content: "<p>Pameran fotografi tahunan yang menampilkan lebih dari 100 karya fotografer muda Palembang. Terbuka untuk umum tanpa dipungut biaya.</p><p>Akan ada juga sesi sharing dan bedah karya bersama kurator foto nasional.</p>",
    },
    "2": {
        title: "Festival Kuliner Malam Ampera",
        description: "Nikmati lebih dari 50 jenis makanan tradisional dan fusion khas Sumatera Selatan di pinggir Sungai Musi.",
        date: "2026-09-10",
        time: "18:30",
        location: "Plaza Benteng Kuto Besak (BKB)",
        organizer: "Dinas Pariwisata & Ekonomi Kreatif Palembang",
        registrationLink: "https://bit.ly/festival-ampera",
        category: "Festival",
        tags: ["kuliner", "festival", "bkb", "malam"],
        bannerUrl: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
        content: "<p>Festival kuliner terbesar menyajikan aneka ragam makanan khas Sumatera Selatan di tepi Sungai Musi dengan latar belakang Jembatan Ampera di malam hari.</p>",
    },
}

/**
 * Mode `?mode=view` merender pratinjau publik alih-alih form.
 *
 * Cabang ini sengaja ditaruh di komponen pembungkus: di versi Vite early
 * return-nya berada di atas belasan `useState`, sehingga jumlah hook berubah
 * saat query `mode` berpindah tanpa unmount — pelanggaran Rules of Hooks yang
 * bisa membuat React melempar error. Tampilan kedua cabang tidak berubah.
 */
export function CreateEventEditor() {
    const [searchParams] = useSearchParams()

    if (searchParams.get("mode") === "view") {
        return <EventPreview />
    }

    return <CreateEventEditorForm />
}

function CreateEventEditorForm() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { setIsDirty, registerSaveHandler } = useUnsavedChanges()

    const editId = searchParams.get("id")
    const isViewMode = searchParams.get("mode") === "view"
    const isEditing = !!editId && !isViewMode

    // Event state
    const [bannerUrl, setBannerUrl] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("Festival")
    const [tags, setTags] = useState<string[]>(["Palembang", "Event"])
    const [content, setContent] = useState("")
    const [date, setDate] = useState("")
    const [time, setTime] = useState("")
    const [location, setLocation] = useState("")
    const [organizer, setOrganizer] = useState("")
    const [registrationLink, setRegistrationLink] = useState("")
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    // Load existing event data if editing or viewing
    useEffect(() => {
        if (editId && mockEventDatabase[editId]) {
            const data = mockEventDatabase[editId]
            setTitle(data.title)
            setDescription(data.description)
            setDate(data.date)
            setTime(data.time)
            setLocation(data.location)
            setOrganizer(data.organizer)
            setRegistrationLink(data.registrationLink)
            setCategory(data.category)
            setTags(data.tags)
            setBannerUrl(data.bannerUrl)
            setContent(data.content)
        } else if (editId) {
            setTitle("Event Contoh " + editId)
            setDescription("Deskripsi event " + editId)
            setDate("2026-09-20")
            setTime("09:00")
            setLocation("Palembang")
            setOrganizer("Panitia Pelaksana")
            setRegistrationLink("https://bit.ly/event")
            setCategory("Festival")
            setTags(["agenda", "event"])
            setBannerUrl("https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop")
            setContent("<p>Detail informasi acara event yang sedang diedit.</p>")
        }
        setIsDirty(false)
    }, [editId])

    // Track user changes when in edit/create mode
    const handleFieldChange = () => {
        if (!isViewMode) {
            setIsDirty(true)
        }
    }

    const handlePreview = () => {
        const previewEvent = {
            id: editId || "new",
            title: title || "Nama Acara Event",
            description: description || "Deskripsi event",
            date: date || "Belum ditentukan",
            time: time ? `${time} WIB` : "Belum ditentukan",
            location: location || "Palembang",
            organizer: organizer || "Panitia Pelaksana",
            registrationLink: registrationLink || "",
            category: category || "Festival",
            tags: tags.length > 0 ? tags : ["Palembang", "Event"],
            image: bannerUrl || "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            content: content || "<p>Detail informasi acara event.</p>"
        }
        navigate(`/dashboard/event/preview/${editId || 'new'}`, {
            state: {
                event: previewEvent,
                returnUrl: editId ? `/dashboard/create-event/new?id=${editId}&mode=edit` : `/dashboard/create-event/new`
            }
        })
    }

    const handleSaveDraft = () => {
        setIsDirty(false)
        toast.success("Draf event berhasil disimpan!")
    }

    const handlePublish = () => {
        if (!title || !content || !date || !time) {
            toast.error("Form tidak lengkap! Pastikan Judul, Konten, Tanggal, dan Waktu terisi.")
            return
        }
        setIsDirty(false)
        toast.success("Event berhasil dipublikasikan!")
        navigate('/dashboard/create-event')
    }

    const handleSaveEdit = () => {
        if (!title || !content || !date || !time) {
            toast.error("Form tidak lengkap!")
            return
        }
        setIsDirty(false)
        toast.success("Perubahan event berhasil disimpan!")
        navigate('/dashboard/create-event')
    }

    // Register auto-save handler for unsaved changes prompt
    useEffect(() => {
        registerSaveHandler(() => {
            if (!title || !content || !date || !time) {
                toast.error("Pastikan Judul, Konten, Tanggal, dan Waktu terisi untuk menyimpan!")
                return false
            }
            if (isEditing) {
                toast.success("Perubahan event berhasil disimpan!")
            } else {
                toast.success("Draf event berhasil disimpan!")
            }
            setIsDirty(false)
            return true
        })
        return () => {
            registerSaveHandler(null)
            setIsDirty(false)
        }
    }, [title, content, date, time, isEditing, registerSaveHandler, setIsDirty])

    const handleDelete = () => {
        setIsDirty(false)
        toast.error("Event berhasil dihapus!")
        navigate('/dashboard/create-event')
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEditing ? "Edit Event" : "Buat Event Baru"}
                    </h2>
                    <p className="text-muted-foreground">
                        Publikasikan acara atau agenda kegiatan di Palembang.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <Button onClick={() => setDeleteModalOpen(true)} variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                                <Trash2 className="size-4" /> Delete Event
                            </Button>
                            {/* Preview Button between Delete and Save */}
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={handlePreview} 
                                className="gap-2 text-foreground hover:bg-muted"
                            >
                                <Eye className="size-4" /> Preview
                            </Button>
                            <Button onClick={handleSaveEdit} className="bg-palembang-red text-white hover:bg-palembang-red/90 gap-2">
                                <Save className="size-4" /> Save Event
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
                                <Save className="size-4" /> Simpan Draf
                            </Button>
                            {/* Preview Button between Simpan Draf and Publikasi */}
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={handlePreview} 
                                className="gap-2 text-foreground hover:bg-muted"
                            >
                                <Eye className="size-4" /> Preview
                            </Button>
                            <Button onClick={handlePublish} className="bg-palembang-red text-white hover:bg-palembang-red/90 gap-2">
                                <Send className="size-4" /> Publikasi Event
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Kolom Kiri: Text Editor */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="space-y-4 bg-background p-5 rounded-xl border shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Judul Event</label>
                            <Input 
                                disabled={isViewMode}
                                placeholder="Nama acara..." 
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    handleFieldChange()
                                }}
                                className="text-lg font-semibold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Deskripsi Singkat</label>
                            <textarea 
                                disabled={isViewMode}
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                    handleFieldChange()
                                }}
                                className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-muted/20"
                                placeholder="Ringkasan tentang event..."
                            />
                        </div>
                    </div>

                    <div className="rounded-xl border bg-background shadow-sm p-5 space-y-4">
                        <h3 className="font-semibold text-base border-b pb-2">Informasi & Waktu Pelaksanaan</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1.5">
                                    <Calendar className="size-4 text-muted-foreground" /> Tanggal Event
                                </label>
                                <Input 
                                    disabled={isViewMode}
                                    type="date" 
                                    value={date} 
                                    onChange={(e) => {
                                        setDate(e.target.value)
                                        handleFieldChange()
                                    }} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1.5">
                                    <Clock className="size-4 text-muted-foreground" /> Waktu Pelaksanaan
                                </label>
                                <Input 
                                    disabled={isViewMode}
                                    type="time" 
                                    value={time} 
                                    onChange={(e) => {
                                        setTime(e.target.value)
                                        handleFieldChange()
                                    }} 
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-1.5">
                                <MapPin className="size-4 text-muted-foreground" /> Lokasi Acara
                            </label>
                            <Input 
                                disabled={isViewMode}
                                placeholder="Misal: Plaza Benteng Kuto Besak (BKB), Palembang" 
                                value={location} 
                                onChange={(e) => {
                                    setLocation(e.target.value)
                                    handleFieldChange()
                                }} 
                            />
                        </div>

                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1.5">
                                    <Building className="size-4 text-muted-foreground" /> Penyelenggara / Organizer
                                </label>
                                <Input 
                                    disabled={isViewMode}
                                    placeholder="Misal: Komunitas Seni Wong Kito" 
                                    value={organizer} 
                                    onChange={(e) => {
                                        setOrganizer(e.target.value)
                                        handleFieldChange()
                                    }} 
                                />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium flex items-center gap-1.5">
                                    <Link2 className="size-4 text-muted-foreground" /> Tautan Pendaftaran / Tiket
                                </label>
                                <Input 
                                    disabled={isViewMode}
                                    placeholder="https://..." 
                                    value={registrationLink} 
                                    onChange={(e) => {
                                        setRegistrationLink(e.target.value)
                                        handleFieldChange()
                                    }} 
                                />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Detail & Rangkaian Acara</label>
                        <TiptapEditor 
                            content={content} 
                            editable={!isViewMode}
                            onChange={(val) => {
                                setContent(val)
                                handleFieldChange()
                            }} 
                        />
                    </div>
                </div>

                {/* Kolom Kanan: Form Meta */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-xl border bg-background shadow-sm overflow-hidden p-5 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Banner Event</label>
                            <ImageUpload 
                                disabled={isViewMode}
                                value={bannerUrl} 
                                onChange={(url) => {
                                    setBannerUrl(url)
                                    handleFieldChange()
                                }} 
                                placeholder="Upload poster/banner..." 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kategori Acara</label>
                            <select 
                                disabled={isViewMode}
                                value={category} 
                                onChange={(e) => {
                                    setCategory(e.target.value)
                                    handleFieldChange()
                                }}
                                className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-transparent px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-muted/20"
                            >
                                <option value="" disabled>Pilih Kategori</option>
                                <option value="Festival">Festival</option>
                                <option value="Pameran">Pameran</option>
                                <option value="Diskusi">Diskusi/Talkshow</option>
                                <option value="Pertunjukan">Pertunjukan Seni</option>
                                <option value="Workshop">Workshop</option>
                            </select>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Tags</label>
                            <TagInput 
                                disabled={isViewMode}
                                tags={tags} 
                                setTags={(newTags) => {
                                    setTags(newTags)
                                    handleFieldChange()
                                }} 
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Delete Confirmation Dialog */}
            <ConfirmActionDialog
                open={deleteModalOpen}
                onOpenChange={setDeleteModalOpen}
                title="Konfirmasi Hapus Event"
                description={`Apakah Anda yakin ingin menghapus event "${title || 'ini'}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus Event"
                variant="destructive"
                onConfirm={handleDelete}
            />
        </div>
    )
}