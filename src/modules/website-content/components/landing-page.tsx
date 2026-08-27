import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Sparkles } from "lucide-react"

import { ArticleCard } from "@/features/public/components/ArticleCard"
import { PublicFooter } from "@/features/public/components/PublicFooter"
import { SectionHeading } from "@/features/public/components/SectionHeading"
import { articles, categoryMeta } from "@/data/mockData"

import type {
  LandingArticleSectionData,
  LandingPageData,
  WebsiteArticleSectionTheme,
} from "../types/landing-page"
import { LandingHero } from "./landing-hero"

interface LandingPageProps {
  data: LandingPageData
}

interface ThemeStyle {
  background: string
  gradientHorizontal: string
  gradientVertical: string
  link: string
  buttonBorder: string
  darkHeading: boolean
}

const themeStyles: Record<WebsiteArticleSectionTheme, ThemeStyle> = {
  DEFAULT: {
    background: "bg-background text-foreground",
    gradientHorizontal: "from-background via-background/60",
    gradientVertical: "from-background/40 via-transparent to-background",
    link: "text-palembang-charcoal",
    buttonBorder:
      "border-palembang-charcoal group-hover:bg-palembang-charcoal group-hover:text-white",
    darkHeading: false,
  },
  RED: {
    background: "bg-palembang-red text-white",
    gradientHorizontal: "from-palembang-red via-palembang-red/60",
    gradientVertical:
      "from-palembang-red/40 via-transparent to-palembang-red",
    link: "text-white",
    buttonBorder:
      "border-white group-hover:bg-white group-hover:text-palembang-red",
    darkHeading: true,
  },
  OFF_WHITE: {
    background: "bg-palembang-off-white text-palembang-charcoal",
    gradientHorizontal:
      "from-palembang-off-white via-palembang-off-white/60",
    gradientVertical:
      "from-palembang-off-white/40 via-transparent to-palembang-off-white",
    link: "text-palembang-charcoal",
    buttonBorder:
      "border-palembang-charcoal group-hover:bg-palembang-charcoal group-hover:text-white",
    darkHeading: false,
  },
  DARK: {
    background: "bg-palembang-charcoal text-white",
    gradientHorizontal:
      "from-palembang-charcoal via-palembang-charcoal/60",
    gradientVertical:
      "from-palembang-charcoal/40 via-transparent to-palembang-charcoal",
    link: "text-palembang-gold",
    buttonBorder:
      "border-palembang-gold group-hover:bg-palembang-gold group-hover:text-palembang-charcoal",
    darkHeading: true,
  },
}

function getSectionArticles(section: LandingArticleSectionData) {
  const matchingArticles = section.articleCategorySlug
    ? articles.filter(
        (article) =>
          categoryMeta[article.category].slug === section.articleCategorySlug,
      )
    : articles.filter((article) => article.featured)

  return matchingArticles.slice(0, section.maxItems)
}

function HighlightedTitle({ title }: { title: string }) {
  const separatorIndex = title.lastIndexOf(" ")

  if (separatorIndex < 0) {
    return <span className="text-palembang-red">{title}</span>
  }

  return (
    <>
      {title.slice(0, separatorIndex)}{" "}
      <span className="text-palembang-red">
        {title.slice(separatorIndex + 1)}
      </span>
    </>
  )
}

function FeaturedArticleSection({
  section,
}: {
  section: LandingArticleSectionData
}) {
  const sectionArticles = getSectionArticles(section)
  const style = themeStyles[section.theme]

  if (sectionArticles.length === 0) return null

  return (
    <section
      className={`relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 lg:py-32 ${style.background}`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-15 sm:w-2/3 lg:w-1/2 lg:opacity-25">
        <Image
          fill
          src={section.backgroundImageUrl}
          alt=""
          sizes="(max-width: 640px) 100vw, 50vw"
          className="size-full object-cover object-right"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${style.gradientHorizontal} to-transparent`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b ${style.gradientVertical}`}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <SectionHeading
          eyebrow={section.eyebrow}
          title={section.title}
          description={section.description}
          dark={style.darkHeading}
        />
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {sectionArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              featured={
                section.layout === "FEATURED_FIRST" && index === 0
              }
            />
          ))}
        </div>
        <div className="mt-12 flex justify-end">
          <Link
            href={section.linkUrl}
            className={`group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] ${style.link}`}
          >
            {section.linkLabel}
            <span
              className={`rounded-full border p-2 transition-colors ${style.buttonBorder}`}
            >
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function CategoryArticleSection({
  section,
}: {
  section: LandingArticleSectionData
}) {
  const sectionArticles = getSectionArticles(section)
  const style = themeStyles[section.theme]

  if (sectionArticles.length === 0) return null

  return (
    <section
      className={`relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 lg:py-32 ${style.background}`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-25 sm:w-2/3 lg:w-1/2 lg:opacity-35">
        <Image
          fill
          src={section.backgroundImageUrl}
          alt=""
          sizes="(max-width: 640px) 100vw, 50vw"
          className="size-full object-cover object-right"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${style.gradientHorizontal} to-transparent`}
        />
        <div
          className={`absolute inset-0 bg-gradient-to-b ${style.gradientVertical}`}
        />
      </div>
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow={section.eyebrow}
            title={section.title}
            description={section.description}
            dark={style.darkHeading}
          />
          <Link
            href={section.linkUrl}
            className={`group hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] md:flex ${style.link}`}
          >
            {section.linkLabel}
            <span
              className={`rounded-full border p-2 transition-colors ${style.buttonBorder}`}
            >
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
        <div className="mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {sectionArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              featured={
                section.layout === "FEATURED_FIRST" && index === 0
              }
            />
          ))}
        </div>
        <div className="mt-12 flex justify-end md:hidden">
          <Link
            href={section.linkUrl}
            className={`group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] ${style.link}`}
          >
            {section.linkLabel}
            <span
              className={`rounded-full border p-2 transition-colors ${style.buttonBorder}`}
            >
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  )
}

function LandingArticleSection({
  section,
}: {
  section: LandingArticleSectionData
}) {
  if (section.articleCategorySlug === null || section.sectionKey === "featured") {
    return <FeaturedArticleSection section={section} />
  }

  return <CategoryArticleSection section={section} />
}

function LandingCta({ data }: { data: LandingPageData["cta"] }) {
  return (
    <section className="bg-palembang-red px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-12 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
            {data.eyebrow}
          </p>
          <h2 className="mt-5 max-w-3xl whitespace-pre-line font-display text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl">
            {data.title}
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-sm leading-7 text-white/75">{data.description}</p>
          <Link
            href={data.buttonUrl}
            className="mt-7 flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-palembang-charcoal transition-transform hover:-translate-y-1"
          >
            {data.buttonLabel} <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}

export function LandingPage({ data }: LandingPageProps) {
  const heroSlides = data.heroSlides.filter((slide) => slide.isVisible)
  const exploreItems = data.explore.items.filter((item) => item.isVisible)
  const articleSections = data.articleSections.filter(
    (section) => section.isVisible,
  )
  const teamMembers = data.team.members.filter((member) => member.isVisible)

  return (
    <>
      <LandingHero slides={heroSlides} />
      <main>
        <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.75fr_1.7fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-palembang-red">
                {data.about.eyebrow}
              </p>
              <div className="mt-8 h-24 w-px bg-palembang-red/50" />
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {data.about.establishedText}
              </p>
            </div>
            <div>
              <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                <HighlightedTitle title={data.about.title} />
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground">
                {data.about.description}
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-palembang-red">
                <span className="rounded-full border border-palembang-red p-2">
                  <Sparkles className="size-4" />
                </span>
                {data.about.closingText}
              </div>
            </div>
          </div>
        </section>

        {exploreItems.length > 0 ? (
          <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
            <div className="mx-auto max-w-[1240px]">
              <SectionHeading
                eyebrow={data.explore.eyebrow}
                title={data.explore.title}
              />
              <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-border sm:grid-cols-2 lg:grid-cols-5">
                {exploreItems.map((item, index) => (
                  <Link
                    key={`${item.position}-${item.linkUrl}`}
                    href={item.linkUrl}
                    className="group relative min-h-48 overflow-hidden bg-background p-4 transition-colors hover:bg-palembang-charcoal hover:text-white sm:min-h-64 sm:p-6"
                  >
                    <div className="flex h-full flex-col justify-between">
                      <div>
                        <span className="font-display text-3xl text-palembang-red sm:text-5xl">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                        <h3 className="mt-3 font-display text-lg font-bold leading-tight sm:mt-5 sm:text-2xl">
                          {item.label}
                        </h3>
                      </div>
                      <span className="mt-4 flex flex-col justify-between text-[10px] uppercase tracking-[0.13em] text-muted-foreground group-hover:text-white/70 sm:mt-0 sm:flex-row sm:items-center sm:text-xs">
                        <span>
                          {item.storyCount === null
                            ? "Stories"
                            : `${item.storyCount} stories`}
                        </span>
                        <ArrowUpRight className="mt-1 size-4 text-palembang-red transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:mt-0 sm:size-5" />
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          </section>
        ) : null}

        {articleSections.map((section, index) => (
          <div
            key={section.sectionKey}
            className="sticky top-0"
            style={{ zIndex: index === 0 ? 10 : 19 + index }}
          >
            <LandingArticleSection section={section} />
          </div>
        ))}

        <div
          className="relative"
          style={{ zIndex: 19 + articleSections.length }}
        >
          {teamMembers.length > 0 ? (
            <section className="bg-palembang-charcoal px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
              <div className="mx-auto max-w-[1240px]">
                <SectionHeading
                  dark
                  eyebrow={data.team.eyebrow}
                  title={data.team.title}
                  description={data.team.description}
                />
                <div className="mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                  {teamMembers.map((member) => (
                    <div
                      key={`${member.position}-${member.name}`}
                      className="group"
                    >
                      <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-xl bg-white/10 sm:rounded-[1.25rem]">
                        <Image
                          fill
                          src={member.imageUrl}
                          alt={member.name}
                          sizes="(max-width: 1024px) 50vw, 25vw"
                          className="size-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        />
                      </div>
                      <p className="mt-3 font-display text-lg font-bold sm:mt-5 sm:text-2xl">
                        {member.name}
                      </p>
                      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-palembang-gold sm:text-[10px]">
                        {member.role}
                      </p>
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-white/55 sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-6">
                        {member.bio}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          ) : null}
          <LandingCta data={data.cta} />
        </div>
      </main>
      <PublicFooter />
    </>
  )
}
