"use client"

import { usePathname } from "next/navigation"
import { useEffect } from "react"

const REVEAL_SELECTOR = [
  ".reveal-on-scroll",
  ".reveal-fade",
  ".reveal-scale",
  ".reveal-slide-left",
  ".reveal-slide-right",
  ".reveal-stagger",
  "[data-reveal]",
].join(", ")
const UNREVEALED_SELECTOR = REVEAL_SELECTOR.split(", ")
  .map((selector) => `${selector}:not(.is-revealed)`)
  .join(", ")

export function PublicScrollReveal() {
  const pathname = usePathname()

  useEffect(() => {
    const reducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches

    if (reducedMotion) {
      document.querySelectorAll(REVEAL_SELECTOR).forEach((element) => {
        element.classList.add("is-revealed")
      })
      return
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return
          entry.target.classList.add("is-revealed")
          observer.unobserve(entry.target)
        })
      },
      {
        rootMargin: "0px 0px 60px 0px",
        threshold: 0,
      },
    )

    const attachObservers = () => {
      document
        .querySelectorAll(UNREVEALED_SELECTOR)
        .forEach((element) => {
          const bounds = element.getBoundingClientRect()

          if (bounds.top < window.innerHeight + 60) {
            element.classList.add("is-revealed")
          } else {
            observer.observe(element)
          }
        })
    }

    const timer = window.setTimeout(attachObservers, 50)
    let mutationFrame: number | null = null
    const mutationObserver = new MutationObserver(() => {
      if (mutationFrame !== null) return
      mutationFrame = window.requestAnimationFrame(() => {
        mutationFrame = null
        attachObservers()
      })
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      window.clearTimeout(timer)
      if (mutationFrame !== null) window.cancelAnimationFrame(mutationFrame)
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [pathname])

  return null
}
