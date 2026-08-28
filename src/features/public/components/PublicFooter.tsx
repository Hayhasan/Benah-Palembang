"use client"

import Link from "next/link"

import { useHeaderFooterContent } from "@/modules/website-content/components/header-footer-content-provider"

export function PublicFooter() {
  const { logo, footer } = useHeaderFooterContent()

  return (
    <footer className="bg-palembang-charcoal px-6 pb-6 pt-16 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Link href={logo.linkUrl} aria-label={logo.imageAlt}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={logo.imageUrl}
                alt={logo.imageAlt}
                className="h-9 w-auto brightness-0 invert sm:h-11"
              />
            </Link>
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
              {footer.description}
            </p>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              Explore
            </p>
            {footer.exploreDescription ? (
              <p className="mb-4 text-xs leading-5 text-white/45">
                {footer.exploreDescription}
              </p>
            ) : null}
            <div className="flex flex-col gap-3 text-sm text-white/65">
              {footer.exploreLinks.map((link) => (
                <Link
                  key={`${link.label}-${link.position}`}
                  href={link.linkUrl}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              Connect
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              {footer.connectLinks.map((link) => (
                <a
                  key={`${link.label}-${link.position}`}
                  href={link.linkUrl}
                  className="transition-colors hover:text-white"
                >
                  {link.label}
                </a>
              ))}
            </div>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              Contact
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              <a href={`mailto:${footer.contactEmail}`}>
                {footer.contactEmail}
              </a>
              <span>{footer.contactAddress}</span>
              <span>{footer.contactPhone}</span>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/15 pt-5 text-[10px] uppercase tracking-[0.14em] text-white/40 sm:flex-row">
          <span>{footer.copyrightText}</span>
          <span>{footer.closingText}</span>
        </div>
      </div>
    </footer>
  )
}
