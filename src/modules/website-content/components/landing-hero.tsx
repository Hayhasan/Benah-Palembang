"use client"

import Image from "next/image"
import Link from "next/link"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"

import type { LandingHeroSlideData } from "../types/landing-page"

interface LandingHeroProps {
  slides: LandingHeroSlideData[]
  className?: string
}

export function LandingHero({ slides, className = "" }: LandingHeroProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fullscreenSlide, setFullscreenSlide] = useState<LandingHeroSlideData | null>(null)

  // Escape key and scroll lock for fullscreen dialog
  useEffect(() => {
    if (!fullscreenSlide) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenSlide(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [fullscreenSlide])

  // Duplicate slides if count is small so Embla can smoothly loop infinitely without stutter
  const count = slides.length
  const displaySlides =
    count > 0 && count < 5
      ? [...slides, ...slides, ...slides]
      : slides

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: displaySlides.length > 1,
    align: "center",
    duration: 38,
    skipSnaps: false,
  })

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    queueMicrotask(() => {
      if (emblaApi) onSelect()
    })
    emblaApi.on("select", onSelect)
    emblaApi.on("reInit", onSelect)
    return () => {
      emblaApi.off("select", onSelect)
      emblaApi.off("reInit", onSelect)
    }
  }, [emblaApi, onSelect])

  // Autoplay with pause on hover
  useEffect(() => {
    if (!emblaApi || isHovered || displaySlides.length <= 1) return

    const timer = setInterval(() => {
      emblaApi.scrollNext()
    }, 6000)

    return () => clearInterval(timer)
  }, [emblaApi, isHovered, displaySlides.length])

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (count === 0) return null

  return (
    <section
      aria-label="Featured Heroes"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full h-[calc(100dvh-92px)] sm:h-[calc(100dvh-100px)] min-h-[500px] sm:min-h-[560px] overflow-hidden bg-zinc-950 select-none ${className}`}
    >
      {/* Embla Viewport */}
      <div
        ref={emblaRef}
        className="w-full h-full overflow-hidden"
      >
        <div className="flex h-full touch-pan-y">
          {displaySlides.map((slide, index) => {
            const isActive = index === selectedIndex

            return (
              <div
                key={`${slide.position}-${index}`}
                onClick={() => {
                  if (isActive) {
                    setFullscreenSlide(slide)
                  } else if (emblaApi) {
                    emblaApi.scrollTo(index)
                  }
                }}
                className={`relative h-full shrink-0 basis-full sm:basis-[76%] lg:basis-[70%] transition-all duration-700 ease-out cursor-pointer ${
                  isActive
                    ? "z-20 opacity-100"
                    : "z-10 opacity-40 hover:opacity-75"
                }`}
              >
                <div className="relative size-full overflow-hidden">
                  <Image
                    fill
                    priority={index < 3}
                    src={slide.imageUrl}
                    alt={slide.imageAlt || slide.title}
                    sizes="(max-width: 768px) 100vw, 75vw"
                    className="size-full object-cover"
                  />

                  {/* Editorial Scrim Overlay */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-700 ${
                      isActive
                        ? "bg-gradient-to-t from-black/85 via-black/45 to-black/30"
                        : "bg-black/60"
                    }`}
                  />

                  {/* Slide Content (Only readable on active slide) */}
                  {isActive && (
                    <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white transition-opacity duration-500">
                      {slide.eyebrow ? (
                        <p className="mb-3 text-[11px] sm:text-xs font-bold uppercase tracking-[0.25em] text-white/90">
                          {slide.eyebrow}
                        </p>
                      ) : null}

                      <h1 className="max-w-2xl font-sans text-lg sm:text-2xl md:text-3xl lg:text-4xl font-bold leading-snug tracking-tight text-white drop-shadow-sm">
                        {slide.title}
                      </h1>

                      <Link
                        href={slide.buttonUrl || "/cerita-warga"}
                        onClick={(e) => {
                          e.stopPropagation()
                        }}
                        className="mt-4 sm:mt-5 inline-block text-[11px] sm:text-xs font-bold uppercase tracking-[0.2em] text-white/90 hover:text-white border-b-2 border-white/70 hover:border-white pb-0.5 transition-all cursor-pointer"
                      >
                        {slide.buttonLabel || "READ MORE"}
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Left Clickable Area (Clicking slides left smoothly; no arrow button) */}
      {count > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Slide sebelumnya"
          className="absolute left-0 top-0 bottom-0 w-[8%] sm:w-[12%] lg:w-[15%] z-30 cursor-pointer focus:outline-none bg-gradient-to-r from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        />
      )}

      {/* Right Clickable Area (Clicking slides right smoothly; no arrow button) */}
      {count > 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Slide berikutnya"
          className="absolute right-0 top-0 bottom-0 w-[8%] sm:w-[12%] lg:w-[15%] z-30 cursor-pointer focus:outline-none bg-gradient-to-l from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        />
      )}

      {/* Fullscreen Image Dialog (Pure image, black background 60% opacity, no extra elements) */}
      {fullscreenSlide && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreenSlide(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 cursor-pointer p-4 sm:p-8 animate-in fade-in duration-200"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <div className="relative">
            <img
              src={fullscreenSlide.imageUrl}
              alt="Full screen heroes preview"
              className="max-h-[90vh] max-w-[90vw] object-contain select-none shadow-2xl"
              onClick={(e) => {
                e.stopPropagation()
                setFullscreenSlide(null)
              }}
            />
            {fullscreenSlide.photographerName && (
              <div className="absolute bottom-4 right-4 text-white text-xs bg-black/50 px-3 py-1.5 rounded backdrop-blur-sm shadow-sm border border-white/10 font-medium tracking-wide">
                Photo by {fullscreenSlide.photographerName}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  )
}
