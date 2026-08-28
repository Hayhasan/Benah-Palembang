import { z } from "zod"

export const toggleEventLikeSchema = z.object({
  eventId: z.coerce.number().int().positive("ID Event tidak valid."),
})
