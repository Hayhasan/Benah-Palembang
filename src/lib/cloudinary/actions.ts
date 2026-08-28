"use server"

import { z } from "zod"

import { getCloudinary } from "./cloudinary"
import { requireCurrentUser } from "@/modules/auth/data/session-dal"

const uploadScopeSchema = z.enum(["event", "website-content", "profile"])
const UPLOAD_FOLDERS = {
  event: "benah-palembang/events",
  "website-content": "benah-palembang/website-content",
  profile: "benah-palembang/profiles",
} as const

export async function createImageUploadSignature(
  input: unknown = "website-content",
) {
  await requireCurrentUser()

  const parsedScope = uploadScopeSchema.safeParse(input)
  if (!parsedScope.success) {
    return {
      success: false as const,
      message: "Scope upload gambar tidak valid.",
    }
  }

  try {
    const { client, config } = getCloudinary()
    const timestamp = Math.floor(Date.now() / 1000)
    const folder = UPLOAD_FOLDERS[parsedScope.data]
    const signature = client.utils.api_sign_request(
      {
        folder,
        timestamp,
      },
      config.apiSecret,
    )

    return {
      success: true as const,
      data: {
        apiKey: config.apiKey,
        cloudName: config.cloudName,
        folder,
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
