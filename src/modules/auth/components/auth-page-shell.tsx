import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"

interface AuthPageShellProps {
  asideDescription: string
  children: ReactNode
}

export function AuthPageShell({
  asideDescription,
  children,
}: AuthPageShellProps) {
  return (
    <main className="theme-dark-surface flex min-h-svh items-center justify-center bg-palembang-charcoal px-6 py-32">
      <div className="grid w-full max-w-5xl overflow-hidden rounded-[1.5rem] border border-white/10 bg-black/40 shadow-xl backdrop-blur-sm lg:grid-cols-2">
        <div className="relative hidden min-h-[600px] overflow-hidden bg-palembang-charcoal lg:block">
          <Image
            fill
            src="https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=900&h=1200&fit=crop"
            alt="Jembatan Ampera"
            sizes="50vw"
            className="size-full object-cover opacity-60"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent" />
          <div className="absolute bottom-10 left-10 right-10 text-white">
            <Image
              src="/logo.png"
              alt="Benah Palembang"
              width={210}
              height={44}
              className="h-8 w-auto brightness-0 invert"
            />
            <p className="mt-4 max-w-xs text-sm leading-6 text-white/65">
              {asideDescription}
            </p>
          </div>
        </div>
        <div className="flex flex-col justify-center p-8 text-white sm:p-14">
          <Link href="/" className="inline-block">
            <Image
              src="/logo.png"
              alt="Benah Palembang"
              width={210}
              height={44}
              className="h-6 w-auto"
            />
          </Link>
          {children}
        </div>
      </div>
    </main>
  )
}
