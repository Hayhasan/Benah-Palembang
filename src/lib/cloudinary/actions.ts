"use server"

import { getCloudinary } from "./cloudinary"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

const WEBSITE_CONTENT_FOLDER = "benah-palembang/website-content"

export async function createImageUploadSignature() {
  await requireCurrentUser()

  try {
    const { client, config } = getCloudinary()
    const timestamp = Math.floor(Date.now() / 1000)
    const signature = client.utils.api_sign_request(
      {
        folder: WEBSITE_CONTENT_FOLDER,
        timestamp,
      },
      config.apiSecret,
    )

    return {
      success: true as const,
      data: {
        apiKey: config.apiKey,
        cloudName: config.cloudName,
        folder: WEBSITE_CONTENT_FOLDER,
        signature,
        timestamp,
      },
    }
  } catch (error) {
    console.error("Failed to create Cloudinary upload signature:", error)
    return {
      success: false as const,
      message:
        error instanceof Error
          ? error.message
          : "Signature upload gambar gagal dibuat.",
    }
  }
}
