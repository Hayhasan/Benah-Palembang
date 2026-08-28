import { z } from "zod"

export const overviewQuerySchema = z.object({
  period: z.enum(["daily", "weekly", "monthly"]).default("monthly"),
  month: z.string().optional(),
})

export type OverviewQueryInput = z.infer<typeof overviewQuerySchema>
