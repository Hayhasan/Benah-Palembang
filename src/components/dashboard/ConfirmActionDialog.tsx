"use client"

import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"

import { Loader2 } from "lucide-react"

interface ConfirmActionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "destructive" | "default"
    isLoading?: boolean
    onConfirm: () => void
}

export function ConfirmActionDialog({
    open,
    onOpenChange,
    title,
    description,
    confirmText = "Ya, Lanjutkan",
    cancelText = "Batal",
    variant = "destructive",
    isLoading = false,
    onConfirm,
}: ConfirmActionDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2">
                    <AlertDialogCancel
                        onClick={() => onOpenChange(false)}
                        disabled={isLoading}
                        className="w-full sm:w-auto min-h-[44px] active:scale-[0.98] mt-0"
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant={variant}
                        disabled={isLoading}
                        onClick={(e) => {
                            e.preventDefault()
                            onConfirm()
                        }}
                        className="w-full sm:w-auto min-h-[44px] active:scale-[0.98]"
                    >
                        {isLoading ? <Loader2 className="mr-2 size-4 animate-spin" /> : null}
                        {isLoading ? "Memproses..." : confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}