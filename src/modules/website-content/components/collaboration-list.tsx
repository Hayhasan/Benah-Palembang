"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { useTransition } from "react"
import { Edit2, Plus, Trash2 } from "lucide-react"
import { toast } from "sonner"

import { Button } from "@/components/ui/button"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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

import type { CollaborationContentListItem } from "../types/collaboration"
import { deleteCollaboration } from "../actions/delete-collaboration"

interface CollaborationListProps {
  items: CollaborationContentListItem[]
}

export function CollaborationList({ items }: CollaborationListProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  async function handleDelete(id: number) {
    const result = await deleteCollaboration(id)
    if (result.success) {
      toast.success(result.message)
    } else {
      toast.error(result.message)
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-bold tracking-tight">Data Kolaborasi</h2>
          <p className="text-sm text-muted-foreground">
            Kelola daftar Partner Content Anda.
          </p>
        </div>
        <Button asChild>
          <Link href="/dashboard/collaboration/create">
            <Plus className="mr-2 size-4" />
            Tambah Baru
          </Link>
        </Button>
      </div>

      <div className="rounded-md border bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px]">ID</TableHead>
              <TableHead>Judul</TableHead>
              <TableHead>Platform</TableHead>
              <TableHead>Content URL</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Belum ada data kolaborasi.
                </TableCell>
              </TableRow>
            ) : (
              items.map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.id}</TableCell>
                  <TableCell className="font-medium text-zinc-900">{item.title || "-"}</TableCell>
                  <TableCell className="capitalize">{item.platform.toLowerCase()}</TableCell>
                  <TableCell>
                    <a
                      href={item.contentUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-600 hover:underline line-clamp-1 max-w-xs"
                    >
                      {item.contentUrl}
                    </a>
                  </TableCell>
                  <TableCell>
                    <span
                      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold ${
                        item.isVisible
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {item.isVisible ? "Ditampilkan" : "Disembunyikan"}
                    </span>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="outline"
                        size="icon"
                        asChild
                      >
                        <Link href={`/dashboard/collaboration/${item.id}/edit`}>
                          <Edit2 className="size-4" />
                          <span className="sr-only">Edit</span>
                        </Link>
                      </Button>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="destructive" size="icon">
                            <Trash2 className="size-4" />
                            <span className="sr-only">Hapus</span>
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Hapus Konten?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Konten ini akan dihapus dari daftar partner content. Tindakan ini
                              tidak dapat dibatalkan.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Batal</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => {
                                startTransition(() => {
                                  handleDelete(item.id)
                                })
                              }}
                              disabled={isPending}
                            >
                              Hapus
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
