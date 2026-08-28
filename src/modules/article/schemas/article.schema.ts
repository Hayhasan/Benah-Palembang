import { z } from "zod"

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`)

const httpsUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(2048, `${label} maksimal 2.048 karakter.`)
    .url(`Format ${label.toLowerCase()} tidak valid.`)
    .refine((value) => value.startsWith("https://"), {
      message: `${label} wajib menggunakan HTTPS.`,
    })

export const articleListQuerySchema = z.object({
  q: z.string().trim().max(255).catch(""),
  page: z.coerce.number().int().positive().catch(1),
})

export const articleIdSchema = z.object({
  id: z.coerce.number().int().positive("ID Artikel tidak valid."),
})

export const articleEditorSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  intent: z.enum(["SAVE", "POST"]),
  title: requiredText("Judul Artikel", 255),
  excerpt: requiredText("Ringkasan Artikel", 5000),
  content: requiredText("Konten Artikel", 100_000),
  coverImageUrl: httpsUrl("Banner Artikel"),
  websiteArticleSectionId: z.coerce
    .number()
    .int()
    .positive("Kategori artikel wajib dipilih."),
  tags: z
    .array(requiredText("Tag", 80))
    .max(12, "Tag maksimal 12 item.")
    .transform((tags) => [...new Set(tags)]),
})
