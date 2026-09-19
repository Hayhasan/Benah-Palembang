"use client"

import { useState } from "react"
import type { KeyboardEvent, ChangeEvent } from "react"
import { X } from "lucide-react"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"

interface TagInputProps {
    tags: string[]
    setTags: (tags: string[]) => void
    placeholder?: string
    disabled?: boolean
    prefix?: string
    allowSpaces?: boolean
}

export function TagInput({
    tags,
    setTags,
    placeholder = "Ketik tag lalu pisahkan dengan spasi atau koma",
    disabled = false,
    prefix = "#",
    allowSpaces = false,
}: TagInputProps) {
    const [inputValue, setInputValue] = useState("")

    const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
        if (disabled) return
        const isDelimiter =
            e.key === "Enter" || e.key === "," || (!allowSpaces && e.key === " ")
        if (isDelimiter) {
            e.preventDefault()
            const newTag = inputValue.trim().replace(/,/g, "")
            
            if (newTag && !tags.includes(newTag)) {
                setTags([...tags, newTag])
            }
            setInputValue("")
        } else if (e.key === "Backspace" && inputValue === "" && tags.length > 0) {
            // Remove last tag if backspace is pressed on empty input
            e.preventDefault()
            const newTags = [...tags]
            newTags.pop()
            setTags(newTags)
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (!disabled) {
            setInputValue(e.target.value)
        }
    }

    const removeTag = (tagToRemove: string) => {
        if (!disabled) {
            setTags(tags.filter(tag => tag !== tagToRemove))
        }
    }

    return (
        <div className="flex flex-col gap-2">
            <div className="flex flex-wrap gap-2">
                {tags.map((tag, index) => (
                    <Badge key={index} variant="secondary" className="px-2.5 py-1 gap-1.5 flex items-center bg-black text-white hover:bg-black/90 dark:bg-zinc-900 dark:text-white border-none rounded-[3px] text-xs font-medium">
                        {prefix}{tag}
                        {!disabled && (
                            <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="hover:bg-white/20 text-white rounded-full p-0.5 focus:outline-none transition-colors"
                            >
                                <X className="size-3" />
                            </button>
                        )}
                    </Badge>
                ))}
                {tags.length === 0 && disabled && (
                    <span className="text-xs text-muted-foreground italic">Tidak ada tag</span>
                )}
            </div>
            {!disabled && (
                <>
                    <Input 
                        value={inputValue}
                        onChange={handleChange}
                        onKeyDown={handleKeyDown}
                        placeholder={tags.length === 0 ? placeholder : "Tambah hashtag lagi..."}
                        className="w-full"
                    />
                    <p className="text-xs text-muted-foreground mt-1">Tekan spasi, koma, atau Enter untuk menambahkan tag baru.</p>
                </>
            )}
        </div>
    )
}