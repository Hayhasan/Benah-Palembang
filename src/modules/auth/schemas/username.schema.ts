import { z } from "zod"

export const USERNAME_MAX_LENGTH = 30

export function normalizeUsername(value: string) {
  return value.trim().toLowerCase()
}

export function usernameFromName(value: string) {
  const normalized = value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "")
    .slice(0, USERNAME_MAX_LENGTH)

  return normalized || "user"
}

export const usernameSchema = z
  .string()
  .trim()
  .min(1, "Username wajib diisi.")
  .max(USERNAME_MAX_LENGTH, "Username maksimal 30 karakter.")
  .transform((value) => value.toLowerCase())
  .refine((value) => /^[a-z0-9._]+$/.test(value), {
    message: "Username hanya boleh berisi huruf, angka, titik, dan underscore.",
  })
  .refine((value) => !value.startsWith(".") && !value.endsWith("."), {
    message: "Titik tidak boleh berada di awal atau akhir username.",
  })
  .refine((value) => !value.includes(".."), {
    message: "Titik tidak boleh digunakan secara berurutan.",
  })
