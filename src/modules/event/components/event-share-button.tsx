"use client"

import { Check, Share2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export function EventShareButton({
  className,
  label = "Bagikan Acara",
  title,
  url,
}: {
  className?: string
  label?: string
  title: string
  url?: string
}) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    const shareUrl = url
      ? new URL(url, window.location.origin).toString()
      : window.location.href

    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} - Benah Palembang`,
          text: `Ikuti agenda "${title}" di Palembang!`,
          url: shareUrl,
        })
        return
      }

      await navigator.clipboard?.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      if ((error as Error).name === "AbortError") return

      await navigator.clipboard?.writeText(shareUrl)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => void handleShare()}
      className={cn("h-11 w-full font-semibold", className)}
    >
      {copied ? (
        <>
          <Check className="size-4 text-emerald-600" />
          <span className="text-emerald-600">Tautan Disalin!</span>
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          <span>{label}</span>
        </>
      )}
    </Button>
  )
}
