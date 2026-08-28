import { z } from "zod"

export const registerEventParticipantSchema = z.object({
  eventId: z.number().int().positive("ID Event harus berupa angka positif."),
})

export type RegisterEventParticipantInput = z.infer<
  typeof registerEventParticipantSchema
>
