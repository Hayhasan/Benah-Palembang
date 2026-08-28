export interface PublicArticleStats {
  views: number
  likes: number
}

export function getPublicArticleMockStats(
  articleId: number,
): PublicArticleStats {
  return {
    views: 1_200 + ((articleId * 347) % 8_000),
    likes: 90 + ((articleId * 53) % 900),
  }
}
