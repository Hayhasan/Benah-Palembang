import { z } from "zod"

function emptyStringToNull(value: unknown) {
  if (typeof value !== "string") return value
  const normalized = value.trim()
  return normalized === "" ? null : normalized
}

const nullableHttpsUrlSchema = z.preprocess(
  emptyStringToNull,
  z.union([
    z.null(),
    z
      .string()
      .max(2048, "URL maksimal 2.048 karakter.")
      .url("Format URL tidak valid.")
      .refine((value) => value.startsWith("https://"), {
        message: "URL wajib menggunakan HTTPS.",
      }),
  ]),
)

const nullableBioSchema = z.preprocess(
  emptyStringToNull,
  z.union([
    z.null(),
    z.string().max(2000, "Bio maksimal 2.000 karakter."),
  ]),
)

const nullableCountryCodeSchema = z.preprocess(
  emptyStringToNull,
  z.union([
    z.null(),
    z
      .string()
      .regex(/^\d{1,7}$/, "Country code WhatsApp tidak valid."),
  ]),
)

const nullableWhatsappNumberSchema = z.preprocess(
  emptyStringToNull,
  z.union([
    z.null(),
    z
      .string()
      .regex(/^\d{5,32}$/, "Nomor WhatsApp tidak valid.")
      .refine((value) => !value.startsWith("0"), {
        message: "Nomor WhatsApp disimpan tanpa awalan 0.",
      }),
  ]),
)

export const updateProfileSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Nama minimal 2 karakter.")
      .max(160, "Nama maksimal 160 karakter."),
    avatarUrl: nullableHttpsUrlSchema,
    bannerUrl: nullableHttpsUrlSchema,
    bio: nullableBioSchema,
    whatsappCountryCode: nullableCountryCodeSchema,
    whatsappNumber: nullableWhatsappNumberSchema,
    instagramUrl: nullableHttpsUrlSchema,
    xUrl: nullableHttpsUrlSchema,
    linkedinUrl: nullableHttpsUrlSchema,
  })
  .superRefine((data, context) => {
    const hasCountryCode = data.whatsappCountryCode !== null
    const hasNumber = data.whatsappNumber !== null

    if (hasCountryCode === hasNumber) return

    context.addIssue({
      code: "custom",
      message: "Country code dan nomor WhatsApp harus diisi bersamaan.",
      path: hasCountryCode ? ["whatsappNumber"] : ["whatsappCountryCode"],
    })
  })
