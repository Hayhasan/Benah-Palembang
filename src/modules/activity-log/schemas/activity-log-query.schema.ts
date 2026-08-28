import { z } from "zod"

export const activityLogListQuerySchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  q: z.string().trim().max(100).optional(),
})

export type ActivityLogListQueryInput = z.infer<typeof activityLogListQuerySchema>
