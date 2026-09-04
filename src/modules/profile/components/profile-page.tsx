"use client"

import { useRouter } from "next/navigation"
import {
  useCallback,
  useEffect,
  useState,
  useTransition,
} from "react"
import {
  Edit2,
  Loader2,
  MessageCircle,
  Save,
  X,
} from "lucide-react"
import { toast } from "sonner"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import {
  COUNTRIES,
  InternationalPhoneInput,
} from "@/components/dashboard/InternationalPhoneInput"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { useUnsavedChanges } from "@/context/UnsavedChangesContext"
import { DEFAULT_AVATAR, DEFAULT_BANNER } from "@/lib/constants/placeholder"
import { ArticleGallery } from "@/modules/article/components/article-gallery"

import { requestProfilePasswordResetAction } from "../actions/request-profile-password-reset"
import { updateProfileAction } from "../actions/update-profile"
import type { ProfileData, ProfileUpdateInput } from "../types/profile"

function toUpdateInput(profile: ProfileData): ProfileUpdateInput {
  return {
    name: profile.name,
    username: profile.username,
    avatarUrl: profile.avatarUrl,
    bannerUrl: profile.bannerUrl,
    bio: profile.bio,
    whatsappCountryCode: profile.whatsappCountryCode,
    whatsappNumber: profile.whatsappNumber,
    instagramUrl: profile.instagramUrl,
    xUrl: profile.xUrl,
    linkedinUrl: profile.linkedinUrl,
  }
}

function toWhatsappValue(profile: {
  whatsappCountryCode: string | null
  whatsappNumber: string | null
}) {
  if (!profile.whatsappCountryCode || !profile.whatsappNumber) return ""
  return `+${profile.whatsappCountryCode}${profile.whatsappNumber}`
}

const countryCodes = Array.from(
  new Set(COUNTRIES.map((country) => country.dialCode.replace("+", ""))),
).sort((left, right) => right.length - left.length)

function splitWhatsappValue(value: string) {
  const digits = value.replace(/\D/g, "")
  if (!digits) {
    return { whatsappCountryCode: null, whatsappNumber: null }
  }

  const countryCode = countryCodes.find((code) => digits.startsWith(code))
  if (!countryCode) {
    return { whatsappCountryCode: null, whatsappNumber: digits || null }
  }

  return {
    whatsappCountryCode: countryCode,
    whatsappNumber: digits.slice(countryCode.length) || null,
  }
}

function roleLabel(role: ProfileData["role"]) {
  if (role === "SUPERADMIN") return "SuperAdmin"
  if (role === "ADMIN") return "Admin"
  return "User"
}

function FieldError({ message }: { message?: string }) {
  return message ? <p className="text-xs text-red-300">{message}</p> : null
}

export function ProfilePage({ initialProfile }: { initialProfile: ProfileData }) {
  const router = useRouter()
  const { setIsDirty, registerSaveHandler } = useUnsavedChanges()
  const [profile, setProfile] = useState(initialProfile)
  const [draft, setDraft] = useState(() => toUpdateInput(initialProfile))
  const [whatsappValue, setWhatsappValue] = useState(() =>
    toWhatsappValue(initialProfile),
  )
  const [fieldErrors, setFieldErrors] = useState<
    Record<string, string[] | undefined>
  >({})
  const [isEditing, setIsEditing] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [isBannerUploading, setIsBannerUploading] = useState(false)
  const [isAvatarUploading, setIsAvatarUploading] = useState(false)
  const [isResetPending, startResetTransition] = useTransition()
  const isUploading = isBannerUploading || isAvatarUploading

  const updateField = useCallback(
    <Key extends keyof ProfileUpdateInput>(
      field: Key,
      value: ProfileUpdateInput[Key],
    ) => {
      setDraft((current) => ({ ...current, [field]: value }))
      setFieldErrors((current) => ({ ...current, [field]: undefined }))
      setIsDirty(true)
    },
    [setIsDirty],
  )

  const saveProfile = useCallback(async () => {
    if (isUploading) {
      toast.error("Tunggu upload gambar selesai sebelum menyimpan profil.")
      return false
    }

    setIsSaving(true)
    try {
      const result = await updateProfileAction(draft)
      if (!result.success) {
        setFieldErrors(result.fieldErrors ?? {})
        toast.error(result.message)
        return false
      }

      setProfile(result.data)
      setDraft(toUpdateInput(result.data))
      setWhatsappValue(toWhatsappValue(result.data))
      setFieldErrors({})
      setIsDirty(false)
      setIsEditing(false)
      toast.success(result.message)
      router.refresh()
      return true
    } finally {
      setIsSaving(false)
    }
  }, [draft, isUploading, router, setIsDirty])

  useEffect(() => {
    if (!isEditing) {
      registerSaveHandler(null)
      return
    }

    registerSaveHandler(saveProfile)
    return () => registerSaveHandler(null)
  }, [isEditing, registerSaveHandler, saveProfile])

  useEffect(() => {
    return () => setIsDirty(false)
  }, [setIsDirty])

  function cancelEdit() {
    if (isSaving || isUploading) return
    setDraft(toUpdateInput(profile))
    setWhatsappValue(toWhatsappValue(profile))
    setFieldErrors({})
    setIsDirty(false)
    setIsEditing(false)
  }

  function updateWhatsapp(value: string) {
    setWhatsappValue(value)
    const splitValue = splitWhatsappValue(value)
    setDraft((current) => ({ ...current, ...splitValue }))
    setFieldErrors((current) => ({
      ...current,
      whatsappCountryCode: undefined,
      whatsappNumber: undefined,
    }))
    setIsDirty(true)
  }

  function requestPasswordReset() {
    startResetTransition(async () => {
      const result = await requestProfilePasswordResetAction()
      if (result.success) toast.success(result.message)
      else toast.error(result.message)
    })
  }

  const whatsappUrl =
    draft.whatsappCountryCode && draft.whatsappNumber
      ? `https://wa.me/${draft.whatsappCountryCode}${draft.whatsappNumber}`
      : null

  return (
    <div className="space-y-8 pb-10">
      <div className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/80 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Profil & Pengaturan
          </h2>
          <p className="text-muted-foreground">
            Kelola informasi publik dan data personal Anda.
          </p>
        </div>
        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                variant="outline"
                onClick={cancelEdit}
                disabled={isSaving || isUploading}
              >
                <X className="mr-2 size-4" /> Batal Edit
              </Button>
              <Button
                onClick={() => void saveProfile()}
                disabled={isSaving || isUploading}
                className="bg-palembang-red text-white hover:bg-palembang-red/90"
              >
                {isSaving ? (
                  <Loader2 className="mr-2 size-4 animate-spin" />
                ) : (
                  <Save className="mr-2 size-4" />
                )}
                {isSaving ? "Menyimpan..." : "Simpan Profil"}
              </Button>
            </>
          ) : (
            <Button
              onClick={() => setIsEditing(true)}
              className="bg-palembang-charcoal text-white hover:bg-palembang-charcoal/90"
            >
              <Edit2 className="mr-2 size-4" /> Edit Profil
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-palembang-charcoal text-white shadow-sm">
        <ImageUpload
          value={draft.bannerUrl ?? ""}
          defaultImage={DEFAULT_BANNER}
          onChange={(url) => updateField("bannerUrl", url || null)}
          aspect={16 / 5}
          disabled={!isEditing || isSaving}
          uploadScope="profile"
          variant="profile-banner"
          alt={`Banner ${draft.name}`}
          onUploadingChange={setIsBannerUploading}
        />

        <div className="px-6 pb-8 sm:px-10">
          <div className="relative -mt-12 mb-4 flex items-end justify-between sm:-mt-16">
            <ImageUpload
              value={draft.avatarUrl ?? ""}
              defaultImage={DEFAULT_AVATAR}
              onChange={(url) => updateField("avatarUrl", url || null)}
              aspect={1}
              disabled={!isEditing || isSaving}
              uploadScope="profile"
              variant="profile-avatar"
              className="w-fit shrink-0"
              alt={draft.name}
              onUploadingChange={setIsAvatarUploading}
            />
            {!isEditing && whatsappUrl ? (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden h-10 items-center justify-center rounded-md bg-palembang-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-palembang-red/90 sm:inline-flex"
              >
                <MessageCircle className="mr-2 size-4" /> Hubungi
              </a>
            ) : null}
          </div>

          {isEditing ? (
            <div className="mt-6 animate-in space-y-5 fade-in slide-in-from-bottom-2 duration-300">
              <h3 className="border-b border-white/20 pb-2 text-lg font-semibold">
                Edit Profil
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Nama Lengkap
                  </label>
                  <Input
                    value={draft.name}
                    maxLength={160}
                    onChange={(event) => updateField("name", event.target.value)}
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                  />
                  <FieldError message={fieldErrors.name?.[0]} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Username
                  </label>
                  <div className="flex rounded-md border border-white/20 bg-white/10 focus-within:ring-2 focus-within:ring-white/30">
                    <span className="flex items-center border-r border-white/15 px-3 text-sm text-white/50">
                      @
                    </span>
                    <Input
                      value={draft.username}
                      maxLength={30}
                      onChange={(event) =>
                        updateField("username", event.target.value.toLowerCase())
                      }
                      className="border-0 bg-transparent text-white placeholder:text-white/50 focus-visible:ring-0"
                      placeholder="nama_pengguna"
                      autoCapitalize="none"
                      autoCorrect="off"
                      spellCheck={false}
                    />
                  </div>
                  <p className="text-[11px] leading-4 text-white/50">
                    Maksimal 30 karakter. Gunakan huruf, angka, titik, atau underscore; titik tidak boleh di awal, akhir, atau berurutan.
                  </p>
                  <FieldError message={fieldErrors.username?.[0]} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Email
                  </label>
                  <Input
                    value={profile.email}
                    disabled
                    className="cursor-not-allowed border-white/10 bg-white/5 text-white/50"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    WhatsApp Number
                  </label>
                  <InternationalPhoneInput
                    value={whatsappValue}
                    darkVariant
                    onChange={updateWhatsapp}
                    placeholder="812 3456 7890"
                  />
                  <FieldError
                    message={
                      fieldErrors.whatsappNumber?.[0] ??
                      fieldErrors.whatsappCountryCode?.[0]
                    }
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Instagram URL
                  </label>
                  <Input
                    type="url"
                    value={draft.instagramUrl ?? ""}
                    onChange={(event) =>
                      updateField("instagramUrl", event.target.value || null)
                    }
                    placeholder="https://instagram.com/username"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                  />
                  <FieldError message={fieldErrors.instagramUrl?.[0]} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    Twitter/X URL
                  </label>
                  <Input
                    type="url"
                    value={draft.xUrl ?? ""}
                    onChange={(event) =>
                      updateField("xUrl", event.target.value || null)
                    }
                    placeholder="https://x.com/username"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                  />
                  <FieldError message={fieldErrors.xUrl?.[0]} />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-white/80">
                    LinkedIn URL
                  </label>
                  <Input
                    type="url"
                    value={draft.linkedinUrl ?? ""}
                    onChange={(event) =>
                      updateField("linkedinUrl", event.target.value || null)
                    }
                    placeholder="https://linkedin.com/in/username"
                    className="border-white/20 bg-white/10 text-white placeholder:text-white/40 focus-visible:ring-white/30"
                  />
                  <FieldError message={fieldErrors.linkedinUrl?.[0]} />
                </div>
                <div className="space-y-2 sm:col-span-2">
                  <label className="text-sm font-medium text-white/80">
                    Bio / Deskripsi Singkat
                  </label>
                  <Textarea
                    value={draft.bio ?? ""}
                    maxLength={2000}
                    onChange={(event) =>
                      updateField("bio", event.target.value || null)
                    }
                    className="min-h-24 border-white/20 bg-white/10 text-white placeholder:text-white/50 focus-visible:ring-white/30"
                  />
                  <FieldError message={fieldErrors.bio?.[0]} />
                </div>
                <div className="space-y-2 border-t border-white/10 pt-4 sm:col-span-2">
                  <Button
                    type="button"
                    onClick={requestPasswordReset}
                    disabled={isResetPending}
                    className="h-10 w-fit border-none bg-palembang-red px-4 font-semibold text-white hover:bg-palembang-red/90"
                  >
                    {isResetPending ? (
                      <Loader2 className="mr-2 size-4 animate-spin" />
                    ) : null}
                    {isResetPending
                      ? "Mengirim Email..."
                      : "Kirim Email Reset Password"}
                  </Button>
                </div>
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <h1 className="font-display text-2xl font-bold sm:text-3xl">
                {draft.name}
              </h1>
              <p className="mt-1 text-xs font-semibold uppercase tracking-wider text-palembang-red">
                {roleLabel(profile.role)}
              </p>
              <p className="mt-1 text-sm font-medium text-white/60">
                @{draft.username}
              </p>
              <p className="mt-1 text-sm text-white/70">{profile.email}</p>
              <p className="mt-4 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-white/80">
                {draft.bio || "Belum ada bio untuk profil ini."}
              </p>

              <div className="mt-6 flex gap-4">
                {draft.instagramUrl ? (
                  <a
                    href={draft.instagramUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="Instagram"
                    className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-pink-500"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="20" x="2" y="2" rx="5" ry="5" />
                      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
                      <line x1="17.5" x2="17.51" y1="6.5" y2="6.5" />
                    </svg>
                  </a>
                ) : null}
                {draft.xUrl ? (
                  <a
                    href={draft.xUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="X"
                    className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-white"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z" />
                    </svg>
                  </a>
                ) : null}
                {draft.linkedinUrl ? (
                  <a
                    href={draft.linkedinUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="LinkedIn"
                    className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-blue-400"
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="20"
                      height="20"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                      <rect width="4" height="12" x="2" y="9" />
                      <circle cx="4" cy="4" r="2" />
                    </svg>
                  </a>
                ) : null}
                {whatsappUrl ? (
                  <a
                    href={whatsappUrl}
                    target="_blank"
                    rel="noreferrer"
                    aria-label="WhatsApp"
                    className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-green-500 sm:hidden"
                  >
                    <MessageCircle className="size-5" />
                  </a>
                ) : null}
              </div>
            </div>
          )}
        </div>
      </div>

      <ArticleGallery data={profile.articleGallery} previewMode="owner" />
    </div>
  )
}
