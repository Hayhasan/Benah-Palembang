"use client"

import { z } from "zod"
import { useTransition } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { useRouter } from "next/navigation"
import { toast } from "sonner"
import { Save, Loader2, ArrowLeft } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Switch } from "@/components/ui/switch"

import {
  collaborationContentEditorSchema,
  type CollaborationContentEditorData,
} from "../schemas/collaboration.schema"
import { saveCollaboration } from "../actions/save-collaboration"

interface CollaborationEditorProps {
  initialData?: CollaborationContentEditorData
}

export function CollaborationEditor({ initialData }: CollaborationEditorProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const form = useForm<CollaborationContentEditorData>({
    resolver: zodResolver(collaborationContentEditorSchema),
    defaultValues: initialData || {
      id: null,
      platform: "youtube",
      contentUrl: "",
      isVisible: true,
    },
  })

  async function onSubmit(data: CollaborationContentEditorData) {
    startTransition(async () => {
      const result = await saveCollaboration(data)
      if (result.success) {
        toast.success("Berhasil menyimpan konten kolaborasi!")
      } else {
        toast.error(result.message)
        if (result.field) {
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          form.setError(result.field as any, { message: result.message })
        }
      }
    })
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" size="icon" asChild>
          <Link href="/dashboard/collaboration">
            <ArrowLeft className="size-4" />
          </Link>
        </Button>
        <div>
          <h2 className="text-xl font-bold tracking-tight">
            {initialData ? "Edit Konten" : "Tambah Konten Kolaborasi"}
          </h2>
          <p className="text-sm text-muted-foreground">
            Formulir untuk mengisi platform dan URL konten (card gallery).
          </p>
        </div>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <div className="rounded-lg border bg-white p-6 shadow-sm space-y-6">
            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Judul</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: Podcast BNI Episode 1"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="platform"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Platform</FormLabel>
                  <FormControl>
                    <select
                      {...field}
                      className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="youtube">YouTube</option>
                      <option value="instagram">Instagram</option>
                      <option value="tiktok">TikTok</option>
                      <option value="facebook">Facebook</option>
                      <option value="x">X (Twitter)</option>
                    </select>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="contentUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL Konten</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Contoh: https://youtube.com/watch?v=..."
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              control={form.control as any}
              name="isVisible"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                  <FormControl>
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>Tampilkan di Website</FormLabel>
                    <p className="text-sm text-muted-foreground">
                      Jika dicentang, konten ini akan muncul di halaman publik kolaborasi.
                    </p>
                  </div>
                </FormItem>
              )}
            />
          </div>

          <div className="flex justify-end gap-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/dashboard/collaboration")}
              disabled={isPending}
            >
              Batal
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? (
                <Loader2 className="mr-2 size-4 animate-spin" />
              ) : (
                <Save className="mr-2 size-4" />
              )}
              {initialData ? "Simpan Perubahan" : "Buat Konten"}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  )
}
