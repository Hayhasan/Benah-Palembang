import { z } from "zod"

export const accountRouteRoleSchema = z.enum(["user", "admin"])

export const accountListQuerySchema = z.object({
  q: z.string().trim().max(255).catch(""),
  page: z.coerce.number().int().positive().catch(1),
})

export const createAccountSchema = z
  .object({
    routeRole: accountRouteRoleSchema,
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter.")
      .max(160, "Nama maksimal 160 karakter."),
    email: z
      .string()
      .trim()
      .toLowerCase()
      .email("Format email tidak valid.")
      .max(255, "Email maksimal 255 karakter."),
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(72, "Password maksimal 72 karakter."),
    confirmPassword: z.string(),
    role: z.enum(["USER", "ADMIN", "SUPERADMIN"]),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  })

export const accountMutationSchema = z.object({
  id: z.string().uuid("ID account tidak valid."),
  routeRole: accountRouteRoleSchema,
})

export const setAccountBanStatusSchema = accountMutationSchema.extend({
  isBanned: z.boolean(),
})

export const changeAccountRoleSchema = accountMutationSchema.extend({
  targetRole: z.enum(["USER", "ADMIN"]),
})
