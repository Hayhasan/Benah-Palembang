import "server-only"

import { v2 as cloudinary } from "cloudinary"

interface CloudinaryConfig {
  cloudName: string
  apiKey: string
  apiSecret: string
}

export function getCloudinary(): {
  client: typeof cloudinary
  config: CloudinaryConfig
} {
  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error("Konfigurasi Cloudinary belum lengkap.")
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true,
  })

  return {
    client: cloudinary,
    config: { cloudName, apiKey, apiSecret },
  }
}
