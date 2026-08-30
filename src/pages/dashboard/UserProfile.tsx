import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"
import { InternationalPhoneInput } from "@/components/dashboard/InternationalPhoneInput"
import { Save, X, Mail, Camera, Edit2, Heart, Eye as EyeIcon, ArrowLeft, MessageCircle, ChevronDown } from "lucide-react"
import { toast } from "sonner"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"

const DEFAULT_BANNER = "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop"
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=0"

const dummyGallery = [
    { id: 1, title: "Palembang di Balik Senja: Catatan dari Tepian Sungai Musi", image: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 1204, likes: 340, aspect: "aspect-[3/4]" },
    { id: 2, title: "Lorong Basah dan Kulinernya: Cerita Dapur Tua Pasar 16 Ilir", image: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 3400, likes: 890, aspect: "aspect-[4/5]" },
    { id: 3, title: "Pusat Kebudayaan Sriwijaya: Menggali Artefak Kejayaan Maritim", image: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 980, likes: 210, aspect: "aspect-[1/1]" },
    { id: 4, title: "Songket Pusaka: Tenun Benang Emas Warisan Para Ratu", image: "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 2150, likes: 540, aspect: "aspect-[3/5]" },
    { id: 5, title: "Kopi Semendo dan Aroma Pagi di Kedai Kuno", image: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 1890, likes: 430, aspect: "aspect-[4/3]" },
    { id: 6, title: "Mural Lorong Seni: Menghidupkan Sudut Kota Palembang", image: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 2780, likes: 670, aspect: "aspect-[5/4]" },
    { id: 7, title: "Revitalisasi Tepian Sekanak Lambidaro Jadi Ruang Temu", image: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 2100, likes: 450, aspect: "aspect-[3/4]" },
    { id: 8, title: "Misteri Terowongan Bawah Tanah Benteng Kuto Besak", image: "https://images.pexels.com/photos/2088210/pexels-photo-2088210.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 4800, likes: 1100, aspect: "aspect-[4/5]" },
    { id: 9, title: "Eksistensi Pempek Kulit dan Rahasia Kuah Cuko Kental", image: "https://images.pexels.com/photos/2097090/pexels-photo-2097090.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 5100, likes: 1400, aspect: "aspect-[1/1]" },
    { id: 10, title: "Arsitektur Rumah Limas: Filosofi Tingkat Kehidupan", image: "https://images.pexels.com/photos/1029599/pexels-photo-1029599.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 1500, likes: 310, aspect: "aspect-[3/5]" },
    { id: 11, title: "Menjaga Habitat Ikan Belida di Aliran Batanghari Sembilan", image: "https://images.pexels.com/photos/1684187/pexels-photo-1684187.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 1800, likes: 410, aspect: "aspect-[4/3]" },
    { id: 12, title: "Kelezatan Manis Legit Kue Maksuba di Hari Raya", image: "https://images.pexels.com/photos/1126359/pexels-photo-1126359.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 2300, likes: 520, aspect: "aspect-[5/4]" },
    { id: 13, title: "Harmoni Tionghoa-Islam di Masjid Cheng Ho Jakabaring", image: "https://images.pexels.com/photos/2166553/pexels-photo-2166553.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 3600, likes: 810, aspect: "aspect-[3/4]" },
    { id: 14, title: "Meniti Kenangan di Gelagar Megah Jembatan Ampera", image: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 6200, likes: 1800, aspect: "aspect-[4/5]" },
    { id: 15, title: "Geliat Perahu Ketek Menembus Gelombang Senja Musi", image: "https://images.pexels.com/photos/2166559/pexels-photo-2166559.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 4200, likes: 950, aspect: "aspect-[1/1]" },
    { id: 16, title: "Aroma Khas Sambal Tempoyak Durian Dapur Tradisional", image: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=600&fit=crop", views: 4000, likes: 920, aspect: "aspect-[3/5]" },
]

export function UserProfile() {
    const { id } = useParams()
    const navigate = useNavigate()
    const [searchParams, setSearchParams] = useSearchParams()
    const [showAllGallery, setShowAllGallery] = useState(false)
    const { setIsDirty, registerSaveHandler, requestNavigation } = useUnsavedChanges()

    const isViewMode = searchParams.get("mode") === "view"
    
    const [name, setName] = useState("Loading...")
    const [email, setEmail] = useState("")
    const [role, setRole] = useState("")
    const [avatarUrl, setAvatarUrl] = useState("")
    const [bannerUrl, setBannerUrl] = useState(DEFAULT_BANNER)
    const [bio, setBio] = useState("")
    const [igUrl, setIgUrl] = useState("https://instagram.com/user")
    const [twUrl, setTwUrl] = useState("https://twitter.com/user")
    const [liUrl, setLiUrl] = useState("https://linkedin.com/in/user")
    const [waPhone, setWaPhone] = useState("628123456789")

    const bannerInputRef = useRef<HTMLInputElement>(null)
    const avatarInputRef = useRef<HTMLInputElement>(null)

    useEffect(() => {
        if (id) {
            setName(id.includes("ADM") ? "Dina Kirana" : "Budi Hartono")
            setEmail(id.includes("ADM") ? "dina@example.com" : "budi@example.com")
            setRole(id.includes("ADM") ? "Admin" : "User")
            setAvatarUrl(id.includes("ADM") ? "https://i.pravatar.cc/150?img=9" : "https://i.pravatar.cc/150?img=11")
            setBio("Pengguna aktif di platform Benah Palembang. Tertarik dengan cerita-cerita kota dan kebudayaan lokal.")
        }
        setIsDirty(false)
    }, [id, setIsDirty])

    const handleFieldChange = () => {
        if (!isViewMode) {
            setIsDirty(true)
        }
    }

    const handleSave = () => {
        setIsDirty(false)
        toast.success(`Data pengguna ${name} berhasil disimpan!`)
        navigate(-1)
    }

    const handleCancel = () => {
        setIsDirty(false)
        navigate(-1)
    }

    useEffect(() => {
        if (!isViewMode) {
            registerSaveHandler(() => {
                setIsDirty(false)
                toast.success(`Data pengguna ${name} berhasil disimpan!`)
                return true
            })
        } else {
            registerSaveHandler(null)
            setIsDirty(false)
        }
        return () => {
            registerSaveHandler(null)
            setIsDirty(false)
        }
    }, [isViewMode, name, registerSaveHandler, setIsDirty])

    const handleSendResetPassword = () => {
        toast.success(`Email instruksi reset password berhasil dikirim ke ${email}`)
    }

    const handleBannerChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setBannerUrl(URL.createObjectURL(file))
            handleFieldChange()
        }
    }

    const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) {
            setAvatarUrl(URL.createObjectURL(file))
            handleFieldChange()
        }
    }

    // ─── VIEW MODE ───
    if (isViewMode) {
        return (
            <div className="space-y-8 pb-10">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b">
                    <div>
                        <h2 className="text-3xl font-bold tracking-tight">Profil {name} (Lihat Data)</h2>
                        <p className="text-muted-foreground">Detail informasi profil pengguna {id} (hanya-baca).</p>
                    </div>
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => requestNavigation(id?.includes("ADM") ? '/dashboard/account/admin' : '/dashboard/account/user')}>
                            <ArrowLeft className="size-4 mr-2" /> Kembali
                        </Button>
                        <Button onClick={() => setSearchParams({ mode: "edit" })} className="bg-palembang-red text-white hover:bg-palembang-red/90">
                            <Edit2 className="size-4 mr-2" /> Edit Profil
                        </Button>
                    </div>
                </div>

                <div className="relative rounded-2xl overflow-hidden border-none shadow-sm bg-palembang-charcoal text-white">
                    <div className="h-48 md:h-64 w-full">
                        <img src={bannerUrl || DEFAULT_BANNER} alt="Cover" className="w-full h-full object-cover" />
                    </div>
                    <div className="px-6 sm:px-10 pb-8">
                        <div className="relative flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
                            <img src={avatarUrl || DEFAULT_AVATAR} alt="Avatar" className="size-24 sm:size-32 rounded-full border-4 border-palembang-charcoal object-cover bg-white shadow-sm" />
                            <div className="flex gap-3">
                                {waPhone && (
                                    <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4 bg-palembang-red text-white hover:bg-palembang-red/90 hidden sm:flex">
                                        <MessageCircle className="mr-2 size-4" /> Hubungi
                                    </a>
                                )}
                            </div>
                        </div>
                        <h1 className="text-2xl sm:text-3xl font-display font-bold">{name}</h1>
                        <p className="text-palembang-red font-semibold uppercase tracking-wider text-xs mt-1">{role}</p>
                        <p className="text-sm text-white/70 mt-1">{email}</p>
                        <p className="mt-4 text-white/80 max-w-2xl text-sm leading-relaxed whitespace-pre-line">{bio}</p>
                        
                        <div className="flex gap-4 mt-6">
                            {igUrl && (
                                <a href={igUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full text-white/70 hover:text-pink-500 hover:bg-white/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                                </a>
                            )}
                            {twUrl && (
                                <a href={twUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                                </a>
                            )}
                            {liUrl && (
                                <a href={liUrl} target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full text-white/70 hover:text-blue-400 hover:bg-white/20 transition-colors">
                                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                                </a>
                            )}
                            {waPhone && (
                                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full text-white/70 hover:text-green-500 hover:bg-white/20 transition-colors sm:hidden">
                                    <MessageCircle className="size-5" />
                                </a>
                            )}
                        </div>
                    </div>
                </div>

                {/* Gallery Section — 2 Columns Pinterest Masonry */}
                <div>
                    <div className="flex items-center justify-between border-b pb-2 mb-6">
                        <h3 className="text-xl font-bold font-display">Galeri Publikasi</h3>
                        <span className="text-xs text-muted-foreground">Klik artikel untuk melihat pratinjau publik</span>
                    </div>
                    <div className="relative">
                        <div className="columns-2 lg:columns-4 gap-4 sm:gap-6">
                            {(showAllGallery ? dummyGallery : dummyGallery.slice(0, 12)).map(article => (
                                <div 
                                    key={article.id} 
                                    onClick={() => navigate(`/dashboard/article/preview/${article.id}`)}
                                    className="break-inside-avoid mb-4 sm:mb-6 group rounded-2xl border bg-background overflow-hidden shadow-sm hover:shadow-md hover:border-palembang-red/40 transition-all cursor-pointer"
                                >
                                    <div className={`${article.aspect} overflow-hidden relative`}>
                                        <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-[2px]">
                                            <span className="bg-white/95 text-palembang-charcoal font-bold text-xs px-3.5 py-1.5 rounded-full shadow-lg">
                                                Lihat Pratinjau
                                            </span>
                                        </div>
                                    </div>
                                    <div className="p-3.5 sm:p-4">
                                        <h4 className="font-bold font-display text-sm sm:text-base leading-snug mb-2 sm:mb-3 group-hover:text-palembang-red transition-colors line-clamp-2">{article.title}</h4>
                                        <div className="flex items-center gap-3 text-xs text-muted-foreground font-medium">
                                            <span className="flex items-center gap-1.5"><EyeIcon className="size-3.5" /> {article.views.toLocaleString()}</span>
                                            <span className="flex items-center gap-1.5"><Heart className="size-3.5 text-palembang-red" /> {article.likes.toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                        
                        {dummyGallery.length > 12 && !showAllGallery && (
                            <div className="absolute inset-x-0 -bottom-4 flex h-48 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-6 backdrop-blur-[2px]">
                                <button
                                    onClick={() => setShowAllGallery(true)}
                                    className="group flex items-center gap-2 rounded-full border border-border bg-background px-7 py-3 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red"
                                >
                                    See More <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        )
    }


    // ─── EDIT MODE ───
    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Edit Data Pengguna</h2>
                    <p className="text-muted-foreground">Mengubah informasi dan setelan untuk {id}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={handleCancel}>
                        <X className="size-4 mr-2" /> Batal
                    </Button>
                    <Button onClick={handleSave} className="bg-palembang-red text-white hover:bg-palembang-red/90">
                        <Save className="size-4 mr-2" /> Simpan Perubahan
                    </Button>
                </div>
            </div>

            <div className="relative rounded-2xl overflow-hidden border shadow-sm bg-palembang-charcoal text-white border-none">
                <div className="h-48 md:h-64 w-full relative group/banner">
                    <img src={bannerUrl || DEFAULT_BANNER} alt="Cover" className="w-full h-full object-cover" />
                    <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/banner:opacity-100 transition-opacity">
                        <button onClick={() => bannerInputRef.current?.click()} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium transition-colors">
                            <Camera className="size-5" /> Ubah Banner
                        </button>
                        <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleBannerChange} className="hidden" />
                    </div>
                </div>
                
                <div className="px-6 sm:px-10 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
                        <div className="relative group/avatar">
                            <img src={avatarUrl || DEFAULT_AVATAR} alt="Avatar" className="size-24 sm:size-32 rounded-full border-4 border-white object-cover bg-white shadow-sm" />
                            <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                                <Camera className="size-8 text-white" />
                                <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />
                            </div>
                        </div>
                    </div>
                    
                    <div className="space-y-5 mt-6">
                        <h3 className="font-semibold text-lg border-b border-white/20 pb-2">Informasi Profil</h3>
                        <div className="grid sm:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Nama Lengkap</label>
                                <Input value={name} onChange={(e) => { setName(e.target.value); handleFieldChange(); }} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Email Terdaftar</label>
                                <Input value={email} disabled type="email" className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Role Pengguna</label>
                                <select 
                                    value={role.toLowerCase()} 
                                    onChange={e => { setRole(e.target.value); handleFieldChange(); }}
                                    className="flex h-10 w-full items-center justify-between rounded-md border border-white/20 bg-palembang-charcoal text-white px-3 py-2 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-white/30"
                                >
                                    <option value="user">User</option>
                                    <option value="admin">Admin</option>
                                    <option value="superadmin">SuperAdmin</option>
                                </select>
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">WhatsApp Number</label>
                                <InternationalPhoneInput 
                                    value={waPhone} 
                                    darkVariant={true}
                                    onChange={(val) => { 
                                        setWaPhone(val); 
                                        handleFieldChange(); 
                                    }} 
                                    placeholder="812 3456 7890" 
                                />
                            </div>

                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Instagram URL</label>
                                <Input value={igUrl} onChange={(e) => { setIgUrl(e.target.value); handleFieldChange(); }} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">Twitter/X URL</label>
                                <Input value={twUrl} onChange={(e) => { setTwUrl(e.target.value); handleFieldChange(); }} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30" />
                            </div>
                            <div className="space-y-2">
                                <label className="text-sm font-medium text-white/80">LinkedIn URL</label>
                                <Input value={liUrl} onChange={(e) => { setLiUrl(e.target.value); handleFieldChange(); }} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30" />
                            </div>
                            <div className="space-y-2 sm:col-span-2">
                                <label className="text-sm font-medium text-white/80">Bio / Deskripsi Singkat</label>
                                <textarea 
                                    value={bio} onChange={(e) => { setBio(e.target.value); handleFieldChange(); }}
                                    className="w-full min-h-[80px] rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white placeholder:text-white/50 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-white/30"
                                />
                            </div>
                            <div className="space-y-2 sm:col-span-2 pt-2">
                                <Button size="sm" onClick={handleSendResetPassword} className="w-fit h-10 px-4 bg-palembang-red text-white hover:bg-red-700 font-semibold border-none">
                                    <Mail className="size-4 mr-2" /> Kirim Email Reset Password
                                </Button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

