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
    <main className="flex min-h-svh flex-col items-center justify-center bg-zinc-50 px-4 sm:px-6 py-12">
      <div className="w-full max-w-[420px]">
        <div className="flex flex-col items-center text-center mb-8">
          <Link href="/" className="inline-block transition-transform hover:scale-105">
            <Image
              src="/logo.png"
              alt="Benah Palembang"
              width={210}
              height={44}
              className="h-8 sm:h-9 w-auto"
            />
          </Link>
        </div>
        
        <div className="rounded-2xl border border-zinc-200 bg-white p-8 sm:p-10 shadow-sm">
          {children}
        </div>
      </div>
    </main>
  )
}
