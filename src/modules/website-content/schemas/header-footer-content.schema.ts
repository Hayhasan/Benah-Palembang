import { z } from "zod"

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`)

const optionalText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .max(max, `${label} maksimal ${max} karakter.`)

const linkUrlSchema = z
  .string()
  .trim()
  .min(1, "URL tujuan wajib diisi.")
  .max(2048, "URL tujuan terlalu panjang.")
  .refine(
    (value) =>
      value.startsWith("/") ||
      value.startsWith("#") ||
      value.startsWith("mailto:") ||
      /^https?:\/\//i.test(value),
    "Gunakan path internal, anchor, mailto, atau URL HTTP(S) yang valid.",
  )

const imageUrlSchema = z
  .string()
  .trim()
  .min(1, "URL logo wajib diisi.")
  .max(2048, "URL logo terlalu panjang.")
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    "Logo harus menggunakan path internal atau URL HTTP(S).",
  )

const editorRecordSchema = {
  id: z.number().int().positive().nullable(),
  clientKey: z.string().min(1).max(100),
}

const footerLinkSchema = z.object({
  ...editorRecordSchema,
  label: requiredText("Nama link", 160),
  linkUrl: linkUrlSchema,
  position: z.number().int().positive(),
  isVisible: z.boolean(),
})

export const headerFooterContentEditorSchema = z
  .object({
    key: z.literal("header-footer"),
    logo: z.object({
      imageUrl: imageUrlSchema,
      imageAlt: requiredText("Alt logo", 255),
      linkUrl: linkUrlSchema,
    }),
    footer: z.object({
      description: requiredText("Deskripsi footer", 5000),
      exploreDescription: optionalText("Deskripsi Explore", 5000),
      contactEmail: z
        .string()
        .trim()
        .email("Email kontak tidak valid.")
        .max(255, "Email kontak terlalu panjang."),
      contactPhone: requiredText("Nomor HP / WhatsApp", 50),
      contactAddress: requiredText("Alamat", 255),
      copyrightText: requiredText("Copyright", 255),
      closingText: requiredText("Teks penutup", 255),
      exploreLinks: z.array(footerLinkSchema).max(30),
      connectLinks: z.array(footerLinkSchema).max(30),
    }),
  })
  .superRefine((data, context) => {
    const collections = [
      ["footer.exploreLinks", data.footer.exploreLinks],
      ["footer.connectLinks", data.footer.connectLinks],
    ] as const

    for (const [field, records] of collections) {
      const ids = records.flatMap((record) =>
        record.id === null ? [] : [record.id],
      )

      if (new Set(ids).size !== ids.length) {
        context.addIssue({
          code: "custom",
          message: "Terdapat ID record yang dikirim lebih dari sekali.",
          path: field.split("."),
        })
      }
    }
  })
