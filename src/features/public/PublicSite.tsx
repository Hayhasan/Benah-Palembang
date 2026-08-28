"use client"

import Link from "next/link"
import { useParams } from "@/lib/navigation"
import { useState } from "react"
import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Heart,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleCard } from "@/features/public/components/ArticleCard"
import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { SectionHeading } from "@/features/public/components/SectionHeading"
import { articles, categoryMeta } from "@/data/mockData"

const dummyComments = [
  { id: 1, name: "Rina Sari", avatar: "https://i.pravatar.cc/80?img=1", time: "2 jam lalu", text: "Artikel yang sangat menarik! Palembang memang penuh dengan cerita yang perlu diangkat." },
  { id: 2, name: "Budi Hartono", avatar: "https://i.pravatar.cc/80?img=3", time: "5 jam lalu", text: "Terima kasih sudah mengangkat topik ini. Sebagai warga Palembang, saya sangat tersentuh." },
  { id: 3, name: "Dewi Ayu", avatar: "https://i.pravatar.cc/80?img=5", time: "1 hari lalu", text: "Sudah lama menunggu platform seperti ini. Semoga terus berkembang dan konsisten!" },
  { id: 4, name: "Ahmad Fauzi", avatar: "https://i.pravatar.cc/80?img=8", time: "2 hari lalu", text: "Perspektif yang segar. Saya suka cara penulisannya yang mendalam tapi tetap ringan dibaca." },
  { id: 5, name: "Siti Rahma", avatar: "https://i.pravatar.cc/80?img=9", time: "3 hari lalu", text: "Foto dan visual pendukungnya luar biasa ciamik. Bangga dengan kebudayaan kita!" },
  { id: 6, name: "Reza Pratama", avatar: "https://i.pravatar.cc/80?img=11", time: "4 hari lalu", text: "Ditunggu liputan seputar kuliner malam lorong basah dan tempat nongkrong seni lainnya." },
]

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

export function NotFound() {
  return <main className="flex min-h-svh items-center justify-center px-6 text-center"><div><p className="font-display text-7xl font-black text-palembang-red">404</p><h1 className="mt-4 font-display text-3xl font-bold">Cerita ini belum ditemukan.</h1><Link href="/" className="mt-8 inline-flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-palembang-red">Kembali ke beranda <ArrowRight className="size-4" /></Link></div></main>
}

// `PublicLayout` versi react-router (Header + <Outlet />) kini menjadi
// `src/app/(public)/layout.tsx`.
