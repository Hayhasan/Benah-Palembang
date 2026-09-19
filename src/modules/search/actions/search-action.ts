"use server"

import { searchPublicContent } from "../data/search-public-content"
import type { SearchResults } from "../types/search"

export async function searchContentAction(query: string): Promise<SearchResults> {
  return searchPublicContent(query, 8)
}
