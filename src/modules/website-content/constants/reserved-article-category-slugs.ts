export const RESERVED_ARTICLE_CATEGORY_SLUGS = new Set([
  "agenda",
  "api",
  "artikel",
  "dashboard",
  "kolaborasi",
  "login",
  "lupa-password",
  "register",
])

export function isReservedArticleCategorySlug(slug: string) {
  return RESERVED_ARTICLE_CATEGORY_SLUGS.has(slug.toLowerCase())
}
