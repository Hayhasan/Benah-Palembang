"use client"

import Link from "next/link"

import {
  FooterConnectIcon,
  footerConnectPlatformLabel,
} from "@/modules/website-content/components/footer-connect-icon"
import { useHeaderFooterContent } from "@/modules/website-content/components/header-footer-content-provider"

export function PublicFooter() {
  const { logo, footer } = useHeaderFooterContent()

  const socialLinks = (footer.connectLinks || [])
    .filter((link) => link.isVisible)
    .sort((a, b) => a.position - b.position)

  return (
    <footer className="w-full border-t border-zinc-900 bg-black text-white mt-4 sm:mt-6">
      <div className="mx-auto max-w-[1240px] px-4 sm:px-6 lg:px-8 pt-8 sm:pt-10 pb-8 sm:pb-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 md:gap-8 lg:gap-14 items-start">
          {/* 1. Left Column: Logo */}
          <div className="md:col-span-3 lg:col-span-3 flex items-start">
            <Link
              href="/"
              aria-label={footer.logo.imageAlt || logo.imageAlt || "Benah Palembang"}
              className="inline-block transition-opacity hover:opacity-80"
            >
              {footer.logo.imageUrl || logo.imageUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={footer.logo.imageUrl || logo.imageUrl}
                  alt={footer.logo.imageAlt || logo.imageAlt || "Benah Palembang"}
                  className="h-8 sm:h-9 w-auto object-contain"
                />
              ) : (
                <span className="font-sans font-black text-2xl tracking-tighter text-white uppercase">
                  BENAH
                </span>
              )}
            </Link>
          </div>

          {/* 2. Middle Column: Editorial Statement & Info */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col">
            <h3 className="font-sans font-bold text-xs sm:text-[13px] text-white tracking-normal leading-snug">
              {footer.creatorText || "The content for Benah Palembang was created by the people of Palembang for the people of Palembang."}
            </h3>

            {/* Dotted horizontal divider */}
            <div className="my-2.5 w-full border-b border-dotted border-zinc-700" />

            {/* Serif Body Copy */}
            <div className="space-y-4 font-serif text-xs sm:text-[13px] leading-relaxed text-zinc-300">
              <p className="whitespace-pre-wrap">{footer.description}</p>
            </div>

            {/* Copyright */}
            <div className="mt-4 font-sans text-[11px] sm:text-xs text-zinc-400">
              <p>{footer.copyrightText || "© 2026 Benah Palembang. All rights reserved."}</p>
            </div>
          </div>

          {/* 3. Right Column: Connect with us */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col">
            <h3 className="font-sans font-bold text-xs sm:text-[13px] text-white tracking-normal leading-snug">
              Connect with us
            </h3>

            {/* Dotted horizontal divider */}
            <div className="my-2.5 w-full border-b border-dotted border-zinc-700" />

            {/* Social Channels List */}
            <ul className="mt-1 space-y-2.5">
              {socialLinks.map((link) => {
                const isMail = link.platform === "mail"
                const label = isMail ? "Email" : footerConnectPlatformLabel(link.platform)
                const href =
                  isMail && !link.linkUrl.startsWith("mailto:")
                    ? `mailto:${link.linkUrl}`
                    : link.linkUrl

                return (
                  <li key={`${link.platform}-${link.position}`}>
                    <a
                      href={href}
                      target={isMail ? undefined : "_blank"}
                      rel={isMail ? undefined : "noopener noreferrer"}
                      className="group inline-flex items-center gap-2.5 text-zinc-300 hover:text-white transition-colors"
                    >
                      <span className="flex size-[18px] sm:size-[19px] items-center justify-center rounded-full bg-white text-black shrink-0 p-0.5 group-hover:scale-105 transition-transform">
                        <FooterConnectIcon platform={link.platform} className="size-3" />
                      </span>
                      <span className="font-serif text-xs sm:text-[13px] text-zinc-300 group-hover:text-white transition-colors">
                        {label}
                      </span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </div>
        </div>
      </div>
    </footer>
  )
}
