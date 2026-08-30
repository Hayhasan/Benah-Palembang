"use client"

import { ChevronDown, ChevronUp, Plus, Trash2 } from "lucide-react"
import { useState, type ReactNode } from "react"

import { ImageUpload } from "@/components/dashboard/ImageUpload"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

import type { FooterConnectPlatform } from "../types/header-footer-content"
import type {
  HeaderFooterContentEditorData,
  WebsiteFooterConnectLinkEditorData,
  WebsiteFooterLinkEditorData,
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

function normalizePositions<T extends { position: number }>(items: T[]) {
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
        title="Logo & Header"
        desc="Konfigurasi logo, redirect header, background text footer, dan deskripsi website."
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
        <Field label="Background Text (Footer)">
          <Input
            value={data.footer.backgroundText}
            onChange={(event) =>
              onChange((current) => ({
                ...current,
                footer: {
                  ...current.footer,
                  backgroundText: event.target.value,
                },
              }))
            }
            placeholder="PALEMBANG"
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
      </SectionCard>

      <SectionCard
        title="Footer — Explore"
        desc="Link navigasi pada kolom Explore footer."
      >
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
                  className="text-red-500 hover:bg-red-50 hover:text-red-600"
                  onClick={() =>
                    onChange((current) => ({
                      ...current,
                      footer: {
                        ...current.footer,
                        exploreLinks: normalizePositions(
                          current.footer.exploreLinks.filter(
                            (item) => item.clientKey !== link.clientKey,
                          ),
                        ),
                      },
                    }))
                  }
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
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="text-red-500 hover:bg-red-50 hover:text-red-600"
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

      <SectionCard
        title="Footer — Copyright"
        desc="Satu teks hak cipta yang ditampilkan di bagian bawah footer."
      >
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
    </div>
  )
}
