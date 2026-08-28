"use server"

import { postArticleAction } from "./post-article"

export async function submitArticleForReviewAction(input: unknown) {
  return postArticleAction(input)
}
