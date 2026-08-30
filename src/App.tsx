import { useEffect, useState } from "react"
import {
  ArrowLeft,
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
  X,
  Sun,
  Moon,
} from "lucide-react"
import {
  Link,
  Route,
  Routes,
  useParams,
  useNavigate,
  useLocation,
  Outlet,
  Navigate,
} from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Header } from "@/components/ui/navbar"
import { useAuth } from "@/context/AuthContext"
import { useTheme } from "@/context/ThemeContext"
import { toast } from "sonner"
import { Toaster } from "@/components/ui/sonner"
import { DashboardLayout } from "@/components/dashboard/DashboardLayout"
import { Overview } from "@/pages/dashboard/Overview"
import { CreateArticle } from "@/pages/dashboard/CreateArticle"
import { CreateArticleEditor } from "@/pages/dashboard/CreateArticleEditor"
import { CreateEvent } from "@/pages/dashboard/CreateEvent"
import { CreateEventEditor } from "@/pages/dashboard/CreateEventEditor"
import { LogActivities } from "@/pages/dashboard/LogActivities"
import { Profile } from "@/pages/dashboard/Profile"
import { ManageWebsite } from "@/pages/dashboard/ManageWebsite"
import { ManageUser } from "@/pages/dashboard/ManageUser"
import { ManageAdmin } from "@/pages/dashboard/ManageAdmin"
import { UserProfile } from "@/pages/dashboard/UserProfile"
import { ManageContent } from "@/pages/dashboard/ManageContent"
import { ArticlePreview } from "@/pages/dashboard/ArticlePreview"
import { EventPreview } from "@/pages/dashboard/EventPreview"
import { Footer as ModemAnimatedFooter } from "@/components/ui/modem-animated-footer"
import { usePageSEO } from "@/hooks/usePageSEO"
import { useScrollReveal } from "@/hooks/useScrollReveal"
import { generateArticleJsonLd, generateEventJsonLd } from "@/components/seo/StructuredData"
import {
  agendaItems,
  articles,
  authors,
  categoryMeta,
  heroSlides,
  teamMembers,
  type Article,
  type Category,
} from "@/data/mockData"

const categories = Object.keys(categoryMeta) as Category[]

interface CommentItem {
  id: number | string
  name: string
  avatar: string
  time: string
  text: string
}

const dummyComments: CommentItem[] = [
  { id: 1, name: "Rina Sari", avatar: "https://i.pravatar.cc/80?img=1", time: "2 jam lalu", text: "Artikel yang sangat menarik! Palembang memang penuh dengan cerita yang perlu diangkat." },
  { id: 2, name: "Budi Hartono", avatar: "https://i.pravatar.cc/80?img=3", time: "5 jam lalu", text: "Terima kasih sudah mengangkat topik ini. Sebagai warga Palembang, saya sangat tersentuh." },
  { id: 3, name: "Dewi Ayu", avatar: "https://i.pravatar.cc/80?img=5", time: "1 hari lalu", text: "Sudah lama menunggu platform seperti ini. Semoga terus berkembang dan konsisten!" },
  { id: 4, name: "Ahmad Fauzi", avatar: "https://i.pravatar.cc/80?img=8", time: "2 hari lalu", text: "Perspektif yang segar. Saya suka cara penulisannya yang mendalam tapi tetap ringan dibaca." },
  { id: 5, name: "Siti Rahma", avatar: "https://i.pravatar.cc/80?img=9", time: "3 hari lalu", text: "Foto dan visual pendukungnya luar biasa ciamik. Bangga dengan kebudayaan kita!" },
  { id: 6, name: "Reza Pratama", avatar: "https://i.pravatar.cc/80?img=11", time: "4 hari lalu", text: "Ditunggu liputan seputar kuliner malam lorong basah dan tempat nongkrong seni lainnya." },
]

function Footer() {
  return <ModemAnimatedFooter />
}

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description?: string; dark?: boolean }) {
  return (
    <div className="reveal-on-scroll flex flex-col gap-4">
      <p className="flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] text-palembang-red">
        <span className="h-px w-8 bg-palembang-red" />{eyebrow}
      </p>
      <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl text-foreground">{title}</h2>
      {description && <p className="max-w-lg text-sm leading-7 text-muted-foreground">{description}</p>}
    </div>
  )
}

const masonryAspects = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[1/1]", "aspect-[3/5]", "aspect-[4/3]", "aspect-[5/6]", "aspect-[2/3]", "aspect-[7/8]", "aspect-[5/7]", "aspect-[3/4]"]
function getCardAspect(id: string | number, featured: boolean) {
  if (featured) return "aspect-[16/9]"
  const numId = typeof id === "string" ? parseInt(id.replace(/\D/g, "")) || id.length : id
  return masonryAspects[numId % masonryAspects.length]
}

function ArticleCard({ article, featured = false, masonry = false }: { article: Article; featured?: boolean; masonry?: boolean }) {
  const aspect = masonry ? getCardAspect(article.id, false) : (featured ? "aspect-[4/3] lg:aspect-[16/9]" : "aspect-[4/3]")
  return (
    <Link
      to={`/artikel/${article.slug}`}
      className={`group relative block overflow-hidden ${masonry ? "mb-4 sm:mb-6 break-inside-avoid" : ""} ${featured && !masonry ? "col-span-2 lg:col-span-2" : "col-span-1"}`}
    >
      <div className={`img-zoom relative overflow-hidden rounded-xl sm:rounded-[1.5rem] ${aspect} border border-border/40 bg-card`}>
        <img src={article.coverImage} alt={article.title} className="size-full object-cover transition-transform duration-700 group-hover:scale-105" loading="lazy" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 sm:p-7">
          <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.16em]">
            <span className="text-palembang-red">{article.category}</span>
            <span className="text-white/60">{article.publishedAt}</span>
          </div>
          <h3 className={`font-display font-bold leading-[1.1] tracking-[-0.035em] text-white ${featured && !masonry ? "text-lg sm:text-2xl lg:text-4xl" : "text-base sm:text-xl lg:text-2xl"}`}>
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[10px] leading-4 sm:text-xs sm:leading-5 text-white/80 sm:text-sm">{article.excerpt}</p>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-palembang-red">
            Lihat Artikel <ArrowRight className="size-3 sm:size-4" />
          </div>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 px-1">
        <h4 className="font-display text-xs sm:text-sm font-bold leading-snug tracking-[-0.02em] line-clamp-2 group-hover:text-palembang-red text-foreground transition-colors duration-300">
          {article.title}
        </h4>
        <p className="mt-1 line-clamp-2 text-[10px] sm:text-xs leading-4 sm:leading-5 text-muted-foreground">{article.excerpt}</p>
      </div>
    </Link>
  )
}

function Hero() {
  const [slide, setSlide] = useState(0)
  useEffect(() => { const timer = window.setInterval(() => setSlide((value) => (value + 1) % heroSlides.length), 6000); return () => window.clearInterval(timer) }, [])
  const current = heroSlides[slide]
  return (
    <section className="relative h-svh min-h-svh sm:h-[min(850px,100svh)] sm:min-h-[680px] w-full overflow-hidden bg-palembang-charcoal text-white">
      <div className="absolute inset-0">
        <img src={current.image} alt="Palembang" className="size-full object-cover opacity-65 transition-all duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/85" />
      </div>
      <div className="relative mx-auto flex h-full max-w-[1380px] flex-col items-center justify-center px-6 pt-12 pb-20 sm:pt-0 sm:pb-0 text-center">
        <div className="reveal-on-scroll mb-4 sm:mb-6 flex items-center gap-3 text-[9px] sm:text-[10px] font-bold uppercase tracking-[0.3em] text-palembang-red">
          <span className="h-px w-6 sm:w-8 bg-palembang-red" />{current.tag}<span className="h-px w-6 sm:w-8 bg-palembang-red" />
        </div>
        <h1 className="reveal-on-scroll delay-100 max-w-5xl whitespace-pre-line font-display text-[clamp(2.15rem,7.5vw,5rem)] font-black leading-[0.84] tracking-[-0.07em]">
          {current.title}
        </h1>
        <p className="reveal-on-scroll delay-200 mt-5 sm:mt-8 max-w-md text-xs sm:text-base leading-5 sm:leading-6 text-white/75">
          Ruang untuk cerita, budaya, kreativitas, dan kehidupan Palembang.
        </p>
        <Link to="/cerita-warga" className="reveal-on-scroll delay-300 mt-6 sm:mt-8 flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-palembang-charcoal transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
          Jelajahi cerita <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="reveal-fade delay-400 absolute bottom-6 sm:bottom-10 left-6 right-6 mx-auto flex max-w-[1380px] items-end justify-between z-10">
        <div className="flex gap-2">
          {heroSlides.map((item, index) => (
            <button key={item.id} aria-label={`Slide ${index + 1}`} onClick={() => setSlide(index)} className={`h-1 transition-all ${index === slide ? "w-10 sm:w-12 bg-palembang-red" : "w-4 sm:w-5 bg-white/40"}`} />
          ))}
        </div>
        <div className="flex gap-2">
          <button aria-label="Slide sebelumnya" onClick={() => setSlide((slide - 1 + heroSlides.length) % heroSlides.length)} className="rounded-full border border-white/30 p-1.5 sm:p-2 transition-colors hover:bg-white/15">
            <ChevronLeft className="size-3.5 sm:size-4" />
          </button>
          <button aria-label="Slide berikutnya" onClick={() => setSlide((slide + 1) % heroSlides.length)} className="rounded-full border border-white/30 p-1.5 sm:p-2 transition-colors hover:bg-white/15">
            <ChevronRight className="size-3.5 sm:size-4" />
          </button>
        </div>
      </div>
    </section>
  )
}

function CategorySection({ category, featuredFirst = true }: { category: Category; variant?: "red" | "dark" | "off-white" | "default"; featuredFirst?: boolean }) {
  const categoryArticles = articles.filter(a => a.category === category).slice(0, 3)
  if (categoryArticles.length === 0) return null
  const meta = categoryMeta[category]

  return (
    <section className="relative overflow-hidden bg-background text-foreground px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
      <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-10 lg:opacity-20 dark:opacity-20 dark:lg:opacity-30">
        <img src={meta.image} alt={category} className="size-full object-cover object-right" />
        <div className="absolute inset-0 bg-gradient-to-r from-background via-background/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
      </div>
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading eyebrow="Kategori Cerita" title={category} description={meta.description} />
          <Link to={`/${meta.slug}`} className="reveal-on-scroll group hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-palembang-red md:flex">
            Lihat semua <span className="rounded-full border border-palembang-red p-2 transition-colors group-hover:bg-palembang-red group-hover:text-white"><ArrowRight className="size-4" /></span>
          </Link>
        </div>
        <div className="reveal-stagger mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {categoryArticles.map((article, index) => <ArticleCard key={article.id} article={article} featured={featuredFirst && index === 0} />)}
        </div>
        <div className="mt-12 flex justify-end md:hidden">
          <Link to={`/${meta.slug}`} className="reveal-on-scroll group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-palembang-red">
            Lihat semua <span className="rounded-full border border-palembang-red p-2 transition-colors group-hover:bg-palembang-red group-hover:text-white"><ArrowRight className="size-4" /></span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function HomePage() {
  usePageSEO({
    title: "Beranda",
    description: "Benah Palembang adalah platform editorial independen dan ruang kolaborasi yang mengangkat cerita warga, gaya hidup, ruang kota, industri kreatif, kebudayaan, serta agenda terkini di Kota Palembang.",
    keywords: "Benah Palembang, Benah, Palembang, Kota Palembang, Pempek, Berita Palembang, Cerita Warga, Gaya Hidup, Ruang Kota, Industri Kreatif, Kebudayaan, Kuliner Palembang, Wisata Palembang, Event Palembang, Agenda Palembang, Media Palembang",
    canonicalPath: "/",
  })
  const featured = articles.filter((article) => article.featured).slice(0, 3)

  const perspectives = [
    { num: "01", title: "Cerita Warga", slug: "cerita-warga", count: `${categoryMeta["Cerita Warga"].count} stories` },
    { num: "02", title: "Gaya Hidup", slug: "gaya-hidup", count: `${categoryMeta["Gaya Hidup"].count} stories` },
    { num: "03", title: "Ruang Kota", slug: "ruang-kota", count: `${categoryMeta["Ruang Kota"].count} stories` },
    { num: "04", title: "Industri Kreatif", slug: "industri-kreatif", count: `${categoryMeta["Industri Kreatif"].count} stories` },
    { num: "05", title: "Kebudayaan", slug: "kebudayaan", count: `${categoryMeta["Kebudayaan"].count} stories` },
    { num: "06", title: "Agenda Kota", slug: "agenda", count: `${agendaItems.length} agenda` },
  ]

  return (
    <>
      <Hero />
      <main className="bg-background text-foreground">
        {/* Section 1: About Benah Palembang */}
        <section className="reveal-on-scroll px-6 py-24 sm:px-10 lg:px-16 lg:py-36 bg-background text-foreground">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.75fr_1.7fr]">
            <div className="reveal-slide-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-palembang-red">About Benah Palembang</p>
              <div className="mt-8 h-24 w-px bg-palembang-red/50" />
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">Est. 2025 · Palembang</p>
            </div>
            <div className="reveal-on-scroll delay-150">
              <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl text-foreground">
                Merekam, merayakan, dan menggerakkan <span className="text-palembang-red">Palembang.</span>
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground">
                Benah Palembang adalah platform editorial yang percaya bahwa kota bukan hanya tentang bangunan dan jalan. Ia adalah tentang manusia, ingatan, budaya, dan cerita-cerita kecil yang membentuk identitas kita.
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-palembang-red">
                <span className="rounded-full border border-palembang-red/40 bg-palembang-red/10 p-2">
                  <Sparkles className="size-4 text-palembang-red" />
                </span>{" "}
                Untuk kota yang lebih hidup
              </div>
            </div>
          </div>
        </section>

        {/* Section 2: Jelajahi Perspektif (6 Items) */}
        <section className="reveal-on-scroll px-6 py-24 sm:px-10 lg:px-16 lg:py-32 bg-background text-foreground">
          <div className="mx-auto max-w-[1240px]">
            <SectionHeading eyebrow="Jelajahi perspektif" title="Satu kota, banyak cerita." />
            <div className="reveal-stagger mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-border border border-border sm:grid-cols-3 lg:grid-cols-6">
              {perspectives.map((item) => (
                <Link
                  key={item.title}
                  to={`/${item.slug}`}
                  className="group relative min-h-48 sm:min-h-64 overflow-hidden bg-card p-4 sm:p-6 transition-colors hover:bg-muted text-foreground"
                >
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <span className="font-display text-3xl sm:text-5xl text-palembang-red">
                        {item.num}
                      </span>
                      <h3 className="mt-3 sm:mt-5 font-display text-lg sm:text-2xl font-bold leading-tight text-foreground group-hover:text-palembang-red transition-colors">
                        {item.title}
                      </h3>
                    </div>
                    <span className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.13em] text-muted-foreground group-hover:text-foreground mt-4 sm:mt-0">
                      <span>{item.count}</span>
                      <ArrowUpRight className="size-4 sm:size-5 text-palembang-red transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 mt-1 sm:mt-0" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>

        {/* Section 3: Pilihan Redaksi (3 Articles: 1 big + 2 below on mobile) */}
        <section className="relative overflow-hidden bg-background px-6 py-24 text-foreground sm:px-10 lg:px-16 lg:py-32">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-10 lg:opacity-20 dark:opacity-20 dark:lg:opacity-30">
            <img
              src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop"
              alt=""
              className="size-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-background via-background/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-transparent to-background" />
          </div>
          <div className="relative z-10 mx-auto max-w-[1240px]">
            <SectionHeading
              eyebrow="Pilihan redaksi"
              title="Cerita dari Palembang"
              description="Menyusuri denyut kota melalui cerita warga, ruang kota, budaya, dan mereka yang membuat Palembang terus bergerak."
            />
            <div className="reveal-stagger mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
              {featured.map((article, index) => (
                <ArticleCard key={article.id} article={article} featured={index === 0} />
              ))}
            </div>
            <div className="mt-12 flex justify-end">
              <Link
                to="/cerita-warga"
                className="reveal-on-scroll group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-foreground hover:text-palembang-red transition-colors"
              >
                Lihat semua cerita{" "}
                <span className="rounded-full border border-palembang-red p-2 text-palembang-red transition-colors group-hover:bg-palembang-red group-hover:text-white">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>

        {/* Category Sections (3 Articles each: 1 big + 2 below on mobile) */}
        <CategorySection category="Gaya Hidup" featuredFirst />
        <CategorySection category="Ruang Kota" featuredFirst />
        <CategorySection category="Industri Kreatif" featuredFirst />
        <CategorySection category="Kebudayaan" featuredFirst />

        {/* Our Team */}
        <section className="reveal-on-scroll bg-background px-6 py-24 text-foreground sm:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-[1240px]">
            <SectionHeading
              eyebrow="Orang-orang di balik cerita"
              title="Our Team"
              description="Kami adalah kumpulan penulis, fotografer, peneliti, dan warga kota yang percaya pada kekuatan cerita."
            />
            <div className="reveal-stagger mt-10 sm:mt-12 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
              {teamMembers.map((member) => (
                <div key={member.id} className="group rounded-2xl bg-card border border-border p-4 transition-all hover:shadow-md">
                  <div className="img-zoom aspect-[4/5] overflow-hidden rounded-xl bg-muted border border-border/50">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="size-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                      loading="lazy"
                    />
                  </div>
                  <p className="mt-3 sm:mt-4 font-display text-lg sm:text-xl font-bold text-foreground">{member.name}</p>
                  <p className="mt-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-red">
                    {member.role}
                  </p>
                  <p className="mt-2 text-xs sm:text-sm leading-5 sm:leading-6 text-muted-foreground line-clamp-3 sm:line-clamp-none">
                    {member.bio}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <CTASection />
      </main>
      <Footer />
    </>
  )
}

function CategoryPage({ category }: { category: Category }) {
  const [query, setQuery] = useState("")
  const [showAll, setShowAll] = useState(false)
  const meta = categoryMeta[category]

  usePageSEO({
    title: category,
    description: meta.description,
    keywords: `${category}, ${category} Palembang, Cerita Palembang, Berita Palembang, Benah Palembang, Kota Palembang`,
    ogImage: meta.image,
    canonicalPath: `/${meta.slug}`,
  })

  useEffect(() => {
    setShowAll(false)
    setQuery("")
  }, [category])

  const filtered = articles.filter((article) => article.category === category && `${article.title} ${article.excerpt}`.toLowerCase().includes(query.toLowerCase()))
  const initialCount = 12
  const visibleArticles = showAll || query ? filtered : filtered.slice(0, initialCount)
  const hasMore = !showAll && !query && filtered.length > initialCount

  return (
    <>
      <div className="relative overflow-hidden bg-palembang-charcoal px-6 pb-12 pt-32 text-white sm:px-10 sm:pb-14 sm:pt-36 lg:px-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-25 lg:opacity-40">
          <img src={meta.image} alt={category} className="size-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <p className="reveal-on-scroll text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Category / {category}</p>
          <h1 className="reveal-on-scroll delay-100 mt-4 max-w-4xl font-display text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-8xl">{category}</h1>
          <p className="reveal-on-scroll delay-150 mt-4 max-w-lg text-sm leading-6 text-white/65 sm:text-base">{meta.description}</p>
          <div className="reveal-on-scroll delay-200 mt-6 flex max-w-md items-center gap-2.5 border-b border-white/30 pb-2">
            <Search className="size-4 text-white/50 shrink-0" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search stories..."
              aria-label="Search stories"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-white/50 hover:text-white p-0.5" aria-label="Hapus pencarian">
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="relative px-6 py-10 sm:px-10 sm:py-12 lg:px-16 lg:py-16">
        <div className="mx-auto max-w-[1240px]">
          {filtered.length > 0 ? (
            <div className="relative">
              <div className="reveal-stagger columns-2 gap-3 sm:columns-2 sm:gap-6 lg:columns-4">
                {visibleArticles.map((article) => (
                  <ArticleCard key={article.id} article={article} masonry />
                ))}
              </div>
              {hasMore && (
                <div className="reveal-on-scroll absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-6 backdrop-blur-[2px]">
                  <button
                    onClick={() => setShowAll(true)}
                    className="group flex items-center gap-3 rounded-full border border-border bg-background/95 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red"
                  >
                    Show More <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="reveal-on-scroll py-16 text-center">
              <p className="font-display text-3xl">Cerita tidak ditemukan.</p>
              <p className="mt-3 text-sm text-muted-foreground">Coba kata kunci lain.</p>
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  )
}

function ArticlePage() {
  const { slug } = useParams()
  const { user } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const article = articles.find((item) => item.slug === slug) ?? articles[0]
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  
  // Load comments from localStorage or fallback to dummyComments
  const [comments, setComments] = useState<CommentItem[]>(() => {
    try {
      const saved = localStorage.getItem(`comments_${article.slug}`)
      if (saved) {
        return JSON.parse(saved)
      }
    } catch {}
    return dummyComments
  })

  // 2 stories for the 2-column layout
  const related = articles.filter((item) => item.category === article.category && item.id !== article.id).slice(0, 2)

  usePageSEO({
    title: article.title,
    description: article.excerpt,
    keywords: `${article.tags.join(", ")}, Benah Palembang, Berita Palembang, Kota Palembang, ${article.category}`,
    ogImage: article.coverImage,
    canonicalPath: `/artikel/${article.slug}`,
    ogType: "article",
    jsonLd: generateArticleJsonLd(article),
  })

  const copyLink = async () => {
    await navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const handleLike = () => {
    if (!user) {
      toast.error("Silakan login terlebih dahulu untuk menyukai artikel.")
      navigate("/login", { state: { from: location.pathname } })
      return
    }
    setLiked((value) => !value)
  }

  const handleCommentSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error("Silakan login terlebih dahulu untuk mengirim komentar.")
      navigate("/login", { state: { from: location.pathname } })
      return
    }
    if (!commentText.trim()) {
      toast.error("Silakan tulis komentar terlebih dahulu.")
      return
    }

    const newComment = {
      id: Date.now(),
      name: user.name,
      avatar: user.avatar,
      time: "Baru saja",
      text: commentText.trim(),
    }

    const updatedComments = [newComment, ...comments]
    setComments(updatedComments)

    try {
      localStorage.setItem(`comments_${article.slug}`, JSON.stringify(updatedComments))
    } catch {}

    setCommentText("")
    toast.success("Komentar berhasil dikirim!")
  }

  const visibleComments = showAllComments ? comments : comments.slice(0, 4)
  const hasMoreComments = comments.length > 4 && !showAllComments

  return (
    <>
      <main className="pt-24">
        <article>
          <header className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-28 text-white sm:px-10 lg:px-16">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-45">
              <img src={article.coverImage} alt={article.title} className="size-full object-cover object-right" />
              <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
            </div>
            <div className="relative z-10 mx-auto max-w-[1040px]">
              <Link to={`/${categoryMeta[article.category].slug}`} className="reveal-on-scroll text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">
                {article.category}
              </Link>
              <h1 className="reveal-on-scroll delay-100 mt-6 max-w-4xl font-display text-4xl font-black leading-[1.0] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                {article.title}
              </h1>
              <p className="reveal-on-scroll delay-150 mt-8 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{article.excerpt}</p>
              <div className="reveal-on-scroll delay-200 mt-10 flex flex-wrap items-center justify-between gap-6 border-y border-white/15 py-5">
                <Link
                  to={`/penulis/${encodeURIComponent(article.author.name)}`}
                  className="group flex items-center gap-3 transition-transform hover:translate-x-0.5"
                  title={`Lihat profil ${article.author.name}`}
                >
                  <img
                    src={article.author.avatar}
                    alt={article.author.name}
                    className="size-11 rounded-full object-cover ring-2 ring-transparent transition-all group-hover:ring-palembang-red group-hover:scale-105"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white transition-colors group-hover:text-palembang-red flex items-center gap-1.5">
                      {article.author.name}
                      <ArrowUpRight className="size-3 text-palembang-red opacity-0 transition-opacity group-hover:opacity-100" />
                    </p>
                    <p className="text-xs text-white/60">{article.author.role} · {article.publishedAt}</p>
                  </div>
                </Link>
                <div className="flex items-center gap-5 text-xs text-white/70">
                  <span className="flex items-center gap-2"><Clock3 className="size-4" />{article.readingTime} min read</span>
                  <span className="flex items-center gap-2"><Heart className="size-4" />{article.likes.toLocaleString()} likes</span>
                  <span>{article.views.toLocaleString()} views</span>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-[1040px] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[60px_1fr] lg:py-20">
            <aside className="hidden lg:block">
              <div className="reveal-fade delay-200 sticky top-28 flex flex-col items-center gap-3">
                <button
                  aria-label="Sukai artikel"
                  onClick={handleLike}
                  className={`rounded-full border p-3 transition-colors ${liked ? "border-palembang-red bg-palembang-red text-white" : "border-border hover:border-palembang-red hover:text-palembang-red"}`}
                >
                  <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
                </button>
                <button
                  aria-label="Bagikan artikel"
                  onClick={() => void navigator.share?.({ title: article.title, url: window.location.href })}
                  className="rounded-full border border-border p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"
                >
                  <Share2 className="size-4" />
                </button>
                <button
                  aria-label="Salin tautan"
                  onClick={() => void copyLink()}
                  className="rounded-full border border-border p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"
                >
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                </button>
              </div>
            </aside>

            <div className="reveal-on-scroll">
              <div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} />
              <div className="mt-10 flex flex-wrap gap-2">
                {article.tags.map((tag) => (
                  <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-xs opacity-75">#{tag}</span>
                ))}
              </div>

              {/* Author Bio Card */}
              <Link
                to={`/penulis/${encodeURIComponent(article.author.name)}`}
                className="reveal-on-scroll mt-12 group flex items-center gap-4 rounded-2xl border border-border bg-muted/30 p-5 transition-all hover:bg-muted/60 hover:border-palembang-red/40"
              >
                <img
                  src={article.author.avatar}
                  alt={article.author.name}
                  className="size-14 rounded-full object-cover ring-2 ring-palembang-red/30 group-hover:ring-palembang-red transition-all shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-palembang-red">Ditulis Oleh</span>
                  <h4 className="font-display text-base font-bold text-foreground group-hover:text-palembang-red transition-colors flex items-center gap-1.5">
                    {article.author.name}
                    <ArrowUpRight className="size-3.5 text-palembang-red" />
                  </h4>
                  <p className="mt-1 text-xs text-muted-foreground line-clamp-2">{article.author.bio}</p>
                </div>
              </Link>

              <div className="mt-8 flex gap-3 lg:hidden">
                <Button variant="outline" size="sm" onClick={handleLike}>
                  <Heart className={`size-4 ${liked ? "fill-palembang-red text-palembang-red" : ""}`} /> Suka
                </Button>
                <Button variant="outline" size="sm" onClick={() => void copyLink()}>
                  {copied ? <Check className="size-4" /> : <Copy className="size-4" />} Salin tautan
                </Button>
              </div>

              {/* ── Komentar Section (Fully Functional) ── */}
              <div className="reveal-on-scroll mt-16 border-t border-border pt-10">
                <div className="flex items-center gap-3 mb-8">
                  <MessageCircle className="size-5 text-palembang-red" />
                  <h3 className="font-display text-xl font-bold tracking-[-0.03em]">Komentar ({comments.length})</h3>
                </div>

                {!user ? (
                  <div className="mb-8 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-border bg-muted/40 p-5">
                    <div className="flex items-center gap-3">
                      <div className="flex size-10 items-center justify-center rounded-full bg-palembang-red/10 text-palembang-red shrink-0">
                        <MessageCircle className="size-5" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-foreground">Ingin ikut berkomentar?</p>
                        <p className="text-xs text-muted-foreground">Silakan masuk ke akun Anda terlebih dahulu.</p>
                      </div>
                    </div>
                    <Button
                      type="button"
                      onClick={() => {
                        toast.error("Silakan login terlebih dahulu untuk mengirim komentar.")
                        navigate("/login", { state: { from: location.pathname } })
                      }}
                      className="w-full sm:w-auto bg-palembang-red text-white hover:bg-palembang-red/90 font-semibold text-xs px-5"
                    >
                      Masuk untuk Komentar
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleCommentSubmit} className="mb-8 space-y-3">
                    <div className="flex gap-3">
                      <Link to={`/penulis/${encodeURIComponent(user.name)}`} title={`Lihat profil ${user.name}`}>
                        <img
                          src={user.avatar}
                          alt="Avatar"
                          className="size-10 rounded-full object-cover border border-border bg-muted shrink-0 hover:ring-2 hover:ring-palembang-red transition-all cursor-pointer"
                        />
                      </Link>
                      <div className="flex flex-1 items-center gap-2 rounded-2xl border border-border bg-muted/50 px-4 py-2.5 focus-within:border-palembang-red focus-within:ring-2 focus-within:ring-palembang-red/20 transition-all">
                        <input
                          placeholder={`Tulis komentar sebagai ${user.name}...`}
                          value={commentText}
                          onChange={(e) => setCommentText(e.target.value)}
                          className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground text-foreground"
                        />
                        <button
                          type="submit"
                          className="rounded-full p-2 text-white bg-palembang-red transition-all hover:bg-palembang-red/90 hover:scale-105 active:scale-95 disabled:opacity-50"
                          disabled={!commentText.trim()}
                          aria-label="Kirim Komentar"
                        >
                          <Send className="size-3.5" />
                        </button>
                      </div>
                    </div>
                  </form>
                )}

                <div className="relative">
                  <div className="reveal-stagger space-y-6">
                    {visibleComments.map((c) => (
                      <div key={c.id} className="flex gap-3.5 p-3.5 rounded-xl border border-border/40 bg-muted/20 hover:bg-muted/30 transition-colors">
                        <Link
                          to={`/penulis/${encodeURIComponent(c.name)}`}
                          className="group shrink-0 relative block"
                          title={`Lihat profil ${c.name}`}
                        >
                          <img
                            src={c.avatar}
                            alt={c.name}
                            className="size-10 rounded-full object-cover shrink-0 border border-border/60 bg-muted ring-2 ring-transparent transition-all group-hover:ring-palembang-red group-hover:scale-105"
                          />
                        </Link>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2">
                            <Link
                              to={`/penulis/${encodeURIComponent(c.name)}`}
                              className="text-sm font-semibold truncate hover:text-palembang-red transition-colors flex items-center gap-1 group/name"
                              title={`Lihat profil ${c.name}`}
                            >
                              <span>{c.name}</span>
                              <ArrowUpRight className="size-3 text-palembang-red opacity-0 transition-opacity group-hover/name:opacity-100" />
                            </Link>
                            <span className="text-[10px] text-muted-foreground shrink-0">{c.time}</span>
                          </div>
                          <p className="mt-1.5 text-sm leading-6 opacity-90 break-words">{c.text}</p>
                        </div>
                      </div>
                    ))}
                  </div>

                  {hasMoreComments && (
                    <div className="reveal-on-scroll absolute inset-x-0 -bottom-4 flex h-36 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-2 backdrop-blur-[2px]">
                      <button
                        onClick={() => setShowAllComments(true)}
                        className="group flex items-center gap-2 rounded-full border border-border bg-background/95 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-palembang-red hover:text-palembang-red"
                      >
                        Show More ({comments.length - 4}) <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      {/* ── More Stories (2 Columns) ── */}
      <section className="reveal-on-scroll bg-background px-6 py-20 text-foreground sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <div className="flex items-end justify-between gap-6">
            <SectionHeading eyebrow="Lanjutkan membaca" title="More Stories" />
            <Link
              to={`/${categoryMeta[article.category].slug}`}
              className="reveal-on-scroll hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-muted-foreground hover:text-foreground transition-colors sm:flex"
            >
              View all stories <ArrowRight className="size-4 text-palembang-red" />
            </Link>
          </div>
          <div className="reveal-stagger mt-12 grid gap-8 sm:grid-cols-2">
            {related.map((item) => (
              <ArticleCard key={item.id} article={item} />
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

function AgendaPage() {
  usePageSEO({
    title: "Agenda",
    description: "Temukan jadwal acara, workshop seni, festival budaya, dan ruang pertemuan kreatif terkini di Kota Palembang.",
    keywords: "Agenda Palembang, Event Palembang, Acara Palembang, Festival Palembang, Workshop Palembang, Komunitas Palembang, Benah Palembang",
    canonicalPath: "/agenda",
  })

  const [filter, setFilter] = useState<"this-month" | "upcoming" | "past">("this-month")
  const [searchQuery, setSearchQuery] = useState("")
  const [showAll, setShowAll] = useState(false)

  useEffect(() => {
    setShowAll(false)
  }, [filter, searchQuery])

  const filteredAgenda = agendaItems.filter(item => {
    const itemPeriod = item.period || (item.date.includes("2026") && item.date.includes("Agustus") ? "this-month" : item.date.includes("2026") ? "upcoming" : "past")
    const matchesPeriod = itemPeriod === filter
    const matchesSearch = !searchQuery.trim() ||
      `${item.title} ${item.description} ${item.location} ${item.category} ${item.organizer}`.toLowerCase().includes(searchQuery.trim().toLowerCase())
    return matchesPeriod && matchesSearch
  })

  const thisMonthCount = agendaItems.filter(a => (a.period || (a.date.includes("2026") && a.date.includes("Agustus") ? "this-month" : a.date.includes("2026") ? "upcoming" : "past")) === "this-month").length
  const upcomingCount = agendaItems.filter(a => (a.period || (a.date.includes("2026") && a.date.includes("Agustus") ? "this-month" : a.date.includes("2026") ? "upcoming" : "past")) === "upcoming").length
  const pastCount = agendaItems.filter(a => (a.period || (a.date.includes("2026") && a.date.includes("Agustus") ? "this-month" : a.date.includes("2026") ? "upcoming" : "past")) === "past").length

  const initialCount = 12
  const visibleAgenda = showAll || searchQuery.trim() ? filteredAgenda : filteredAgenda.slice(0, initialCount)
  const hasMore = !showAll && !searchQuery.trim() && filteredAgenda.length > initialCount

  return (
    <>
      <div className="relative overflow-hidden bg-palembang-charcoal px-6 pb-10 pt-32 text-white sm:px-10 sm:pb-12 sm:pt-36 lg:px-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-40">
          <img src="https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" alt="Agenda Palembang" className="size-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <p className="reveal-on-scroll text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Agenda Palembang</p>
          <h1 className="reveal-on-scroll delay-100 mt-4 max-w-4xl font-display text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-8xl">Temui, ikut,<br />dan bergerak.</h1>
          <p className="reveal-on-scroll delay-150 mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base">Ruang-ruang pertemuan yang mempertemukan ide, orang, dan energi baik untuk Palembang.</p>
          <div className="reveal-on-scroll delay-200 mt-6 flex max-w-md items-center gap-2.5 border-b border-white/30 pb-2">
            <Search className="size-4 text-white/50 shrink-0" />
            <input
              type="text"
              placeholder="Cari acara, lokasi, atau kategori..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              aria-label="Cari agenda"
              className="w-full bg-transparent text-sm text-white outline-none placeholder:text-white/40"
            />
            {searchQuery && (
              <button onClick={() => setSearchQuery("")} className="text-white/50 hover:text-white p-0.5" aria-label="Hapus pencarian">
                <X className="size-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      <main className="px-6 py-8 sm:px-10 sm:py-10 lg:px-16 lg:py-12">
        <div className="mx-auto max-w-[1240px]">
          {/* Period Filter Tabs (with no-scrollbar) */}
          <div className="reveal-on-scroll mb-8 flex gap-6 overflow-x-auto border-b border-border pb-px no-scrollbar">
            <button
              onClick={() => setFilter("this-month")}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${filter === "this-month" ? "border-palembang-red text-palembang-red" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              This Month <span className={`text-xs px-2 py-0.5 rounded-full ${filter === "this-month" ? "bg-palembang-red/10 text-palembang-red" : "bg-muted text-muted-foreground"}`}>{thisMonthCount}</span>
            </button>
            <button
              onClick={() => setFilter("upcoming")}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${filter === "upcoming" ? "border-palembang-red text-palembang-red" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              Upcoming <span className={`text-xs px-2 py-0.5 rounded-full ${filter === "upcoming" ? "bg-palembang-red/10 text-palembang-red" : "bg-muted text-muted-foreground"}`}>{upcomingCount}</span>
            </button>
            <button
              onClick={() => setFilter("past")}
              className={`flex items-center gap-2 whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${filter === "past" ? "border-palembang-red text-palembang-red" : "border-transparent text-muted-foreground hover:text-foreground"
                }`}
            >
              Past Event <span className={`text-xs px-2 py-0.5 rounded-full ${filter === "past" ? "bg-palembang-red/10 text-palembang-red" : "bg-muted text-muted-foreground"}`}>{pastCount}</span>
            </button>
          </div>

          {/* Agenda Grid */}
          <div className="relative">
            {filteredAgenda.length > 0 ? (
              <div className="reveal-stagger grid gap-8">
                {visibleAgenda.map((item) => (
                  <Link key={item.id} to={`/agenda/${item.id}`} className="group flex flex-row gap-4 border-b border-border pb-6 md:grid md:grid-cols-[240px_1fr_220px] md:gap-10 md:pb-8">
                    <div className="w-24 sm:w-36 md:w-auto shrink-0">
                      <div className="img-zoom aspect-[3/4] md:aspect-[4/3] overflow-hidden rounded-xl md:rounded-2xl h-full">
                        <img src={item.image} alt={item.title} className="size-full object-cover" loading="lazy" />
                      </div>
                    </div>
                    <div className="flex flex-col justify-between flex-1 md:contents">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-palembang-red line-clamp-1">{item.category}</p>
                        <h2 className="mt-1 md:mt-3 max-w-xl font-display text-lg sm:text-2xl md:text-3xl font-bold leading-tight tracking-[-0.04em] transition-colors group-hover:text-palembang-red line-clamp-2 md:line-clamp-none">{item.title}</h2>
                        <p className="mt-2 md:mt-5 flex items-center gap-1.5 text-[10px] md:text-xs font-semibold text-muted-foreground">
                          <span className="uppercase font-bold text-palembang-red">Publisher:</span>
                          <span className="text-foreground group-hover:text-palembang-red transition-colors line-clamp-1">{item.organizer}</span>
                        </p>
                      </div>
                      <div className="flex flex-col justify-between text-[10px] sm:text-xs md:text-sm mt-3 md:mt-0">
                        <div className="space-y-1.5 md:space-y-2 text-muted-foreground">
                          <p className="flex items-center gap-1.5 md:gap-2"><CalendarDays className="size-3.5 md:size-4 text-palembang-red shrink-0" />{item.date}</p>
                          <p className="flex items-center gap-1.5 md:gap-2"><Clock3 className="size-3.5 md:size-4 text-palembang-red shrink-0" />{item.time}</p>
                          <p className="flex items-center gap-1.5 md:gap-2"><MapPin className="size-3.5 md:size-4 text-palembang-red shrink-0" /><span className="line-clamp-1 flex-1">{item.location}</span></p>
                        </div>
                        <span className="mt-4 md:mt-6 hidden md:inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-all group-hover:border-palembang-red group-hover:text-palembang-red">
                          <Ticket className="size-4" />Detail acara
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="reveal-on-scroll py-20 text-center">
                <p className="font-display text-3xl">Tidak ada agenda ditemukan.</p>
                <p className="mt-3 text-sm text-muted-foreground">Coba kata kunci pencarian atau kategori lain.</p>
              </div>
            )}

            {hasMore && (
              <div className="reveal-on-scroll absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-6 backdrop-blur-[2px]">
                <button onClick={() => setShowAll(true)} className="group flex items-center gap-3 rounded-full border border-border bg-background/95 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red">
                  Show More <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              </div>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </>
  )
}

function AgendaDetailPage() {
  const { id } = useParams()
  const item = agendaItems.find(a => a.id === id) ?? agendaItems[0]
  const otherAgenda = agendaItems.filter(a => a.id !== item.id).slice(0, 2)
  const [copied, setCopied] = useState(false)

  usePageSEO({
    title: item.title,
    description: item.description,
    keywords: `${item.title}, ${item.category}, Agenda Palembang, Event Palembang, ${item.location}, Benah Palembang`,
    ogImage: item.image,
    canonicalPath: `/agenda/${item.id}`,
    jsonLd: generateEventJsonLd(item),
  })

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
  const waContactMessage = `Halo Benah Palembang, saya ingin bertanya dan mendapatkan info lebih lanjut seputar acara:\n*${item.title}*\nTanggal: ${item.date}\nLokasi: ${item.location}`

  return (
    <>
      <div className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-40 text-white sm:px-10 lg:px-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-45">
          <img src={item.image} alt={item.title} className="size-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <Link to="/agenda" className="reveal-on-scroll inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red hover:underline">
            <ArrowRight className="size-3 rotate-180" /> Kembali ke Agenda
          </Link>
          <div className="reveal-on-scroll delay-100 mt-6">
            <span className="inline-block rounded-full border border-palembang-red/40 bg-palembang-red/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-red">
              {item.category}
            </span>
          </div>
          <h1 className="reveal-on-scroll delay-150 mt-4 max-w-4xl font-display text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-8xl">
            {item.title}
          </h1>
          <p className="reveal-on-scroll delay-200 mt-8 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{item.description}</p>
        </div>
      </div>

      <main className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24">
        <div className="mx-auto max-w-[1240px]">
          <div className="grid gap-12 lg:grid-cols-[1fr_380px]">
            <div className="reveal-on-scroll">
              <div className="reveal-scale overflow-hidden rounded-[1.5rem]">
                <img src={item.image} alt={item.title} className="aspect-[16/9] w-full object-cover" />
              </div>
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Tentang Acara</h2>
                <p className="mt-4 text-base leading-8 text-muted-foreground">{item.description}</p>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  Acara ini terbuka untuk umum dan dirancang untuk mempertemukan berbagai elemen masyarakat Palembang — dari akademisi, pelaku kreatif, hingga warga biasa yang peduli dengan masa depan kota. Hadir dan rasakan energi kolaboratif yang mendorong perubahan nyata.
                </p>
                <p className="mt-4 text-base leading-8 text-muted-foreground">
                  Peserta diharapkan datang tepat waktu. Registrasi dibuka 30 menit sebelum acara dimulai. Tersedia sertifikat kehadiran bagi peserta yang mendaftar.
                </p>
              </div>
              <div className="mt-10">
                <h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Yang Akan Kamu Dapatkan</h2>
                <ul className="mt-4 space-y-3">
                  {[
                    "Insight dan perspektif baru dari para narasumber berpengalaman",
                    "Networking dengan komunitas dan pelaku kreatif Palembang",
                    "Sertifikat kehadiran resmi dari penyelenggara",
                    "Konsumsi dan goodie bag untuk peserta terdaftar",
                  ].map((benefit) => (
                    <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground">
                      <Check className="mt-0.5 size-4 flex-shrink-0 text-palembang-red" />
                      {benefit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <div className="reveal-on-scroll sticky top-28 space-y-6">
                <div className="rounded-[1.5rem] border border-border bg-background p-6 shadow-sm">
                  <h3 className="font-display text-lg font-bold">Detail Acara</h3>
                  <div className="mt-6 space-y-5">
                    <div className="flex items-start gap-3">
                      <CalendarDays className="mt-0.5 size-5 text-palembang-red" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Tanggal</p>
                        <p className="mt-1 text-sm font-semibold">{item.date}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Clock3 className="mt-0.5 size-5 text-palembang-red" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Waktu</p>
                        <p className="mt-1 text-sm font-semibold">{item.time}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <MapPin className="mt-0.5 size-5 text-palembang-red" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Lokasi</p>
                        <p className="mt-1 text-sm font-semibold">{item.location}</p>
                      </div>
                    </div>
                    <div className="flex items-start gap-3">
                      <Sparkles className="mt-0.5 size-5 text-palembang-red" />
                      <div>
                        <p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Penyelenggara / Publisher</p>
                        <Link
                          to={`/penulis/${encodeURIComponent(item.organizer)}`}
                          className="mt-1 inline-flex items-center gap-1.5 text-sm font-semibold text-foreground hover:text-palembang-red transition-colors group/pub"
                          title={`Lihat profil ${item.organizer}`}
                        >
                          <span>{item.organizer}</span>
                          <ArrowUpRight className="size-3.5 text-palembang-red transition-transform group-hover/pub:translate-x-0.5 group-hover/pub:-translate-y-0.5" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  <div className="mt-8 space-y-3">
                    <a
                      href={`https://wa.me/628551241878?text=${encodeURIComponent(waMessage)}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-palembang-red text-sm font-bold text-white transition-colors hover:bg-palembang-red/90 shadow-sm"
                    >
                      <Ticket className="size-4" /> Daftar Sekarang
                    </a>

                    <div className="grid grid-cols-2 gap-2.5">
                      <a
                        href={`https://wa.me/628551241878?text=${encodeURIComponent(waContactMessage)}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex h-11 w-full items-center justify-center gap-2 rounded-md border border-emerald-600/30 bg-emerald-600/10 text-xs sm:text-sm font-bold text-emerald-600 hover:bg-emerald-600 hover:text-white dark:border-emerald-500/40 dark:bg-emerald-500/15 dark:text-emerald-400 dark:hover:bg-emerald-600 dark:hover:text-white transition-all duration-200"
                      >
                        <MessageCircle className="size-4 shrink-0" /> Hubungi Kami
                      </a>

                      <Button type="button" variant="outline" onClick={handleShare} className="h-11 w-full text-xs sm:text-sm font-semibold gap-2">
                        {copied ? (
                          <>
                            <Check className="size-4 text-emerald-600 shrink-0" />
                            <span className="text-emerald-600 truncate">Disalin!</span>
                          </>
                        ) : (
                          <>
                            <Share2 className="size-4 shrink-0" />
                            <span>Bagikan</span>
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Publisher Info Card */}
                <Link
                  to={`/penulis/${encodeURIComponent(item.organizer)}`}
                  className="group block rounded-[1.5rem] border border-border bg-background p-5 shadow-sm transition-all hover:bg-muted/50 hover:border-palembang-red/40 hover:shadow-md"
                  title={`Lihat profil ${item.organizer}`}
                >
                  <div className="flex items-center gap-3.5">
                    <img
                      src={`https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(item.organizer)}`}
                      alt={item.organizer}
                      className="size-12 rounded-full object-cover border border-border bg-muted ring-2 ring-palembang-red/20 group-hover:ring-palembang-red transition-all shrink-0"
                    />
                    <div className="flex-1 min-w-0">
                      <span className="text-[9px] font-bold uppercase tracking-wider text-palembang-red">Publisher & Organizer</span>
                      <h4 className="font-display text-sm font-bold text-foreground truncate group-hover:text-palembang-red transition-colors flex items-center gap-1">
                        {item.organizer}
                        <ArrowUpRight className="size-3 text-palembang-red" />
                      </h4>
                      <p className="mt-0.5 text-[11px] text-muted-foreground">Lihat profil dan agenda lainnya</p>
                    </div>
                  </div>
                </Link>

                <div className="rounded-[1.5rem] border border-border bg-muted/40 p-6">
                  <div className="inline-flex items-center gap-2 rounded-full bg-palembang-charcoal px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-red">
                    <Sparkles className="size-3" /> {item.category}
                  </div>
                  <h4 className="mt-3 font-display text-base font-bold text-foreground">Kategori: {item.category}</h4>
                  <p className="mt-2 text-xs leading-5 text-muted-foreground">
                    Acara ini juga terbuka untuk kolaborasi komunitas dan publik. Hubungi penyelenggara untuk informasi lebih lanjut.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ── Agenda Lainnya (2 Columns) ── */}
      <section className="reveal-on-scroll bg-background px-6 py-20 text-foreground sm:px-10 lg:px-16 lg:py-28">
        <div className="mx-auto max-w-[1240px]">
          <SectionHeading eyebrow="Jangan lewatkan" title="Agenda Lainnya" />
          <div className="reveal-stagger mt-12 grid gap-8 sm:grid-cols-2">
            {otherAgenda.map((a) => (
              <Link key={a.id} to={`/agenda/${a.id}`} className="group block">
                <div className="img-zoom aspect-[16/9] sm:aspect-[4/3] overflow-hidden rounded-[1.25rem] bg-muted border border-border/50">
                  <img src={a.image} alt={a.title} className="size-full object-cover" loading="lazy" />
                </div>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-palembang-red">{a.category}</p>
                <h3 className="mt-2 font-display text-xl font-bold leading-tight tracking-[-0.03em] text-foreground transition-colors group-hover:text-palembang-red">
                  {a.title}
                </h3>
                <div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <CalendarDays className="size-3.5 text-palembang-red" />
                    {a.date}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <MapPin className="size-3.5 text-palembang-red" />
                    {a.location.split(",")[0]}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>
      <Footer />
    </>
  )
}

function CollaborationPage() {
  usePageSEO({
    title: "Kolaborasi",
    description: "Ruang kolaborasi Benah Palembang bersama brand, komunitas, media, pelaku kreatif, dan warga untuk membuat Palembang lebih hidup.",
    keywords: "Kolaborasi Benah Palembang, Partner Benah, Media Partner Palembang, Creative Agency Palembang, Komunitas Palembang",
    canonicalPath: "/kolaborasi",
  })

  const [query, setQuery] = useState("")
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
    { id: 11, platform: "instagram", title: "Eksplorasi Songket Pusaka x Bank Sumsel", thumbnail: "https://images.pexels.com/photos/37628562/pexels-photo-37628562.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[4/5]" },
    { id: 12, platform: "tiktok", title: "Jelajah Kopi Semendo x Telkomsel", thumbnail: "https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[9/16]" },
    { id: 13, platform: "youtube", title: "Sriwijaya FC x Benah: Suara Suporter", thumbnail: "https://images.pexels.com/photos/169647/pexels-photo-169647.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[16/9]" },
    { id: 14, platform: "instagram", title: "Kompas x Benah: Liputan Khusus Musi", thumbnail: "https://images.pexels.com/photos/38885810/pexels-photo-38885810.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[1/1]" },
    { id: 15, platform: "tiktok", title: "Gojek x Benah: Sensasi Naik Ketek Online", thumbnail: "https://images.pexels.com/photos/32844866/pexels-photo-32844866.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[9/16]" },
    { id: 16, platform: "youtube", title: "Mini Seri: Wajah-Wajah Pejuang Kota", thumbnail: "https://images.pexels.com/photos/31409070/pexels-photo-31409070.jpeg?auto=compress&cs=tinysrgb&w=400", ratio: "aspect-[16/9]" },
  ]

  const platformIcon = (p: string) => {
    if (p === "youtube") return <span className="bg-red-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">YT</span>
    if (p === "instagram") return <span className="bg-gradient-to-tr from-yellow-400 via-pink-500 to-purple-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">IG</span>
    if (p === "tiktok") return <span className="bg-black text-white text-[9px] font-bold px-1.5 py-0.5 rounded border border-white/20">TK</span>
    return <span className="bg-blue-600 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">FB</span>
  }

  const filteredContents = partnerContents.filter(item =>
    !query.trim() ||
    `${item.title} ${item.platform}`.toLowerCase().includes(query.trim().toLowerCase())
  )

  const initialCount = 12
  const visibleContents = showAllContent || query.trim() ? filteredContents : filteredContents.slice(0, initialCount)
  const hasMore = !showAllContent && !query.trim() && filteredContents.length > initialCount

  return (
    <>
      <div className="relative overflow-hidden bg-palembang-charcoal px-6 pb-12 pt-32 text-white sm:px-10 sm:pb-14 sm:pt-36 lg:px-16">
        <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-40">
          <img src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1920&h=800&fit=crop" alt="Background Kolaborasi" className="size-full object-cover object-right" />
          <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
        </div>
        <div className="relative z-10 mx-auto max-w-[1240px]">
          <p className="reveal-on-scroll text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Collaboration</p>
          <h1 className="reveal-on-scroll delay-100 mt-4 max-w-4xl font-display text-5xl font-black leading-[0.9] tracking-[-0.065em] sm:text-7xl lg:text-8xl">
            Mari Benahi<br />
            <span className="text-palembang-red">Palembang</span><br />
            bersama.
          </h1>
          <p className="reveal-on-scroll delay-150 mt-4 max-w-lg text-sm leading-6 text-white/80 sm:text-base">
            Kami terbuka untuk berkolaborasi dengan komunitas, brand, creative worker, organisasi, media, dan siapa pun yang ingin ikut membuat Palembang lebih hidup.
          </p>
          <div className="reveal-on-scroll delay-200 mt-8 flex flex-col gap-3.5">
            <div className="flex items-center gap-3 text-palembang-red">
              <Mail className="size-4.5" />
              <a href="mailto:kolaborasi@benahpalembang.id" className="text-sm underline underline-offset-4 text-white hover:text-palembang-red transition-colors">
                kolaborasi@benahpalembang.id
              </a>
            </div>
            <div className="flex items-center gap-3 text-palembang-red">
              <MessageCircle className="size-4.5" />
              <a href="https://wa.me/628551241878" target="_blank" rel="noopener noreferrer" className="text-sm underline underline-offset-4 text-white hover:text-palembang-red transition-colors">
                08551241878
              </a>
            </div>
          </div>
        </div>
      </div>

    {/* ── Partners Logo Slider ── */}
    <section className="reveal-on-scroll bg-background py-16 sm:py-20 overflow-hidden text-foreground">
      <div className="mx-auto max-w-[1240px] px-6 sm:px-10 lg:px-16 mb-12 text-center">
        <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Trusted By</p>
        <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">Our Partners</h2>
        <p className="mt-3 mx-auto max-w-lg text-sm leading-6 text-muted-foreground">Brand, komunitas, dan organisasi yang telah berkolaborasi bersama Benah Palembang.</p>
      </div>
      <div className="relative w-full overflow-hidden py-2">
        <div className="pointer-events-none absolute left-0 top-0 z-10 h-full w-12 sm:w-24 lg:w-32 bg-gradient-to-r from-background via-background/80 to-transparent backdrop-blur-[2px]" />
        <div className="pointer-events-none absolute right-0 top-0 z-10 h-full w-12 sm:w-24 lg:w-32 bg-gradient-to-l from-background via-background/80 to-transparent backdrop-blur-[2px]" />
        <div className="flex w-max animate-marquee gap-12 sm:gap-16 items-center">
          {doubledLogos.map((logo, i) => (
            <div key={`${logo.name}-${i}`} className="flex-shrink-0 group cursor-pointer px-4">
              <img src={logo.src} alt={logo.name} className="h-10 sm:h-12 w-auto object-contain opacity-50 grayscale dark:brightness-0 dark:invert transition-all duration-500 group-hover:opacity-100 group-hover:grayscale-0 group-hover:brightness-100 group-hover:invert-0 group-hover:scale-110" />
            </div>
          ))}
        </div>
      </div>
    </section>

    {/* ── Partner Content — Pinterest Masonry Grid ── */}
    <section className="bg-background px-6 py-16 sm:px-10 sm:py-24 lg:px-16 text-foreground">
      <div className="mx-auto max-w-[1240px]">
        <div className="reveal-on-scroll flex flex-col sm:flex-row sm:items-end justify-between gap-6">
          <div>
            <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Partner Content</p>
            <h2 className="mt-3 font-display text-3xl font-bold tracking-[-0.03em] text-foreground sm:text-4xl">Konten Kolaborasi</h2>
            <p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">Konten promosi dan cerita dari partner-partner kami di berbagai platform.</p>
          </div>
          <div className="flex w-full max-w-md items-center gap-3 border-b border-border pb-3">
            <Search className="size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Cari konten atau platform..."
              aria-label="Cari konten kolaborasi"
              className="w-full bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <button onClick={() => setQuery("")} className="text-muted-foreground hover:text-foreground" aria-label="Hapus pencarian">
                <X className="size-4" />
              </button>
            )}
          </div>
        </div>

        <div className="relative mt-12">
          {filteredContents.length > 0 ? (
            <div className="reveal-stagger columns-2 sm:columns-3 lg:columns-4 gap-4 space-y-4">
              {visibleContents.map(item => (
                <div key={item.id} className="break-inside-avoid group cursor-pointer">
                  <div className={`relative overflow-hidden rounded-2xl bg-card border border-border/40 ${item.ratio}`}>
                    <img src={item.thumbnail} alt={item.title} className="absolute inset-0 size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute top-3 left-3">{platformIcon(item.platform)}</div>
                    <div className="absolute inset-x-0 bottom-0 p-4">
                      <h3 className="text-sm font-bold text-white leading-tight">{item.title}</h3>
                      <p className="mt-1 text-[10px] uppercase tracking-widest text-white/60 font-semibold">{item.platform}</p>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <div className="size-12 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="white"><polygon points="5 3 19 12 5 21 5 3" /></svg>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="reveal-on-scroll py-20 text-center text-foreground">
              <p className="font-display text-3xl">Konten tidak ditemukan.</p>
              <p className="mt-3 text-sm text-muted-foreground">Coba kata kunci pencarian lain.</p>
            </div>
          )}

          {/* Show More Button & Blur Overlay if > 12 contents */}
          {hasMore && (
            <div className="reveal-on-scroll absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-6 backdrop-blur-[2px]">
              <button onClick={() => setShowAllContent(true)} className="group flex items-center gap-3 rounded-full border border-border bg-background/95 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red">
                Show More <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>

    <Footer /></>
  )
}

function LoginPage() {
  usePageSEO({
    title: "Masuk",
    description: "Masuk ke akun personal Benah Palembang untuk menyimpan cerita dan mengikuti agenda pilihan.",
    canonicalPath: "/login",
  })

  const [showPw, setShowPw] = useState(false)
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const { login } = useAuth()
  const { theme, toggleTheme } = useTheme()
  const navigate = useNavigate()
  const location = useLocation()

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault()
    if (login(email, password)) {
      const fromPath = (location.state as any)?.from || '/dashboard'
      navigate(fromPath)
    } else {
      toast.error('Email atau password salah')
    }
  }

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background text-foreground px-6 py-24 sm:py-32 transition-colors duration-300">
      {/* Top action bar: Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md shadow-xs hover:bg-muted transition-all"
        >
          {theme === "dark" ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-palembang-sage" />}
        </button>
      </div>

      {/* Ambient background for mobile view */}
      <div className="pointer-events-none absolute inset-0 lg:hidden">
        <img
          src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop"
          alt="Palembang Background"
          className="size-full object-cover opacity-15 dark:opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
      </div>

      <div className="reveal-scale relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-2xl backdrop-blur-md lg:grid-cols-2 text-card-foreground">
        <div className="relative hidden min-h-[600px] overflow-hidden bg-palembang-charcoal lg:block">
          <img src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop" alt="Jembatan Ampera" className="size-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <img src="/logo.png" alt="Benah Palembang" className="h-8" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">Masuk untuk menyimpan cerita, menyukai artikel, dan berinteraksi di ruang publik.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-14">
          <Link to="/" className="inline-block">
            <img src={theme === "dark" ? "/logo.png" : "/logohitam.png"} alt="Benah Palembang" className="h-7" />
          </Link>
          <h1 className="mt-12 sm:mt-16 font-display text-3xl sm:text-4xl font-bold tracking-[-0.04em] text-foreground">Selamat datang kembali.</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Masuk ke ruang personalmu di Benah Palembang.</p>
          <form onSubmit={handleLogin} className="mt-8 space-y-4">
            <label className="block text-xs font-semibold text-foreground/80">
              Email
              <input
                type="email"
                required
                placeholder="nama@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-palembang-red focus:ring-[3px] focus:ring-palembang-red/20 placeholder:text-muted-foreground transition-all"
              />
            </label>
            <label className="block text-xs font-semibold text-foreground/80">
              Password
              <div className="relative mt-2">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="h-11 w-full rounded-md border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none focus:border-palembang-red focus:ring-[3px] focus:ring-palembang-red/20 placeholder:text-muted-foreground transition-all"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
            <div className="flex justify-end">
              <Link to="/lupa-password" className="text-[11px] font-medium text-palembang-red transition-colors hover:underline">
                Lupa password?
              </Link>
            </div>
            <Button type="submit" className="mt-2 h-11 w-full bg-palembang-red text-white hover:bg-palembang-red/90 font-bold">
              Masuk <ArrowRight className="size-4" />
            </Button>
          </form>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Belum punya akun? <Link to="/register" className="font-semibold text-palembang-red hover:underline">Daftar sekarang</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

function RegisterPage() {
  usePageSEO({
    title: "Daftar",
    description: "Daftar akun baru di platform Benah Palembang.",
    canonicalPath: "/register",
  })

  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background text-foreground px-6 py-24 sm:py-32 transition-colors duration-300">
      {/* Top action bar: Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md shadow-xs hover:bg-muted transition-all"
        >
          {theme === "dark" ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-palembang-sage" />}
        </button>
      </div>

      {/* Ambient background for mobile view */}
      <div className="pointer-events-none absolute inset-0 lg:hidden">
        <img
          src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop"
          alt="Palembang Background"
          className="size-full object-cover opacity-15 dark:opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
      </div>

      <div className="reveal-scale relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-2xl backdrop-blur-md lg:grid-cols-2 text-card-foreground">
        <div className="relative hidden min-h-[600px] overflow-hidden bg-palembang-charcoal lg:block">
          <img src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop" alt="Jembatan Ampera" className="size-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <img src="/logo.png" alt="Benah Palembang" className="h-8" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">Daftar untuk menyimpan cerita, menyukai konten, dan mengikuti agenda pilihanmu.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-14">
          <Link to="/" className="inline-block">
            <img src={theme === "dark" ? "/logo.png" : "/logohitam.png"} alt="Benah Palembang" className="h-7" />
          </Link>
          <h1 className="mt-12 sm:mt-16 font-display text-3xl sm:text-4xl font-bold tracking-[-0.04em] text-foreground">Bergabung bersama.</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Buat ruang personalmu di Benah Palembang.</p>
          <form onSubmit={(event) => event.preventDefault()} className="mt-8 space-y-4">
            <label className="block text-xs font-semibold text-foreground/80">
              Nama Lengkap
              <input
                type="text"
                required
                placeholder="Nama Anda"
                className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-palembang-red focus:ring-[3px] focus:ring-palembang-red/20 placeholder:text-muted-foreground transition-all"
              />
            </label>
            <label className="block text-xs font-semibold text-foreground/80">
              Email
              <input
                type="email"
                required
                placeholder="nama@email.com"
                className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-palembang-red focus:ring-[3px] focus:ring-palembang-red/20 placeholder:text-muted-foreground transition-all"
              />
            </label>
            <label className="block text-xs font-semibold text-foreground/80">
              Password
              <div className="relative mt-2">
                <input
                  type={showPw ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-md border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none focus:border-palembang-red focus:ring-[3px] focus:ring-palembang-red/20 placeholder:text-muted-foreground transition-all"
                />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                  {showPw ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
            <label className="block text-xs font-semibold text-foreground/80">
              Konfirmasi Password
              <div className="relative mt-2">
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  placeholder="••••••••"
                  className="h-11 w-full rounded-md border border-border bg-background px-3 pr-10 text-sm text-foreground outline-none focus:border-palembang-red focus:ring-[3px] focus:ring-palembang-red/20 placeholder:text-muted-foreground transition-all"
                />
                <button type="button" onClick={() => setShowConfirm(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors" tabIndex={-1}>
                  {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </label>
            <Button type="submit" className="mt-2 h-11 w-full bg-palembang-red text-white hover:bg-palembang-red/90 font-bold">
              Daftar <ArrowRight className="size-4" />
            </Button>
          </form>
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Sudah punya akun? <Link to="/login" className="font-semibold text-palembang-red hover:underline">Masuk sekarang</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

function ForgotPasswordPage() {
  usePageSEO({
    title: "Lupa Password",
    description: "Atur ulang kata sandi akun Benah Palembang.",
    canonicalPath: "/lupa-password",
  })

  const [sent, setSent] = useState(false)
  const { theme, toggleTheme } = useTheme()

  return (
    <main className="relative flex min-h-svh items-center justify-center overflow-hidden bg-background text-foreground px-6 py-24 sm:py-32 transition-colors duration-300">
      {/* Top action bar: Theme Toggle */}
      <div className="absolute top-6 right-6 z-20">
        <button
          type="button"
          onClick={toggleTheme}
          aria-label={theme === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"}
          title={theme === "dark" ? "Ganti ke Mode Terang" : "Ganti ke Mode Gelap"}
          className="flex size-9 items-center justify-center rounded-full border border-border bg-background/80 text-foreground backdrop-blur-md shadow-xs hover:bg-muted transition-all"
        >
          {theme === "dark" ? <Sun className="size-4 text-amber-400" /> : <Moon className="size-4 text-palembang-sage" />}
        </button>
      </div>

      {/* Ambient background for mobile view */}
      <div className="pointer-events-none absolute inset-0 lg:hidden">
        <img
          src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop"
          alt="Palembang Background"
          className="size-full object-cover opacity-15 dark:opacity-25"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/90 via-background/80 to-background" />
      </div>

      <div className="reveal-scale relative z-10 grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-border bg-card shadow-2xl backdrop-blur-md lg:grid-cols-2 text-card-foreground">
        <div className="relative hidden min-h-[600px] overflow-hidden bg-palembang-charcoal lg:block">
          <img src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop" alt="Jembatan Ampera" className="size-full object-cover opacity-60" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <img src="/logo.png" alt="Benah Palembang" className="h-8" />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/75">Kami akan mengirimkan tautan untuk mengatur ulang kata sandi.</p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 sm:p-14">
          <Link to="/" className="inline-block">
            <img src={theme === "dark" ? "/logo.png" : "/logohitam.png"} alt="Benah Palembang" className="h-7" />
          </Link>
          <h1 className="mt-12 sm:mt-16 font-display text-3xl sm:text-4xl font-bold tracking-[-0.04em] text-foreground">Lupa password?</h1>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">Masukkan alamat email yang terdaftar dan kami akan mengirimkan tautan reset password.</p>
          {sent ? (
            <div className="mt-8 rounded-xl border border-palembang-red/30 bg-palembang-red/10 p-6">
              <div className="flex items-center gap-3 text-palembang-red">
                <Check className="size-5" />
                <p className="text-sm font-semibold">Email terkirim!</p>
              </div>
              <p className="mt-2 text-xs leading-5 text-muted-foreground">Silakan cek inbox email kamu untuk tautan reset password. Jika tidak muncul, periksa folder spam.</p>
              <Link to="/login" className="mt-5 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-red hover:underline">
                <ArrowRight className="size-3 rotate-180" /> Kembali ke login
              </Link>
            </div>
          ) : (
            <form onSubmit={(event) => { event.preventDefault(); setSent(true) }} className="mt-8 space-y-4">
              <label className="block text-xs font-semibold text-foreground/80">
                Email
                <input
                  type="email"
                  required
                  placeholder="nama@email.com"
                  className="mt-2 h-11 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-palembang-red focus:ring-[3px] focus:ring-palembang-red/20 placeholder:text-muted-foreground transition-all"
                />
              </label>
              <Button type="submit" className="mt-2 h-11 w-full bg-palembang-red text-white hover:bg-palembang-red/90 font-bold">
                <Mail className="size-4 mr-1.5" /> Kirim tautan reset
              </Button>
            </form>
          )}
          <p className="mt-8 text-center text-xs text-muted-foreground">
            Sudah ingat? <Link to="/login" className="font-semibold text-palembang-red hover:underline">Masuk sekarang</Link>
          </p>
        </div>
      </div>
    </main>
  )
}

function CTASection() {
  return (
    <section className="relative overflow-hidden bg-background px-6 py-20 text-foreground sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="reveal-on-scroll relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900 via-black/85 to-zinc-950 p-8 sm:p-14 lg:p-16 shadow-2xl backdrop-blur-xl text-white">
          {/* Ambient Background Graphic */}
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-25 lg:opacity-35">
            <img
              src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop"
              alt="Kolaborasi"
              className="size-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-zinc-950" />
          </div>

          <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">
                <span className="h-2 w-2 rounded-full bg-palembang-red animate-pulse" />
                Buka Ruang Kolaborasi
              </div>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-black leading-[0.95] tracking-[-0.05em] text-white sm:text-6xl lg:text-7xl">
                Kota ini milik<br />
                <span className="text-palembang-red">kita semua.</span>
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                Punya cerita, ide kreatif, atau ingin membuat sesuatu bersama? Kami selalu terbuka untuk berkolaborasi dan mendengar suara Anda.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  to="/kolaborasi"
                  className="flex items-center gap-3 rounded-full bg-palembang-red px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-xl transition-all duration-300 hover:bg-white hover:text-palembang-charcoal hover:-translate-y-1"
                >
                  Mulai Kolaborasi <ArrowRight className="size-4" />
                </Link>
                <a
                  href="mailto:kolaborasi@benahpalembang.id"
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
                >
                  <Mail className="size-4 text-palembang-red" /> Hubungi Kami
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

function getProfileData(idOrName: string) {
  const decoded = decodeURIComponent(idOrName || "").trim().toLowerCase()

  // 1. Try match authors
  const matchedAuthor = authors.find(a => a.id === idOrName || a.name.toLowerCase() === decoded || a.name.toLowerCase().includes(decoded))
  if (matchedAuthor) {
    const authorArticles = articles.filter(art => art.author.name.toLowerCase().includes(matchedAuthor.name.toLowerCase()))
    return {
      id: matchedAuthor.id,
      name: matchedAuthor.name,
      role: matchedAuthor.role,
      avatar: matchedAuthor.avatar,
      banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
      bio: matchedAuthor.bio || "Penulis dan kreator konten yang berfokus pada denyut kehidupan, kebudayaan, dan ruang kota Palembang.",
      type: "Penulis & Kontributor",
      articles: authorArticles.length > 0 ? authorArticles : articles.slice(0, 6),
      events: agendaItems.filter(e => e.organizer.toLowerCase().includes(matchedAuthor.name.toLowerCase())),
    }
  }

  // 2. Try match team members
  const matchedTeam = teamMembers.find(t => t.id === idOrName || t.name.toLowerCase() === decoded || t.name.toLowerCase().includes(decoded))
  if (matchedTeam) {
    const teamArticles = articles.filter(art => art.author.name.toLowerCase().includes(matchedTeam.name.toLowerCase()))
    return {
      id: matchedTeam.id,
      name: matchedTeam.name,
      role: matchedTeam.role,
      avatar: matchedTeam.photo,
      banner: "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
      bio: matchedTeam.bio,
      type: "Tim Redaksi Benah",
      articles: teamArticles.length > 0 ? teamArticles : articles.slice(0, 6),
      events: [],
    }
  }

  // 3. Try match agenda organizer / publisher
  const matchedOrganizerEvents = agendaItems.filter(e => e.organizer.toLowerCase() === decoded || e.organizer.toLowerCase().includes(decoded) || decoded.includes(e.organizer.toLowerCase()))
  if (matchedOrganizerEvents.length > 0) {
    const orgName = matchedOrganizerEvents[0].organizer
    return {
      id: orgName,
      name: orgName,
      role: "Official Publisher & Event Organizer",
      avatar: `https://api.dicebear.com/7.x/identicon/svg?seed=${encodeURIComponent(orgName)}`,
      banner: matchedOrganizerEvents[0].image || "https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
      bio: `Penyelenggara dan inisiator resmi berbagai agenda seni, festival budaya, lokakarya kreatif, dan ruang pertemuan untuk memajukan geliat masyarakat di Kota Palembang.`,
      type: "Publisher & Organizer",
      articles: articles.slice(0, 4),
      events: matchedOrganizerEvents,
    }
  }

  // 4. Fallback default (e.g. for commenters / general users)
  const decodedName = decodeURIComponent(idOrName || "").trim()
  return {
    id: idOrName,
    name: decodedName || authors[0].name,
    role: "Penulis & Kontributor Warga",
    avatar: `https://api.dicebear.com/7.x/notionists/svg?seed=${encodeURIComponent(decodedName || "warga")}`,
    banner: "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop",
    bio: "Pengguna dan warga Palembang yang aktif membaca, berdiskusi, serta merekam cerita dan dinamika budaya Kota Palembang.",
    type: "Penulis & Kontributor",
    articles: articles.slice(0, 6),
    events: [],
  }
}

function PublicProfilePage() {
  const { id } = useParams()
  const profile = getProfileData(id || "")
  const [copied, setCopied] = useState(false)
  const [showAllGallery, setShowAllGallery] = useState(false)

  usePageSEO({
    title: `Profil ${profile.name}`,
    description: profile.bio,
    keywords: `${profile.name}, ${profile.role}, Penulis Benah Palembang, Author Palembang, Publisher Palembang, Benah Palembang`,
    canonicalPath: `/penulis/${encodeURIComponent(profile.name)}`,
  })

  const handleShare = async () => {
    try {
      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      toast.success("Tautan profil disalin!")
      setTimeout(() => setCopied(false), 2000)
    } catch {}
  }

  const masonryAspects = ["aspect-[3/4]", "aspect-[4/5]", "aspect-[1/1]", "aspect-[3/5]", "aspect-[4/3]", "aspect-[5/4]"]

  return (
    <>
      <main className="min-h-svh bg-palembang-charcoal pt-24 pb-20 text-white">
        {/* Banner and Header */}
        <div className="relative">
          <div className="reveal-scale relative h-64 sm:h-80 w-full overflow-hidden bg-zinc-900">
            <img src={profile.banner} alt="Cover Banner" className="size-full object-cover opacity-60" />
            <div className="absolute inset-0 bg-gradient-to-t from-palembang-charcoal via-palembang-charcoal/40 to-transparent" />
          </div>

          <div className="mx-auto max-w-[1240px] px-6 sm:px-10 lg:px-16">
            <div className="relative -mt-24 sm:-mt-28">
              {/* Back Button */}
              <div className="reveal-on-scroll mb-6">
                <button
                  onClick={() => window.history.back()}
                  className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:border-palembang-red hover:text-palembang-red"
                >
                  <ArrowLeft className="size-3.5" /> Kembali
                </button>
              </div>

              {/* Profile Card (Matching Dashboard Layout with dark aesthetic) */}
              <div className="reveal-on-scroll rounded-[1.75rem] border border-white/10 bg-black/60 p-6 sm:p-10 shadow-2xl backdrop-blur-xl">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="relative size-24 sm:size-28 shrink-0 overflow-hidden rounded-full border-4 border-palembang-charcoal ring-2 ring-palembang-red/60 shadow-xl bg-zinc-800">
                      <img src={profile.avatar} alt={profile.name} className="size-full object-cover" />
                    </div>
                    <div>
                      <div className="flex flex-wrap items-center gap-2.5">
                        <h1 className="font-display text-2xl sm:text-4xl font-bold tracking-tight text-white">{profile.name}</h1>
                      </div>
                      <p className="mt-1 text-sm sm:text-base font-medium text-white/70">{profile.role}</p>
                      <p className="mt-3 max-w-2xl text-xs sm:text-sm leading-6 text-white/60">{profile.bio}</p>
                      
                      {/* Social Media */}
                      <div className="flex gap-4 mt-6">
                        <a href="https://instagram.com" target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full text-white/70 hover:text-pink-500 hover:bg-white/20 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
                        </a>
                        <a href="https://twitter.com" target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full text-white/70 hover:text-white hover:bg-white/20 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"/></svg>
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noreferrer" className="p-2 bg-white/10 rounded-full text-white/70 hover:text-blue-400 hover:bg-white/20 transition-colors">
                          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        </a>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col gap-2 sm:self-start">
                    <a
                      href="https://wa.me/628551241878"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-xl bg-palembang-red px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-palembang-red/90"
                    >
                      <MessageCircle className="size-3.5" /> Hubungi
                    </a>
                    <button
                      onClick={handleShare}
                      className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-colors hover:bg-white/10 hover:border-palembang-red"
                    >
                      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Share2 className="size-3.5" />}
                      <span>{copied ? "Disalin!" : "Bagikan"}</span>
                    </button>
                  </div>
                </div>

                {/* Statistics Bar */}
                <div className="reveal-stagger mt-8 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 py-4 text-center">
                  <div>
                    <p className="font-display text-lg sm:text-2xl font-bold text-white">{profile.articles.length}</p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50">Artikel</p>
                  </div>
                  <div>
                    <p className="font-display text-lg sm:text-2xl font-bold text-white">
                      {(profile.articles.reduce((acc, a) => acc + (a.views || 1200), 0)).toLocaleString()}
                    </p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50">Total Views</p>
                  </div>
                  <div>
                    <p className="font-display text-lg sm:text-2xl font-bold text-white">
                      {(profile.articles.reduce((acc, a) => acc + (a.likes || 180), 0)).toLocaleString()}
                    </p>
                    <p className="text-[10px] sm:text-xs uppercase tracking-wider text-white/50">Total Suka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Gallery Section — 2 Columns Pinterest Masonry */}
        <section className="mx-auto max-w-[1240px] px-6 pt-16 sm:px-10 lg:px-16">
          <div className="reveal-on-scroll flex items-center justify-between border-b border-white/10 pb-4 mb-10">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Koleksi Karya</p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
                Galeri Publikasi ({profile.articles.length})
              </h2>
            </div>
            <span className="hidden sm:inline-block text-xs text-white/50">Klik artikel untuk membaca cerita lengkap</span>
          </div>

          <div className="relative">
            <div className="reveal-stagger columns-2 lg:columns-4 gap-4 sm:gap-6">
              {(showAllGallery ? profile.articles : profile.articles.slice(0, 12)).map((article, index) => (
                <Link
                  key={article.id}
                  to={`/artikel/${article.slug}`}
                  className="break-inside-avoid mb-4 sm:mb-6 group block rounded-2xl border border-white/10 bg-black/40 overflow-hidden shadow-lg hover:border-palembang-red/50 hover:shadow-2xl transition-all"
                >
                  <div className={`${masonryAspects[index % masonryAspects.length]} overflow-hidden relative`}>
                    <img
                      src={article.coverImage}
                      alt={article.title}
                      className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 group-hover:opacity-80 transition-opacity" />
                    <div className="absolute top-3 left-3">
                      <span className="rounded-full bg-palembang-red/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow">
                        {article.category}
                      </span>
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[2px]">
                      <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-palembang-charcoal shadow-xl">
                        Lihat Artikel <ArrowRight className="inline ml-1 size-3" />
                      </span>
                    </div>
                  </div>
                  <div className="p-4">
                    <h3 className="font-display text-sm sm:text-base font-bold leading-snug text-white group-hover:text-palembang-red transition-colors line-clamp-2">
                      {article.title}
                    </h3>
                    <p className="mt-2 text-xs leading-5 text-white/60 line-clamp-2">{article.excerpt}</p>
                    <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] sm:text-xs text-white/50">
                      <span>{article.publishedAt}</span>
                      <div className="flex items-center gap-3">
                        <span className="flex items-center gap-1"><Eye className="size-3 text-palembang-red" />{article.views.toLocaleString()}</span>
                        <span className="flex items-center gap-1"><Heart className="size-3 text-palembang-red" />{article.likes.toLocaleString()}</span>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
            
            {profile.articles.length > 12 && !showAllGallery && (
              <div className="reveal-on-scroll absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-palembang-charcoal via-palembang-charcoal/90 to-transparent pb-6 backdrop-blur-[2px]">
                <button
                  onClick={() => setShowAllGallery(true)}
                  className="group flex items-center gap-3 rounded-full border border-white/20 bg-black/80 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red"
                >
                  View More <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                </button>
              </div>
            )}
          </div>
        </section>

        {/* If profile has events */}
        {profile.events && profile.events.length > 0 && (
          <section className="mx-auto max-w-[1240px] px-6 pt-16 sm:px-10 lg:px-16">
            <div className="pt-10">
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Penyelenggara Resmi</p>
              <h2 className="mt-1 font-display text-2xl sm:text-3xl font-bold tracking-[-0.03em] text-white">
                Agenda & Acara Terkait ({profile.events.length})
              </h2>
              <div className="mt-8 grid gap-6 sm:grid-cols-2">
                {profile.events.map((event) => (
                  <Link
                    key={event.id}
                    to={`/agenda/${event.id}`}
                    className="group block rounded-2xl border border-white/10 bg-black/40 p-4 transition-all hover:border-palembang-red hover:bg-black/60"
                  >
                    <div className="aspect-[16/9] overflow-hidden rounded-xl">
                      <img src={event.image} alt={event.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                    </div>
                    <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-palembang-red">{event.category}</p>
                    <h3 className="mt-1 font-display text-lg font-bold text-white group-hover:text-palembang-red transition-colors">{event.title}</h3>
                    <div className="mt-3 flex items-center gap-4 text-xs text-white/60">
                      <span className="flex items-center gap-1"><CalendarDays className="size-3.5 text-palembang-red" />{event.date}</span>
                      <span className="flex items-center gap-1"><MapPin className="size-3.5 text-palembang-red" />{event.location.split(",")[0]}</span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        )}
      </main>
      <Footer />
    </>
  )
}

function NotFound() {
  usePageSEO({
    title: "404 Halaman Tidak Ditemukan",
    isExactTitle: true,
  })

  return (
    <main className="flex min-h-svh items-center justify-center px-6 text-center">
      <div>
        <p className="font-display text-7xl font-black text-palembang-red">404</p>
        <h1 className="mt-4 font-display text-3xl font-bold">Cerita ini belum ditemukan.</h1>
        <Link to="/" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-red">
          Kembali ke beranda <ArrowRight className="size-4" />
        </Link>
      </div>
    </main>
  )
}

function PublicLayout() {
  useScrollReveal()
  return (
    <>
      <Header />
      <Outlet />
    </>
  )
}

export function App() {
  return (
    <>
      <Toaster />
      <Routes>
      {/* Public Site */}
      <Route element={<PublicLayout />}>
        <Route path="/" element={<HomePage />} />
        {categories.map((category) => (
          <Route key={category} path={`/${categoryMeta[category].slug}`} element={<CategoryPage category={category} />} />
        ))}
        <Route path="/artikel/:slug" element={<ArticlePage />} />
        <Route path="/agenda" element={<AgendaPage />} />
        <Route path="/agenda/:id" element={<AgendaDetailPage />} />
        <Route path="/penulis/:id" element={<PublicProfilePage />} />
        <Route path="/author/:id" element={<PublicProfilePage />} />
        <Route path="/profil/:id" element={<PublicProfilePage />} />
        <Route path="/publisher/:id" element={<PublicProfilePage />} />
        <Route path="/kolaborasi" element={<CollaborationPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/lupa-password" element={<ForgotPasswordPage />} />
        <Route path="*" element={<NotFound />} />
      </Route>

      {/* Dashboard Site */}
      <Route path="/dashboard" element={<DashboardLayout />}>
        <Route index element={<Overview />} />
        <Route path="website" element={<ManageWebsite />} />

        {/* Account Management */}
        <Route path="account/user" element={<ManageUser />} />
        <Route path="account/user/:id" element={<UserProfile />} />
        <Route path="account/admin" element={<ManageAdmin />} />
        <Route path="account/admin/:id" element={<UserProfile />} />

        {/* Content Management */}
        <Route path="content" element={<Navigate to="/dashboard/content/article" replace />} />
        <Route path="content/article" element={<ManageContent type="Article" />} />
        <Route path="content/event" element={<ManageContent type="Event" />} />

        <Route path="create-article" element={<CreateArticle />} />
        <Route path="create-article/new" element={<CreateArticleEditor />} />
        <Route path="create-article/edit" element={<CreateArticleEditor />} />
        <Route path="article/preview/:id" element={<ArticlePreview />} />
        <Route path="create-article/preview/:id" element={<ArticlePreview />} />

        <Route path="create-event" element={<CreateEvent />} />
        <Route path="create-event/new" element={<CreateEventEditor />} />
        <Route path="create-event/edit" element={<CreateEventEditor />} />
        <Route path="event/preview/:id" element={<EventPreview />} />
        <Route path="create-event/preview/:id" element={<EventPreview />} />

        <Route path="logs" element={<LogActivities />} />
        <Route path="profile" element={<Profile />} />
      </Route>
    </Routes>
    </>
  )
}

export default App
