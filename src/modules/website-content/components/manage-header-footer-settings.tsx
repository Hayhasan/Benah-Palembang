"use client"

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useState, type ReactNode } from "react"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
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

import type { FooterConnectPlatform } from "../types/header-footer-content"
import type {
  HeaderFooterContentEditorData,
  WebsiteFooterConnectLinkEditorData,
} from "../types/header-footer-content-editor"
import {
  FOOTER_CONNECT_PLATFORMS,
  FooterConnectIcon,
  footerConnectPlaceholder,
} from "./footer-connect-icon"

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

function ColorPickerField({
  label,
  value,
  onChange,
}: {
  label: string
  value: string
  onChange: (value: string) => void
}) {
  const fieldId = `color-${label.replace(/\s+/g, "-").toLowerCase()}`

  return (
    <div className="space-y-1.5">
      <span className="text-sm font-medium block">{label}</span>
      <div className="flex items-center gap-3">
        <div className="relative">
          <input
            type="color"
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="sr-only peer"
            id={fieldId}
          />
          <label
            htmlFor={fieldId}
            className="flex size-10 cursor-pointer items-center justify-center rounded-lg border-2 border-border shadow-sm transition-all hover:scale-105 hover:shadow-md peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
            style={{ backgroundColor: value }}
          >
            <span className="sr-only">Pilih warna</span>
          </label>
        </div>
        <Input
          value={value}
          onChange={(e) => {
            const v = e.target.value
            if (/^#[0-9a-fA-F]{0,8}$/.test(v) || v === "#") {
              onChange(v)
            }
          }}
          placeholder="#000000"
          className="w-32 font-mono text-sm uppercase"
          maxLength={9}
        />
        <div
          className="size-6 rounded-full border border-border shadow-inner"
          style={{ backgroundColor: value }}
          title={`Preview: ${value}`}
        />
      </div>
    </div>
  )
}

function clientKey(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function normalizePositions<T extends { position: number }>(items: T[]) {
  return items.map((item, index) => ({ ...item, position: index + 1 }))
}

export function ManageHeaderSettings({
  data,
  onChange,
}: {
  data: HeaderFooterContentEditorData
  onChange: (
    updater: (
      current: HeaderFooterContentEditorData,
    ) => HeaderFooterContentEditorData,
  ) => void
}) {
  return (
    <div className="space-y-8">
      <SectionCard
        title="Logo Header"
        desc="Konfigurasi logo website pada bagian header utama."
        defaultExpanded
      >
        <Field label="Logo Website (Upload)">
          <ImageUpload
            value={data.logo.imageUrl}
            onChange={(imageUrl) =>
              onChange((current) => ({
                ...current,
                logo: { ...current.logo, imageUrl },
              }))
            }
            placeholder="Pilih logo (PNG/SVG)..."
            aspect={210 / 44}
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Warna Header"
        desc="Atur warna background, teks, dan tombol pada header website publik."
        defaultExpanded
      >
        <div className="grid gap-6 sm:grid-cols-3">
          <ColorPickerField
            label="Background"
            value={data.headerColors.bgColor}
            onChange={(bgColor) =>
              onChange((current) => ({
                ...current,
                headerColors: { ...current.headerColors, bgColor },
              }))
            }
          />
          <ColorPickerField
            label="Teks"
            value={data.headerColors.textColor}
            onChange={(textColor) =>
              onChange((current) => ({
                ...current,
                headerColors: { ...current.headerColors, textColor },
              }))
            }
          />
          <ColorPickerField
            label="Tombol"
            value={data.headerColors.buttonColor}
            onChange={(buttonColor) =>
              onChange((current) => ({
                ...current,
                headerColors: { ...current.headerColors, buttonColor },
              }))
            }
          />
        </div>
        <div className="mt-4 rounded-lg border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">Preview</p>
          <div
            className="flex items-center justify-between rounded-lg px-4 py-3 transition-colors"
            style={{ backgroundColor: data.headerColors.bgColor }}
          >
            <span
              className="text-sm font-bold"
              style={{ color: data.headerColors.textColor }}
            >
              Logo Menu
            </span>
            <div className="flex items-center gap-2">
              <span
                className="text-xs font-medium"
                style={{ color: data.headerColors.textColor }}
              >
                Navigasi
              </span>
              <div
                className="size-6 rounded-full flex items-center justify-center"
                style={{ backgroundColor: data.headerColors.buttonColor }}
              >
                <span
                  className="text-[10px]"
                  style={{ color: data.headerColors.bgColor }}
                >
                  ●
                </span>
              </div>
            </div>
          </div>
        </div>
      </SectionCard>
    </div>
  )
}

export function ManageFooterSettings({
  data,
  onChange,
}: {
  data: HeaderFooterContentEditorData
  onChange: (
    updater: (
      current: HeaderFooterContentEditorData,
    ) => HeaderFooterContentEditorData,
  ) => void
}) {
  const updateConnectLink = (
    clientKeyValue: string,
    values: Partial<WebsiteFooterConnectLinkEditorData>,
  ) => {
    onChange((current) => ({
      ...current,
      footer: {
        ...current.footer,
        connectLinks: current.footer.connectLinks.map((link) =>
          link.clientKey === clientKeyValue ? { ...link, ...values } : link,
        ),
      },
    }))
  }

  return (
    <div className="space-y-8">
      <SectionCard
        title="Logo & Teks Footer"
        desc="Konfigurasi logo footer, deskripsi website, dan copyright text."
        defaultExpanded
      >
        <Field label="Logo Website Footer (Upload)">
          <ImageUpload
            value={data.footer.logo?.imageUrl || ""}
            onChange={(imageUrl) =>
              onChange((current) => ({
                ...current,
                footer: {
                  ...current.footer,
                  logo: { ...current.footer.logo, imageUrl },
                },
              }))
            }
            placeholder="Pilih logo footer (PNG/SVG)..."
            className="max-w-[200px]"
            aspectOptions={[
              { label: "Fit (Asli)", value: "natural" },
              { label: "1:1 (Square)", value: 1 },
            ]}
          />
        </Field>
        <Field label="Title / Editorial Statement">
          <Input
            value={data.footer.title}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                footer: {
                  ...current.footer,
                  title: event.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Deskripsi Website / Tagline Footer">
          <Input
            value={data.footer.description}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                footer: {
                  ...current.footer,
                  description: event.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Creator Text">
          <Input
            value={data.footer.creatorText}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                footer: {
                  ...current.footer,
                  creatorText: event.target.value,
                },
              }))
            }
          />
        </Field>
        <Field label="Copyright Text">
          <Input
            value={data.footer.copyrightText}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                footer: {
                  ...current.footer,
                  copyrightText: event.target.value,
                },
              }))
            }
          />
        </Field>
      </SectionCard>

      <SectionCard
        title="Warna Footer"
        desc="Atur warna background dan teks pada footer website publik."
        defaultExpanded
      >
        <div className="grid gap-6 sm:grid-cols-2">
          <ColorPickerField
            label="Background"
            value={data.footer.bgColor}
            onChange={(bgColor) =>
              onChange((current) => ({
                ...current,
                footer: { ...current.footer, bgColor },
              }))
            }
          />
          <ColorPickerField
            label="Teks"
            value={data.footer.textColor}
            onChange={(textColor) =>
              onChange((current) => ({
                ...current,
                footer: { ...current.footer, textColor },
              }))
            }
          />
        </div>
        <div className="mt-4 rounded-lg border p-4">
          <p className="text-xs font-medium text-muted-foreground mb-3">Preview</p>
          <div
            className="rounded-lg px-4 py-4 transition-colors"
            style={{ backgroundColor: data.footer.bgColor }}
          >
            <span
              className="text-xs font-bold block"
              style={{ color: data.footer.textColor }}
            >
              Footer Content Preview
            </span>
            <span
              className="text-[10px] mt-1 block opacity-70"
              style={{ color: data.footer.textColor }}
            >
              Deskripsi dan copyright akan tampil dengan warna ini.
            </span>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Footer — Connect"
        desc="Link sosial media pada footer dengan pilihan ikon platform."
      >
        <div className="space-y-3">
          {data.footer.connectLinks.map((link) => (
            <div
              key={link.clientKey}
              className="flex items-center gap-2.5"
            >
              <div className="relative flex w-44 shrink-0 items-center sm:w-52">
                <div className="pointer-events-none absolute left-3 flex items-center text-muted-foreground">
                  <FooterConnectIcon
                    platform={link.platform}
                    className="size-4"
                  />
                </div>
                <select
                  value={link.platform}
                  onChange={(event) =>
                    updateConnectLink(link.clientKey, {
                      platform: event.target.value as FooterConnectPlatform,
                    })
                  }
                  className="flex h-10 w-full cursor-pointer rounded-md border border-input bg-background py-2 pl-9 pr-3 text-sm ring-offset-background focus:outline-none focus:ring-1 focus:ring-ring"
                  aria-label="Platform Connect"
                >
                  {FOOTER_CONNECT_PLATFORMS.map((platform) => (
                    <option key={platform.value} value={platform.value}>
                      {platform.label}
                    </option>
                  ))}
                </select>
              </div>
              <Input
                className="flex-1"
                value={link.linkUrl}
                onChange={(event) =>
                  updateConnectLink(link.clientKey, {
                    linkUrl: event.target.value,
                  })
                }
                placeholder={footerConnectPlaceholder(link.platform)}
              />
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    type="button"
                    variant="ghost"
                    size="icon"
                    className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  >
                    <Trash2 className="size-4" />
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                     <AlertDialogTitle>Hapus Link ini?</AlertDialogTitle>
                    <AlertDialogDescription>
                      Tindakan ini tidak dapat dibatalkan. Link akan dihapus dari footer.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Batal</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={() =>
                        onChange((current) => ({
                          ...current,
                          footer: {
                            ...current.footer,
                            connectLinks: normalizePositions(
                              current.footer.connectLinks.filter(
                                (item) => item.clientKey !== link.clientKey,
                              ),
                            ),
                          },
                        }))
                      }
                      className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                    >
                      Ya, hapus
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>
          ))}
          <Button
            type="button"
            className="w-full"
            onClick={() =>
              onChange((current) => ({
                ...current,
                footer: {
                  ...current.footer,
                  connectLinks: [
                    ...current.footer.connectLinks,
                    {
                      id: null,
                      clientKey: clientKey("footer-connect"),
                      platform: "instagram",
                      linkUrl: "https://",
                      position: current.footer.connectLinks.length + 1,
                      isVisible: true,
                    },
                  ],
                },
              }))
            }
          >
            <Plus className="mr-2 size-4" /> Tambah Link Connect
          </Button>
        </div>
      </SectionCard>
    </div>
  )
}

