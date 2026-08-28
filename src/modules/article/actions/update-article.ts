"use server"

import { saveArticleAction } from "./save-article"

export async function updateArticleAction(input: unknown) {
  return saveArticleAction(input)
}
