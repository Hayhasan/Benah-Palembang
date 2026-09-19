import { PublicFooter } from "@/features/public/components/PublicFooter"
import { PublicNotFound } from "@/features/public/components/public-not-found"

export default function PublicNotFoundPage() {
  return (
    <div className="bg-white text-zinc-900 min-h-[calc(100vh-70px)] flex flex-col justify-between">
      <PublicNotFound />
      <PublicFooter />
    </div>
  )
}
