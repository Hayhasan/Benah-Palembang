import { z } from "zod"

const LANDING_ARTICLE_SECTION_KEYS = [
  "featured",
  "gaya-hidup",
  "ruang-kota",
  "industri-kreatif",
  "kebudayaan",
] as const

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
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
    "Gunakan path internal (/halaman) atau URL HTTP(S) yang valid.",
  )

const imageUrlSchema = z
  .string()
  .trim()
  .min(1, "URL gambar wajib diisi.")
  .max(2048, "URL gambar terlalu panjang.")
  .refine(
    (value) => /^https?:\/\//i.test(value),
    "Gambar harus menggunakan URL HTTP(S), bukan file atau blob lokal.",
  )

const editorRecordSchema = {
  id: z.number().int().positive().nullable(),
  clientKey: z.string().min(1).max(100),
}

const heroSlideSchema = z.object({
  ...editorRecordSchema,
  imageUrl: imageUrlSchema,
  imageAlt: requiredText("Alt gambar", 255),
  eyebrow: requiredText("Eyebrow hero", 160),
  title: requiredText("Judul hero", 255),
  description: requiredText("Deskripsi hero", 5000),
  buttonLabel: requiredText("Label tombol hero", 100),
  buttonUrl: linkUrlSchema,
  position: z.number().int().positive(),
  isVisible: z.boolean(),
})

const exploreItemSchema = z.object({
  ...editorRecordSchema,
  label: requiredText("Label jelajahi", 160),
  linkUrl: linkUrlSchema,
  storyCount: z.number().int().min(0).nullable(),
  position: z.number().int().positive(),
  isVisible: z.boolean(),
})

const articleSectionSchema = z.object({
  ...editorRecordSchema,
  sectionKey: requiredText("Section key", 160),
  articleCategorySlug: z
    .string()
    .trim()
    .max(160)
    .transform((value) => value || null)
    .nullable(),
  eyebrow: requiredText("Eyebrow section", 160),
  title: requiredText("Judul section", 255),
  description: requiredText("Deskripsi section", 5000),
  backgroundImageUrl: imageUrlSchema,
  linkLabel: requiredText("Label link section", 100),
  linkUrl: linkUrlSchema,
  theme: z.enum(["DEFAULT", "RED", "OFF_WHITE", "DARK"]),
  layout: z.enum(["STANDARD", "FEATURED_FIRST"]),
  maxItems: z.number().int().min(1).max(12),
  position: z.number().int().positive(),
  isVisible: z.boolean(),
})

const teamMemberSchema = z.object({
  ...editorRecordSchema,
  name: requiredText("Nama anggota", 160),
  role: requiredText("Jabatan anggota", 160),
  imageUrl: imageUrlSchema,
  bio: requiredText("Bio anggota", 5000),
  position: z.number().int().positive(),
  isVisible: z.boolean(),
})

export const landingPageEditorSchema = z
  .object({
    key: z.literal("home"),
    heroSlides: z.array(heroSlideSchema).min(1).max(20),
    about: z.object({
      eyebrow: requiredText("Eyebrow about", 160),
      establishedText: requiredText("Teks established", 160),
      title: requiredText("Judul about", 255),
      description: requiredText("Deskripsi about", 5000),
      closingText: requiredText("Teks penutup about", 255),
    }),
    explore: z.object({
      eyebrow: requiredText("Eyebrow jelajahi", 160),
      title: requiredText("Judul jelajahi", 255),
      items: z.array(exploreItemSchema).max(20),
    }),
    articleSections: z
      .array(articleSectionSchema)
      .length(5, "Landing page harus memiliki tepat 5 section artikel."),
    team: z.object({
      eyebrow: requiredText("Eyebrow tim", 160),
      title: requiredText("Judul tim", 255),
      description: requiredText("Deskripsi tim", 5000),
      members: z.array(teamMemberSchema).max(30),
    }),
    cta: z.object({
      eyebrow: requiredText("Eyebrow CTA", 160),
      title: requiredText("Judul CTA", 255),
      description: requiredText("Deskripsi CTA", 5000),
      buttonLabel: requiredText("Label tombol CTA", 100),
      buttonUrl: linkUrlSchema,
    }),
  })
  .superRefine((data, context) => {
    const collections = [
      ["heroSlides", data.heroSlides],
      ["explore.items", data.explore.items],
      ["articleSections", data.articleSections],
      ["team.members", data.team.members],
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

    const sectionKeys = data.articleSections.map((section) => section.sectionKey)
    if (new Set(sectionKeys).size !== sectionKeys.length) {
      context.addIssue({
        code: "custom",
        message: "Section key artikel harus unik.",
        path: ["articleSections"],
      })
    }

    LANDING_ARTICLE_SECTION_KEYS.forEach((sectionKey, index) => {
      if (data.articleSections[index]?.sectionKey !== sectionKey) {
        context.addIssue({
          code: "custom",
          message: "Section artikel dan urutannya tidak dapat diubah.",
          path: ["articleSections", index, "sectionKey"],
        })
      }
    })
  })
