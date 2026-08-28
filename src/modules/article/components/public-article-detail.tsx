"use client"

import {
  ArrowRight,
  Check,
  ChevronDown,
  Clock3,
  Copy,
  Eye,
  Heart,
  MessageCircle,
  Send,
  Share2,
} from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { PublicFooter as Footer } from "@/features/public/components/PublicFooter"
import { SectionHeading } from "@/features/public/components/SectionHeading"

import { getPublicArticleMockStats } from "../constants/public-article-stats"
import type { PublicArticlePageData } from "../types/public-article"
import { PublicArticleCard } from "./public-article-card"

const dummyComments = [
  {
    id: 1,
    name: "Rina Sari",
    avatar: "https://i.pravatar.cc/80?img=1",
    time: "2 jam lalu",
    text: "Artikel yang sangat menarik! Palembang memang penuh dengan cerita yang perlu diangkat.",
  },
  {
    id: 2,
    name: "Budi Hartono",
    avatar: "https://i.pravatar.cc/80?img=3",
    time: "5 jam lalu",
    text: "Terima kasih sudah mengangkat topik ini. Sebagai warga Palembang, saya sangat tersentuh.",
  },
  {
    id: 3,
    name: "Dewi Ayu",
    avatar: "https://i.pravatar.cc/80?img=5",
    time: "1 hari lalu",
    text: "Sudah lama menunggu platform seperti ini. Semoga terus berkembang dan konsisten!",
  },
  {
    id: 4,
    name: "Ahmad Fauzi",
    avatar: "https://i.pravatar.cc/80?img=8",
    time: "2 hari lalu",
    text: "Perspektif yang segar. Saya suka cara penulisannya yang mendalam tapi tetap ringan dibaca.",
  },
  {
    id: 5,
    name: "Siti Rahma",
    avatar: "https://i.pravatar.cc/80?img=9",
    time: "3 hari lalu",
    text: "Foto dan visual pendukungnya luar biasa ciamik. Bangga dengan kebudayaan kita!",
  },
  {
    id: 6,
    name: "Reza Pratama",
    avatar: "https://i.pravatar.cc/80?img=11",
    time: "4 hari lalu",
    text: "Ditunggu liputan seputar kuliner malam lorong basah dan tempat nongkrong seni lainnya.",
  },
]

export function PublicArticleDetail({
  data,
}: {
  data: PublicArticlePageData
}) {
  const { article, relatedArticles } = data
  const stats = getPublicArticleMockStats(article.id)
  const [liked, setLiked] = useState(false)
  const [copied, setCopied] = useState(false)
  const [showAllComments, setShowAllComments] = useState(false)

  const visibleComments = showAllComments
    ? dummyComments
    : dummyComments.slice(0, 4)
  const hasMoreComments = dummyComments.length > 4 && !showAllComments

  async function copyLink() {
    await navigator.clipboard?.writeText(window.location.href)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1_800)
  }

  function shareArticle() {
    void navigator.share?.({
      title: article.title,
      url: window.location.href,
    })
  }

  return (
    <>
      <main className="pt-24">
        <article>
          <header className="relative overflow-hidden bg-palembang-charcoal px-6 pb-20 pt-28 text-white sm:px-10 lg:px-16">
            <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-30 sm:w-2/3 lg:w-1/2 lg:opacity-45">
              <Image
                fill
                priority
                src={article.coverImageUrl}
                alt={article.title}
                sizes="(min-width: 1024px) 50vw, (min-width: 640px) 67vw, 100vw"
                className="object-cover object-right"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-palembang-charcoal via-palembang-charcoal/60 to-transparent" />
              <div className="absolute inset-0 bg-gradient-to-b from-palembang-charcoal/40 via-transparent to-palembang-charcoal" />
            </div>
            <div className="relative z-10 mx-auto max-w-[1040px]">
              <Link
                href={`/${article.categorySlug}`}
                className="text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-gold"
              >
                {article.category}
              </Link>
              <h1 className="mt-6 max-w-4xl font-display text-4xl font-black leading-[1] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                {article.title}
              </h1>
              <p className="mt-8 max-w-2xl text-base leading-7 text-white/80 sm:text-lg">
                {article.excerpt}
              </p>
              <div className="mt-10 flex flex-wrap items-center justify-between gap-6 border-y border-white/15 py-5">
                <div className="flex items-center gap-3">
                  {/* Avatar profile may come from an external URL outside the cover image allowlist. */}
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    className="size-11 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-sm font-semibold text-white">
                      {article.author.name}
                    </p>
                    <p className="text-xs text-white/60">
                      {article.author.roleLabel} · {article.publishedAtLabel}
                    </p>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-5 text-xs text-white/70">
                  <span className="flex items-center gap-2">
                    <Clock3 className="size-4" />
                    {article.readingTime} min read
                  </span>
                  <span className="flex items-center gap-2">
                    <Heart className="size-4" />
                    {stats.likes.toLocaleString("id-ID")} likes
                  </span>
                  <span className="flex items-center gap-2">
                    <Eye className="size-4" />
                    {stats.views.toLocaleString("id-ID")} views
                  </span>
                </div>
              </div>
            </div>
          </header>

          <div className="mx-auto grid max-w-[1040px] gap-12 px-6 py-16 sm:px-10 lg:grid-cols-[60px_1fr] lg:py-20">
            <aside className="hidden lg:block">
              <div className="sticky top-28 flex flex-col items-center gap-3">
                <button
                  type="button"
                  aria-label="Sukai artikel"
                  onClick={() => setLiked((value) => !value)}
                  className={`rounded-full border p-3 transition-colors ${liked ? "border-palembang-red bg-palembang-red text-white" : "border-border hover:border-palembang-red hover:text-palembang-red"}`}
                >
                  <Heart className={`size-4 ${liked ? "fill-current" : ""}`} />
                </button>
                <button
                  type="button"
                  aria-label="Bagikan artikel"
                  onClick={shareArticle}
                  className="rounded-full border border-border p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"
                >
                  <Share2 className="size-4" />
                </button>
                <button
                  type="button"
                  aria-label="Salin tautan"
                  onClick={() => void copyLink()}
                  className="rounded-full border border-border p-3 transition-colors hover:border-palembang-red hover:text-palembang-red"
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                </button>
              </div>
            </aside>

            <div>
              <div
                className="article-body"
                dangerouslySetInnerHTML={{ __html: article.content }}
              />

              {article.tags.length > 0 ? (
                <div className="mt-10 flex flex-wrap gap-2">
                  {article.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-muted px-3 py-1.5 text-xs opacity-75"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              ) : null}

              <div className="mt-12 flex flex-wrap gap-3 lg:hidden">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setLiked((value) => !value)}
                >
                  <Heart
                    className={`size-4 ${liked ? "fill-palembang-red text-palembang-red" : ""}`}
                  />
                  Suka
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void copyLink()}
                >
                  {copied ? (
                    <Check className="size-4" />
                  ) : (
                    <Copy className="size-4" />
                  )}
                  Salin tautan
                </Button>
              </div>

              <div className="mt-16 rounded-[1.5rem] bg-muted/50 p-6 sm:p-8">
                <div className="flex items-center gap-4">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={article.author.avatarUrl}
                    alt={article.author.name}
                    className="size-16 rounded-full object-cover"
                  />
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-red">
                      Tentang Penulis
                    </p>
                    <h2 className="mt-1 font-display text-xl font-bold">
                      {article.author.name}
                    </h2>
                  </div>
                </div>
                <p className="mt-5 text-sm leading-6 text-muted-foreground">
                  {article.author.bio}
                </p>
              </div>

              <div className="mt-16 border-t border-border pt-10">
                <div className="mb-8 flex items-center gap-3">
                  <MessageCircle className="size-5 text-palembang-red" />
                  <h3 className="font-display text-xl font-bold tracking-[-0.03em]">
                    Komentar ({dummyComments.length})
                  </h3>
                </div>
                <form
                  onSubmit={(event) => event.preventDefault()}
                  className="mb-8 flex gap-3"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src="https://i.pravatar.cc/80?img=12"
                    alt="You"
                    className="size-10 rounded-full object-cover"
                  />
                  <div className="flex flex-1 items-center gap-2 rounded-full border border-border bg-muted/50 px-4 py-2">
                    <input
                      placeholder="Tulis komentar..."
                      className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
                    />
                    <button
                      type="submit"
                      aria-label="Kirim komentar"
                      className="rounded-full p-1.5 text-palembang-red transition-colors hover:bg-palembang-red/10"
                    >
                      <Send className="size-4" />
                    </button>
                  </div>
                </form>
                <div className="relative">
                  <div className="space-y-6">
                    {visibleComments.map((comment) => (
                      <div key={comment.id} className="flex gap-3">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={comment.avatar}
                          alt={comment.name}
                          className="size-10 rounded-full object-cover"
                        />
                        <div>
                          <div className="flex items-center gap-2">
                            <p className="text-sm font-semibold">
                              {comment.name}
                            </p>
                            <span className="text-[10px] text-muted-foreground">
                              {comment.time}
                            </span>
                          </div>
                          <p className="mt-1 text-sm leading-6 opacity-80">
                            {comment.text}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                  {hasMoreComments ? (
                    <div className="absolute inset-x-0 -bottom-4 flex h-36 items-end justify-center bg-gradient-to-t from-background via-background/90 to-transparent pb-2 backdrop-blur-[2px]">
                      <button
                        type="button"
                        onClick={() => setShowAllComments(true)}
                        className="group flex items-center gap-2 rounded-full border border-border bg-background/95 px-6 py-2.5 text-xs font-bold uppercase tracking-[0.14em] text-foreground shadow-lg backdrop-blur-md transition-all duration-300 hover:-translate-y-0.5 hover:border-palembang-red hover:text-palembang-red"
                      >
                        Lihat Komentar Lainnya ({dummyComments.length - 4})
                        <ChevronDown className="size-4 transition-transform duration-300 group-hover:translate-y-0.5" />
                      </button>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </article>
      </main>

      {relatedArticles.length > 0 ? (
        <section className="bg-palembang-off-white px-6 py-20 text-palembang-charcoal sm:px-10 lg:px-16 lg:py-28">
          <div className="mx-auto max-w-[1240px]">
            <div className="flex items-end justify-between gap-6">
              <SectionHeading
                eyebrow="Lanjutkan membaca"
                title="More Stories"
              />
              <Link
                href={`/${article.categorySlug}`}
                className="hidden items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] sm:flex"
              >
                View all stories <ArrowRight className="size-4" />
              </Link>
            </div>
            <div className="mt-12 grid gap-8 md:grid-cols-3">
              {relatedArticles.map((relatedArticle) => (
                <PublicArticleCard
                  key={relatedArticle.id}
                  article={relatedArticle}
                />
              ))}
            </div>
          </div>
        </section>
      ) : null}
      <Footer />
    </>
  )
}
