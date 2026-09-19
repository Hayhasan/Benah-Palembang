"use client"

import Image from "next/image"
import { useCallback, useEffect, useState } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ImagePlus } from "lucide-react"
import { Button } from "@/components/ui/button"

interface EventEditorHeroCarouselProps {
  photos: string[]
  title?: string
  onTitleChange?: (val: string) => void
  excerpt?: string
  onExcerptChange?: (val: string) => void
  photographerName?: string
  label?: string | null
  onOpenUploadModal: () => void
  className?: string
}

export function EventEditorHeroCarousel({
  photos,
  title,
  onTitleChange,
  excerpt,
  onExcerptChange,
  photographerName,
  label,
  onOpenUploadModal,
  className = "",
}: EventEditorHeroCarouselProps) {
  const [isHovered, setIsHovered] = useState(false)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(0)

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

  // Autoplay 6 detik sekali with pause on hover or during input typing
  useEffect(() => {
    if (!emblaApi || isHovered || isInputFocused || rawCount <= 1) return

    const timer = setInterval(() => {
      emblaApi.scrollNext()
    }, 6000)

    return () => clearInterval(timer)
  }, [emblaApi, isHovered, isInputFocused, rawCount, displayPhotos.length])

  const handlePrev = useCallback(() => {
    if (emblaApi) emblaApi.scrollPrev()
  }, [emblaApi])

  const handleNext = useCallback(() => {
    if (emblaApi) emblaApi.scrollNext()
  }, [emblaApi])

  // If no photos yet, render placeholder hero with prominent upload action
  if (rawCount === 0) {
    return (
      <section
        aria-label="Featured Photos Editor"
        className={`relative w-full bg-zinc-950 overflow-hidden h-[calc(100dvh-120px)] min-h-[480px] sm:min-h-[540px] max-h-[700px] flex flex-col items-center justify-center px-4 sm:px-6 py-12 ${className}`}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-zinc-900 via-zinc-950 to-black pointer-events-none" />

        {/* Top-right upload button */}
        <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30">
          <Button
            type="button"
            variant="outline"
            onClick={onOpenUploadModal}
            className="h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-white/10 border border-white/20 hover:bg-white/20 text-white backdrop-blur-md shadow-xl transition-all hover:scale-105 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
          >
            <ImagePlus className="size-4" />
            <span>+ Upload Banner</span>
          </Button>
        </div>

        {/* Center content: CTA + inputs */}
        <div className="relative z-20 w-full max-w-4xl mx-auto text-center space-y-6">
          {/* Removed centered upload button as requested */}

          {onTitleChange && (
            <input
              type="text"
              value={title}
              onChange={(e) => onTitleChange(e.target.value)}
              placeholder="Tuliskan Judul Artikel Di Sini..."
              className="w-full bg-transparent border-none outline-none text-center font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white placeholder:text-white/30 leading-[1.15] focus:ring-0 drop-shadow-lg"
            />
          )}
          {onExcerptChange && (
            <textarea
              value={excerpt}
              onChange={(e) => onExcerptChange(e.target.value)}
              rows={2}
              placeholder="Tuliskan 1-2 kalimat ringkasan (excerpt) untuk memikat pembaca..."
              className="w-full bg-transparent border-none outline-none text-center font-serif text-sm sm:text-base md:text-lg lg:text-xl text-white/80 placeholder:text-white/30 leading-relaxed resize-none focus:ring-0 drop-shadow-md"
            />
          )}
        </div>
      </section>
    )
  }

  // Full Hero Carousel with Photos
  return (
    <section
      aria-label="Featured Photos Carousel Editor"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative w-full ${className}`}
    >
      {/* Top Floating Action Button */}
      <div className="absolute top-4 right-4 sm:top-6 sm:right-6 z-30 pointer-events-auto">
        <Button
          type="button"
          variant="outline"
          onClick={onOpenUploadModal}
          className="h-9 sm:h-10 px-4 sm:px-5 rounded-full bg-black/60 border border-white/30 hover:bg-black/90 text-white backdrop-blur-md shadow-2xl transition-all hover:scale-105 flex items-center gap-2 text-xs font-bold uppercase tracking-wider"
        >
          <ImagePlus className="size-4" />
          <span>Kelola Banner ({rawCount})</span>
        </Button>
      </div>

      {/* 3-Panel Heroes Carousel Viewport (Fit to Screen layaknya pada halaman detail artikel public) */}
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
                  if (!isActive && emblaApi) {
                    emblaApi.scrollTo(index)
                  }
                }}
                className={`relative h-full shrink-0 basis-full sm:basis-[76%] lg:basis-[70%] transition-all duration-700 ease-out ${
                  isActive
                    ? "z-20 opacity-100"
                    : "z-10 opacity-40 hover:opacity-75 cursor-pointer"
                }`}
              >
                <div className="relative size-full overflow-hidden bg-zinc-900">
                  <Image
                    fill
                    priority={index === 0}
                    src={photoUrl}
                    alt={`Banner ${((index % rawCount) + 1)}`}
                    sizes="(max-width: 768px) 100vw, 75vw"
                    className="size-full object-cover"
                  />

                  {/* Dark overlay on image */}
                  <div
                    className={`absolute inset-0 transition-opacity duration-500 ${
                      isActive ? "bg-black/50" : "bg-black/65"
                    }`}
                  />

                  {/* Active Slide Photo Counter */}
                  {isActive && rawCount > 1 && (
                    <div className="absolute bottom-3 right-3 rounded-[2px] bg-black/70 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.14em] text-white backdrop-blur-xs z-30 pointer-events-none">
                      {(selectedIndex % rawCount) + 1} / {rawCount}
                    </div>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* Centered Title & Excerpt Editor Directly on the Darkened Active Photo */}
      {(onTitleChange || onExcerptChange) && (
        <div className="pointer-events-none absolute inset-0 z-20 flex flex-col items-center justify-center px-6 sm:px-12 lg:px-16 text-center">
          <div className="w-full max-w-4xl pointer-events-auto space-y-4 sm:space-y-6">
            {onTitleChange && (
              <input
                type="text"
                value={title}
                onChange={(e) => onTitleChange(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                placeholder="Tuliskan Judul Artikel Di Sini..."
                className="w-full bg-transparent border-none outline-none text-center font-sans text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-white placeholder:text-white/40 leading-[1.15] focus:ring-0 drop-shadow-lg"
              />
            )}
            {onExcerptChange && (
              <textarea
                value={excerpt}
                onChange={(e) => onExcerptChange(e.target.value)}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                rows={2}
                placeholder="Tuliskan 1-2 kalimat ringkasan (excerpt) untuk memikat pembaca..."
                className="w-full bg-transparent border-none outline-none text-center font-serif text-sm sm:text-base md:text-lg lg:text-xl text-white/90 placeholder:text-white/40 leading-relaxed resize-none focus:ring-0 drop-shadow-md"
              />
            )}
          </div>
        </div>
      )}

      {/* Left Clickable Area (Clicking slides left smoothly) */}
      {rawCount > 1 && (
        <button
          type="button"
          onClick={handlePrev}
          aria-label="Foto sebelumnya"
          className="absolute left-0 top-0 bottom-0 w-[8%] sm:w-[12%] lg:w-[15%] z-30 cursor-pointer focus:outline-none bg-gradient-to-r from-black/30 to-transparent opacity-0 hover:opacity-100 transition-opacity duration-300"
        />
      )}

      {/* Right Clickable Area (Clicking slides right smoothly) */}
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
            Photograph by {photographerName || "-"}
          </p>
          {label && (
            <p className="font-sans text-[11px] sm:text-[12px] font-bold uppercase tracking-[0.1em] text-zinc-800 mt-1">
              {label}
            </p>
          )}
        </div>
        {rawCount > 1 && (
          <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-zinc-400">
            Otomatis berganti tiap 6 detik &bull; Geser untuk foto lainnya
          </p>
        )}
      </div>
    </section>
  )
}
