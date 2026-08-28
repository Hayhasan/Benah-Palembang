import { z } from "zod"

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`)

const httpsUrl = (label: string) =>
  z
    .string()
    .trim()
    .max(2048, `${label} maksimal 2.048 karakter.`)
    .url(`Format ${label.toLowerCase()} tidak valid.`)
    .refine((value) => value.startsWith("https://"), {
      message: `${label} wajib menggunakan HTTPS.`,
    })

const optionalHttpsUrl = (label: string) =>
  z.preprocess(
    (value) =>
      typeof value === "string" && value.trim() === "" ? null : value,
    z.union([z.null(), httpsUrl(label)]),
  )

export const eventListQuerySchema = z.object({
  q: z.string().trim().max(255).catch(""),
  page: z.coerce.number().int().positive().catch(1),
})

export const eventIdSchema = z.object({
  id: z.coerce.number().int().positive("ID Event tidak valid."),
})

export const eventEditorSchema = z.object({
  id: z.coerce.number().int().positive().optional(),
  intent: z.enum(["SAVE", "POST"]),
  title: requiredText("Judul Event", 255),
  description: requiredText("Deskripsi", 5000),
  content: requiredText("Detail Event", 100_000),
  bannerUrl: httpsUrl("Banner Event"),
  category: requiredText("Kategori", 100),
  startsOn: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Tanggal Event tidak valid."),
  startsTime: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Waktu Event tidak valid."),
  location: requiredText("Lokasi", 255),
  organizer: requiredText("Penyelenggara", 255),
  registrationUrl: optionalHttpsUrl("Tautan pendaftaran"),
  tags: z
    .array(requiredText("Tag", 80))
    .max(12, "Tag maksimal 12 item.")
    .transform((tags) => [...new Set(tags)]),
})
