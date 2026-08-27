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
import { ArticlePreview } from "@/features/dashboard/ArticlePreview"
import { toast } from "sonner"
import { Save, Send, Trash2, Eye } from "lucide-react"

const mockArticleDatabase: Record<string, {
    title: string
    description: string
    category: string
    tags: string[]
    bannerUrl: string
    content: string
}> = {
    "1": {
        title: "Menyusuri Jejak Trem di Palembang",
        description: "Sejarah transportasi publik yang pernah berjaya di masa Hindia Belanda dan bagaimana jejaknya membentuk tata kota saat ini.",
        category: "Ruang Kota",
        tags: ["sejarah", "transportasi", "palembang", "heritage"],
        bannerUrl: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
        content: "<p>Palembang pernah memiliki sistem transportasi trem uap yang melintasi pusat kota pada era Hindia Belanda. Menghubungkan pelabuhan Boom Baru hingga ke area pemukiman warga di seberang Ilir.</p><p>Jejak-jejak peninggalan ini kini menjadi bagian dari cagar budaya kota yang menarik untuk ditelusuri kembali.</p>",
    },
    "2": {
        title: "Resep Pindang Patin Warisan Karuhun",
        description: "Rahasia bumbu rahasia dari dapur nenek moyang wong kito galo yang telah diwariskan turun-temurun lintas generasi.",
        category: "Gaya Hidup",
        tags: ["kuliner", "pindang", "tradisional", "resep"],
        bannerUrl: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop",
        content: "<p>Pindang patin adalah salah satu ikon kuliner Palembang yang tak pernah lekang oleh waktu. Kuahnya yang segar dengan perpaduan rasa asam nanas, pedas cabai burung, dan aroma kemangi menjadikannya primadona meja makan keluarga.</p>",
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
export function CreateArticleEditor() {
    const [searchParams] = useSearchParams()

    if (searchParams.get("mode") === "view") {
        return <ArticlePreview />
    }

    return <CreateArticleEditorForm />
}

function CreateArticleEditorForm() {
    const [searchParams] = useSearchParams()
    const navigate = useNavigate()
    const { setIsDirty, registerSaveHandler } = useUnsavedChanges()

    const editId = searchParams.get("id")
    const isViewMode = searchParams.get("mode") === "view"
    const isEditing = !!editId && !isViewMode

    // Form state
    const [bannerUrl, setBannerUrl] = useState("")
    const [title, setTitle] = useState("")
    const [description, setDescription] = useState("")
    const [category, setCategory] = useState("Cerita Warga")
    const [tags, setTags] = useState<string[]>(["Palembang", "Budaya"])
    const [content, setContent] = useState("")
    const [deleteModalOpen, setDeleteModalOpen] = useState(false)

    // Load existing article data if editing or viewing
    useEffect(() => {
        if (editId && mockArticleDatabase[editId]) {
            const data = mockArticleDatabase[editId]
            setTitle(data.title)
            setDescription(data.description)
            setCategory(data.category)
            setTags(data.tags)
            setBannerUrl(data.bannerUrl)
            setContent(data.content)
        } else if (editId) {
            setTitle("Artikel Contoh " + editId)
            setDescription("Ringkasan artikel nomor " + editId)
            setCategory("Cerita Warga")
            setTags(["cerita", "warga"])
            setBannerUrl("https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=800&h=400&fit=crop")
            setContent("<p>Konten artikel yang sedang diedit di sini.</p>")
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
        const previewArticle = {
            id: editId || "new",
            slug: editId ? `artikel-${editId}` : "pratinjau-artikel",
            title: title || "Judul Artikel Anda",
            excerpt: description || "Ringkasan artikel...",
            category: category || "Cerita Warga",
            tags: tags.length > 0 ? tags : ["Palembang", "Budaya"],
            coverImage: bannerUrl || "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
            content: content || "<p>Belum ada isi konten artikel...</p>",
            author: {
                id: "1",
                name: "Budi Hartono (Anda)",
                role: "Penulis & Kontributor",
                avatar: "https://i.pravatar.cc/150?img=11",
                bio: "Penulis dan kontributor Benah Palembang.",
            },
            publishedAt: "Hari ini",
            readingTime: 4,
            views: 0,
            likes: 0,
            featured: false,
        }
        navigate(`/dashboard/article/preview/${editId || 'new'}`, {
            state: {
                article: previewArticle,
                returnUrl: editId ? `/dashboard/create-article/new?id=${editId}&mode=edit` : `/dashboard/create-article/new`
            }
        })
    }

    const handleSaveDraft = () => {
        setIsDirty(false)
        toast.success("Draf berhasil disimpan!")
    }

    const handlePublish = () => {
        if (!title || !content) {
            toast.error("Judul dan isi konten tidak boleh kosong")
            return
        }
        setIsDirty(false)
        toast.success("Artikel berhasil dipublikasikan!")
        navigate('/dashboard/create-article')
    }

    const handleSaveEdit = () => {
        if (!title || !content) {
            toast.error("Judul dan isi konten tidak boleh kosong")
            return
        }
        setIsDirty(false)
        toast.success("Perubahan artikel berhasil disimpan!")
        navigate('/dashboard/create-article')
    }

    // Register auto-save handler for unsaved changes prompt
    useEffect(() => {
        registerSaveHandler(() => {
            if (!title || !content) {
                toast.error("Judul dan isi konten harus diisi untuk menyimpan!")
                return false
            }
            if (isEditing) {
                toast.success("Perubahan artikel berhasil disimpan!")
            } else {
                toast.success("Draf artikel berhasil disimpan!")
            }
            setIsDirty(false)
            return true
        })
        return () => {
            registerSaveHandler(null)
            setIsDirty(false)
        }
    }, [title, content, isEditing, registerSaveHandler, setIsDirty])

    const handleDelete = () => {
        setIsDirty(false)
        toast.error("Artikel berhasil dihapus!")
        navigate('/dashboard/create-article')
    }

    return (
        <div className="space-y-8 pb-10">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-background/80 backdrop-blur-md z-10 py-4 border-b">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">
                        {isEditing ? "Edit Artikel" : "Tulis Artikel Baru"}
                    </h2>
                    <p className="text-muted-foreground">
                        Bagikan cerita dan gagasan Anda ke warga Palembang.
                    </p>
                </div>
                <div className="flex items-center gap-3">
                    {isEditing ? (
                        <>
                            <Button onClick={() => setDeleteModalOpen(true)} variant="outline" className="gap-2 text-red-600 border-red-200 hover:bg-red-50">
                                <Trash2 className="size-4" /> Delete Artikel
                            </Button>
                            {/* Preview Button placed between Delete and Save */}
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={handlePreview} 
                                className="gap-2 text-foreground hover:bg-muted"
                            >
                                <Eye className="size-4" /> Preview
                            </Button>
                            <Button onClick={handleSaveEdit} className="bg-palembang-red text-white hover:bg-palembang-red/90 gap-2">
                                <Save className="size-4" /> Save Artikel
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button onClick={handleSaveDraft} variant="outline" className="gap-2">
                                <Save className="size-4" /> Simpan Draf
                            </Button>
                            {/* Preview Button placed between Simpan Draf and Terbitkan */}
                            <Button 
                                type="button"
                                variant="outline" 
                                onClick={handlePreview} 
                                className="gap-2 text-foreground hover:bg-muted"
                            >
                                <Eye className="size-4" /> Preview
                            </Button>
                            <Button onClick={handlePublish} className="bg-palembang-red text-white hover:bg-palembang-red/90 gap-2">
                                <Send className="size-4" /> Terbitkan Artikel
                            </Button>
                        </>
                    )}
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-6">
                {/* Kolom Kiri: Form Judul & Tiptap Rich Text Editor */}
                <div className="lg:col-span-3 space-y-6">
                    <div className="space-y-4 bg-background p-5 rounded-xl border shadow-sm">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Judul Artikel</label>
                            <Input 
                                disabled={isViewMode}
                                placeholder="Masukkan judul artikel yang menarik..." 
                                value={title}
                                onChange={(e) => {
                                    setTitle(e.target.value)
                                    handleFieldChange()
                                }}
                                className="text-lg font-semibold"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Ringkasan / Excerpt Singkat</label>
                            <textarea 
                                disabled={isViewMode}
                                value={description}
                                onChange={(e) => {
                                    setDescription(e.target.value)
                                    handleFieldChange()
                                }}
                                className="w-full min-h-[80px] rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-75 disabled:bg-muted/20"
                                placeholder="Tuliskan 1-2 kalimat pengantar artikel yang memikat pembaca..."
                            />
                        </div>
                    </div>
                    
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Konten Lengkap</label>
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

                {/* Kolom Kanan: Meta, Kategori, Banner, Tags */}
                <div className="lg:col-span-1 space-y-6">
                    <div className="rounded-xl border bg-background shadow-sm overflow-hidden p-5 space-y-5">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">Banner Utama Artikel</label>
                            <ImageUpload 
                                disabled={isViewMode}
                                value={bannerUrl} 
                                onChange={(url) => {
                                    setBannerUrl(url)
                                    handleFieldChange()
                                }} 
                                placeholder="Pilih atau upload gambar..." 
                            />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">Kategori</label>
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
                                <option value="Cerita Warga">Cerita Warga</option>
                                <option value="Gaya Hidup">Gaya Hidup</option>
                                <option value="Ruang Kota">Ruang Kota</option>
                                <option value="Industri Kreatif">Industri Kreatif</option>
                                <option value="Kebudayaan">Kebudayaan</option>
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
                title="Konfirmasi Hapus Artikel"
                description={`Apakah Anda yakin ingin menghapus artikel "${title || 'ini'}"? Tindakan ini tidak dapat dibatalkan.`}
                confirmText="Ya, Hapus Artikel"
                variant="destructive"
                onConfirm={handleDelete}
            />
        </div>
    )
}