/**
 * Benah Fair Priority (BFP) Article Ranking Algorithm
 *
 * Menggabungkan metrik sesuai kebutuhan portal Benah Palembang:
 * 1. Views: Diukur dengan skala logaritmik (diminishing return) agar tidak dimanipulasi clickbait/bot.
 * 2. Recency (Baru saja diposting): Diberikan "Freshness Launch Boost" eksponensial dalam 48 jam pertama
 *    serta "Half-life Decay" (waktu paruh 7 hari) agar artikel baru selalu berkesempatan tampil di atas
 *    dan artikel lama yang populer memberikan ruang secara adil seiring waktu.
 */

export interface ArticleRankingInputs {
  id?: number | string
  views: number
  publishedAt: Date | string | null
  createdAt?: Date | string | null
  isFeatured?: boolean
}

// Konfigurasi Parameter Bobot Algoritma
export const RANKING_CONFIG = {
  // Bobot interaksi
  VIEW_LOG_MULTIPLIER: 3, // 3 * ln(1 + views)

  // Waktu paruh penyusutan skor interaksi: 7 hari = 168 jam
  HALF_LIFE_HOURS: 168,

  // Bonus awal peluncuran artikel baru (48 jam pertama)
  FRESHNESS_BOOST_INITIAL: 45, // +45 poin saat t = 0
  FRESHNESS_DECAY_HOURS: 24, // Menyusut dengan konstanta waktu 24 jam (e^(-t/24))
}

/**
 * Menghitung skor prioritas artikel berdasarkan formula BFP.
 */
export function calculateArticlePriorityScore(
  article: ArticleRankingInputs,
  now: Date = new Date(),
): number {
  const views = Math.max(0, Number(article.views) || 0)
  // 1. Engagement Base Score
  const baseEngagement = RANKING_CONFIG.VIEW_LOG_MULTIPLIER * Math.log(1 + views)

  // 2. Hitung selisih waktu dalam jam
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt)
    : article.createdAt
      ? new Date(article.createdAt)
      : now

  const diffMs = Math.max(0, now.getTime() - publishedDate.getTime())
  const hoursElapsed = diffMs / (1000 * 60 * 60)

  // 3. Half-Life Decay Factor (Waktu Paruh 7 Hari)
  // Setelah 7 hari kekuatannya menjadi 50%, setelah 14 hari 25%
  const decayFactor = Math.pow(2, -hoursElapsed / RANKING_CONFIG.HALF_LIFE_HOURS)

  // 4. Freshness Launch Boost
  // Memberi peluang tinggi bagi artikel baru di 48 jam pertama
  const freshnessBoost =
    RANKING_CONFIG.FRESHNESS_BOOST_INITIAL *
    Math.exp(-hoursElapsed / RANKING_CONFIG.FRESHNESS_DECAY_HOURS)

  // Skor Akhir
  return baseEngagement * decayFactor + freshnessBoost
}

/**
 * Mengurutkan array artikel dengan algoritma Benah Fair Priority.
 * - Featured artikel (kurasi redaksi) diposisikan paling atas.
 * - Kemudian diurutkan berdasarkan skor prioritas tertinggi.
 * - Penentu seri jika skor identik adalah publishedAt terbaru.
 */
export function sortArticlesByFairPriority<T extends ArticleRankingInputs>(
  articles: T[],
  now: Date = new Date(),
): T[] {
  return [...articles].sort((a, b) => {
    // 1. Featured articles diprioritaskan
    const aFeatured = a.isFeatured ? 1 : 0
    const bFeatured = b.isFeatured ? 1 : 0
    if (aFeatured !== bFeatured) {
      return bFeatured - aFeatured
    }

    // 2. Skor Prioritas BFP
    const scoreA = calculateArticlePriorityScore(a, now)
    const scoreB = calculateArticlePriorityScore(b, now)
    if (Math.abs(scoreB - scoreA) > 0.0001) {
      return scoreB - scoreA
    }

    // 3. Tie-breaker: waktu publikasi terbaru
    const timeA = a.publishedAt ? new Date(a.publishedAt).getTime() : 0
    const timeB = b.publishedAt ? new Date(b.publishedAt).getTime() : 0
    return timeB - timeA
  })
}
