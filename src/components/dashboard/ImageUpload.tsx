"use client"

import { useRef, useState, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { UploadCloud, X, Image as ImageIcon, Crop } from "lucide-react"
import ReactCrop, { type Crop as CropType, centerCrop, makeAspectCrop } from "react-image-crop"
import "react-image-crop/dist/ReactCrop.css"


interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    placeholder?: string
    className?: string
    aspect?: number // e.g. 16/9, 1, 4/3
    defaultImage?: string
    disabled?: boolean
}

function getCroppedImg(image: HTMLImageElement, crop: CropType): Promise<string> {
    const canvas = document.createElement("canvas")
    const scaleX = image.naturalWidth / image.width
    const scaleY = image.naturalHeight / image.height
    canvas.width = crop.width * scaleX
    canvas.height = crop.height * scaleY
    const ctx = canvas.getContext("2d")
    if (!ctx) return Promise.resolve("")
    ctx.drawImage(
        image,
        crop.x * scaleX,
        crop.y * scaleY,
        crop.width * scaleX,
        crop.height * scaleY,
        0, 0,
        crop.width * scaleX,
        crop.height * scaleY,
    )
    return new Promise(resolve => {
        canvas.toBlob(blob => {
            if (blob) resolve(URL.createObjectURL(blob))
            else resolve("")
        }, "image/jpeg", 0.92)
    })
}

function centerAspectCrop(mediaWidth: number, mediaHeight: number, aspect: number) {
    return centerCrop(
        makeAspectCrop({ unit: "%", width: 90 }, aspect, mediaWidth, mediaHeight),
        mediaWidth, mediaHeight,
    )
}

export function ImageUpload({ value, onChange, placeholder = "Klik untuk upload gambar...", className = "", aspect, defaultImage, disabled = false }: ImageUploadProps) {
    const fileInputRef = useRef<HTMLInputElement>(null)
    const imgRef = useRef<HTMLImageElement>(null)

    const [showCropModal, setShowCropModal] = useState(false)
    const [rawImageUrl, setRawImageUrl] = useState("")
    const [crop, setCrop] = useState<CropType>()
    const [completedCrop, setCompletedCrop] = useState<CropType>()

    const displayValue = value || defaultImage || ""

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (disabled) return
        const file = e.target.files?.[0]
        if (file) {
            const url = URL.createObjectURL(file)
            setRawImageUrl(url)
            setShowCropModal(true)
        }
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    const onImageLoad = useCallback((e: React.SyntheticEvent<HTMLImageElement>) => {
        const { width, height } = e.currentTarget
        const cropAspect = aspect || 16 / 9
        setCrop(centerAspectCrop(width, height, cropAspect))
    }, [aspect])

    const handleCropDone = async () => {
        if (completedCrop && imgRef.current) {
            const croppedUrl = await getCroppedImg(imgRef.current, completedCrop)
            if (croppedUrl) onChange(croppedUrl)
        }
        setShowCropModal(false)
        setRawImageUrl("")
    }

    const handleSkipCrop = () => {
        onChange(rawImageUrl)
        setShowCropModal(false)
        setRawImageUrl("")
    }

    const handleRemove = (e: React.MouseEvent) => {
        if (disabled) return
        e.stopPropagation()
        onChange("")
        if (fileInputRef.current) fileInputRef.current.value = ""
    }

    return (
        <>
            <div className={`w-full ${className}`}>
                <input type="file" accept="image/*" ref={fileInputRef} onChange={handleFileChange} className="hidden" />
                
                {displayValue ? (
                    <div className="relative group w-full h-48 border rounded-md overflow-hidden bg-muted/20">
                        <img src={displayValue} alt="Preview" className="w-full h-full object-cover" />
                        {!value && defaultImage && (
                            <div className="absolute top-2 left-2">
                                <span className="text-[10px] bg-black/50 text-white px-2 py-0.5 rounded-full">Default</span>
                            </div>
                        )}
                        {!disabled && (
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                <Button type="button" variant="secondary" size="sm" onClick={() => fileInputRef.current?.click()}>
                                    <UploadCloud className="size-4 mr-2" /> Ganti Gambar
                                </Button>
                                {value && (
                                    <Button type="button" variant="destructive" size="icon" onClick={handleRemove}>
                                        <X className="size-4" />
                                    </Button>
                                )}
                            </div>
                        )}
                    </div>
                ) : (
                    <button
                        type="button"
                        disabled={disabled}
                        onClick={() => fileInputRef.current?.click()}
                        className={`w-full h-32 border-2 border-dashed rounded-md flex flex-col items-center justify-center text-muted-foreground transition-colors ${
                            disabled ? "cursor-not-allowed opacity-50 bg-muted/10" : "hover:bg-muted/50 hover:text-foreground hover:border-muted-foreground"
                        }`}
                    >
                        <ImageIcon className="size-8 mb-2 opacity-50" />
                        <span className="text-sm font-medium">{disabled ? "Tidak ada gambar" : placeholder}</span>
                        {!disabled && <span className="text-xs mt-1 opacity-70">JPG, PNG, atau WEBP</span>}
                    </button>
                )}
            </div>

            {/* Crop Modal */}
            {showCropModal && (
                <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 backdrop-blur-sm p-4" onClick={() => setShowCropModal(false)}>
                    <div className="bg-background rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-auto p-6 space-y-4" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between">
                            <h3 className="font-semibold text-lg flex items-center gap-2"><Crop className="size-5" /> Crop Gambar</h3>
                            <Button variant="ghost" size="icon" onClick={() => { setShowCropModal(false); setRawImageUrl("") }}><X className="size-4" /></Button>
                        </div>
                        <p className="text-sm text-muted-foreground">Sesuaikan area gambar yang ingin ditampilkan. Anda bisa melewati tahap ini jika tidak perlu crop.</p>
                        <div className="flex items-center justify-center bg-muted/30 rounded-lg overflow-hidden">
                            <ReactCrop crop={crop} onChange={c => setCrop(c)} onComplete={c => setCompletedCrop(c)} aspect={aspect}>
                                <img ref={imgRef} src={rawImageUrl} alt="Crop Preview" onLoad={onImageLoad} className="max-h-[60vh]" />
                            </ReactCrop>
                        </div>
                        <div className="flex justify-end gap-3 pt-2">
                            <Button variant="outline" onClick={handleSkipCrop}>Lewati Crop</Button>
                            <Button onClick={handleCropDone} className="bg-palembang-red text-white hover:bg-palembang-red/90">Terapkan Crop</Button>
                        </div>
                    </div>
                </div>
            )}
        </>
    )
}