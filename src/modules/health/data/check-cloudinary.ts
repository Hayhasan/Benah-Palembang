import "server-only"

import { getCloudinary } from "@/lib/cloudinary/cloudinary"

export async function checkCloudinary(): Promise<string> {
  const { client } = getCloudinary()
  const response = await client.api.ping()

  if (response.status !== "ok") {
    throw new Error(`Cloudinary membalas status ${String(response.status)}.`)
  }

  return response.status
}
