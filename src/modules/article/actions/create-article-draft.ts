"use server"

import { saveArticleAction } from "./save-article"

export async function createArticleDraftAction(input: unknown) {
  return saveArticleAction(input)
}
