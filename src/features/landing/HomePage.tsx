"use client"

/**
 * Versi awal halaman beranda dari proyek Vite (`src/pages/landing/HomePage.tsx`).
 *
 * File ini sudah tidak dirujuk route mana pun bahkan di proyek lama — `App.tsx`
 * memakai `HomePage` dari `PublicSite.tsx`. Dipertahankan saat migrasi agar
 * tidak ada kode yang hilang; import mati dan tipe yang rusak sudah dibereskan
 * supaya ikut lolos typecheck. Hapus saja bila memang tidak diperlukan lagi.
 */

import Link from "next/link"
import { useEffect, useState } from "react";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Sparkles,
} from "lucide-react";
import {
  articles,
  categoryMeta,
  heroSlides,
  teamMembers,
  type Article,
  type Category,
} from "@/data/mockData";

const categories = Object.keys(categoryMeta) as Category[];

function Hero() {
  const [slide, setSlide] = useState(0);
  useEffect(() => {
    const timer = window.setInterval(
      () => setSlide((value) => (value + 1) % heroSlides.length),
      6000,
    );
    return () => window.clearInterval(timer);
  }, []);
  const current = heroSlides[slide];
  return (
    <section className="relative h-[min(850px,100svh)] min-h-[680px] overflow-hidden bg-palembang-charcoal text-white">
      <div className="absolute inset-0">
        <img
          src={current.image}
          alt="Palembang"
          className="size-full object-cover opacity-80 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/75" />
      </div>
      <div className="relative mx-auto flex h-full max-w-[1380px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-palembang-gold">
          <span className="h-px w-8 bg-palembang-gold" />
          {current.tag}
          <span className="h-px w-8 bg-palembang-gold" />
        </div>
        <h1 className="max-w-5xl whitespace-pre-line font-display text-[clamp(2rem,5.5vw,5rem)] font-black leading-[0.82] tracking-[-0.075em]">
          {current.title}
        </h1>
        <p className="mt-8 max-w-md text-sm leading-6 text-white/75 sm:text-base">
          Ruang untuk cerita, budaya, kreativitas, dan kehidupan Palembang.
        </p>
        <Link
          href="/cerita-warga"
          className="mt-8 flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-palembang-charcoal transition-transform hover:-translate-y-1"
        >
          Jelajahi cerita <ArrowRight className="size-4" />
        </Link>
      </div>
      <div className="absolute bottom-10 left-6 right-6 mx-auto flex max-w-[1380px] items-end justify-between">
        <div className="flex gap-2">
          {heroSlides.map((item, index) => (
            <button
              key={item.id}
              aria-label={`Slide ${index + 1}`}
              onClick={() => setSlide(index)}
              className={`h-1 transition-all ${index === slide ? "w-12 bg-palembang-gold" : "w-5 bg-white/40"}`}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button
            aria-label="Slide sebelumnya"
            onClick={() =>
              setSlide((slide - 1 + heroSlides.length) % heroSlides.length)
            }
            className="rounded-full border border-white/30 p-2 transition-colors hover:bg-white/15"
          >
            <ChevronLeft className="size-4" />
          </button>
          <button
            aria-label="Slide berikutnya"
            onClick={() => setSlide((slide + 1) % heroSlides.length)}
            className="rounded-full border border-white/30 p-2 transition-colors hover:bg-white/15"
          >
            <ChevronRight className="size-4" />
          </button>
        </div>
      </div>
    </section>
  );
}

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
];
function getCardAspect(id: string | number, featured: boolean) {
  if (featured) return "aspect-[16/9]";
  const numId =
    typeof id === "string" ? parseInt(id.replace(/\D/g, "")) || id.length : id;
  return masonryAspects[numId % masonryAspects.length];
}

function ArticleCard({
  article,
  featured = false,
  masonry = false,
}: {
  article: Article;
  featured?: boolean;
  masonry?: boolean;
}) {
  const aspect = masonry
    ? getCardAspect(article.id, false)
    : featured
      ? "aspect-[4/3] lg:aspect-[16/9]"
      : "aspect-[4/3]";
  return (
    <Link
      href={`/artikel/${article.slug}`}
      className={`group relative block overflow-hidden ${masonry ? "mb-4 sm:mb-6 break-inside-avoid" : ""} ${featured && !masonry ? "lg:col-span-2" : ""}`}
    >
      <div
        className={`img-zoom relative overflow-hidden rounded-xl sm:rounded-[1.5rem] ${aspect}`}
      >
        <img
          src={article.coverImage}
          alt={article.title}
          className="size-full object-cover transition-transform duration-700 group-hover:scale-105"
          loading="lazy"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/40 to-transparent opacity-0 backdrop-blur-[2px] transition-opacity duration-500 group-hover:opacity-100" />
        <div className="absolute inset-0 flex flex-col justify-end p-4 text-white opacity-0 transition-all duration-500 translate-y-4 group-hover:opacity-100 group-hover:translate-y-0 sm:p-7">
          <div className="mb-2 flex flex-wrap items-center gap-2 sm:gap-3 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.16em]">
            <span className="text-palembang-gold">{article.category}</span>
            <span className="text-white/60">{article.publishedAt}</span>
          </div>
          <h3
            className={`font-display font-bold leading-[1.1] tracking-[-0.035em] ${featured && !masonry ? "text-lg sm:text-2xl lg:text-4xl" : "text-base sm:text-xl lg:text-2xl"}`}
          >
            {article.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-[10px] leading-4 sm:text-xs sm:leading-5 text-white/80 sm:text-sm">
            {article.excerpt}
          </p>
          <div className="mt-3 sm:mt-4 flex items-center gap-2 text-[10px] sm:text-xs font-semibold uppercase tracking-[0.12em] text-palembang-gold">
            Baca <ArrowRight className="size-3 sm:size-4" />
          </div>
        </div>
      </div>
      <div className="mt-2 sm:mt-3 px-1">
        <h4 className="font-display text-xs sm:text-sm font-bold leading-snug tracking-[-0.02em] line-clamp-2 group-hover:text-palembang-red transition-colors duration-300">
          {article.title}
        </h4>
        <p className="mt-1 line-clamp-2 text-[10px] sm:text-xs leading-4 sm:leading-5 opacity-60">
          {article.excerpt}
        </p>
      </div>
    </Link>
  );
}

function CategorySection({
  category,
  variant = "default",
  featuredFirst = false,
}: {
  category: Category;
  variant?: "red" | "dark" | "off-white" | "default";
  featuredFirst?: boolean;
}) {
  const categoryArticles = articles
    .filter((a) => a.category === category)
    .slice(0, featuredFirst ? 3 : 4);
  if (categoryArticles.length === 0) return null;
  const meta = categoryMeta[category];
  const isRed = variant === "red";
  const isDark = variant === "dark";
  const isOffWhite = variant === "off-white";

  const bgClass = isRed
    ? "bg-palembang-red text-white"
    : isDark
      ? "bg-palembang-charcoal text-white"
      : isOffWhite
        ? "bg-palembang-off-white text-palembang-charcoal"
        : "bg-background text-foreground";
  const gradientFrom = isRed
    ? "from-palembang-red via-palembang-red/60"
    : isDark
      ? "from-palembang-charcoal via-palembang-charcoal/60"
      : isOffWhite
        ? "from-palembang-off-white via-palembang-off-white/60"
        : "from-background via-background/60";
  const gradientV = isRed
    ? "from-palembang-red/40 via-transparent to-palembang-red"
    : isDark
      ? "from-palembang-charcoal/40 via-transparent to-palembang-charcoal"
      : isOffWhite
        ? "from-palembang-off-white/40 via-transparent to-palembang-off-white"
        : "from-background/40 via-transparent to-background";
  const linkClass = isRed
    ? "text-white"
    : isDark
      ? "text-palembang-gold"
      : "text-palembang-charcoal";
  const btnBorder = isRed
    ? "border-white group-hover:bg-white group-hover:text-palembang-red"
    : isDark
      ? "border-palembang-gold group-hover:bg-palembang-gold group-hover:text-palembang-charcoal"
      : "border-palembang-charcoal group-hover:bg-palembang-charcoal group-hover:text-white";

  return (
    <section
      className={`relative overflow-hidden ${bgClass} px-6 py-24 sm:px-10 lg:px-16 lg:py-32`}
    >
      <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-25 lg:opacity-35">
        <img
          src={meta.image}
          alt={category}
          className="size-full object-cover object-right"
        />
        <div
          className={`absolute inset-0 bg-gradient-to-r ${gradientFrom} to-transparent`}
        />
        <div className={`absolute inset-0 bg-gradient-to-b ${gradientV}`} />
      </div>
      <div className="relative z-10 mx-auto max-w-[1240px]">
        <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
          <SectionHeading
            eyebrow="Kategori Cerita"
            title={category}
            description={meta.description}
            dark={isRed || isDark}
          />
          <Link
            href={`/${meta.slug}`}
            className={`group hidden items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] md:flex ${linkClass}`}
          >
            Lihat semua{" "}
            <span
              className={`rounded-full border p-2 transition-colors ${btnBorder}`}
            >
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
        <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
          {categoryArticles.map((article, index) => (
            <ArticleCard
              key={article.id}
              article={article}
              featured={featuredFirst && index === 0}
            />
          ))}
        </div>
        <div className="mt-12 flex justify-end md:hidden">
          <Link
            href={`/${meta.slug}`}
            className={`group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] ${linkClass}`}
          >
            Lihat semua{" "}
            <span
              className={`rounded-full border p-2 transition-colors ${btnBorder}`}
            >
              <ArrowRight className="size-4" />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}

function CTASection() {
  return (
    <section className="bg-palembang-red px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
      <div className="mx-auto flex max-w-[1240px] flex-col justify-between gap-12 lg:flex-row lg:items-end">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-white/70">
            Buka ruang kolaborasi
          </p>
          <h2 className="mt-5 max-w-3xl font-display text-5xl font-black leading-[0.92] tracking-[-0.06em] sm:text-7xl">
            Kota ini milik
            <br />
            kita semua.
          </h2>
        </div>
        <div className="max-w-sm">
          <p className="text-sm leading-7 text-white/75">
            Punya cerita, ide, atau ingin membuat sesuatu bersama? Kami ingin
            mendengarnya.
          </p>
          <Link
            href="/kolaborasi"
            className="mt-7 flex w-fit items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-palembang-charcoal transition-transform hover:-translate-y-1"
          >
            Let's collaborate <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </section>
  );
}

function SectionHeading({
  eyebrow,
  title,
  description,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  description?: string;
  dark?: boolean;
}) {
  const eyebrowColor = dark ? "text-palembang-gold" : "text-palembang-red";
  const lineBg = dark ? "bg-palembang-gold" : "bg-palembang-red";
  return (
    <div className={`flex flex-col gap-4 ${dark ? "text-white" : ""}`}>
      <p
        className={`flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.22em] ${eyebrowColor}`}
      >
        <span className={`h-px w-8 ${lineBg}`} />
        {eyebrow}
      </p>
      <h2 className="font-display text-4xl font-bold leading-[1.02] tracking-[-0.045em] sm:text-5xl lg:text-6xl">
        {title}
      </h2>
      {description && (
        <p
          className={`max-w-lg text-sm leading-7 ${dark ? "text-white/60" : "opacity-75"}`}
        >
          {description}
        </p>
      )}
    </div>
  );
}

export function HomePage() {
  const featured = articles.filter((article) => article.featured).slice(0, 3);
  return (
    <>
      <Hero />
      <main>
        <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-36">
          <div className="mx-auto grid max-w-[1240px] gap-12 lg:grid-cols-[0.75fr_1.7fr]">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.22em] text-palembang-red">
                About Benah Palembang
              </p>
              <div className="mt-8 h-24 w-px bg-palembang-red/50" />
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-muted-foreground">
                Est. 2025 · Palembang
              </p>
            </div>
            <div>
              <h2 className="max-w-4xl font-display text-4xl font-bold leading-[1.05] tracking-[-0.05em] sm:text-6xl lg:text-7xl">
                Merekam, merayakan, dan menggerakkan{" "}
                <span className="text-palembang-red">Palembang.</span>
              </h2>
              <p className="mt-8 max-w-2xl text-base leading-8 text-muted-foreground">
                Benah Palembang adalah platform editorial yang percaya bahwa
                kota bukan hanya tentang bangunan dan jalan. Ia adalah tentang
                manusia, ingatan, budaya, dan cerita-cerita kecil yang membentuk
                identitas kita.
              </p>
              <div className="mt-10 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-palembang-red">
                <span className="rounded-full border border-palembang-red p-2">
                  <Sparkles className="size-4" />
                </span>{" "}
                Untuk kota yang lebih hidup
              </div>
            </div>
          </div>
        </section>
        <section className="px-6 py-24 sm:px-10 lg:px-16 lg:py-32">
          <div className="mx-auto max-w-[1240px]">
            <SectionHeading
              eyebrow="Jelajahi perspektif"
              title="Satu kota, banyak cerita."
            />
            <div className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[1.5rem] bg-border sm:grid-cols-2 lg:grid-cols-5">
              {categories.map((category) => (
                <Link
                  key={category}
                  href={`/${categoryMeta[category].slug}`}
                  className="group relative min-h-48 sm:min-h-64 overflow-hidden bg-background p-4 sm:p-6 transition-colors hover:bg-palembang-charcoal hover:text-white"
                >
                  <div className="flex h-full flex-col justify-between">
                    <div>
                      <span className="font-display text-3xl sm:text-5xl text-palembang-red">
                        0{categories.indexOf(category) + 1}
                      </span>
                      <h3 className="mt-3 sm:mt-5 font-display text-lg sm:text-2xl font-bold leading-tight">
                        {category}
                      </h3>
                    </div>
                    <span className="flex flex-col sm:flex-row sm:items-center justify-between text-[10px] sm:text-xs uppercase tracking-[0.13em] text-muted-foreground group-hover:text-white/70 mt-4 sm:mt-0">
                      <span>{categoryMeta[category].count} stories</span>
                      <ArrowUpRight className="size-4 sm:size-5 text-palembang-red transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 mt-1 sm:mt-0" />
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </section>
        <section className="sticky top-0 z-10 relative overflow-hidden bg-palembang-off-white px-6 py-24 text-palembang-charcoal sm:px-10 lg:px-16 lg:py-32">
          <div className="pointer-events-none absolute right-0 top-0 h-full w-full sm:w-2/3 lg:w-1/2 overflow-hidden opacity-15 lg:opacity-25">
            <img
              src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=600&fit=crop"
              alt=""
              className="size-full object-cover object-right"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-palembang-off-white via-palembang-off-white/60 to-transparent" />
            <div className="absolute inset-0 bg-gradient-to-b from-palembang-off-white/40 via-transparent to-palembang-off-white" />
          </div>
          <div className="relative z-10 mx-auto max-w-[1240px]">
            <SectionHeading
              eyebrow="Pilihan redaksi"
              title="Cerita dari Palembang"
              description="Menyusuri denyut kota melalui cerita warga, ruang kota, budaya, dan mereka yang membuat Palembang terus bergerak."
            />
            <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-3 sm:grid-cols-2 sm:gap-8 lg:grid-cols-4">
              {featured.map((article, index) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  featured={index === 0}
                />
              ))}
            </div>
            <div className="mt-12 flex justify-end">
              <Link
                href="/cerita-warga"
                className="group flex items-center gap-3 text-xs font-bold uppercase tracking-[0.15em] text-palembang-charcoal"
              >
                Lihat semua cerita{" "}
                <span className="rounded-full border border-palembang-charcoal p-2 transition-colors group-hover:bg-palembang-charcoal group-hover:text-white">
                  <ArrowRight className="size-4" />
                </span>
              </Link>
            </div>
          </div>
        </section>
        <div className="sticky top-0 z-20">
          <CategorySection category="Gaya Hidup" variant="default" />
        </div>
        <div className="sticky top-0 z-[21]">
          <CategorySection category="Ruang Kota" variant="red" featuredFirst />
        </div>
        <div className="sticky top-0 z-[22]">
          <CategorySection category="Industri Kreatif" variant="off-white" />
        </div>
        <div className="sticky top-0 z-[23]">
          <CategorySection
            category="Kebudayaan"
            variant="default"
            featuredFirst
          />
        </div>
        <div className="relative z-[24]">
          <section className="bg-palembang-charcoal px-6 py-24 text-white sm:px-10 lg:px-16 lg:py-32">
            <div className="mx-auto max-w-[1240px]">
              <SectionHeading
                dark
                eyebrow="Orang-orang di balik cerita"
                title="Our Team"
                description="Kami adalah kumpulan penulis, fotografer, peneliti, dan warga kota yang percaya pada kekuatan cerita."
              />
              <div className="mt-10 sm:mt-12 grid grid-cols-2 gap-4 sm:grid-cols-2 sm:gap-6 lg:grid-cols-4">
                {teamMembers.map((member) => (
                  <div key={member.id} className="group">
                    <div className="img-zoom aspect-[4/5] overflow-hidden rounded-xl sm:rounded-[1.25rem] bg-white/10">
                      <img
                        src={member.photo}
                        alt={member.name}
                        className="size-full object-cover grayscale transition-all duration-500 group-hover:grayscale-0"
                        loading="lazy"
                      />
                    </div>
                    <p className="mt-3 sm:mt-5 font-display text-lg sm:text-2xl font-bold">
                      {member.name}
                    </p>
                    <p className="mt-1 text-[8px] sm:text-[10px] font-bold uppercase tracking-[0.16em] text-palembang-gold">
                      {member.role}
                    </p>
                    <p className="mt-2 sm:mt-3 text-xs sm:text-sm leading-5 sm:leading-6 text-white/55 line-clamp-3 sm:line-clamp-none">
                      {member.bio}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
          <CTASection />
        </div>
      </main>
      <Footer />
    </>
  );
}

export function Footer() {
  return (
    <footer className="bg-palembang-charcoal px-6 pb-6 pt-16 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <img
              src="/logo.png"
              alt="Benah Palembang"
              className="h-9 sm:h-11 brightness-0 invert"
            />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
              Platform editorial yang merekam, merayakan, dan menggerakkan kota.
            </p>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              Explore
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category}
                  href={`/${categoryMeta[category].slug}`}
                  className="transition-colors hover:text-white"
                >
                  {category}
                </Link>
              ))}
              <Link href="/agenda">Agenda</Link>
            </div>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              Connect
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              <a href="#instagram">Instagram</a>
              <a href="#tiktok">TikTok</a>
              <a href="#youtube">YouTube</a>
              <a href="#linkedin">LinkedIn</a>
            </div>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              Contact
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              <a href="mailto:halo@benahpalembang.id">halo@benahpalembang.id</a>
              <span>Palembang, Sumatera Selatan</span>
              <span>+62 711 123 456</span>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/15 pt-5 text-[10px] uppercase tracking-[0.14em] text-white/40 sm:flex-row">
          <span>© 2025 Benah Palembang</span>
          <span>Made with care in Palembang</span>
        </div>
      </div>
    </footer>
  );
}