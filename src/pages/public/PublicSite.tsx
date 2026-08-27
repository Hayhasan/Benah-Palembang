import { useEffect, useState } from "react"
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Eye,
  EyeOff,
  Heart,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  Send,
  Share2,
  Sparkles,
  Ticket,
} from "lucide-react"
import {
  Link,
  useParams,
  useNavigate,
  Outlet,
} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/navbar"
import { useAuth } from "@/context/AuthContext"
import { toast } from "sonner"
import {
  agendaItems,
  articles,
  categoryMeta,
  heroSlides,
  teamMembers,
  type Article,
  type Category,
} from "@/data/mockData"

const categories = Object.keys(categoryMeta) as Category[]

const dummyComments = [
  { id: 1, name: "Rina Sari", avatar: "https://i.pravatar.cc/80?img=1", time: "2 jam lalu", text: "Artikel yang sangat menarik! Palembang memang penuh dengan cerita yang perlu diangkat." },
  { id: 2, name: "Budi Hartono", avatar: "https://i.pravatar.cc/80?img=3", time: "5 jam lalu", text: "Terima kasih sudah mengangkat topik ini. Sebagai warga Palembang, saya sangat tersentuh." },
  { id: 3, name: "Dewi Ayu", avatar: "https://i.pravatar.cc/80?img=5", time: "1 hari lalu", text: "Sudah lama menunggu platform seperti ini. Semoga terus berkembang dan konsisten!" },
  { id: 4, name: "Ahmad Fauzi", avatar: "https://i.pravatar.cc/80?img=8", time: "2 hari lalu", text: "Perspektif yang segar. Saya suka cara penulisannya yang mendalam tapi tetap ringan dibaca." },
  { id: 5, name: "Siti Rahma", avatar: "https://i.pravatar.cc/80?img=9", time: "3 hari lalu", text: "Foto dan visual pendukungnya luar biasa ciamik. Bangga dengan kebudayaan kita!" },
  { id: 6, name: "Reza Pratama", avatar: "https://i.pravatar.cc/80?img=11", time: "4 hari lalu", text: "Ditunggu liputan seputar kuliner malam lorong basah dan tempat nongkrong seni lainnya." },
]


function Footer() {
  return <footer className="bg-palembang-charcoal px-6 pb-6 pt-16 text-white sm:px-10 lg:px-16"><div className="mx-auto max-w-[1380px]"><div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]"><div><img src="/logo.png" alt="Benah Palembang" className="h-9 sm:h-11 brightness-0 invert" /><p className="mt-5 max-w-xs text-sm leading-7 text-white/55">Platform editorial yang merekam, merayakan, dan menggerakkan kota.</p></div><div><p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">Explore</p><div className="flex flex-col gap-3 text-sm text-white/65">{categories.slice(0, 4).map((category) => <Link key={category} to={`/${categoryMeta[category].slug}`} className="transition-colors hover:text-white">{category}</Link>)}<Link to="/agenda">Agenda</Link></div></div><div><p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">Connect</p><div className="flex flex-col gap-3 text-sm text-white/65"><a href="#instagram">Instagram</a><a href="#tiktok">TikTok</a><a href="#youtube">YouTube</a><a href="#linkedin">LinkedIn</a></div></div><div><p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">Contact</p><div className="flex flex-col gap-3 text-sm text-white/65"><a href="mailto:halo@benahpalembang.id">halo@benahpalembang.id</a><span>Palembang, Sumatera Selatan</span><span>+62 711 123 456</span></div></div></div><div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/15 pt-5 text-[10px] uppercase tracking-[0.14em] text-white/40 sm:flex-row"><span>© 2025 Benah Palembang</span><span>Made with care in Palembang</span></div></div></footer>
}

function SectionHeading({ eyebrow, title, description, dark = false }: { eyebrow: string; title: string; description?: string; dark?: boolean }) {
  const eyebrowColor = dark ? "text-palembang-gold" : "text-palembang-red"
  const lineBg = dark ? "bg-palembang-gold" : "bg-palembang-red"
  return <div className={`flex flex-col gap-4 ${dark ? "text-white" : ""}`}><p className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] ${eyebrowColor}`}><span className={`h-px w-8 ${lineBg}`} />{eyebrow}</p><h2 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">{title}</h2>{description && <p className={`max-w-lg text-sm leading-7 ${dark ? "text-white/60" : "opacity-75"}`}>{description}</p>}</div>
}

const masonryAspects = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[1/1]", "aspect-[3/5]", "aspect-[4/3]", "aspect-[5/6]", "aspect-[2/3]", "aspect-[7/8]", "aspect-[5/7]", "aspect-[3/4]"]
function getCardAspect(id: string | number, featured: boolean) {
  if (featured) return "aspect-[16/9]"
  const numId = typeof id === "string" ? parseInt(id.replace(/\D/g, "")) || id.length : id
  return masonryAspects[numId % masonryAspects.length]
}

function ArticleCard({ article, featured = false, masonry = false }: { article: Article; featured?: boolean; masonry?: boolean }) {
  const aspect = masonry ? getCardAspect(article.id, false) : (featured ? "aspect-[4/3] lg:aspect-[16/9]" : "aspect-[4/3]")
  return <Link to={`/artikel/${article.slug}`} className={`group relative block overflow-hidden ${masonry ? "mb-4 sm:mb-6 break-inside-avoid" : ""} ${featured && !masonry ? "lg:col-span-2" : ""}`}><div className={`img-zoom relative overflow-hidden rounded-xl sm:rounded-[1.5rem] ${aspect}`}><img src={article.coverImage} alt={article.title} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" /><div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100" /><div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 sm:p-7"><div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.16em]"><span className="text-palembang-gold">{article.category}</span><span className="text-white/60">{article.publishedAt}</span></div><h3 className={`font-display font-bold leading-[1.1] tracking-[-0.035em] ${featured && !masonry ? "text-lg sm:text-2xl lg:text-4xl" : "text-base sm:text-xl lg:text-2xl"}`}>{article.title}</h3><p className="mt-2 line-clamp-2 text-[10px] leading-4 sm:text-xs sm:leading-5 text-white/80 sm:text-sm">{article.excerpt}</p><div className="mt-3 sm:mt-4 flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-palembang-gold">Baca <ArrowRight className="size-3 sm:size-4" /></div></div></div><div className="mt-2 sm:mt-3 px-1"><h4 className="font-display text-xs sm:text-sm font-bold leading-snug tracking-[-0.02em] line-clamp-2 group-hover:text-palembang-red transition-colors duration-300">{article.title}</h4><p className="mt-1 line-clamp-2 text-[10px] sm:text-xs leading-4 sm:leading-5 opacity-60">{article.excerpt}</p></div></Link>
}

function Hero() {
  const [slide, setSlide] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 6000); return () => window.clearInterval(timer) }, [])
  const current = heroSlides[slide]
  return <section className="relative h-[min(850px,100svh)] min-h-[680px] overflow-hidden bg-palembang-charcoal text-white"><div className="absolute inset-0"><img src={current.image} alt="Palembang" className="size-full object-cover opacity-80 transition-all duration-1000" /><div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/75" /></div><div className="relative mx-auto flex h-full max-w-[1380px] flex-col items-center justify-center px-6 text-center"><div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-palembang-gold"><span className="h-px w-8 bg-palembang-gold" />{current.tag}<span className="h-px w-8 bg-palembang-gold" /></div><h1 className="max-w-5xl whitespace-pre-line font-display text-[clamp(2rem,5.5vw,5rem)] font-black leading-[0.82] tracking-[-0.075em]">{current.title}</h1><p className="mt-8 max-w-md text-sm leading-6 text-white/75 sm:text-base">Ruang untuk cerita, budaya, kreativitas, dan kehidupan Palembang.</p><Link to="/cerita-warga" className="mt-8 flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-palembang-charcoal transition-transform hover:-translate-y-1">Jelajahi cerita <ArrowRight className="size-4" /></Link></div><div className="absolute bottom-10 left-6 right-6 mx-auto flex max-w-[1380px] items-end justify-between"><div className="flex gap-2">{heroSlides.map((item, index) => <button key={item.id} aria-label={`Slide ${index + 1}`} onClick={() => setSlide(index)} className={`h-1 transition-all ${index === slide ? "w-12 bg-palembang-gold" : "w-5 bg-white/40"}`} />)}</div><div className="flex gap-2"><button aria-label="Slide sebelumnya" onClick={() => setSlide((slide - 1 + heroSlides.length) % heroSlides.length)} className="rounded-full border border-white/30 p-2 transition-colors hover:bg-white/15"><ChevronLeft className="size-4" /></button><button aria-label="Slide berikutnya" onClick={() => setSlide((slide + 1) % heroSlides.length)} className="rounded-full border border-white/30 p-2 transition-colors hover:bg-white/15"><ChevronRight className="size-4" /></button></div></div></section>
}

function CategorySection({ category, variant = "default", featuredFirst = false }: { category: Category; variant?: "red" | "dark" | "off-white" | "default"; featuredFirst?: boolean }) {
  const categoryArticles = articles.filter(a => a.category === category).slice(0, featuredFirst ? 3 : 4)
  if (categoryArticles.length === 0) return null
  const meta = categoryMeta[category]
  const isRed = variant === "red"
  const isDark = variant === "dark"
  const isOffWhite = variant === "off-white"
  
  const bgClass = isRed ? "bg-palembang-red text-white" : (isDark ? "bg-palembang-charcoal text-white" : (isOffWhite ? "bg-palembang-off-white text-palembang-charcoal" : "bg-background text-foreground"))
  const gradientFrom = isRed ? "from-palembang-red via-palembang-red/60" : (isDark ? "from-palembang-charcoal via-palembang-charcoal/60" : (isOffWhite ? "from-palembang-off-white via-palembang-off-white/60" : "from-background via-background/60"))
  const gradientV = isRed ? "from-palembang-red/40 via-transparent to-palembang-red" : (isDark ? "from-palembang-charcoal/40 via-transparent to-palembang-charcoal" : (isOffWhite ? "from-palembang-off-white/40 via-transparent to-palembang-off-white" : "from-background/40 via-transparent to-background"))
  const linkClass = isRed ? "text-white" : (isDark ? "text-palembang-gold" : "text-palembang-charcoal")
  const btnBorder = isRed ? "border-white group-hover:bg-white group-hover:text-palembang-red" : (isDark ? "border-palembang-gold group-hover:bg-palembang-gold group-hover:text-palembang-charcoal" : "border-palembang-charcoal group-hover:bg-palembang-charcoal group-hover:text-white")

  return (
    <section className={`relative overflow-hidden ${bgClass} px-6 py-24 sm:px-10 lg:px-16 lg:py-32`}>
      <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-25 lg:opacity-35">
        <img src={meta.image} alt={category} className="size-full object-cover object-right" />
        <div className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} to-transparent`} />
        <div className={`absolute inset-0 bg-gradient-to-b ${gradientV}`} />
      </div>
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Kategori Cerita" title={category} description={meta.description} dark={isRed || isDark} />
          <Link to={`/${meta.slug}`} className={`group hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] md:flex ${linkClass}`}>
            Lihat semua <span className={`rounded-full border p-2 transition-colors ${btnBorder}`}><ArrowRight className="size-4" /></span>
          </Link>
        </div>
        <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {categoryArticles.map((article, index) => <ArticleCard key={article.id} article={article} featured={featuredFirst && index === 0} />)}
        </div>
        <div className="mt-12 flex justify-end md:hidden">
          <Link to={`/${meta.slug}`} className={`group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] ${linkClass}`}>
            Lihat semua <span className={`rounded-full border p-2 transition-colors ${btnBorder}`}><ArrowRight className="size-4" /></span>
          </Link>
        </div>
      </div>
    </section>
  )
}

export function HomePage() {
  const featured = articles.filter((article) => article.featured).slice(0, 3)
  return <><Hero /><main><section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-36"><div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.75fr_1.7fr]"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-palembang-red">About Benah Palembang</p><div className="mt-8 h-24 w-px bg-palembang-red/50" /><p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">Est. 2025 · Palembang</p></div><div><h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl">Merekam, merayakan, dan menggerakkan <span className="text-palembang-red">Palembang.</span></h2><p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground">Benah Palembang adalah platform editorial yang percaya bahwa kota bukan hanya tentang bangunan dan jalan. Ia adalah tentang manusia, ingatan, budaya, dan cerita-cerita kecil yang membentuk identitas kita.</p><div className="mt-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-palembang-red"><span className="rounded-full border border-palembang-red p-2"><Sparkles className="size-4" /></span> Untuk kota yang lebih hidup</div></div></div></section><section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32"><div className="mx-auto max-w-[1240px]"><SectionHeading eyebrow="Jelajahi perspektif" title="Satu kota, banyak cerita." /><div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-border sm:grid-cols-2 lg:grid-cols-5">{categories.map((category) => <Link key={category} to={`/${categoryMeta[category].slug}`} className="group relative min-h-48 sm:min-h-64 overflow-hidden bg-background p-4 sm:p-6 transition-colors hover:bg-palembang-charcoal hover:text-white"><div className="flex h-full flex-col justify-between"><div><span className="font-display text-3xl sm:text-5xl text-palembang-red">0{categories.indexOf(category) + 1}</span><h3 className="mt-3 sm:mt-5 font-display text-lg sm:text-2xl font-bold leading-tight">{category}</h3></div><span className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.13em] text-muted-foreground group-hover:text-white/70 mt-4 sm:mt-0"><span>{categoryMeta[category].count} stories</span><ArrowUpRight className="size-4 sm:size-5 text-palembang-red transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 mt-1 sm:mt-0" /></span></div></Link>)}</div></div></section><section className="sticky top-0 z-10 relative overflow-hidden bg-palembang-off-white px-6 py-24 text-palembang-charcoal sm:px-10 lg:px-16 lg:py-32"><div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-15 lg:opacity-25"><img src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop" alt="" className="size-full object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-palembang-off-white via-palembang-off-white/60 to-transparent" /><div className="absolute inset-0 bg-gradient-to-b from-palembang-off-white/40 via-transparent to-palembang-off-white" /></div><div className="relative z-10 mx-auto max-w-[1240px]"><SectionHeading eyebrow="Pilihan redaksi" title="Cerita dari Palembang" description="Menyusuri denyut kota melalui cerita warga, ruang kota, budaya, dan mereka yang membuat Palembang terus bergerak." /><div className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">{featured.map((article, index) => <ArticleCard key={article.id} article={article} featured={index === 0} />)}</div><div className="mt-12 flex justify-end"><Link to="/cerita-warga" className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-palembang-charcoal">Lihat semua cerita <span className="rounded-full border border-palembang-charcoal p-2 transition-colors group-hover:bg-palembang-charcoal group-hover:text-white"><ArrowRight className="size-4" /></span></Link></div></div></section><div className="sticky top-0 z-20"><CategorySection category="Gaya Hidup" variant="default" /></div><div className="sticky top-0 z-[21]"><CategorySection category="Ruang Kota" variant="red" featuredFirst /></div><div className="sticky top-0 z-[22]"><CategorySection category="Industri Kreatif" variant="off-white" /></div><div className="sticky top-0 z-[23]"><CategorySection category="Kebudayaan" variant="default" featuredFirst /></div><div className="relative z-[24]"><section className="bg-palembang-charcoal px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32"><div className="mx-auto max-w-[1240px]"><SectionHeading dark eyebrow="Orang-orang di balik cerita" title="Our Team" description="Kami adalah kumpulan penulis, fotografer, peneliti, dan warga kota yang percaya pada kekuatan cerita." /><div className="mt-10 sm:mt-12 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">{teamMembers.map((member) => <div key={member.id} className="group"><div className="img-zoom aspect-[4/5] overflow-hidden rounded-xl sm:rounded-[1.25rem] bg-white/10"><img src={member.photo} alt={member.name} className="size-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0" loading="lazy" /></div><p className="mt-3 sm:mt-5 font-display text-lg sm:text-2xl font-bold">{member.name}</p><p className="mt-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-gold">{member.role}</p><p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-white/55 line-clamp-3 sm:line-clamp-none">{member.bio}</p></div>)}</div></div></section><CTASection /></div></main><Footer /></>
}

export function CategoryPage({ category }: { category: Category }) {
  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState(false)
  const meta = categoryMeta[category]

  useEffect(() => {
    setShowAll(false)
    setQuery("")
  }, [category])

  const filtered = articles.filter((article) => article.category === category && `${article.title} ${article.excerpt}`.toLowerCase().includes(query.toLowerCase()))
  const initialCount = 4
  const visibleArticles = showAll || query ? filtered : filtered.slice(0, initialCount)
  const hasMore = !showAll && !query && filtered.length > initialCount

  return <><div className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-40 text-white sm:px-10 lg:px-16"><div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-25 lg:opacity-40"><img src={meta.image} alt={category} className="size-full object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" /><div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" /></div><div className="relative z-10 mx-auto max-w-[1240px]"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">Category / {category}</p><h1 className="mt-6 max-w-4xl font-display text-6xl font-black leading-[0.9] tracking-[-0.065em] sm:text-8xl">{category}</h1><p className="mt-8 max-w-lg text-base leading-7 text-white/65">{meta.description}</p><div className="mt-10 flex max-w-xl items-center gap-3 border-b border-white/30 pb-3"><Search className="size-4 text-white/50" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search stories..." aria-label="Search stories" className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40" /></div></div></div><main className="relative px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-[1240px]">{filtered.length > 0 ? <div className="relative"><div className="columns-2 gap-3 sm:columns-2 sm:gap-6 lg:columns-4">{visibleArticles.map((article) => <ArticleCard key={article.id} article={article} masonry />)}</div>{hasMore && <div className="absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-6 backdrop-blur-[2px]"><button onClick={() => setShowAll(true)} className="group flex items-center gap-3 rounded-full border border-border bg-background/95 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red">Tampilkan Seluruh Cerita ({filtered.length} Berita) <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" /></button></div>}</div> : <div className="py-20 text-center"><p className="font-display text-3xl">Cerita tidak ditemukan.</p><p className="mt-3 text-sm text-muted-foreground">Coba kata kunci lain.</p></div>}</div></main><Footer /></>
}

export function ArticlePage() {
  const { slug } = useParams()
  const article = articles.find((item) => item.slug === slug) ?? articles[0]
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const related = articles.filter((item) => item.category === article.category && item.id !== article.id).slice(0, 3)
  const copyLink = async () => { await navigator.clipboard?.writeText(window.location.href); setCopied(true); window.setTimeout(() => setCopied(false), 1800) }
  
  const visibleComments = showAllComments ? dummyComments : dummyComments.slice(0, 4)
  const hasMoreComments = dummyComments.length > 4 && !showAllComments

  return <><main className="pt-24"><article><header className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-28 text-white sm:px-10 lg:px-16"><div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-45"><img src={article.coverImage} alt={article.title} className="size-full object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" /><div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" /></div><div className="relative z-10 mx-auto max-w-[1040px]"><Link to={`/${categoryMeta[article.category].slug}`} className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">{article.category}</Link><h1 className="mt-6 max-w-4xl font-display text-4xl font-black leading-[1.0] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{article.title}</h1><p className="mt-8 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{article.excerpt}</p><div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-y border-white/15 py-5"><div className="flex items-center gap-3"><img src={article.author.avatar} alt={article.author.name} className="size-11 rounded-full object-cover" /><div><p className="text-sm font-semibold text-white">{article.author.name}</p><p className="text-xs text-white/60">{article.author.role} · {article.publishedAt}</p></div></div><div className="flex items-center gap-5 text-xs text-white/70"><span className="flex items-center gap-2"><Clock3 className="size-4" />{article.readingTime} min read</span><span className="flex items-center gap-2"><Heart className="size-4" />{article.likes.toLocaleString()} likes</span><span>{article.views.toLocaleString()} views</span></div></div></div></header><div className="mx-auto grid max-w-[1040px] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[60px_1fr] lg:py-20"><aside className="hidden lg:block"><div className="sticky top-28 flex flex-col items-center gap-3"><button aria-label="Sukai artikel" onClick={() => setLiked((value) => !value)} className={`rounded-full border p-3 transition-colors ${liked ? "border-palembang-red bg-palembang-red text-white" : "border-border hover:border-palembang-red hover:text-palembang-red"}`}><Heart className={`size-4 ${liked ? "fill-current" : ""}`} /></button><button aria-label="Bagikan artikel" onClick={() => void navigator.share?.({ title: article.title, url: window.location.href })} className="rounded-full border border-border p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"><Share2 className="size-4" /></button><button aria-label="Salin tautan" onClick={() => void copyLink()} className="rounded-full border border-border p-3 transition-colors hover:border-palembang-red hover:text-palembang-red">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</button></div></aside><div><div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} /><div className="mt-10 flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-xs opacity-75">#{tag}</span>)}</div><div className="mt-12 flex gap-3 lg:hidden"><Button variant="outline" size="sm" onClick={() => setLiked((value) => !value)}><Heart className={`size-4 ${liked ? "fill-palembang-red text-palembang-red" : ""}`} /> Suka</Button><Button variant="outline" size="sm" onClick={() => void copyLink()}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />} Salin tautan</Button></div><div className="mt-16 border-t border-border pt-10"><div className="flex items-center gap-3 mb-8"><MessageCircle className="size-5 text-palembang-red" /><h3 className="font-display text-xl font-bold tracking-[-0.03em]">Komentar ({dummyComments.length})</h3></div><form onSubmit={e => e.preventDefault()} className="mb-8 flex gap-3"><img src="https://i.pravatar.cc/80?img=12" alt="You" className="size-10 rounded-full object-cover" /><div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2"><input placeholder="Tulis komentar..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /><button type="submit" className="rounded-full p-1.5 text-palembang-red transition-colors hover:bg-palembang-red/10"><Send className="size-4" /></button></div></form><div className="relative"><div className="space-y-6">{visibleComments.map(c => <div key={c.id} className="flex gap-3"><img src={c.avatar} alt={c.name} className="size-10 rounded-full object-cover" /><div><div className="flex items-center gap-2"><p className="text-sm font-semibold">{c.name}</p><span className="text-[10px] text-muted-foreground">{c.time}</span></div><p className="mt-1 text-sm leading-6 opacity-80">{c.text}</p></div></div>)}</div>{hasMoreComments && <div className="absolute inset-x-0 -bottom-4 flex h-36 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-2 backdrop-blur-[2px]"><button onClick={() => setShowAllComments(true)} className="group flex items-center gap-2 rounded-full border border-border bg-background/95 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-palembang-red hover:text-palembang-red">Lihat Komentar Lainnya ({dummyComments.length - 4}) <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" /></button></div>}</div></div></div></div></article></main><section className="bg-palembang-off-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28 text-palembang-charcoal"><div className="mx-auto max-w-[1240px]"><div className="flex items-end justify-between gap-6"><SectionHeading eyebrow="Lanjutkan membaca" title="More Stories" /><Link to={`/${categoryMeta[article.category].slug}`} className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] sm:flex">View all stories <ArrowRight className="size-4" /></Link></div><div className="mt-12 grid gap-8 md:grid-cols-3">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div></div></section><Footer /></>
}

export function AgendaPage() {
  const [filter, setFilter] = useState("this-month")
  const [showAll, setShowAll] = useState(false)
  
  const initialCount = 4
  const visibleAgenda = showAll ? agendaItems : agendaItems.slice(0, initialCount)
  const hasMore = !showAll && agendaItems.length > initialCount

  return <><div className="relative overflow-hidden bg-palembang-red px-6 pb-24 pt-40 text-white sm:px-10 lg:px-16"><div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-40"><img src="https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" alt="Agenda Palembang" className="size-full object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-palembang-red via-palembang-red/50 to-transparent" /><div className="absolute inset-0 bg-gradient-to-b from-palembang-red/40 via-transparent to-palembang-red" /></div><div className="relative z-10 mx-auto max-w-[1240px]"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">Agenda Palembang</p><h1 className="mt-6 max-w-4xl font-display text-6xl font-black leading-[0.9] tracking-[-0.065em] sm:text-8xl">Temui, ikut,<br />dan bergerak.</h1><p className="mt-8 max-w-lg text-base leading-7 text-white/85">Ruang-ruang pertemuan yang mempertemukan ide, orang, dan energi baik untuk Palembang.</p></div></div><main className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-[1240px]"><div className="mb-12 flex gap-4 overflow-x-auto border-b border-border pb-px"><button onClick={() => setFilter("this-month")} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${filter === "this-month" ? "border-palembang-red text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>This Month</button><button onClick={() => setFilter("upcoming")} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${filter === "upcoming" ? "border-palembang-red text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Upcoming</button><button onClick={() => setFilter("past")} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${filter === "past" ? "border-palembang-red text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Past Event</button></div><div className="relative"><div className="grid gap-8">{visibleAgenda.map((item) => <Link key={item.id} to={`/agenda/${item.id}`} className="group grid gap-6 border-b border-border pb-8 md:grid-cols-[240px_1fr_220px] md:gap-10"><div className="img-zoom aspect-[4/3] overflow-hidden rounded-2xl"><img src={item.image} alt={item.title} className="size-full object-cover" loading="lazy" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-palembang-red">{item.category}</p><h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight tracking-[-0.04em] transition-colors group-hover:text-palembang-red">{item.title}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{item.description}</p><p className="mt-5 text-xs font-semibold text-muted-foreground">{item.organizer}</p></div><div className="flex flex-col justify-between text-sm"><div className="space-y-2 text-muted-foreground"><p className="flex items-center gap-2"><CalendarDays className="size-4 text-palembang-red" />{item.date}</p><p className="flex items-center gap-2"><Clock3 className="size-4 text-palembang-red" />{item.time}</p><p className="flex items-center gap-2"><MapPin className="size-4 text-palembang-red" />{item.location}</p></div><span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-all group-hover:border-palembang-red group-hover:text-palembang-red"><Ticket className="size-4" />Detail acara</span></div></Link>)}</div>{hasMore && <div className="absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-6 backdrop-blur-[2px]"><button onClick={() => setShowAll(true)} className="group flex items-center gap-3 rounded-full border border-border bg-background/95 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red">Tampilkan Seluruh Agenda ({agendaItems.length} Acara) <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" /></button></div>}</div></div></main><Footer /></>
}

export function AgendaDetailPage() {
  const { id } = useParams()
  const item = agendaItems.find(a => a.id === id) ?? agendaItems[0]
  const otherAgenda = agendaItems.filter(a => a.id !== item.id).slice(0, 3)
  const [copied, setCopied] = useState(false)

  const handleShare = async () => {
    const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || window.innerWidth < 768
    if (isMobile && navigator.share) {
      try {
        await navigator.share({
          title: `${item.title} - Benah Palembang`,
          text: `Ikuti agenda "${item.title}" di Palembang!`,
          url: window.location.href,
        })
      } catch (err) {
        if ((err as Error).name !== "AbortError") {
          await navigator.clipboard?.writeText(window.location.href)
          setCopied(true)
          setTimeout(() => setCopied(false), 2000)
        }
      }
    } else {
      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    }
  }

  const waMessage = `Halo Benah Palembang, saya ingin mendaftar untuk acara:\n*${item.title}*\nTanggal: ${item.date}\nLokasi: ${item.location}`
  
  return <><div className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-40 text-white sm:px-10 lg:px-16"><div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-45"><img src={item.image} alt={item.title} className="size-full object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" /><div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" /></div><div className="relative z-10 mx-auto max-w-[1240px]"><Link to="/agenda" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold hover:underline"><ArrowRight className="size-3 rotate-180" /> Kembali ke Agenda</Link><div className="mt-6"><span className="inline-block rounded-full border border-palembang-gold/40 bg-palembang-gold/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">{item.category}</span></div><h1 className="mt-4 max-w-4xl font-display text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-8xl">{item.title}</h1><p className="mt-8 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{item.description}</p></div></div><main className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24"><div className="mx-auto max-w-[1240px]"><div className="grid gap-12 lg:grid-cols-[1fr_380px]"><div><div className="overflow-hidden rounded-[1.5rem]"><img src={item.image} alt={item.title} className="aspect-[16/9] w-full object-cover" /></div><div className="mt-10"><h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Tentang Acara</h2><p className="mt-4 text-base leading-8 text-muted-foreground">{item.description}</p><p className="mt-4 text-base leading-8 text-muted-foreground">Acara ini terbuka untuk umum dan dirancang untuk mempertemukan berbagai elemen masyarakat Palembang — dari akademisi, pelaku kreatif, hingga warga biasa yang peduli dengan masa depan kota. Hadir dan rasakan energi kolaboratif yang mendorong perubahan nyata.</p><p className="mt-4 text-base leading-8 text-muted-foreground">Peserta diharapkan datang tepat waktu. Registrasi dibuka 30 menit sebelum acara dimulai. Tersedia sertifikat kehadiran bagi peserta yang mendaftar.</p></div><div className="mt-10"><h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Yang Akan Kamu Dapatkan</h2><ul className="mt-4 space-y-3">{["Insight dan perspektif baru dari para narasumber berpengalaman", "Networking dengan komunitas dan pelaku kreatif Palembang", "Sertifikat kehadiran resmi dari penyelenggara", "Konsumsi dan goodie bag untuk peserta terdaftar"].map(benefit => <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><Check className="mt-0.5 size-4 flex-shrink-0 text-palembang-red" />{benefit}</li>)}</ul></div></div><div><div className="sticky top-28 space-y-6"><div className="rounded-[1.5rem] border border-border bg-background p-6 shadow-sm"><h3 className="font-display text-lg font-bold">Detail Acara</h3><div className="mt-6 space-y-5"><div className="flex items-start gap-3"><CalendarDays className="mt-0.5 size-5 text-palembang-red" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Tanggal</p><p className="mt-1 text-sm font-semibold">{item.date}</p></div></div><div className="flex items-start gap-3"><Clock3 className="mt-0.5 size-5 text-palembang-red" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Waktu</p><p className="mt-1 text-sm font-semibold">{item.time}</p></div></div><div className="flex items-start gap-3"><MapPin className="mt-0.5 size-5 text-palembang-red" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Lokasi</p><p className="mt-1 text-sm font-semibold">{item.location}</p></div></div><div className="flex items-start gap-3"><Sparkles className="mt-0.5 size-5 text-palembang-red" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Penyelenggara</p><p className="mt-1 text-sm font-semibold">{item.organizer}</p></div></div></div><div className="mt-8 grid gap-3"><a href={`https://wa.me/628551241878?text=${encodeURIComponent(waMessage)}`} target="_blank" rel="noopener noreferrer" className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-palembang-red text-sm font-bold text-white transition-colors hover:bg-palembang-red/90"><Ticket className="size-4" /> Daftar Sekarang</a><Button type="button" variant="outline" onClick={handleShare} className="h-11 w-full font-semibold">{copied ? <><Check className="size-4 text-emerald-600" /><span className="text-emerald-600">Tautan Disalin!</span></> : <><Share2 className="size-4" /><span>Bagikan Acara</span></>}</Button></div></div><div className="rounded-[1.5rem] border border-border bg-muted/40 p-6"><div className="inline-flex items-center gap-2 rounded-full bg-palembang-charcoal px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-gold"><Sparkles className="size-3" /> {item.category}</div><h4 className="mt-3 font-display text-base font-bold text-foreground">Kategori: {item.category}</h4><p className="mt-2 text-xs leading-5 text-muted-foreground">Acara ini juga terbuka untuk kolaborasi komunitas dan publik. Hubungi penyelenggara untuk informasi lebih lanjut.</p></div></div></div></div></div></main><section className="bg-palembang-off-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28 text-palembang-charcoal"><div className="mx-auto max-w-[1240px]"><SectionHeading eyebrow="Jangan lewatkan" title="Agenda Lainnya" /><div className="mt-12 grid gap-8 md:grid-cols-3">{otherAgenda.map(a => <Link key={a.id} to={`/agenda/${a.id}`} className="group"><div className="img-zoom aspect-[4/3] overflow-hidden rounded-[1.25rem]"><img src={a.image} alt={a.title} className="size-full object-cover" loading="lazy" /></div><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-palembang-red">{a.category}</p><h3 className="mt-2 font-display text-xl font-bold leading-tight tracking-[-0.03em] transition-colors group-hover:text-palembang-red">{a.title}</h3><div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />{a.date}</span><span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{a.location.split(",")[0]}</span></div></Link>)}</div></div></section><Footer /></>
}

export function CollaborationPage() {

  const [showAllContent, setShowAllContent] = useState(false)

  const partnerLogos = [
    { name: "Grab", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/Grab_Logo.svg/200px-Grab_Logo.svg.png" },
    { name: "Tokopedia", src: "https://images.tokopedia.net/img/toppicks/social-share-tokopedia.jpg" },
    { name: "Bank Sumsel", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/e/eb/Logo_Bank_SumselBabel.svg/200px-Logo_Bank_SumselBabel.svg.png" },
    { name: "Telkomsel", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/a/ad/Logo_of_Telkomsel_%282021%29.svg/200px-Logo_of_Telkomsel_%282021%29.svg.png" },
    { name: "Sriwijaya FC", src: "https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/Sriwijaya_FC_logo.svg/200px-Sriwijaya_FC_logo.svg.png" },
    { name: "Kompas", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/4/4e/Kompas_Logo.svg/200px-Kompas_Logo.svg.png" },
    { name: "Gojek", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0e/Gojek_logo_2019.svg/200px-Gojek_logo_2019.svg.png" },
    { name: "Pertamina", src: "https://upload.wikimedia.org/wikipedia/commons/thumb/9/95/Logo_Pertamina.svg/200px-Logo_Pertamina.svg.png" },
  ]
  const doubledLogos = [...partnerLogos, ...partnerLogos]

  const partnerContents = [
    { id: 1, platform: "youtube", title: "Kolaborasi Benah x Grab Palembang", thumbnail: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[9/16]" },
    { id: 2, platform: "instagram", title: "Kampanye Budaya Bersama Tokopedia", thumbnail: "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[4/5]" },
    { id: 3, platform: "tiktok", title: "Cerita Lorong — Viral Series", thumbnail: "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[9/16]" },
    { id: 4, platform: "youtube", title: "Documentary: Sriwijaya Heritage", thumbnail: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[16/9]" },
    { id: 5, platform: "instagram", title: "Reels — Kuliner Khas Palembang", thumbnail: "https://images.pexels.com/photos/2474661/pexels-photo-2474661.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[4/5]" },
    { id: 6, platform: "tiktok", title: "Palembang Hidden Gems Challenge", thumbnail: "https://images.pexels.com/photos/1486222/pexels-photo-1486222.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[9/16]" },
    { id: 7, platform: "youtube", title: "Pertamina x Benah — CSR Kota Hijau", thumbnail: "https://images.pexels.com/photos/3052361/pexels-photo-3052361.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[16/9]" },
    { id: 8, platform: "instagram", title: "Behind the Scenes — Tim Benah", thumbnail: "https://images.pexels.com/photos/3184298/pexels-photo-3184298.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[1/1]" },
    { id: 9, platform: "tiktok", title: "Makeover Lorong Seni Palembang", thumbnail: "https://images.pexels.com/photos/1190298/pexels-photo-1190298.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[9/16]" },
    { id: 10, platform: "youtube", title: "Talk Show: Masa Depan Kota Kreatif", thumbnail: "https://images.pexels.com/photos/3184416/pexels-photo-3184416.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[4/5]" },
  ]

  const platformIcon = (p: string) => {
    if (p === "youtube") return <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">YT</span>
    if (p === "instagram") return <span className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">IG</span>
    if (p === "tiktok") return <span className="bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20">TK</span>
    return <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">FB</span>
  }

  const visibleContents = showAllContent ? partnerContents : partnerContents.slice(0, 6)

  return <><div className="relative bg-palembang-charcoal"><div className="absolute inset-x-0 top-0 h-[600px] overflow-hidden"><img src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1920&h=600&fit=crop" alt="Background Kolaborasi" className="size-full object-cover opacity-40" /><div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/30 via-palembang-charcoal/80 to-palembang-charcoal" /></div><main className="relative z-10 px-6 pb-24 pt-40 text-white sm:px-10 lg:px-16 lg:pb-36"><div className="mx-auto max-w-[1240px]"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">Collaboration</p><h1 className="mt-6 max-w-5xl font-display text-6xl font-black leading-[0.88] tracking-[-0.065em] sm:text-8xl lg:text-9xl">Mari Benahi<br /><span className="text-palembang-red">Palembang</span><br />bersama.</h1><div className="mt-16"><div><p className="max-w-lg text-lg leading-8 text-white/65">Kami terbuka untuk berkolaborasi dengan komunitas, brand, creative worker, organisasi, media, dan siapa pun yang ingin ikut membuat Palembang lebih hidup.</p><div className="mt-10 flex flex-col gap-4"><div className="flex items-center gap-3 text-palembang-gold"><Mail className="size-5" /><a href="mailto:kolaborasi@benahpalembang.id" className="text-sm underline underline-offset-4 text-white hover:text-palembang-gold transition-colors">kolaborasi@benahpalembang.id</a></div><div className="flex items-center gap-3 text-palembang-gold"><MessageCircle className="size-5" /><a href="https://wa.me/628551241878" target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4 text-white hover:text-palembang-gold transition-colors">08551241878</a></div></div></div></div></div></main></div>

  {/* ── Partners Logo Slider ── */}
  <section className="bg-palembang-off-white py-16 sm:py-20 overflow-hidden">
    <div className="mx-auto max-w-[1240px] px-6 sm:px-10 lg:px-16 mb-10">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Trusted By</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-palembang-charcoal sm:text-4xl">Our Partners</h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Brand, komunitas, dan organisasi yang telah berkolaborasi bersama Benah Palembang.</p>
    </div>
    <div className="relative">
      <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-20 bg-gradient-to-r from-palembang-off-white to-transparent" />
      <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-20 bg-gradient-to-l from-palembang-off-white to-transparent" />
      <div className="flex animate-marquee gap-12 items-center">
        {doubledLogos.map((logo, i) => (
          <div key={`${logo.name}-${i}`} className="flex-shrink-0 group cursor-pointer px-4">
            <img src={logo.src} alt={logo.name} className="h-12 w-auto object-contain opacity-50 grayscale transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:scale-110" />
          </div>
        ))}
      </div>
    </div>
  </section>

  {/* ── Partner Content — Pinterest Masonry Grid ── */}
  <section className="bg-palembang-charcoal px-6 py-16 sm:px-10 sm:py-24 lg:px-16">
    <div className="mx-auto max-w-[1240px]">
      <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">Partner Content</p>
      <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-white sm:text-4xl">Konten Kolaborasi</h2>
      <p className="mt-3 max-w-lg text-sm leading-6 text-white/60">Konten promosi dan cerita dari partner-partner kami di berbagai platform.</p>

      <div className="relative mt-12">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
          {visibleContents.map(item => (
            <div key={item.id} className="break-inside-avoid group cursor-pointer">
              <div className={`relative overflow-hidden rounded-2xl ${item.ratio}`}>
                <img src={item.thumbnail} alt={item.title} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                <div className="absolute top-3 left-3">{platformIcon(item.platform)}</div>
                <div className="absolute inset-x-0 bottom-0 p-4">
                  <h3 className="text-sm font-bold text-white leading-tight">{item.title}</h3>
                  <p className="mt-1 text-[10px] uppercase tracking-widest text-white/60 font-semibold">{item.platform}</p>
                </div>
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Show More Blur Overlay */}
        {!showAllContent && (
          <div className="absolute inset-x-0 bottom-0 h-64 flex items-end justify-center bg-gradient-to-t from-palembang-charcoal via-palembang-charcoal/90 to-transparent">
            <button onClick={() => setShowAllContent(true)} className="mb-8 rounded-full border border-white/20 bg-white/10 px-8 py-3 text-sm font-semibold text-white backdrop-blur-md transition-all hover:bg-white/20 hover:border-white/40 hover:scale-105">
              Tampilkan Semua Konten
            </button>
          </div>
        )}
      </div>
    </div>
  </section>

  <Footer /></>
}

export function LoginPage() {
  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const navigate = useNavigate()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email, password)) {
      navigate('/dashboard')
    } else {
      toast.error('Email atau password salah')
    }
  }

  return (
    <main className="flex min-h-svh items-center justify-center bg-palembang-charcoal px-6 py-32">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 shadow-xl backdrop-blur-sm lg:grid-cols-2">
        <div className="relative hidden min-h-[600px] overflow-hidden bg-palembang-charcoal lg:block">
          <img src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop" alt="Jembatan Ampera" className="size-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <img src="/logo.png" alt="Benah Palembang" className="h-8 brightness-0 invert" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">Masuk untuk menyimpan cerita dan mengikuti agenda pilihanmu.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 text-white sm:p-14">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="Benah Palembang" className="h-6" />
          </Link>
          <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">Selamat datang kembali.</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">Masuk ke ruang personalmu di Benah Palembang.</p>
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <label className="block text-xs font-semibold text-white/80">
              Email
              <input 
                type="email" 
                required 
                placeholder="nama@email.com" 
                value={email} 
                onChange={e => setEmail(e.target.value)} 
                className="mt-2 h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 text-sm text-white outline-none focus:bg-zinc-900 focus:border-palembang-gold focus:ring-[3px] focus:ring-palembang-gold/30 placeholder:text-white/40" 
              />
            </label>
            <label className="block text-xs font-semibold text-white/80">
              Password
              <div className="relative mt-2">
                <input 
                  type={showPw ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  value={password} 
                  onChange={e => setPassword(e.target.value)} 
                  className="h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 pr-10 text-sm text-white outline-none focus:bg-zinc-900 focus:border-palembang-gold focus:ring-[3px] focus:ring-palembang-gold/30 placeholder:text-white/40" 
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white" tabIndex={-1}>
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
            <div className="flex justify-end">
              <Link to="/lupa-password" className="text-[11px] font-medium text-palembang-gold/80 transition-colors hover:text-palembang-gold hover:underline">
                Lupa password?
              </Link>
            </div>
            <Button type="submit" className="mt-1 h-11 w-full bg-palembang-gold text-palembang-charcoal hover:bg-palembang-gold/90 font-bold">
              Masuk <ArrowRight className="size-4" />
            </Button>
          </form>
          <p className="mt-8 text-center text-xs text-white/50">
            Belum punya akun? <Link to="/register" className="font-semibold text-palembang-gold hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export function RegisterPage() {
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  return (
    <main className="flex min-h-svh items-center justify-center bg-palembang-charcoal px-6 py-32">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 shadow-xl backdrop-blur-sm lg:grid-cols-2">
        <div className="relative hidden min-h-[600px] overflow-hidden bg-palembang-charcoal lg:block">
          <img src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop" alt="Jembatan Ampera" className="size-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <img src="/logo.png" alt="Benah Palembang" className="h-8 brightness-0 invert" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">Daftar untuk menyimpan cerita dan mengikuti agenda pilihanmu.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 text-white sm:p-14">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="Benah Palembang" className="h-6" />
          </Link>
          <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">Bergabung bersama.</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">Buat ruang personalmu di Benah Palembang.</p>
          <form onSubmit={(event) => event.preventDefault()} className="mt-8 space-y-4">
            <label className="block text-xs font-semibold text-white/80">
              Nama Lengkap
              <input 
                type="text" 
                required 
                placeholder="Nama Anda" 
                className="mt-2 h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 text-sm text-white outline-none focus:bg-zinc-900 focus:border-palembang-gold focus:ring-[3px] focus:ring-palembang-gold/30 placeholder:text-white/40" 
              />
            </label>
            <label className="block text-xs font-semibold text-white/80">
              Email
              <input 
                type="email" 
                required 
                placeholder="nama@email.com" 
                className="mt-2 h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 text-sm text-white outline-none focus:bg-zinc-900 focus:border-palembang-gold focus:ring-[3px] focus:ring-palembang-gold/30 placeholder:text-white/40" 
              />
            </label>
            <label className="block text-xs font-semibold text-white/80">
              Password
              <div className="relative mt-2">
                <input 
                  type={showPw ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  className="h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 pr-10 text-sm text-white outline-none focus:bg-zinc-900 focus:border-palembang-gold focus:ring-[3px] focus:ring-palembang-gold/30 placeholder:text-white/40" 
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white" tabIndex={-1}>
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
            <label className="block text-xs font-semibold text-white/80">
              Konfirmasi Password
              <div className="relative mt-2">
                <input 
                  type={showConfirm ? "text" : "password"} 
                  required 
                  placeholder="••••••••" 
                  className="h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 pr-10 text-sm text-white outline-none focus:bg-zinc-900 focus:border-palembang-gold focus:ring-[3px] focus:ring-palembang-gold/30 placeholder:text-white/40" 
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 transition-colors hover:text-white" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
            <Button type="submit" className="mt-3 h-11 w-full bg-palembang-gold text-palembang-charcoal hover:bg-palembang-gold/90 font-bold">
              Daftar <ArrowRight className="size-4" />
            </Button>
          </form>
          <p className="mt-8 text-center text-xs text-white/50">
            Sudah punya akun? <Link to="/login" className="font-semibold text-palembang-gold hover:underline">Masuk sekarang</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

export function ForgotPasswordPage() {
  const [sent, setSent] = useState(false)
  return (
    <main className="flex min-h-svh items-center justify-center bg-palembang-charcoal px-6 py-32">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 shadow-xl backdrop-blur-sm lg:grid-cols-2">
        <div className="relative hidden min-h-[600px] overflow-hidden bg-palembang-charcoal lg:block">
          <img src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop" alt="Jembatan Ampera" className="size-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <img src="/logo.png" alt="Benah Palembang" className="h-8 brightness-0 invert" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 text-white sm:p-14">
          <Link to="/" className="inline-block">
            <img src="/logo.png" alt="Benah Palembang" className="h-6" />
          </Link>
          <h1 className="mt-16 font-display text-4xl font-bold tracking-[-0.04em]">Lupa password?</h1>
          <p className="mt-3 text-sm leading-6 text-white/60">Masukkan alamat email yang terdaftar dan kami akan mengirimkan tautan reset password.</p>
          {sent ? (
            <div className="mt-8 rounded-xl border border-palembang-gold/30 bg-palembang-gold/10 p-6">
              <div className="flex items-center gap-3 text-palembang-gold">
                <Check className="size-5" />
                <p className="text-sm font-semibold">Email terkirim!</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-white/60">Silakan cek inbox email kamu untuk tautan reset password. Jika tidak muncul, periksa folder spam.</p>
              <Link to="/login" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-gold hover:underline">
                <ArrowRight className="size-3 rotate-180" /> Kembali ke login
              </Link>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSent(true) }} className="mt-8 space-y-4">
              <label className="block text-xs font-semibold text-white/80">
                Email
                <input 
                  type="email" 
                  required 
                  placeholder="nama@email.com" 
                  className="mt-2 h-11 w-full rounded-md border border-white/20 bg-zinc-900 px-3 text-sm text-white outline-none focus:bg-zinc-900 focus:border-palembang-gold focus:ring-[3px] focus:ring-palembang-gold/30 placeholder:text-white/40" 
                />
              </label>
              <Button type="submit" className="mt-3 h-11 w-full bg-palembang-gold text-palembang-charcoal hover:bg-palembang-gold/90 font-bold">
                <Mail className="size-4" /> Kirim tautan reset
              </Button>
            </form>
          )}
          <p className="mt-8 text-center text-xs text-white/50">
            Sudah ingat? <Link to="/login" className="font-semibold text-palembang-gold hover:underline">Masuk sekarang</Link>
          </p>
        </div>
      </div>
    </main>
  )
}


function CTASection() {
  return <section className="bg-palembang-red px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32"><div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-12 lg:flex-row lg:items-end"><div><p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">Buka ruang kolaborasi</p><h2 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl">Kota ini milik<br />kita semua.</h2></div><div className="max-w-sm"><p className="text-sm leading-7 text-white/75">Punya cerita, ide, atau ingin membuat sesuatu bersama? Kami ingin mendengarnya.</p><Link to="/kolaborasi" className="mt-7 flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-palembang-charcoal transition-transform hover:-translate-y-1">Let's collaborate <ArrowRight className="size-4" /></Link></div></div></section>
}

export function NotFound() {
  return <main className="flex min-h-svh items-center justify-center px-6 text-center"><div><p className="font-display text-7xl font-black text-palembang-red">404</p><h1 className="mt-4 font-display text-3xl font-bold">Cerita ini belum ditemukan.</h1><Link to="/" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-red">Kembali ke beranda <ArrowRight className="size-4" /></Link></div></main>
}

export function PublicLayout() {
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}
