import { useState } from "react"
import { useParams, useNavigate, useSearchParams, useLocation } from "react-router-dom"
import { articles, authors, type Article } from "@/data/mockData"
import { Button } from "@/components/ui/button"
import { 
  ArrowLeft, Edit2, Heart, Share2, Copy, Check, 
  Clock3, Eye
} from "lucide-react"
import { toast } from "sonner"

const fallbackArticles: Record<string, Article> = {
  "1": {
    id: "1",
    slug: "menyusuri-jejak-trem-di-palembang",
    title: "Menyusuri Jejak Trem di Palembang",
    excerpt: "Sejarah transportasi publik yang pernah berjaya di masa Hindia Belanda dan bagaimana jejaknya membentuk tata kota saat ini.",
    content: `
      <p>Palembang pernah memiliki sistem transportasi trem uap yang melintasi pusat kota pada era Hindia Belanda. Menghubungkan pelabuhan Boom Baru hingga ke area pemukiman warga di seberang Ilir.</p>
      <h2>Sejarah Jalur dan Arsitektur</h2>
      <p>Jejak-jejak peninggalan ini kini menjadi bagian dari cagar budaya kota yang menarik untuk ditelusuri kembali. Rel yang sempat tertimbun aspal kini mulai digali kembali oleh para pegiat sejarah lokal untuk mendokumentasikan rute aslinya.</p>
      <blockquote>"Masa lalu sebuah kota bukan sekadar memori, melainkan pondasi dari bagaimana warga bergerak dan bernafas hari ini."</blockquote>
      <p>Melalui riset arsip dan wawancara dengan para sesepuh kota di kawasan Sekanak dan Pasar 16 Ilir, terungkap betapa dinamisnya mobilitas masyarakat Palembang tempo dulu yang sangat mengandalkan interkoneksi air dan darat.</p>
    `,
    category: "Ruang Kota",
    coverImage: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    author: authors[0] || {
      id: "1",
      name: "Budi Hartono",
      role: "Penulis & Kontributor",
      avatar: "https://i.pravatar.cc/150?img=11",
      bio: "Pecinta sejarah dan ruang kota Palembang.",
    },
    publishedAt: "25 Agustus 2026",
    readingTime: 5,
    views: 1204,
    likes: 340,
    featured: true,
    tags: ["Sejarah", "RuangKota", "Palembang", "Heritage", "Transportasi"],
  },
  "2": {
    id: "2",
    slug: "resep-pindang-patin-warisan-karuhun",
    title: "Resep Pindang Patin Warisan Karuhun",
    excerpt: "Rahasia bumbu rahasia dari dapur nenek moyang wong kito galo yang telah diwariskan turun-temurun lintas generasi.",
    content: `
      <p>Pindang patin adalah salah satu ikon kuliner Palembang yang tak pernah lekang oleh waktu. Kuahnya yang segar dengan perpaduan rasa asam nanas, pedas cabai burung, dan aroma kemangi menjadikannya primadona meja makan keluarga.</p>
      <h2>Kunci Kesegaran Kuah Tradisional</h2>
      <p>Bumbu yang dibakar terlebih dahulu sebelum dihaluskan memberikan aroma smoky yang khas. Penggunaan nanas manis khas Ogan Komering Ilir memberikan keasaman alami yang tidak menyengat di lidah.</p>
      <p>Kini resep-resep klasik ini tetap dipertahankan oleh generasi penerus di berbagai warung makan legendaris di sepanjang tepian Sungai Musi.</p>
    `,
    category: "Gaya Hidup",
    coverImage: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    author: authors[1] || {
      id: "2",
      name: "Siti Aminah",
      role: "Food Explorer",
      avatar: "https://i.pravatar.cc/150?img=5",
      bio: "Menjelajahi kuliner nusantara dan tradisi Palembang.",
    },
    publishedAt: "24 Agustus 2026",
    readingTime: 4,
    views: 3400,
    likes: 890,
    featured: false,
    tags: ["Kuliner", "Pindang", "Tradisional", "GayaHidup", "Resep"],
  },
  "3": {
    id: "3",
    slug: "pusat-kebudayaan-sriwijaya",
    title: "Pusat Kebudayaan Sriwijaya: Menjaga Nafas Warisan Luhur",
    excerpt: "Menilik geliat pelestarian seni tari, aksara kaganga, dan sastra tutur lisan di Palembang.",
    content: `
      <p>Palembang bukan hanya kota perdagangan, tetapi juga episentrum peradaban maritim terbesar di Asia Tenggara pada zamannya. Melalui Taman Purbakala Kerajaan Sriwijaya (TPKS), jejak kejayaan masa lalu itu dihidupkan kembali.</p>
      <h2>Revitalisasi Seni Tradisi</h2>
      <p>Generasi muda Palembang kini kian antusias mempelajari kembali tarian Gending Sriwijaya dan seni bela diri Kuntau yang sempat meredup.</p>
    `,
    category: "Kebudayaan",
    coverImage: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop",
    author: authors[2] || {
      id: "3",
      name: "Dina Kirana",
      role: "Editor Kebudayaan",
      avatar: "https://i.pravatar.cc/150?img=9",
      bio: "Peneliti seni dan tradisi budaya Sumatera Selatan.",
    },
    publishedAt: "22 Agustus 2026",
    readingTime: 6,
    views: 980,
    likes: 210,
    featured: false,
    tags: ["Budaya", "Sriwijaya", "Seni", "Palembang", "Sejarah"],
  },
}

export function ArticlePreview() {
  const { id } = useParams()
  const [searchParams] = useSearchParams()
  const location = useLocation()
  const navigate = useNavigate()
  const articleId = id || searchParams.get("id") || "1"

  const customArticle = location.state?.article as Article | undefined
  const returnUrl = location.state?.returnUrl as string | undefined

  // Find article by id or slug or fallback
  const article: Article = 
    customArticle ||
    fallbackArticles[articleId] ||
    articles.find(a => a.id === articleId || a.slug === articleId) ||
    articles[0] ||
    fallbackArticles["1"]

  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)

  const copyLink = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      toast.success("Tautan artikel berhasil disalin!")
      setTimeout(() => setCopied(false), 2000)
    } catch {
      toast.info("Tautan artikel: " + window.location.href)
    }
  }

  const handleBack = () => {
    if (returnUrl) {
      navigate(returnUrl)
    } else if (window.history.length > 1) {
      navigate(-1)
    } else {
      navigate('/dashboard/create-article')
    }
  }

  const handleEdit = () => {
    if (returnUrl) {
      navigate(returnUrl)
    } else if (articleId && articleId !== "new") {
      navigate(`/dashboard/create-article/new?id=${articleId}&mode=edit`)
    } else {
      navigate('/dashboard/create-article/new')
    }
  }

  return (
    <div className="space-y-6 pb-16 animate-in fade-in duration-300">
      {/* ── Top Action & Control Header ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sticky top-0 bg-background/90 backdrop-blur-md z-20 py-3.5 px-4 -mx-4 md:-mx-8 border-b shadow-sm">
        <div className="flex items-center gap-3">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleBack} 
            className="gap-2 font-medium"
          >
            <ArrowLeft className="size-4" /> Kembali
          </Button>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
            <Eye className="size-3.5" /> Pratinjau Tampilan Publik
          </span>
        </div>

        <div className="flex items-center gap-2">
          <Button 
            onClick={handleEdit}
            className="bg-palembang-red text-white hover:bg-palembang-red/90 gap-2 text-xs h-8"
          >
            <Edit2 className="size-3.5" /> Edit Artikel Ini
          </Button>
        </div>
      </div>

      {/* ── Main Article Layout (Public Website Style) ── */}
      <div className="rounded-2xl border bg-background overflow-hidden shadow-sm">
        {/* Article Hero Header */}
        <header className="relative overflow-hidden bg-palembang-charcoal px-6 pb-16 pt-16 text-white sm:px-10 lg:px-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-45">
            <img 
              src={article.coverImage} 
              alt={article.title} 
              className="size-full object-cover object-right" 
            />
            <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
          </div>

          <div className="relative z-10 mx-auto max-w-[1040px]">
            <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">
              {article.category}
            </span>
            <h1 className="mt-4 max-w-4xl font-display text-3xl font-black leading-[1.05] tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              {article.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
              {article.excerpt}
            </p>

            <div className="mt-8 flex flex-wrap items-center justify-between gap-6 border-y border-white/15 py-4">
              <div className="flex items-center gap-3">
                <img 
                  src={article.author?.avatar || "https://i.pravatar.cc/150?img=11"} 
                  alt={article.author?.name || "Author"} 
                  className="size-11 rounded-full object-cover border border-white/20" 
                />
                <div>
                  <p className="text-sm font-semibold text-white">{article.author?.name || "Penulis"}</p>
                  <p className="text-xs text-white/60">{article.author?.role || "Kontributor"} · {article.publishedAt || "Terbaru"}</p>
                </div>
              </div>

              <div className="flex items-center gap-5 text-xs text-white/70">
                <span className="flex items-center gap-1.5">
                  <Clock3 className="size-4 text-palembang-gold" />
                  {article.readingTime || 5} min read
                </span>
                <span className="flex items-center gap-1.5">
                  <Heart className="size-4 text-palembang-red" />
                  {(article.likes || 0).toLocaleString()} likes
                </span>
                <span>{(article.views || 0).toLocaleString()} views</span>
              </div>
            </div>
          </div>
        </header>

        {/* Article Body Content & Interaction Area */}
        <div className="mx-auto grid max-w-[1040px] gap-10 px-6 py-12 sm:px-10 lg:grid-cols-[60px_1fr] lg:py-16">
          {/* Floating Aside Actions on Desktop */}
          <aside className="hidden lg:block">
            <div className="sticky top-28 flex flex-col items-center gap-3">
              <button 
                aria-label="Sukai artikel" 
                onClick={() => setLiked((value) => !value)} 
                className={`rounded-full border p-3 transition-colors ${liked ? "border-palembang-red bg-palembang-red text-white" : "border-border hover:border-palembang-red hover:text-palembang-red bg-background"}`}
                title="Sukai Artikel"
              >
                <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
              </button>
              <button 
                aria-label="Bagikan artikel" 
                onClick={() => {
                  if (navigator.share) {
                    navigator.share({ title: article.title, url: window.location.href })
                  } else {
                    copyLink()
                  }
                }} 
                className="rounded-full border border-border bg-background p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"
                title="Bagikan"
              >
                <Share2 className="size-4" />
              </button>
              <button 
                aria-label="Salin tautan" 
                onClick={copyLink} 
                className="rounded-full border border-border bg-background p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"
                title="Salin Tautan"
              >
                {copied ? <Check className="size-4 text-emerald-600" /> : <Copy className="size-4" />}
              </button>
            </div>
          </aside>

          {/* Main Article Content */}
          <div>
            <div 
              className="article-body prose prose-lg dark:prose-invert max-w-none leading-relaxed" 
              dangerouslySetInnerHTML={{ __html: article.content }} 
            />

            {/* Tags */}
            <div className="mt-10 flex flex-wrap gap-2 pt-6 border-t border-border">
              {article.tags?.map((tag) => (
                <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-xs font-medium text-muted-foreground">
                  #{tag}
                </span>
              ))}
            </div>

            {/* Mobile Interaction Bar */}
            <div className="mt-8 flex gap-3 lg:hidden">
              <Button variant="outline" size="sm" onClick={() => setLiked(v => !v)}>
                <Heart className={`size-4 mr-1.5 ${liked ? "fill-palembang-red text-palembang-red" : ""}`} /> 
                {liked ? "Disukai" : "Suka"}
              </Button>
              <Button variant="outline" size="sm" onClick={copyLink}>
                {copied ? <Check className="size-4 mr-1.5 text-emerald-600" /> : <Copy className="size-4 mr-1.5" />} 
                Salin Tautan
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
