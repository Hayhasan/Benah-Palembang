import { z } from "zod"
const optionalContentUrlSchema = z
  .string()
  .trim()
  .max(2048, "URL terlalu panjang.")
  .refine(
    (value) => value === "" || /^https?:\/\//i.test(value),
    "URL harus diawali dengan http:// atau https://",
  )

export const collaborationContentEditorSchema = z.object({
  id: z.number().nullable(),
  title: z.string().trim().max(255, "Judul terlalu panjang.").optional(),
  platform: z.enum(["youtube", "instagram", "tiktok", "facebook", "x"]),
  contentUrl: optionalContentUrlSchema.refine(
    (value: string) => value.length > 0,
    "URL konten wajib diisi.",
  ),
  isVisible: z.boolean(),
})

export type CollaborationContentEditorData = z.infer<
  typeof collaborationContentEditorSchema
>
