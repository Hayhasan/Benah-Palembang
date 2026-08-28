"use client"

import { useRouter } from "next/navigation"
import { useState, useTransition } from "react"
import { Eye, EyeOff, Plus } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

import { createAccountAction } from "../actions/create-account"
import { ACCOUNT_ROUTE_CONFIG } from "../constants/account-route-role"
import type {
  AccountRouteRole,
  ManagedAccountRole,
} from "../types/managed-account"

interface CreateAccountDialogProps {
  routeRole: AccountRouteRole
}

export function CreateAccountDialog({ routeRole }: CreateAccountDialogProps) {
  const router = useRouter()
  const config = ACCOUNT_ROUTE_CONFIG[routeRole]
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()
  const [name, setName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [confirmPassword, setConfirmPassword] = useState("")
  const [role, setRole] = useState<ManagedAccountRole>(
    routeRole === "user" ? "USER" : "ADMIN",
  )
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  function resetForm() {
    setName("")
    setEmail("")
    setPassword("")
    setConfirmPassword("")
    setRole(routeRole === "user" ? "USER" : "ADMIN")
    setShowPassword(false)
    setShowConfirmPassword(false)
  }

  function handleOpenChange(nextOpen: boolean) {
    setOpen(nextOpen)
    if (!nextOpen && !isPending) resetForm()
  }

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault()

    startTransition(async () => {
      const result = await createAccountAction({
        routeRole,
        name,
        email,
        password,
        confirmPassword,
        role,
      })

      if (!result.success) {
        toast.error(result.message)
        return
      }

      toast.success(result.message)
      setOpen(false)
      resetForm()
      router.refresh()
    })
  }

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button className="w-fit bg-palembang-red text-white hover:bg-palembang-red/90">
          <Plus className="mr-2 size-4" /> {config.createLabel}
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <form onSubmit={handleSubmit}>
          <DialogHeader>
            <DialogTitle>{config.createTitle}</DialogTitle>
            <DialogDescription>{config.createDescription}</DialogDescription>
          </DialogHeader>

          <div className="grid gap-4 py-4">
            <div className="space-y-2">
              <label htmlFor="account-name" className="text-sm font-medium">
                Nama Lengkap
              </label>
              <Input
                id="account-name"
                required
                minLength={2}
                maxLength={160}
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Masukkan nama"
                disabled={isPending}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="account-email" className="text-sm font-medium">
                Email
              </label>
              <Input
                id="account-email"
                required
                type="email"
                maxLength={255}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="email@example.com"
                autoComplete="email"
                disabled={isPending}
              />
            </div>

            {routeRole === "admin" && (
              <div className="space-y-2">
                <label htmlFor="account-role" className="text-sm font-medium">
                  Role
                </label>
                <select
                  id="account-role"
                  required
                  value={role}
                  onChange={(event) =>
                    setRole(event.target.value as ManagedAccountRole)
                  }
                  disabled={isPending}
                  className="flex h-10 w-full rounded-md border border-input bg-palembang-charcoal px-3 py-2 text-sm text-white ring-offset-background focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                >
                  <option value="ADMIN">Admin</option>
                  <option value="SUPERADMIN">SuperAdmin</option>
                </select>
              </div>
            )}

            <div className="space-y-2">
              <label htmlFor="account-password" className="text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <Input
                  id="account-password"
                  required
                  minLength={8}
                  maxLength={72}
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  autoComplete="new-password"
                  disabled={isPending}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label
                htmlFor="account-confirm-password"
                className="text-sm font-medium"
              >
                Konfirmasi Password
              </label>
              <div className="relative">
                <Input
                  id="account-confirm-password"
                  required
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  disabled={isPending}
                  className="pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword((value) => !value)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                  aria-label={
                    showConfirmPassword
                      ? "Sembunyikan konfirmasi password"
                      : "Tampilkan konfirmasi password"
                  }
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => handleOpenChange(false)}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button
              type="submit"
              disabled={isPending}
              className="bg-palembang-red text-white hover:bg-palembang-red/90"
            >
              {isPending ? "Menyimpan..." : `Simpan ${routeRole === "user" ? "User" : "Admin"}`}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
