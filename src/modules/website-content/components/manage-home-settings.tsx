"use client"

import { ChevronDown, ChevronUp, GripVertical, Plus, Trash2 } from "lucide-react"
import { useState, type ReactNode } from "react"
import { toast } from "sonner"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { LandingPageEditorData } from "../types/landing-page-editor"

/* ── Shared Primitives ─────────────────────────────────────────────── */

function SectionCard({
  title,
  desc,
  children,
  defaultExpanded = false,
}: {
  title: string
  desc?: string
  children: ReactNode
  defaultExpanded?: boolean
}) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded)

  return (
    <div className="overflow-visible rounded-xl border bg-background shadow-sm">
      <div
        className={`flex cursor-pointer items-center justify-between bg-muted/30 p-4 transition-colors hover:bg-muted/50 ${
          isExpanded ? "rounded-t-xl border-b" : "rounded-xl"
        }`}
        onClick={() => setIsExpanded((current) => !current)}
      >
        <div>
          <h3 className="font-display text-lg font-semibold">{title}</h3>
          {desc ? (
            <p className="mt-1 text-xs text-muted-foreground">{desc}</p>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          className="pointer-events-none shrink-0"
        >
          {isExpanded ? (
            <ChevronUp className="size-4" />
          ) : (
            <ChevronDown className="size-4" />
          )}
        </Button>
      </div>
      {isExpanded ? <div className="space-y-5 p-6">{children}</div> : null}
    </div>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="space-y-2 block">
      <span className="text-sm font-medium block">{label}</span>
      {children}
    </label>
  )
}

function Textarea({
  value,
  onChange,
  placeholder,
}: {
  value: string
  onChange: (value: string) => void
  placeholder?: string
}) {
  return (
    <textarea
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="min-h-[80px] w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
    />
  )
}

function newClientKey(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

/* ── Main Component ────────────────────────────────────────────────── */

export function ManageHomeSettings({
  data,
  onChange,
}: {
  data: LandingPageEditorData
  onChange: (
    updater: (current: LandingPageEditorData) => LandingPageEditorData,
  ) => void
}) {
  const MAX_HEROES = 12
  const MAX_TEAM = 12

  const [draggedTeamIndex, setDraggedTeamIndex] = useState<number | null>(null)

  /* ── Heroes ────────────────────────────────────────────────────── */

  const addHeroSlide = () => {
    if (data.heroSlides.length >= MAX_HEROES) {
      toast.error(`Maksimal ${MAX_HEROES} hero slides.`)
      return
    }

    onChange((current) => ({
      ...current,
      heroSlides: [
        ...current.heroSlides,
        {
          id: null,
          clientKey: newClientKey("hero"),
          imageUrl: "",
          imageAlt: "Hero image",
          eyebrow: "",
          title: "",
          description: "",
          buttonLabel: "Read More",
          buttonUrl: "/",
          position: current.heroSlides.length + 1,
          isVisible: true,
        },
      ],
    }))
  }

  const removeHeroSlide = (clientKey: string) => {
    if (data.heroSlides.length <= 1) {
      toast.error("Minimal 1 hero slide.")
      return
    }

    onChange((current) => ({
      ...current,
      heroSlides: current.heroSlides
        .filter((slide) => slide.clientKey !== clientKey)
        .map((slide, index) => ({ ...slide, position: index + 1 })),
    }))
  }

  const updateHeroSlide = (
    clientKey: string,
    values: Partial<LandingPageEditorData["heroSlides"][number]>,
  ) => {
    onChange((current) => ({
      ...current,
      heroSlides: current.heroSlides.map((slide) =>
        slide.clientKey === clientKey ? { ...slide, ...values } : slide,
      ),
    }))
  }

  /* ── Team Members ──────────────────────────────────────────────── */

  const addTeamMember = () => {
    if (data.team.members.length >= MAX_TEAM) {
      toast.error(`Maksimal ${MAX_TEAM} anggota tim.`)
      return
    }

    onChange((current) => ({
      ...current,
      team: {
        ...current.team,
        members: [
          ...current.team.members,
          {
            id: null,
            clientKey: newClientKey("team"),
            name: "",
            role: "",
            imageUrl: "",
            bio: "",
            position: current.team.members.length + 1,
            isVisible: true,
          },
        ],
      },
    }))
  }

  const removeTeamMember = (clientKey: string) => {
    if (data.team.members.length <= 1) {
      toast.error("Minimal 1 anggota tim.")
      return
    }

    onChange((current) => ({
      ...current,
      team: {
        ...current.team,
        members: current.team.members
          .filter((member) => member.clientKey !== clientKey)
          .map((member, index) => ({ ...member, position: index + 1 })),
      },
    }))
  }

  const updateTeamMember = (
    clientKey: string,
    values: Partial<LandingPageEditorData["team"]["members"][number]>,
  ) => {
    onChange((current) => ({
      ...current,
      team: {
        ...current.team,
        members: current.team.members.map((member) =>
          member.clientKey === clientKey ? { ...member, ...values } : member,
        ),
      },
    }))
  }

  return (
    <div className="space-y-6">
      {/* ── Section 1: Heroes ──────────────────────────────────────── */}
      <SectionCard
        title="Section Heroes"
        desc={`Carousel gambar utama di halaman Home. Maks. ${MAX_HEROES} slide.`}
        defaultExpanded
      >
        <div className="space-y-6">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3 items-start">
            {data.heroSlides.map((slide, slideIndex) => (
              <div
                key={slide.clientKey}
                className="relative flex flex-col justify-between space-y-4 rounded-lg border bg-muted/10 p-4 shadow-sm"
              >
                <div>
                  {/* Header: Index + Delete */}
                  <div className="flex items-center justify-between pb-3 border-b">
                    <span className="text-sm font-semibold text-muted-foreground">
                      Hero #{slideIndex + 1}
                    </span>
                    {slideIndex > 0 && (
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                          >
                            <Trash2 className="size-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Hero ini?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tindakan ini tidak dapat dibatalkan. Hero ini akan dihapus dari halaman Home.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => removeHeroSlide(slide.clientKey)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Ya, hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    )}
                  </div>

                  <div className="mt-4 space-y-4">
                    {/* Image Upload */}
                    <Field label="Gambar Hero">
                      <ImageUpload
                        value={slide.imageUrl}
                        onChange={(url) =>
                          updateHeroSlide(slide.clientKey, { imageUrl: url })
                        }
                        placeholder="Upload gambar hero..."
                        aspect={16 / 9}
                        uploadScope="website-content"
                      />
                    </Field>

                    {/* Label (Eyebrow) */}
                    <Field label="Label">
                      <Input
                        value={slide.eyebrow}
                        onChange={(e) =>
                          updateHeroSlide(slide.clientKey, { eyebrow: e.target.value })
                        }
                        placeholder="Contoh: Cerita Kota"
                        maxLength={160}
                      />
                    </Field>

                    {/* Title */}
                    <Field label="Title">
                      <Input
                        value={slide.title}
                        onChange={(e) =>
                          updateHeroSlide(slide.clientKey, { title: e.target.value })
                        }
                        placeholder="Contoh: Merekam Palembang Di Setiap Sudutnya"
                        maxLength={255}
                      />
                    </Field>

                    {/* Deskripsi */}
                    <Field label="Deskripsi">
                      <Textarea
                        value={slide.description}
                        onChange={(value) =>
                          updateHeroSlide(slide.clientKey, { description: value })
                        }
                        placeholder="Deskripsi singkat hero slide..."
                      />
                    </Field>

                    {/* Button Label + Link */}
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-1 2xl:grid-cols-2">
                      <Field label="Button Label">
                        <Input
                          value={slide.buttonLabel}
                          onChange={(e) =>
                            updateHeroSlide(slide.clientKey, {
                              buttonLabel: e.target.value,
                            })
                          }
                          placeholder="Contoh: Jelajahi cerita"
                          maxLength={100}
                        />
                      </Field>
                      <Field label="Link Button">
                        <Input
                          value={slide.buttonUrl}
                          onChange={(e) =>
                            updateHeroSlide(slide.clientKey, {
                              buttonUrl: e.target.value,
                            })
                          }
                          placeholder="Contoh: /cerita-warga"
                          maxLength={2048}
                        />
                      </Field>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Add Hero Button */}
          <Button
            type="button"
            className="w-full gap-2 bg-black text-white hover:bg-zinc-800 transition-colors cursor-pointer"
            onClick={addHeroSlide}
            disabled={data.heroSlides.length >= MAX_HEROES}
          >
            <Plus className="size-4" />
            Tambah Heroes
          </Button>
        </div>
      </SectionCard>

      {/* ── Section 2: About Us ────────────────────────────────────── */}
      <SectionCard
        title="Section About Us"
        desc="Konten tentang Benah Palembang di halaman Home."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Label">
            <Input
              value={data.about.eyebrow}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  about: { ...current.about, eyebrow: e.target.value },
                }))
              }
              placeholder="Contoh: About Benah Palembang"
              maxLength={160}
            />
          </Field>

          <Field label="Mini Text">
            <Input
              value={data.about.establishedText}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  about: { ...current.about, establishedText: e.target.value },
                }))
              }
              placeholder="Contoh: Est. 2025 · Palembang"
              maxLength={160}
            />
          </Field>

          <Field label="Title">
            <Input
              value={data.about.title}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  about: { ...current.about, title: e.target.value },
                }))
              }
              placeholder="Judul section About Us"
              maxLength={255}
            />
          </Field>
          
          <Field label="Tagline">
            <Input
              value={data.about.closingText}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  about: { ...current.about, closingText: e.target.value },
                }))
              }
              placeholder="Contoh: Untuk kota yang lebih hidup"
              maxLength={255}
            />
          </Field>
        </div>

        <Field label="Description">
          <Textarea
            value={data.about.description}
            onChange={(value) =>
              onChange((current) => ({
                ...current,
                about: { ...current.about, description: value },
              }))
            }
            placeholder="Deskripsi tentang Benah Palembang..."
          />
        </Field>


      </SectionCard>

      {/* ── Section 3: Our Team ────────────────────────────────────── */}
      <SectionCard
        title="Section Our Team"
        desc={`Anggota tim Benah Palembang. Min. 1, maks. ${MAX_TEAM} orang.`}
      >
        {/* Team Header Fields */}
        <Field label="Title">
          <Input
            value={data.team.title}
            onChange={(e) =>
              onChange((current) => ({
                ...current,
                team: { ...current.team, title: e.target.value },
              }))
            }
            placeholder="Contoh: Di Balik Benah Palembang"
            maxLength={255}
          />
        </Field>

        <Field label="Deskripsi">
          <Textarea
            value={data.team.description}
            onChange={(value) =>
              onChange((current) => ({
                ...current,
                team: { ...current.team, description: value },
              }))
            }
            placeholder="Deskripsi singkat tim..."
          />
        </Field>

        {/* Team Members List */}
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold">
              Anggota Tim ({data.team.members.length})
            </h4>
          </div>

          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {data.team.members.map((member, memberIndex) => (
              <div
                key={member.clientKey}
                className={`relative space-y-4 rounded-lg border bg-muted/10 p-4 transition-all ${
                  draggedTeamIndex === memberIndex
                    ? "opacity-50 ring-2 ring-primary"
                    : ""
                }`}
                draggable
                onDragStart={() => setDraggedTeamIndex(memberIndex)}
                onDragOver={(e) => {
                  e.preventDefault() // Allow drop
                }}
                onDrop={(e) => {
                  e.preventDefault()
                  if (
                    draggedTeamIndex === null ||
                    draggedTeamIndex === memberIndex
                  )
                    return

                  const newMembers = [...data.team.members]
                  const [draggedItem] = newMembers.splice(draggedTeamIndex, 1)
                  newMembers.splice(memberIndex, 0, draggedItem)

                  onChange((current) => ({
                    ...current,
                    team: {
                      ...current.team,
                      members: newMembers.map((m, idx) => ({
                        ...m,
                        position: idx + 1,
                      })),
                    },
                  }))
                  setDraggedTeamIndex(null)
                }}
                onDragEnd={() => setDraggedTeamIndex(null)}
              >
                {/* Header: Index + Delete */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="cursor-grab active:cursor-grabbing text-muted-foreground hover:bg-muted"
                      title="Geser untuk mengurutkan"
                    >
                      <GripVertical className="size-4" />
                    </Button>
                    <span className="text-sm font-semibold text-muted-foreground">
                      Anggota #{memberIndex + 1}
                    </span>
                  </div>
                  {memberIndex > 0 && (
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          className="size-8 text-destructive hover:bg-destructive/10 hover:text-destructive"
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Hapus Anggota ini?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Tindakan ini tidak dapat dibatalkan. Anggota tim ini akan dihapus dari halaman Home.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Batal</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => removeTeamMember(member.clientKey)}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                          >
                            Ya, hapus
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  )}
                </div>

              {/* Image Upload */}
              <Field label="Foto">
                <ImageUpload
                  value={member.imageUrl}
                  onChange={(url) =>
                    updateTeamMember(member.clientKey, { imageUrl: url })
                  }
                  placeholder="Upload foto anggota..."
                  aspect={4 / 5}
                  uploadScope="website-content"
                />
              </Field>

              {/* Name + Role */}
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Nama">
                  <Input
                    value={member.name}
                    onChange={(e) =>
                      updateTeamMember(member.clientKey, {
                        name: e.target.value,
                      })
                    }
                    placeholder="Nama lengkap"
                    maxLength={160}
                  />
                </Field>
                <Field label="Jabatan">
                  <Input
                    value={member.role}
                    onChange={(e) =>
                      updateTeamMember(member.clientKey, {
                        role: e.target.value,
                      })
                    }
                    placeholder="Contoh: Editor in Chief"
                    maxLength={160}
                  />
                </Field>
              </div>

              {/* Bio */}
              <Field label="Deskripsi">
                <Textarea
                  value={member.bio}
                  onChange={(value) =>
                    updateTeamMember(member.clientKey, { bio: value })
                  }
                  placeholder="Bio singkat anggota..."
                />
              </Field>
            </div>
          ))}
          </div>

          {/* Add Team Member Button */}
          <Button
            type="button"
            variant="outline"
            className="w-full gap-2"
            onClick={addTeamMember}
            disabled={data.team.members.length >= MAX_TEAM}
          >
            <Plus className="size-4" />
            Tambah Anggota
          </Button>
        </div>
      </SectionCard>

      {/* ── Section 4: CTA ─────────────────────────────────────────── */}
      <SectionCard
        title="Section CTA"
        desc="Call to Action untuk kolaborasi di halaman Home."
      >
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Label">
            <Input
              value={data.cta.eyebrow}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  cta: { ...current.cta, eyebrow: e.target.value },
                }))
              }
              placeholder="Contoh: Collaboration"
              maxLength={160}
            />
          </Field>

          <Field label="Title">
            <Input
              value={data.cta.title}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  cta: { ...current.cta, title: e.target.value },
                }))
              }
              placeholder="Contoh: Jalin Kolaborasi Bersama Benah Palembang"
              maxLength={255}
            />
          </Field>
        </div>

        <Field label="Description">
          <Textarea
            value={data.cta.description}
            onChange={(value) =>
              onChange((current) => ({
                ...current,
                cta: { ...current.cta, description: value },
              }))
            }
            placeholder="Deskripsi CTA kolaborasi..."
          />
        </Field>

        {/* Primary CTA Button */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Button Text 1">
            <Input
              value={data.cta.buttonLabel}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  cta: { ...current.cta, buttonLabel: e.target.value },
                }))
              }
              placeholder="Contoh: Jelajahi Kolaborasi"
              maxLength={100}
            />
          </Field>
          <Field label="Link 1">
            <Input
              value={data.cta.buttonUrl}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  cta: { ...current.cta, buttonUrl: e.target.value },
                }))
              }
              placeholder="Contoh: /kolaborasi"
              maxLength={2048}
            />
          </Field>
        </div>

        {/* Secondary CTA Button (Contact) */}
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Button Text 2">
            <Input
              value={data.cta.contactLabel}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  cta: { ...current.cta, contactLabel: e.target.value },
                }))
              }
              placeholder="Contoh: Hubungi Kami"
              maxLength={100}
            />
          </Field>
          <Field label="Link 2 (Email)">
            <Input
              value={data.cta.contactEmail}
              onChange={(e) =>
                onChange((current) => ({
                  ...current,
                  cta: { ...current.cta, contactEmail: e.target.value },
                }))
              }
              placeholder="Contoh: kolaborasi@benahpalembang.id"
              maxLength={320}
            />
          </Field>
        </div>
      </SectionCard>
    </div>
  )
}
