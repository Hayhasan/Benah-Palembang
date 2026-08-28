"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  Eye as EyeIcon,
  Heart,
  MessageCircle,
  ShieldAlert,
  ShieldCheck,
  UserRoundCog,
} from "lucide-react"
import { toast } from "sonner"

import { ConfirmActionDialog } from "@/components/dashboard/ConfirmActionDialog"
import { Button } from "@/components/ui/button"

import { changeAccountRoleAction } from "../actions/change-account-role"
import type {
  AccountRouteRole,
  ManagedAccountDetail,
} from "../types/managed-account"

const DEFAULT_BANNER =
  "https://images.pexels.com/photos/1183992/pexels-photo-1183992.jpeg?auto=compress&cs=tinysrgb&w=1200&h=400&fit=crop"
const DEFAULT_AVATAR = "https://i.pravatar.cc/150?img=0"
const DUMMY_ARTICLES = [
  {
    id: 1,
    title: "Palembang di Balik Senja",
    image:
      "https://images.pexels.com/photos/14616555/pexels-photo-14616555.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    views: 1204,
    likes: 340,
  },
  {
    id: 2,
    title: "Lorong Basah dan Kulinernya",
    image:
      "https://images.pexels.com/photos/270408/pexels-photo-270408.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    views: 3400,
    likes: 890,
  },
  {
    id: 3,
    title: "Pusat Kebudayaan Sriwijaya",
    image:
      "https://images.pexels.com/photos/3321521/pexels-photo-3321521.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&fit=crop",
    views: 980,
    likes: 210,
  },
]

interface AccountDetailProps {
  routeRole: AccountRouteRole
  account: ManagedAccountDetail
}

function roleLabel(role: ManagedAccountDetail["role"]) {
  if (role === "SUPERADMIN") return "SuperAdmin"
  if (role === "ADMIN") return "Admin"
  return "User"
}

export function AccountDetail({ routeRole, account }: AccountDetailProps) {
  const router = useRouter()
  const [confirmRoleChange, setConfirmRoleChange] = useState(false)
  const [isPending, startTransition] = useTransition()
  const canChangeRole = account.role === "USER" || account.role === "ADMIN"
  const targetRole = account.role === "USER" ? "ADMIN" : "USER"
  const whatsappUrl =
    account.whatsappCountryCode && account.whatsappNumber
      ? `https://wa.me/${account.whatsappCountryCode}${account.whatsappNumber}`
      : null

  function handleRoleChange() {
    if (!canChangeRole) return

    startTransition(async () => {
      const result = await changeAccountRoleAction({
        id: account.id,
        routeRole,
        targetRole,
      })

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      router.replace(
        `/dashboard/account/${result.nextRouteRole}/${account.id}`,
      )
      router.refresh()
    })
  }

  return (
    <div className="space-y-8 pb-10">
      <div className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/80 py-4 backdrop-blur-md sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">
            Profil {account.name}
          </h2>
          <p className="text-muted-foreground">
            Detail account <span className="font-mono text-xs">{account.id}</span>
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={() => router.push(`/dashboard/account/${routeRole}`)}
          >
            <ArrowLeft className="mr-2 size-4" /> Kembali
          </Button>
          {canChangeRole && (
            <Button
              disabled={isPending}
              onClick={() => setConfirmRoleChange(true)}
              className="bg-palembang-red text-white hover:bg-palembang-red/90"
            >
              <UserRoundCog className="mr-2 size-4" />
              {account.role === "USER"
                ? "Ubah menjadi Admin"
                : "Ubah menjadi User"}
            </Button>
          )}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl bg-palembang-charcoal text-white shadow-sm">
        <div className="h-48 w-full md:h-64">
          <img
            src={account.bannerUrl || DEFAULT_BANNER}
            alt={`Banner ${account.name}`}
            className="size-full object-cover"
          />
        </div>
        <div className="px-6 pb-8 sm:px-10">
          <div className="relative -mt-12 mb-4 flex items-end justify-between sm:-mt-16">
            <img
              src={account.avatarUrl || DEFAULT_AVATAR}
              alt={account.name}
              className="size-24 rounded-full border-4 border-palembang-charcoal bg-white object-cover shadow-sm sm:size-32"
            />
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                className="hidden h-10 items-center justify-center rounded-md bg-palembang-red px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-palembang-red/90 sm:inline-flex"
              >
                <MessageCircle className="mr-2 size-4" /> Hubungi
              </a>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <h1 className="font-display text-2xl font-bold sm:text-3xl">
              {account.name}
            </h1>
            <span className="rounded-full bg-white/10 px-3 py-1 text-xs font-bold uppercase tracking-wider text-palembang-red">
              {roleLabel(account.role)}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                account.isBanned
                  ? "bg-red-500/20 text-red-300"
                  : "bg-emerald-500/20 text-emerald-300"
              }`}
            >
              {account.isBanned ? (
                <ShieldAlert className="size-3.5" />
              ) : (
                <ShieldCheck className="size-3.5" />
              )}
              {account.isBanned ? "Banned" : "Active"}
            </span>
          </div>
          <p className="mt-1 text-sm text-white/70">{account.email}</p>
          <p className="mt-4 max-w-2xl whitespace-pre-line text-sm leading-relaxed text-white/80">
            {account.bio || "Belum ada bio untuk account ini."}
          </p>

          <div className="mt-6 flex gap-4">
            {account.instagramUrl && (
              <a
                href={account.instagramUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="Instagram"
                className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-pink-400"
              >
                <span className="text-xs font-bold">IG</span>
              </a>
            )}
            {account.xUrl && (
              <a
                href={account.xUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="X"
                className="rounded-full bg-white/10 px-3 py-2 text-sm font-bold text-white/70 transition-colors hover:bg-white/20 hover:text-white"
              >
                X
              </a>
            )}
            {account.linkedinUrl && (
              <a
                href={account.linkedinUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="LinkedIn"
                className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-blue-400"
              >
                <span className="text-xs font-bold">in</span>
              </a>
            )}
            {whatsappUrl && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noreferrer"
                aria-label="WhatsApp"
                className="rounded-full bg-white/10 p-2 text-white/70 transition-colors hover:bg-white/20 hover:text-green-400 sm:hidden"
              >
                <MessageCircle className="size-5" />
              </a>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <CalendarDays className="size-4 text-palembang-red" /> Dibuat
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {account.createdAtLabel}
          </p>
        </div>
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock3 className="size-4 text-palembang-red" /> Diperbarui
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {account.updatedAtLabel}
          </p>
        </div>
        <div className="rounded-xl border bg-background p-5 shadow-sm">
          <div className="flex items-center gap-2 text-sm font-semibold">
            <Clock3 className="size-4 text-palembang-red" /> Last Login
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {account.lastLoginAt ?? "-"}
          </p>
        </div>
      </div>

      <div>
        <div className="mb-6 flex items-center justify-between border-b pb-2">
          <h3 className="font-display text-xl font-bold">Galeri Artikel</h3>
          <span className="text-xs text-muted-foreground">
            Klik artikel untuk melihat pratinjau publik
          </span>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DUMMY_ARTICLES.map((article) => (
            <button
              key={article.id}
              type="button"
              onClick={() =>
                router.push(`/dashboard/article/preview/${article.id}`)
              }
              className="group overflow-hidden rounded-xl border bg-background text-left shadow-sm transition-all hover:border-palembang-red/40 hover:shadow-md"
            >
              <div className="relative aspect-[4/3] overflow-hidden">
                <img
                  src={article.image}
                  alt={article.title}
                  className="size-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 transition-opacity group-hover:opacity-100">
                  <span className="rounded-full bg-white/90 px-3 py-1.5 text-xs font-semibold text-palembang-charcoal shadow-md">
                    Lihat Pratinjau
                  </span>
                </div>
              </div>
              <div className="p-4">
                <h4 className="mb-3 font-display text-lg font-bold leading-tight transition-colors group-hover:text-palembang-red">
                  {article.title}
                </h4>
                <div className="flex items-center gap-4 text-xs font-medium text-muted-foreground">
                  <span className="flex items-center gap-1.5">
                    <EyeIcon className="size-3.5" />
                    {article.views.toLocaleString("id-ID")}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Heart className="size-3.5 text-palembang-red" />
                    {article.likes.toLocaleString("id-ID")}
                  </span>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {canChangeRole && (
        <ConfirmActionDialog
          open={confirmRoleChange}
          onOpenChange={setConfirmRoleChange}
          title="Konfirmasi Perubahan Role"
          description={`Ubah role ${account.name} dari ${roleLabel(account.role)} menjadi ${roleLabel(targetRole)}? Account akan berpindah ke daftar ${targetRole === "USER" ? "User" : "Admin"}.`}
          confirmText="Ya, Ubah Role"
          cancelText="Batal"
          variant="default"
          onConfirm={handleRoleChange}
        />
      )}
    </div>
  )
}
