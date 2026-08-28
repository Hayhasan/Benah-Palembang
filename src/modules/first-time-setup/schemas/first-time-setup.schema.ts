import { z } from "zod"

export const firstTimeSetupSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama lengkap minimal 2 karakter.")
      .max(160, "Nama lengkap maksimal 160 karakter."),
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
    confirmPassword: z
      .string()
      .min(8, "Konfirmasi password minimal 8 karakter.")
      .max(72, "Konfirmasi password maksimal 72 karakter."),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Konfirmasi password tidak cocok.",
    path: ["confirmPassword"],
  })

export type FirstTimeSetupInput = z.infer<typeof firstTimeSetupSchema>
