import { z } from "zod"

export const authRoleSchema = z.enum(["USER", "ADMIN", "SUPERADMIN"])

export const authSessionRecordSchema = z.object({
  userId: z.string().uuid(),
  role: authRoleSchema,
  version: z.number().int().positive(),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
})
