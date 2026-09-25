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

  // Dynamic colors with fallback
  const bgColor = footer.bgColor || "#000000"
  const textColor = footer.textColor || "#ffffff"
  const mutedTextColor = `${textColor}b3` // ~70% opacity
  const dimTextColor = `${textColor}99` // ~60% opacity
  const dividerColor = `${textColor}33` // ~20% opacity

  return (
    <footer
      className="w-full border-t mt-4 sm:mt-6"
      style={{
        backgroundColor: bgColor,
        borderColor: dividerColor,
        color: textColor,
      }}
    >
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
                <img
                  src={footer.logo.imageUrl || logo.imageUrl}
                  alt={footer.logo.imageAlt || logo.imageAlt || "Benah Palembang"}
                  className="max-h-14 sm:max-h-16 w-auto max-w-[140px] sm:max-w-[180px] object-contain object-left"
                />
              ) : (
                <span
                  className="font-sans font-black text-2xl tracking-tighter uppercase"
                  style={{ color: textColor }}
                >
                  BENAH
                </span>
              )}
            </Link>
          </div>

          {/* 2. Middle Column: Editorial Statement & Info */}
          <div className="md:col-span-6 lg:col-span-6 flex flex-col">
            <h3
              className="font-sans font-bold text-xs sm:text-[13px] tracking-normal leading-snug"
              style={{ color: textColor }}
            >
              {footer.creatorText || "The content for Benah Palembang was created by the people of Palembang for the people of Palembang."}
            </h3>

            {/* Dotted horizontal divider */}
            <div
              className="my-2.5 w-full border-b border-dotted"
              style={{ borderColor: dividerColor }}
            />

            {/* Serif Body Copy */}
            <div className="space-y-4 font-serif text-xs sm:text-[13px] leading-relaxed">
              <p className="whitespace-pre-wrap" style={{ color: mutedTextColor }}>
                {footer.description}
              </p>
            </div>

            {/* Copyright */}
            <div className="mt-4 font-sans text-[11px] sm:text-xs">
              <p style={{ color: dimTextColor }}>
                {footer.copyrightText || "© 2026 Benah Palembang. All rights reserved."}
              </p>
            </div>
          </div>

          {/* 3. Right Column: Connect with us */}
          <div className="md:col-span-3 lg:col-span-3 flex flex-col">
            <h3
              className="font-sans font-bold text-xs sm:text-[13px] tracking-normal leading-snug"
              style={{ color: textColor }}
            >
              Connect with us
            </h3>

            {/* Dotted horizontal divider */}
            <div
              className="my-2.5 w-full border-b border-dotted"
              style={{ borderColor: dividerColor }}
            />

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
                      className="group inline-flex items-center gap-2.5 transition-colors"
                      style={{ color: mutedTextColor }}
                    >
                      <span
                        className="flex size-[18px] sm:size-[19px] items-center justify-center rounded-full shrink-0 p-0.5 group-hover:scale-105 transition-transform"
                        style={{
                          backgroundColor: textColor,
                          color: bgColor,
                        }}
                      >
                        <FooterConnectIcon platform={link.platform} className="size-3" />
                      </span>
                      <span
                        className="font-serif text-xs sm:text-[13px] transition-colors group-hover:opacity-100"
                        style={{ color: mutedTextColor }}
                      >
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
