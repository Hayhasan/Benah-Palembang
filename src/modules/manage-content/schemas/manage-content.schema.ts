import { z } from "zod"

export const managedContentListQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  q: z.string().trim().optional(),
})

export const moderationPayloadSchema = z.object({
  type: z.enum(["ARTICLE", "EVENT"]),
  id: z.coerce.number().int().positive("ID Konten tidak valid."),
  note: z.string().trim().max(1000, "Catatan maksimal 1.000 karakter.").optional(),
})

/**
 * Reject dan Takedown wajib menyertakan alasan karena catatan tersebut
 * ditampilkan kepada pemilik konten pada dashboard dan email notifikasi.
 */
export const moderationNotePayloadSchema = moderationPayloadSchema.extend({
  note: z
    .string()
    .trim()
    .min(1, "Alasan wajib diisi.")
    .max(1000, "Catatan maksimal 1.000 karakter."),
})

export type ModerationPayload = z.infer<typeof moderationPayloadSchema>
