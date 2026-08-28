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
  .min(1, "URL gambar wajib diisi.")
  .max(2048, "URL gambar terlalu panjang.")
  .refine(
    (value) => /^https?:\/\//i.test(value),
    "Gambar harus menggunakan URL HTTP(S), bukan file atau blob lokal.",
  )

const actionUrlSchema = z
  .string()
  .trim()
  .min(1, "URL kontak wajib diisi.")
  .max(2048, "URL kontak terlalu panjang.")
  .refine(
    (value) => value.startsWith("mailto:") || /^https?:\/\//i.test(value),
    "Gunakan URL HTTP(S) atau mailto yang valid.",
  )

const optionalContentUrlSchema = z
  .string()
  .trim()
  .max(2048, "URL konten terlalu panjang.")
  .refine(
    (value) => value === "" || /^https?:\/\//i.test(value),
    "Gunakan URL HTTP(S) yang valid.",
  )

const editorRecordSchema = {
  id: z.number().int().positive().nullable(),
  clientKey: z.string().min(1).max(100),
}

const partnerLogoSchema = z.object({
  ...editorRecordSchema,
  name: requiredText("Nama partner", 160),
  imageUrl: imageUrlSchema,
  position: z.number().int().positive(),
  isVisible: z.boolean(),
})

const partnerContentSchema = z.object({
  ...editorRecordSchema,
  platform: z.enum(["youtube", "instagram", "tiktok", "facebook", "x"]),
  title: requiredText("Judul konten", 255),
  thumbnailUrl: imageUrlSchema,
  contentUrl: optionalContentUrlSchema,
  aspectRatio: z.enum(["9:16", "4:5", "16:9", "1:1"]),
  position: z.number().int().positive(),
  isVisible: z.boolean(),
})

export const collaborationPageEditorSchema = z
  .object({
    key: z.literal("collaboration"),
    hero: z.object({
      imageUrl: imageUrlSchema,
      imageAlt: requiredText("Alt gambar hero", 255),
      eyebrow: requiredText("Tagline hero", 160),
      title: requiredText("Judul hero", 255),
      description: requiredText("Deskripsi hero", 5000),
    }),
    contact: z.object({
      email: z
        .string()
        .trim()
        .email("Email kolaborasi tidak valid.")
        .max(255, "Email kolaborasi terlalu panjang."),
      phone: requiredText("Nomor WhatsApp", 50),
      emailUrl: actionUrlSchema,
      whatsappUrl: actionUrlSchema,
    }),
    form: z.object({
      title: requiredText("Judul form", 255),
      description: requiredText("Deskripsi form", 5000),
    }),
    partnerLogos: z.array(partnerLogoSchema).max(50),
    partnerContents: z.array(partnerContentSchema).max(100),
  })
  .superRefine((data, context) => {
    const collections = [
      ["partnerLogos", data.partnerLogos],
      ["partnerContents", data.partnerContents],
    ] as const

    for (const [field, records] of collections) {
      const ids = records.flatMap((record) =>
        record.id === null ? [] : [record.id],
      )

      if (new Set(ids).size !== ids.length) {
        context.addIssue({
          code: "custom",
          message: "Terdapat ID record yang dikirim lebih dari sekali.",
          path: [field],
        })
      }
    }
  })
