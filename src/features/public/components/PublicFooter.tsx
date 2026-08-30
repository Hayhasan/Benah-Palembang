"use client"

import Link from "next/link"

import {
  FooterConnectIcon,
  footerConnectPlatformLabel,
} from "@/modules/website-content/components/footer-connect-icon"
import { useHeaderFooterContent } from "@/modules/website-content/components/header-footer-content-provider"

export function PublicFooter() {
  const { logo, footer } = useHeaderFooterContent()

  return (
    <section className="reveal-on-scroll relative w-full overflow-hidden bg-background text-foreground">
      <footer className="relative mt-16 bg-background/95 sm:mt-20">
        <div className="relative z-10 mx-auto flex min-h-[28rem] max-w-7xl flex-col justify-between px-4 py-10 sm:min-h-[32rem] md:min-h-[36rem]">
          <div className="reveal-on-scroll flex w-full flex-col items-center">
            <Link
              href={logo.linkUrl}
              aria-label={logo.imageAlt}
              className="transition-transform hover:scale-105"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.imageUrl}
                alt={logo.imageAlt}
                className="h-8 w-auto object-contain brightness-0 transition-all dark:invert sm:h-9"
              />
            </Link>

            <p className="mt-3 max-w-sm px-4 text-center text-sm font-medium leading-relaxed text-muted-foreground sm:text-base">
              {footer.description}
            </p>

            {footer.connectLinks.length > 0 ? (
              <div className="mb-8 mt-5 flex gap-4">
                {footer.connectLinks.map((link) => {
                  const label = footerConnectPlatformLabel(link.platform)
                  const isMailLink = link.platform === "mail"

                  return (
                    <a
                      key={`${link.platform}-${link.position}`}
                      href={link.linkUrl}
                      target={isMailLink ? undefined : "_blank"}
                      rel={isMailLink ? undefined : "noopener noreferrer"}
                      className="rounded-full p-2 text-muted-foreground transition-all duration-300 hover:scale-110 hover:bg-muted hover:text-palembang-red"
                    >
                      <FooterConnectIcon
                        platform={link.platform}
                        className="size-5"
                      />
                      <span className="sr-only">{label}</span>
                    </a>
                  )
                })}
              </div>
            ) : null}

            {footer.exploreLinks.length > 0 ? (
              <nav
                aria-label="Navigasi footer"
                className="flex max-w-full flex-wrap justify-center gap-x-6 gap-y-3 px-4 text-sm font-medium text-muted-foreground"
              >
                {footer.exploreLinks.map((link) => (
                  <Link
                    key={`${link.label}-${link.position}`}
                    href={link.linkUrl}
                    className="transition-colors duration-300 hover:text-palembang-red"
                  >
                    {link.label}
                  </Link>
                ))}
              </nav>
            ) : null}
          </div>

          <div className="reveal-fade mt-20 flex items-center justify-center border-t border-border/30 px-4 pt-6">
            <p className="text-center text-xs text-muted-foreground sm:text-sm">
              {footer.copyrightText}
            </p>
          </div>
        </div>

        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 z-0 flex select-none items-center justify-center overflow-hidden bg-gradient-to-b from-foreground/15 via-foreground/5 to-transparent bg-clip-text text-center font-black leading-[0.85] tracking-tighter text-transparent"
          style={{ fontSize: "clamp(5rem, 24vw, 18rem)" }}
        >
          {footer.backgroundText}
        </div>

        <div className="absolute bottom-20 left-1/2 z-20 flex -translate-x-1/2 items-center justify-center rounded-3xl border border-border bg-background/80 p-2.5 shadow-2xl backdrop-blur-md transition-all hover:scale-105 hover:border-palembang-red sm:p-3 md:bottom-16">
          <div className="flex size-12 items-center justify-center rounded-2xl border border-white/10 bg-gradient-to-br from-palembang-charcoal to-zinc-900 p-2 shadow-lg sm:size-14 sm:p-2.5 md:size-16">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={logo.imageUrl}
              alt=""
              className="h-7 w-auto object-contain brightness-0 invert sm:h-8 md:h-9"
            />
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-28 left-1/2 h-px w-full -translate-x-1/2 bg-gradient-to-r from-transparent via-border to-transparent backdrop-blur-sm" />
        <div className="pointer-events-none absolute bottom-20 h-20 w-full bg-gradient-to-t from-background via-background/80 to-background/40 blur-[1em]" />
      </footer>
    </section>
  )
}
