import type {
  CollaborationContentPreviewData,
  CollaborationPartnerContentData,
  CollaborationPlatform,
} from "../types/collaboration-page"

const platformLabels: Record<CollaborationPlatform, string> = {
  youtube: "YouTube",
  instagram: "Instagram",
  tiktok: "TikTok",
  facebook: "Facebook",
  x: "X",
}

function parseUrl(value: string) {
  try {
    return new URL(value)
  } catch {
    return null
  }
}

function youtubeVideoId(contentUrl: string) {
  const url = parseUrl(contentUrl)
  if (!url) return null

  const hostname = url.hostname.replace(/^www\./, "")
  const segments = url.pathname.split("/").filter(Boolean)
  let candidate: string | null = null

  if (hostname === "youtu.be") {
    candidate = segments[0] ?? null
  } else if (hostname.endsWith("youtube.com")) {
    candidate =
      url.pathname === "/watch"
        ? url.searchParams.get("v")
        : ["embed", "shorts", "live"].includes(segments[0] ?? "")
          ? segments[1] ?? null
          : null
  }

  return candidate && /^[A-Za-z0-9_-]{6,20}$/.test(candidate)
    ? candidate
    : null
}

function instagramShortcode(contentUrl: string) {
  const url = parseUrl(contentUrl)
  if (!url || !url.hostname.replace(/^www\./, "").endsWith("instagram.com")) {
    return null
  }

  const [kind, shortcode] = url.pathname.split("/").filter(Boolean)
  return ["p", "reel", "reels", "tv"].includes(kind ?? "") &&
    shortcode &&
    /^[A-Za-z0-9_-]+$/.test(shortcode)
    ? shortcode
    : null
}

function fallbackAspectRatio(
  platform: CollaborationPlatform,
  contentUrl: string,
): CollaborationContentPreviewData["aspectRatio"] {
  const url = parseUrl(contentUrl)

  if (platform === "youtube") {
    return url?.pathname.includes("/shorts/") ? "PORTRAIT" : "LANDSCAPE"
  }
  if (platform === "tiktok") return "PORTRAIT"
  if (platform === "instagram") {
    return url?.pathname.includes("/reel") ? "PORTRAIT" : "SQUARE"
  }

  return "LANDSCAPE"
}

export function getCollaborationContentFallbackPreview(
  item: Pick<CollaborationPartnerContentData, "platform" | "contentUrl">,
): CollaborationContentPreviewData {
  const videoId =
    item.platform === "youtube" ? youtubeVideoId(item.contentUrl) : null
  const instagramCode =
    item.platform === "instagram" ? instagramShortcode(item.contentUrl) : null

  return {
    title: `${platformLabels[item.platform]} Content`,
    thumbnailUrl: videoId
      ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
      : instagramCode
        ? `/api/collaboration/instagram-thumbnail/${instagramCode}`
        : null,
    aspectRatio: fallbackAspectRatio(item.platform, item.contentUrl),
  }
}
