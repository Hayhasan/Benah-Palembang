import { z } from "zod"

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`)

const imageUrlSchema = z
  .string()
  .trim()
  .min(1, "Background agenda wajib diisi.")
  .max(2048, "URL background agenda terlalu panjang.")
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    "Background agenda harus menggunakan path internal atau URL HTTP(S).",
  )

export const agendaPageEditorSchema = z.object({
  key: z.literal("agenda"),
  hero: z.object({
    imageUrl: imageUrlSchema,
    imageAlt: requiredText("Alt background", 255),
    eyebrow: requiredText("Eyebrow", 160),
    title: requiredText("Judul halaman", 255),
    description: requiredText("Deskripsi", 5000),
  }),
})
