import type {
  ManagedContentStatistics,
  ManagedContentType,
} from "../types/managed-content"

function formatCompactNumber(num: number): string {
  if (num >= 1000) {
    const compact = (num / 1000).toFixed(1).replace(/\.0$/, "")
    return `${compact}K`
  }
  return num.toString()
}

export function getManagedContentStatistics(
  type: ManagedContentType,
  id: number,
): ManagedContentStatistics {
  const seed = (id * 17 + (type === "ARTICLE" ? 31 : 53)) % 1000

  const rawViews = 500 + (seed * 11) % 9500
  const rawLikes = 100 + (seed * 7) % 2400

  const views = formatCompactNumber(rawViews)
  const likes = formatCompactNumber(rawLikes)

  if (type === "ARTICLE") {
    const comments = 5 + (seed * 3) % 150
    return {
      views,
      likes,
      comments,
    }
  }

  const participants = 10 + (seed * 5) % 250
  return {
    views,
    likes,
    participants,
  }
}
