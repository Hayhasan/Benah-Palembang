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

export type ModerationPayload = z.infer<typeof moderationPayloadSchema>
