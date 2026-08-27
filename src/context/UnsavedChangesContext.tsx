"use client"

import { useNavigate } from "@/lib/navigation"
import React, { createContext, useContext, useState, useRef, useEffect, useCallback } from "react"
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { AlertCircle, Save } from "lucide-react"

type SaveHandler = () => Promise<boolean | void> | boolean | void

interface UnsavedChangesContextType {
    isDirty: boolean
    setIsDirty: (dirty: boolean) => void
    registerSaveHandler: (fn: SaveHandler | null) => void
    requestNavigation: (to: string | number, callback?: () => void) => void
}

const UnsavedChangesContext = createContext<UnsavedChangesContextType | null>(null)

export function UnsavedChangesProvider({ children }: { children: React.ReactNode }) {
    const navigate = useNavigate()
    const [isDirty, setIsDirty] = useState(false)
    const [dialogOpen, setDialogOpen] = useState(false)
    const [pendingNav, setPendingNav] = useState<{ to: string | number; callback?: () => void } | null>(null)
    const saveHandlerRef = useRef<SaveHandler | null>(null)

    const registerSaveHandler = useCallback((fn: SaveHandler | null) => {
        saveHandlerRef.current = fn
    }, [])

    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault()
                e.returnValue = ""
            }
        }
        window.addEventListener("beforeunload", handleBeforeUnload)
        return () => window.removeEventListener("beforeunload", handleBeforeUnload)
    }, [isDirty])

    const requestNavigation = useCallback((to: string | number, callback?: () => void) => {
        if (!isDirty) {
            if (callback) {
                callback()
            } else if (typeof to === "number") {
                navigate(to)
            } else {
                navigate(to)
            }
            return
        }

        setPendingNav({ to, callback })
        setDialogOpen(true)
    }, [isDirty, navigate])

    const handleSaveAndLeave = async () => {
        if (saveHandlerRef.current) {
            try {
                const res = await saveHandlerRef.current()
                if (res === false) {
                    return // Validation failed
                }
            } catch (err) {
                console.error("Save error:", err)
                return
            }
        }
        setIsDirty(false)
        setDialogOpen(false)
        if (pendingNav) {
            if (pendingNav.callback) {
                pendingNav.callback()
            } else if (typeof pendingNav.to === "number") {
                navigate(pendingNav.to)
            } else {
                navigate(pendingNav.to)
            }
            setPendingNav(null)
        }
    }

    const handleDiscardAndLeave = () => {
        setIsDirty(false)
        setDialogOpen(false)
        if (pendingNav) {
            if (pendingNav.callback) {
                pendingNav.callback()
            } else if (typeof pendingNav.to === "number") {
                navigate(pendingNav.to)
            } else {
                navigate(pendingNav.to)
            }
            setPendingNav(null)
        }
    }

    const handleCancel = () => {
        setDialogOpen(false)
        setPendingNav(null)
    }

    return (
        <UnsavedChangesContext.Provider
            value={{
                isDirty,
                setIsDirty,
                registerSaveHandler,
                requestNavigation,
            }}
        >
            {children}

            <AlertDialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <AlertDialogContent className="sm:max-w-[480px]">
                    <AlertDialogHeader className="sm:text-left">
                        <div className="flex items-center gap-2.5 text-amber-600 font-semibold text-sm mb-1 bg-amber-50 px-3 py-1.5 rounded-lg w-fit border border-amber-200">
                            <AlertCircle className="size-4 shrink-0 text-amber-600" />
                            Peringatan Perubahan Belum Disimpan
                        </div>
                        <AlertDialogTitle className="text-xl font-bold font-display text-foreground mt-1">
                            Pekerjaan Belum Tersimpan
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-sm text-muted-foreground mt-2 leading-relaxed">
                            Ada data atau teks pekerjaan yang sedang Anda ubah dan belum disimpan. Apakah Anda ingin menyimpan pekerjaan sekarang atau mengabaikannya sebelum berpindah menu?
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter className="flex-col-reverse sm:flex-row gap-2 mt-5">
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={handleCancel}
                            className="w-full sm:w-auto"
                        >
                            Batal
                        </Button>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={handleDiscardAndLeave}
                            className="w-full sm:w-auto text-muted-foreground hover:text-red-600 hover:border-red-200 hover:bg-red-50"
                        >
                            Abaikan
                        </Button>
                        <Button
                            type="button"
                            onClick={handleSaveAndLeave}
                            className="w-full sm:w-auto bg-palembang-red text-white hover:bg-palembang-red/90 font-semibold"
                        >
                            <Save className="size-4 mr-1.5" /> Simpan Sekarang
                        </Button>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </UnsavedChangesContext.Provider>
    )
}


export function useUnsavedChanges() {
    const context = useContext(UnsavedChangesContext)
    if (!context) {
        return {
            isDirty: false,
            setIsDirty: () => {},
            registerSaveHandler: () => {},
            requestNavigation: (to: string | number) => {
                if (typeof window !== "undefined") {
                    if (typeof to === "string") window.location.href = to
                }
            },
        }
    }
    return context
}