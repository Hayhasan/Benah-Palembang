import React, { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"

interface ScrollRevealProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode
  variant?: "fade-up" | "scale" | "slide-left" | "slide-right" | "stagger"
  delay?: number // ms
  duration?: number // ms
  threshold?: number
  className?: string
  as?: React.ElementType
}

export function ScrollReveal({
  children,
  variant = "fade-up",
  delay = 0,
  duration = 750,
  threshold = 0.08,
  className,
  as: Component = "div",
  style,
  ...props
}: ScrollRevealProps) {
  const ref = useRef<HTMLElement>(null)
  const [revealed, setRevealed] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    // Fallback for reduced motion
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setRevealed(true)
      return
    }

    const rect = el.getBoundingClientRect()
    if (rect.top < window.innerHeight * 0.9) {
      setRevealed(true)
      return
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true)
          observer.unobserve(el)
        }
      },
      {
        threshold,
        rootMargin: "0px 0px -40px 0px",
      }
    )

    observer.observe(el)
    return () => observer.disconnect()
  }, [threshold])

  const variantClass = {
    "fade-up": "reveal-on-scroll",
    scale: "reveal-scale",
    "slide-left": "reveal-slide-left",
    "slide-right": "reveal-slide-right",
    stagger: "reveal-stagger",
  }[variant]

  const customStyle: React.CSSProperties = {
    ...style,
    ...(delay > 0 ? { transitionDelay: `${delay}ms` } : {}),
    ...(duration !== 750 ? { transitionDuration: `${duration}ms` } : {}),
  }

  return (
    <Component
      ref={ref}
      className={cn(variantClass, revealed && "is-revealed", className)}
      style={customStyle}
      {...props}
    >
      {children}
    </Component>
  )
}
