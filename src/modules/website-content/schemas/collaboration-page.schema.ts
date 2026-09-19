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

const collaborationHeroSlideSchema = z.object({
  ...editorRecordSchema,
  imageUrl: imageUrlSchema,
  imageAlt: requiredText("Alt gambar hero", 255),
  title: requiredText("Judul hero", 255),
  description: requiredText("Deskripsi hero", 5000),
  position: z.number().int().positive(),
  isVisible: z.boolean(),
})

const partnerLogoSchema = z.object({
  ...editorRecordSchema,
  name: requiredText("Nama partner", 160),
  imageUrl: imageUrlSchema,
  position: z.number().int().positive(),
  isVisible: z.boolean(),
})



export const collaborationPageEditorSchema = z
  .object({
    key: z.literal("collaboration"),
    heroSlides: z.array(collaborationHeroSlideSchema).min(1, "Minimal 1 banner.").max(10, "Maksimal 10 banner."),
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
    partnerLogos: z.array(partnerLogoSchema).max(50),
  })
  .superRefine((data, context) => {
    const collections = [
      ["heroSlides", data.heroSlides],
      ["partnerLogos", data.partnerLogos],
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
