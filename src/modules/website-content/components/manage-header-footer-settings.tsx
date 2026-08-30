"use client"

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useState, type ReactNode } from "react"
import { toast } from "sonner"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type {
  HeaderFooterContentEditorData,
  WebsiteFooterLinkEditorData,
} from "../types/header-footer-content-editor"

function SectionCard({
  title,
  desc,
  children,
}: {
  title: string
  desc?: string
  children: ReactNode
}) {
  const [isExpanded, setIsExpanded] = useState(false)

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
    <div className="space-y-2">
      <label className="text-sm font-medium">{label}</label>
      {children}
    </div>
  )
}

function clientKey(prefix: string) {
  return `${prefix}-${crypto.randomUUID()}`
}

function normalizePositions(items: WebsiteFooterLinkEditorData[]) {
  return items.map((item, index) => ({ ...item, position: index + 1 }))
}

export function ManageHeaderFooterSettings({
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
  const [deleteExploreDialog, setDeleteExploreDialog] = useState<{
    open: boolean
    link: WebsiteFooterLinkEditorData | null
  }>({ open: false, link: null })

  const [deleteConnectDialog, setDeleteConnectDialog] = useState<{
    open: boolean
    link: WebsiteFooterLinkEditorData | null
  }>({ open: false, link: null })

  const confirmDeleteExplore = () => {
    if (!deleteExploreDialog.link) return
    const targetKey = deleteExploreDialog.link.clientKey
    onChange((current) => ({
      ...current,
      footer: {
        ...current.footer,
        exploreLinks: normalizePositions(
          current.footer.exploreLinks.filter((item) => item.clientKey !== targetKey),
        ),
      },
    }))
    toast.success("Link explore berhasil dihapus")
    setDeleteExploreDialog({ open: false, link: null })
  }

  const confirmDeleteConnect = () => {
    if (!deleteConnectDialog.link) return
    const targetKey = deleteConnectDialog.link.clientKey
    onChange((current) => ({
      ...current,
      footer: {
        ...current.footer,
        connectLinks: normalizePositions(
          current.footer.connectLinks.filter((item) => item.clientKey !== targetKey),
        ),
      },
    }))
    toast.success("Link connect berhasil dihapus")
    setDeleteConnectDialog({ open: false, link: null })
  }

  const updateExploreLink = (
    clientKeyValue: string,
    values: Partial<WebsiteFooterLinkEditorData>,
  ) => {
    onChange((current) => ({
      ...current,
      footer: {
        ...current.footer,
        exploreLinks: current.footer.exploreLinks.map((link) =>
          link.clientKey === clientKeyValue ? { ...link, ...values } : link,
        ),
      },
    }))
  }

  const updateConnectLink = (
    clientKeyValue: string,
    values: Partial<WebsiteFooterLinkEditorData>,
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
        title="Logo & Header"
        desc="Konfigurasi logo dan link utama header."
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
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="URL Logo (Redirect Link)">
            <Input
              value={data.logo.linkUrl}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  logo: { ...current.logo, linkUrl: event.target.value },
                }))
              }
            />
          </Field>
          <Field label="Alt Logo">
            <Input
              value={data.logo.imageAlt}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  logo: { ...current.logo, imageAlt: event.target.value },
                }))
              }
            />
          </Field>
        </div>
        <Field label="Deskripsi Footer">
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
      </SectionCard>

      <SectionCard
        title="Footer — Explore"
        desc="Link navigasi pada kolom Explore footer."
      >
        <div className="space-y-4">
          <Field label="Deskripsi Explore">
            <Input
              value={data.footer.exploreDescription}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  footer: {
                    ...current.footer,
                    exploreDescription: event.target.value,
                  },
                }))
              }
              placeholder="Deskripsi singkat untuk kolom explore footer..."
            />
          </Field>
          <div className="space-y-3">
            {data.footer.exploreLinks.map((link) => (
              <div key={link.clientKey} className="flex items-center gap-2">
                <Input
                  className="flex-1"
                  value={link.label}
                  onChange={(event) =>
                    updateExploreLink(link.clientKey, {
                      label: event.target.value,
                    })
                  }
                  placeholder="Nama"
                />
                <Input
                  className="flex-[2]"
                  value={link.linkUrl}
                  onChange={(event) =>
                    updateExploreLink(link.clientKey, {
                      linkUrl: event.target.value,
                    })
                  }
                  placeholder="URL"
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                  onClick={() => setDeleteExploreDialog({ open: true, link })}
                  title="Hapus link"
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
            <Button
              type="button"
              variant="outline"
              className="w-full border-dashed"
              onClick={() =>
                onChange((current) => ({
                  ...current,
                  footer: {
                    ...current.footer,
                    exploreLinks: [
                      ...current.footer.exploreLinks,
                      {
                        id: null,
                        clientKey: clientKey("footer-explore"),
                        label: "",
                        linkUrl: "/",
                        position: current.footer.exploreLinks.length + 1,
                        isVisible: true,
                      },
                    ],
                  },
                }))
              }
            >
              <Plus className="mr-2 size-4" /> Tambah Link Explore
            </Button>
          </div>
        </div>
      </SectionCard>

      <SectionCard
        title="Footer — Connect"
        desc="Link sosial media pada kolom Connect footer."
      >
        <div className="space-y-3">
          {data.footer.connectLinks.map((link) => (
            <div key={link.clientKey} className="flex items-center gap-2">
              <Input
                className="flex-1"
                value={link.label}
                onChange={(event) =>
                  updateConnectLink(link.clientKey, {
                    label: event.target.value,
                  })
                }
                placeholder="Platform"
              />
              <Input
                className="flex-[2]"
                value={link.linkUrl}
                onChange={(event) =>
                  updateConnectLink(link.clientKey, {
                    linkUrl: event.target.value,
                  })
                }
                placeholder="URL"
              />
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50 hover:text-red-600 cursor-pointer"
                onClick={() => setDeleteConnectDialog({ open: true, link })}
                title="Hapus link"
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          ))}
          <Button
            type="button"
            variant="outline"
            className="w-full border-dashed"
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
                      label: "",
                      linkUrl: "#",
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

      <SectionCard
        title="Footer — Contact & Copyright"
        desc="Informasi kontak dan hak cipta di bagian bawah footer."
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Email Kontak">
            <Input
              type="email"
              value={data.footer.contactEmail}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  footer: {
                    ...current.footer,
                    contactEmail: event.target.value,
                  },
                }))
              }
            />
          </Field>
          <Field label="Nomor HP / WhatsApp">
            <Input
              value={data.footer.contactPhone}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  footer: {
                    ...current.footer,
                    contactPhone: event.target.value,
                  },
                }))
              }
            />
          </Field>
        </div>
        <Field label="Alamat">
          <Input
            value={data.footer.contactAddress}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                footer: {
                  ...current.footer,
                  contactAddress: event.target.value,
                },
              }))
            }
          />
        </Field>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Copyright">
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
          <Field label="Teks Penutup">
            <Input
              value={data.footer.closingText}
              onChange={(event) =>
                onChange((current) => ({
                  ...current,
                  footer: {
                    ...current.footer,
                    closingText: event.target.value,
                  },
                }))
              }
            />
          </Field>
        </div>
      </SectionCard>

      {/* Delete Explore Link Confirmation Dialog */}
      <ConfirmActionDialog
        open={deleteExploreDialog.open}
        onOpenChange={(open) => setDeleteExploreDialog((prev) => ({ ...prev, open }))}
        title="Hapus Link Explore"
        description={`Apakah Anda yakin ingin menghapus link explore "${deleteExploreDialog.link?.label || "Explore"}"? Perubahan ini akan diterapkan setelah disimpan.`}
        confirmText="Hapus Link"
        variant="destructive"
        onConfirm={confirmDeleteExplore}
      />

      {/* Delete Connect Link Confirmation Dialog */}
      <ConfirmActionDialog
        open={deleteConnectDialog.open}
        onOpenChange={(open) => setDeleteConnectDialog((prev) => ({ ...prev, open }))}
        title="Hapus Link Connect"
        description={`Apakah Anda yakin ingin menghapus link connect "${deleteConnectDialog.link?.label || "Connect"}"? Perubahan ini akan diterapkan setelah disimpan.`}
        confirmText="Hapus Link"
        variant="destructive"
        onConfirm={confirmDeleteConnect}
      />
    </div>
  )
}
