import { z } from "zod"

export const toggleArticleLikeSchema = z.object({
  articleId: z.coerce.number().int().positive("ID Artikel tidak valid."),
})
