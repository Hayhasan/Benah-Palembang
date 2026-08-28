import { ArrowRight } from "lucide-react"
import Image from "next/image"
import Link from "next/link"

import type { PublicArticleCardData } from "../types/public-article"

const masonryAspects = [
  "aspect-[3/4]",
  "aspect-[4/5]",
  "aspect-[1/1]",
  "aspect-[3/5]",
  "aspect-[4/3]",
  "aspect-[5/6]",
  "aspect-[2/3]",
  "aspect-[7/8]",
  "aspect-[5/7]",
  "aspect-[3/4]",
]

function getCardAspect(id: number, featured: boolean) {
  if (featured) return "aspect-[16/9]"
  return masonryAspects[id % masonryAspects.length]
}

interface PublicArticleCardProps {
  article: PublicArticleCardData
  featured?: boolean
  masonry?: boolean
}

export function PublicArticleCard({
  article,
  featured = false,
  masonry = false,
}: PublicArticleCardProps) {
  const aspect = masonry
    ? getCardAspect(article.id, false)
    : featured
      ? "aspect-[4/3] lg:aspect-[16/9]"
      : "aspect-[4/3]"

  return (
    <Link
      href={`/artikel/${article.slug}`}
      className={`group relative block overflow-hidden ${masonry ? "mb-4 break-inside-avoid sm:mb-6" : ""} ${featured && !masonry ? "lg:col-span-2" : ""}`}
    >
      <div
        className={`img-zoom relative overflow-hidden rounded-xl sm:rounded-[1.5rem] ${aspect}`}
      >
        <Image
          fill
          src={article.coverImageUrl}
          alt={article.title}
          sizes={
            featured
              ? "(max-width: 1024px) 50vw, 50vw"
              : "(max-width: 640px) 50vw, (max-width: 1024px) 50vw, 25vw"
          }
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 flex translate-y-4 flex-col justify-end p-4 text-white opacity-0 transition-all duration-500 group-hover:translate-y-0 group-hover:opacity-100 sm:p-7">
          <div className="mb-2 flex flex-wrap items-center gap-2 text-[8px] font-bold uppercase tracking-[0.16em] sm:gap-3 sm:text-[10px]">
            <span className="text-palembang-gold">{article.category}</span>
            <span className="text-white/60">
              {article.publishedAtLabel}
            </span>
          </div>
          <h3
            className={`font-display font-bold leading-[1.1] tracking-[-0.035em] ${featured && !masonry ? "text-lg sm:text-2xl lg:text-4xl" : "text-base sm:text-xl lg:text-2xl"}`}
          >
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[10px] leading-4 text-white/80 sm:text-sm sm:leading-5">
            {article.excerpt}
          </p>
          <div className="mt-3 flex items-center gap-2 text-[10px] font-semibold uppercase tracking-[0.12em] text-palembang-gold sm:mt-4 sm:text-xs">
            Baca <ArrowRight className="size-3 sm:size-4" />
          </div>
        </div>
      </div>
      <div className="mt-2 px-1 sm:mt-3">
        <h4 className="line-clamp-2 font-display text-xs font-bold leading-snug tracking-[-0.02em] transition-colors duration-300 group-hover:text-palembang-red sm:text-sm">
          {article.title}
        </h4>
        <p className="mt-1 line-clamp-2 text-[10px] leading-4 opacity-60 sm:text-xs sm:leading-5">
          {article.excerpt}
        </p>
      </div>
    </Link>
  )
}
