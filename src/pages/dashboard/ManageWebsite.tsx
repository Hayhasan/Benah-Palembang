import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Plus, Trash2, ChevronUp, ChevronDown, GripVertical, Users } from "lucide-react"
import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"
import { toast } from "sonner"

const tabs = ["Home", "Article", "Agenda", "Collaboration", "Header & Footer"]

// ─── Reusable Section Card ───
function SectionCard({ title, desc, children }: { title: string; desc?: string; children: React.ReactNode }) {
    const [isExpanded, setIsExpanded] = useState(false)
    return (
        <div className="rounded-xl border bg-background shadow-sm overflow-visible">
            <div 
                className={`p-4 bg-muted/30 flex items-center justify-between cursor-pointer hover:bg-muted/50 transition-colors ${isExpanded ? "border-b rounded-t-xl" : "rounded-xl"}`}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div>
                    <h3 className="font-semibold text-lg font-display">{title}</h3>
                    {desc && <p className="text-xs text-muted-foreground mt-1">{desc}</p>}
                </div>
                <Button variant="ghost" size="icon" className="shrink-0 pointer-events-none">
                    {isExpanded ? <ChevronUp className="size-4" /> : <ChevronDown className="size-4" />}
                </Button>
            </div>
            {isExpanded && <div className="p-6 space-y-5">{children}</div>}
        </div>
    )
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return <div className="space-y-2"><label className="text-sm font-medium">{label}</label>{children}</div>
}

function Textarea({ value, onChange, placeholder }: { value?: string; onChange?: (v: string) => void; placeholder?: string }) {
    return <textarea value={value} onChange={e => onChange?.(e.target.value)} placeholder={placeholder} className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring" />
}

// ─── Main Export ───
export function ManageWebsite() {
    const [activeTab, setActiveTab] = useState(tabs[0])
    const { setIsDirty, registerSaveHandler } = useUnsavedChanges()

    const handleSave = () => {
        setIsDirty(false)
        toast.success(`Pengaturan ${activeTab} berhasil disimpan!`)
    }

    useEffect(() => {
        registerSaveHandler(() => {
            setIsDirty(false)
            toast.success(`Pengaturan ${activeTab} berhasil disimpan!`)
            return true
        })
        return () => {
            registerSaveHandler(null)
            setIsDirty(false)
        }
    }, [activeTab, registerSaveHandler, setIsDirty])

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Manage Website</h2>
                    <p className="text-muted-foreground">Konfigurasi dinamis untuk elemen-elemen halaman website.</p>
                </div>
                <Button onClick={handleSave} className="bg-palembang-red text-white hover:bg-palembang-red/90 w-fit">
                    <Save className="size-4 mr-2" /> Simpan Perubahan
                </Button>
            </div>

            <div className="relative border-b">
                <div className="flex overflow-x-auto no-scrollbar gap-6 pb-px">
                    {tabs.map(tab => (
                        <button key={tab} onClick={() => setActiveTab(tab)}
                            className={`whitespace-nowrap pb-3 text-sm font-medium transition-colors border-b-2 ${activeTab === tab ? "border-palembang-red text-palembang-red" : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"}`}>
                            {tab}
                        </button>
                    ))}
                </div>
            </div>

            <div className="max-w-4xl">
                {activeTab === "Home" && <HomeSettings />}
                {activeTab === "Article" && <ArticleSettings />}
                {activeTab === "Agenda" && <AgendaSettings />}
                {activeTab === "Collaboration" && <CollaborationSettings />}
                {activeTab === "Header & Footer" && <HeaderFooterSettings />}
            </div>
        </div>
    )
}

// ═══════════════════════════════════════════
// TAB: HOME
// ═══════════════════════════════════════════
interface CarouselItem { id: number; bg: string; judul: string; tagline: string; deskripsi: string; url: string }

function HomeSettings() {
    const [carousels, setCarousels] = useState<CarouselItem[]>([
        { id: 1, bg: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900", judul: "Merawat Tradisi di Tengah Kota", tagline: "BUDAYA", deskripsi: "Ruang untuk cerita, budaya, kreativitas, dan kehidupan Palembang.", url: "/cerita-warga" },
        { id: 2, bg: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=900", judul: "Lorong Basah yang Tak Pernah Tidur", tagline: "GAYA HIDUP", deskripsi: "Menelusuri kuliner dan kehidupan malam lorong-lorong ikonik.", url: "/gaya-hidup" },
    ])

    const moveItem = (index: number, dir: -1 | 1) => {
        const next = index + dir
        if (next < 0 || next >= carousels.length) return
        const copy = [...carousels]
        ;[copy[index], copy[next]] = [copy[next], copy[index]]
        setCarousels(copy)
    }

    const updateCarousel = (id: number, key: keyof CarouselItem, value: string) => {
        setCarousels(prev => prev.map(c => c.id === id ? { ...c, [key]: value } : c))
    }

    const addCarousel = () => {
        setCarousels(prev => [...prev, { id: Date.now(), bg: "", judul: "", tagline: "", deskripsi: "", url: "" }])
    }

    // Jelajahi
    const [jelajahiJudul, setJelajahiJudul] = useState("Satu kota, banyak cerita.")
    const [jelajahiTagline, setJelajahiTagline] = useState("Jelajahi perspektif")
    const [jelajahiCards, setJelajahiCards] = useState([
        { id: 1, judul: "Cerita Warga", stories: "12 stories", link: "/cerita-warga" },
        { id: 2, judul: "Gaya Hidup", stories: "8 stories", link: "/gaya-hidup" },
        { id: 3, judul: "Ruang Kota", stories: "10 stories", link: "/ruang-kota" },
        { id: 4, judul: "Industri Kreatif", stories: "6 stories", link: "/industri-kreatif" },
        { id: 5, judul: "Kebudayaan", stories: "14 stories", link: "/kebudayaan" },
    ])

    const moveJelajahi = (index: number, dir: -1 | 1) => {
        const next = index + dir
        if (next < 0 || next >= jelajahiCards.length) return
        const copy = [...jelajahiCards]
        ;[copy[index], copy[next]] = [copy[next], copy[index]]
        setJelajahiCards(copy)
    }

    // Category Sections
    const categoryNames = ["Cerita Palembang", "Gaya Hidup", "Ruang Kota", "Industri Kreatif", "Kebudayaan"] as const
    const [catSections, setCatSections] = useState(categoryNames.map(name => ({
        name, bg: "", judul: name, deskripsi: "", pinArticles: ["", "", "", ""], linkUrl: `/${name.toLowerCase().replace(/\s/g, '-')}`
    })))

    const updateCatSection = (index: number, key: string, value: string) => {
        setCatSections(prev => prev.map((c, i) => i === index ? { ...c, [key]: value } : c))
    }

    const updateCatPin = (catIdx: number, pinIdx: number, value: string) => {
        setCatSections(prev => prev.map((c, i) => {
            if (i !== catIdx) return c
            const pins = [...c.pinArticles]
            pins[pinIdx] = value
            return { ...c, pinArticles: pins }
        }))
    }
    
    const [searchPins, setSearchPins] = useState<{ [key: number]: string }>({})

    // Team
    const [teamJudul, setTeamJudul] = useState("Our Team")
    const [teamTagline, setTeamTagline] = useState("Orang-orang di balik cerita")
    const [teamDeskripsi, setTeamDeskripsi] = useState("Kami adalah kumpulan penulis, fotografer, peneliti, dan warga kota yang percaya pada kekuatan cerita.")
    const [teamMembers, setTeamMembers] = useState([
        { id: 1, foto: "https://i.pravatar.cc/150?img=11", nama: "Ahmad Rasyid", jabatan: "Chief Editor", deskripsi: "Mengejar cerita dan kebenaran." },
        { id: 2, foto: "https://i.pravatar.cc/150?img=5", nama: "Sari Dewi", jabatan: "Creative Director", deskripsi: "Mengubah ide menjadi visual." },
    ])

    const addTeamMember = () => {
        setTeamMembers(prev => [...prev, { id: Date.now(), foto: "", nama: "", jabatan: "", deskripsi: "" }])
    }

    const updateTeamMember = (id: number, key: string, value: string) => {
        setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, [key]: value } : m))
    }

    // CTA
    const [ctaTagline, setCtaTagline] = useState("Buka ruang kolaborasi")
    const [ctaJudul, setCtaJudul] = useState("Kota ini milik kita semua.")
    const [ctaDeskripsi, setCtaDeskripsi] = useState("Punya cerita, ide, atau ingin membuat sesuatu bersama? Kami ingin mendengarnya.")
    const [ctaUrl, setCtaUrl] = useState("/kolaborasi")

    // Delete Confirm State
    const [deleteConfirm, setDeleteConfirm] = useState<{
        open: boolean
        type: "carousel" | "jelajahi" | "team" | null
        id?: number
        index?: number
        title?: string
    }>({
        open: false,
        type: null
    })

    const handleConfirmDelete = () => {
        if (deleteConfirm.type === "carousel" && deleteConfirm.id !== undefined) {
            if (carousels.length <= 1) {
                toast.error("Minimal harus ada 1 carousel!")
            } else {
                setCarousels(prev => prev.filter(c => c.id !== deleteConfirm.id))
                toast.success("Slide carousel berhasil dihapus")
            }
        } else if (deleteConfirm.type === "jelajahi" && deleteConfirm.index !== undefined) {
            setJelajahiCards(prev => prev.filter((_, i) => i !== deleteConfirm.index))
            toast.success("Card jelajahi berhasil dihapus")
        } else if (deleteConfirm.type === "team" && deleteConfirm.id !== undefined) {
            setTeamMembers(prev => prev.filter(m => m.id !== deleteConfirm.id))
            toast.success("Anggota tim berhasil dihapus")
        }
        setDeleteConfirm({ open: false, type: null })
    }

    return (
        <div className="space-y-8">
            {/* ─── 1. Heroes Carousel ─── */}
            <SectionCard title="Section Heroes (Carousel)" desc="Konfigurasi gambar, teks, dan urutan carousel utama. Geser atas/bawah untuk mengubah urutan.">
                <div className="space-y-6">
                    {carousels.map((item, index) => (
                        <div key={item.id} className="relative rounded-lg border bg-muted/20 p-5 space-y-4">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm font-semibold text-muted-foreground">
                                    <GripVertical className="size-4" />
                                    Slide {index + 1}
                                </div>
                                <div className="flex items-center gap-1">
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem(index, -1)} disabled={index === 0}><ChevronUp className="size-4" /></Button>
                                    <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => moveItem(index, 1)} disabled={index === carousels.length - 1}><ChevronDown className="size-4" /></Button>
                                    <Button 
                                        variant="ghost" 
                                        size="icon" 
                                        className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40" 
                                        onClick={() => setDeleteConfirm({ open: true, type: "carousel", id: item.id, title: item.judul || `Slide ${index + 1}` })}
                                        title="Hapus Slide"
                                    >
                                        <Trash2 className="size-4" />
                                    </Button>
                                </div>
                            </div>
                            <Field label="Background Carousel">
                                <ImageUpload value={item.bg} onChange={v => updateCarousel(item.id, "bg", v)} placeholder="Upload gambar background..." />
                            </Field>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <Field label="Tagline"><Input value={item.tagline} onChange={e => updateCarousel(item.id, "tagline", e.target.value)} placeholder="BUDAYA" /></Field>
                                <Field label="URL Button"><Input value={item.url} onChange={e => updateCarousel(item.id, "url", e.target.value)} placeholder="/cerita-warga" /></Field>
                            </div>
                            <Field label="Judul"><Input value={item.judul} onChange={e => updateCarousel(item.id, "judul", e.target.value)} placeholder="Judul utama carousel" /></Field>
                            <Field label="Deskripsi Singkat"><Textarea value={item.deskripsi} onChange={v => updateCarousel(item.id, "deskripsi", v)} placeholder="Tuliskan deskripsi..." /></Field>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={addCarousel}><Plus className="size-4 mr-2" /> Tambah Carousel Slide</Button>
                </div>
            </SectionCard>

            {/* ─── 2. About ─── */}
            <SectionCard title="Section About" desc="Konfigurasi area tentang Benah Palembang.">
                <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Est. & Kota"><Input defaultValue="Est. 2025 · Palembang" /></Field>
                    <Field label="Tagline"><Input defaultValue="About Benah Palembang" /></Field>
                </div>
                <Field label="Judul Section"><Input defaultValue="Merekam, merayakan, dan menggerakkan Palembang." /></Field>
                <Field label="Deskripsi"><Textarea value="Benah Palembang adalah platform editorial yang percaya bahwa kota bukan hanya tentang bangunan dan jalan. Ia adalah tentang manusia, ingatan, budaya, dan cerita-cerita kecil yang membentuk identitas kita." /></Field>
            </SectionCard>

            {/* ─── 3. Jelajahi ─── */}
            <SectionCard title="Section Jelajahi" desc="Konfigurasi judul dan card jelajahi. Geser atas/bawah untuk mengubah urutan.">
                <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Tagline"><Input value={jelajahiTagline} onChange={e => setJelajahiTagline(e.target.value)} /></Field>
                    <Field label="Judul"><Input value={jelajahiJudul} onChange={e => setJelajahiJudul(e.target.value)} /></Field>
                </div>
                <div className="space-y-3 mt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Card Jelajahi</p>
                    {jelajahiCards.map((card, index) => (
                        <div key={card.id} className="flex items-center gap-3 rounded-lg border p-3 bg-muted/10">
                            <div className="flex flex-col gap-0.5">
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveJelajahi(index, -1)} disabled={index === 0}><ChevronUp className="size-3" /></Button>
                                <Button variant="ghost" size="icon" className="h-5 w-5" onClick={() => moveJelajahi(index, 1)} disabled={index === jelajahiCards.length - 1}><ChevronDown className="size-3" /></Button>
                            </div>
                            <Input className="flex-1" value={card.judul} onChange={e => setJelajahiCards(prev => prev.map((c, i) => i === index ? { ...c, judul: e.target.value } : c))} placeholder="Judul" />
                            <Input className="w-28" value={card.stories} onChange={e => setJelajahiCards(prev => prev.map((c, i) => i === index ? { ...c, stories: e.target.value } : c))} placeholder="CTA" />
                            <Input className="w-32" value={card.link} onChange={e => setJelajahiCards(prev => prev.map((c, i) => i === index ? { ...c, link: e.target.value } : c))} placeholder="Link URL" />
                            <Button 
                                variant="ghost" 
                                size="icon" 
                                className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40" 
                                onClick={() => setDeleteConfirm({ open: true, type: "jelajahi", index, title: card.judul || `Card ${index + 1}` })}
                                title="Hapus Card"
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setJelajahiCards(prev => [...prev, { id: Date.now(), judul: "", stories: "", link: "" }])}><Plus className="size-4 mr-2" /> Tambah Card Jelajahi</Button>
                </div>
            </SectionCard>

            {/* ─── 4. Category Sections ─── */}
            {catSections.map((cat, catIdx) => (
                <SectionCard key={cat.name} title={`Section: ${cat.name}`} desc={`Konfigurasi background, judul, deskripsi, dan pin artikel untuk kategori ${cat.name}.`}>
                    <Field label="Background">
                        <ImageUpload value={cat.bg} onChange={v => updateCatSection(catIdx, "bg", v)} placeholder={`Upload background ${cat.name}...`} />
                    </Field>
                    <div className="grid sm:grid-cols-2 gap-4">
                        <Field label="Judul"><Input value={cat.judul} onChange={e => updateCatSection(catIdx, "judul", e.target.value)} /></Field>
                        <Field label="Link URL (Lihat Semua)"><Input value={cat.linkUrl} onChange={e => updateCatSection(catIdx, "linkUrl", e.target.value)} /></Field>
                    </div>
                    <Field label="Deskripsi"><Textarea value={cat.deskripsi} onChange={v => updateCatSection(catIdx, "deskripsi", v)} placeholder={`Deskripsi mengenai ${cat.name}...`} /></Field>
                    <div className="space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Pin Postingan Artikel (Maks. 4)</p>
                        
                        {/* Current Pins */}
                        <div className="flex flex-col gap-2">
                            {cat.pinArticles.filter(p => p).map((pin, pinIdx) => (
                                <div key={pinIdx} className="flex justify-between items-center bg-muted/30 border rounded p-2 text-sm">
                                    <span>{pin}</span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-50 dark:hover:bg-red-950/40" onClick={() => {
                                        const newPins = [...cat.pinArticles]
                                        newPins[cat.pinArticles.indexOf(pin)] = ""
                                        setCatSections(prev => prev.map((c, i) => i === catIdx ? { ...c, pinArticles: newPins } : c))
                                    }}>
                                        <Trash2 className="size-3" />
                                    </Button>
                                </div>
                            ))}
                        </div>

                        {/* Search Input */}
                        {cat.pinArticles.filter(p => p).length < 4 && (
                            <div className="relative">
                                <Input 
                                    placeholder="Cari artikel untuk dipin..." 
                                    value={searchPins[catIdx] || ""} 
                                    onChange={e => setSearchPins(prev => ({ ...prev, [catIdx]: e.target.value }))}
                                />
                                {searchPins[catIdx] && (
                                    <div className="absolute top-full left-0 w-full bg-background border rounded-md shadow-md mt-1 z-[9999] p-2">
                                        <div className="flex justify-between items-center text-sm p-2 hover:bg-muted cursor-pointer rounded-sm">
                                            <span>Hasil: {searchPins[catIdx]}</span>
                                            <Button size="sm" className="bg-palembang-red text-white hover:bg-palembang-red/90" onClick={() => {
                                                const emptyIndex = cat.pinArticles.findIndex(p => p === "")
                                                if (emptyIndex !== -1) {
                                                    updateCatPin(catIdx, emptyIndex, searchPins[catIdx])
                                                }
                                                setSearchPins(prev => ({ ...prev, [catIdx]: "" }))
                                            }}>Add</Button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </SectionCard>
            ))}

            {/* ─── 5. Our Team ─── */}
            <SectionCard title="Section Our Team" desc="Konfigurasi judul dan anggota tim yang ditampilkan di homepage.">
                <div className="grid sm:grid-cols-3 gap-4">
                    <Field label="Tagline"><Input value={teamTagline} onChange={e => setTeamTagline(e.target.value)} /></Field>
                    <Field label="Judul"><Input value={teamJudul} onChange={e => setTeamJudul(e.target.value)} /></Field>
                </div>
                <Field label="Deskripsi"><Textarea value={teamDeskripsi} onChange={v => setTeamDeskripsi(v)} /></Field>

                <div className="space-y-4 mt-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2"><Users className="size-3.5" /> Anggota Tim</p>
                    {teamMembers.map(member => (
                        <div key={member.id} className="rounded-lg border p-4 bg-muted/10">
                            <div className="flex items-start gap-4">
                                <div className="w-24 shrink-0">
                                    <ImageUpload value={member.foto} onChange={v => updateTeamMember(member.id, "foto", v)} placeholder="Foto" />
                                </div>
                                <div className="flex-1 flex flex-col gap-3">
                                    <div className="flex justify-end">
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40 -mt-2 -mr-2" 
                                            onClick={() => setDeleteConfirm({ open: true, type: "team", id: member.id, title: member.nama || 'Anggota Tim' })}
                                            title="Hapus Anggota Tim"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                    <Input value={member.nama} onChange={e => updateTeamMember(member.id, "nama", e.target.value)} placeholder="Nama Lengkap" />
                                    <Input value={member.jabatan} onChange={e => updateTeamMember(member.id, "jabatan", e.target.value)} placeholder="Jabatan" />
                                    <Input value={member.deskripsi} onChange={e => updateTeamMember(member.id, "deskripsi", e.target.value)} placeholder="Deskripsi singkat" />
                                </div>
                            </div>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={addTeamMember}><Plus className="size-4 mr-2" /> Tambah Anggota Tim</Button>
                </div>
            </SectionCard>

            {/* ─── 6. CTA ─── */}
            <SectionCard title="Section CTA" desc="Konfigurasi call-to-action di bagian bawah homepage.">
                <Field label="Tagline"><Input value={ctaTagline} onChange={e => setCtaTagline(e.target.value)} /></Field>
                <Field label="Judul"><Input value={ctaJudul} onChange={e => setCtaJudul(e.target.value)} /></Field>
                <Field label="Deskripsi"><Textarea value={ctaDeskripsi} onChange={v => setCtaDeskripsi(v)} /></Field>
                <Field label="URL Button CTA"><Input value={ctaUrl} onChange={e => setCtaUrl(e.target.value)} placeholder="/kolaborasi" /></Field>
            </SectionCard>

            {/* Confirmation Modal */}
            <ConfirmActionDialog
                open={deleteConfirm.open}
                onOpenChange={(open) => setDeleteConfirm(prev => ({ ...prev, open }))}
                title={
                    deleteConfirm.type === "carousel" ? "Hapus Slide Carousel?" :
                    deleteConfirm.type === "jelajahi" ? "Hapus Card Jelajahi?" :
                    "Hapus Anggota Tim?"
                }
                description={
                    deleteConfirm.type === "carousel" ? `Apakah Anda yakin ingin menghapus "${deleteConfirm.title}"? Tindakan ini tidak dapat dibatalkan.` :
                    deleteConfirm.type === "jelajahi" ? `Apakah Anda yakin ingin menghapus card "${deleteConfirm.title}"?` :
                    `Apakah Anda yakin ingin menghapus "${deleteConfirm.title}" dari tim?`
                }
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="destructive"
                onConfirm={handleConfirmDelete}
            />
        </div>
    )
}

// ═══════════════════════════════════════════
// TAB: ARTICLE (Cerita Warga, Gaya Hidup, etc.)
// ═══════════════════════════════════════════
function ArticleSettings() {
    const categories = ["Cerita Warga", "Gaya Hidup", "Ruang Kota", "Industri Kreatif", "Kebudayaan"]
    return (
        <div className="space-y-8">
            {categories.map(cat => (
                <CategorySettings key={cat} categoryName={cat} />
            ))}
        </div>
    )
}

function CategorySettings({ categoryName }: { categoryName: string }) {
    const [bgUrl, setBgUrl] = useState("")

    return (
        <div className="space-y-8">
            <SectionCard title={`Section Heroes — ${categoryName}`} desc={`Konfigurasi background, judul, dan deskripsi halaman kategori ${categoryName}.`}>
                <Field label="Background">
                    <ImageUpload value={bgUrl} onChange={setBgUrl} placeholder={`Upload background ${categoryName}...`} />
                </Field>
                <Field label="Judul Halaman"><Input defaultValue={categoryName} /></Field>
                <Field label="Deskripsi"><Textarea placeholder={`Deskripsi mengenai ${categoryName}...`} /></Field>
            </SectionCard>
        </div>
    )
}

// ═══════════════════════════════════════════
// TAB: AGENDA
// ═══════════════════════════════════════════
function AgendaSettings() {
    const [bgUrl, setBgUrl] = useState("")

    return (
        <div className="space-y-8">
            <SectionCard title="Section Heroes — Agenda" desc="Konfigurasi tampilan heroes halaman agenda.">
                <Field label="Background">
                    <ImageUpload value={bgUrl} onChange={setBgUrl} placeholder="Upload background agenda..." />
                </Field>
                <Field label="Judul Halaman"><Input defaultValue="Temui, ikut, dan bergerak." /></Field>
                <Field label="Deskripsi"><Textarea value="Ruang-ruang pertemuan yang mempertemukan ide, orang, dan energi baik untuk Palembang." /></Field>
            </SectionCard>
        </div>
    )
}

// ═══════════════════════════════════════════
// TAB: COLLABORATION
// ═══════════════════════════════════════════
function CollaborationSettings() {
    const [bgUrl, setBgUrl] = useState("")

    // Partner Logos
    const [partnerLogos, setPartnerLogos] = useState([
        { id: 1, name: "Grab", url: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Grab_Logo.svg/200px-Grab_Logo.svg.png" },
        { id: 2, name: "Tokopedia", url: "https://images.tokopedia.net/img/toppicks/social-share-tokopedia.jpg" },
    ])
    const logoInputRef = useState<HTMLInputElement | null>(null)
    const [deleteLogoDialog, setDeleteLogoDialog] = useState<{ open: boolean; logo: { id: number; name: string } | null }>({
        open: false,
        logo: null
    })

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach(file => {
            const url = URL.createObjectURL(file)
            setPartnerLogos(prev => [...prev, { id: Date.now() + Math.random(), name: file.name.replace(/\.[^/.]+$/, ""), url }])
        })
        e.target.value = ""
    }

    const confirmDeleteLogo = () => {
        if (deleteLogoDialog.logo) {
            setPartnerLogos(prev => prev.filter(l => l.id !== deleteLogoDialog.logo!.id))
            toast.success("Logo partner berhasil dihapus")
        }
        setDeleteLogoDialog({ open: false, logo: null })
    }

    // Partner Contents
    const [partnerContents, setPartnerContents] = useState([
        { id: 1, platform: "youtube", link: "https://youtube.com/watch?v=example1" },
        { id: 2, platform: "instagram", link: "https://instagram.com/reel/example" },
    ])
    const [newContentPlatform, setNewContentPlatform] = useState("youtube")
    const [newContentLink, setNewContentLink] = useState("")
    const [deleteDialog, setDeleteDialog] = useState<{ open: boolean; item: { id: number; platform: string; link: string } | null }>({
        open: false,
        item: null
    })

    const addContent = () => {
        if (!newContentLink.trim()) {
            toast.error("Link konten tidak boleh kosong")
            return
        }
        setPartnerContents(prev => [...prev, { id: Date.now(), platform: newContentPlatform, link: newContentLink.trim() }])
        setNewContentLink("")
        toast.success("Konten partner berhasil ditambahkan")
    }

    const handleDeleteClick = (content: { id: number; platform: string; link: string }) => {
        setDeleteDialog({ open: true, item: content })
    }

    const confirmDelete = () => {
        if (deleteDialog.item) {
            setPartnerContents(prev => prev.filter(c => c.id !== deleteDialog.item!.id))
            toast.success("Konten partner berhasil dihapus")
        }
        setDeleteDialog({ open: false, item: null })
    }

    return (
        <div className="space-y-8">
            <SectionCard title="Section Heroes — Collaboration" desc="Konfigurasi tampilan heroes halaman kolaborasi.">
                <Field label="Background">
                    <ImageUpload value={bgUrl} onChange={setBgUrl} placeholder="Upload background kolaborasi..." />
                </Field>
                <Field label="Judul Halaman"><Input defaultValue="Mari Benahi Palembang bersama." /></Field>
                <Field label="Deskripsi"><Textarea value="Kami terbuka untuk berkolaborasi dengan komunitas, brand, creative worker, organisasi, media, dan siapa pun yang ingin ikut membuat Palembang lebih hidup." /></Field>
            </SectionCard>

            <SectionCard title="Kontak Kolaborasi" desc="Email, WhatsApp dan link button.">
                <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Email Kolaborasi"><Input defaultValue="kolaborasi@benahpalembang.id" /></Field>
                    <Field label="Nomor WhatsApp"><Input defaultValue="+628551241878" /></Field>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="URL Button Email"><Input defaultValue="mailto:hayhasan.public@gmail.com?subject=Kolaborasi" /></Field>
                    <Field label="URL Button WhatsApp"><Input defaultValue="https://wa.me/628551241878" /></Field>
                </div>
            </SectionCard>

            <SectionCard title="Form Hubungi Kami" desc="Konfigurasi judul dan deskripsi form kontak kolaborasi.">
                <Field label="Judul Form"><Input defaultValue="Hubungi Kami" /></Field>
                <Field label="Deskripsi Form"><Textarea value="Punya ide proyek, inisiatif kreatif, liputan cerita, atau ingin bermitra bersama Benah Palembang? Kirimkan detail singkatmu dan mari diskusikan langkah selanjutnya." /></Field>
            </SectionCard>

            {/* ── Partner Logos ── */}
            <SectionCard title="Partner Logos" desc="Upload logo partner yang ditampilkan di halaman kolaborasi. Logo akan ditampilkan grayscale dan berwarna saat di-hover.">
                <div className="space-y-4">
                    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                        {partnerLogos.map(logo => (
                            <div key={logo.id} className="relative group border rounded-lg p-3 flex items-center justify-center bg-muted/20 h-20">
                                <img src={logo.url} alt={logo.name} className="max-h-10 max-w-full object-contain" />
                                <button 
                                    onClick={() => setDeleteLogoDialog({ open: true, logo })} 
                                    className="absolute -top-2 -right-2 size-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600 shadow-xs"
                                    title="Hapus Logo"
                                >
                                    ×
                                </button>
                                <span className="absolute bottom-1 left-1 right-1 text-[9px] text-center text-muted-foreground truncate">{logo.name}</span>
                            </div>
                        ))}
                    </div>
                    <div>
                        <input
                            type="file"
                            accept="image/*"
                            multiple
                            onChange={handleLogoUpload}
                            className="hidden"
                            id="logo-upload-input"
                            ref={el => { logoInputRef[1] = () => el }}
                        />
                        <Button variant="outline" className="w-full border-dashed" onClick={() => document.getElementById('logo-upload-input')?.click()}>
                            <Plus className="size-4 mr-2" /> Upload Logo Partner (Multiple)
                        </Button>
                    </div>
                </div>
            </SectionCard>

            {/* ── Partner Content ── */}
            <SectionCard title="Partner Content" desc="Kelola konten video kolaborasi dari berbagai platform (YouTube, Instagram, TikTok, dll).">
                <div className="space-y-5">
                    <div>
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Konten Saat Ini</p>
                        {partnerContents.length === 0 ? (
                            <div className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground italic">
                                Belum ada konten kolaborasi. Silakan tambahkan melalui form di bawah.
                            </div>
                        ) : (
                            <div className="grid sm:grid-cols-2 gap-3">
                                {partnerContents.map(content => (
                                    <div key={content.id} className="flex items-center justify-between gap-3 rounded-lg border p-3 bg-muted/10 hover:bg-muted/25 transition-colors">
                                        <div className="flex items-center gap-2.5 min-w-0 flex-1">
                                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded shrink-0 ${
                                                content.platform === "youtube" ? "bg-red-600 text-white" :
                                                content.platform === "instagram" ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white" :
                                                content.platform === "tiktok" ? "bg-black text-white border border-white/20" :
                                                content.platform === "facebook" ? "bg-blue-600 text-white" :
                                                "bg-neutral-800 text-white"
                                            }`}>{content.platform}</span>
                                            <span className="text-xs sm:text-sm truncate text-foreground font-medium" title={content.link}>
                                                {content.link}
                                            </span>
                                        </div>
                                        <Button 
                                            variant="ghost" 
                                            size="icon" 
                                            className="h-8 w-8 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/40" 
                                            onClick={() => handleDeleteClick(content)}
                                            title="Hapus Konten"
                                        >
                                            <Trash2 className="size-4" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* 2-Column Link Input Section */}
                    <div className="pt-4 border-t space-y-3">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Tambah Konten Baru</p>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Platform Media</label>
                                <select
                                    value={newContentPlatform}
                                    onChange={e => setNewContentPlatform(e.target.value)}
                                    className="flex h-10 w-full items-center rounded-md border border-input bg-background text-foreground px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                                >
                                    <option value="youtube">YouTube</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="tiktok">TikTok</option>
                                    <option value="facebook">Facebook</option>
                                    <option value="x">X (Twitter)</option>
                                </select>
                            </div>
                            <div>
                                <label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1.5 block">Link URL Konten</label>
                                <Input
                                    value={newContentLink}
                                    onChange={e => setNewContentLink(e.target.value)}
                                    placeholder="https://youtube.com/... atau https://instagram.com/..."
                                    className="w-full"
                                    onKeyDown={e => e.key === "Enter" && addContent()}
                                />
                            </div>
                        </div>
                        <div className="flex justify-end pt-1">
                            <Button onClick={addContent} className="bg-palembang-red text-white hover:bg-palembang-red/90 w-full sm:w-auto">
                                <Plus className="size-4 mr-2" /> Tambah Konten
                            </Button>
                        </div>
                    </div>
                </div>
            </SectionCard>

            {/* Confirmation Modal for Partner Content Delete */}
            <ConfirmActionDialog
                open={deleteDialog.open}
                onOpenChange={(open) => setDeleteDialog(prev => ({ ...prev, open }))}
                title="Hapus Konten Partner?"
                description={`Apakah Anda yakin ingin menghapus konten platform "${deleteDialog.item?.platform}" dengan link "${deleteDialog.item?.link}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="destructive"
                onConfirm={confirmDelete}
            />

            {/* Confirmation Modal for Partner Logo Delete */}
            <ConfirmActionDialog
                open={deleteLogoDialog.open}
                onOpenChange={(open) => setDeleteLogoDialog(prev => ({ ...prev, open }))}
                title="Hapus Logo Partner?"
                description={`Apakah Anda yakin ingin menghapus logo partner "${deleteLogoDialog.logo?.name || ''}"?`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="destructive"
                onConfirm={confirmDeleteLogo}
            />
        </div>
    )
}

// Social platform SVG icons for Connect section
function InstagramIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
            <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
        </svg>
    )
}

function WhatsAppIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
    )
}

function YouTubeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
            <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
        </svg>
    )
}

function TikTokIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64c.298-.002.595.042.88.13V9.4a6.33 6.33 0 0 0-1-.08A6.34 6.34 0 0 0 3 15.66a6.34 6.34 0 0 0 10.86 4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-.04-4.52z" />
        </svg>
    )
}

function LinkedInIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
            <rect width="4" height="12" x="2" y="9" />
            <circle cx="4" cy="4" r="2" />
        </svg>
    )
}

function XIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="currentColor">
            <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
        </svg>
    )
}

function FacebookIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
        </svg>
    )
}

function MailIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2" />
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
        </svg>
    )
}

function GlobeIcon({ className }: { className?: string }) {
    return (
        <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20" />
            <path d="M2 12h20" />
        </svg>
    )
}

const SOCIAL_PLATFORMS = [
    { value: "instagram", label: "Instagram", icon: InstagramIcon },
    { value: "whatsapp", label: "WhatsApp", icon: WhatsAppIcon },
    { value: "youtube", label: "YouTube", icon: YouTubeIcon },
    { value: "tiktok", label: "TikTok", icon: TikTokIcon },
    { value: "linkedin", label: "LinkedIn", icon: LinkedInIcon },
    { value: "x", label: "X (Twitter)", icon: XIcon },
    { value: "facebook", label: "Facebook", icon: FacebookIcon },
    { value: "mail", label: "Email", icon: MailIcon },
    { value: "website", label: "Website / Other", icon: GlobeIcon },
]

// ═══════════════════════════════════════════
// TAB: HEADER & FOOTER
// ═══════════════════════════════════════════
function HeaderFooterSettings() {
    const [logoUrl, setLogoUrl] = useState("")
    const [backgroundText, setBackgroundText] = useState("PALEMBANG")
    const [siteDescription, setSiteDescription] = useState("Platform editorial yang merekam, merayakan, dan menggerakkan kota Palembang.")

    const [exploreLinks, setExploreLinks] = useState([
        { id: 1, nama: "Cerita Warga", url: "/cerita-warga" },
        { id: 2, nama: "Gaya Hidup", url: "/gaya-hidup" },
        { id: 3, nama: "Ruang Kota", url: "/ruang-kota" },
        { id: 4, nama: "Industri Kreatif", url: "/industri-kreatif" },
        { id: 5, nama: "Kebudayaan", url: "/kebudayaan" },
        { id: 6, nama: "Agenda", url: "/agenda" },
        { id: 7, nama: "Kolaborasi", url: "/kolaborasi" },
    ])

    const [connectLinks, setConnectLinks] = useState([
        { id: 1, platform: "instagram", url: "https://instagram.com/benahpalembang" },
        { id: 2, platform: "whatsapp", url: "https://wa.me/628551241878" },
        { id: 3, platform: "youtube", url: "https://youtube.com/@benahpalembang" },
        { id: 4, platform: "mail", url: "mailto:halo@benahpalembang.id" },
    ])

    const [deleteLinkDialog, setDeleteLinkDialog] = useState<{
        open: boolean
        type: "explore" | "connect" | null
        index?: number
        title?: string
    }>({
        open: false,
        type: null
    })

    const confirmDeleteLink = () => {
        if (deleteLinkDialog.type === "explore" && deleteLinkDialog.index !== undefined) {
            setExploreLinks(prev => prev.filter((_, i) => i !== deleteLinkDialog.index))
            toast.success("Link explore berhasil dihapus")
        } else if (deleteLinkDialog.type === "connect" && deleteLinkDialog.index !== undefined) {
            setConnectLinks(prev => prev.filter((_, i) => i !== deleteLinkDialog.index))
            toast.success("Link sosial media berhasil dihapus")
        }
        setDeleteLinkDialog({ open: false, type: null })
    }

    return (
        <div className="space-y-8">
            <SectionCard title="Logo & Header" desc="Konfigurasi logo, redirect link header, background text footer, dan deskripsi website.">
                <Field label="Logo Website (Upload)">
                    <ImageUpload value={logoUrl} onChange={setLogoUrl} placeholder="Pilih logo (PNG/SVG)..." />
                </Field>
                <Field label="URL Logo (Redirect Link)"><Input defaultValue="/" /></Field>
                <Field label="Background Text (Footer)">
                    <Input
                        value={backgroundText}
                        onChange={e => setBackgroundText(e.target.value)}
                        placeholder="e.g. PALEMBANG"
                    />
                </Field>
                <Field label="Deskripsi Website / Tagline Footer">
                    <Textarea
                        value={siteDescription}
                        onChange={setSiteDescription}
                        placeholder="Platform editorial yang merekam, merayakan, dan menggerakkan kota Palembang."
                    />
                </Field>
            </SectionCard>

            <SectionCard title="Footer — Explore" desc="Link navigasi pada kolom Explore footer.">
                <div className="space-y-3">
                    {exploreLinks.map((link, index) => (
                        <div key={link.id} className="flex gap-2 items-center">
                            <Input
                                className="flex-1"
                                value={link.nama}
                                onChange={e => setExploreLinks(prev => prev.map((l, i) => i === index ? { ...l, nama: e.target.value } : l))}
                                placeholder="Nama Halaman (e.g. Cerita Warga)"
                            />
                            <Input
                                className="flex-[2]"
                                value={link.url}
                                onChange={e => setExploreLinks(prev => prev.map((l, i) => i === index ? { ...l, url: e.target.value } : l))}
                                placeholder="URL (e.g. /cerita-warga)"
                            />
                            <Button
                                variant="ghost"
                                size="icon"
                                className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                                onClick={() => setDeleteLinkDialog({ open: true, type: "explore", index, title: link.nama || `Link Explore ${index + 1}` })}
                            >
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}
                    <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => setExploreLinks(prev => [...prev, { id: Date.now(), nama: "", url: "" }])}
                    >
                        <Plus className="size-4 mr-2" /> Tambah Link Explore
                    </Button>
                </div>
            </SectionCard>

            <SectionCard title="Footer — Connect" desc="Link sosial media pada kolom Connect footer dengan pilihan icon platform.">
                <div className="space-y-3">
                    {connectLinks.map((link, index) => {
                        const platform = SOCIAL_PLATFORMS.find(p => p.value === link.platform) || SOCIAL_PLATFORMS[0]
                        const IconComponent = platform.icon
                        return (
                            <div key={link.id} className="flex gap-2.5 items-center">
                                <div className="relative w-44 sm:w-52 shrink-0 flex items-center">
                                    <div className="absolute left-3 pointer-events-none text-muted-foreground flex items-center">
                                        <IconComponent className="size-4" />
                                    </div>
                                    <select
                                        value={link.platform}
                                        onChange={e => setConnectLinks(prev => prev.map((l, i) => i === index ? { ...l, platform: e.target.value } : l))}
                                        className="flex h-10 w-full rounded-md border border-input bg-background pl-9 pr-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring cursor-pointer"
                                    >
                                        {SOCIAL_PLATFORMS.map(p => (
                                            <option key={p.value} value={p.value}>{p.label}</option>
                                        ))}
                                    </select>
                                </div>
                                <Input
                                    className="flex-1"
                                    value={link.url}
                                    onChange={e => setConnectLinks(prev => prev.map((l, i) => i === index ? { ...l, url: e.target.value } : l))}
                                    placeholder={
                                        link.platform === "whatsapp" ? "https://wa.me/62..." :
                                        link.platform === "mail" ? "mailto:..." :
                                        "https://..."
                                    }
                                />
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    className="text-red-500 hover:text-red-600 hover:bg-red-50 shrink-0"
                                    onClick={() => setDeleteLinkDialog({ open: true, type: "connect", index, title: `${platform.label} (${link.url || 'Link'})` })}
                                >
                                    <Trash2 className="size-4" />
                                </Button>
                            </div>
                        )
                    })}
                    <Button
                        variant="outline"
                        className="w-full border-dashed"
                        onClick={() => setConnectLinks(prev => [...prev, { id: Date.now(), platform: "instagram", url: "" }])}
                    >
                        <Plus className="size-4 mr-2" /> Tambah Link Sosial Media
                    </Button>
                </div>
            </SectionCard>

            <SectionCard title="Footer — Copyright" desc="Informasi hak cipta di bagian bawah footer.">
                <Field label="Copyright Text">
                    <Input defaultValue="© 2026 Benah Palembang. All rights reserved." />
                </Field>
            </SectionCard>

            {/* Confirmation Modal for Footer Links Delete */}
            <ConfirmActionDialog
                open={deleteLinkDialog.open}
                onOpenChange={(open) => setDeleteLinkDialog(prev => ({ ...prev, open }))}
                title={deleteLinkDialog.type === "explore" ? "Hapus Link Explore?" : "Hapus Link Sosial Media?"}
                description={`Apakah Anda yakin ingin menghapus "${deleteLinkDialog.title || 'link ini'}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus"
                cancelText="Batal"
                variant="destructive"
                onConfirm={confirmDeleteLink}
            />
        </div>
    )
}
