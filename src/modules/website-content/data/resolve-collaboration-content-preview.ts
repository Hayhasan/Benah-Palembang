import "server-only"

import type {
  CollaborationContentPreviewData,
  CollaborationPartnerContentData,
} from "../types/collaboration-page"
import { getCollaborationContentFallbackPreview } from "./collaboration-content-preview"

interface OEmbedResponse {
  title?: unknown
  thumbnail_url?: unknown
}

async function readOEmbed(endpoint: string): Promise<OEmbedResponse | null> {
  try {
    const response = await fetch(endpoint, {
      next: { revalidate: 21_600 },
      signal: AbortSignal.timeout(5_000),
    })
    if (!response.ok) return null

    return (await response.json()) as OEmbedResponse
  } catch {
    return null
  }
}

export async function resolveCollaborationContentPreview(
  item: Pick<CollaborationPartnerContentData, "platform" | "contentUrl">,
): Promise<CollaborationContentPreviewData> {
  const fallback = getCollaborationContentFallbackPreview(item)
  const endpoint =
    item.platform === "youtube"
      ? `https://www.youtube.com/oembed?format=json&url=${encodeURIComponent(item.contentUrl)}`
      : item.platform === "tiktok"
        ? `https://www.tiktok.com/oembed?url=${encodeURIComponent(item.contentUrl)}`
        : null

  if (!endpoint) return fallback

  const metadata = await readOEmbed(endpoint)
  return {
    ...fallback,
    title:
      typeof metadata?.title === "string" && metadata.title.trim()
        ? metadata.title.trim()
        : fallback.title,
    thumbnailUrl:
      typeof metadata?.thumbnail_url === "string" && metadata.thumbnail_url
        ? metadata.thumbnail_url
        : fallback.thumbnailUrl,
  }
}
