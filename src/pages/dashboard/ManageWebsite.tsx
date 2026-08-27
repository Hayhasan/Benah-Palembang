import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Save, Plus, Trash2, ChevronUp, ChevronDown, GripVertical, Users } from "lucide-react"
import { ImageUpload } from "@/components/dashboard/ImageUpload"
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
                <div className="flex overflow-x-auto hide-scrollbar gap-6 pb-px">
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

    const removeCarousel = (id: number) => {
        if (carousels.length <= 1) { toast.error("Minimal harus ada 1 carousel!"); return }
        setCarousels(prev => prev.filter(c => c.id !== id))
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

    const removeTeamMember = (id: number) => {
        setTeamMembers(prev => prev.filter(m => m.id !== id))
    }

    const updateTeamMember = (id: number, key: string, value: string) => {
        setTeamMembers(prev => prev.map(m => m.id === id ? { ...m, [key]: value } : m))
    }

    // CTA
    const [ctaTagline, setCtaTagline] = useState("Buka ruang kolaborasi")
    const [ctaJudul, setCtaJudul] = useState("Kota ini milik kita semua.")
    const [ctaDeskripsi, setCtaDeskripsi] = useState("Punya cerita, ide, atau ingin membuat sesuatu bersama? Kami ingin mendengarnya.")
    const [ctaUrl, setCtaUrl] = useState("/kolaborasi")

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
                                    <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeCarousel(item.id)}><Trash2 className="size-4" /></Button>
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
                            <Button variant="ghost" size="icon" className="h-8 w-8 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setJelajahiCards(prev => prev.filter((_, i) => i !== index))}><Trash2 className="size-4" /></Button>
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
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-red-500 hover:bg-red-50" onClick={() => {
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
                                        <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50 -mt-2 -mr-2" onClick={() => removeTeamMember(member.id)}>
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

    const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || [])
        files.forEach(file => {
            const url = URL.createObjectURL(file)
            setPartnerLogos(prev => [...prev, { id: Date.now() + Math.random(), name: file.name.replace(/\.[^/.]+$/, ""), url }])
        })
        e.target.value = ""
    }

    const removePartnerLogo = (id: number) => {
        setPartnerLogos(prev => prev.filter(l => l.id !== id))
    }

    // Partner Contents
    const [partnerContents, setPartnerContents] = useState([
        { id: 1, platform: "youtube", link: "https://youtube.com/watch?v=example1" },
        { id: 2, platform: "instagram", link: "https://instagram.com/reel/example" },
    ])
    const [newContentPlatform, setNewContentPlatform] = useState("youtube")
    const [newContentLink, setNewContentLink] = useState("")

    const addContent = () => {
        if (!newContentLink.trim()) return
        setPartnerContents(prev => [...prev, { id: Date.now(), platform: newContentPlatform, link: newContentLink }])
        setNewContentLink("")
    }

    const removeContent = (id: number) => {
        setPartnerContents(prev => prev.filter(c => c.id !== id))
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
                                <button onClick={() => removePartnerLogo(logo.id)} className="absolute -top-2 -right-2 size-5 rounded-full bg-red-500 text-white text-xs flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600">×</button>
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
                <div className="space-y-4">
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Konten Saat Ini</p>
                    {partnerContents.length === 0 && (
                        <p className="text-sm text-muted-foreground italic">Belum ada konten. Tambahkan konten pertama di bawah.</p>
                    )}
                    {partnerContents.map(content => (
                        <div key={content.id} className="flex items-center gap-3 rounded-lg border p-3 bg-muted/10">
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded ${
                                content.platform === "youtube" ? "bg-red-600 text-white" :
                                content.platform === "instagram" ? "bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white" :
                                content.platform === "tiktok" ? "bg-black text-white border border-white/20" :
                                content.platform === "facebook" ? "bg-blue-600 text-white" :
                                "bg-neutral-800 text-white"
                            }`}>{content.platform}</span>
                            <span className="flex-1 text-sm truncate text-muted-foreground">{content.link}</span>
                            <Button variant="ghost" size="icon" className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => removeContent(content.id)}>
                                <Trash2 className="size-4" />
                            </Button>
                        </div>
                    ))}

                    <div className="pt-2 border-t">
                        <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">Tambah Konten Baru</p>
                        <div className="flex items-center gap-3">
                            <select
                                value={newContentPlatform}
                                onChange={e => setNewContentPlatform(e.target.value)}
                                className="flex h-10 w-40 items-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                            >
                                <option value="youtube">YouTube</option>
                                <option value="instagram">Instagram</option>
                                <option value="tiktok">TikTok</option>
                                <option value="facebook">Facebook</option>
                                <option value="x">X (Twitter)</option>
                            </select>
                            <Input
                                value={newContentLink}
                                onChange={e => setNewContentLink(e.target.value)}
                                placeholder="Masukkan link video..."
                                className="flex-1"
                                onKeyDown={e => e.key === "Enter" && addContent()}
                            />
                            <Button onClick={addContent} className="bg-palembang-red text-white hover:bg-palembang-red/90">
                                <Plus className="size-4 mr-2" /> Add
                            </Button>
                        </div>
                    </div>
                </div>
            </SectionCard>
        </div>
    )
}

// ═══════════════════════════════════════════
// TAB: HEADER & FOOTER
// ═══════════════════════════════════════════
function HeaderFooterSettings() {
    const [logoUrl, setLogoUrl] = useState("")

    const [exploreLinks, setExploreLinks] = useState([
        { id: 1, nama: "Cerita Warga", url: "/cerita-warga" },
        { id: 2, nama: "Gaya Hidup", url: "/gaya-hidup" },
        { id: 3, nama: "Ruang Kota", url: "/ruang-kota" },
        { id: 4, nama: "Industri Kreatif", url: "/industri-kreatif" },
        { id: 5, nama: "Agenda", url: "/agenda" },
    ])

    const [connectLinks, setConnectLinks] = useState([
        { id: 1, nama: "Instagram", url: "https://instagram.com/benahpalembang" },
        { id: 2, nama: "TikTok", url: "#tiktok" },
        { id: 3, nama: "YouTube", url: "https://youtube.com/@benahpalembang" },
        { id: 4, nama: "LinkedIn", url: "#linkedin" },
    ])

    return (
        <div className="space-y-8">
            <SectionCard title="Logo & Header" desc="Konfigurasi logo dan link utama header.">
                <Field label="Logo Website (Upload)">
                    <ImageUpload value={logoUrl} onChange={setLogoUrl} placeholder="Pilih logo (PNG/SVG)..." />
                </Field>
                <Field label="URL Logo (Redirect Link)"><Input defaultValue="/" /></Field>
            </SectionCard>

            <SectionCard title="Footer — Explore" desc="Link navigasi pada kolom Explore footer.">
                <div className="space-y-4">
                    <Field label="Deskripsi Explore">
                        <Input placeholder="Deskripsi singkat untuk kolom explore footer..." />
                    </Field>
                    <div className="space-y-3">
                    {exploreLinks.map((link, index) => (
                        <div key={link.id} className="flex gap-2 items-center">
                            <Input className="flex-1" value={link.nama} onChange={e => setExploreLinks(prev => prev.map((l, i) => i === index ? { ...l, nama: e.target.value } : l))} placeholder="Nama" />
                            <Input className="flex-[2]" value={link.url} onChange={e => setExploreLinks(prev => prev.map((l, i) => i === index ? { ...l, url: e.target.value } : l))} placeholder="URL" />
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setExploreLinks(prev => prev.filter((_, i) => i !== index))}><Trash2 className="size-4" /></Button>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setExploreLinks(prev => [...prev, { id: Date.now(), nama: "", url: "" }])}><Plus className="size-4 mr-2" /> Tambah Link Explore</Button>
                    </div>
                </div>
            </SectionCard>

            <SectionCard title="Footer — Connect" desc="Link sosial media pada kolom Connect footer.">
                <div className="space-y-3">
                    {connectLinks.map((link, index) => (
                        <div key={link.id} className="flex gap-2 items-center">
                            <Input className="flex-1" value={link.nama} onChange={e => setConnectLinks(prev => prev.map((l, i) => i === index ? { ...l, nama: e.target.value } : l))} placeholder="Platform" />
                            <Input className="flex-[2]" value={link.url} onChange={e => setConnectLinks(prev => prev.map((l, i) => i === index ? { ...l, url: e.target.value } : l))} placeholder="URL" />
                            <Button variant="ghost" size="icon" className="text-red-500 hover:text-red-600 hover:bg-red-50" onClick={() => setConnectLinks(prev => prev.filter((_, i) => i !== index))}><Trash2 className="size-4" /></Button>
                        </div>
                    ))}
                    <Button variant="outline" className="w-full border-dashed" onClick={() => setConnectLinks(prev => [...prev, { id: Date.now(), nama: "", url: "" }])}><Plus className="size-4 mr-2" /> Tambah Link Connect</Button>
                </div>
            </SectionCard>

            <SectionCard title="Footer — Contact & Copyright" desc="Informasi kontak dan hak cipta di bagian bawah footer.">
                <div className="grid sm:grid-cols-2 gap-4">
                    <Field label="Email Kontak"><Input defaultValue="halo@benahpalembang.id" /></Field>
                    <Field label="Nomor HP / WhatsApp"><Input defaultValue="+62 711 123 456" /></Field>
                </div>
                <Field label="Alamat"><Input defaultValue="Palembang, Sumatera Selatan" /></Field>
                <Field label="Copyright"><Input defaultValue="© 2025 Benah Palembang" /></Field>
            </SectionCard>
        </div>
    )
}
