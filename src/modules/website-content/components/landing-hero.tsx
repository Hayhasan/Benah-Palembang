"use client"

import Image from "next/image"
import Link from "next/link"
import { useEffect, useState } from "react"
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react"

import type { LandingHeroSlideData } from "../types/landing-page"

interface LandingHeroProps {
  slides: LandingHeroSlideData[]
}

export function LandingHero({ slides }: LandingHeroProps) {
  const [activeIndex, setActiveIndex] = useState(0)

  useEffect(() => {
    if (slides.length < 2) return

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % slides.length)
    }, 6000)

    return () => window.clearInterval(timer)
  }, [slides.length])

  if (slides.length === 0) return null

  const current = slides[activeIndex] ?? slides[0]

  return (
    <section className="relative h-svh min-h-svh w-full overflow-hidden bg-palembang-charcoal text-white sm:h-[min(850px,100svh)] sm:min-h-[680px]">
      <div className="absolute inset-0">
        <Image
          fill
          priority
          src={current.imageUrl}
          alt={current.imageAlt}
          sizes="100vw"
          className="size-full object-cover opacity-65 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/65 via-black/40 to-black/85" />
      </div>
      <div className="relative mx-auto flex h-full max-w-[1380px] flex-col items-center justify-center px-6 pb-20 pt-12 text-center sm:pb-0 sm:pt-0">
        <div className="reveal-on-scroll mb-4 flex items-center gap-3 text-[9px] font-bold uppercase tracking-[0.3em] text-palembang-red sm:mb-6 sm:text-[10px]">
          <span className="h-px w-6 bg-palembang-red sm:w-8" />
          {current.eyebrow}
          <span className="h-px w-6 bg-palembang-red sm:w-8" />
        </div>
        <h1 className="reveal-on-scroll reveal-delay-100 max-w-5xl whitespace-pre-line font-display text-[clamp(2.15rem,7.5vw,5rem)] font-black leading-[0.84] tracking-[-0.07em]">
          {current.title}
        </h1>
        <p className="reveal-on-scroll reveal-delay-200 mt-5 max-w-md text-xs leading-5 text-white/75 sm:mt-8 sm:text-base sm:leading-6">
          {current.description}
        </p>
        <Link
          href={current.buttonUrl}
          className="reveal-on-scroll reveal-delay-300 mt-6 flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-palembang-charcoal transition-all duration-300 hover:-translate-y-1 hover:shadow-xl sm:mt-8"
        >
          {current.buttonLabel} <ArrowRight className="size-4" />
        </Link>
      </div>
      {slides.length > 1 ? (
        <div className="reveal-fade reveal-delay-400 absolute bottom-6 left-6 right-6 z-10 mx-auto flex max-w-[1380px] items-end justify-between sm:bottom-10">
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={`${slide.position}-${slide.imageUrl}`}
                aria-label={`Slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1 transition-all ${index === activeIndex ? "w-10 bg-palembang-red sm:w-12" : "w-4 bg-white/40 sm:w-5"}`}
              />
            ))}
          </div>
          <div className="flex gap-2">
            <button
              aria-label="Slide sebelumnya"
              onClick={() =>
                setActiveIndex(
                  (currentIndex) =>
                    (currentIndex - 1 + slides.length) % slides.length,
                )
              }
              className="rounded-full border border-white/30 p-1.5 transition-colors hover:bg-white/15 sm:p-2"
            >
              <ChevronLeft className="size-3.5 sm:size-4" />
            </button>
            <button
              aria-label="Slide berikutnya"
              onClick={() =>
                setActiveIndex(
                  (currentIndex) => (currentIndex + 1) % slides.length,
                )
              }
              className="rounded-full border border-white/30 p-1.5 transition-colors hover:bg-white/15 sm:p-2"
            >
              <ChevronRight className="size-3.5 sm:size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
