import React from "react";
import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTheme } from "@/context/ThemeContext";

// Clean SVG Icons for Social Platforms
function InstagramIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
    </svg>
  );
}

function WhatsAppIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
    </svg>
  );
}

function YoutubeIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2.5 17a24.12 24.12 0 0 1 0-10 2 2 0 0 1 1.4-1.4 49.56 49.56 0 0 1 16.2 0A2 2 0 0 1 21.5 7a24.12 24.12 0 0 1 0 10 2 2 0 0 1-1.4 1.4 49.55 49.55 0 0 1-16.2 0A2 2 0 0 1 2.5 17" />
      <polygon points="10 15 15 12 10 9 10 15" fill="currentColor" />
    </svg>
  );
}

export interface FooterLink {
  label: string;
  href: string;
}

export interface SocialLink {
  icon: React.ReactNode;
  href: string;
  label: string;
}

export interface FooterProps {
  brandName?: string;
  brandDescription?: string;
  socialLinks?: SocialLink[];
  navLinks?: FooterLink[];
  creatorName?: string;
  creatorUrl?: string;
  brandIcon?: React.ReactNode;
  className?: string;
}

const DEFAULT_SOCIAL_LINKS: SocialLink[] = [
  {
    icon: <InstagramIcon className="w-5 h-5" />,
    href: "https://instagram.com",
    label: "Instagram",
  },
  {
    icon: <WhatsAppIcon className="w-5 h-5" />,
    href: "https://wa.me/628551241878",
    label: "WhatsApp",
  },
  {
    icon: <YoutubeIcon className="w-5 h-5" />,
    href: "https://youtube.com",
    label: "YouTube",
  },
  {
    icon: <Mail className="w-5 h-5" />,
    href: "mailto:halo@benahpalembang.id",
    label: "Email",
  },
];

const DEFAULT_NAV_LINKS: FooterLink[] = [
  { label: "Cerita Warga", href: "/cerita-warga" },
  { label: "Gaya Hidup", href: "/gaya-hidup" },
  { label: "Ruang Kota", href: "/ruang-kota" },
  { label: "Industri Kreatif", href: "/industri-kreatif" },
  { label: "Kebudayaan", href: "/kebudayaan" },
  { label: "Agenda", href: "/agenda" },
  { label: "Kolaborasi", href: "/kolaborasi" },
];

export const Footer = ({
  brandName = "Benah Palembang",
  brandDescription = "Platform editorial yang merekam, merayakan, dan menggerakkan kota Palembang.",
  socialLinks = DEFAULT_SOCIAL_LINKS,
  navLinks = DEFAULT_NAV_LINKS,
  brandIcon,
  className,
}: FooterProps) => {
  const { theme } = useTheme();
  return (
    <section className={cn("relative w-full mt-0 overflow-hidden bg-background text-foreground", className)}>
      <footer className="bg-background/95 mt-16 sm:mt-20 relative">
        <div className="reveal-on-scroll max-w-7xl flex flex-col justify-between mx-auto min-h-[28rem] sm:min-h-[32rem] md:min-h-[36rem] relative p-4 py-10">
          <div className="flex flex-col mb-12 sm:mb-20 md:mb-0 w-full">
            <div className="w-full flex flex-col items-center">
              <div className="space-y-3 flex flex-col items-center flex-1">
                <div className="flex items-center gap-3">
                  <img src={theme === "dark" ? "/logo.png" : "/logohitam.png"} alt={brandName} className="h-8 sm:h-9 object-contain transition-all duration-300" />
                </div>
                <p className="text-muted-foreground font-medium text-sm sm:text-base text-center w-full max-w-sm sm:w-96 px-4 sm:px-0 leading-relaxed">
                  {brandDescription}
                </p>
              </div>

              {socialLinks.length > 0 && (
                <div className="flex mb-8 mt-5 gap-4">
                  {socialLinks.map((link, index) => (
                    <a
                      key={index}
                      href={link.href}
                      className="text-muted-foreground hover:text-palembang-red transition-all duration-300 p-2 rounded-full hover:bg-white/5"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <div className="w-5 h-5 hover:scale-110 duration-300 flex items-center justify-center">
                        {link.icon}
                      </div>
                      <span className="sr-only">{link.label}</span>
                    </a>
                  ))}
                </div>
              )}

              {navLinks.length > 0 && (
                <div className="flex flex-wrap justify-center gap-x-6 gap-y-3 text-sm font-medium text-muted-foreground max-w-full px-4">
                  {navLinks.map((link, index) => (
                    <Link
                      key={index}
                      className="hover:text-palembang-red transition-colors duration-300 hover:font-semibold"
                      to={link.href}
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="mt-16 md:mt-20 flex items-center justify-center px-4 md:px-0 border-t border-border/30 pt-6">
            <p className="text-xs sm:text-sm text-muted-foreground text-center">
              ©{new Date().getFullYear()} {brandName}. All rights reserved.
            </p>
          </div>
        </div>

        {/* Large background text - PALEMBANG perfectly centered */}
        <div 
          className="bg-gradient-to-b from-foreground/15 via-foreground/5 to-transparent bg-clip-text text-transparent leading-none absolute inset-0 flex items-center justify-center font-black tracking-tighter pointer-events-none select-none text-center w-full overflow-hidden z-0"
          style={{
            fontSize: 'clamp(5rem, 24vw, 18rem)',
            maxWidth: '100vw',
            lineHeight: 0.85,
          }}
        >
          PALEMBANG
        </div>

        {/* Bottom logo badge - Logo Benah */}
        <div className="absolute hover:border-palembang-red transition-all duration-300 drop-shadow-[0_0px_20px_rgba(0,0,0,0.5)] dark:drop-shadow-[0_0px_20px_rgba(255,255,255,0.15)] bottom-20 md:bottom-16 backdrop-blur-md rounded-3xl bg-background/80 left-1/2 border border-border flex items-center justify-center p-2.5 sm:p-3 -translate-x-1/2 z-10 hover:scale-105">
          <div className="w-12 sm:w-14 md:w-16 h-12 sm:h-14 md:h-16 bg-gradient-to-br from-palembang-charcoal to-zinc-900 border border-white/10 rounded-2xl flex items-center justify-center shadow-lg p-2 sm:p-2.5">
            {brandIcon || (
              <img src="/logo.png" alt="Benah Palembang" className="w-auto h-7 sm:h-8 md:h-9 object-contain brightness-0 invert drop-shadow-lg" />
            )}
          </div>
        </div>

        {/* Bottom line */}
        <div className="absolute bottom-28 sm:bottom-26 backdrop-blur-sm h-px bg-gradient-to-r from-transparent via-border to-transparent w-full left-1/2 -translate-x-1/2 pointer-events-none"></div>

        {/* Bottom shadow */}
        <div className="bg-gradient-to-t from-background via-background/80 blur-[1em] to-background/40 absolute bottom-20 w-full h-20 pointer-events-none"></div>
      </footer>
    </section>
  );
};

export default Footer;
