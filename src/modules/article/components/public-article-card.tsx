import Image from "next/image"
import Link from "next/link"

import type { PublicArticleCardData } from "../types/public-article"

interface PublicArticleCardProps {
  article: PublicArticleCardData
  featured?: boolean
  masonry?: boolean
}

export function PublicArticleCard({
  article,
}: PublicArticleCardProps) {
  return (
    <article className="group flex flex-col">
      <Link
        href={`/artikel/${article.slug}`}
        className="block overflow-hidden"
      >
        <div className="relative aspect-[3/2] w-full overflow-hidden bg-zinc-100 rounded-none">
          <Image
            fill
            src={article.coverImageUrl}
            alt={article.title}
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="size-full object-cover transition-transform duration-500 group-hover:scale-103"
          />
        </div>
      </Link>

      <div className="flex flex-1 flex-col pt-3.5 sm:pt-4">
        <Link href={`/artikel/${article.slug}`}>
          <h3 className="font-sans text-base sm:text-lg font-bold leading-snug tracking-tight text-black transition-colors group-hover:underline line-clamp-2 min-h-[44px] sm:min-h-[48px]">
            {article.title}
          </h3>
        </Link>

        {/* Subtle Dotted Divider Line matching reference */}
        <div className="my-2.5 w-full border-b border-dotted border-zinc-300" />

        {/* Excerpt in classic editorial serif font */}
        <p className="font-serif text-xs sm:text-[13px] leading-relaxed text-black/80 line-clamp-3 min-h-[54px] sm:min-h-[60px]">
          {article.excerpt}
        </p>
      </div>
    </article>
  )
}
