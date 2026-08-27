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
    <section className="relative h-[min(850px,100svh)] min-h-[680px] overflow-hidden bg-palembang-charcoal text-white">
      <div className="absolute inset-0">
        <Image
          fill
          priority
          src={current.imageUrl}
          alt={current.imageAlt}
          sizes="100vw"
          className="size-full object-cover opacity-80 transition-all duration-1000"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/45 via-black/20 to-black/75" />
      </div>
      <div className="relative mx-auto flex h-full max-w-[1380px] flex-col items-center justify-center px-6 text-center">
        <div className="mb-6 flex items-center gap-3 text-[10px] font-bold uppercase tracking-[0.3em] text-palembang-gold">
          <span className="h-px w-8 bg-palembang-gold" />
          {current.eyebrow}
          <span className="h-px w-8 bg-palembang-gold" />
        </div>
        <h1 className="max-w-5xl whitespace-pre-line font-display text-[clamp(2rem,5.5vw,5rem)] font-black leading-[0.82] tracking-[-0.075em]">
          {current.title}
        </h1>
        <p className="mt-8 max-w-md text-sm leading-6 text-white/75 sm:text-base">
          {current.description}
        </p>
        <Link
          href={current.buttonUrl}
          className="mt-8 flex items-center gap-3 rounded-full bg-white px-5 py-3 text-xs font-bold uppercase tracking-[0.14em] text-palembang-charcoal transition-transform hover:-translate-y-1"
        >
          {current.buttonLabel} <ArrowRight className="size-4" />
        </Link>
      </div>
      {slides.length > 1 ? (
        <div className="absolute bottom-10 left-6 right-6 mx-auto flex max-w-[1380px] items-end justify-between">
          <div className="flex gap-2">
            {slides.map((slide, index) => (
              <button
                key={`${slide.position}-${slide.imageUrl}`}
                aria-label={`Slide ${index + 1}`}
                onClick={() => setActiveIndex(index)}
                className={`h-1 transition-all ${index === activeIndex ? "w-12 bg-palembang-gold" : "w-5 bg-white/40"}`}
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
              className="rounded-full border border-white/30 p-2 transition-colors hover:bg-white/15"
            >
              <ChevronLeft className="size-4" />
            </button>
            <button
              aria-label="Slide berikutnya"
              onClick={() =>
                setActiveIndex(
                  (currentIndex) => (currentIndex + 1) % slides.length,
                )
              }
              className="rounded-full border border-white/30 p-2 transition-colors hover:bg-white/15"
            >
              <ChevronRight className="size-4" />
            </button>
          </div>
        </div>
      ) : null}
    </section>
  )
}
