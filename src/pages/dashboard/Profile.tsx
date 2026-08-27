import { useState, useRef, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useAuth } from "@/context/AuthContext"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"
import { InternationalPhoneInput } from "@/components/dashboard/InternationalPhoneInput"
import { Edit2, MessageCircle, Heart, Eye, Save, X, Camera } from "lucide-react"
import { toast } from "sonner"

const dummyGallery = [
    { id: 1, title: "Palembang di Balik Senja", image: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", views: 1204, likes: 340 },
    { id: 2, title: "Lorong Basah dan Kulinernya", image: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", views: 3400, likes: 890 },
    { id: 3, title: "Pusat Kebudayaan Sriwijaya", image: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop", views: 980, likes: 210 },
]

export function Profile() {
    const navigate = useNavigate()
    const { user } = useAuth()
    const { setIsDirty, registerSaveHandler } = useUnsavedChanges()
    const [isEditing, setIsEditing] = useState(false)
    
    // State form
    const [bannerUrl, setBannerUrl] = useState("https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop")
    const [avatarUrl, setAvatarUrl] = useState(user?.role === 'superadmin' ? 'https://i.pravatar.cc/150?img=33' : 'https://i.pravatar.cc/150?img=11')
    const [name, setName] = useState(user?.name || "")
    const [bio, setBio] = useState("Penulis dan kreator konten yang berfokus pada kebudayaan dan ruang kota Palembang. Tertarik pada hal-hal kecil yang sering terlewatkan dari hiruk-pikuk kota besar. Mari berkolaborasi untuk Palembang yang lebih baik.")
    const [igUrl, setIgUrl] = useState("https://instagram.com/user")
    const [twUrl, setTwUrl] = useState("https://twitter.com/user")
    const [liUrl, setLiUrl] = useState("https://linkedin.com/in/user")
    const [waPhone, setWaPhone] = useState("628123456789")

    const bannerInputRef = useRef<HTMLInputElement>(null)
    const avatarInputRef = useRef<HTMLInputElement>(null)

    const handleFieldChange = () => {
        if (isEditing) {
            setIsDirty(true)
        }
    }

    const handleSave = () => {
        setIsDirty(false)
        setIsEditing(false)
        toast.success("Profil berhasil diperbarui!")
    }

    const handleCancel = () => {
        setIsDirty(false)
        setIsEditing(false)
    }

    useEffect(() => {
        if (isEditing) {
            registerSaveHandler(() => {
                setIsDirty(false)
                setIsEditing(false)
                toast.success("Profil berhasil diperbarui!")
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
    }, [isEditing, registerSaveHandler, setIsDirty])

    if (!user) return null

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

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Profil & Pengaturan</h2>
                    <p className="text-muted-foreground">Kelola informasi publik dan data personal Anda.</p>
                </div>
                <div className="flex gap-2">
                    {isEditing ? (
                        <>
                            <Button variant="outline" onClick={handleCancel}>
                                <X className="size-4 mr-2" /> Batal Edit
                            </Button>
                            <Button onClick={handleSave} className="bg-palembang-red text-white hover:bg-palembang-red/90">
                                <Save className="size-4 mr-2" /> Simpan Profil
                            </Button>
                        </>
                    ) : (
                        <Button onClick={() => setIsEditing(true)} className="bg-palembang-charcoal text-white hover:bg-palembang-charcoal/90">
                            <Edit2 className="size-4 mr-2" /> Edit Profil
                        </Button>
                    )}
                </div>
            </div>

            {/* Banner & Avatar Section */}
            <div className="relative rounded-2xl overflow-hidden border-none shadow-sm bg-palembang-charcoal text-white">
                <div className="h-48 md:h-64 w-full relative group/banner">
                    <img src={bannerUrl} alt="Cover" className="w-full h-full object-cover" />
                    {isEditing && (
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover/banner:opacity-100 transition-opacity">
                            <button onClick={() => bannerInputRef.current?.click()} className="flex items-center gap-2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white px-4 py-2 rounded-full font-medium transition-colors">
                                <Camera className="size-5" /> Ubah Banner
                            </button>
                            <input type="file" accept="image/*" ref={bannerInputRef} onChange={handleBannerChange} className="hidden" />
                        </div>
                    )}
                </div>
                
                <div className="px-6 sm:px-10 pb-8">
                    <div className="relative flex justify-between items-end -mt-12 sm:-mt-16 mb-4">
                        <div className="relative group/avatar">
                            <img src={avatarUrl} alt="Avatar" className="size-24 sm:size-32 rounded-full border-4 border-white object-cover bg-white shadow-sm" />
                            {isEditing && (
                                <div className="absolute inset-0 rounded-full bg-black/40 flex items-center justify-center opacity-0 group-hover/avatar:opacity-100 transition-opacity cursor-pointer" onClick={() => avatarInputRef.current?.click()}>
                                    <Camera className="size-8 text-white" />
                                    <input type="file" accept="image/*" ref={avatarInputRef} onChange={handleAvatarChange} className="hidden" />
                                </div>
                            )}
                        </div>
                        <div className="flex gap-3">
                            {!isEditing && waPhone && (
                                <a href={`https://wa.me/${waPhone}`} target="_blank" rel="noreferrer" className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background h-10 py-2 px-4 bg-palembang-red text-white hover:bg-palembang-red/90 hidden sm:flex">
                                    <MessageCircle className="mr-2 size-4" /> Hubungi
                                </a>
                            )}
                        </div>
                    </div>
                    
                    {isEditing ? (
                        <div className="space-y-5 animate-in fade-in slide-in-from-bottom-2 duration-300 mt-6">
                            <h3 className="font-semibold text-lg border-b border-white/20 pb-2">Edit Profil</h3>
                            <div className="grid sm:grid-cols-2 gap-4">
                                <div className="space-y-2 sm:col-span-1">
                                    <label className="text-sm font-medium text-white/80">Nama Lengkap</label>
                                    <Input value={name} onChange={(e) => { setName(e.target.value); handleFieldChange(); }} className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus-visible:ring-white/30" />
                                </div>
                                <div className="space-y-2 sm:col-span-1">
                                    <label className="text-sm font-medium text-white/80">Email</label>
                                    <Input value={user.email} disabled className="bg-white/5 border-white/10 text-white/50 cursor-not-allowed" />
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
                                <div className="space-y-2 sm:col-span-2 pt-4 border-t border-white/10">
                                    <Button onClick={() => toast.success("Email reset password telah dikirim.")} className="w-fit h-10 px-4 bg-palembang-red text-white hover:bg-palembang-red/90 font-semibold border-none">
                                        Kirim Email Reset Password
                                    </Button>
                                </div>
                            </div>
                        </div>
                    ) : (
                        <div className="animate-in fade-in duration-300">
                            <h1 className="text-2xl sm:text-3xl font-display font-bold">{name}</h1>
                            <p className="text-palembang-red font-semibold uppercase tracking-wider text-xs mt-1">{user.role}</p>
                            <p className="mt-4 text-muted-foreground max-w-2xl text-sm leading-relaxed whitespace-pre-line">
                                {bio}
                            </p>
                            
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
                    )}
                </div>
            </div>

            {/* Gallery Section */}
            <div>
                <div className="flex items-center justify-between border-b pb-2 mb-6">
                    <h3 className="text-xl font-bold font-display">Galeri Artikel</h3>
                    <span className="text-xs text-muted-foreground">Klik artikel untuk melihat pratinjau publik</span>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {dummyGallery.map(article => (
                        <div 
                            key={article.id} 
                            onClick={() => navigate(`/dashboard/article/preview/${article.id}`)}
                            className="group rounded-xl border bg-background overflow-hidden shadow-sm hover:shadow-md hover:border-palembang-red/40 transition-all cursor-pointer"
                        >
                            <div className="aspect-[4/3] overflow-hidden relative">
                                <img src={article.image} alt={article.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                <div className="absolute inset-0 bg-black/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                    <span className="bg-white/90 text-palembang-charcoal font-semibold text-xs px-3 py-1.5 rounded-full shadow-md">
                                        Lihat Pratinjau
                                    </span>
                                </div>
                            </div>
                            <div className="p-4">
                                <h4 className="font-bold font-display text-lg leading-tight mb-3 group-hover:text-palembang-red transition-colors">{article.title}</h4>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground font-medium">
                                    <span className="flex items-center gap-1.5"><Eye className="size-3.5" /> {article.views.toLocaleString()}</span>
                                    <span className="flex items-center gap-1.5"><Heart className="size-3.5 text-palembang-red" /> {article.likes.toLocaleString()}</span>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

