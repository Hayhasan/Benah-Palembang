import Image from "next/image"
import Link from "next/link"

import { categoryMeta, type Category } from "@/data/mockData"

const categories = Object.keys(categoryMeta) as Category[]

export function PublicFooter() {
  return (
    <footer className="bg-palembang-charcoal px-6 pb-6 pt-16 text-white sm:px-10 lg:px-16">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          <div>
            <Image
              src="/logo.png"
              alt="Benah Palembang"
              width={210}
              height={44}
              className="h-9 w-auto brightness-0 invert sm:h-11"
            />
            <p className="mt-5 max-w-xs text-sm leading-7 text-white/55">
              Platform editorial yang merekam, merayakan, dan menggerakkan
              kota.
            </p>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              Explore
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              {categories.slice(0, 4).map((category) => (
                <Link
                  key={category}
                  href={`/${categoryMeta[category].slug}`}
                  className="transition-colors hover:text-white"
                >
                  {category}
                </Link>
              ))}
              <Link href="/agenda">Agenda</Link>
            </div>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              Connect
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              <a href="#instagram">Instagram</a>
              <a href="#tiktok">TikTok</a>
              <a href="#youtube">YouTube</a>
              <a href="#linkedin">LinkedIn</a>
            </div>
          </div>
          <div>
            <p className="mb-5 text-[10px] font-bold uppercase tracking-[0.2em] text-palembang-gold">
              Contact
            </p>
            <div className="flex flex-col gap-3 text-sm text-white/65">
              <a href="mailto:halo@benahpalembang.id">
                halo@benahpalembang.id
              </a>
              <span>Palembang, Sumatera Selatan</span>
              <span>+62 711 123 456</span>
            </div>
          </div>
        </div>
        <div className="mt-16 flex flex-col justify-between gap-4 border-t border-white/15 pt-5 text-[10px] uppercase tracking-[0.14em] text-white/40 sm:flex-row">
          <span>© 2025 Benah Palembang</span>
          <span>Made with care in Palembang</span>
        </div>
      </div>
    </footer>
  )
}
