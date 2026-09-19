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
  label: z.string().trim().max(160, "Label artikel maksimal 160 karakter.").optional().nullable(),
  coverImageUrl: httpsUrl("Banner Artikel"),
  additionalBannerUrls: z.array(httpsUrl("Banner Tambahan")).max(10, "Maksimal 10 banner tambahan.").optional().default([]),
  websiteArticleSectionId: z.coerce
    .number()
    .int()
    .positive("Kategori artikel wajib dipilih."),
  tags: z
    .array(requiredText("Tag", 80))
    .max(12, "Tag maksimal 12 item.")
    .transform((tags) => [...new Set(tags)]),
  photographer: z.string().trim().max(160, "Fotografer maksimal 160 karakter.").optional().nullable(),
  additionalPhotographers: z.array(z.string().trim().max(160, "Fotografer maksimal 160 karakter.")).max(10).optional().default([]),
  venueName: z.string().trim().max(255, "Nama tempat maksimal 255 karakter.").optional().nullable(),
  venueAddress: z.string().trim().max(2000, "Alamat tempat maksimal 2.000 karakter.").optional().nullable(),
  venuePriceLevel: z.coerce.number().int().min(1).max(5).optional().nullable(),
  venueOpenDays: z.string().trim().max(100, "Hari operasional maksimal 100 karakter.").optional().nullable(),
  venueOpenHours: z.string().trim().max(100, "Jam operasional maksimal 100 karakter.").optional().nullable(),
  venueFeatures: z.array(z.string().trim().max(80)).max(20).optional().default([]),
  venueContact: z.string().trim().max(100, "Kontak maksimal 100 karakter.").optional().nullable(),
})
