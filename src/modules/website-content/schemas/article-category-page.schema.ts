import { z } from "zod"

import { ARTICLE_CATEGORY_SECTION_KEYS } from "../constants/default-article-category-pages"

const requiredText = (label: string, max: number) =>
  z
    .string()
    .trim()
    .min(1, `${label} wajib diisi.`)
    .max(max, `${label} maksimal ${max} karakter.`)

const imageUrlSchema = z
  .string()
  .trim()
  .min(1, "Background kategori wajib diisi.")
  .max(2048, "URL background kategori terlalu panjang.")
  .refine(
    (value) => value.startsWith("/") || /^https?:\/\//i.test(value),
    "Background kategori harus menggunakan path internal atau URL HTTP(S).",
  )

const categorySchema = z.object({
  id: z.number().int().positive().nullable(),
  clientKey: z.string().min(1).max(100),
  sectionKey: z.string().min(1).max(160),
  hero: z.object({
    imageUrl: imageUrlSchema,
    imageAlt: requiredText("Alt background kategori", 255),
    title: requiredText("Judul halaman kategori", 255),
    description: requiredText("Deskripsi halaman kategori", 5000),
  }),
})

export const articleCategoryPagesEditorSchema = z
  .object({
    key: z.literal("home"),
    categories: z
      .array(categorySchema)
      .length(5, "Article harus memiliki tepat 5 halaman kategori."),
  })
  .superRefine((data, context) => {
    const ids = data.categories.flatMap((category) =>
      category.id === null ? [] : [category.id],
    )
    if (new Set(ids).size !== ids.length) {
      context.addIssue({
        code: "custom",
        message: "Terdapat ID kategori yang dikirim lebih dari sekali.",
        path: ["categories"],
      })
    }

    ARTICLE_CATEGORY_SECTION_KEYS.forEach((sectionKey, index) => {
      if (data.categories[index]?.sectionKey !== sectionKey) {
        context.addIssue({
          code: "custom",
          message: "Kategori artikel dan urutannya tidak dapat diubah.",
          path: ["categories", index, "sectionKey"],
        })
      }
    })
  })
