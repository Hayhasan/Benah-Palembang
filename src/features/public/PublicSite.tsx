"use client"

import Link from "next/link"
import { useParams } from "@/lib/navigation"
import { useEffect, useState } from "react"
import {
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Clock3,
  Copy,
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
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/features/public/components/ArticleCard"
import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { SectionHeading } from "@/features/public/components/SectionHeading"
import {
  agendaItems,
  articles,
  categoryMeta,
  type Category,
} from "@/data/mockData"

const dummyComments = [
  { id: 1, name: "Rina Sari", avatar: "https://i.pravatar.cc/80?img=1", time: "2 jam lalu", text: "Artikel yang sangat menarik! Palembang memang penuh dengan cerita yang perlu diangkat." },
  { id: 2, name: "Budi Hartono", avatar: "https://i.pravatar.cc/80?img=3", time: "5 jam lalu", text: "Terima kasih sudah mengangkat topik ini. Sebagai warga Palembang, saya sangat tersentuh." },
  { id: 3, name: "Dewi Ayu", avatar: "https://i.pravatar.cc/80?img=5", time: "1 hari lalu", text: "Sudah lama menunggu platform seperti ini. Semoga terus berkembang dan konsisten!" },
  { id: 4, name: "Ahmad Fauzi", avatar: "https://i.pravatar.cc/80?img=8", time: "2 hari lalu", text: "Perspektif yang segar. Saya suka cara penulisannya yang mendalam tapi tetap ringan dibaca." },
  { id: 5, name: "Siti Rahma", avatar: "https://i.pravatar.cc/80?img=9", time: "3 hari lalu", text: "Foto dan visual pendukungnya luar biasa ciamik. Bangga dengan kebudayaan kita!" },
  { id: 6, name: "Reza Pratama", avatar: "https://i.pravatar.cc/80?img=11", time: "4 hari lalu", text: "Ditunggu liputan seputar kuliner malam lorong basah dan tempat nongkrong seni lainnya." },
]

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

  return <><main className="pt-24"><article><header className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-28 text-white sm:px-10 lg:px-16"><div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-45"><img src={article.coverImage} alt={article.title} className="size-full object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" /><div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" /></div><div className="relative z-10 mx-auto max-w-[1040px]"><Link href={`/${categoryMeta[article.category].slug}`} className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold">{article.category}</Link><h1 className="mt-6 max-w-4xl font-display text-4xl font-black leading-[1.0] tracking-[-0.05em] sm:text-6xl lg:text-7xl">{article.title}</h1><p className="mt-8 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">{article.excerpt}</p><div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-y border-white/15 py-5"><div className="flex items-center gap-3"><img src={article.author.avatar} alt={article.author.name} className="size-11 rounded-full object-cover" /><div><p className="text-sm font-semibold text-white">{article.author.name}</p><p className="text-xs text-white/60">{article.author.role} · {article.publishedAt}</p></div></div><div className="flex items-center gap-5 text-xs text-white/70"><span className="flex items-center gap-2"><Clock3 className="size-4" />{article.readingTime} min read</span><span className="flex items-center gap-2"><Heart className="size-4" />{article.likes.toLocaleString()} likes</span><span>{article.views.toLocaleString()} views</span></div></div></div></header><div className="mx-auto grid max-w-[1040px] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[60px_1fr] lg:py-20"><aside className="hidden lg:block"><div className="sticky top-28 flex flex-col items-center gap-3"><button aria-label="Sukai artikel" onClick={() => setLiked((value) => !value)} className={`rounded-full border p-3 transition-colors ${liked ? "border-palembang-red bg-palembang-red text-white" : "border-border hover:border-palembang-red hover:text-palembang-red"}`}><Heart className={`size-4 ${liked ? "fill-current" : ""}`} /></button><button aria-label="Bagikan artikel" onClick={() => void navigator.share?.({ title: article.title, url: window.location.href })} className="rounded-full border border-border p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"><Share2 className="size-4" /></button><button aria-label="Salin tautan" onClick={() => void copyLink()} className="rounded-full border border-border p-3 transition-colors hover:border-palembang-red hover:text-palembang-red">{copied ? <Check className="size-4" /> : <Copy className="size-4" />}</button></div></aside><div><div className="article-body" dangerouslySetInnerHTML={{ __html: article.content }} /><div className="mt-10 flex flex-wrap gap-2">{article.tags.map((tag) => <span key={tag} className="rounded-full bg-muted px-3 py-1.5 text-xs opacity-75">#{tag}</span>)}</div><div className="mt-12 flex gap-3 lg:hidden"><Button variant="outline" size="sm" onClick={() => setLiked((value) => !value)}><Heart className={`size-4 ${liked ? "fill-palembang-red text-palembang-red" : ""}`} /> Suka</Button><Button variant="outline" size="sm" onClick={() => void copyLink()}>{copied ? <Check className="size-4" /> : <Copy className="size-4" />} Salin tautan</Button></div><div className="mt-16 border-t border-border pt-10"><div className="flex items-center gap-3 mb-8"><MessageCircle className="size-5 text-palembang-red" /><h3 className="font-display text-xl font-bold tracking-[-0.03em]">Komentar ({dummyComments.length})</h3></div><form onSubmit={e => e.preventDefault()} className="mb-8 flex gap-3"><img src="https://i.pravatar.cc/80?img=12" alt="You" className="size-10 rounded-full object-cover" /><div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2"><input placeholder="Tulis komentar..." className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" /><button type="submit" className="rounded-full p-1.5 text-palembang-red transition-colors hover:bg-palembang-red/10"><Send className="size-4" /></button></div></form><div className="relative"><div className="space-y-6">{visibleComments.map(c => <div key={c.id} className="flex gap-3"><img src={c.avatar} alt={c.name} className="size-10 rounded-full object-cover" /><div><div className="flex items-center gap-2"><p className="text-sm font-semibold">{c.name}</p><span className="text-[10px] text-muted-foreground">{c.time}</span></div><p className="mt-1 text-sm leading-6 opacity-80">{c.text}</p></div></div>)}</div>{hasMoreComments && <div className="absolute inset-x-0 -bottom-4 flex h-36 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-2 backdrop-blur-[2px]"><button onClick={() => setShowAllComments(true)} className="group flex items-center gap-2 rounded-full border border-border bg-background/95 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-palembang-red hover:text-palembang-red">Lihat Komentar Lainnya ({dummyComments.length - 4}) <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" /></button></div>}</div></div></div></div></article></main><section className="bg-palembang-off-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28 text-palembang-charcoal"><div className="mx-auto max-w-[1240px]"><div className="flex items-end justify-between gap-6"><SectionHeading eyebrow="Lanjutkan membaca" title="More Stories" /><Link href={`/${categoryMeta[article.category].slug}`} className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] sm:flex">View all stories <ArrowRight className="size-4" /></Link></div><div className="mt-12 grid gap-8 md:grid-cols-3">{related.map((item) => <ArticleCard key={item.id} article={item} />)}</div></div></section><Footer /></>
}

export function AgendaPage() {
  const [filter, setFilter] = useState("this-month")
  const [showAll, setShowAll] = useState(false)
  
  const initialCount = 4
  const visibleAgenda = showAll ? agendaItems : agendaItems.slice(0, initialCount)
  const hasMore = !showAll && agendaItems.length > initialCount

  return <><div className="relative overflow-hidden bg-palembang-red px-6 pb-24 pt-40 text-white sm:px-10 lg:px-16"><div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-40"><img src="https://images.pexels.com/photos/38956265/pexels-photo-38956265.jpeg?auto=compress&cs=tinysrgb&w=1200&h=800&fit=crop" alt="Agenda Palembang" className="size-full object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-palembang-red via-palembang-red/50 to-transparent" /><div className="absolute inset-0 bg-gradient-to-b from-palembang-red/40 via-transparent to-palembang-red" /></div><div className="relative z-10 mx-auto max-w-[1240px]"><p className="text-[10px] font-bold uppercase tracking-[0.24em] text-white/80">Agenda Palembang</p><h1 className="mt-6 max-w-4xl font-display text-6xl font-black leading-[0.9] tracking-[-0.065em] sm:text-8xl">Temui, ikut,<br />dan bergerak.</h1><p className="mt-8 max-w-lg text-base leading-7 text-white/85">Ruang-ruang pertemuan yang mempertemukan ide, orang, dan energi baik untuk Palembang.</p></div></div><main className="px-6 py-20 sm:px-10 lg:px-16 lg:py-28"><div className="mx-auto max-w-[1240px]"><div className="mb-12 flex gap-4 overflow-x-auto border-b border-border pb-px"><button onClick={() => setFilter("this-month")} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${filter === "this-month" ? "border-palembang-red text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>This Month</button><button onClick={() => setFilter("upcoming")} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${filter === "upcoming" ? "border-palembang-red text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Upcoming</button><button onClick={() => setFilter("past")} className={`whitespace-nowrap border-b-2 px-1 pb-3 text-sm font-semibold transition-colors ${filter === "past" ? "border-palembang-red text-foreground" : "border-transparent text-muted-foreground hover:text-foreground"}`}>Past Event</button></div><div className="relative"><div className="grid gap-8">{visibleAgenda.map((item) => <Link key={item.id} href={`/agenda/${item.id}`} className="group grid gap-6 border-b border-border pb-8 md:grid-cols-[240px_1fr_220px] md:gap-10"><div className="img-zoom aspect-[4/3] overflow-hidden rounded-2xl"><img src={item.image} alt={item.title} className="size-full object-cover" loading="lazy" /></div><div><p className="text-[10px] font-bold uppercase tracking-[0.18em] text-palembang-red">{item.category}</p><h2 className="mt-3 max-w-xl font-display text-3xl font-bold leading-tight tracking-[-0.04em] transition-colors group-hover:text-palembang-red">{item.title}</h2><p className="mt-3 max-w-lg text-sm leading-6 text-muted-foreground">{item.description}</p><p className="mt-5 text-xs font-semibold text-muted-foreground">{item.organizer}</p></div><div className="flex flex-col justify-between text-sm"><div className="space-y-2 text-muted-foreground"><p className="flex items-center gap-2"><CalendarDays className="size-4 text-palembang-red" />{item.date}</p><p className="flex items-center gap-2"><Clock3 className="size-4 text-palembang-red" />{item.time}</p><p className="flex items-center gap-2"><MapPin className="size-4 text-palembang-red" />{item.location}</p></div><span className="mt-6 inline-flex w-fit items-center gap-2 rounded-full border border-border px-4 py-2 text-xs font-semibold text-foreground transition-all group-hover:border-palembang-red group-hover:text-palembang-red"><Ticket className="size-4" />Detail acara</span></div></Link>)}</div>{hasMore && <div className="absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-6 backdrop-blur-[2px]"><button onClick={() => setShowAll(true)} className="group flex items-center gap-3 rounded-full border border-border bg-background/95 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-xl backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red">Tampilkan Seluruh Agenda ({agendaItems.length} Acara) <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" /></button></div>}</div></div></main><Footer /></>
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
  
  return <><div className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-40 text-white sm:px-10 lg:px-16"><div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-30 lg:opacity-45"><img src={item.image} alt={item.title} className="size-full object-cover object-right" /><div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" /><div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" /></div><div className="relative z-10 mx-auto max-w-[1240px]"><Link href="/agenda" className="inline-flex items-center gap-2 text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold hover:underline"><ArrowRight className="size-3 rotate-180" /> Kembali ke Agenda</Link><div className="mt-6"><span className="inline-block rounded-full border border-palembang-gold/40 bg-palembang-gold/15 px-3.5 py-1 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">{item.category}</span></div><h1 className="mt-4 max-w-4xl font-display text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl lg:text-8xl">{item.title}</h1><p className="mt-8 max-w-2xl text-base leading-7 text-white/75 sm:text-lg">{item.description}</p></div></div><main className="px-6 py-16 sm:px-10 lg:px-16 lg:py-24"><div className="mx-auto max-w-[1240px]"><div className="grid gap-12 lg:grid-cols-[1fr_380px]"><div><div className="overflow-hidden rounded-[1.5rem]"><img src={item.image} alt={item.title} className="aspect-[16/9] w-full object-cover" /></div><div className="mt-10"><h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Tentang Acara</h2><p className="mt-4 text-base leading-8 text-muted-foreground">{item.description}</p><p className="mt-4 text-base leading-8 text-muted-foreground">Acara ini terbuka untuk umum dan dirancang untuk mempertemukan berbagai elemen masyarakat Palembang — dari akademisi, pelaku kreatif, hingga warga biasa yang peduli dengan masa depan kota. Hadir dan rasakan energi kolaboratif yang mendorong perubahan nyata.</p><p className="mt-4 text-base leading-8 text-muted-foreground">Peserta diharapkan datang tepat waktu. Registrasi dibuka 30 menit sebelum acara dimulai. Tersedia sertifikat kehadiran bagi peserta yang mendaftar.</p></div><div className="mt-10"><h2 className="font-display text-2xl font-bold tracking-[-0.03em]">Yang Akan Kamu Dapatkan</h2><ul className="mt-4 space-y-3">{["Insight dan perspektif baru dari para narasumber berpengalaman", "Networking dengan komunitas dan pelaku kreatif Palembang", "Sertifikat kehadiran resmi dari penyelenggara", "Konsumsi dan goodie bag untuk peserta terdaftar"].map(benefit => <li key={benefit} className="flex items-start gap-3 text-sm leading-6 text-muted-foreground"><Check className="mt-0.5 size-4 flex-shrink-0 text-palembang-red" />{benefit}</li>)}</ul></div></div><div><div className="sticky top-28 space-y-6"><div className="rounded-[1.5rem] border border-border bg-background p-6 shadow-sm"><h3 className="font-display text-lg font-bold">Detail Acara</h3><div className="mt-6 space-y-5"><div className="flex items-start gap-3"><CalendarDays className="mt-0.5 size-5 text-palembang-red" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Tanggal</p><p className="mt-1 text-sm font-semibold">{item.date}</p></div></div><div className="flex items-start gap-3"><Clock3 className="mt-0.5 size-5 text-palembang-red" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Waktu</p><p className="mt-1 text-sm font-semibold">{item.time}</p></div></div><div className="flex items-start gap-3"><MapPin className="mt-0.5 size-5 text-palembang-red" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Lokasi</p><p className="mt-1 text-sm font-semibold">{item.location}</p></div></div><div className="flex items-start gap-3"><Sparkles className="mt-0.5 size-5 text-palembang-red" /><div><p className="text-xs font-bold uppercase tracking-[0.12em] text-muted-foreground">Penyelenggara</p><p className="mt-1 text-sm font-semibold">{item.organizer}</p></div></div></div><div className="mt-8 grid gap-3"><a href={`https://wa.me/628551241878?text=${encodeURIComponent(waMessage)}`} target="_blank" rel="noopener noreferrer" className="flex h-11 w-full items-center justify-center gap-2 rounded-md bg-palembang-red text-sm font-bold text-white transition-colors hover:bg-palembang-red/90"><Ticket className="size-4" /> Daftar Sekarang</a><Button type="button" variant="outline" onClick={handleShare} className="h-11 w-full font-semibold">{copied ? <><Check className="size-4 text-emerald-600" /><span className="text-emerald-600">Tautan Disalin!</span></> : <><Share2 className="size-4" /><span>Bagikan Acara</span></>}</Button></div></div><div className="rounded-[1.5rem] border border-border bg-muted/40 p-6"><div className="inline-flex items-center gap-2 rounded-full bg-palembang-charcoal px-3 py-1 text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-gold"><Sparkles className="size-3" /> {item.category}</div><h4 className="mt-3 font-display text-base font-bold text-foreground">Kategori: {item.category}</h4><p className="mt-2 text-xs leading-5 text-muted-foreground">Acara ini juga terbuka untuk kolaborasi komunitas dan publik. Hubungi penyelenggara untuk informasi lebih lanjut.</p></div></div></div></div></div></main><section className="bg-palembang-off-white px-6 py-20 sm:px-10 lg:px-16 lg:py-28 text-palembang-charcoal"><div className="mx-auto max-w-[1240px]"><SectionHeading eyebrow="Jangan lewatkan" title="Agenda Lainnya" /><div className="mt-12 grid gap-8 md:grid-cols-3">{otherAgenda.map(a => <Link key={a.id} href={`/agenda/${a.id}`} className="group"><div className="img-zoom aspect-[4/3] overflow-hidden rounded-[1.25rem]"><img src={a.image} alt={a.title} className="size-full object-cover" loading="lazy" /></div><p className="mt-4 text-[10px] font-bold uppercase tracking-[0.18em] text-palembang-red">{a.category}</p><h3 className="mt-2 font-display text-xl font-bold leading-tight tracking-[-0.03em] transition-colors group-hover:text-palembang-red">{a.title}</h3><div className="mt-3 flex items-center gap-4 text-xs text-muted-foreground"><span className="flex items-center gap-1.5"><CalendarDays className="size-3.5" />{a.date}</span><span className="flex items-center gap-1.5"><MapPin className="size-3.5" />{a.location.split(",")[0]}</span></div></Link>)}</div></div></section><Footer /></>
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

export function NotFound() {
  return <main className="flex min-h-svh items-center justify-center px-6 text-center"><div><p className="font-display text-7xl font-black text-palembang-red">404</p><h1 className="mt-4 font-display text-3xl font-bold">Cerita ini belum ditemukan.</h1><Link href="/" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-red">Kembali ke beranda <ArrowRight className="size-4" /></Link></div></main>
}

// `PublicLayout` versi react-router (Header + <Outlet />) kini menjadi
// `src/app/(public)/layout.tsx`.
