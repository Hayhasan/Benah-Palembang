import { createImageUploadSignature } from "./actions"

export type ImageUploadScope = "event" | "website-content" | "profile"

interface CloudinaryUploadResponse {
  secure_url?: string
  error?: {
    message?: string
  }
}

export const MAX_IMAGE_UPLOAD_SIZE = 10 * 1024 * 1024

export const ALLOWED_IMAGE_UPLOAD_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
])

export function validateImageUpload(file: File) {
  if (!ALLOWED_IMAGE_UPLOAD_TYPES.has(file.type)) {
    return "Format gambar harus JPG, PNG, WEBP, AVIF, GIF, atau SVG."
  }

  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    return "Ukuran gambar maksimal 10 MB."
  }

  return null
}

export async function uploadImageToCloudinary(
  file: Blob,
  filename: string,
  uploadScope: ImageUploadScope,
) {
  const signatureResult = await createImageUploadSignature(uploadScope)
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
