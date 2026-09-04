import { createImageUploadSignature } from "./actions"

export type ImageUploadScope =
  | "article"
  | "event"
  | "website-content"
  | "profile"

interface CloudinaryUploadResponse {
  secure_url?: string
  error?: {
    message?: string
  }
}

export const MAX_IMAGE_UPLOAD_SIZE = 10 * 1024 * 1024

export const ALLOWED_IMAGE_UPLOAD_TYPES = new Set([
  "image/avif",
  "image/gif",
  "image/jpeg",
  "image/png",
  "image/svg+xml",
  "image/webp",
])

const UPLOAD_TIMEOUT_MS = 120_000
const NETWORK_RETRY_DELAY_MS = 1_500

const GENERIC_UPLOAD_ERROR =
  "Gambar gagal diunggah. Silakan coba lagi beberapa saat lagi."

/**
 * Error upload yang pesannya sudah aman untuk ditampilkan langsung ke pengguna.
 * `detail` menyimpan pesan teknis aslinya supaya tetap terbaca di console/QA.
 */
export class ImageUploadError extends Error {
  readonly detail?: string

  constructor(message: string, detail?: string) {
    super(message)
    this.name = "ImageUploadError"
    this.detail = detail
  }
}

export function formatFileSize(bytes: number) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1).replace(".", ",")} MB`
}

/** Pesan siap tampil untuk error apa pun yang keluar dari proses upload. */
export function getImageUploadErrorMessage(error: unknown) {
  if (error instanceof ImageUploadError) return error.message
  if (isNetworkError(error)) return networkErrorMessage()
  if (error instanceof Error && error.message) return error.message
  return GENERIC_UPLOAD_ERROR
}

function isNetworkError(error: unknown) {
  // fetch() melempar TypeError untuk kegagalan level jaringan:
  // koneksi putus, request diblokir extension/firewall, atau server menutup koneksi.
  return error instanceof TypeError
}

function isAbortError(error: unknown) {
  return (
    error instanceof DOMException &&
    (error.name === "AbortError" || error.name === "TimeoutError")
  )
}

function networkErrorMessage() {
  const offline =
    typeof navigator !== "undefined" && navigator.onLine === false

  return offline
    ? "Tidak ada koneksi internet. Periksa jaringan Anda lalu unggah ulang gambar."
    : "Koneksi ke server gambar terputus. Periksa jaringan Anda (atau matikan sementara VPN/ad-blocker) lalu unggah ulang."
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms))
}

export function validateImageUpload(file: File) {
  if (file.size === 0) {
    return "File gambar kosong atau rusak. Coba pilih file lain."
  }

  if (!file.type.startsWith("image/")) {
    return "File yang dipilih bukan gambar. Gunakan file JPG, PNG, WEBP, AVIF, GIF, atau SVG."
  }

  if (!ALLOWED_IMAGE_UPLOAD_TYPES.has(file.type)) {
    return "Format gambar harus JPG, PNG, WEBP, AVIF, GIF, atau SVG."
  }

  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    return `Ukuran gambar ${formatFileSize(file.size)} melebihi batas 10 MB. Kompres atau perkecil resolusinya lalu coba lagi.`
  }

  return null
}

/**
 * Menerjemahkan respons gagal dari Cloudinary menjadi pesan berbahasa Indonesia.
 * Cloudinary mengirim pesan teknis berbahasa Inggris yang tidak ramah pengguna.
 */
function mapCloudinaryError(status: number, rawMessage: string) {
  const message = rawMessage.toLowerCase()

  if (
    status === 413 ||
    message.includes("file size too large") ||
    message.includes("maximum is")
  ) {
    return "Ukuran gambar terlalu besar untuk diunggah. Kompres atau perkecil resolusinya lalu coba lagi."
  }

  if (
    message.includes("invalid image file") ||
    message.includes("unsupported") ||
    message.includes("invalid extension") ||
    message.includes("empty file")
  ) {
    return "File gambar tidak dapat diproses. Kemungkinan file rusak atau formatnya tidak didukung."
  }

  if (
    message.includes("stale request") ||
    message.includes("invalid signature") ||
    message.includes("expired")
  ) {
    return "Sesi upload gambar sudah kedaluwarsa. Silakan unggah ulang gambarnya."
  }

  if (status === 420 || status === 429 || message.includes("rate limit")) {
    return "Terlalu banyak upload dalam waktu singkat. Tunggu sebentar lalu coba lagi."
  }

  if (message.includes("usage limit") || message.includes("quota")) {
    return "Kuota penyimpanan gambar sudah habis. Hubungi admin untuk menaikkan kuota Cloudinary."
  }

  if (status === 401 || status === 403) {
    return "Akses ke server gambar ditolak. Hubungi admin untuk memeriksa konfigurasi Cloudinary."
  }

  if (status >= 500) {
    return "Server gambar sedang bermasalah. Silakan coba lagi beberapa saat lagi."
  }

  return GENERIC_UPLOAD_ERROR
}

async function postToCloudinary(cloudName: string, formData: FormData) {
  let response: Response

  try {
    response = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: "POST",
        body: formData,
        signal: AbortSignal.timeout(UPLOAD_TIMEOUT_MS),
      },
    )
  } catch (error) {
    if (isAbortError(error)) {
      throw new ImageUploadError(
        "Upload gambar terlalu lama dan dihentikan. Coba gunakan gambar yang lebih kecil atau jaringan yang lebih stabil.",
        error instanceof Error ? error.message : undefined,
      )
    }

    // Dilempar ulang apa adanya supaya pemanggil bisa memutuskan untuk retry.
    throw error
  }

  let result: CloudinaryUploadResponse = {}
  try {
    result = (await response.json()) as CloudinaryUploadResponse
  } catch {
    // Respons non-JSON (mis. halaman error dari proxy/CDN) — cukup andalkan status.
  }

  if (!response.ok || !result.secure_url) {
    const rawMessage =
      result.error?.message ?? `HTTP ${response.status} ${response.statusText}`

    console.error("Cloudinary upload rejected:", {
      status: response.status,
      message: rawMessage,
    })

    throw new ImageUploadError(
      mapCloudinaryError(response.status, rawMessage),
      rawMessage,
    )
  }

  return result.secure_url
}

export async function uploadImageToCloudinary(
  file: Blob,
  filename: string,
  uploadScope: ImageUploadScope,
) {
  if (file.size === 0) {
    throw new ImageUploadError(
      "File gambar kosong atau rusak. Coba pilih file lain.",
    )
  }

  if (file.size > MAX_IMAGE_UPLOAD_SIZE) {
    throw new ImageUploadError(
      `Ukuran gambar ${formatFileSize(file.size)} melebihi batas 10 MB. Kompres atau perkecil resolusinya lalu coba lagi.`,
    )
  }

  let signatureResult: Awaited<ReturnType<typeof createImageUploadSignature>>
  try {
    signatureResult = await createImageUploadSignature(uploadScope)
  } catch (error) {
    if (isNetworkError(error)) {
      throw new ImageUploadError(
        networkErrorMessage(),
        error instanceof Error ? error.message : undefined,
      )
    }
    throw new ImageUploadError(
      "Gagal menyiapkan upload gambar. Silakan muat ulang halaman lalu coba lagi.",
      error instanceof Error ? error.message : undefined,
    )
  }

  if (!signatureResult.success) {
    throw new ImageUploadError(
      "Gagal menyiapkan upload gambar. Silakan muat ulang halaman lalu coba lagi.",
      signatureResult.message,
    )
  }

  const { apiKey, cloudName, folder, signature, timestamp } =
    signatureResult.data

  const buildFormData = () => {
    const formData = new FormData()
    formData.append("file", file, filename)
    formData.append("api_key", apiKey)
    formData.append("folder", folder)
    formData.append("signature", signature)
    formData.append("timestamp", String(timestamp))
    return formData
  }

  try {
    return await postToCloudinary(cloudName, buildFormData())
  } catch (error) {
    if (!isNetworkError(error)) throw error

    // Kegagalan jaringan sering kali bersifat sesaat, jadi dicoba sekali lagi
    // sebelum menyerah dan menampilkan pesan ke pengguna.
    console.warn("Cloudinary upload gagal karena jaringan, mencoba ulang:", {
      size: file.size,
      type: file.type,
    })
    await delay(NETWORK_RETRY_DELAY_MS)

    try {
      return await postToCloudinary(cloudName, buildFormData())
    } catch (retryError) {
      if (isNetworkError(retryError)) {
        throw new ImageUploadError(
          networkErrorMessage(),
          retryError instanceof Error ? retryError.message : undefined,
        )
      }
      throw retryError
    }
  }
}
