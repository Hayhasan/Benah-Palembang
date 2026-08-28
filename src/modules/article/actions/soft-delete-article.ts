"use server"

import { archiveArticleAction } from "./archive-article"

export async function softDeleteArticleAction(input: unknown) {
  return archiveArticleAction(input)
}
