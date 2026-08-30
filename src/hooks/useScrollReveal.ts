import { useEffect } from "react"
import { useLocation } from "react-router-dom"

/**
 * High-performance 60fps Scroll Reveal Hook
 * Uses IntersectionObserver with GPU-accelerated CSS transforms.
 * Automatically cleans up observers and watches DOM mutations for dynamic content.
 */
export function useScrollReveal() {
  const location = useLocation()

  useEffect(() => {
    // Scroll window smoothly to top on navigation
    window.scrollTo({ top: 0, behavior: "instant" })

    // Check for prefers-reduced-motion
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches
    if (prefersReducedMotion) {
      document.querySelectorAll(".reveal-on-scroll, .reveal-stagger, .reveal-scale, .reveal-slide-left, .reveal-slide-right").forEach((el) => {
        el.classList.add("is-revealed")
      })
      return
    }

    const observerCallback: IntersectionObserverCallback = (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const target = entry.target as HTMLElement
          target.classList.add("is-revealed")
          observer.unobserve(target)
        }
      })
    }

    const observer = new IntersectionObserver(observerCallback, {
      root: null,
      rootMargin: "0px 0px 60px 0px",
      threshold: 0,
    })

    const attachObservers = () => {
      const targets = document.querySelectorAll(
        ".reveal-on-scroll:not(.is-revealed), .reveal-stagger:not(.is-revealed), .reveal-scale:not(.is-revealed), .reveal-slide-left:not(.is-revealed), .reveal-slide-right:not(.is-revealed), [data-reveal]:not(.is-revealed)"
      )
      targets.forEach((el) => {
        // If element is already in or above viewport, reveal immediately
        const rect = el.getBoundingClientRect()
        if (rect.top < window.innerHeight + 60) {
          el.classList.add("is-revealed")
        } else {
          observer.observe(el)
        }
      })
    }

    // Initial attach
    const timer = setTimeout(attachObservers, 50)

    // Mutation observer to capture lazy-loaded or dynamically rendered cards
    const mutationObserver = new MutationObserver(() => {
      attachObservers()
    })

    mutationObserver.observe(document.body, {
      childList: true,
      subtree: true,
    })

    return () => {
      clearTimeout(timer)
      observer.disconnect()
      mutationObserver.disconnect()
    }
  }, [location.pathname, location.search])
}
