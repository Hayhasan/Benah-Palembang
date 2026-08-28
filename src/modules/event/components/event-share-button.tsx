"use client"

import { Check, Share2 } from "lucide-react"
import { useState } from "react"

import { Button } from "@/components/ui/button"

export function EventShareButton({ title }: { title: string }) {
  const [copied, setCopied] = useState(false)

  async function handleShare() {
    try {
      if (navigator.share) {
        await navigator.share({
          title: `${title} - Benah Palembang`,
          text: `Ikuti agenda "${title}" di Palembang!`,
          url: window.location.href,
        })
        return
      }

      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      if ((error as Error).name === "AbortError") return

      await navigator.clipboard?.writeText(window.location.href)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2000)
    }
  }

  return (
    <Button
      type="button"
      variant="outline"
      onClick={() => void handleShare()}
      className="h-11 w-full font-semibold"
    >
      {copied ? (
        <>
          <Check className="size-4 text-emerald-600" />
          <span className="text-emerald-600">Tautan Disalin!</span>
        </>
      ) : (
        <>
          <Share2 className="size-4" />
          <span>Bagikan Acara</span>
        </>
      )}
    </Button>
  )
}
