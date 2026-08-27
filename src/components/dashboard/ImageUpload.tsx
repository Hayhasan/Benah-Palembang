"use client"

import { useCallback, useRef, useState } from "react"
import {
  Crop,
  Image as ImageIcon,
  Loader2,
  UploadCloud,
  X,
} from "lucide-react"
import ReactCrop, {
  centerCrop,
  makeAspectCrop,
  type Crop as CropType,
  type PixelCrop,
} from "react-image-crop"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import { createImageUploadSignature } from "@/lib/cloudinary/actions"

import "react-image-crop/dist/ReactCrop.css"

interface ImageUploadProps {
  value: string
  onChange: (url: string) => void
  placeholder?: string
  className?: string
  aspect?: number
  defaultImage?: string
  disabled?: boolean
}

interface CloudinaryUploadResponse {
  secure_url?: string
  error?: {
    message?: string
  }
}

const MAX_IMAGE_SIZE = 10 * 1024 * 1024
const ALLOWED_IMAGE_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
])

function getCroppedImage(image: HTMLImageElement, crop: PixelCrop) {
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
      "image/jpeg",
      0.92,
    )
  })
}

function centerAspectCrop(
  mediaWidth: number,
  mediaHeight: number,
  aspect: number,
) {
  return centerCrop(
    makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
    mediaWidth,
    mediaHeight,
  )
}

async function uploadImageToCloudinary(file: Blob, filename: string) {
  const signatureResult = await createImageUploadSignature()
  if (!signatureResult.success) {
    throw new Error(signatureResult.message)
  }

  const { apiKey, cloudName, folder, signature, timestamp } =
    signatureResult.data
  const formData = new FormData()
  formData.append("file", file, filename)
  formData.append("api_key", apiKey)
  formData.append("folder", folder)
  formData.append("signature", signature)
  formData.append("timestamp", String(timestamp))

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  )
  const result = (await response.json()) as CloudinaryUploadResponse

  if (!response.ok || !result.secure_url) {
    throw new Error(result.error?.message ?? "Upload gambar ke Cloudinary gagal.")
  }

  return result.secure_url
}

export function ImageUpload({
  value,
  onChange,
  placeholder = "Klik untuk upload gambar...",
  className = "",
  aspect,
  defaultImage,
  disabled = false,
}: ImageUploadProps) {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const imageRef = useRef<HTMLImageElement>(null)
  const [showCropModal, setShowCropModal] = useState(false)
  const [rawImageUrl, setRawImageUrl] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [crop, setCrop] = useState<CropType>()
  const [completedCrop, setCompletedCrop] = useState<PixelCrop>()
  const [isUploading, setIsUploading] = useState(false)

  const displayValue = value || defaultImage || ""

  const resetCropModal = useCallback(() => {
    if (rawImageUrl) URL.revokeObjectURL(rawImageUrl)
    setShowCropModal(false)
    setRawImageUrl("")
    setSelectedFile(null)
    setCrop(undefined)
    setCompletedCrop(undefined)
  }, [rawImageUrl])

  const closeCropModal = useCallback(() => {
    if (isUploading) return
    resetCropModal()
  }, [isUploading, resetCropModal])

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (disabled) return

    const file = event.target.files?.[0]
    if (file) {
      if (!ALLOWED_IMAGE_TYPES.has(file.type)) {
        toast.error("Format gambar harus JPG, PNG, WEBP, AVIF, GIF, atau SVG.")
      } else if (file.size > MAX_IMAGE_SIZE) {
        toast.error("Ukuran gambar maksimal 10 MB.")
      } else {
        const url = URL.createObjectURL(file)
        setSelectedFile(file)
        setRawImageUrl(url)
        setShowCropModal(true)
      }
    }

    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  const onImageLoad = useCallback(
    (event: React.SyntheticEvent<HTMLImageElement>) => {
      const { width, height } = event.currentTarget
      setCrop(centerAspectCrop(width, height, aspect || 16 / 9))
    },
    [aspect],
  )

  const uploadImage = async (file: Blob, filename: string) => {
    setIsUploading(true)
    try {
      const secureUrl = await uploadImageToCloudinary(file, filename)
      onChange(secureUrl)
      toast.success("Gambar berhasil diunggah.")
      resetCropModal()
    } catch (error) {
      console.error("Image upload failed:", error)
      toast.error(
        error instanceof Error
          ? error.message
          : "Upload gambar ke Cloudinary gagal.",
      )
    } finally {
      setIsUploading(false)
    }
  }

  const handleCropDone = async () => {
    if (!completedCrop || !imageRef.current || !selectedFile) {
      toast.error("Pilih area crop gambar terlebih dahulu.")
      return
    }

    try {
      const croppedImage = await getCroppedImage(imageRef.current, completedCrop)
      const basename = selectedFile.name.replace(/\.[^/.]+$/, "") || "image"
      await uploadImage(croppedImage, `${basename}-cropped.jpg`)
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Crop gambar gagal diproses.",
      )
    }
  }

  const handleSkipCrop = async () => {
    if (!selectedFile) return
    await uploadImage(selectedFile, selectedFile.name)
  }

  const handleRemove = (event: React.MouseEvent) => {
    if (disabled || isUploading) return
    event.stopPropagation()
    onChange("")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  return (
    <>
      <div className={`w-full ${className}`}>
        <input
          type="file"
          accept="image/avif,image/gif,image/jpeg,image/png,image/svg+xml,image/webp"
          ref={fileInputRef}
          onChange={handleFileChange}
          className="hidden"
        />

        {displayValue ? (
          <div className="group relative h-48 w-full overflow-hidden rounded-md border bg-muted/20">
            {/* The native image element is required by the crop canvas API. */}
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={displayValue}
              alt="Preview"
              className="h-full w-full object-cover"
            />
            {!value && defaultImage ? (
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
            className={`flex h-32 w-full flex-col items-center justify-center rounded-md border-2 border-dashed text-muted-foreground transition-colors ${
              disabled || isUploading
                ? "cursor-not-allowed bg-muted/10 opacity-50"
                : "hover:border-muted-foreground hover:bg-muted/50 hover:text-foreground"
            }`}
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
            {!disabled && !isUploading ? (
              <span className="mt-1 text-xs opacity-70">
                JPG, PNG, WEBP, AVIF, GIF, atau SVG (maks. 10 MB)
              </span>
            ) : null}
          </button>
        )}
      </div>

      {showCropModal ? (
        <div
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={closeCropModal}
        >
          <div
            className="max-h-[90vh] w-full max-w-2xl space-y-4 overflow-auto rounded-2xl bg-background p-6 shadow-2xl"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-center justify-between">
              <h3 className="flex items-center gap-2 text-lg font-semibold">
                <Crop className="size-5" /> Crop Gambar
              </h3>
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
            <p className="text-sm text-muted-foreground">
              Sesuaikan area gambar yang ingin ditampilkan. Anda bisa melewati
              tahap ini jika tidak perlu crop.
            </p>
            <div className="flex items-center justify-center overflow-hidden rounded-lg bg-muted/30">
              <ReactCrop
                crop={crop}
                onChange={(nextCrop) => setCrop(nextCrop)}
                onComplete={(nextCrop) => setCompletedCrop(nextCrop)}
                aspect={aspect}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  ref={imageRef}
                  src={rawImageUrl}
                  alt="Crop Preview"
                  onLoad={onImageLoad}
                  className="max-h-[60vh]"
                />
              </ReactCrop>
            </div>
            <div className="flex justify-end gap-3 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => void handleSkipCrop()}
                disabled={isUploading}
              >
                {isUploading ? <Loader2 className="size-4 animate-spin" /> : null}
                Lewati Crop
              </Button>
              <Button
                type="button"
                onClick={() => void handleCropDone()}
                disabled={isUploading}
                className="bg-palembang-red text-white hover:bg-palembang-red/90"
              >
                {isUploading ? <Loader2 className="size-4 animate-spin" /> : null}
                Terapkan Crop
              </Button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  )
}
