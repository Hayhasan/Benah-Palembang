import { z } from "zod"

export const createArticleCommentSchema = z.object({
  articleId: z.coerce.number().int().positive("ID Artikel tidak valid."),
  content: z
    .string()
    .trim()
    .min(1, "Komentar tidak boleh kosong.")
    .max(1000, "Komentar maksimal 1.000 karakter."),
})

export const deleteArticleCommentSchema = z.object({
  id: z.coerce.number().int().positive("ID Komentar tidak valid."),
})
