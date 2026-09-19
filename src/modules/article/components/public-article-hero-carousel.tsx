"use client"

import Image from "next/image"
import { Eye } from "lucide-react"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"

interface PublicArticleHeroCarouselProps {
  photos: string[]
  title?: string
  description?: string
  photographerName?: string
  label?: string | null
  views?: number
  className?: string
}

export function PublicArticleHeroCarousel({
  photos,
  title = "",
  description,
  photographerName,
  label,
  views,
  className = "",
}: PublicArticleHeroCarouselProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [fullscreenImage, setFullscreenImage] = useState<string | null>(null)

  // Escape key and scroll lock for fullscreen dialog
  useEffect(() => {
    if (!fullscreenImage) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setFullscreenImage(null)
    }
    window.addEventListener("keydown", handleKeyDown)
    const originalOverflow = document.body.style.overflow
    document.body.style.overflow = "hidden"
    return () => {
      window.removeEventListener("keydown", handleKeyDown)
      document.body.style.overflow = originalOverflow
    }
  }, [fullscreenImage])

  const rawCount = photos.length
  // Duplicate photos array if count is small so Embla can smoothly loop infinitely without stutter
  const displayPhotos =
    rawCount > 0 && rawCount < 5
      ? [...photos, ...photos, ...photos]
      : photos

  const [emblaRef, emblaApi] = useEmblaCarousel({
    loop: displayPhotos.length > 1,
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
    if (!emblaApi || isHovered || displayPhotos.length <= 1) return

    const timer = setInterval(() => {
      emblaApi.scrollNext()
    }, 6000)

    return () => clearInterval(timer)
  }, [emblaApi, isHovered, displayPhotos.length])

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  if (rawCount === 0) return null

  return (
    <div
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full ${className}`}
    >
      {/* 3-Panel Heroes Carousel Viewport (Fit to Screen Tanpa Padding) */}
      <div
        ref={emblaRef}
        className="w-full overflow-hidden h-[calc(100dvh-92px)] sm:h-[calc(100dvh-100px)] min-h-[500px] sm:min-h-[560px] select-none cursor-grab active:cursor-grabbing bg-zinc-950"
      >
        <div className="flex h-full touch-pan-y">
          {displayPhotos.map((photoUrl, index) => {
            const isActive = index === selectedIndex

            return (
              <div
                key={`${photoUrl}-${index}`}
                onClick={() => {
                  if (isActive) {
                    setFullscreenImage(photoUrl)
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
                <div className="relative size-full overflow-hidden bg-zinc-900">
                  <Image
                    fill
                    priority={index === 0}
                    src={photoUrl}
                    alt={`${title ? `${title} - ` : ""}Foto ${((index % rawCount) + 1)}`}
                    sizes="(max-width: 768px) 100vw, 75vw"
                    className="size-full object-cover"
                  />

                  {/* Dark overlay on image to darken photo */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      title
                        ? isActive
                          ? "bg-black/50"
                          : "bg-black/60"
                        : isActive
                          ? "bg-black/0"
                          : "bg-black/30"
                    }`}
                  />

                  {/* Centered Title & Description Directly on Darkened Photo (No Card) */}
                  {isActive && title && (
                    <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 text-center">
                      <div className="max-w-4xl">
                        <h1 className="font-sans text-2xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white leading-[1.15] drop-shadow-lg">
                          {title}
                        </h1>
                        {description && (
                          <p className="mt-4 sm:mt-5 font-serif text-sm sm:text-base md:text-lg text-white/90 leading-relaxed max-w-2xl mx-auto drop-shadow-md">
                            {description}
                          </p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Active Slide Photo Counter */}
                  {isActive && rawCount > 1 && (
                    <div className="absolute bottom-3 right-3 rounded-[2px] bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-xs">
                      {(selectedIndex % rawCount) + 1} / {rawCount}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Left Clickable Area (Clicking slides left smoothly; no arrow button) */}
      {rawCount > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Foto sebelumnya"
          className="absolute left-0 top-0 bottom-0 w-[8%] sm:w-[12%] lg:w-[15%] z-30 cursor-pointer focus:outline-none bg-gradient-to-r from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        />
      )}

      {/* Right Clickable Area (Clicking slides right smoothly; no arrow button) */}
      {rawCount > 1 && (
        <button
          type="button"
          onClick={handleNext}
          aria-label="Foto berikutnya"
          className="absolute right-0 top-0 bottom-0 w-[8%] sm:w-[12%] lg:w-[15%] z-30 cursor-pointer focus:outline-none bg-gradient-to-l from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        />
      )}

      {/* Caption & Navigation Hint Below Carousel (Contained within page width) */}
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 mt-2.5 flex flex-wrap items-center justify-between gap-4 text-zinc-500">
        <div>
          <p className="font-serif text-[11.5px] sm:text-[12.5px] italic text-zinc-600">
            Photograph by {photographerName || "Benah Palembang"}
          </p>
          {label && (
            <p className="font-sans text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.1em] text-zinc-800 mt-1">
              {label}
            </p>
          )}
        </div>
        <div className="flex items-center gap-4">
          {typeof views === "number" && (
            <div className="flex items-center gap-1.5 text-xs text-zinc-500 font-sans">
              <Eye className="size-3.5" />
              <span>{views.toLocaleString("id-ID")} views</span>
            </div>
          )}
          {rawCount > 1 && (
            <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
              Geser untuk foto lainnya
            </p>
          )}
        </div>
      </div>

      {/* Fullscreen Image Dialog with photograph by watermark */}
      {fullscreenImage && (
        <div
          role="dialog"
          aria-modal="true"
          onClick={() => setFullscreenImage(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 cursor-pointer p-4 sm:p-8 animate-in fade-in duration-200"
        >
          <div className="relative inline-block max-h-[90vh] max-w-[90vw]">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={fullscreenImage}
              alt="Full screen heroes preview"
              className="max-h-[90vh] max-w-[90vw] object-contain select-none shadow-2xl block"
              onClick={() => setFullscreenImage(null)}
            />
            {/* Watermark di bawah kanan foto */}
            <div className="absolute bottom-3 right-3 sm:bottom-4 sm:right-4 rounded-[2px] bg-black/75 px-3 py-1.5 text-xs sm:text-sm font-medium tracking-wide text-white/95 backdrop-blur-md pointer-events-none select-none border border-white/10 shadow-lg">
              Photograph by {photographerName}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
