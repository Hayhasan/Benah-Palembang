import { z } from "zod"

const normalizedEmailSchema = z
  .string()
  .trim()
  .toLowerCase()
  .email("Format email tidak valid.")
  .max(255, "Email maksimal 255 karakter.")

export const loginSchema = z.object({
  email: normalizedEmailSchema,
  password: z
    .string()
    .min(1, "Password wajib diisi.")
    .max(72, "Password maksimal 72 karakter."),
})

export const registerSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter.")
      .max(160, "Nama maksimal 160 karakter."),
    email: normalizedEmailSchema,
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(72, "Password maksimal 72 karakter."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  })

export const forgotPasswordSchema = z.object({
  email: normalizedEmailSchema,
})

export const passwordResetTokenSchema = z
  .string()
  .regex(/^[A-Za-z0-9_-]{43}$/, "Token reset password tidak valid.")

export const resetPasswordSchema = z
  .object({
    token: passwordResetTokenSchema,
    password: z
      .string()
      .min(8, "Password minimal 8 karakter.")
      .max(72, "Password maksimal 72 karakter."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Password dan konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  })

export const passwordResetRecordSchema = z.object({
  userId: z.string().uuid(),
  tokenHash: z.string().regex(/^[a-f0-9]{64}$/),
  createdAt: z.string().datetime(),
  expiresAt: z.string().datetime(),
})
