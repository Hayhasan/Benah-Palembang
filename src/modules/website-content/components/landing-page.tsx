import Image from "next/image"
import Link from "next/link"
import { ArrowRight, ArrowUpRight, Mail, Sparkles } from "lucide-react"

import { PublicFooter } from "@/features/public/components/PublicFooter"
import { SectionHeading } from "@/features/public/components/SectionHeading"
import { PublicArticleCard } from "@/modules/article/components/public-article-card"
import type { LandingArticlesBySection } from "@/modules/article/types/public-article"

import { MAX_EXPLORE_ITEMS } from "../constants/explore-items"
import type {
  LandingArticleSectionData,
  LandingPageView,
} from "../types/landing-page"
import { LandingHero } from "./landing-hero"

interface LandingPageProps {
  data: LandingPageView
  articlesBySection: LandingArticlesBySection
}

// Tailwind hanya membaca class literal, jadi jumlah kolom dipetakan eksplisit.
const exploreGridColumns: Record<number, string> = {
  1: "lg:grid-cols-1",
  2: "lg:grid-cols-2",
  3: "lg:grid-cols-3",
  4: "lg:grid-cols-4",
  5: "lg:grid-cols-5",
  6: "lg:grid-cols-6",
}

const articleSectionStyle = {
  background: "bg-background text-foreground",
  gradientHorizontal: "from-background via-background/70",
  gradientVertical: "from-background/40 via-transparent to-background",
  link: "text-palembang-red",
  buttonBorder:
    "border-palembang-red text-palembang-red group-hover:bg-palembang-red group-hover:text-white",
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
  articlesBySection,
}: {
  section: LandingArticleSectionData
  articlesBySection: LandingArticlesBySection
}) {
  const sectionArticles = (articlesBySection[section.sectionKey] ?? []).slice(0, 3)
  const style = articleSectionStyle

  if (sectionArticles.length === 0) return null

  return (
    <section
      className={`reveal-on-scroll relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 lg:py-32 ${style.background}`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-10 sm:w-2/3 lg:w-1/2 lg:opacity-20 dark:opacity-20 dark:lg:opacity-30">
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
        />
        <div className="reveal-stagger mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {sectionArticles.map((article, index) => (
            <PublicArticleCard
              key={article.id}
              article={article}
              featured={index === 0}
            />
          ))}
        </div>
        <div className="reveal-on-scroll mt-12 flex justify-end">
          <Link
            href={`/${section.articleCategorySlug}`}
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
  articlesBySection,
}: {
  section: LandingArticleSectionData
  articlesBySection: LandingArticlesBySection
}) {
  const sectionArticles = (articlesBySection[section.sectionKey] ?? []).slice(0, 3)
  const style = articleSectionStyle

  if (sectionArticles.length === 0) return null

  return (
    <section
      className={`reveal-on-scroll relative overflow-hidden px-6 py-24 sm:px-10 lg:px-16 lg:py-32 ${style.background}`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-10 sm:w-2/3 lg:w-1/2 lg:opacity-20 dark:opacity-20 dark:lg:opacity-30">
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
          />
          <Link
            href={`/${section.articleCategorySlug}`}
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
        <div className="reveal-stagger mt-10 grid grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {sectionArticles.map((article, index) => (
            <PublicArticleCard
              key={article.id}
              article={article}
              featured={index === 0}
            />
          ))}
        </div>
        <div className="reveal-on-scroll mt-12 flex justify-end md:hidden">
          <Link
            href={`/${section.articleCategorySlug}`}
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
  articlesBySection,
}: {
  section: LandingArticleSectionData
  articlesBySection: LandingArticlesBySection
}) {
  if (section.sectionKey === "featured") {
    return (
      <FeaturedArticleSection
        section={section}
        articlesBySection={articlesBySection}
      />
    )
  }

  return (
    <CategoryArticleSection
      section={section}
      articlesBySection={articlesBySection}
    />
  )
}

function LandingCta({ data }: { data: LandingPageView["cta"] }) {
  const titleLines = data.title
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean)

  return (
    <section className="reveal-on-scroll relative overflow-hidden bg-background px-6 py-20 text-foreground sm:px-10 lg:px-16 lg:py-28">
      <div className="mx-auto max-w-[1240px]">
        <div className="reveal-scale relative overflow-hidden rounded-[2rem] border border-white/10 bg-gradient-to-br from-zinc-900 via-black/85 to-zinc-950 p-8 text-white shadow-2xl sm:p-14 lg:p-16">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full overflow-hidden opacity-25 sm:w-2/3 lg:w-1/2 lg:opacity-35">
            <Image
              fill
              src={data.backgroundImageUrl}
              alt=""
              sizes="(max-width: 640px) 100vw, 50vw"
              className="size-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/80 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-zinc-950/50 via-transparent to-zinc-950" />
          </div>
          <div className="relative z-10 flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
            <div>
              <div className="flex items-center gap-2.5 text-[10px] font-bold uppercase tracking-[0.24em] text-palembang-red">
                <span className="size-2 rounded-full bg-palembang-red" />
                {data.eyebrow}
              </div>
              <h2 className="mt-4 max-w-2xl font-display text-4xl font-black leading-[0.95] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                {titleLines.map((line, index) => (
                  <span
                    key={`${index}-${line}`}
                    className={`block ${index === 0 ? "text-white" : "text-palembang-red"}`}
                  >
                    {line}
                  </span>
                ))}
              </h2>
            </div>
            <div className="max-w-md">
              <p className="text-sm leading-relaxed text-white/75 sm:text-base">
                {data.description}
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href={data.buttonUrl}
                  className="flex items-center gap-3 rounded-full bg-palembang-red px-7 py-3.5 text-xs font-bold uppercase tracking-[0.14em] text-white shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-white hover:text-palembang-charcoal"
                >
                  {data.buttonLabel} <ArrowRight className="size-4" />
                </Link>
                <a
                  href={`mailto:${data.contactEmail}`}
                  className="flex items-center gap-2 rounded-full border border-white/20 bg-white/5 px-6 py-3.5 text-xs font-semibold text-white/80 backdrop-blur-sm transition-all hover:bg-white/15 hover:text-white"
                >
                  <Mail className="size-4 text-palembang-red" />
                  {data.contactLabel}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

export function LandingPage({ data, articlesBySection }: LandingPageProps) {
  const heroSlides = data.heroSlides.filter((slide) => slide.isVisible)
  const perspectives = data.explore.items
    .filter((item) => item.isVisible)
    .slice(0, MAX_EXPLORE_ITEMS)
  const articleSections = data.articleSections.filter(
    (section) => section.isVisible,
  )
  const teamMembers = data.team.members.filter((member) => member.isVisible)

  return (
    <>
      <LandingHero slides={heroSlides} />
      <main className="bg-background text-foreground">
        <section className="reveal-on-scroll bg-background px-6 py-24 text-foreground sm:px-10 lg:px-16 lg:py-36">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.75fr_1.7fr]">
            <div className="reveal-slide-left">
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-palembang-red">
                {data.about.eyebrow}
              </p>
              <div className="mt-8 h-24 w-px bg-palembang-red/50" />
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                {data.about.establishedText}
              </p>
            </div>
            <div className="reveal-on-scroll reveal-delay-150">
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

        {perspectives.length > 0 ? (
          <section className="reveal-on-scroll bg-background px-6 py-24 text-foreground sm:px-10 lg:px-16 lg:py-32">
            <div className="mx-auto max-w-[1240px]">
              <SectionHeading
                eyebrow={data.explore.eyebrow}
                title={data.explore.title}
              />
              {/*
                Garis pemisah digambar oleh border kiri/atas tiap card, bukan
                oleh background container. Baris terakhir yang tidak penuh
                karena itu tidak memunculkan blok kosong berwarna border.
              */}
              <div className="mt-12 overflow-hidden rounded-[1.5rem] border border-border bg-card">
                <div
                  className={`reveal-stagger -ml-px -mt-px grid grid-cols-2 sm:grid-cols-3 ${
                    exploreGridColumns[perspectives.length] ?? "lg:grid-cols-6"
                  }`}
                >
                  {perspectives.map((item, index) => (
                    <Link
                      key={`${item.position}-${item.linkUrl}`}
                      href={item.linkUrl}
                      className="group relative min-h-48 overflow-hidden border-l border-t border-border bg-card p-4 text-foreground transition-colors hover:bg-muted sm:min-h-64 sm:p-6"
                    >
                      <div className="flex h-full flex-col justify-between">
                        <div>
                          <span className="font-display text-3xl text-palembang-red sm:text-5xl">
                            {String(index + 1).padStart(2, "0")}
                          </span>
                          <h3 className="mt-3 font-display text-lg font-bold leading-tight transition-colors group-hover:text-palembang-red sm:mt-5 sm:text-2xl">
                            {item.label}
                          </h3>
                        </div>
                        <span className="mt-4 flex flex-col justify-between text-[10px] uppercase tracking-[0.13em] text-muted-foreground group-hover:text-foreground sm:mt-0 sm:flex-row sm:items-center sm:text-xs">
                          <span>
                            {[item.count, item.countLabel]
                              .filter((part) => part !== null && part !== undefined)
                              .join(" ")}
                          </span>
                          <ArrowUpRight className="mt-1 size-4 text-palembang-red transition-transform group-hover:-translate-y-1 group-hover:translate-x-1 sm:mt-0 sm:size-5" />
                        </span>
                      </div>
                    </Link>
                  ))}
                </div>
              </div>
            </div>
          </section>
        ) : null}

        {articleSections.map((section) => (
          <LandingArticleSection
            key={section.sectionKey}
            section={section}
            articlesBySection={articlesBySection}
          />
        ))}

        <div>
          {teamMembers.length > 0 ? (
            <section className="reveal-on-scroll bg-background px-6 py-24 text-foreground sm:px-10 lg:px-16 lg:py-32">
              <div className="mx-auto max-w-[1240px]">
                <SectionHeading
                  eyebrow={data.team.eyebrow}
                  title={data.team.title}
                  description={data.team.description}
                />
                <div className="reveal-stagger mt-10 grid grid-cols-2 gap-4 sm:mt-12 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                  {teamMembers.map((member) => (
                    <div
                      key={`${member.position}-${member.name}`}
                      className="group rounded-2xl border border-border bg-card p-4 transition-all hover:shadow-md"
                    >
                      <div className="img-zoom relative aspect-[4/5] overflow-hidden rounded-xl border border-border/50 bg-muted">
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
                      <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.16em] text-palembang-red sm:text-[10px]">
                        {member.role}
                      </p>
                      <p className="mt-2 line-clamp-3 text-xs leading-5 text-muted-foreground sm:mt-3 sm:line-clamp-none sm:text-sm sm:leading-6">
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
