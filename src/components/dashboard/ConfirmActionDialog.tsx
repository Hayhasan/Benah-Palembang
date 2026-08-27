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

interface ConfirmActionDialogProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    description: string
    confirmText?: string
    cancelText?: string
    variant?: "destructive" | "default"
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
    onConfirm,
}: ConfirmActionDialogProps) {
    return (
        <AlertDialog open={open} onOpenChange={onOpenChange}>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>{title}</AlertDialogTitle>
                    <AlertDialogDescription>{description}</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={() => onOpenChange(false)}>
                        {cancelText}
                    </AlertDialogCancel>
                    <AlertDialogAction
                        variant={variant}
                        onClick={() => {
                            onConfirm()
                            onOpenChange(false)
                        }}
                    >
                        {confirmText}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    )
}