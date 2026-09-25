"use client"

import { useCallback, useRef, useState, useEffect } from "react"
import {
  Camera,
  Crop,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react"
import Cropper, { type Area } from "react-easy-crop"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogTitle } from "@/components/ui/dialog"
import {
  getImageUploadErrorMessage,
  type ImageUploadScope,
  uploadImageToCloudinary,
  validateImageUpload,
} from "@/lib/cloudinary/upload-image"
import { cn } from "@/lib/utils"

// Import removed as react-easy-crop provides its own basic styles if needed, but it's largely self-contained or imported differently if required. Usually it doesn't need external css for basic functionality.

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  className?: string
  aspect?: number
  defaultImage?: string
  disabled?: boolean
  uploadScope?: ImageUploadScope
  variant?: "default" | "profile-banner" | "profile-avatar"
  alt?: string
  onUploadingChange?: (isUploading: boolean) => void
  aspectOptions?: { label: string; value: "natural" | number }[]
}

export const createImage = (url: string): Promise<HTMLImageElement> =>
  new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener("load", () => resolve(image))
    image.addEventListener("error", (error) => reject(error))
    image.setAttribute("crossOrigin", "anonymous")
    image.src = url
  })

function getCroppedImage(image: HTMLImageElement, crop: Area, mimeType: string = "image/png") {
  const canvas = document.createElement("canvas")
  const scaleX = image.naturalWidth / image.width
  const scaleY = image.naturalHeight / image.height

  canvas.width = Math.max(1, Math.floor(crop.width * scaleX))
  canvas.height = Math.max(1, Math.floor(crop.height * scaleY))

  const context = canvas.getContext("2d")
  if (!context) {
    return Promise.reject(new Error("Canvas untuk crop gambar tidak tersedia."))
  }

  context.drawImage(
    image,
    crop.x * scaleX,
    crop.y * scaleY,
    crop.width * scaleX,
    crop.height * scaleY,
    0,
    0,
    canvas.width,
    canvas.height,
  )

  return new Promise<Blob>((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (blob) resolve(blob)
        else reject(new Error("Hasil crop gambar gagal dibuat."))
      },
      mimeType,
      mimeType === "image/jpeg" || mimeType === "image/webp" ? 0.92 : undefined,
    )
  })
}

// Removed centerAspectCrop as react-easy-crop handles centering automatically

export function ImageUpload({
  value,
  onChange,
  placeholder = "Klik untuk upload gambar...",
  className = "",
  aspect,
  defaultImage,
  disabled = false,
  uploadScope = "website-content",
  variant = "default",
  alt = "Preview",
  onUploadingChange,
  aspectOptions,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [rawImageUrl, setRawImageUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [crop, setCrop] = useState({ x: 0, y: 0 })
  const [zoom, setZoom] = useState(1)
  const [completedCrop, setCompletedCrop] = useState<Area | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isMounted, setIsMounted] = useState(false)
  const [localPreviewUrl, setLocalPreviewUrl] = useState("")
  const [naturalAspect, setNaturalAspect] = useState<number>(1)
  const [selectedAspect, setSelectedAspect] = useState<"natural" | number>(
    aspectOptions?.[0]?.value ?? (aspect || 16 / 9)
  )

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const displayValue = localPreviewUrl || value || defaultImage || ""

  const resetCropModal = useCallback(() => {
    if (rawImageUrl) URL.revokeObjectURL(rawImageUrl)
    setShowCropModal(false)
    setRawImageUrl("")
    setSelectedFile(null)
    setCrop({ x: 0, y: 0 })
    setZoom(1)
    setCompletedCrop(null)
    if (aspectOptions && aspectOptions.length > 0) {
      setSelectedAspect(aspectOptions[0].value)
    } else {
      setSelectedAspect(aspect || 16 / 9)
    }
  }, [rawImageUrl, aspect, aspectOptions])

  const closeCropModal = useCallback(() => {
    if (isUploading) return
    resetCropModal()
  }, [isUploading, resetCropModal])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const file = event.target.files?.[0]
    if (file) {
      const validationMessage = validateImageUpload(file)
      if (validationMessage) {
        toast.error(validationMessage)
      } else {
        const url = URL.createObjectURL(file)
        setSelectedFile(file)
        setRawImageUrl(url)
        setShowCropModal(true)
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // Removed onImageLoad as react-easy-crop handles initial crop aspect ratio

  const handlePreviewError = useCallback(() => {
    toast.error(
      "Gambar tidak bisa dibuka. Kemungkinan file rusak atau formatnya tidak didukung browser.",
    )
    resetCropModal()
  }, [resetCropModal])

  const uploadImage = async (file: Blob, filename: string, localUrlToRevoke?: string) => {
    setIsUploading(true)
    onUploadingChange?.(true)
    try {
      const secureUrl = await uploadImageToCloudinary(
        file,
        filename,
        uploadScope,
      )
      onChange(secureUrl)
      toast.success("Gambar berhasil diunggah.")
    } catch (error) {
      console.error("Image upload failed:", error)
      toast.error(getImageUploadErrorMessage(error))
    } finally {
      if (localUrlToRevoke) {
        URL.revokeObjectURL(localUrlToRevoke)
        setLocalPreviewUrl("")
      }
      setIsUploading(false)
      onUploadingChange?.(false)
    }
  }

  const handleCropDone = async () => {
    if (!completedCrop || !selectedFile || !rawImageUrl) {
      toast.error("Pilih area crop gambar terlebih dahulu.")
      return
    }

    try {
      const image = await createImage(rawImageUrl)
      const mimeType = selectedFile.type === "image/png" ? "image/png" : "image/webp"
      const extension = selectedFile.type === "image/png" ? "png" : "webp"
      const croppedImage = await getCroppedImage(image, completedCrop, mimeType)
      const basename = selectedFile.name.replace(/\.[^/.]+$/, "") || "image"
      
      const localUrl = URL.createObjectURL(croppedImage)
      setLocalPreviewUrl(localUrl)
      
      resetCropModal()
      
      await uploadImage(croppedImage, `${basename}-cropped.${extension}`, localUrl)
    } catch (error) {
      console.error("Image crop failed:", error)
      toast.error(getImageUploadErrorMessage(error))
    }
  }

  const handleSkipCrop = async () => {
    if (!selectedFile) return
    const localUrl = URL.createObjectURL(selectedFile)
    setLocalPreviewUrl(localUrl)
    resetCropModal()
    await uploadImage(selectedFile, selectedFile.name, localUrl)
  }

  const handleRemove = (event: React.MouseEvent) => {
    if (disabled || isUploading) return
    event.stopPropagation()
    onChange("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
      <div className={cn("w-full", className)}>
        <input
          type="file"
          accept="image/avif,image/gif,image/jpeg,image/png,image/svg+xml,image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {displayValue && variant === "profile-banner" ? (
          <div className="group relative h-48 w-full overflow-hidden md:h-64">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayValue}
              alt={alt}
              className="size-full object-contain"
            />
            {!disabled ? (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 hover:text-white"
                >
                  {isUploading ? (
                    <Loader2 className="mr-2 size-4 animate-spin" />
                  ) : (
                    <Camera className="mr-2 size-4" />
                  )}
                  Ubah Banner
                </Button>
                {value ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleRemove}
                    disabled={isUploading}
                    aria-label="Hapus banner"
                  >
                    <X className="size-4" />
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : displayValue && variant === "profile-avatar" ? (
          <div className="group relative size-24 overflow-hidden rounded-full border-4 border-palembang-charcoal bg-white shadow-sm sm:size-32">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayValue}
              alt={alt}
              className="size-full object-contain"
            />
            {!disabled ? (
              <div className="absolute inset-0 flex items-center justify-center gap-1 bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="rounded-full p-2 text-white transition-colors hover:bg-white/20 disabled:opacity-60"
                  aria-label="Ubah foto profil"
                >
                  {isUploading ? (
                    <Loader2 className="size-6 animate-spin" />
                  ) : (
                    <Camera className="size-6" />
                  )}
                </button>
                {value ? (
                  <button
                    type="button"
                    onClick={handleRemove}
                    disabled={isUploading}
                    className="rounded-full p-2 text-white transition-colors hover:bg-destructive/80 disabled:opacity-60"
                    aria-label="Hapus foto profil"
                  >
                    <X className="size-5" />
                  </button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : displayValue ? (
          <div className="group relative h-full w-full min-h-32 overflow-hidden rounded-md border bg-muted/20 flex items-center justify-center">
            {/* The native image element is required by the crop canvas API. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayValue}
              alt={alt}
              className={cn(
                "h-full w-full object-contain transition-opacity",
                isUploading ? "opacity-40" : "opacity-100"
              )}
            />
            {isUploading && (
               <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/30 backdrop-blur-[2px]">
                 <Loader2 className="size-8 animate-spin text-white mb-2" />
                 <span className="text-xs font-semibold text-white tracking-widest uppercase">Mengunggah...</span>
               </div>
            )}
            {!value && defaultImage && !isUploading ? (
              <div className="absolute left-2 top-2">
                <span className="rounded-full bg-black/50 px-2 py-0.5 text-[10px] text-white">
                  Default
                </span>
              </div>
            ) : null}
            {!disabled ? (
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/50 opacity-0 transition-opacity group-hover:opacity-100">
                <Button
                  type="button"
                  variant="secondary"
                  size="sm"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                >
                  <UploadCloud className="mr-2 size-4" /> Ganti Gambar
                </Button>
                {value ? (
                  <Button
                    type="button"
                    variant="destructive"
                    size="icon"
                    onClick={handleRemove}
                    disabled={isUploading}
                  >
                    <X className="size-4" />
                  </Button>
                ) : null}
              </div>
            ) : null}
          </div>
        ) : (
          <button
            type="button"
            disabled={disabled || isUploading}
            onClick={() => fileInputRef.current?.click()}
            className={cn(
              "flex flex-col items-center justify-center border-2 border-dashed text-muted-foreground transition-colors",
              variant === "profile-banner"
                ? "h-48 w-full md:h-64"
                : variant === "profile-avatar"
                  ? "size-24 rounded-full border-4 border-palembang-charcoal bg-white sm:size-32"
                  : "h-32 w-full rounded-md",
              disabled || isUploading
                ? "cursor-not-allowed bg-muted/10 opacity-50"
                : "hover:border-muted-foreground hover:bg-muted/50 hover:text-foreground",
            )}
          >
            {isUploading ? (
              <Loader2 className="mb-2 size-8 animate-spin opacity-70" />
            ) : (
              <ImageIcon className="mb-2 size-8 opacity-50" />
            )}
            <span className="text-sm font-medium">
              {isUploading
                ? "Mengunggah gambar..."
                : disabled
                  ? "Tidak ada gambar"
                  : placeholder}
            </span>
            {!disabled && !isUploading && variant === "default" ? (
              <span className="mt-1 text-xs opacity-70">
                JPG, PNG, WEBP, AVIF, GIF, atau SVG (maks. 10 MB)
              </span>
            ) : null}
          </button>
        )}
      </div>

      <Dialog open={showCropModal && isMounted} onOpenChange={(open) => {
        if (!open && !isUploading) closeCropModal()
      }}>
        <DialogContent className="max-w-2xl overflow-hidden p-0 bg-background shadow-2xl border-none z-[9999]" showCloseButton={false}>
          {/* HEADER */}
          <div className="flex items-center justify-between border-b px-6 py-4">
            <DialogTitle className="flex items-center gap-2 text-lg font-semibold">
              <Crop className="size-5" /> Crop Gambar
            </DialogTitle>
            <DialogDescription className="hidden">Crop your image before uploading.</DialogDescription>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={closeCropModal}
              disabled={isUploading}
            >
              <X className="size-4" />
            </Button>
          </div>

          {/* BODY */}
          <div className="flex-1 overflow-auto p-6">
            <p className="mb-4 text-sm text-muted-foreground">
              Sesuaikan area gambar dan zoom untuk mendapatkan tampilan yang pas.
            </p>
            <div className="relative flex h-[50vh] w-full items-center justify-center overflow-hidden rounded-lg bg-zinc-900/10 dark:bg-black/40">
              <Cropper
                image={rawImageUrl}
                crop={crop}
                zoom={zoom}
                aspect={selectedAspect === "natural" ? naturalAspect : selectedAspect}
                minZoom={0.2}
                restrictPosition={false}
                onCropChange={setCrop}
                onCropComplete={(croppedArea, croppedAreaPixels) =>
                  setCompletedCrop(croppedAreaPixels)
                }
                onZoomChange={setZoom}
                onMediaLoaded={(mediaSize) => {
                  setNaturalAspect(mediaSize.naturalWidth / mediaSize.naturalHeight)
                }}
              />
            </div>
            {aspectOptions && aspectOptions.length > 0 && (
              <div className="mt-4 flex items-center gap-3">
                <span className="text-sm font-medium text-muted-foreground shrink-0">Ukuran Crop:</span>
                <div className="flex gap-2">
                  {aspectOptions.map((opt) => (
                    <Button
                      key={opt.label}
                      type="button"
                      variant={selectedAspect === opt.value ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedAspect(opt.value)}
                      className="h-8"
                    >
                      {opt.label}
                    </Button>
                  ))}
                </div>
              </div>
            )}
            <div className="mt-4 flex items-center gap-4">
              <span className="text-sm font-medium text-muted-foreground shrink-0">Zoom:</span>
              <input
                type="range"
                value={zoom}
                min={0.2}
                max={3}
                step={0.01}
                aria-label="Zoom Range"
                onChange={(e) => setZoom(Number(e.target.value))}
                style={{
                  background: `linear-gradient(to right, black ${
                    ((zoom - 0.2) / (3 - 0.2)) * 100
                  }%, #e4e4e7 ${((zoom - 0.2) / (3 - 0.2)) * 100}%)`,
                }}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full [&::-moz-range-thumb]:size-4 [&::-moz-range-thumb]:appearance-none [&::-moz-range-thumb]:rounded-full [&::-moz-range-thumb]:border-none [&::-moz-range-thumb]:bg-black [&::-webkit-slider-thumb]:size-4 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-black"
              />
              <div className="flex items-center gap-1 shrink-0">
                <input
                  type="number"
                  value={Math.round(zoom * 100)}
                  min={20}
                  max={300}
                  onChange={(e) => {
                    const val = Number(e.target.value)
                    if (!isNaN(val)) {
                      setZoom(Math.max(0.2, Math.min(3, val / 100)))
                    }
                  }}
                  className="w-[60px] rounded border border-zinc-200 px-2 py-1 text-right text-sm outline-none focus:border-black"
                />
                <span className="text-sm font-medium text-muted-foreground">%</span>
              </div>
            </div>
          </div>

          {/* FOOTER */}
          <div className="flex justify-end gap-3 border-t bg-muted/10 px-6 py-4">
            <Button
              type="button"
              variant="outline"
              onClick={closeCropModal}
              disabled={isUploading}
            >
              Batal
            </Button>
            <Button
              type="button"
              onClick={() => void handleCropDone()}
              disabled={isUploading}
              className="bg-black text-white hover:bg-zinc-800"
            >
              {isUploading ? <Loader2 className="size-4 animate-spin" /> : null}
              Terapkan Crop
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </>
  )
}
