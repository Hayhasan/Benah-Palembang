"use client"

import {
  ArrowLeft,
  ArrowRight,
  CalendarDays,
  Check,
  ChevronDown,
  Eye,
  Heart,
  MapPin,
  MessageCircle,
  Share2,
} from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useState } from "react"
import { toast } from "sonner"

import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { FooterConnectIcon } from "@/modules/website-content/components/footer-connect-icon"

import type { PublicProfileData } from "../types/public-profile"

const MASONRY_ASPECTS = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-square",
  "aspect-[3/5]",
  "aspect-[4/3]",
  "aspect-[5/4]",
]

export function PublicProfilePage({ profile }: { profile: PublicProfileData }) {
  const router = useRouter()
  const [copied, setCopied] = useState(false)
  const [showAll, setShowAll] = useState(false)
  const visibleArticles = showAll ? profile.articles : profile.articles.slice(0, 12)

  async function shareProfile() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `Profil ${profile.name}`,
          url: window.location.href,
        })
      } catch {
        // The native share sheet can be dismissed without changing page state.
      }
      return
    }

    await navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    toast.success("Tautan profil berhasil disalin!")
    window.setTimeout(() => setCopied(false), 1_800)
  }

  return (
    <>
      <main className="min-h-svh bg-palembang-charcoal pb-20 pt-24 text-white">
        <div className="relative">
          <div className="reveal-scale relative h-64 w-full overflow-hidden bg-zinc-900 sm:h-80">
            {/* Profile media may use an administrator-configured external URL. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={profile.bannerUrl}
              alt={`Banner ${profile.name}`}
              className="size-full object-cover opacity-60"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-palembang-charcoal via-palembang-charcoal/40 to-transparent" />
          </div>

          <div className="mx-auto max-w-[1240px] px-6 sm:px-10 lg:px-16">
            <div className="relative -mt-24 sm:-mt-28">
              <button
                type="button"
                onClick={() => router.back()}
                className="reveal-on-scroll mb-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-black/50 px-4 py-1.5 text-xs font-semibold text-white backdrop-blur-md transition-colors hover:border-palembang-red hover:text-palembang-red"
              >
                <ArrowLeft className="size-3.5" /> Kembali
              </button>

              <div className="reveal-on-scroll rounded-[1.75rem] border border-white/10 bg-black/60 p-6 shadow-2xl backdrop-blur-xl sm:p-10">
                <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
                  <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
                    <div className="size-24 shrink-0 overflow-hidden rounded-full border-4 border-palembang-charcoal bg-zinc-800 shadow-xl ring-2 ring-palembang-red/60 sm:size-28">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={profile.avatarUrl}
                        alt={profile.name}
                        className="size-full object-cover"
                      />
                    </div>
                    <div>
                      <h1 className="font-display text-2xl font-bold tracking-tight text-white sm:text-4xl">
                        {profile.name}
                      </h1>
                      <p className="mt-1 text-sm font-medium text-white/70 sm:text-base">
                        {profile.roleLabel}
                      </p>
                      <p className="mt-1 text-xs font-semibold text-palembang-red">
                        @{profile.username}
                      </p>
                      <p className="mt-3 max-w-2xl whitespace-pre-line text-xs leading-6 text-white/60 sm:text-sm">
                        {profile.bio}
                      </p>

                      <div className="mt-6 flex gap-3">
                        {profile.instagramUrl ? (
                          <a href={profile.instagramUrl} target="_blank" rel="noreferrer" aria-label="Instagram" className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-pink-500">
                            <FooterConnectIcon platform="instagram" className="size-5" />
                          </a>
                        ) : null}
                        {profile.xUrl ? (
                          <a href={profile.xUrl} target="_blank" rel="noreferrer" aria-label="X" className="flex size-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/70 transition-colors hover:bg-white/20 hover:text-white">
                            X
                          </a>
                        ) : null}
                        {profile.linkedinUrl ? (
                          <a href={profile.linkedinUrl} target="_blank" rel="noreferrer" aria-label="LinkedIn" className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-blue-400">
                            <FooterConnectIcon platform="linkedin" className="size-5" />
                          </a>
                        ) : null}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 sm:self-start">
                    {profile.whatsappUrl ? (
                      <a href={profile.whatsappUrl} target="_blank" rel="noreferrer" className="flex items-center justify-center gap-2 rounded-xl bg-palembang-red px-4 py-2 text-xs font-bold text-white transition-colors hover:bg-palembang-red/90">
                        <MessageCircle className="size-3.5" /> Hubungi
                      </a>
                    ) : null}
                    <button type="button" onClick={() => void shareProfile()} className="flex items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-2 text-xs font-semibold text-white transition-colors hover:border-palembang-red hover:bg-white/10">
                      {copied ? <Check className="size-3.5 text-emerald-400" /> : <Share2 className="size-3.5" />}
                      {copied ? "Disalin!" : "Bagikan"}
                    </button>
                  </div>
                </div>

                <div className="reveal-stagger mt-8 grid grid-cols-3 divide-x divide-white/10 rounded-2xl border border-white/10 bg-white/5 py-4 text-center">
                  <div>
                    <p className="font-display text-lg font-bold sm:text-2xl">{profile.articleCount}</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/50 sm:text-xs">Artikel</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold sm:text-2xl">{profile.totalViews.toLocaleString("id-ID")}</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/50 sm:text-xs">Total Views</p>
                  </div>
                  <div>
                    <p className="font-display text-lg font-bold sm:text-2xl">{profile.totalLikes.toLocaleString("id-ID")}</p>
                    <p className="text-[10px] uppercase tracking-wider text-white/50 sm:text-xs">Total Suka</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <section className="reveal-on-scroll mx-auto max-w-[1240px] px-6 pt-16 sm:px-10 lg:px-16">
          <div className="reveal-on-scroll mb-10 flex items-end justify-between border-b border-white/10 pb-4">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Koleksi Karya</p>
              <h2 className="mt-1 font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Galeri Publikasi ({profile.articleCount})</h2>
            </div>
            <span className="hidden text-xs text-white/50 sm:inline">Klik artikel untuk membaca cerita lengkap</span>
          </div>

          {visibleArticles.length > 0 ? (
            <div className="relative">
              <div className="reveal-stagger columns-2 gap-4 sm:gap-6 lg:columns-4">
                {visibleArticles.map((article, index) => (
                  <Link key={article.id} href={`/artikel/${article.slug}`} className="group mb-4 block break-inside-avoid overflow-hidden rounded-2xl border border-white/10 bg-black/40 shadow-lg transition-all hover:border-palembang-red/50 hover:shadow-2xl sm:mb-6">
                    <div className={`${MASONRY_ASPECTS[index % MASONRY_ASPECTS.length]} relative overflow-hidden`}>
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={article.coverImageUrl} alt={article.title} loading="lazy" className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-60 transition-opacity group-hover:opacity-80" />
                      <span className="absolute left-3 top-3 rounded-full bg-palembang-red/90 px-2.5 py-0.5 text-[9px] font-bold uppercase tracking-wider text-white shadow">{article.category}</span>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 backdrop-blur-[2px] transition-opacity group-hover:opacity-100">
                        <span className="rounded-full bg-white px-4 py-1.5 text-xs font-bold uppercase tracking-wider text-palembang-charcoal shadow-xl">Lihat Artikel <ArrowRight className="ml-1 inline size-3" /></span>
                      </div>
                    </div>
                    <div className="p-4">
                      <h3 className="line-clamp-2 font-display text-sm font-bold leading-snug transition-colors group-hover:text-palembang-red sm:text-base">{article.title}</h3>
                      <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/60">{article.excerpt}</p>
                      <div className="mt-4 flex items-center justify-between border-t border-white/10 pt-3 text-[10px] text-white/50 sm:text-xs">
                        <span>{article.publishedAtLabel}</span>
                        <div className="flex items-center gap-3">
                          <span className="flex items-center gap-1"><Eye className="size-3 text-palembang-red" />{article.views.toLocaleString("id-ID")}</span>
                          <span className="flex items-center gap-1"><Heart className="size-3 text-palembang-red" />{article.likes.toLocaleString("id-ID")}</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>

              {!showAll && profile.articles.length > 12 ? (
                <div className="reveal-on-scroll absolute inset-x-0 -bottom-8 flex h-64 items-end justify-center bg-gradient-to-t from-palembang-charcoal via-palembang-charcoal/90 to-transparent pb-6">
                  <button type="button" onClick={() => setShowAll(true)} className="group flex items-center gap-3 rounded-full border border-white/20 bg-black/80 px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] shadow-xl transition-all hover:-translate-y-1 hover:border-palembang-red hover:text-palembang-red">
                    View More <ChevronDown className="size-4 transition-transform group-hover:translate-y-0.5" />
                  </button>
                </div>
              ) : null}
            </div>
          ) : (
            <div className="reveal-on-scroll rounded-2xl border border-white/10 bg-white/5 px-6 py-14 text-center text-sm text-white/60">Belum ada artikel yang dipublikasikan.</div>
          )}
        </section>

        {profile.events.length > 0 ? (
          <section className="reveal-on-scroll mx-auto max-w-[1240px] px-6 pt-20 sm:px-10 lg:px-16">
            <p className="reveal-on-scroll text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">Penyelenggara Resmi</p>
            <h2 className="reveal-on-scroll reveal-delay-100 mt-1 font-display text-2xl font-bold tracking-[-0.03em] sm:text-3xl">Agenda & Acara Terkait ({profile.events.length})</h2>
            <div className="reveal-stagger mt-8 grid gap-6 sm:grid-cols-2">
              {profile.events.map((event) => (
                <Link key={event.id} href={`/agenda/${event.id}`} className="group block rounded-2xl border border-white/10 bg-black/40 p-4 transition-all hover:border-palembang-red hover:bg-black/60">
                  <div className="aspect-video overflow-hidden rounded-xl">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={event.bannerUrl} alt={event.title} className="size-full object-cover transition-transform duration-500 group-hover:scale-105" />
                  </div>
                  <p className="mt-3 text-[10px] font-bold uppercase tracking-wider text-palembang-red">{event.category}</p>
                  <h3 className="mt-1 font-display text-lg font-bold transition-colors group-hover:text-palembang-red">{event.title}</h3>
                  <p className="mt-2 line-clamp-2 text-xs leading-5 text-white/60">{event.description}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-white/60">
                    <span className="flex items-center gap-1"><CalendarDays className="size-3.5 text-palembang-red" />{event.dateLabel}</span>
                    <span className="flex items-center gap-1"><MapPin className="size-3.5 text-palembang-red" />{event.location.split(",")[0]}</span>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        ) : null}
      </main>
      <Footer />
    </>
  )
}
